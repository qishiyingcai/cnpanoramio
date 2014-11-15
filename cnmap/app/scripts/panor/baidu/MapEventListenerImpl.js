// Generated by CoffeeScript 1.8.0
(function() {
  var $window, MapEventListener,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $window = window;

  MapEventListener = (function(_super) {
    __extends(MapEventListener, _super);

    function MapEventListener() {
      return MapEventListener.__super__.constructor.apply(this, arguments);
    }

    MapEventListener.prototype.addLocationHashListener = function(map, callback) {
      var MapListener, listeners;
      listeners = [];
      MapListener = function(e) {
        var point;
        point = this.getCenter();
        return callback.apply(this, [point.lat, point.lng, this.getZoom()]);
      };
      listeners.push(map.addEventListener("moveend", MapListener));
      listeners.push(map.addEventListener("zoomend", MapListener));
      listeners.push(map.addEventListener("dragend", MapListener));
      return listeners;
    };

    MapEventListener.prototype.addToolBar = function(map) {
      map.addControl(new window.BMap.NavigationControl());
      map.addControl(new window.BMap.ScaleControl());
      map.addControl(new window.BMap.OverviewMapControl());
      return map.addControl(new window.BMap.MapTypeControl());
    };

    MapEventListener.prototype.setCenter = function(map, lat, lng) {
      return map.setCenter(new BMap.Point(lng, lat));
    };

    MapEventListener.prototype.setZoom = function(map, zoom) {
      return map.setZoom(zoom);
    };

    MapEventListener.prototype.setZoomAndCenter = function(map, zoom, lat, lng) {
      var point;
      point = new BMap.Point(lng, lat);
      return map.centerAndZoom(point, zoom);
    };

    MapEventListener.prototype.zoomIn = function(map) {
      return map.zoomIn();
    };

    MapEventListener.prototype.zoomOut = function(map) {
      return map.zoomOut();
    };

    MapEventListener.prototype.setBounds = function(map, sw, ne) {
      return map.setViewport([new BMap.Point(sw.lng, sw.lat), new BMap.Point(ne.lng, ne.lat)]);
    };

    MapEventListener.prototype.inMapView = function(lat, lng, map) {
      map = map || this.opts.map;
      return map.getBounds().containsPoint(new BMap.Point(lng, lat));
    };

    MapEventListener.prototype.pixelToPoint = function(map, pixel) {
      return map.pixelToPoint(new BMap.Pixel(pixel.x, pixel.y));
    };

    MapEventListener.prototype.pointToPixel = function(map, point) {
      return map.pointToPixel(new BMap.Point(point.lng, point.lat));
    };

    MapEventListener.prototype.addMarker = function(map, lat, lng) {
      var marker;
      marker = new BMap.Marker(new BMap.Point(lng, lat));
      map.addOverlay(marker);
      return marker;
    };

    MapEventListener.prototype.createDraggableMarker = function(map, lat, lng) {
      var marker;
      marker = new BMap.Marker(new BMap.Point(lng, lat), {
        enableDragging: true
      });
      map.addOverlay(marker);
      return marker;
    };

    MapEventListener.prototype.activeMarker = function(marker) {
      if (marker) {
        marker.defaultIcon = marker.getIcon();
        marker.setIcon(new BMap.Icon("images/marker.png", new BMap.Size(20, 30), {
          anchor: new BMap.Size(10, 30)
        }));
        return marker.setZIndex(2);
      }
    };

    MapEventListener.prototype.deactiveMarker = function(marker) {
      if (marker && marker.defaultIcon) {
        marker.setIcon(marker.defaultIcon);
        return marker.setZIndex(1);
      }
    };

    MapEventListener.prototype.addMarkerActiveListener = function(marker, callback) {
      var ActiveListener;
      ActiveListener = function(e) {
        return callback.apply(marker, []);
      };
      marker.addEventListener("click", ActiveListener);
      marker.addEventListener("dragend", ActiveListener);
      return marker.addEventListener("rightclick", ActiveListener);
    };

    MapEventListener.prototype.addDragendListener = function(marker, callback) {
      return marker.addEventListener("dragend", function(e) {
        return callback.apply(marker, [e.point.lat, e.point.lng]);
      });
    };

    MapEventListener.prototype.removeMarker = function(marker) {
      var map;
      map = marker.getMap();
      if (map) {
        return map.removeOverlay(marker);
      }
    };

    MapEventListener.prototype.addMapClickListener = function(map, callback) {
      return map.addEventListener("click", function(e) {
        return callback.apply(map, [e.point.lat, e.point.lng]);
      });
    };

    MapEventListener.prototype.setPosition = function(target, lat, lng) {
      return target.setPosition(new BMap.Point(lng, lat));
    };

    MapEventListener.prototype.setMap = function(target, map) {
      return map.addOverlay(target);
    };

    return MapEventListener;

  })(window.cnmap.IMapEventListener);

  MapEventListener.factory = function() {
    return new cnmap.MapEventListener;
  };

  window.cnmap = window.cnmap || {};

  window.cnmap.MapEventListener = MapEventListener;

}).call(this);

//# sourceMappingURL=MapEventListenerImpl.js.map
