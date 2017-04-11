var gambleApp = angular.module("gambleApp", [
  "ngRoute",
  "ngCookies",
  "login"
]);

// configure
gambleApp.config(
  ["$locationProvider", "$routeProvider"],
  function($locationProvider, $routeProvider) {
    $locationProvider.hashPrefix("!");

    $routeProvider.when("/login", {
      template: "<login-view></login-view>"
    }).otherwise("/login");
  }
);
