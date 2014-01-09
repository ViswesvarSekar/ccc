/*
 * requirejs configuration file used to build the pvc.js file
 */

({
    appDir: "../package-res/pvc",
    baseUrl: ".",
    optimize: "uglify2",
    dir: "module-scripts",

    paths: {
        'pvc': "pvc",
        'pvc.text': "pvc.text",
        'pvc.color': "pvc.color",
        'pvc.trends': "pvc.trends",
        'pvc.options': "pvc.options",

        'data/_data': "data/_data",
        'data/meta/DimensionType': "data/meta/DimensionType",
        'data/meta/ComplexType': "data/meta/ComplexType",
        'data/meta/ComplexTypeProject': "data/meta/ComplexTypeProject",
        'data/translation/TranslationOper': "data/translation/TranslationOper",
        'data/translation/MatrixTranslationOper': "data/translation/MatrixTranslationOper",
        'data/translation/CrosstabTranslationOper': "data/translation/CrosstabTranslationOper",
        'data/translation/RelationalTranslationOper': "data/translation/RelationalTranslationOper",
        'data/Atom': "data/Atom",
        'data/Complex': "data/Complex",
        'data/ComplexView': "data/ComplexView",
        'data/Datum': "data/Datum",
        'data/Dimension': "data/Dimension",
        'data/Data': "data/Data",
        'data/Data.selected': "data/Data.selected",
        'data/GroupingSpec': "data/GroupingSpec",
        'data/DataOper': "data/DataOper",
        'data/GroupingOper': "data/GroupingOper",
        'data/LinearInterpolationOper': "data/LinearInterpolationOper",
        'data/LinearInterpolationOperSeriesState': "data/LinearInterpolationOperSeriesState",
        'data/ZeroInterpolationOper': "data/ZeroInterpolationOper",
        'data/ZeroInterpolationOperSeriesState': "data/ZeroInterpolationOperSeriesState",
        'data/Data.operations': "data/Data.operations",
        'data/Data.compat': "data/Data.compat",

        'visual/Interactive': "visual/Interactive",
        'visual/Scene': "visual/Scene",
        'visual/Var': "visual/Var",
        'visual/Context': "visual/Context",

        'visual/Role': "visual/Role",
        'visual/RoleVarHelper': "visual/RoleVarHelper",

        'visual/sign/BasicSign': "visual/sign/BasicSign",
        'visual/sign/Sign': "visual/sign/Sign",
        'visual/sign/Panel': "visual/sign/Panel",
        'visual/sign/Label': "visual/sign/Label",
        'visual/sign/ValueLabel': "visual/sign/ValueLabel",
        'visual/sign/Dot': "visual/sign/Dot",
        'visual/sign/DotSizeColor': "visual/sign/DotSizeColor",
        'visual/sign/Line': "visual/sign/Line",
        'visual/sign/Area': "visual/sign/Area",
        'visual/sign/Bar': "visual/sign/Bar",
        'visual/sign/PieSlice': "visual/sign/PieSlice",
        'visual/sign/Rule': "visual/sign/Rule",

        'visual/OptionsBase': "visual/OptionsBase",
        'visual/MultiChart': "visual/MultiChart",
        'visual/SmallChart': "visual/SmallChart",
        'visual/Axis': "visual/Axis",
        'visual/CartesianAxis': "visual/CartesianAxis",
        'visual/CartesianAxisRootScene': "visual/CartesianAxisRootScene",
        'visual/CartesianAxisTickScene': "visual/CartesianAxisTickScene",
        'visual/CartesianFocusWindow': "visual/CartesianFocusWindow",
        'visual/ColorAxis': "visual/ColorAxis",
        'visual/SizeAxis': "visual/SizeAxis",
        'visual/AngleAxis': "visual/AngleAxis",
        'visual/Legend': "visual/Legend",
        'visual/legend/BulletRootScene': "visual/legend/BulletRootScene",
        'visual/legend/BulletGroupScene': "visual/legend/BulletGroupScene",
        'visual/legend/BulletItemScene': "visual/legend/BulletItemScene",
        'visual/legend/BulletItemSceneSelection': "visual/legend/BulletItemSceneSelection",
        'visual/legend/BulletItemSceneVisibility': "visual/legend/BulletItemSceneVisibility",
        'visual/legend/BulletItemRenderer': "visual/legend/BulletItemRenderer",
        'visual/legend/BulletItemDefaultRenderer': "visual/legend/BulletItemDefaultRenderer",

        'visual/dataCell/DataCell': "visual/dataCell/DataCell",
        'visual/dataCell/ColorDataCell': "visual/dataCell/ColorDataCell",
        'visual/plot/Plot': "visual/plot/Plot",

        'visual/dataCell/CartesianOrthoDataCell': "visual/dataCell/CartesianOrthoDataCell",
        'visual/plot/CartesianPlot': "visual/plot/CartesianPlot",

        'visual/plot/CategoricalPlot': "visual/plot/CategoricalPlot",
        'visual/plot/BarPlotAbstract': "visual/plot/BarPlotAbstract",
        'visual/plot/BarPlot': "visual/plot/BarPlot",
        'visual/plot/NormalizedBarPlot': "visual/plot/NormalizedBarPlot",
        'visual/plot/WaterfallPlot': "visual/plot/WaterfallPlot",
        'visual/plot/PointPlot': "visual/plot/PointPlot",
        'visual/plot/MetricXYPlot': "visual/plot/MetricXYPlot",
        'visual/plot/MetricPointPlot': "visual/plot/MetricPointPlot",
        'visual/plot/PiePlot': "visual/plot/PiePlot",
        'visual/plot/HeatGridPlot': "visual/plot/HeatGridPlot",
        'visual/plot/BoxPlot': "visual/plot/BoxPlot",
        'visual/plot/BulletPlot': "visual/plot/BulletPlot",

        'visual/plot/TreemapPlot': "visual/plot/TreemapPlot",

        'pvcAbstract': "pvcAbstract",

        'pvcBaseChart': "pvcBaseChart",
        'pvcBaseChart.visualRoles': "pvcBaseChart.visualRoles",
        'pvcBaseChart.data': "pvcBaseChart.data",
        'pvcBaseChart.plots': "pvcBaseChart.plots",
        'pvcBaseChart.axes': "pvcBaseChart.axes",
        'pvcBaseChart.panels': "pvcBaseChart.panels",
        'pvcBaseChart.selection': "pvcBaseChart.selection",
        'pvcBaseChart.extension': "pvcBaseChart.extension",

        'pvcBasePanel': "pvcBasePanel",
        'pvcPlotPanel': "pvcPlotPanel",
        'pvcMultiChartPanel': "pvcMultiChartPanel",
        'pvcTitlePanelAbstract': "pvcTitlePanelAbstract",
        'pvcTitlePanel': "pvcTitlePanel",
        'pvcLegendPanel': "pvcLegendPanel",
        'pvcCartesianAbstract': "pvcCartesianAbstract",
        'pvcGridDockingPanel': "pvcGridDockingPanel",
        'pvcCartesianGridDockingPanel': "pvcCartesianGridDockingPanel",
        'pvcCartesianAbstractPanel': "pvcCartesianAbstractPanel",
        'pvcPlotBgPanel': "pvcPlotBgPanel",
        'pvcCategoricalAbstract': "pvcCategoricalAbstract",
        'pvcCategoricalAbstractPanel': "pvcCategoricalAbstractPanel",
        'pvcAxisPanel': "pvcAxisPanel",
        'pvcAxisTitlePanel': "pvcAxisTitlePanel",
        'pvcPiePanel': "pvcPiePanel",
        'pvcPieChart': "pvcPieChart",

        'pvcBarAbstractPanel': "pvcBarAbstractPanel",
        'pvcBarAbstract': "pvcBarAbstract",
        'pvcBarPanel': "pvcBarPanel",
        'pvcBarChart': "pvcBarChart",
        'pvcNormalizedBarPanel': "pvcNormalizedBarPanel",
        'pvcNormalizedBarChart': "pvcNormalizedBarChart",

        'visual/legend/WaterfallBulletGroupScene': "visual/legend/WaterfallBulletGroupScene",
        'pvcWaterfallPanel': "pvcWaterfallPanel",
        'pvcWaterfallChart': "pvcWaterfallChart",

        'pvcPointPanel': "pvcPointPanel",
        'pvcPoint': "pvcPoint",
        'pvcHeatGridPanel': "pvcHeatGridPanel",
        'pvcHeatGridChart': "pvcHeatGridChart",
        'pvcMetricXYAbstract': "pvcMetricXYAbstract",
        'data/translation/MetricPointChartTranslationOper': "data/translation/MetricPointChartTranslationOper",
        'pvcMetricPointPanel': "pvcMetricPointPanel",
        'pvcMetricPoint': "pvcMetricPoint",
        'pvcBulletChart': "pvcBulletChart",
        'pvcParallelCoordinates': "pvcParallelCoordinates",
        'pvcDataTree': "pvcDataTree",

        'data/translation/BoxplotChartTranslationOper': "data/translation/BoxplotChartTranslationOper",
        'pvcBoxplotPanel': "pvcBoxplotPanel",
        'pvcBoxplotChart': "pvcBoxplotChart",

        'visual/TreemapDiscreteColorAxis': "visual/TreemapDiscreteColorAxis",
        'data/translation/TreemapChartTranslationOper': "data/translation/TreemapChartTranslationOper",
        'pvcTreemapPanel': "pvcTreemapPanel",
        'pvcTreemapChart': "pvcTreemapChart",
    },

    //default wrap files, this is externally configured
    wrap: {
        startFile: "..",
        endFile: ".."
    },

    uglify2: {
        output: {
            beautify: true,
            max_line_len: 1000
        },
        compress: {
            sequences: false,
            global_defs: {
                DEBUG: false
            }
        },
        warnings: true,
        mangle: false
    },

    removeCombined: true,

    preserveLicenseComments: true,

    modules: [
        {
            name: "pvc",
            create: false,
            include: [
                'pvc',
                'pvc.text',
                'pvc.color',
                'pvc.trends',
                'pvc.options',

                'data/_data',
                'data/meta/DimensionType',
                'data/meta/ComplexType',
                'data/meta/ComplexTypeProject',
                'data/translation/TranslationOper',
                'data/translation/MatrixTranslationOper',
                'data/translation/CrosstabTranslationOper',
                'data/translation/RelationalTranslationOper',
                'data/Atom',
                'data/Complex',
                'data/ComplexView',
                'data/Datum',
                'data/Dimension',
                'data/Data',
                'data/Data.selected',
                'data/GroupingSpec',
                'data/DataOper',
                'data/GroupingOper',
                'data/LinearInterpolationOper',
                'data/LinearInterpolationOperSeriesState',
                'data/ZeroInterpolationOper',
                'data/ZeroInterpolationOperSeriesState',
                'data/Data.operations',
                'data/Data.compat',

                'visual/Interactive',
                'visual/Scene',
                'visual/Var',
                'visual/Context',

                'visual/Role',
                'visual/RoleVarHelper',

                'visual/sign/BasicSign',
                'visual/sign/Sign',
                'visual/sign/Panel',
                'visual/sign/Label',
                'visual/sign/ValueLabel',
                'visual/sign/Dot',
                'visual/sign/DotSizeColor',
                'visual/sign/Line',
                'visual/sign/Area',
                'visual/sign/Bar',
                'visual/sign/PieSlice',
                'visual/sign/Rule',

                'visual/OptionsBase',
                'visual/MultiChart',
                'visual/SmallChart',
                'visual/Axis',
                'visual/CartesianAxis',
                'visual/CartesianAxisRootScene',
                'visual/CartesianAxisTickScene',
                'visual/CartesianFocusWindow',
                'visual/ColorAxis',
                'visual/SizeAxis',
                'visual/AngleAxis',
                'visual/Legend',
                'visual/legend/BulletRootScene',
                'visual/legend/BulletGroupScene',
                'visual/legend/BulletItemScene',
                'visual/legend/BulletItemSceneSelection',
                'visual/legend/BulletItemSceneVisibility',
                'visual/legend/BulletItemRenderer',
                'visual/legend/BulletItemDefaultRenderer',

                'visual/dataCell/DataCell',
                'visual/dataCell/ColorDataCell',
                'visual/plot/Plot',

                'visual/dataCell/CartesianOrthoDataCell',
                'visual/plot/CartesianPlot',

                'visual/plot/CategoricalPlot',
                'visual/plot/BarPlotAbstract',
                'visual/plot/BarPlot',
                'visual/plot/NormalizedBarPlot',
                'visual/plot/WaterfallPlot',
                'visual/plot/PointPlot',
                'visual/plot/MetricXYPlot',
                'visual/plot/MetricPointPlot',
                'visual/plot/PiePlot',
                'visual/plot/HeatGridPlot',
                'visual/plot/BoxPlot',
                'visual/plot/BulletPlot',

                'visual/plot/TreemapPlot',

                'pvcAbstract',

                'pvcBaseChart',
                'pvcBaseChart.visualRoles',
                'pvcBaseChart.data',
                'pvcBaseChart.plots',
                'pvcBaseChart.axes',
                'pvcBaseChart.panels',
                'pvcBaseChart.selection',
                'pvcBaseChart.extension',

                'pvcBasePanel',
                'pvcPlotPanel',
                'pvcMultiChartPanel',
                'pvcTitlePanelAbstract',
                'pvcTitlePanel',
                'pvcLegendPanel',
                'pvcCartesianAbstract',
                'pvcGridDockingPanel',
                'pvcCartesianGridDockingPanel',
                'pvcCartesianAbstractPanel',
                'pvcPlotBgPanel',
                'pvcCategoricalAbstract',
                'pvcCategoricalAbstractPanel',
                'pvcAxisPanel',
                'pvcAxisTitlePanel',
                'pvcPiePanel',
                'pvcPieChart',

                'pvcBarAbstractPanel',
                'pvcBarAbstract',
                'pvcBarPanel',
                'pvcBarChart',
                'pvcNormalizedBarPanel',
                'pvcNormalizedBarChart',

                'visual/legend/WaterfallBulletGroupScene',
                'pvcWaterfallPanel',
                'pvcWaterfallChart',

                'pvcPointPanel',
                'pvcPoint',
                'pvcHeatGridPanel',
                'pvcHeatGridChart',
                'pvcMetricXYAbstract',
                'data/translation/MetricPointChartTranslationOper',
                'pvcMetricPointPanel',
                'pvcMetricPoint',
                'pvcBulletChart',
                'pvcParallelCoordinates',
                'pvcDataTree',

                'data/translation/BoxplotChartTranslationOper',
                'pvcBoxplotPanel',
                'pvcBoxplotChart',

                'visual/TreemapDiscreteColorAxis',
                'data/translation/TreemapChartTranslationOper',
                'pvcTreemapPanel',
                'pvcTreemapChart'


            ]
        }
    ],

    skipModuleInsertion: true
})