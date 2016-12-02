angular.module('starter.services', [])

.factory('Auth', function($http) {
  var auth = {

    login: function(username, password) {
      return $http({
        url: config.baseUrl + "/api/authenticate",
        method: 'POST',
        data: {
          username: username,
          password: password
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    },

    verify: function(token) {
      return $http({
        url: config.baseUrl + "/api/verify",
        method: "POST",
        data: {
          token: token
        },
        headers: {
          'Content-Type': 'application/json'
        }
      })
    }
  }

  return auth
})

.factory('Logs', function($http) {


  var logs = {

    /*
    * For main log page. Retrns all of the different log groups.
    */

    getLogGroups: function() {
      var token = window.localStorage.getItem('aws-netmonitor-token')
      console.log("is it null", token)

      return $http({
        url: config.baseUrl + '/api/log/groups',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        } 
      })
    },

    /*
    * getLogStreamsByGroupName
    *
    * Returns all the streams for a particular log group name.
    *
    * @param {String} groupName
    */

    getLogStreamsByGroupName: function(groupName) {
      var token = window.localStorage.getItem('aws-netmonitor-token')
      console.log("is it null", token)

      return $http({
        url: config.baseUrl + '/api/log/streams',
        method: 'POST',
        data: {
          groupName: groupName
        },
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        } 
      })
    }

  }

  return logs
})

.factory('EC2', function($http) {

  var EC2 = {

    getEC2Instances: function () {
      var token = window.localStorage.getItem('aws-netmonitor-token')
      return $http({
        url: config.baseUrl + '/api/ec2',
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      })
    },

    getEC2Metrics: function(instanceId) {
      var token = window.localStorage.getItem('aws-netmonitor-token')
      return $http({
        url: config.baseUrl + '/api/ec2/' +instanceId+ "/metrics",
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        }
      })

    },

    getMetricStats: function (reqObj) {
      var token = window.localStorage.getItem('aws-netmonitor-token')
      return $http({
        url: config.baseUrl + '/api/ec2/metrics/stats',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-access-token': token
        },
        data: reqObj
      })
    }
  }

  return EC2
})

.factory('Chats', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data
  var chats = [{
    id: 0,
    name: 'Ben Sparrow',
    lastText: 'You on your way?',
    face: 'img/ben.png'
  }, {
    id: 1,
    name: 'Max Lynx',
    lastText: 'Hey, it\'s me',
    face: 'img/max.png'
  }, {
    id: 2,
    name: 'Adam Bradleyson',
    lastText: 'I should buy a boat',
    face: 'img/adam.jpg'
  }, {
    id: 3,
    name: 'Perry Governor',
    lastText: 'Look at my mukluks!',
    face: 'img/perry.png'
  }, {
    id: 4,
    name: 'Mike Harrington',
    lastText: 'This is wicked good ice cream.',
    face: 'img/mike.png'
  }];

  return {
    all: function() {
      return chats;
    },
    remove: function(chat) {
      chats.splice(chats.indexOf(chat), 1);
    },
    get: function(chatId) {
      for (var i = 0; i < chats.length; i++) {
        if (chats[i].id === parseInt(chatId)) {
          return chats[i];
        }
      }
      return null;
    }
  };
})
