// Generated by CoffeeScript 1.7.1
(function() {
  var TravelLayer,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  TravelLayer = (function(_super) {
    __extends(TravelLayer, _super);

    function TravelLayer() {
      return TravelLayer.__super__.constructor.apply(this, arguments);
    }

    TravelLayer.prototype.initMap = function(map) {
      var photo, point, spot, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
      if (map) {
        this.map = map;
      }
      this.calcSpotTime();
      this.labels = [];
      point = [];
      if (this.travel) {
        _ref = this.travel.spots;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          spot = _ref[_i];
          _ref1 = spot.photos;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            photo = _ref1[_j];
            this.labels.push(this.createMarker(photo));
          }
          point = [];
          _ref2 = spot.photos;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            photo = _ref2[_k];
            point.push(this.createPoint(photo));
          }
          spot.polyline = new google.maps.Polyline({
            map: this.map,
            path: point,
            strokeWeight: 2
          });
          _results.push(this.labels.push(spot.polyline));
        }
        return _results;
      }
    };

    TravelLayer.prototype.createPoint = function(photo) {
      return new google.maps.LatLng(photo.point.lat, photo.point.lng);
    };

    TravelLayer.prototype.createMarker = function(photo) {
      var marker, that;
      that = this;
      marker = new google.maps.Marker({
        map: this.map,
        position: this.createPoint(photo),
        icon: this.getMarkerImage(photo)
      });
      marker.photo = photo;
      if (this.opts.clickable) {
        google.maps.event.addListener(marker, 'click', function(e) {
          return jQuery(that).trigger("data_clicked", [this.photo.id]);
        });
      }
      photo.marker = marker;
      return marker;
    };

    TravelLayer.prototype.removeMarker = function(photo) {
      if (photo.marker) {
        photo.marker.setMap(null);
        return delete photo.marker;
      }
    };

    TravelLayer.prototype.toggleSpotLine = function(spot, visible) {
      if (spot.polyline) {
        return spot.polyline.setVisible(visible);
      }
    };

    TravelLayer.prototype.setSpotEditable = function(spot, editable) {
      var editMarker, photo, that, _i, _len, _ref, _results;
      editable = !!editable;
      that = this;
      editMarker = function(marker) {
        if (marker) {
          marker.setDraggable(editable);
          if (that.opts.editable && editable) {
            return marker.dragListener = google.maps.event.addListener(marker, 'dragend', function(e) {
              if (!this.photo.oPoint) {
                this.photo.oPoint = $.extend({}, this.photo.point);
              }
              this.photo.point.lat = e.latLng.lat();
              this.photo.point.lng = e.latLng.lng();
              that.updateSpotLine(spot);
              return $(that).trigger("spot.edited", [spot.id]);
            });
          } else if (marker.dragListener) {
            google.maps.event.removeListener(marker.dragListener);
            return marker.dragListener = null;
          }
        }
      };
      if (this.opts.editable) {
        _ref = spot.photos;
        _results = [];
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          photo = _ref[_i];
          _results.push(editMarker(photo.marker));
        }
        return _results;
      }
    };

    TravelLayer.prototype.cancelSpotEdit = function(spot) {
      var cancelMarker, photo, that, _i, _len, _ref;
      that = this;
      cancelMarker = function(photo) {
        if (photo.oPoint) {
          photo.point = photo.oPoint;
          delete photo.oPoint;
        }
        if (photo.marker) {
          return photo.marker.setPosition(that.createPoint(photo));
        }
      };
      _ref = spot.photos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        photo = _ref[_i];
        cancelMarker(photo);
      }
      return this.updateSpotLine(spot);
    };

    TravelLayer.prototype.updateSpotLine = function(spot) {
      var photo, points, _i, _len, _ref;
      points = [];
      _ref = spot.photos;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        photo = _ref[_i];
        points.push(this.createPoint(photo));
      }
      if (spot.polyline) {
        return spot.polyline.setPath(points);
      } else {
        spot.polyline = new google.maps.Polyline({
          map: this.map,
          path: points,
          strokeWeight: 2
        });
        return this.labels.push(spot.polyline);
      }
    };

    TravelLayer.prototype.clearMap = function() {
      $.each(this.labels, function(index, label) {
        label.setMap(null);
        return label.setVisible(false);
      });
      return this.labels = [];
    };

    return TravelLayer;

  })(window.cnmap.ITravelLayer);

  window.cnmap.TravelLayer = TravelLayer;

}).call(this);

//# sourceMappingURL=MapTravelImpl.map
