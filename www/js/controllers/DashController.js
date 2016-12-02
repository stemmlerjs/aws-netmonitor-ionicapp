
/* =============================================================== //
*  ====================== DASH CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.dashcontroller', [])

.controller('DashCtrl', function($scope, Auth, $state, EC2) {

  $scope.EC2s = []

  checkIfAuthed(Auth, $state)

  $scope.getEC2Instances = function() {

    function extractNameFromTags (tags) {
      var name = ''
      for(var i = 0; i < tags.length; i++) {
        if(tags[i].Key === "Name") {
          name = tags[i].Value 
        }
      }
      return name
    }

    EC2.getEC2Instances()
      .then(function(response) {
        console.log(response.data)
        var instances = response.data.ec2Instances

        for(var j = 0; j < instances.length; j++) {
          var name = extractNameFromTags(instances[j].Tags)
          instances[j].instanceName = name
          instances[j].LaunchTime = toJSONLocal(instances[j].LaunchTime)
        }



        $scope.EC2s = instances

      })
      .catch(function(err) {

      })
  }

  function toJSONLocal (date) {
    var local = new Date(date);
    var AM_PM = local.getHours() >= 12 ? 'pm' : 'am'
    local.setMinutes(local.getMinutes() - local.getTimezoneOffset());
    return local.toJSON().slice(0, 10) + ", " + ("0" + local.getHours()).slice(-2) + ":" + ("0" + local.getMinutes()).slice(-2) + " " + AM_PM;
  }


  $scope.getEC2Instances()

})
