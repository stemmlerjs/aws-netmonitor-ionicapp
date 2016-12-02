
/* =============================================================== //
*  ====================== MAIN CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.maincontroller', [])

.controller('MainController', function($scope, Auth, $state) {
  $scope.isAuthenticated = false
  $scope.submitErrorExists = false;
  $scope.submitError = ""

  $scope.username = ""
  $scope.password = ""

  var token = window.localStorage.getItem('aws-netmonitor-token')

  if (token) {

    // Validate token, then redirect
    Auth.verify(token)
      .then(function(response) {
        if (response.data.success){
          $state.go('tab.dash')
        }
      })
  }

  $scope.login = function() {
    Auth.login($scope.username, $scope.password)
      .then(function(response) {
        if (response.data.success) {
          var token = response.data.token

          window.localStorage.setItem('aws-netmonitor-token', token)

          $state.go('tab.dash')

        } else {
          $scope.submitError = response.data.message
          $scope.errorExists = true
        }
      })
      .catch(function(err) {
        if (status === -1) {
          $scope.submitError = "Server Error: Connection actively refused."
          $scope.errorExists = true
        } else {
          $scope.submitError = response.data.message
          $scope.errorExists = true
        }
      })
  }

})