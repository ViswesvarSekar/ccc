
/**
 * CategoricalAbstract is the base class for all categorical or timeseries
 */
pvc.CategoricalAbstract = pvc.CartesianAbstract.extend({

    constructor: function(options){
        
        this.base(options);

        var parent = this.parent;
        if(parent) {
            this._catRole = parent._catRole;
        }
    },
    
    /**
     * Initializes each chart's specific roles.
     * @override
     */
    _initVisualRoles: function(){
        
        this.base();
      
        var catRoleSpec = this._getCategoryRoleSpec() || 
                          def.fail.operationInvalid("Must define the category role.");
        
        this._addVisualRoles({category: catRoleSpec});

        // ---------
        // Cached
        this._catRole = this.visualRoles('category');
    },
    
    _getCategoryRoleSpec: function(){
        return { 
            isRequired: true, 
            defaultDimensionName: 'category*', 
            autoCreateDimension: true 
        };
    },
    
    _generateTrendsDataCellCore: function(newDatums, dataCell, trendInfo){
        var serRole = this._serRole;
        var xRole   = this._catRole;
        var yRole   = dataCell.role;
        
        this._warnSingleContinuousValueRole(yRole);
        
        var dataPartDimName = this._dataPartRole.firstDimensionName();
        var yDimName = yRole.firstDimensionName();
        var xDimName;
        var isXDiscrete = xRole.isDiscrete();
        if(!isXDiscrete){
            xDimName = xRole.firstDimensionName();
        }
        
        var sumKeyArgs = { zeroIfNone: false };
        var ignoreNullsKeyArgs = {ignoreNulls: false};
                
        // Visible data grouped by category and then series
        var data = this._getVisibleData(dataCell.dataPartValue);
        
        // TODO: It is usually the case, but not certain, that the base axis' 
        // dataCell(s) span "all" data parts.
        // The data that will be shown in the base scale...
        // Ideally the base scale would already be set up...
        var allPartsData   = this._getVisibleData(null, ignoreNullsKeyArgs);
        var allCatDataRoot = allPartsData.flattenBy(xRole, ignoreNullsKeyArgs);
        var allCatDatas    = allCatDataRoot._children;
        
        // For each series...
        def
        .scope(function(){
            return (serRole && serRole.isBound())   ?
                   data.flattenBy(serRole).children() : // data already only contains visible data
                   def.query([null]) // null series
                   ;
        })
        .each(genSeriesTrend, this);
          
        function genSeriesTrend(serData1){
            var funX = isXDiscrete ? 
                       null : // means: "use *index* as X value"
                       function(allCatData){
                           return allCatData.atoms[xDimName].value;
                       };
                       
            var funY = function(allCatData){
                var group = data._childrenByKey[allCatData.key];
                if(group && serData1){
                    group = group._childrenByKey[serData1.key];
                }
                
                // When null, the data point ends up being ignored
                return group ? group.dimensions(yDimName).sum(sumKeyArgs) : null;
            };
            
            var trendModel = trendInfo.model(def.query(allCatDatas), funX, funY);
            if(trendModel){
                // At least one point...
                // Sample the line on each x and create a datum for it
                // on the 'trend' data part
                allCatDatas.forEach(function(allCatData, index){
                    var trendX = isXDiscrete ? 
                                 index :
                                 allCatData.atoms[xDimName].value;
                    
                    var trendY = trendModel.sample(trendX);
                    
                    var catData   = data._childrenByKey[allCatData.key];
                    var efCatData = catData || allCatData;
                    
                    var atoms;
                    var proto = catData;
                    if(serData1){
                        var catSerData = catData && 
                                         catData._childrenByKey[serData1.key];
                        
                        if(catSerData){
                            atoms = Object.create(catSerData._datums[0].atoms);
                        } else {
                            // Missing data point
                            atoms = Object.create(efCatData._datums[0].atoms);
                            
                            // Now copy series atoms
                            def.copyOwn(atoms, serData1.atoms);
                        }
                    } else {
                        // Series is unbound
                        atoms = Object.create(efCatData._datums[0].atoms);
                    }
                    
                    atoms[yDimName] = trendY;
                    atoms[dataPartDimName] = trendInfo.dataPartAtom;
                    
                    var newDatum = new pvc.data.Datum(efCatData.owner, atoms);
                    newDatum.isVirtual = true;
                    newDatum.isTrend   = true;
                    newDatum.trendType = trendInfo.type;
                    
                    newDatums.push(newDatum);
                }, this);
            }
        }
    },
    
    _interpolateDataCell: function(dataCell){
        var nullInterpMode = dataCell.nullInterpolationMode;
        if(nullInterpMode){
            var InterpType;
            switch(dataCell.nullInterpolationMode){
                case 'linear': InterpType = pvc.data.LinearInterpolationOper; break;
                case 'zero':   InterpType = pvc.data.ZeroInterpolationOper;   break;
                case 'none':   break;
                default: throw def.error.argumentInvalid('nullInterpolationMode', '' + nullInterpMode);
            }
        
            if(InterpType){
                this._warnSingleContinuousValueRole(dataCell.role);
                
                // TODO: It is usually the case, but not certain, that the base axis' 
                // dataCell(s) span "all" data parts.
                var allPartsData = this._getVisibleData(null, {ignoreNulls: false});
                var visibleData = this._getVisibleData(dataCell.dataPartValue);
                
                new InterpType(
                     allPartsData,
                     visibleData, 
                     this._catRole,
                     this._serRole,
                     dataCell.role,
                     true) // dataCell.isStacked
                .interpolate();
            }
        }
    },
    
    /**
     * @override
     */
    _createVisibleData: function(dataPartValue, keyArgs){
        var serGrouping = this._serRole && this._serRole.flattenedGrouping();
        var catGrouping = this._catRole.flattenedGrouping();
        var partData    = this.partData(dataPartValue);
        
        var ignoreNulls = def.get(keyArgs, 'ignoreNulls');
        
        // Allow for more caching when isNull is null
        var groupKeyArgs = { visible: true, isNull: ignoreNulls ? false : null};
        
        return serGrouping ?
               // <=> One multi-dimensional, two-levels data grouping
               partData.groupBy([catGrouping, serGrouping], groupKeyArgs) :
               partData.groupBy(catGrouping, groupKeyArgs);
    },
    
    /**
     * Obtains the extent of the specified value axis' role
     * and data part values.
     *
     * <p>
     * Takes into account that values are shown grouped per category.
     * </p>
     *
     * <p>
     * The fact that values are stacked or not, per category,
     * is also taken into account.
     * Each data part can have its own stacking.
     * </p>
     *
     * <p>
     * When more than one datum exists per series <i>and</i> category,
     * the sum of its values is considered.
     * </p>
     *
     * @param {pvc.visual.CartesianAxis} valueAxis The value axis.
     * @param {pvc.visual.Role} valueDataCell The data cell.
     * @type object
     *
     * @override
     */
    _getContinuousVisibleCellExtent: function(valueAxis, valueDataCell){
        var valueRole = valueDataCell.role;
        
        switch(valueRole.name){
            case 'series':// (series throws in base)
            case 'category':
                /* Special case.
                 * The category role's single dimension belongs to the grouping dimensions of data.
                 * As such, the default method is adequate
                 * (gets the extent of the value dim on visible data).
                 *
                 * Continuous baseScale's, like timeSeries go this way.
                 */
                return this.base(valueAxis, valueDataCell);
        }
        
        this._warnSingleContinuousValueRole(valueRole);
        
        var dataPartValue = valueDataCell.dataPartValue;
        var valueDimName = valueRole.firstDimensionName();
        var data = this._getVisibleData(dataPartValue);
        var useAbs = valueAxis.scaleUsesAbs();
        
        if(valueAxis.type !== 'ortho' || !valueDataCell.isStacked){
            return data.leafs()
                       .select(function(serGroup){
                           var value = serGroup.dimensions(valueDimName).sum();
                           return useAbs && value < 0 ? -value : value;
                        })
                       .range();
        }

        /*
         * data is grouped by category and then by series
         * So direct childs of data are category groups
         */
        return data.children()
            /* Obtain the value extent of each category */
            .select(function(catGroup){
                var range = this._getStackedCategoryValueExtent(catGroup, valueDimName, useAbs);
                if(range){
                    return {range: range, group: catGroup};
                }
            }, this)
            .where(def.notNully)

            /* Combine the value extents of all categories */
            .reduce(function(result, rangeInfo){
                return this._reduceStackedCategoryValueExtent(
                            result,
                            rangeInfo.range,
                            rangeInfo.group);
            }.bind(this), null);

//        The following would not work:
//        var max = data.children()
//                    .select(function(catGroup){ return catGroup.dimensions(valueDimName).sum(); })
//                    .max();
//
//        return max != null ? {min: 0, max: max} : null;
    },

    /**
     * Obtains the extent of a value dimension in a given category group.
     * The default implementation determines the extent by separately
     * summing negative and positive values.
     * Supports {@link #_getContinuousVisibleExtent}.
     */
    _getStackedCategoryValueExtent: function(catGroup, valueDimName, useAbs){
        var posSum = null,
            negSum = null;

        catGroup
            .children()
            /* Sum all datum's values on the same leaf */
            .select(function(serGroup){
                var value = serGroup.dimensions(valueDimName).sum();
                return useAbs && value < 0 ? -value : value;
            })
            /* Add to positive or negative totals */
            .each(function(value){
                // Note: +null === 0
                if(value != null){
                    if(value >= 0){
                        posSum += value;
                    } else {
                        negSum += value;
                    }
                }
            });

        if(posSum == null && negSum == null){
            return null;
        }

        return {max: posSum || 0, min: negSum || 0};
    },
    
    /**
     * Reduce operation of category ranges, into a global range.
     *
     * The default implementation performs a range "union" operation.
     *
     * Supports {@link #_getContinuousVisibleExtent}.
     */
    _reduceStackedCategoryValueExtent: function(result, catRange, catGroup){
        return pvc.unionExtents(result, catRange);
    },
    
    _coordinateSmallChartsLayout: function(childCharts, scopesByType){
        // TODO: optimize the case were 
        // the title panels have a fixed size and
        // the x and y FixedMin and FixedMax are all specified...
        // Don't need to coordinate in that case.
        
        this.base(childCharts, scopesByType);
        
        // Force layout and retrieve sizes of
        // * title panel
        // * y panel if column or global scope (column scope coordinates x scales, but then the other axis' size also affects the layout...)
        // * x panel if row    or global scope
        var titleSizeMax  = 0;
        var titleOrthoLen;
        
        var axisIds = null;
        var sizesMaxByAxisId = {}; // {id:  {axis: axisSizeMax, title: titleSizeMax} }
        
        // Calculate maximum sizes
        childCharts.forEach(function(childChart){
            
            childChart.basePanel.layout();
            
            var size;
            var panel = childChart.titlePanel;
            if(panel){
                if(!titleOrthoLen){
                    titleOrthoLen = panel.anchorOrthoLength();
                }
                
                size = panel[titleOrthoLen];
                if(size > titleSizeMax){
                    titleSizeMax = size;
                }
            }
            
            // ------
            
            var axesPanels = childChart.axesPanels;
            if(!axisIds){
                axisIds = 
                    def
                    .query(def.ownKeys(axesPanels))
                    .where(function(alias){ 
                        return alias === axesPanels[alias].axis.id; 
                    })
                    .select(function(id){
                        // side effect
                        sizesMaxByAxisId[id] = {axis: 0, title: 0};
                        return id;
                    })
                    .array();
            }
            
            axisIds.forEach(function(id){
                var axisPanel = axesPanels[id];
                var sizes = sizesMaxByAxisId[id];
                
                var ol = axisPanel.axis.orientation === 'x' ? 'height' : 'width';
                size = axisPanel[ol];
                if(size > sizes.axis){
                    sizes.axis = size;
                }
                
                var titlePanel = axisPanel.titlePanel;
                if(titlePanel){
                    size = titlePanel[ol];
                    if(size > sizes.title){
                        sizes.title = size;
                    }
                }
            });
        }, this);
        
        // Apply the maximum sizes to the corresponding panels
        childCharts.forEach(function(childChart){
            
            if(titleSizeMax > 0){
                var panel  = childChart.titlePanel;
                panel.size = panel.size.clone().set(titleOrthoLen, titleSizeMax);
            }
            
            // ------
            
            var axesPanels = childChart.axesPanels;
            axisIds.forEach(function(id){
                var axisPanel = axesPanels[id];
                var sizes = sizesMaxByAxisId[id];
                
                var ol = axisPanel.axis.orientation === 'x' ? 'height' : 'width';
                axisPanel.size = axisPanel.size.clone().set(ol, sizes.axis);

                var titlePanel = axisPanel.titlePanel;
                if(titlePanel){
                    titlePanel.size = titlePanel.size.clone().set(ol, sizes.title);
                }
            });
            
            // Invalidate their previous layout
            childChart.basePanel.invalidateLayout();
        }, this);
    },
    
    markEventDefaults: {
        strokeStyle: "#5BCBF5",  /* Line Color */
        lineWidth: "0.5",  /* Line Width */
        textStyle: "#5BCBF5", /* Text Color */
        verticalOffset: 10, /* Distance between vertical anchor and label */
        verticalAnchor: "bottom", /* Vertical anchor: top or bottom */
        horizontalAnchor: "right", /* Horizontal anchor: left or right */
        forceHorizontalAnchor: false, /* Horizontal anchor position will be respected if true */
        horizontalAnchorSwapLimit: 80 /* Horizontal anchor will switch if less than this space available */
    },
    
    // TODO: chart orientation?
    markEvent: function(dateString, label, options){

        var baseScale = this.axes.base.scale;
        
        if(baseScale.type !== 'timeSeries'){
            pvc.log("Attempting to mark an event on a non timeSeries chart");
            return;
        }

        var o = $.extend({}, this.markEventDefaults, options);
        
        // TODO: format this using dimension formatter...
        
        // Are we outside the allowed scale?
        var d = pv.Format.date(this.options.timeSeriesFormat).parse(dateString);
        var dpos = baseScale(d),
            range = baseScale.range();
        
        if( dpos < range[0] || dpos > range[1]){
            pvc.log("Event outside the allowed range, returning");
            return;
        }

        // Add the line

        var panel = this._mainContentPanel.pvPanel;
        var h = this.yScale.range()[1];

        // Detect where to place the horizontalAnchor
        //var anchor = o.horizontalAnchor;
        if( !o.forceHorizontalAnchor ){
            var availableSize = o.horizontalAnchor == "right"? range[1]- dpos : dpos;
            
            // TODO: Replace this availableSize condition with a check for the text size
            if (availableSize < o.horizontalAnchorSwapLimit ){
                o.horizontalAnchor = o.horizontalAnchor == "right" ? "left" : "right";
            }
        }

        var line = panel.add(pv.Line)
            .data([0,h])
            .strokeStyle(o.strokeStyle)
            .lineWidth(o.lineWidth)
            .bottom(function(d){
                return d;
            })
            .left(dpos);

        //var pvLabel = 
        line.anchor(o.horizontalAnchor)
            .top(o.verticalAnchor == "top" ? o.verticalOffset : (h - o.verticalOffset))
            .add(pv.Label)
            .text(label)
            .textStyle(o.textStyle)
            .visible(function(){
                return !this.index;
            });
        
        return this;
    },
    
    defaults: def.create(pvc.CartesianAbstract.prototype.defaults, {
     // Ortho <- value role
        // TODO: this should go somewhere else
        orthoAxisOrdinal: false // when true => ortho axis gets the series role (instead of the value role)
    })
});
