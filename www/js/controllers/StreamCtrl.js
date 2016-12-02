
/* =============================================================== //
*  ====================== STREAM CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.streamctrl', [])

.controller('StreamCtrl', function($scope, Auth, $state, $stateParams, $document) {
  $scope.logGroup = $stateParams.logGroup.split('$').join('/')
  $scope.logStreamName = $stateParams.logStreamName
  $scope.connectionAction = "Connect"
  $scope.socketStatus = "Attempting connection..."
  $scope.logData = []
  var token = window.localStorage.getItem('aws-netmonitor-token')

  $scope.__statusSetConnected = function() {
    $scope.socketStatus = "Connection established"
    $scope.connectionAction = "Disconnect"
  }

  $scope.__statusSetDisconnected = function () {
    $scope.socketStatus = "Disconnected"
    $scope.connectionAction = "Connnect"
  }

  /*
  * handLogDataToApplication
  * 
  * Handles displaying any data received from the socket.
  * We should only display new rows when the count is different.
  */

  $scope.handLogDataToApplication = function() {
    $scope.__statusSetConnected()
    console.log("ready!!")

    SocketStream.logs.on('logdata', function(data) {

      console.log("Received log data!!", data)

      // If there was new data
      if($scope.logData.length !== data.events.length) {
        $scope.newLogLinesCount = data.events.length - $scope.logData.length
        console.log("[LOGGER]: " + $scope.newLogLinesCount + " new lines obtained. ")

        $scope.$apply(function() {
          $scope.logData = data.events
        })
      } 
    })
  }


  $scope.disconnect_reconnect = function() {
    // If connected, THEN DISCONNECT
    if($scope.socketStatus === "Connection established") {
      SocketStream.stop()
      $scope.__statusSetDisconnected()
      $scope.logData = []

    // If disconnected, ATTEMPT RECONNECTION
    } else {
      $scope.initializeSocket()
      $scope.socketStatus = "Attempting connection..."
    }
  }

  $scope.initializeSocket = function() {
    // Initialize the socket stream
    SocketStream.start(token, {
      logGroupName: $scope.logGroup,
      logStreamNames: [$scope.logStreamName]
    })
    .then($scope.handLogDataToApplication)
    .catch(function(err) {
      console.log("An error occurred", err)
    })
  }

  $scope.initializeSocket()


  // When we leave the page, kill the socket connection
  $scope.$on('$ionicView.leave', function(e) {
    console.log("lkjasldk")
    SocketStream.stop()
  });



})