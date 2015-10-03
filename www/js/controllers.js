angular.module('app.controllers', [])

.controller('LoginController', function($scope) {})

.controller('LoginController', function($scope, $state, PARTICLE_CREDENTIALS) {
  $scope.logIn = function() {
    $state.go('devices');
  };
})

.controller('ControlsController', function($scope, $timeout, Automator, PARTICLE_CREDENTIALS) {
  $scope.powerTail = { 'checked': false };
  $scope.particle = {
    'temperature':'',
    'triggerTemp': {
      'value': '',
      'min': 65,
      'max': 90,
      'step': .5,
      'set': ''
    }
  }
  
  $scope.updatePowerTail = function() {
    Automator.callFunction('toggleLed', {'arg':$scope.powerTail.checked}).success(function(data) {
      console.log(data);
      $scope.getLedStatus();
    });
  };

  $scope.getTemperatureValues = function() {
    Automator.getVariable('temperature').success(function(data) {
      $scope.particle.temperature = data.result;
    });
  };

  $scope.getTriggerTemp = function() {
    Automator.getVariable('triggerTemp').success(function(data) {
      $scope.particle.triggerTemp.set = data.result;
      $scope.particle.triggerTemp.value = data.result;
    });
  };

  $scope.getLedStatus = function() {
    Automator.getVariable('ledStatus').success(function(data) {
      if (data.result == 1) {
        $scope.powerTail.checked = true;
      } else {
        $scope.powerTail.checked = false;
      }
    });
  };

  $scope.setTriggerTemp = function() {
    $timeout(function() {
      if ($scope.particle.triggerTemp.set != $scope.particle.triggerTemp.value) {
        Automator.callFunction('tempTrigger', {'arg':$scope.particle.triggerTemp.value}).success(function(data) {
          $scope.getTriggerTemp();
          $scope.getLedStatus();
        });
      }
    }, 500);
  };

  $scope.subscribeTemperatureValues = function () {
    $scope.updating = false;

    if (typeof(EventSource) !== "undefined") {
      // Yes! Server-sent events support!
      var source = new EventSource('https://api.particle.io/v1/events?access_token=' + PARTICLE_CREDENTIALS.AUTH_TOKEN);
      source.onopen = function(event) {
        console.log(event)
      }

      source.onmessage = function (event) {
        console.log(event);
        $scope.openListingsReport = JSON.parse(event.data);
        $scope.$apply();
        console.log($scope.openListingsReport);
      };

      source.onerror = function(error) {
         console.log(error);
       }

      // Subscribe to specific events
      source.addEventListener('roomTemp', function(data) {
        $scope.particle.temperature = JSON.parse(event.data).data;
        $scope.$apply();
      }, false);

      source.addEventListener('Uptime', function(data) {
        // console.log(JSON.parse(event.data).data);
        $scope.$apply();
      }, false);

    } else {
      // Sorry! No server-sent events support..
      alert('SSE not supported by browser.');
    }

    $scope.update = function () {
      $scope.updateTime = Date.now();
      $scope.updating = true;
      rpOpenListingsSvc.update();
    }

    $scope.reset = function () {
      $scope.updating = false;
    }
  }

  $scope.getTriggerTemp();
  $scope.getLedStatus();
  $scope.subscribeTemperatureValues();
});