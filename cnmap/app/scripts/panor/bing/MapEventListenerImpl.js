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
        if (this.target) {
          point = this.target.getCenter();
          return callback.apply(this, [point.latitude, point.longitude, this.target.getZoom()]);
        }
      };
      listeners.push(Microsoft.Maps.Events.addHandler(map, "viewchangeend", MapListener));
      return listeners;
    };

    MapEventListener.prototype.addToolBar = function(map) {};

    MapEventListener.prototype.setCenter = function(map, lat, lng) {
      return map.setView({
        center: new Microsoft.Maps.Location(lat, lng)
      });
    };

    MapEventListener.prototype.setZoom = function(map, zoom) {
      return map.setView({
        zoom: zoom
      });
    };

    MapEventListener.prototype.setZoomAndCenter = function(map, zoom, lat, lng) {
      return map.setView({
        center: new Microsoft.Maps.Location(lat, lng),
        zoom: zoom
      });
    };

    MapEventListener.prototype.zoomIn = function(map) {
      return this.setZoom(map, map.getZoom() + 1);
    };

    MapEventListener.prototype.zoomOut = function(map) {
      return this.setZoom(map, map.getZoom() - 1);
    };

    MapEventListener.prototype.setBounds = function(map, sw, ne) {
      var viewRect;
      viewRect = Microsoft.Maps.LocationRect.fromCorners(new Microsoft.Maps.Location(ne.lat, sw.lng), new Microsoft.Maps.Location(sw.lat, ne.lng));
      return map.setView({
        bounds: viewRect
      });
    };

    MapEventListener.prototype.inMapView = function(lat, lng, map) {
      map = map || this.opts.map;
      return map.getBounds().contains(new Microsoft.Maps.Location(lat, lng));
    };

    MapEventListener.prototype.pixelToPoint = function(map, pixel) {
      var loc;
      loc = map.tryPixelToLocation(new Microsoft.Maps.Point(pixel.x, pixel.y), Microsoft.Maps.PixelReference.control);
      return {
        lat: loc.latitude,
        lng: loc.longitude
      };
    };

    MapEventListener.prototype.pointToPixel = function(map, point) {
      return map.tryLocationToPixel(new Microsoft.Maps.Location(point.lat, point.lng), Microsoft.Maps.PixelReference.control);
    };

    MapEventListener.prototype.addMarker = function(map, lat, lng) {
      var marker;
      marker = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lng));
      map.entities.push(marker);
      return marker;
    };

    MapEventListener.prototype.createDraggableMarker = function(map, lat, lng) {
      var marker;
      marker = new Microsoft.Maps.Pushpin(new Microsoft.Maps.Location(lat, lng), {
        draggable: true
      });
      map.entities.push(marker);
      return marker;
    };

    MapEventListener.prototype.activeMarker = function(marker) {
      if (marker) {
        return marker.setOptions({
          icon: "images/marker.png",
          zIndex: 2
        });
      }
    };

    MapEventListener.prototype.deactiveMarker = function(marker) {
      if (marker) {
        return marker.setOptions({
          icon: "",
          zIndex: 1
        });
      }
    };

    MapEventListener.prototype.addMarkerActiveListener = function(marker, callback) {
      var ActiveListener;
      ActiveListener = function(e) {
        return callback.apply(marker, []);
      };
      Microsoft.Maps.Events.addHandler(marker, 'click', ActiveListener);
      Microsoft.Maps.Events.addHandler(marker, 'dblclick', ActiveListener);
      Microsoft.Maps.Events.addHandler(marker, 'dragend', ActiveListener);
      return Microsoft.Maps.Events.addHandler(marker, 'rightclick', ActiveListener);
    };

    MapEventListener.prototype.addDragendListener = function(marker, callback) {
      return Microsoft.Maps.Events.addHandler(marker, 'dragend', function(e) {
        var loc;
        loc = e.entity.getLocation();
        return callback.apply(marker, [loc.latitude, loc.longitude]);
      });
    };

    MapEventListener.prototype.removeMarker = function(marker, map) {
      return map.entities.remove(marker);
    };

    MapEventListener.prototype.addMapClickListener = function(map, callback) {
      return Microsoft.Maps.Events.addHandler(map, 'click', function(e) {
        var loc, point;
        if (e.targetType === "map" && !e.mouseMoved) {
          point = new Microsoft.Maps.Point(e.getX(), e.getY());
          loc = e.target.tryPixelToLocation(point);
          return callback.apply(map, [loc.latitude, loc.longitude]);
        }
      });
    };

    MapEventListener.prototype.setPosition = function(target, lat, lng) {
      return target.setLocation(new Microsoft.Maps.Location(lat, lng));
    };

    MapEventListener.prototype.setMap = function(target, map) {};

    return MapEventListener;

  })(window.cnmap.IMapEventListener);

  MapEventListener.factory = function() {
    return new cnmap.MapEventListener;
  };

  window.cnmap = window.cnmap || {};

  window.cnmap.MapEventListener = MapEventListener;

}).call(this);

//# sourceMappingURL=MapEventListenerImpl.js.map
