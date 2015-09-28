angular.module('app.controllers', [])

.controller('LoginController', function($scope) {})

.controller('LoginController', function($scope, $state, PARTICLE_CREDENTIALS) {
  $scope.logIn = function() {
    $state.go('devices');
  };
})

.controller('ControlsController', function($scope, $interval, Automator) {
  $scope.powerTail = { 'checked': true };
  $scope.particle = {
    'sensorVal': 0,
    'voltage':2.5,
    'temperature':20.0
  }
  
  $scope.updatePowerTail = function() {
    console.log($scope.powerTail);
    Automator.callFunction('led', {'arg':$scope.powerTail.checked}).success(function(data) {
      console.log(data);
    });
  };

  $scope.getTemperatureValues = function() {
    Automator.getVariable('temperature').success(function(data) {
      $scope.particle.temperature = data.result;
    });
  };

  $interval( function() { $scope.getTemperatureValues(); }, 2000);
});