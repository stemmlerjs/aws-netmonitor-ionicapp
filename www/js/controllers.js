angular.module('app.controllers', [
  'app.controllers.maincontroller',
  'app.controllers.logcontroller'
])


/* =============================================================== //
*  ====================== DASH CONTROLLER ======================== //
*  =============================================================== //
*/

.controller('DashCtrl', function($scope) {

  $scope.doRefresh = function() {
    $http.get('/new-items')
     .success(function(newItems) {
       $scope.items = newItems;
     })
     .finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };

})


.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
