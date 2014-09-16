/**
 * Created by any on 2014/9/9.
 */
angular.module('ponmApp.services')
.factory('TravelManager', ['$q', 'TravelService', function ($q, TravelService) {

    function TravelManager(travel) {

        this.travel = travel;

        if(travel) {
            travel.photos = [];
            angular.forEach(travel.spots, function(spot, key) {
                travel.photos = travel.photos.concat(spot.photos);
            });
        }

        this.calculate = function() {
            var travel = this.travel;
            travel.photo_size = 0;
            angular.forEach(travel.spots, function(spot, key) {
                angular.forEach(spot.photos, function(photo, key) {
                    spot.time_start = spot.time_start || photo.date_time;
                    spot.time_end = spot.time_end || photo.date_time;
                    if(spot.time_start > photo.date_time ) {
                        spot.time_start = photo.date_time;
                    }
                    if(spot.time_end < photo.date_time ) {
                        spot.time_end = photo.date_time;
                    }
                });
                travel.photo_size += spot.photos.length;
                travel.time_start = travel.time_start || spot.time_start;
                if(spot.time_start < travel.time_start) {
                    travel.time_start = spot.time_start;
                }
                var time_end = spot.time_end || spot.time_start;
                travel.time_end = travel.time_end || time_end;
                if(time_end > travel.time_end) {
                    travel.time_end = time_end;
                }
            });

            angular.forEach(travel.spots, function(spot, key) {
                spot.day = Math.ceil((spot.time_start - travel.time_start) / (1000 * 60 * 60 * 24)) + 1;
            });
        };
    }

    return TravelManager;
}]);