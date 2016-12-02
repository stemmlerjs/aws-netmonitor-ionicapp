
/* =============================================================== //
*  ====================== METRICS CONTROLLER ======================== //
*  =============================================================== //
*/

angular.module('app.controllers.metricscontroller', [])

.controller('MetricsController', function($scope, Auth, $state, $stateParams, EC2) {
  $scope.instanceId = $stateParams.instanceId
  $scope.metrics = []
  console.log("we're ready")

  EC2.getEC2Metrics($scope.instanceId)
    .then(function(response) {
      $scope.metrics = response.data.metrics
    })
    .catch(function(err) {

    })

})

.controller('MetricStatsController', function($scope, Auth, $state, $stateParams, EC2) {
  $scope.instanceId = $stateParams.instanceId
  $scope.metricName = $stateParams.metricName
  $scope.stats = {}

  var yesterday = new Date()
  var week1Ago  = new Date()
  var month1Ago = new Date()
  var month3Ago = new Date()

  yesterday.setDate(yesterday.getDate() - 1)
  week1Ago.setDate(week1Ago.getDate() - 7)
  month1Ago.setDate(month1Ago.getDate() - 30)
  month3Ago.setDate(month3Ago.getDate() - 90)

  $scope.dateChoices = [{
    choice: 'Yesterday',
    date: yesterday
  }, {
    choice: '1 week ago',
    date: week1Ago
  }, {
    choice: '1 month ago',
    date: month1Ago
  }, {
    choice: '3 months ago',
    date: month3Ago
  }]

  $scope.selectedStartDate = $scope.dateChoices[2]

  $scope.getMetricStats = function(selectedStartDate) {
    if (selectedStartDate !== undefined) {
      $scope.selectedStartDate = selectedStartDate
    }
    var requestObj = {
      startDate: $scope.selectedStartDate.date,
      endDate: new Date(),
      metricName: $scope.metricName,
      namespace: $scope.chosenMetric.Namespace,
      dimensions: [$scope.chosenMetric.Dimensions[0]]
    }

    EC2.getMetricStats(requestObj)
      .then(function(result) {
        console.log(result)
        $scope.stats = result.data.Datapoints[0]
      })
      .catch(function(err) {

      })
  }

  $scope.initialGetMetricStats = function() {
    EC2.getEC2Metrics($scope.instanceId)
      .then(function(response) {
        var metrics = response.data.metrics

        A: for(var i = 0; i < metrics.length; i++) {
          if(metrics[i].MetricName === $scope.metricName) {
            $scope.chosenMetric = metrics[i]
            break A
          }
        }

        $scope.getMetricStats()

      })
  }

  // Initial Get Stats
  $scope.initialGetMetricStats()

  



})