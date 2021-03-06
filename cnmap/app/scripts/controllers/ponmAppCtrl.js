/**
 * Created by any on 2014/8/1.
 */
'use strict';

angular.module('ponmApp.Index',
  [ 'ngSanitize',
    'ponmApp',
    'ponmApp.controllers',
    'ponmApp.photos',
    'ponmApp.maps',
    'ponmApp.settings',
    'adminApp',
    'indexApp',
    'ponmApp.dynamic',
    'ponmApp.user',
    'ui.router',
    'ui.map',
    'ui.bootstrap',
    'ponm.Matchmedia',
    'LocalStorageModule'])
  .config(['$stateProvider', '$urlRouterProvider', '$locationProvider', 'uiMapLoadParamsProvider', '$sceDelegateProvider',
    function ($stateProvider, $urlRouterProvider, $locationProvider, uiMapLoadParamsProvider, $sceDelegateProvider) {

// Use $urlRouterProvider to configure any redirects (when) and invalid urls (otherwise).
      $urlRouterProvider

        // The `when` method says if the url is ever the 1st param, then redirect to the 2nd param
        // Here we are just setting up some convenience urls.
//                .when('/', '/yourphotos/all')

        // If the url is ever invalid, e.g. '/asdf', then redirect to '/' aka the home state
        .otherwise('/maps');
      //////////////////////////
      // State Configurations //
      //////////////////////////

      // Use $stateProvider to configure your states.
      $stateProvider

        //////////
        // Home //
        //////////

        .state("home", {
//                    abstract: true,
          // Use a url of "/" to set a states as the "index".
          url: "/",
          views: {

            // the main template will be placed here (relatively named)
            '': {template: '<div>home view</div>'},

            // for column two, we'll define a separate controller
            'navbar@': {
              templateUrl: 'views/ponm.navbar.html',
              controller: 'NavbarCtrl'
            }
          }

          // Example of an inline template string. By default, templates
          // will populate the ui-view within the parent state's template.
          // For top level states, like this one, the parent template is
          // the index.html file. So this template will be inserted into the
          // ui-view within index.html.
//                    template: '<p class="lead">Welcome to the UI-Router Demo</p>' +
//                        '<p>Use the menu above to navigate. ' +
//                        'Pay attention to the <code>$state</code> and <code>$stateParams</code> values below.</p>' +
//                        '<p>Click these links—<a href="#/c?id=1">Alice</a> or ' +
//                        '<a href="#/user/42">Bob</a>—to see a url redirect in action.</p>'

        })
      ;

      $sceDelegateProvider.resourceUrlWhitelist([
        // Allow same origin resource loads.
        'self',
        // Allow loading from our assets domain.  Notice the difference between * and **.
        'http://bdimg.share.baidu.com/**']);

      if(window.mapVendor == "baidu") {
        uiMapLoadParamsProvider.setParams({
          v: '2.0',
          ak:'kp3ODQt4pkpHMW2Yskl2Lwee'
        });
      }else if(window.mapVendor == "qq") {
        uiMapLoadParamsProvider.setParams({
          v: '2.0',
          key:'ZYZBZ-WCCHU-ETAVP-4UZUB-RGLDJ-QDF57'
        });
      }else if(window.mapVendor == "google") {
        uiMapLoadParamsProvider.setParams({
          key:'AIzaSyA9e11ZRebw8fHsd1ZIi0FLTXsrSQTc490'
        });
      }else if(window.mapVendor == "bing") {
        uiMapLoadParamsProvider.setParams({
          v:'7.0',
          mkt: 'zh-HK,en-US',
          key:'AhgYefMukpWZ3Y3MDp_oUztLbpDSGFkiqAgiKD7KNCurMLR2rDmwi9bM8N405mNX'
        });
      }else {
        uiMapLoadParamsProvider.setParams({
          v: '1.3',
          key:'53f7e239ddb8ea62ba552742a233ed1f'
        });
      }
    }])

  .run(['$rootScope', '$state', 'localStorageService', 'AuthService', '$cacheFactory',
    function ($rootScope, $state, localStorageService, AuthService, $cacheFactory) {

      $rootScope.cache = $cacheFactory('cacheId2');

      var unauthStateName = "unauthState";
      $rootScope.$on('$stateChangeStart',
        function (event, toState, toParams, fromState, fromParams) {

          if (fromState.name == "login") {
            AuthService.checkLogin().then(function () {
              }, function () {
              });
          }

          // 登录后转到之前未授权的页面
          var unauthState = localStorageService.get(unauthStateName);
          if (toState.name != "login") {
            if (unauthState) {
              AuthService.checkLogin().then(function () {
                $state.go(unauthState, {});
              }, function () {
              });
              localStorageService.set(unauthStateName, "");
            }
          }

          // 用户是否登录的检查，查看这些页面时需要登录
          if (toState.name == "maps.dynamic"
            || toState.name == "maps.upload"
            || toState.name == "dynamic.my"
            || toState.name == "photos") {
            AuthService.checkLogin().then(function () {
            }, function () {
              event.preventDefault();
              if (fromState.name == "login") {
                $state.go("maps.popular", {});
              } else {
                localStorageService.set(unauthStateName, toState.name);
                $state.go("login", {});
              }

            });
          }

          // transitionTo() promise will be rejected with
          // a 'transition prevented' error
        });

      $rootScope.$on('$stateChangeSuccess',
        function (event, toState, toParams, fromState, fromParams) {
          // 如果转到maps页面则设置页面为固定页面
          if (toState.name.indexOf("maps.") >= 0) {
            $rootScope.pageNavMode = "fixed";
          } else {
            $rootScope.pageNavMode = "";
          }
        });
    }])
  .controller('IndexCtrl',
  ['$window', '$location', '$rootScope', '$scope', 'PhotoService', 'UserService', '$modal',
    'ponmCtxConfig', '$log', '$state', '$stateParams', 'safeApply', 'jsUtils', 'HashStateManager', 'AuthService',
    function ($window, $location, $rootScope, $scope, PhotoService, UserService, $modal,
              ponmCtxConfig, $log, $state, $stateParams, safeApply, jsUtils, HashStateManager, AuthService) {

      $scope.checkLogin = function () {
        return AuthService.checkLogin();
      };

      $scope.checkLogin().then(function () {
        $scope.$broadcast("user.login");
      });

      $scope.displayLogin = function (photoId) {
        var modalInstance = $modal.open({
          templateUrl: 'views/ponm.login.html',
          controller: 'LoginCtrl',
          windowClass: 'photo-modal-fullscreen',
          resolve: {}
        });

        modalInstance.result.then(function () {
//                    $scope.$broadcast("login");
        }, function () {
//                    $scope.hashStateManager.set("photoid", "");
        });
      };
    }])
  .controller('AlertsCtrl',
  ['$window', '$rootScope', '$scope', 'ponmCtxConfig', '$log', '$state', '$stateParams', 'alertService',
    function ($window, $rootScope, $scope, ponmCtxConfig, $log, $state, $stateParams, alertService) {

      $scope.alertService = alertService;
    }])
;
