// Generated by CoffeeScript 1.7.1
(function() {
  var $window, MapService,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  $window = window;

  MapService = (function(_super) {
    __extends(MapService, _super);

    function MapService(map) {
      this.map = map;
    }

    MapService.prototype.init = function(map, callback) {
      this.geocoder = new window.BMap.Geocoder();
      if (callback) {
        return callback.apply(this.geocoder, [this.geocoder]);
      }
    };

    MapService.prototype.getAddress = function(lat, lng, callback) {
      if (!this.geocoder) {
        this.init();
      }
      return this.geocoder.getLocation(new window.BMap.Point(lng, lat), function(result) {
        if (result) {
          return callback.apply(void 0, [result.address]);
        }
      });
    };

    MapService.prototype.getAddrPois = function(lat, lng, callback) {
      var deferred;
      deferred = jQuery.Deferred();
      this.geocoder.getLocation(new window.BMap.Point(lng, lat), function(result) {
        var addresses;
        console.log(result);
        addresses = {};
        if (result) {
          $.each(result.surroundingPois, function(index, poi) {
            var address;
            if (poi.title) {
              address = poi.address + " / " + poi.title;
            } else {
              address = poi.address;
            }
            return addresses[address] = {
              poiweight: 1,
              location: poi.point
            };
          });
        }
        return deferred.resolve(addresses, result.address);
      });
      return deferred.promise();
    };

    MapService.prototype.getLocation = function(address, callback) {
      if (!this.geocoder) {
        this.init();
      }
      return this.geocoder.getPoint(address, function(point) {
        if (point) {
          return callback.apply(void 0, [point]);
        }
      });
    };

    MapService.prototype.getLocPois = function(address) {
      var deferred;
      deferred = jQuery.Deferred();
      if (!this.geocoder) {
        this.init();
      }
      this.geocoder.getPoint(address, function(point) {
        var addresses;
        addresses = [];
        if (point) {
          addresses.push({
            address: address,
            location: point,
            similarity: 1
          });
        }
        return deferred.resolve(addresses);
      });
      return deferred.promise();
    };

    MapService.prototype.translate = function(lat, lng, callback) {};

    return MapService;

  })(window.cnmap.IMapService);

  MapService.factory = function() {
    return new window.cnmap.MapService;
  };

  window.cnmap = window.cnmap || {};

  window.cnmap.MapService = MapService;

}).call(this);

//# sourceMappingURL=MapServiceImpl.map
