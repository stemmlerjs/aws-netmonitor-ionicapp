
angular.module('app.controllers', [
  'app.controllers.maincontroller',
  'app.controllers.logcontroller',
  'app.controllers.dashcontroller',
  'app.controllers.metricscontroller',
  'app.controllers.streamctrl'
])


function checkIfAuthed (Auth, $state) {
  var t = window.localStorage.getItem('aws-netmonitor-token')


  if(t) {
    Auth.verify(t)
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
}
