/**
 * Created by any on 14-4-1.
 */
'use strict';
angular.module('ponmApp.settings', [
    'ui.bootstrap',
    'ngAnimate',
    'ui.router',
    'ponmApp',
    'xeditable',
    'perfect_scrollbar'
])
    .config([   '$stateProvider', '$urlRouterProvider',
        function ($stateProvider, $urlRouterProvider) {
            $urlRouterProvider

                // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
                // Here we are just setting up some convenience urls.
                .when('/settings', '/settings/account')

                // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
//                .otherwise('/popular')
            ;
            // Use $stateProvider to configure your states.
            $stateProvider
                .state("settings", {
                    abstract: true,
                    // Use a url of "/" to set a states as the "index".
                    url: "/settings",
                    views: {

                        // the main template will be placed here (relatively named)
                        '': { templateUrl: 'views/settings.html',
                            controller: 'UserSettingsCtrl'},

                        // for column two, we'll define a separate controller
                        'navbar': {
                            templateUrl: 'views/ponm.navbar.html',
                            controller: 'NavbarCtrl'
                        }
                        ,'alert': {
                            templateUrl: 'views/ponm.alert.html',
                            controller: 'AlertsCtrl'
                        }
                    }
                })
                .state("settings.account", {
                    url: "/account",
                    templateUrl: 'views/settings.account.html',
                    controller: "SettingsAccountCtrl"
                })
                .state("settings.password", {
                    url: "/password",
                    templateUrl: 'views/settings.password.html',
                    controller: "SettingsPasswordCtrl"
                })
                .state("settings.security", {
                    url: "/security",
                    templateUrl: 'views/settings.security.html',
                    controller: "SettingsSecurityCtrl"
                })
                .state("settings.notifications", {
                    url: "/notifications",
                    templateUrl: 'views/settings.notifications.html',
                    controller: "SettingsNotificationsCtrl"
                })
                .state("settings.map", {
                    url: "/map",
                    templateUrl: 'views/settings.map.html',
                    controller: "SettingsMapCtrl"
                })
                .state("settings.photo", {
                    url: "/photo",
                    templateUrl: 'views/settings.photo.html',
                    controller: "SettingsPhotoCtrl"
                })
            ;
        }])
    .controller('UserSettingsCtrl',
    ['$window', '$log', '$location', '$rootScope', '$scope', '$modal', '$state', 'SettingsService', 'UserService',
        'ponmCtxConfig', 'AuthService', 'alertService',
        function ($window, $log, $location, $rootScope, $scope, $modal, $state, SettingsService, UserService,
                  ponmCtxConfig, AuthService, alertService) {

            $scope.ctx = ponmCtxConfig.ctx;
            $scope.staticCtx = ponmCtxConfig.staticCtx;
            $scope.apirest = ponmCtxConfig.apirest;
            $scope.ponmCtxConfig = ponmCtxConfig;
            $scope.$state = $state;

            $scope.alertService = alertService;
            $scope.alertService.options.alone = true;
            $scope.alertService.options.ttl = 3000;

            AuthService.checkLogin().then(function(){
                $scope.userId = ponmCtxConfig.userId;
                getSettings();
            }, function(){
                $state.go("login", {});
            });

            $scope.changeAvatar = function () {
                var modalInstance = $modal.open({
                    templateUrl: 'views/changeUserAvatar.html',
                    controller: "ChUserAvatarCtrl",
                    windowClass: 'avatar-upload-modal',
                    resolve: {
                    }
                });

                modalInstance.result.then(function (avatar) {
                    $scope.ponmCtxConfig.avatar = avatar;
                    $scope.user && ($scope.user.avatar = avatar);
                }, function (avatar) {
                    $log.debug("dismissed avatar is " + avatar);
                    if(avatar) {
                        $scope.ponmCtxConfig.avatar = avatar;
                        $scope.user && ($scope.user.avatar = avatar);
                    }
                });
            };

            function getSettings() {
                // 获取图片的用户信息
                UserService.getOpenInfo({userId: $scope.userId}, function (data) {
                    if (data.status == "OK") {
                        $scope.user = data.open_info;
                    }
                });

                SettingsService.get({userId: $scope.userId}, function(res) {
                    if(res.status == "OK") {
                        $scope.settings = res.settings;
                    }
                });
            }

        }])
    .controller('SettingsAccountCtrl',
    ['$window', '$log', '$location', '$rootScope', '$scope', '$modal', '$state', 'SettingsService', 'alertService',
        'ponmCtxConfig',
        function ($window, $log, $location, $rootScope, $scope, $modal, $state, SettingsService, alertService,
                  ponmCtxConfig) {

            $scope.changeAccount = function() {
                $scope.saving = true;
                SettingsService.changeAccount({userId: $scope.userId}, $scope.settings, function(res) {
                    $scope.saving = false;
                    if(res.status == "OK") {
                        $scope.alertService.add("success",  "保存成功!", {ttl: 1000});
                    }else {
                        $scope.alertService.add("danger", "保存失败!", {ttl: 1000});
                    }
                });
            };

        }])
    .controller('SettingsPasswordCtrl',
    ['$window', '$log', '$location', '$rootScope', '$scope', '$modal', '$state', 'SettingsService', 'alertService',
        function ($window, $log, $location, $rootScope, $scope, $modal, $state, SettingsService, alertService) {

            $scope.changePassword = function() {
                $log.debug("changePassword");
                SettingsService.changePassword({userId: $scope.userId}, $scope.password, function(res) {
                    $log.debug(res.status);
                    $scope.saving = false;
                    if(res.status == "OK") {
                        $scope.alertService.add("success",  "更改成功!", {ttl: 1000});
                    }else {
                        $scope.alertService.add("danger", "更改失败 " + res.info, {ttl: 1000});
                    }
                }, function(error) {
                    $log.debug(error);
                    if(error.data) {
                        if(error.data.status == "PARAM_ERROR" && error.data.info == "currentPassword") {
                            $scope.alertService.add("danger", "当前密码错误!", {ttl: 2000});
                        }
                    }
                });
            };

        }])
    .controller('SettingsSecurityCtrl',
    ['$window', '$log', '$location', '$rootScope', '$scope', '$modal', '$state', 'UserPhoto', 'UserService',
        'ponmCtxConfig', 'AuthService', 'alertService',
        function ($window, $log, $location, $rootScope, $scope, $modal, $state, UserPhoto, UserService,
                  ponmCtxConfig, AuthService, alertService) {

        }])
    .controller('SettingsNotificationsCtrl',
    ['$window', '$log', '$location', '$rootScope', '$scope', '$modal', '$state', 'UserPhoto', 'UserService',
        'ponmCtxConfig', 'AuthService', 'alertService',
        function ($window, $log, $location, $rootScope, $scope, $modal, $state, UserPhoto, UserService,
                  ponmCtxConfig, AuthService, alertService) {

        }])
    .controller('SettingsMapCtrl',
    ['$window', '$log', '$location', '$rootScope', '$scope', '$modal', '$state', 'SettingsService', 'alertService',
    function ($window, $log, $location, $rootScope, $scope, $modal, $state, SettingsService, alertService) {

        $scope.changeMapVendor = function() {

            $scope.saving = true;
            SettingsService.changeMapVendor({userId: $scope.userId}, $scope.settings, function(res) {

                $scope.saving = false;
                if(res.status == "OK") {
                    $scope.alertService.add("success",  "保存成功!", {ttl: 1000});
                    $window.location.reload();
                }else {
                    $scope.alertService.add("danger", "保存失败!", {ttl: 1000});
                }
                });
        };
    }])
    .controller('SettingsPhotoCtrl',
    ['$window', '$log', '$filter', '$rootScope', '$scope', '$modal', '$state', 'UserPhoto', 'SettingsService',
        'ponmCtxConfig', 'AuthService', 'alertService',
        function ($window, $log, $filter, $rootScope, $scope, $modal, $state, UserPhoto, SettingsService,
                  ponmCtxConfig, AuthService, alertService) {

            $scope.$watch("settings", function(settings) {
                if(!settings) {
                    return;
                }
                if(!settings.storage_space) {
                    settings.storage_space = 0;
                }

                var storageRate = ( settings.storage_space / (10*1024*1024*1024) ) * 100;
                storageRate = $filter('number')(storageRate, 1);
                if(0 !== storageRate && storageRate < 0.1) {
                    storageRate = 0.1;
                }

                $scope.storageRate = storageRate;
                $scope.capacity = {
                    type: "success",
                    value: storageRate,
                    stacked: []
                };

                if(storageRate > 90) {
                    $scope.capacity.type = 'danger';
                    $scope.capacity.stacked.push({
                        type: "success",
                        value: "70"
                    });
                    $scope.capacity.stacked.push({
                        type: "warning",
                        value: "20"
                    });
                    $scope.capacity.stacked.push({
                        type: "danger",
                        value: storageRate-90
                    });
                }else if(storageRate > 70 ) {
                    $scope.capacity.type = 'warning';
                    $scope.capacity.stacked.push({
                        type: "success",
                        value: "70"
                    });
                    $scope.capacity.stacked.push({
                        type: "warning",
                        value: storageRate-70
                    });
                }else {
                    $scope.capacity.stacked.push({
                        type: "success",
                        value: storageRate
                    });
                }

            });

            $scope.changeUpload = function() {
                $scope.saving = true;
                SettingsService.changeUpload({userId: $scope.userId}, $scope.settings, function(res) {
                    $scope.saving = false;
                    if(res.status == "OK") {
                        ponmCtxConfig.settings.autoUpload = $scope.settings.auto_upload;
                        $scope.alertService.add("success",  "保存成功!");
                    }else {
                        $scope.alertService.add("danger", "保存失败 " + res.info);
                    }
                }, function(error) {
                    if(error.data) {
                        if(error.data.status == "PARAM_ERROR" && error.data.info == "currentPassword") {
                            $scope.alertService.add("danger", "当前密码错误!");
                        }
                    }
                });
            };

        }])

;