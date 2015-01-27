(function() {

    MapViewer.LayerList = MapViewer.extend(MapViewer.MapControl, {

        template: '<div class="header">Layers</div><ul class="layer-list"></ul>',
        controlClass: 'layer-list-control',

        position: 'RIGHT_CENTER',
        alias: 'layer-list',

        layerList: null,
        layer: [],

        initialize: function() {
            var layers = this.layers;
            this.layerList = this.getElementsByClass('layer-list')[0];
            for (var l = 0; l < layers.length; l++) {
                this.addLI(layers[l]);
            }

            var that = this;
            this.bindEvent('layer', 'click', function(event) {
                var li = event.currentTarget;

                if (li.classList.contains('active')) {
                    that.layerDeselected(li);
                } else {
                    that.layerSelected(li);
                }
            });
        },

        layerSelected: function(li) {
            li.classList.add('active');
        },

        layerDeselected: function(li) {
            li.classList.remove('active');

        },

        addLI: function(text) {
            var li = document.createElement('li');
            li.className = 'layer';
            li.innerHTML = text;
            this.layerList.appendChild(li);
        }
    });

    MapViewer.registerModule(MapViewer.LayerList, "layer-list");
})();
