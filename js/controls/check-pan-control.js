(function() {
    var CONTROL_CLASS = 'search-on-pan';

    MapViewer.SearchOnPanControl = MapViewer.extend(MapViewer.MapControl, {

        template: '<div class="check-pan-control-outer"><div class="check-pan-control-border">' +
        '<div class="check-pan-control-inner"><a class="check-class" href="javascript:void(0)"> </a><span> Search when moving map</span></div></div></div>',
        controlClass: 'check-pan-control',

        position: 'LEFT_BOTTOM',
        alias: CONTROL_CLASS,
        text: 'Default',
        defaultChecked: false,
        checked: "",
        toggleGroup: ['search-group'],
        initialize: function() {
            MapViewer.MapControl.prototype.initialize.apply(this, arguments);
            var that = this;
            this.bindEvent('check-pan-control-outer', 'click', function(event) {
                if (that.link.classList.contains("unchecked-pan")) {
                    that.notifyActivation();
                } else {
                    that.deactivate();
                }

                google.maps.event.addListener(that.map, 'idle', function() {
                    if (that.link.classList.contains("checked-pan")) {
                        that.searchInBounds();
                    }
                });
            });
        }

    });

    MapViewer.registerModule(MapViewer.SearchOnPanControl, CONTROL_CLASS);
})();