
/* =============================================================== //
*  ====================== LOGS CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.logcontroller', [])
  .controller('LogsCtrl', function($scope, Logs, Auth, $q, $state) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  $scope.$on('$ionicView.enter', function(e) {
    checkIfAuthed (Auth, $state)
    $scope.dispatchGetLogGroups()
  });

  $scope.logGroups = []
  $scope.loaded = false;


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
  

  $scope.doRefresh = function() {
    $scope.$apply(function() {
      $scope.logGroups = []
    })

    setTimeout(function() {
      $scope.dispatchGetLogGroups()
       .finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    },1000)

  };

  function toJSONLocal (date) {
    var local = new Date(date);
    var AM_PM = local.getHours() >= 12 ? 'pm' : 'am'
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10) + ", " + ("0" + local.getHours()).slice(-2) + ":" + ("0" + local.getMinutes()).slice(-2) + " " + AM_PM;
  }

})

/* =============================================================== //
*  ================= LOG GROUP CONTROLLER ======================== //
*  =============================================================== //
*/

.controller('LogGroupCtrl', function($scope, $stateParams, Logs, Auth, $state, $q) {
  $scope.logGroup = $stateParams.logGroup.split('$').join('/')

  $scope.streams = []

  $scope.getLogStreamsByGroupName = function() {
    var defer = $q.defer()
    Logs.getLogStreamsByGroupName($scope.logGroup)
      .then(function(response) {
        console.log(response)
        $scope.streams = response.data.streams.logStreams 

        // Create human readable date time
        for(var i = 0; i < $scope.streams.length; i++) {
          $scope.streams[i].creationTime = toJSONLocal(new Date($scope.streams[i].creationTime))
          $scope.streams[i].firstEventTimestamp = toJSONLocal(new Date($scope.streams[i].firstEventTimestamp))
          $scope.streams[i].lastEventTimestamp = toJSONLocal(new Date($scope.streams[i].lastEventTimestamp))
          $scope.streams[i].lastIngestionTime = toJSONLocal(new Date($scope.streams[i].lastIngestionTime))
        }
        defer.resolve()
      })
      .catch(function(err) {
        //$state.go('tab.logs')
        defer.reject()
      })
    return defer.promise
  }

  checkIfAuthed (Auth, $state)
  $scope.getLogStreamsByGroupName()

  $scope.doRefresh = function() {
    $scope.$apply(function() {
      $scope.streams = []
    })

    setTimeout(function() {
      $scope.getLogStreamsByGroupName()
        .finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    },1000)
  }

  // $scope.$on('$ionicView.enter', function(e) {
  //   checkIfAuthed (Auth, $state)
  //   $scope.getLogStreamsByGroupName()
  // });



  function toJSONLocal (date) {
    var local = new Date(date);
    local.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return local.toJSON().slice(0, 10) + ", " + ("0" + local.getHours()).slice(-2) + ":" + ("0" + local.getMinutes()).slice(-2);
  }
})