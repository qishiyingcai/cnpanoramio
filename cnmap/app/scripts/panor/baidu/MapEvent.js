// Generated by CoffeeScript 1.8.0
(function() {
  var BMap, MapEvent,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  BMap = window.BMap;

  MapEvent = (function(_super) {
    __extends(MapEvent, _super);

    function MapEvent() {
      return MapEvent.__super__.constructor.apply(this, arguments);
    }

    MapEvent.prototype.trigger = function(instance, eventName) {
      var args, listener, listeners, _i, _len, _results;
      listeners = instance._e_ || {};
      _results = [];
      for (_i = 0, _len = listeners.length; _i < _len; _i++) {
        listener = listeners[_i];
        if (!(listener._eventName === eventName)) {
          continue;
        }
        args = Array.prototype.slice.call(arguments, 2);
        _results.push(listener._handler.apply(instance, args));
      }
      return _results;
    };

    return MapEvent;

  })(window.ponm.IMapEvent);

  window.ponm.MapEvent = new MapEvent;

}).call(this);

//# sourceMappingURL=MapEvent.js.map
