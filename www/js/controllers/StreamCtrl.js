
/* =============================================================== //
*  ====================== STREAM CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.streamctrl', [])

.controller('StreamCtrl', function($scope, Auth, $state, $stateParams) {
  $scope.logGroup = $stateParams.logGroup.split('$').join('/')
  $scope.logStreamName = $stateParams.logStreamName

  $scope.connectionAction = "Connect"

  $scope.socketStatus = "Disconnected"

  $scope.logData = []

  var token = window.localStorage.getItem('aws-netmonitor-token')

  $scope.handLogDataToApplication = function() {
        console.log("ready!!")

    SocketStream.logs.on('logdata', function(data) {

      console.log("Received log data!!", data)

      $scope.$apply(function() {
              $scope.logData = data.events
            })

    })
  }

  SocketStream.start(token, {
    logGroupName: $scope.logGroup,
    logStreamNames: [$scope.logStreamName]
  })
  .then($scope.handLogDataToApplication)
  .catch(function(err) {
    console.log("An error occurred", err)
  })



})