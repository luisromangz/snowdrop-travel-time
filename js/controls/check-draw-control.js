(function() {

    MapViewer.CheckDrawControl = MapViewer.extend(MapViewer.MapControl, {

        template: '<div class="check-draw-control-outer"><div class="check-draw-control-border">' +
            '<div class="check-draw-control-inner"><a class="check-draw-class" href="#"> </a> Draw a polygon into de map</div></div></div>',
        controlClass: 'check-draw-control',

        position: 'BOTTOM_LEFT',
        alias: 'check-draw',

        text: 'Default',
        defaultChecked: false,
        InnerPolygon: null,
        OuterPolygon: null,
        listener: null,
        pan: null,
        dragFlag: null,
        rectangleCoords: null,
        initialize: function() {
            this.rectangleCoords = [
                new google.maps.LatLng(180, -90),
                new google.maps.LatLng(-180, -90),
                new google.maps.LatLng(-180, 90),
                new google.maps.LatLng(180, 90)
            ];
            this.link = this.getElementsByClass('check-draw-class')[0];

            this.drawingManager = new google.maps.drawing.DrawingManager({
                drawingMode: google.maps.drawing.OverlayType.POLYGON,
                drawingControl: true,
                drawingControlOptions: {
                    position: google.maps.ControlPosition.TOP_CENTER,
                    drawingModes: [
                        google.maps.drawing.OverlayType.POLYGON
                    ]
                },
                polygonOptions: {
                    strokeColor: '#BC141A',
                    strokeOpacity: 0.9,
                    strokeWeight: 3,
                    fillColor: '#BC141A',
                    fillOpacity: 0.1,
                    clickable: true,
                    editable: true,
                    draggable: true,
                    zIndex: 1
                }
            });

            if (this.defaultChecked) {
                this.link.classList.add('checked-pan');

            } else {
                this.link.classList.add('unchecked-pan');
            }

            var that = this;

            //Custom event to control the controllers collisions
            this.bindEvent('check-draw-class', 'change', function(event) {
                if (that.InnerPolygon !== null) {
                    that.basicSearch();
                    that.cleanMap();
                } else {
                    that.drawingManager.setOptions({
                        drawingControl: false
                    });
                    that.drawingManager.setDrawingMode(null);
                }
            });

            this.bindEvent('check-draw-control-outer', 'click', function(event) {
                if (that.link.classList.contains("unchecked-pan")) {
                    that.link.classList.remove('unchecked-pan');
                    that.link.classList.add('checked-pan');
                    that.checked = true;
                } else {
                    that.link.classList.remove('checked-pan');
                    that.link.classList.add('unchecked-pan');
                    that.checked = false;
                }

                if (that.checked) {
                    that.drawingManager.setDrawingMode(google.maps.drawing.OverlayType.POLYGON);
                    that.drawingManager.setMap(that.map);
                    that.drawingManager.setOptions({
                        drawingControl: true
                    });

                    that.listener = google.maps.event.addListenerOnce(that.drawingManager, 'polygoncomplete', function(polygon) {
                        that.dragFlag = false;
                        that.InnerPolygon = polygon;
                        //Draw the complet polygon
                        that.search(polygon, "creation");

                        //Events
                        google.maps.event.addListener(polygon, 'dragstart', function() {
                            that.dragFlag = true;
                        });

                        google.maps.event.addListener(polygon, 'dragend', function() {
                            that.dragFlag = false;
                            that.search(this, "drag");
                        });

                        google.maps.event.addListener(polygon.getPath(), 'set_at', function() {
                            if (that.dragFlag !== true)
                                that.search(this.j, "edit");
                        });


                        google.maps.event.addListener(polygon.getPath(), 'insert_at', function() {
                            that.search(this.j, "edit");
                        });

                        google.maps.event.addListener(polygon.getPath(), 'remove_at', function() {
                            that.search(this.j, "edit");
                        });

                        that.drawingManager.setOptions({
                            drawingControl: false
                        });

                        that.drawingManager.setDrawingMode(null);
                    });

                } else {
                    google.maps.event.removeListener(that.listener);
                    that.drawingManager.setMap(null);
                    if (that.InnerPolygon !== null) {
                        that.basicSearch();
                        that.cleanMap();
                    }
                }
            });
        },

        disable: function() {
            this.drawingManager.setMap(null);
        },

        basicSearch: function() {
            var list = [];
            var bounds = this.map.getBounds();
            list.push(bounds.getNorthEast());
            list.push(bounds.getSouthWest());
            this.api.searchByPolygon(list);
        },

        cleanMap: function() {
            this.OuterPolygon.setMap(null);
            this.InnerPolygon.setMap(null);
            this.InnerPolygon = null;
            this.OuterPolygon = null;
        },

        search: function(polygon, event) {
            var boundsPoly = null;
            var polyObject = null;

            if (event == "edit") {
                polyObject = boundsPoly = polygon;
            } else {
                //Polygon coordinates
                polyObject = polygon.getPath();
                boundsPoly = polyObject.getArray();

                //Non convex polygon
                if (boundsPoly.length > 2) {
                    var nonConvex = false;
                    var sum = 0;
                    var a1 = boundsPoly[1].lat() - boundsPoly[0].lat();
                    var a2 = boundsPoly[2].lat() - boundsPoly[1].lat();
                    var b1 = boundsPoly[1].lng() - boundsPoly[0].lng();
                    var b2 = boundsPoly[2].lng() - boundsPoly[1].lng();

                    sum = a1 * b2 - b1 * a2;

                    if (sum < 0 && event !== "drag") {
                        boundsPoly.reverse();
                    }
                }

            }

            //Polygon substraction and mask
            if (this.OuterPolygon !== null) {
                this.OuterPolygon.setMap(null);
            }

            this.OuterPolygon = new google.maps.Polygon({
                paths: [this.rectangleCoords, boundsPoly],
                map: this.map,
                strokeOpacity: 1,
                strokeWeight: 0,
                fillColor: '#000000',
                fillOpacity: 0.7,
                zIndex: 0
            });

            this.api.searchByPolygon(boundsPoly);
        }


    });

    MapViewer.registerModule(MapViewer.CheckDrawControl, "check-draw");
})();