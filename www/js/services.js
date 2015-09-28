angular.module('app.services', [])

.factory('Automator', ['$http', 'PARTICLE_CREDENTIALS', '$httpParamSerializerJQLike', 'PARTICLE', function($http, PARTICLE_CREDENTIALS, $httpParamSerializerJQLike, PARTICLE) {
	return {
		
		callFunction: function(functionName, data) {
			return $http({
				url: PARTICLE.baseUrl + '/devices/' + PARTICLE.deviceId + '/' + functionName,
				method: 'POST',
				data: $httpParamSerializerJQLike(data),
				headers: {
					'Authorization': 'Bearer ' + PARTICLE_CREDENTIALS.AUTH_TOKEN,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
		},
		getVariable: function(variableName){
			return $http({
				url: PARTICLE.baseUrl + '/devices/' + PARTICLE.deviceId + '/' + variableName,
				method: 'GET',
				headers: {
					'Authorization': 'Bearer ' + PARTICLE_CREDENTIALS.AUTH_TOKEN,
					'Content-Type': 'application/x-www-form-urlencoded'
				}
			});
		}
	}
}]);