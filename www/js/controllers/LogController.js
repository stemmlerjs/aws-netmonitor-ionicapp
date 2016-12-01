
/* =============================================================== //
*  ====================== LOGS CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.logcontroller', [])
  .controller('LogsCtrl', function($scope, Chats, Logs, Auth, $q, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.$on('$ionicView.enter', function(e) {
    $scope.dispatchGetLogGroups()
  });

  $scope.logGroups = []
  $scope.loaded = false;

  token = window.localStorage.getItem('aws-netmonitor-token')

  if(token) {
    Auth.verify(token)
      .then(function(response) {
        if(!response.data.success) {
          $state.go('login')
        }
      }).catch(function(err) {
        $state.go('login')
      })
  } else {
    $state.go('login')
  }

  $scope.dispatchGetLogGroups = function() {
    var defer = $q.defer()
    Logs.getLogGroups()
      .then(function(response) {
          $scope.logGroups = response.data.logGroups

          // Create human readable date time
          for(var i = 0; i < $scope.logGroups.length; i++) {
            var d = new Date($scope.logGroups[i].creationTime)
            $scope.logGroups[i].date = toJSONLocal(d)
          }

          $scope.loaded = true
          defer.resolve()
      })
      .catch(function(err) {
        console.log(err)
        defer.reject()
      })
    return defer.promise
  }

  $scope.dispatchGetLogGroups()
  

  $scope.doRefresh = function() {
    $scope.dispatchGetLogGroups()
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

  function toJSONLocal (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10) + ", " + ("0" + local.getHours()).slice(-2) + ":" + ("0" + local.getMinutes()).slice(-2);
  }

})

/* =============================================================== //
*  ================= LOG GROUP CONTROLLER ======================== //
*  =============================================================== //
*/

.controller('LogGroupCtrl', function($scope, $stateParams, Logs, Auth) {
  $scope.logGroup = $stateParams.logGroup.split('$').join('/')

  $scope.streams = []

  token = window.localStorage.getItem('aws-netmonitor-token')

  if(token) {
    Auth.verify(token)
      .then(function(response) {
        if(!response.data.success) {
          $state.go('login')
        }
      }).catch(function(err) {
        $state.go('login')
      })
  } else {
    $state.go('login')
  }

  Logs.getLogStreamsByGroupName($scope.logGroup)
    .then(function(response) {
      $scope.streams = response.data.streams.logStreams 

      // Create human readable date time
      for(var i = 0; i < $scope.streams.length; i++) {
        $scope.streams[i].creationTime = toJSONLocal(new Date($scope.streams[i].creationTime))
        $scope.streams[i].firstEventTimestamp = toJSONLocal(new Date($scope.streams[i].firstEventTimestamp))
        $scope.streams[i].lastEventTimestamp = toJSONLocal(new Date($scope.streams[i].lastEventTimestamp))
        $scope.streams[i].lastIngestionTime = toJSONLocal(new Date($scope.streams[i].lastIngestionTime))
      }

    })
    .catch(function(err) {
      //$state.go('tab.logs')
    })



  function toJSONLocal (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10) + ", " + ("0" + local.getHours()).slice(-2) + ":" + ("0" + local.getMinutes()).slice(-2);
  }
})