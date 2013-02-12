
def.type('pvc.visual.Label', pvc.visual.Sign)
.init(function(panel, protoMark, keyArgs){

    var pvMark = protoMark.add(pv.Label);

    this.base(panel, pvMark, keyArgs);
})
.add({
    _addInteractive: function(keyArgs){
        var t = true;
        keyArgs = def.setDefaults(keyArgs,
                        'noSelect',       t,
                        'noHover',        t,
                        'noTooltip',      t,
                        'noClick',        t,
                        'noDoubleClick',  t,
                        'showsInteraction',false);

        this.base(keyArgs);
    },
    
    defaultColor: function(/*type*/){
        return pv.Color.names.black;
    }
});