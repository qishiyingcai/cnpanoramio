'use strict';

angular.module('fileuploadApp', [
    'ngResource',
    'ngAnimate',
    'ui.bootstrap',
    'blueimp.fileupload',
    'ui.map',
    'ponmApp',
    'xeditable'
])
    .config([
        '$httpProvider', 'fileUploadProvider', '$logProvider',
        function ($httpProvider, fileUploadProvider, $logProvider) {
            delete $httpProvider.defaults.headers.common['X-Requested-With'];
            fileUploadProvider.defaults.redirect = window.location.href.replace(
                /\/[^\/]*$/,
                '/cors/result.html?%s'
            );

//                if (isOnGitHub) {
//                    // Demo settings:
            angular.extend(fileUploadProvider.defaults, {
//                autoUpload: false,
                autoUpload: !window.dev,

                // Enable image resizing, except for Android and Opera,
                // which actually support image resizing, but fail to
                // send Blob objects via XHR requests:
//                        disableImageResize: /Android(?!.*Chrome)|Opera/
//                            .test(window.navigator.userAgent),
                maxFileSize: 10000000
//                        loadImageMaxFileSize: 10000000,
//                        imageQuality: 2000000,
                ,acceptFileTypes: /(\.|\/)(gif|jpe?g|png)$/i
//                        disableImageResize: /Android(?!.*Chrome)|Opera/
//                            .test(window.navigator && navigator.userAgent),
                //previewMaxWidth: 200,
                //previewMaxHeight: 200,
                //previewCrop: true, // Force cropped images,
                //previewCanvas: false
//                        disableImageMetaDataLoad: true,
//                        imageMinHeight: 1098,
//                        imageMaxWidth: 5000,
//                        imageMaxHeight: 2000

            });
//                }
        }
    ])

    .controller('DemoFileUploadController',
    [ '$window', '$scope', '$http', 'fileUpload', '$modal', '$log', '$q', 'PhotoService', 'GPSConvertService',
        'LoginUserService', 'UserService', 'TravelService', 'jsUtils', 'safeApply', 'ponmCtxConfig', 'alertService',
        'MessageService',
        function ($window, $scope, $http, fileUpload, $modal, $log, $q, PhotoService, GPSConvertService,
                  LoginUserService, UserService, TravelService, jsUtils, safeApply, ponmCtxConfig, alertService,
                  MessageService ) {

            $scope.apirest = $window.apirest;
            $scope.ctx = $window.ctx;
            $scope.userId = ponmCtxConfig.userId;
            $scope.$watch(function() {
                return ponmCtxConfig.userId;
            }, function(userId) {
                $scope.userId = userId;
            });

            // copy a local message service
            $scope.alertService = angular.copy(alertService);
            $scope.alertService.options.alone = true;
            $scope.alertService.options.ttl = 1000;

            var mapService = new $window.cnmap.MapService();

            $scope.options = {

                url: $scope.apirest+"/photo/upload",

                formData: function () {
                    var lat = this.files[0].lat || 0,
                        lng = this.files[0].lng || 0,
                        address = this.files[0].address || '',
                        vendor = ponmCtxConfig.getCoordSS(this.files[0].vendor);
                    return [
                        {
                            name: "lat",
                            value: lat
                        },
                        {
                            name: "lng",
                            value: lng
                        },
                        {
                            name: "address",
                            value: address
                        },
                        {
                            name: "vendor",
                            value: vendor
                        }
                    ]
                },

                done: function (e, data) {
                    if (data.result.status == "OK") {
                        var photo = data.result.prop;
                        data.files[0].$submit = false;
                        data.files[0].$cancel = false;
                        data.files[0].$endestroy = true;
                        extractProps(data.files[0], photo);

                        data.files[0].saveProperties();
                        data.files[0].saveTags();
                        updateTravelPhotos();
                    } else if (data.result.status == "NO_AUTHORIZE") {
                        data.files[0].error = "请重新登录";
                        data.files[0].$endestroy = false;
                    } else {
                        data.files[0].error = data.result.info;
                        data.files[0].$endestroy = false;
                    }
                },
                fail: function(e, data) {
                    if (data.result) {
                        if(data.result.status == "NO_AUTHORIZE") {
                            data.files[0].error = "请重新登录";
                        }
                        if(data.result.status == "ACCESS_DENIED") {
                            data.files[0].error = "请重新登录";
                        }
                        data.files[0].$cancel = function () {
                            data.files[0].$destroy();
                        };
                    }else {
                        fileUpload.defaults.fail(e, data);
                    }
                }
            };

            $scope.photos = [];
            /**
             * 从server返回的图片属性中抽取信息给file
             *
             * @param file
             * @param photo
             */
            function extractProps(file, photo) {
                file.photoId = photo.id;
                file.is360 = photo.is360;
                file.vendor = ponmCtxConfig.getCoordSS(photo.vendor);
                if(photo.point && photo.point.lat != 0 && photo.point.lng != 0) {
                    file.lat = photo.point.lat;
                    file.lng = photo.point.lng;

                    file.latPritty = cnmap.GPS.convert(file.lat);
                    file.lngPritty = cnmap.GPS.convert(file.lng);
                }

                $scope.$emit('photoAdd', photo);

                angular.forEach($scope.queue, function(qFile, key) {
                    if(qFile === file) {
                        $scope.photos[key] = photo;
                    }
                });
            }

            if(!fileUpload.defaults.autoUpload) {
                // TODO DEBUG
                $scope.options.add =
                    function (e, data) {
                        if (e.isDefaultPrevented()) {
                            return false;
                        }
                        // call default add method
                        fileUpload.defaults.add(e, data);
                        // load image's gps info
                        var file = data.files[0];
                        loadImage.parseMetaData(file, function (data) {
                            if (data.exif) {
                                var lat = data.exif.getText('GPSLatitude');
                                if (lat && lat != "undefined") {
                                    file.lat = cnmap.GPS.convert(lat);
                                    var latRef = data.exif.getText('GPSLatitudeRef');
                                    file.latRef = latRef;
                                }

                                var lng = data.exif.getText('GPSLongitude');
                                if (lng && lng != "undefined") {
                                    file.lng = cnmap.GPS.convert(lng);
                                    var lngRef = data.exif.getText('GPSLongitudeRef');
                                    file.lngRef = lngRef;
                                }

                                file.latPritty = cnmap.GPS.convert(file.lat);
                                file.lngPritty = cnmap.GPS.convert(file.lng);

                                // 转换坐标体系
                                if (file.lng || file.lat) {
                                    GPSConvertService.convert({
                                        'lat': file.lat,
                                        'lng': file.lng
                                    }, function (data) {
                                        file.lat = data.lat;
                                        file.lng = data.lng;
                                        file.vendor = "gaode";
                                        file.latPritty = cnmap.GPS.convert(file.lat);
                                        file.lngPritty = cnmap.GPS.convert(file.lng);

//                                            mapService.getAddress(file.lat, file.lng, function(res) {
//                                                file.address = res;
//                                            });

//                                            GeocodeService.regeo({lat: file.lat, lng: file.lng}, function(regeocode) {
//                                                file.address = regeocode.formatted_address;
//                                            });

                                        // TODO DEBUG
                                        $scope.$emit('photoAdd', {id: file.photoId, point: {lat: file.lat, lng: file.lng}});
                                    });
                                }
                            }
                        });

                        // TODO DEBUG
                        $scope.photoCount = $scope.photoCount || 0;
                        $scope.photoCount += 1;
                        if($scope.photoCount % 2 == 1) {
                            file.photoId = $scope.photoCount;
                            $scope.$emit('photoAdd', {id: $scope.photoCount});
                        }
                        $scope.photos.push({id: $scope.photoCount});
                    }
            }

            function convertPritty(file) {
                file.latPritty = cnmap.GPS.convert(file.lat);
                file.lngPritty = cnmap.GPS.convert(file.lng);
            }

            $scope.$on("photoReverseAddress", function(e, photo) {
                $log.debug("photoReverseAddress : " + photo.id);
                angular.forEach($scope.queue, function(file, key) {
                    if(file.photoId == photo.id) {
                        safeApply($scope, function() {
                            file.mapVendor = photo.mapVendor;
                            file.address = photo.mapVendor.address;
                            file.lat = photo.mapVendor.lat;
                            file.lng = photo.mapVendor.lng;
                            convertPritty(file);

                            file.saveProperties();
                        });
                    }
                });
            });

            /**
             * change image's gps location
             *
             * @param file
             */
//            $scope.changeLocation = function (files) {
//                var modalInstance = $modal.open({
//                    templateUrl: 'views/changeLocationModal.html',
//                    controller: "ChLocModalCtrl",
//                    windowClass: 'map-photo-modal',
//                    resolve: {
//                        'files': function () {
//                            return files;
//                        }
//                    }
//                });
//
//                modalInstance.result.then(function (selectedItem) {
//                    angular.forEach(selectedItem, function (file, key) {
//                        file.saveProperties();
//                    });
//                }, function () {
//                    $log.info('Modal dismissed at: ' + new Date());
//                });
//            };

            // 异步加载用户travels数据
            $scope.loadTravelData = function (callback) {
                var deferred = $q.defer();
                var travels = UserService.getTravels({userId: $scope.userId}, function (res) {
                    if (res.status == "OK") {
                        deferred.resolve(res.open_info.travels);
//                        callback && callback.apply(undefined, [res.open_info.travels]);
                    }
                });
//                $log.debug(travels);
                return deferred.promise;
            };

            // 用户创建travel
            $scope.newTravelData = function (newObj, callback) {
                $log.debug("new data: " + newObj);
                var deferred = $q.defer();
                TravelService.create({}, jsUtils.param({travel: newObj}), function (res) {
                    if (res.status == "OK") {
                        deferred.resolve(res.travel);
//                        callback && callback.apply(undefined, [res.travels]);
                    }else {
                        deferred.reject();
                    }
                },function(error) {
                    deferred.reject();
                });
                return deferred.promise;
            };

            $scope.loadTagData = function (callback) {
                $log.debug("load tags data");
                var deferred = $q.defer();
                UserService.getTags({userId: $scope.userId}, function (res) {
                    if (res.status == "OK") {
                        deferred.resolve(res.open_info.tags);
//                        callback && callback.apply(undefined, [res.open_info.tags]);
                    }else {
                        deferred.reject();
                    }
                },function(error) {
                    deferred.reject();
                });
                return deferred.promise;
            };

            $scope.newTagData = function (newObj, callback) {
                $log.debug("new data: " + newObj);
                var deferred = $q.defer();
                UserService.createTag({userId: $scope.userId, value: newObj},
                    function (res) {
                        if (res.status == "OK") {
                            deferred.resolve(newObj);
//                            callback && callback.apply(undefined, [res.open_info.tags]);
                        }else {
                            deferred.reject();
                        }
                    },function(error) {
                        deferred.reject();
                    });
                return deferred.promise;
            };

            // 当travel值有变化时，更新所有photo到新的travel上
            $scope.$watch('travel', function (newTravel) {
                updateTravelPhotos(newTravel);
            });

            /**
             * 更新photo所属的travel
             */
            function updateTravelPhotos(travel) {
                if (!travel) {
                    return;
                }
                var photos = [];

                angular.forEach($scope.queue, function (file, key) {
                    if (file.photoId) {
                        photos.push(file.photoId);
                    }
                });
                if (photos.length) {

                    // todo DEBUG
//                    $scope.alertService.add("success", "更新成功", {ttl: 1000});

                    TravelService.addPhoto({travelId: travel.id},
                        jsUtils.param({photos: photos.join(",")}), function (res) {
                            if (res.status == "OK") {
                                $scope.alertService.add("success", "更新成功");
                            }else {
                                $scope.alertService.add("danger", "更新失败:" + res.info, {ttl: 3000});
                            }
                        },function(error) {
                            $scope.alertService.add("danger", "更新失败", {ttl: 3000});
                        });
                }

            }

            // 当抬头tag值有变化时，更新所有photo的tags
            $scope.$watch('tags', function (newTags) {
                angular.forEach($scope.queue, function (file, key) {
                    if (file.photoId) {
                        file.saveTags();
                    }
                });
            });

            /**
             * 上传图片后发布图片消息
             */
            $scope.publishMessages = function() {
                // todo DEBUG
                angular.forEach($scope.queue, function (file, key) {
                    if (file.photoId && !file.messageId) {
                        MessageService.save({}, {
                            "type": "photo",
                            "photo": {
                                "id": file.photoId
                            }
                        }, function(res) {
                            if(res.status == "OK") {
                                file.messageId = res.message.id;
                            }
                        },function(error) {
                            file.messageId = true;
                        });
                    }
                });

            };
        }
    ])
    .controller('PhotoUploadRowCtrl', [
        '$scope', '$http', '$q', '$log', 'PhotoService', 'jsUtils',
        function ($scope, $http, $q, $log, PhotoService, jsUtils) {

            $scope.activePhoto = function(file) {
                $scope.$emit('photoActive', {id: file.photoId});
                $scope.activeFile && ($scope.activeFile.active = false);
                $scope.activeFile = null;
                if(file.photoId) {
                    file.active = true;
                    $scope.activeFile = file;
                }

            };

            $scope.$on("photoReverseActive", function(e, photo) {
                if($scope.activeFile && $scope.activeFile.photoId == photo.id) {
                    return;
                }
                $scope.activeFile && ($scope.activeFile.active = false);
                angular.forEach($scope.queue, function(file, key) {
                    if(file.photoId == photo.id) {
                        file.active = true;
                        $scope.activeFile = file;
                    }
                });
            });

            $scope.$on("editableViewChanged", function(e, editableView) {
                if(editableView) {
//
                }else {
//
                }
            });

            $scope.saveProperties = function(type, data) {
                var d = $q.defer();
                if($scope.file.photoId) {
                    var photoProps = {
                        'title': $scope.file.title,
                        'description': $scope.file.description,
                        'point': {
                            'lat': $scope.file.lat,
                            'lng': $scope.file.lng,
                            'address': $scope.file.address
                        },
                        'vendor': $scope.file.vendor,
                        'is360': $scope.file.is360
                    };
                    if(type == "address") {
                        photoProps.point[type] = data;
                    }else {
                        photoProps[type] = data;
                    }

                    PhotoService.updateProperties({photoId: $scope.file.photoId}, photoProps,
                        function (res) {
                        if (res.status == "OK") {
                            d.resolve()
                        }else {
                            d.resolve(res.info);
                        }
                    }, function(error) {
                        if(error.data) {
                            d.reject(error.data.info);
                        }else {
                            d.reject('Server error!');
                        }
                    });
                }else {
                    $timeout(function() {
                        if(type == "address") {
                            $scope.file.point[type] = data;
                        }else {
                            $scope.file[type] = data;
                        }
                    }, 500);
                }
                return d.promise;
            };

            var file = $scope.file,
                state;

            file.tags = [];

            $scope.indoor = {
                tag: "室内"
            };

            file.saveProperties = function () {
                if (this.photoId) {
                    var _this = this;
                    PhotoService.updateProperties({photoId: _this.photoId}, {
                        'title': _this.title,
                        'description': _this.description,
                        'point': {
                            'lat': _this.lat,
                            'lng': _this.lng,
                            'address': _this.address
                        },
                        'vendor': _this.vendor,
                        'is360': _this.is360
                    }, function (data) {
                        if (data) {
                            $scope.alertService.add("success", "更新成功");
//                            $log.debug("properties update successful");
                        }
                    },function(error) {
                        $scope.alertService.add("danger", "更新失败", {ttl: 3000});
                    })
                }
            };

            file.saveTags = function () {

                var _this = this;
                var tags = [];

                if(!_this.photoId) {
                    return;
                }

                if($scope.indoor.is) {
                    tags.push($scope.indoor.tag);
                }
                tags = tags.concat(_this.tags || []).concat($scope.tags || []);

                PhotoService.tag({photoId: _this.photoId}, tags, function (data) {
                    if (data) {
                        $scope.alertService.add("success", "更新成功");
//                        $log.debug("tags update successful");
                    }
                },function(error) {
                    $scope.alertService.add("danger", "更新失败", {ttl: 3000});
                });
            };

            $scope.$watch('file.tags', function (newTags) {
                file.saveTags();
            });

            $scope.$watch('file.is360', function (newTags) {
                file.saveProperties();
            });

            $scope.$watch('indoor.is', function (indoor) {
                file.saveTags();
            });

            $scope.onDragStart = function(e, ui) {
//                $log.debug(e);
                $log.debug("drag photo id = " + file.photoId);
                e.photoId = file.photoId;
            };

        }])

    .controller('FileDestroyController', [
        '$scope', '$log', 'PhotoService',
        function ($scope, $log, PhotoService) {
            var file = $scope.file,
                state;

            file.$state = function () {
                return state;
            };

            file.$destroy = function () {
                if(file.photoId) {
                    state = 'pending';
                    PhotoService.delete({photoId: file.photoId}, function (data) {
                        if (data) {
                            state = 'resolved';
                        } else {
                            state = 'rejected';
                        }
                    });
                }

                $scope.clear(file);

            };

//                file.$cancel = function () {
//                    data.abort();
//                    $scope.clear(file);
//                };
            if (!file.$cancel && !file._index) {
                file.$cancel = function () {
                    $scope.clear(file);
                    $log.debug("delete upload photo: " + file.name);
                };
            }

            /**
             * 删除上传的图片
             *
             * @param file
             */
            $scope.delete = function(file) {
                $log.debug("delete upload photo: " + file.name);

                if(file.photoId) {
                    file.$destroy();
                }else {
                    file.$cancel();
                }
                $scope.$emit('photoDelete', {id: file.photoId});
            }
        }
    ])
;
