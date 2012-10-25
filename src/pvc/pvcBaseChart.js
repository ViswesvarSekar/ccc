/**
 * The main chart component
 */
pvc.BaseChart = pvc.Abstract.extend({
    /**
     * Indicates if the chart has been disposed.
     */
    _disposed: false,
    
    _updateSelectionSuspendCount: 0,
    _selectionNeedsUpdate:   false,
    
    /**
     * The chart's parent chart.
     * 
     * <p>
     * The root chart has null as the value of its parent property.
     * </p>
     * 
     * @type pvc.BaseChart
     */
    parent: null,
    
    /**
     * The chart's root chart.
     * 
     * <p>
     * The root chart has itself as the value of the root property.
     * </p>
     * 
     * @type pvc.BaseChart
     */
    root: null,
    
    /**
     * A map of {@link pvc.visual.Axis} by axis id.
     */
    axes: null,
    axesList: null,
    axesByType: null,
    
    /**
     * A map of {@link pvc.visual.Role} by name.
     * 
     * @type object
     */
    _visualRoles: null,

    _serRole: null,
    _dataPartRole: null,
    
    /**
     * An array of the {@link pvc.visual.Role} that are measures.
     * 
     * @type pvc.visual.Role[]
     */
    _measureVisualRoles: null,
    
    /**
     * Indicates if the chart has been pre-rendered.
     * <p>
     * This field is set to <tt>false</tt>
     * at the beginning of the {@link #_preRender} method
     * and set to <tt>true</tt> at the end.
     * </p>
     * <p>
     * When a chart is re-rendered it can, 
     * optionally, also repeat the pre-render phase. 
     * </p>
     * 
     * @type boolean
     */
    isPreRendered: false,

    /**
     * The version value of the current/last creation.
     * 
     * <p>
     * This value is changed on each pre-render of the chart.
     * It can be useful to invalidate cached information that 
     * is only valid for each creation.
     * </p>
     * <p>
     * Version values can be compared using the identity operator <tt>===</tt>.
     * </p>
     * 
     * @type any
     */
    _createVersion: 0,
    
    /**
     * A callback function that is called 
     * when the protovis' panel render is about to start.
     * 
     * <p>
     * Note that this is <i>after</i> the pre-render phase.
     * </p>
     * 
     * <p>
     * The callback is called with no arguments, 
     * but having the chart instance as its context (<tt>this</tt> value). 
     * </p>
     * 
     * @function
     */
    renderCallback: undefined,

    /**
     * The data that the chart is to show.
     * @type pvc.data.Data
     */
    dataEngine: null,
    data: null,
    
    /**
     * The resulting data of 
     * grouping {@link #data} by the data part role, 
     * when bound.
     * 
     * @type pvc.data.Data
     */
    _partData: null,

    /**
     * The data source of the chart.
     * <p>
     * The {@link #data} of a root chart 
     * is loaded with the data in this array.
     * </p>
     * @type any[]
     */
    resultset: [],
    
    /**
     * The meta-data that describes each 
     * of the data components of {@link #resultset}.
     * @type any[]
     */
    metadata: [],

    /**
     * The base panel is the root container of a chart.
     * <p>
     * The base panel of a <i>root chart</i> is the top-most root container.
     * It has {@link pvc.BasePanel#isTopRoot} equal to <tt>true</tt>.
     * </p>
     * <p>
     * The base panel of a <i>non-root chart</i> is the root of the chart's panels,
     * but is not the top-most root panel, over the charts hierarchy.
     * </p>
     * 
     * @type pvc.BasePanel
     */
    basePanel:   null,
    
    /**
     * The panel that shows the chart's title.
     * <p>
     * This panel is the first child of {@link #basePanel} to be created.
     * It is only created when the chart has a non-empty title.
     * </p>
     * <p>
     * Being the first child causes it to occupy the 
     * whole length of the side of {@link #basePanel} 
     * to which it is <i>docked</i>.
     * </p>
     * 
     * @type pvc.TitlePanel
     */
    titlePanel:  null,
    
    /**
     * The panel that shows the chart's main legend.
     * <p>
     * This panel is the second child of {@link #basePanel} to be created.
     * There is an option to not show the chart's legend,
     * in which case this panel is not created.
     * </p>
     * 
     * <p>
     * The current implementation of the legend panel
     * presents a <i>discrete</i> association of colors and labels.
     * </p>
     * 
     * @type pvc.LegendPanel
     */
    legendPanel: null,
    
    /**
     * The panel that hosts child chart's base panels.
     * 
     * @type pvc.MultiChartPanel
     */
    _multiChartPanel: null,

    /**
     * The name of the visual role that
     * the legend panel will be associated to.
     * 
     * <p>
     * The legend panel displays each distinct role value
     * with a marker and a label.
     * 
     * The marker's color is obtained from the parts color scales,
     * given the role's value.
     * </p>
     * <p>
     * The default dimension is the 'series' dimension.
     * </p>
     * 
     * @type string
     */
    legendSource: "series",
    
    /**
     * An array of colors, represented as names, codes or {@link pv.Color} objects
     * that is associated to each distinct value of the {@link #legendSource} dimension.
     * 
     * <p>
     * The legend panel associates each distinct dimension value to a color of {@link #colors},
     * following the dimension's natural order.
     * </p>
     * <p>
     * The default dimension is the 'series' dimension.
     * </p>
     * 
     * @type (string|pv.Color)[]
     */
    colors: null,
    secondAxisColor: null,
    
    /**
     * Contains the number of pages that a multi-chart contains
     * when rendered with the previous render options.
     * <p>
     * This property is updated after a render of a chart
     * where the visual role "multiChart" is assigned and
     * the option "multiChartPageIndex" has been specified. 
     * </p>
     * 
     * @type number|null
     */
    multiChartPageCount: null,
    
    /**
     * Contains the currently rendered multi-chart page index, 
     * relative to the previous render options.
     * <p>
     * This property is updated after a render of a chart
     * where the visual role "multiChart" is assigned and
     * the <i>option</i> "multiChartPageIndex" has been specified. 
     * </p>
     * 
     * @type number|null
     */
    multiChartPageIndex: null,
    
    /**
     * The options object specified by the user,
     * before any processing.
     */
    _initialOptions: null,
    
    _axisClassByType: {
        'color': pvc.visual.ColorAxis,
        'size':  pvc.visual.SizeAxis,
        'base':  pvc.visual.CartesianAxis,
        'ortho': pvc.visual.CartesianAxis
    },
    
    // 1 = root, 2 = leaf, 1 | 2 = 3 = everywhere
    _axisCreateWhere: {
        'color': 1,
        'size':  2,
        'base':  3,
        'ortho': 3
    },
    
    _axisCreationOrder: ['color', 'size', 'base', 'ortho'],
    
    constructor: function(options) {
        var parent = this.parent = def.get(options, 'parent') || null;
        
        this._initialOptions = options;
        
        /* DEBUG options */
        if(pvc.debug >= 3 && !parent && options){
            try {
                pvc.log("INITIAL OPTIONS:\n" + pvc.stringify(options));
            } catch(ex) {
                /* SWALLOW usually a circular JSON structure */
            }
        }
        
        if(parent) {
            // options != null
            this.root = parent.root;
            this.dataEngine =
            this.data = options.data ||
                        def.fail.argumentRequired('options.data');
            
            this.left = options.left;
            this.top  = options.top;
            this._visualRoles = parent._visualRoles;
            this._measureVisualRoles = parent._measureVisualRoles;

            if(parent._serRole) {
                this._serRole = parent._serRole;
            }

            if(parent._dataPartRole) {
                this._dataPartRole = parent._dataPartRole;
            }
            
        } else {
            this.root = this;
            
            this._visualRoles = {};
            this._measureVisualRoles = [];
        }
        
        this.options = def.mixin({}, this.defaults, options);
    },
    
    compatVersion: function(options){
        return (options || this.options).compatVersion;
    },
    
    /**
     * Building the visualization is made in 2 stages:
     * First, the {@link #_preRender} method prepares and builds 
     * every object that will be used.
     * 
     * Later the {@link #render} method effectively renders.
     */
    _preRender: function(keyArgs) {
        this._preRenderPhase1(keyArgs);
        this._preRenderPhase2(keyArgs);
    },
    
    _preRenderPhase1: function(keyArgs) {
        var options = this.options;
        
        /* Increment pre-render version to allow for cache invalidation  */
        this._createVersion++;
        
        this.isPreRendered = false;

        if(pvc.debug >= 3){
            pvc.log("Prerendering chart");
        }
        
        /* Any data exists or throws */
        this._checkNoData();
        
        if (!this.parent) {
            // Now's as good a time as any to completely clear out all
            //  tipsy tooltips
            pvc.removeTipsyLegends();
        }
        
        /* Options may be changed between renders */
        this._processOptions();
        
        /* Initialize root visual roles */
        if(!this.parent && this._createVersion === 1) {
            this._initVisualRoles();
            this._bindVisualRolesPre();
        }
        
        /* Initialize the data (and _bindVisualRoles) */
        this._initData(keyArgs);

        var hasMultiRole = this._isRoleAssigned('multiChart');
        
        /* Initialize plots */
        this._initPlots(hasMultiRole);
        
        /* Initialize axes */
        this.axes = {};
        this.axesList = [];
        this.axesByType = {};
        
        this._initAxes(hasMultiRole);
        this._bindAxes(hasMultiRole);
        
        /* Trends and Interpolatation */
        if(this.parent || !hasMultiRole){
            this._generateTrends(hasMultiRole);
            
            this._interpolate(hasMultiRole);
        }
        
        /* Set axes scales */
        this._setAxesScales(hasMultiRole);
    },
    
    _preRenderPhase2: function(keyArgs){
        var hasMultiRole = this._isRoleAssigned('multiChart');
        
        /* Initialize chart panels */
        this._initChartPanels(hasMultiRole);
        
        this.isPreRendered = true;
    },
    
    _checkNoData: function(){
        // Child charts are created to consume *existing* data
        if (!this.parent) {
            
            // If we don't have data, we just need to set a "no data" message
            // and go on with life.
            if(!this.allowNoData && this.resultset.length === 0) {
                /*global NoDataException:true */
                throw new NoDataException();
            }
        }
    },
    
    // --------------
    
    /**
     * Processes options after user options and defaults have been merged.
     * Applies restrictions,
     * performs validations and
     * options values implications.
     */
    _processOptions: function(){

        var options = this.options;
        
        this._processOptionsCore(options);
        
        /* DEBUG options */
        if(pvc.debug >= 3 && options && !this.parent){
            try {
                pvc.log("CURRENT OPTIONS:\n" + pvc.stringify(options));
            }catch(ex) {
                /* SWALLOW usually a circular JSON structure */
            }
        }
        
        this._processExtensionPoints();
        
        return options;
    },

    /**
     * Processes options after user options and default options have been merged.
     * Override to apply restrictions, perform validation or
     * options values implications.
     * When overriden, the base implementation should be called.
     * The implementation must be idempotent -
     * its successive application should yield the same results.
     * @virtual
     */
    _processOptionsCore: function(options){
        // Disable animation if environment doesn't support it
        if (!$.support.svg || pv.renderer() === 'batik') {
            options.animate = false;
        }
        
        if(options.showTooltips){
            var ts = options.tipsySettings;
            if(ts){
                this.extend(ts, "tooltip");
            }
        }
    },
    
    _initPlots: function(hasMultiRole){
        // reset plots
        if(!this.parent){
            this.plots = {};
            this.plotList = [];
            this.plotsByType = {};
            
            this._initPlotsCore(hasMultiRole);
        } else {
            var root = this.root;
            
            this.plots = root.plots;
            this.plotList = root.plotList;
            this.plotsByType = root.plotsByType;
        }
    },
    
    _initPlotsCore: function(hasMultiRole){
        // NOOP
    },

    _addPlot: function(plot){
        var plotsByType = this.plotsByType;
        var plots = this.plots;
        
        var plotType  = plot.type;
        var plotIndex = plot.index;
        var plotName  = plot.name;
        var plotId    = plot.id;
        
        if(plotName && def.hasOwn(plots, plotName)){
            throw def.error.operationInvalid("Plot name '{0}' already taken.", [plotName]);
        }
        
        if(def.hasOwn(plots, plotId)){
            throw def.error.operationInvalid("Plot id '{0}' already taken.", [plotId]);
        }
        
        var typePlots = def.array.lazy(plotsByType, plotType);
        if(def.hasOwn(typePlots, plotIndex)){
            throw def.error.operationInvalid("Plot index '{0}' of type '{1}' already taken.", [plotIndex, plotType]);
        }
        
        plot.globalIndex = this.plotList.length;
        typePlots[plotIndex] = plot;
        this.plotList.push(plot);
        plots[plotId] = plot;
        if(plotName){
            plots[plotName] = plot;
        }
    },
    
    // --------------
    
    _initAxes: function(hasMultiRole){
        
        // Clear any previous global color scales
        delete this._rolesColorScale;
        
        // type -> index -> [datacell array]
        // Used by sub classes.
        var dataCellsByAxisTypeThenIndex;
        if(!this.parent){
            dataCellsByAxisTypeThenIndex = {};
            
            this.plotList.forEach(function(plot){
                this._collectPlotAxesDataCells(plot, dataCellsByAxisTypeThenIndex);
            }, this);
            
        } else {
            dataCellsByAxisTypeThenIndex = this.root._dataCellsByAxisTypeThenIndex;
        }
        
        // Used later in _bindAxes as well.
        this._dataCellsByAxisTypeThenIndex = dataCellsByAxisTypeThenIndex;
        
        /* NOTE: Cartesian axes are created even when hasMultiRole && !parent
         * because it is needed to read axis options in the root chart.
         * Also binding occurs to be able to know its scale type. 
         * Yet, their scales are not setup at the root level.
         */
        
        // 1 = root, 2 = leaf, 1 | 2 = 3 = everywhere
        var here = 0;
        // Root?
        if(!this.parent){
            here |= 1;
        }
        // Leaf?
        if(this.parent || !hasMultiRole){
            here |= 2;
        }
        
        // Used later in _bindAxes as well.
        this._axisCreateHere = here;
        
        this._axisCreationOrder.forEach(function(type){
            // Create **here** ?
            if((this._axisCreateWhere[type] & here) !== 0){
                
                var dataCellsByAxisIndex = dataCellsByAxisTypeThenIndex[type];
                if(dataCellsByAxisIndex){
                    
                    var AxisClass = this._axisClassByType[type];
                    if(AxisClass){
                        dataCellsByAxisIndex.forEach(function(dataCells, axisIndex){
                            
                            new AxisClass(this, type, axisIndex);
                            
                        }, this);
                    }
                }
            }
        }, this);
        
        if(this.parent){
            // Copy axes that exist in root and not here
            this.root.axesList.forEach(function(axis){
                if(!def.hasOwn(this.axes, axis.id)){
                    this._addAxis(axis);
                }
            }, this);
        }
    },
    
    /**
     * Adds an axis to the chart.
     * 
     * @param {pvc.visual.Axis} axis The axis.
     *
     * @type pvc.visual.Axis
     */
    _addAxis: function(axis){
        
        this.axes[axis.id] = axis;
        if(axis.chart === this){
            axis.axisIndex = this.axesList.length;
        }
        
        this.axesList.push(axis);
        def.array.lazy(this.axesByType, axis.type)[axis.index] = axis;
        
        // For child charts, that simply copy color axes
        if(axis.type === 'color' && axis.isBound()){
            this._onColorAxisScaleSet(axis);
        }
        
        return this;
    },
    
    getAxis: function(type, index){
        var typeAxes = this.axesByType[type];
        if(typeAxes){
            return typeAxes[index];
        }
    },
    
    _collectPlotAxesDataCells: function(plot, dataCellsByAxisTypeThenIndex){
        /* Configure Color Axis Data Cell */
        if(plot.option.isDefined('ColorRole')){
            var colorRoleName = plot.option('ColorRole');
            if(colorRoleName){
                var colorDataCellsByAxisIndex = 
                    def
                    .array
                    .lazy(dataCellsByAxisTypeThenIndex, 'color');
                
                def
                .array
                .lazy(colorDataCellsByAxisIndex, plot.option('ColorAxis') - 1)
                .push({
                    plot: plot,
                    role: this.visualRoles(colorRoleName),
                    dataPartValue: plot.option('DataPart' )
                });
            }
        }
    },
    
    _bindAxes: function(hasMultiRole){
        // Bind all axes with dataCells registered in #_dataCellsByAxisTypeThenIndex
        // and which were created **here**
        
        var here = this._axisCreateHere;
        
        def
        .eachOwn(
            this._dataCellsByAxisTypeThenIndex, 
            function(dataCellsByAxisIndex, type){
                // Created **here** ?
                if((this._axisCreateWhere[type] & here) !== 0){
                    
                    dataCellsByAxisIndex.forEach(function(dataCells, index){
                        
                        var axisId = pvc.buildIndexedId(type, index);
                        var axis = this.axes[axisId];
                        if(!axis.isBound()){
                            axis.bind(dataCells);
                        }
                        
                    }, this);
                }
            }, 
            this);
    },
    
    _generateTrends: function(){
        if(this._dataPartRole){
            def
            .query(def.own(this.axes))
            .selectMany(function(axis){ return axis.dataCells; })
            .where(function(dataCell){
                var trendType = dataCell.trendType;
                return !!trendType && trendType !== 'none'; 
             })
             .distinct(function(dataCell){
                 return dataCell.role.name  + '|' +
                       (dataCell.dataPartValue || '');
             })
             .each(this._generateTrendsDataCell, this);
        }
    },
    
    _interpolate: function(){
        def
        .query(def.own(this.axes))
        .selectMany(function(axis){ return axis.dataCells; })
        .where(function(dataCell){
            var nim = dataCell.nullInterpolationMode;
            return !!nim && nim !== 'none'; 
         })
         .distinct(function(dataCell){
             return dataCell.role.name  + '|' +
                   (dataCell.dataPartValue || '');
         })
         .each(this._interpolateDataCell, this);
    },
    
    _interpolateDataCell: function(dataCell){
    },
    
    _generateTrendsDataCell: function(dataCell){
    },
    
    _setAxesScales: function(isMulti){
        if(!this.parent){
            var colorAxes = this.axesByType.color;
            if(colorAxes){
                colorAxes.forEach(function(axis){
                    if(axis.isBound()){
                        axis.calculateScale();
                        this._onColorAxisScaleSet(axis);
                    }
                }, this);
            }
        }
    },
    
    _onColorAxisScaleSet: function(axis){
        switch(axis.index){
            case 0:
                this.colors = axis.option('TransformedColors');
                break;
            
            case 1:
                this.secondAxisColor = axis.option('TransformedColors');
                break;
        }
    },
    
    _buildRolesDataCells: function(roleNames, dataCellBase){
        return def
            .query(roleNames)
            .select(function(roleName){
                var dataCell = dataCellBase ? Object.create(dataCellBase) : {};
                dataCell.role = def.string.is(roleName) ? this.visualRoles(roleName) : roleName;
                return dataCell;
            }, this)
            .array();
    },
    
    // ---------------
    
    /**
     * Obtains an unified color scale, 
     * of all the color axes with specified colors.
     * 
     * This color scale is used to satisfy axes
     * with non-specified colors.
     * 
     * Each color-role has a different unified color-scale,
     * in order that the color keys are of the same types.
     */
    _getRoleColorScale: function(roleName){
        return def.lazy(
            def.lazy(this, '_rolesColorScale'),
            roleName,
            this._createRoleColorScale, this);
    },
    
    _createRoleColorScale: function(roleName){
        var firstScale, scale;
        var valueToColorMap = {};
        
        this.axesByType.color.forEach(function(axis){
            // Only use color axes with specified Colors
            if(axis.role.name === roleName &&
              (axis.index === 0 || axis.option.isSpecified('Colors'))){
                
                scale = axis.scale;
                if(!firstScale){ firstScale = scale; }
                
                axis.domainValues.forEach(addDomainValue);
            }
        }, this);
        
        function addDomainValue(value){
            // First color wins
            var key = '' + value;
            if(!def.hasOwnProp.call(valueToColorMap, key)){
                valueToColorMap[key] = scale(value);
            }
        }
        
        if(!firstScale){
            return pvc.createColorScheme()();
        }
        
        scale = function(value){
            var key = '' + value;
            if(def.hasOwnProp.call(valueToColorMap, key)){
                return valueToColorMap[key];
            }
            
            // creates a new entry...
            var color = firstScale(value);
            valueToColorMap[key] = color;
            return color;
        };
        
        def.copy(scale, firstScale); // TODO: domain() and range() should be overriden...
        
        return scale; 
    },
    
    // ---------------
    
    _initChartPanels: function(hasMultiRole){
        /* Initialize chart panels */
        this._initBasePanel  ();
        this._initTitlePanel ();
        this._initLegendPanel();
        
        if(!this.parent && hasMultiRole) {
            this._initMultiChartPanel();
        } else {
            var options = this.options;
            this._preRenderContent({
                margins:           hasMultiRole ? options.smallContentMargins  : options.contentMargins,
                paddings:          hasMultiRole ? options.smallContentPaddings : options.contentPaddings,
                clickAction:       options.clickAction,
                doubleClickAction: options.doubleClickAction
            });
        }
    },
    
    /**
     * Override to create chart specific content panels here.
     * No need to call base.
     * 
     * @param {object} contentOptions Object with content specific options. Can be modified.
     * @param {pvc.Sides} [contentOptions.margins] The margins for the content panels. 
     * @param {pvc.Sides} [contentOptions.paddings] The paddings for the content panels.
     * 
     * @virtual
     */
    _preRenderContent: function(contentOptions){
        /* NOOP */
    },
    
    /**
     * Initializes the data engine and roles
     */
    _initData: function(keyArgs) {
        if(!this.parent) {
            var data = this.data;
            if(!data || def.get(keyArgs, 'reloadData', true)) {
               this._onLoadData();
            } else {
                data.clearVirtuals();
                data.disposeChildren();
            }
        }

        delete this._partData;
        
        if(pvc.debug >= 3){
            pvc.log(this.data.getInfo());
        }
    },

    _getDataPartDimName: function(){
        var role = this._dataPartRole;
        if(role){
            if(role.isBound()){
                return role.firstDimensionName();
            } 
            
            var preGrouping = role.preBoundGrouping();
            if(preGrouping) {
                return preGrouping.firstDimensionName();
            }
            
            return role.defaultDimensionName;
        }
    },
    
    _onLoadData: function(){
        var data = this.data,
            options = this.options,
            complexType   = data ? data.type : new pvc.data.ComplexType(),
            translOptions = this._createTranslationOptions(),
            translation   = this._createTranslation(complexType, translOptions),
            dataPartDimName,
            plot2Series;

        if(pvc.debug >= 3){
            translation.logSource();
        }
        
        var addDataPartDefaultCalc = false;
        if(!data){
            /* LOAD */
            
            // TODO
            // By now, the translation has not yet defined 
            // dimensions of options.dimensions
            // (which probably should be done here, anyway...)
            // So calculations may refer to dimensions in options.dimensions...
            // and these will end up being defined with very default values in addCalculation...
            
            /* REGISTER CALCULATIONS */
            // Currently translOptions has what is needed to
            // pass to pvc.data.DimensionType.extendSpec...
            var calcSpecs = options.calculations;
            if(calcSpecs){
                calcSpecs.forEach(function(calcSpec){
                    complexType.addCalculation(calcSpec, translOptions);
                });
            }
            
            // Is the role dataPart defined, 
            // and, if so, is it preBound?
            // What is the default or preBound dim name?
            dataPartDimName = this._getDataPartDimName();
            if(dataPartDimName){
                if(!complexType.isCalculated(dataPartDimName)){
                    // Axis2Series works by adding a calculation to 
                    // the dataPart role (to classify in '0' or '1' dataPart),
                    // so using it requires registering the dataPart dimension
                    plot2Series = (options.plot2 || options.secondAxis) && options.plot2Series;
                    if(plot2Series){
                        // Also, doing now, 
                        // prevents readers from reading into it.
                        this._addDataPartDimension(complexType, dataPartDimName);
                    }
                }
            }
            
            // Now the translation can configure the type as well
            translation.configureType();
            
            if(!plot2Series && dataPartDimName){
                // If the user isn't explicitly reading the dimension,
                // then the dimension must be created and its value defaulted.
                
                addDataPartDefaultCalc = !complexType.dimensions(dataPartDimName, {assertExists: false});
                if(addDataPartDefaultCalc){
                    this._addDataPartDimension(complexType, dataPartDimName);
                }
            }
        }
        
        if(pvc.debug >= 3){
            pvc.log(complexType.describe());
        }

        // ----------
        // Roles are bound before actually loading data,
        // in order to be able to filter datums
        // whose "every dimension in a measure role is null".
        // TODO: check why PRE is done only on createVersion 1 and this one 
        // is done on every create version
        this._bindVisualRoles(complexType);

        if(pvc.debug >= 3){
            this._logVisualRoles();
        }

        // ----------

        if(!data) {
            if(plot2Series){
                this._addPlot2SeriesCalculation(complexType, plot2Series, dataPartDimName);
            } else if(addDataPartDefaultCalc) {
                this._addDefaultDataPartCalculation(complexType, dataPartDimName);
            }
            
            data =
                this.dataEngine =
                this.data = new pvc.data.Data({
                    type:     complexType,
                    labelSep: options.groupedLabelSep
                });
        } // else TODO: assert complexType has not changed...
        
        // ----------

        var loadKeyArgs = {
            where:  this._getLoadFilter(),
            isNull: this._getIsNullDatum()
         };
        
        data.load(translation.execute(data), loadKeyArgs);
    },
    
    _addDataPartDimension: function(complexType, dataPartDimName){
        if(!complexType.dimensions(dataPartDimName, {assertExists: false})){
            var dimSpec = pvc.data.DimensionType.extendSpec(dataPartDimName);
            
            complexType.addDimension(dataPartDimName, dimSpec);
            return true;
        }
    },
    
//    
//    _onNewDimensionType: function(dimName, dimSpec){
//        return dimSpec;
//    },
    
    _getLoadFilter: function(){
        if(this.options.ignoreNulls) {
            return function(datum){
                var isNull = datum.isNull;
                
                if(isNull && pvc.debug >= 4){
                    pvc.log("Datum excluded.");
                }
                
                return !isNull;
            };
        }
    },
    
    _getIsNullDatum: function(){
        var measureDimNames = this.measureDimensionsNames(),
            M = measureDimNames.length;
        if(M) {
            // Must have at least one measure role dimension not-null
            return function(datum){
                var atoms = datum.atoms;
                for(var i = 0 ; i < M ; i++){
                    if(atoms[measureDimNames[i]].value != null){
                        return false;
                    }
                }

                return true;
            };
        }
    },
    
    _createTranslation: function(complexType, translOptions){
        var TranslationClass = this._getTranslationClass(translOptions);
        
        return new TranslationClass(this, complexType, this.resultset, this.metadata, translOptions);
    },
    
    _getTranslationClass: function(translOptions){
        return translOptions.crosstabMode ? 
                pvc.data.CrosstabTranslationOper : 
                pvc.data.RelationalTranslationOper;
    },
    
    _createTranslationOptions: function(){
        var options = this.options;
        var dataOptions = options.dataOptions || {};
        var plot2 = options.plot2 || options.secondAxis;
        
        var valueFormat = options.valueFormat,
            valueFormatter;
        if(valueFormat && valueFormat !== this.defaults.valueFormat){
            valueFormatter = function(v) {
                return v != null ? valueFormat(v) : "";
            };
        }

        return {
            //onNewDimensionType: this._onNewDimensionType.bind(this),
            compatVersion:     this.compatVersion(),
            plot2SeriesIndexes: (!plot2 || options.plot2Series) ? null : options.secondAxisIdx,
            seriesInRows:      options.seriesInRows,
            crosstabMode:      options.crosstabMode,
            isMultiValued:     options.isMultiValued,

            dimensionGroups:   options.dimensionGroups,
            dimensions:        options.dimensions,
            readers:           options.readers,

            measuresIndexes:   options.measuresIndexes, // relational multi-valued

            multiChartIndexes: options.multiChartIndexes,

            // crosstab
            separator:         dataOptions.separator,
            measuresInColumns: dataOptions.measuresInColumns,
            measuresIndex:     dataOptions.measuresIndex || dataOptions.measuresIdx, // measuresInRows
            measuresCount:     dataOptions.measuresCount || dataOptions.numMeasures, // measuresInRows
            categoriesCount:   dataOptions.categoriesCount,

            // Timeseries *parse* format
            isCategoryTimeSeries: options.timeSeries,

            timeSeriesFormat:     options.timeSeriesFormat,
            valueNumberFormatter: valueFormatter
        };
    },
    
    _addPlot2SeriesCalculation: function(complexType, plot2Series, dataPartDimName){
        var serRole = this._serRole;
        if(serRole && serRole.isBound()){
            
            var plot2SeriesSet = def.query(plot2Series).uniqueIndex();
            var dimNames = serRole.grouping.dimensionNames();
            var dataPartDim, part1Atom, part2Atom;
            
            complexType.addCalculation({
                names: dataPartDimName,
                
                calculation: function(datum, atoms){
                    if(!dataPartDim){
                        dataPartDim = datum.owner.dimensions(dataPartDimName);
                    }
                    
                    var seriesKey = pvc.data.Complex.values(datum, dimNames).join(',');
                    
                    atoms[dataPartDimName] = 
                        def.hasOwnProp.call(plot2SeriesSet, seriesKey) ?
                           (part2Atom || (part2Atom = dataPartDim.intern("1"))) :
                           (part1Atom || (part1Atom = dataPartDim.intern("0")));
                }
            });
        }
    },
    
    _addDefaultDataPartCalculation: function(complexType, dataPartDimName){
        var dataPartDim, part1Atom;
        
        complexType.addCalculation({
            names: dataPartDimName,
            
            calculation: function(datum, atoms){
                if(!dataPartDim){
                    dataPartDim = datum.owner.dimensions(dataPartDimName);
                }
                
                atoms[dataPartDimName] = part1Atom || 
                    (part1Atom = dataPartDim.intern("0"));
            }
        });
    },
    
    /**
     * Initializes each chart's specific roles.
     * @virtual
     */
    _initVisualRoles: function(){
        this._addVisualRoles({
            multiChart: {
                defaultDimensionName: 'multiChart*', 
                requireIsDiscrete: true
            }
        });

        if(this._hasDataPartRole()){
            this._addVisualRoles({
                dataPart: {
                    defaultDimensionName: 'dataPart',
                    requireSingleDimension: true,
                    requireIsDiscrete: true
                }
            });

            // Cached
            this._dataPartRole = this.visualRoles('dataPart');
        }

        var serRoleSpec = this._getSeriesRoleSpec();
        if(serRoleSpec){
            this._addVisualRoles({series: serRoleSpec});

            // Cached
            this._serRole = this.visualRoles('series');
        }
    },

    /**
     * Binds visual roles to grouping specifications
     * that have not yet been bound to and validated against a complex type.
     *
     * This allows inferring proper defaults to
     * dimensions bound to roles, by taking them from the roles requirements.
     */
    _bindVisualRolesPre: function(){
        
        def.eachOwn(this._visualRoles, function(visualRole){
            visualRole.setIsReversed(false);
        });
        
        /* Process user specified bindings */
        var boundDimNames = {};
        def.each(this.options.visualRoles, function(roleSpec, name){
            var visualRole = this._visualRoles[name] ||
                def.fail.operationInvalid("Role '{0}' is not supported by the chart type.", [name]);
            
            var groupingSpec;
            if(roleSpec && typeof roleSpec === 'object'){
                if(def.get(roleSpec, 'isReversed', false)){
                    visualRole.setIsReversed(true);
                }
                
                groupingSpec = roleSpec.dimensions;
            } else {
                groupingSpec = roleSpec;
            }
            
            // !groupingSpec results in a null grouping being preBound
            // A pre bound null grouping is later discarded in the post bind
            if(groupingSpec !== undefined){
                var grouping = pvc.data.GroupingSpec.parse(groupingSpec);

                visualRole.preBind(grouping);

                /* Collect dimension names bound to a *single* role */
                grouping.dimensions().each(function(dimSpec){
                    if(def.hasOwn(boundDimNames, dimSpec.name)){
                        // two roles => no defaults at all
                        delete boundDimNames[dimSpec.name];
                    } else {
                        boundDimNames[dimSpec.name] = visualRole;
                    }
                });
            }
        }, this);

        /* Provide defaults to dimensions bound to a single role */
        var dimsSpec = (this.options.dimensions || (this.options.dimensions = {}));
        def.eachOwn(boundDimNames, function(role, name){
            var dimSpec = dimsSpec[name] || (dimsSpec[name] = {});
            if(role.valueType && dimSpec.valueType === undefined){
                dimSpec.valueType = role.valueType;

                if(role.requireIsDiscrete != null && dimSpec.isDiscrete === undefined){
                    dimSpec.isDiscrete = role.requireIsDiscrete;
                }
            }

            if(dimSpec.label === undefined){
                dimSpec.label = role.label;
            }
        }, this);
    },

    _hasDataPartRole: function(){
        return false;
    },

    _getSeriesRoleSpec: function(){
        return null;
    },

    _addVisualRoles: function(roles){
        def.eachOwn(roles, function(keyArgs, name){
            var visualRole = new pvc.visual.Role(name, keyArgs);
            this._visualRoles[name] = visualRole;
            if(visualRole.isMeasure){
                this._measureVisualRoles.push(visualRole);
            }
        }, this);
    },
    
    _bindVisualRoles: function(type){
        
        var boundDimTypes = {};

        function bind(role, dimNames){
            role.bind(pvc.data.GroupingSpec.parse(dimNames, type));
            def.array.as(dimNames).forEach(function(dimName){
                boundDimTypes[dimName] = true;
            });
        }
        
        /* Process role pre binding */
        def.eachOwn(this._visualRoles, function(visualRole, name){
            if(visualRole.isPreBound()){
                visualRole.postBind(type);
                // Null groupings are discarded
                if(visualRole.grouping){
                    visualRole
                        .grouping
                        .dimensions().each(function(dimSpec){
                            boundDimTypes[dimSpec.name] = true;
                        });
                }
            }
        }, this);
        
        /*
         * (Try to) Automatically bind unbound roles.
         * Validate role required'ness.
         */
        def.eachOwn(this._visualRoles, function(role, name){
            if(!role.grouping){

                /* Try to bind automatically, to defaultDimensionName */
                var dimName = role.defaultDimensionName;
                if(dimName) {
                    /* An asterisk at the end of the name indicates
                     * that any dimension of that group is allowed.
                     * If the role allows multiple dimensions,
                     * then the meaning is greedy - use them all.
                     * Otherwise, use only one.
                     */
                    var match = dimName.match(/^(.*?)(\*)?$/) ||
                            def.fail.argumentInvalid('defaultDimensionName');
                    
                    var anyLevel = !!match[2];
                    if(anyLevel) {
                        // TODO: does not respect any index explicitly specified
                        // before the *. Could mean >=...
                        var groupDimNames = type.groupDimensionsNames(match[1], {assertExists: false});
                        if(groupDimNames){
                            var freeGroupDimNames = 
                                    def.query(groupDimNames)
                                        .where(function(dimName2){ return !def.hasOwn(boundDimTypes, dimName2); });

                            if(role.requireSingleDimension){
                                var freeDimName = freeGroupDimNames.first();
                                if(freeDimName){
                                    bind(role, freeDimName);
                                    return;
                                }
                            } else {
                                freeGroupDimNames = freeGroupDimNames.array();
                                if(freeGroupDimNames.length){
                                    bind(role, freeGroupDimNames);
                                    return;
                                }
                            }
                        }
                    } else if(!def.hasOwn(boundDimTypes, dimName) &&
                              type.dimensions(dimName, {assertExists: false})){
                        bind(role, dimName);
                        return;
                    }

                    if(role.autoCreateDimension){
                        /* Create a hidden dimension and bind the role and the dimension */
                        var defaultName = match[1];
                        type.addDimension(defaultName,
                            pvc.data.DimensionType.extendSpec(defaultName, {isHidden: true}));
                        bind(role, defaultName);
                        return;
                    }
                }

                if(role.isRequired) {
                    throw def.error.operationInvalid("Chart type requires unassigned role '{0}'.", [name]);
                }
                
                // Unbind role from any previous binding
                role.bind(null);
            }
        }, this);
    },

    _logVisualRoles: function(){
        var out = ["VISUAL ROLES SUMMARY", pvc.logSeparator];
        
        def.eachOwn(this._visualRoles, function(role, name){
            out.push("  " + name + def.array.create(18 - name.length, " ").join("") +
                    (role.grouping ? (" <-- " + role.grouping) : ''));
        });
        
        out.push(pvc.logSeparator);

        pvc.log(out.join("\n"));
    },

    /**
     * Obtains a roles array or a specific role, given its name.
     * 
     * @param {string} roleName The role name.
     * @param {object} keyArgs Keyword arguments.
     * @param {boolean} assertExists Indicates if an error should be thrown if the specified role name is undefined.
     * 
     * @type pvc.data.VisualRole[]|pvc.data.VisualRole 
     */
    visualRoles: function(roleName, keyArgs){
        if(roleName == null) {
            return def.own(this._visualRoles);
        }
        
        var role = def.getOwn(this._visualRoles, roleName) || null;
        if(!role && def.get(keyArgs, 'assertExists', true)) {
            throw def.error.argumentInvalid('roleName', "Undefined role name '{0}'.", [roleName]);
        }
        
        return role;
    },

    measureVisualRoles: function(){
        return this._measureVisualRoles;
    },

    measureDimensionsNames: function(){
        return def.query(this._measureVisualRoles)
                   .select(function(visualRole){ return visualRole.firstDimensionName(); })
                   .where(def.notNully)
                   .array();
    },
    
    /**
     * Indicates if a role is assigned, given its name. 
     * 
     * @param {string} roleName The role name.
     * @type boolean
     */
    _isRoleAssigned: function(roleName){
        return !!this._visualRoles[roleName].grouping;
    },
    
    partData: function(dataPartValues){
        if(!this._partData){
            if(!this._dataPartRole || !this._dataPartRole.grouping){
                /* Undefined or unbound */
                return this._partData = this.data;
            }
            
            // Visible and not
            this._partData = this.data.flattenBy(this._dataPartRole);
        }
        
        if(!dataPartValues || !this._dataPartRole || !this._dataPartRole.grouping){
            return this._partData;
        }
        
        var dataPartDimName = this._dataPartRole.firstDimensionName();
        
        if(def.array.is(dataPartValues)){
            if(dataPartValues.length > 1){
                return this._partData.where([
                             def.set({}, dataPartDimName, dataPartValues)
                         ]);
            }
            
            dataPartValues = dataPartValues[0];
        }
        
        // TODO: should, at least, call some static method of Atom to build a global key
        return this._partData._childrenByKey[dataPartDimName + ':' + dataPartValues] ||
               new pvc.data.Data({linkParent: this._partData, datums: []}); // don't blow code ahead...
    },

    /**
     * Creates and initializes the base panel.
     */
    _initBasePanel: function() {
        var options = this.options;
        var basePanelParent = this.parent && this.parent._multiChartPanel;
        
        this.basePanel = new pvc.BasePanel(this, basePanelParent, {
            margins:  options.margins,
            paddings: options.paddings,
            size:     {width: options.width, height: options.height}
        });
    },
    
    /**
     * Creates and initializes the title panel,
     * if the title is specified.
     */
    _initTitlePanel: function(){
        var options = this.options;
        if (!def.empty(options.title)) {
            var isRoot = !this.parent;
            this.titlePanel = new pvc.TitlePanel(this, this.basePanel, {
                title:        options.title,
                font:         options.titleFont,
                anchor:       options.titlePosition,
                align:        options.titleAlign,
                alignTo:      options.titleAlignTo,
                offset:       options.titleOffset,
                keepInBounds:     options.titleKeepInBounds,
                margins:      options.titleMargins,
                paddings:     options.titlePaddings,
                titleSize:    options.titleSize,
                titleSizeMax: options.titleSizeMax
            });
        }
    },
    
    /**
     * Creates and initializes the legend panel,
     * if the legend is active.
     */
    _initLegendPanel: function(){
        var options = this.options;
        if (options.legend) { // global legend(s) switch
            
            var legend = new pvc.visual.Legend(this, 'legend', 0);
            
            // TODO: pass all these options to Legend class
            
            this.legendPanel = new pvc.LegendPanel(this, this.basePanel, {
                anchor:       legend.option('Position'),
                align:        legend.option('Align'),
                alignTo:      options.legendAlignTo,
                offset:       options.legendOffset,
                keepInBounds: options.legendKeepInBounds,
                size:         legend.option('Size'),
                sizeMax:      legend.option('SizeMax'),
                margins:      legend.option('Margins'),
                paddings:     legend.option('Paddings'),
                font:         legend.option('Font'),
                scenes:       def.getPath(options, 'legend.scenes'),
                
                // Bullet legend
                textMargin:   options.legendTextMargin,
                itemPadding:  options.legendItemPadding,
                markerSize:   options.legendMarkerSize
                //shape:        options.legendShape // TODO: <- doesn't this come from the various color axes?
            });
            
            this._initLegendScenes(this.legendPanel);
        }
    },
    
    /**
     * Creates the legend group scenes of a chart.
     *
     * The default implementation creates
     * one legend group for each existing data part value
     * for the dimension in {@link #legendSource}.
     *
     * Legend groups are registered with the id prefix "part"
     * followed by the corresponding part value.
     */
    _initLegendScenes: function(legendPanel){
        
        var rootScene, dataPartDimName;
        var legendIndex = 0; // always start from 0
        
        // For all color axes...
        var colorAxes = this.axesByType.color;
        if(colorAxes){
            colorAxes.forEach(processAxis, this);
        }
        
        // ------------

        function processAxis(colorAxis){
            if(colorAxis.option('LegendVisible')){
                var dataCells = colorAxis && colorAxis.dataCells;
                if(dataCells){
                    dataCells
                    .forEach(function(dataCell){
                        var domainData = dataCell.data;
                        
                        if(!rootScene){
                            dataPartDimName = this._getDataPartDimName();
                            rootScene = legendPanel._getBulletRootScene();
                        }
                        
                        var dataPartAtom = domainData.atoms[dataPartDimName];
                        var locked = dataPartAtom && dataPartAtom.value === 'trend';
                        
                        var groupScene = rootScene.createGroup({
                            group:           domainData,
                            colorAxis:       colorAxis,
                            clickMode:       locked ? 'none' : undefined,
                            extensionPrefix: pvc.buildIndexedId('legend', legendIndex++)
                         });
                        
                        // For later binding an appropriate bullet renderer
                        dataCell.legendBulletGroupScene = groupScene;
                        
                        var partColorScale = colorAxis.scale;
                        
                        domainData
                            .children()
                            .each(function(itemData){
                                var itemScene = groupScene.createItem({group: itemData});
                                
                                // HACK...
                                itemScene.color = partColorScale(itemData.value);
                            });
                    }, this);
                }
            }
        }
    },
    
    _getLegendBulletRootScene: function(){
        return this.legendPanel && this.legendPanel._getBulletRootScene();
    },
    
    /**
     * Creates and initializes the multi-chart panel.
     */
    _initMultiChartPanel: function(){
        var basePanel = this.basePanel;
        var options = this.options;
        this._multiChartPanel = new pvc.MultiChartPanel(this, basePanel, {
            margins:  options.contentMargins,
            paddings: options.contentPaddings
        });
        
        // BIG HACK: force legend to be rendered after the small charts, 
        // to allow them to register legend renderers.
        basePanel._children.unshift(basePanel._children.pop());
    },
    
    _coordinateSmallChartsLayout: function(childCharts, scopesByType){
        // NOOP
    },
    
    useTextMeasureCache: function(fun, ctx){
        var root = this.root;
        var textMeasureCache = root._textMeasureCache || 
                               (root._textMeasureCache = pvc.text.createCache());
        
        return pvc.text.useCache(textMeasureCache, fun, ctx || this);
    },
    
    /**
     * Render the visualization.
     * If not pre-rendered, do it now.
     */
    render: function(bypassAnimation, recreate, reloadData){
        this.useTextMeasureCache(function(){
            try{
                if (!this.isPreRendered || recreate) {
                    this._preRender({reloadData: reloadData});
                } else if(!this.parent && this.isPreRendered) {
                    pvc.removeTipsyLegends();
                }
    
                this.basePanel.render({
                    bypassAnimation: bypassAnimation, 
                    recreate: recreate
                 });
                
            } catch (e) {
                if (e instanceof NoDataException) {
                    if(pvc.debug > 1){
                        pvc.log("No data found.");
                    }
    
                    this._addErrorPanelMessage("No data found", true);
                } else {
                    // We don't know how to handle this
                    pvc.logError(e.message);
                    
                    if(pvc.debug > 0){
                        this._addErrorPanelMessage("Error: " + e.message, false);
                    }
                    //throw e;
                }
            }
        });
        
        return this;
    },

    _addErrorPanelMessage: function(text, isNoData){
        var options = this.options,
            pvPanel = new pv.Panel()
                        .canvas(options.canvas)
                        .width(options.width)
                        .height(options.height),
            pvMsg = pvPanel.anchor("center").add(pv.Label)
                        .text(text);

        if(isNoData){
            this.extend(pvMsg, "noDataMessage");
        }
        
        pvPanel.render();
    },

    /**
     * Animation
     */
    animate: function(start, end) {
        return this.basePanel.animate(start, end);
    },
    
    /**
     * Indicates if the chart is currently 
     * rendering the animation start phase.
     * <p>
     * Prefer using this function instead of {@link #animate} 
     * whenever its <tt>start</tt> or <tt>end</tt> arguments
     * involve a non-trivial calculation. 
     * </p>
     * 
     * @type boolean
     */
    isAnimatingStart: function() {
        return this.basePanel.isAnimatingStart();
    },
    
    /**
     * Method to set the data to the chart.
     * Expected object is the same as what comes from the CDA: 
     * {metadata: [], resultset: []}
     */
    setData: function(data, options) {
        this.setResultset(data.resultset);
        this.setMetadata(data.metadata);

        // TODO: Danger!
        $.extend(this.options, options);
        
        return this;
    },
    
    /**
     * Sets the resultset that will be used to build the chart.
     */
    setResultset: function(resultset) {
        /*jshint expr:true */
        !this.parent || def.fail.operationInvalid("Can only set resultset on root chart.");
        
        this.resultset = resultset;
        if (!resultset.length) {
            pvc.log("Warning: Resultset is empty");
        }
        
        return this;
    },

    /**
     * Sets the metadata that, optionally, 
     * will give more information for building the chart.
     */
    setMetadata: function(metadata) {
        /*jshint expr:true */
        !this.parent || def.fail.operationInvalid("Can only set resultset on root chart.");
        
        this.metadata = metadata;
        if (!metadata.length) {
            pvc.log("Warning: Metadata is empty");
        }
        
        return this;
    },
    
    _processExtensionPoints: function(){
        var points = this.options.extensionPoints;
        var components = {};
        if(points){
            for(var p in points) {
                var id, prop;
                var splitIndex = p.indexOf("_");
                if(splitIndex > 0){
                    id   = p.substring(0, splitIndex);
                    prop = p.substr(splitIndex + 1);
                    if(id && prop){
                        var component = def.getOwn(components, id) ||
                                        (components[id] = new def.OrderedMap());
                        
                        component.add(prop, points[p]);
                    }
                }
            }
        }
        
        this._components = components;
    },
    
    /**
     * This is the method to be used for the extension points
     * for the specific contents of the chart. already ge a pie
     * chart! Goes through the list of options and, if it
     * matches the prefix, execute that method on the mark.
     * WARNING: It's the user's responsibility to make sure that
     * unexisting methods don't blow this.
     */
    extend: function(mark, ids, keyArgs){
        if(def.array.is(ids)){
            ids.forEach(function(id){
                this._extendCore(mark, id, keyArgs); 
            }, this);
        } else {
            this._extendCore(mark, ids, keyArgs);
        }
    },
    
    _extendCore: function(mark, id, keyArgs) {
        // if mark is null or undefined, skip
        if (mark) {
            var component = def.getOwn(this._components, id);
            if(component){
                if(mark.borderPanel){
                    mark = mark.borderPanel;
                }
                
                var logOut     = pvc.debug >= 3 ? [] : null;
                var constOnly  = def.get(keyArgs, 'constOnly', false); 
                var wrap       = mark.wrap;
                var keyArgs2   = {tag: pvc.extensionTag};
                var isRealMark = mark instanceof pv.Mark;
                
                component.forEach(function(v, m){
                    // Not everything that is passed to 'mark' argument
                    //  is actually a mark...(ex: scales)
                    // Not locked and
                    // Not intercepted and
                    if(mark.isLocked && mark.isLocked(m)){
                        if(logOut) {logOut.push(m + ": locked extension point!");}
                    } else if(mark.isIntercepted && mark.isIntercepted(m)) {
                        if(logOut) {logOut.push(m + ":" + pvc.stringify(v) + " (controlled)");}
                    } else {
                        if(logOut) {logOut.push(m + ": " + pvc.stringify(v)); }

                        // Extend object css and svg properties
                        if(v != null){
                            var type = typeof v;
                            if(type === 'object'){
                                if(m === 'svg' || m === 'css'){
                                    var v2 = mark.propertyValue(m);
                                    if(v2){
                                        v = def.copy(v2, v);
                                    }
                                }
                            } else if(isRealMark && (wrap || constOnly) && type === 'function'){
                                if(constOnly){
                                    return;
                                }
                                
                                if(m !== 'add'){ // TODO: "add" extension idiom - any other exclusions?
                                    v = wrap.call(mark, v, m);
                                }
                            }
                        }
                        
                        // Distinguish between mark methods and properties
                        if (typeof mark[m] === "function") {
                            if(mark.intercept){
                                mark.intercept(m, v, keyArgs2);
                            } else {
                                // Not really a mark
                                mark[m](v);
                            }
                        } else {
                            mark[m] = v;
                        }
                    }
                });

                if(logOut){
                    if(logOut.length){
                        pvc.log("Applying Extension Points for: '" + id + "'\n\t* " + logOut.join("\n\t* "));
                    } else if(pvc.debug >= 5) {
                        pvc.log("No Extension Points for: '" + id + "'");
                    }
                }
            }
        } else if(pvc.debug >= 4){
            pvc.log("Applying Extension Points for: '" + id + "' (target mark does not exist)");
        }
    },

    /**
     * Obtains the specified extension point.
     */
    _getExtension: function(id, prop) {
        var component;
        if(!def.array.is(id)){
            component = def.getOwn(this._components, id);
            if(component){
                return component.get(prop);
            }
        } else {
            // Last extension points are applied last, so have priority...
            var i = id.length - 1, value;
            while(i >= 0){
                component = def.getOwn(this._components, id[i--]);
                if(component && (value = component.get(prop)) !== undefined){
                    return value;
                }
            }
        }
    },
    
    _getConstantExtension: function(id, prop) {
        var value = this._getExtension(id, prop);
        if(!def.fun.is(value)){
            return value;
        }
    },
    
    /** 
     * Clears any selections and, if necessary,
     * re-renders the parts of the chart that show selected marks.
     * 
     * @type undefined
     * @virtual 
     */
    clearSelections: function(){
        if(this.data.owner.clearSelected()) {
            this.updateSelections();
        }
        
        return this;
    },
    
    _suspendSelectionUpdate: function(){
        if(this === this.root) {
            this._updateSelectionSuspendCount++;
        } else {
            this.root._suspendSelectionUpdate();
        }
    },
    
    _resumeSelectionUpdate: function(){
        if(this === this.root) {
            if(this._updateSelectionSuspendCount > 0) {
                if(!(--this._updateSelectionSuspendCount)) {
                    if(this._selectionNeedsUpdate) {
                        this.updateSelections();
                    }
                }
            }
        } else {
            this._resumeSelectionUpdate();
        }
    },
    
    /** 
     * Re-renders the parts of the chart that show selected marks.
     * 
     * @type undefined
     * @virtual 
     */
    updateSelections: function(){
        if(this === this.root) {
            if(this._inUpdateSelections) {
                return this;
            }
            
            if(this._updateSelectionSuspendCount) {
                this._selectionNeedsUpdate = true;
                return this;
            }
            
            pvc.removeTipsyLegends();
            
            // Reentry control
            this._inUpdateSelections = true;
            try {
                // Fire action
                var action = this.options.selectionChangedAction;
                if(action){
                    var selections = this.data.selectedDatums();
                    action.call(this.basePanel._getContext(), selections);
                }
                
                /** Rendering afterwards allows the action to change the selection in between */
                this.basePanel.renderInteractive();
            } finally {
                this._inUpdateSelections   = false;
                this._selectionNeedsUpdate = false;
            }
        } else {
            this.root.updateSelections();
        }
        
        return this;
    },
    
    _onUserSelection: function(datums){
        if(!datums || !datums.length){
            return datums;
        }
        
        if(this === this.root) {
            // Fire action
            var action = this.options.userSelectionAction;
            if(action){
                return action.call(null, datums) || datums;
            }
            
            return datums;
        }
        
        return this.root._onUserSelection(datums);
    },
    
    isOrientationVertical: function(orientation) {
        return (orientation || this.options.orientation) === pvc.orientation.vertical;
    },

    isOrientationHorizontal: function(orientation) {
        return (orientation || this.options.orientation) === pvc.orientation.horizontal;
    },
    
    /**
     * Disposes the chart, any of its panels and child charts.
     */
    dispose: function(){
        if(!this._disposed){
            
            // TODO: 
            
            this._disposed = true;
        }
    },
    
    defaults: {
//        canvas: null,

        width:  400,
        height: 300,

//      margins:  undefined,
//      paddings: undefined,
//      contentMargins:  undefined,
//      contentPaddings: undefined,
        
//      multiChartMax: undefined,
//      multiChartColumnsMax: undefined,
//      multiChartSingleRowFillsHeight: undefined,
//      multiChartSingleColFillsHeight: undefined,
        
//      smallWidth:       undefined,
//      smallHeight:      undefined,
//      smallAspectRatio: undefined,
//      smallMargins:     undefined,
//      smallPaddings:    undefined,
        
//      smallContentMargins:  undefined,
//      smallContentPaddings: undefined,
//      smallTitlePosition: undefined,
//      smallTitleAlign:    undefined,
//      smallTitleAlignTo:  undefined,
//      smallTitleOffset:   undefined,
//      smallTitleKeepInBounds: undefined,
//      smallTitleSize:     undefined,
//      smallTitleSizeMax:  undefined,
//      smallTitleMargins:  undefined,
//      smallTitlePaddings: undefined,
//      smallTitleFont:     undefined,
        
        orientation: 'vertical',
        
//        extensionPoints:   undefined,
//        
//        visualRoles:       undefined,
//        dimensions:        undefined,
//        dimensionGroups:   undefined,
//        calculations:      undefined,
//        readers:           undefined,
        
        ignoreNulls:       true, // whether to ignore or keep "null"-measure datums upon loading
        crosstabMode:      true,
//        multiChartIndexes: undefined,
        isMultiValued:     false,
        seriesInRows:      false,
        groupedLabelSep:   undefined,
//        measuresIndexes:   undefined,
//        dataOptions:       undefined,
//        
//        timeSeries:        undefined,
//        timeSeriesFormat:  undefined,

        animate: true,

//        title:         null,
        
        titlePosition: "top", // options: bottom || left || right
        titleAlign:    "center", // left / right / center
//        titleAlignTo:  undefined,
//        titleOffset:   undefined,
//        titleKeepInBounds: undefined,
//        titleSize:     undefined,
//        titleSizeMax:  undefined,
//        titleMargins:  undefined,
//        titlePaddings: undefined,
//        titleFont:     undefined,
        
        legend:           false, // Show Legends
        legendPosition:   "bottom",
//        legendFont:       undefined,
//        legendSize:       undefined,
//        legendSizeMax:    undefined,
//        legendAlign:      undefined,
//        legendAlignTo:    undefined,
//        legendOffset:     undefined,
//        legendKeepInBounds:   undefined,
//        legendMargins:    undefined,
//        legendPaddings:   undefined,
//        legendTextMargin: undefined,
//        legendItemPadding:    undefined, // ATTENTION: this is different from legendPaddings
//        legendMarkerSize: undefined,
        
//        colors: null,

        plot2: false,
//      plot2Series
        
//      plot2: false, // deprecated
        secondAxisIdx: -1, // deprecated
//      secondAxisColor //deprecated
//      plot2OwnColorScale

        showTooltips: true,
        
//      tooltipFormat: undefined,
        
        v1StyleTooltipFormat: function(s, c, v, datum) {
            return s + ", " + c + ":  " + this.chart.options.valueFormat(v) +
                   (datum && datum.percent ? ( " (" + datum.percent.label + ")") : "");
        },
        
        tipsySettings: {
            gravity:    "s",
            delayIn:     200,
            delayOut:    80, // smoother moving between marks with tooltips, possibly slightly separated
            offset:      2,
            opacity:     0.8,
            html:        true,
            fade:        false, // fade out
            corners:     false,
            followMouse: false
        },
        
        valueFormat: def.scope(function(){
            var pvFormat = pv.Format.number().fractionDigits(0, 2);
            
            return function(d) {
                return pvFormat.format(d);
                // pv.Format.number().fractionDigits(0, 10).parse(d));
            };
        }),
        
        /* For numeric values in percentage */
        percentValueFormat: def.scope(function(){
            var pvFormat = pv.Format.number().fractionDigits(0, 1);
            
            return function(d){
                return pvFormat.format(d * 100) + "%";
            };
        }),
        
        // Content/Plot area clicking
        clickable:  false,
//        clickAction: null,
//        doubleClickAction: null,
        doubleClickMaxDelay: 300, //ms
//      
        hoverable:  false,
        selectable: false,
        
//        selectionChangedAction: null,
//        userSelectionAction: null, 
            
        // Use CTRL key to make fine-grained selections
        ctrlSelectMode: true,
        clearSelectionMode: 'emptySpaceClick', // or null <=> 'manual' (i.e., by code)
        
//        renderCallback: undefined,

        compatVersion: Infinity // numeric, 1 currently recognized
    }
});

