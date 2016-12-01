
/*
* Client-Socket 
*
* This .js file is responsible for connection to the server and receiving log data.
*
* TODO: Fix issue, find a way to handle execution after when
*   - connect to server
*   - close server conn
*   - let connection timeout
*/

window.SocketStream = new (function() {

  // Instance Variables

  var socket = null;
  var shouldAttemptReconnectionOnDisconnect = true
  var logDataEventListener = new EventEmitter();
  var _jwt = null 
  var _logStreamParams = null 

  /*
  * ===================== Public Constructor =========================
  */

  return {
    start: start,

    stop: function () {
      shouldAttemptReconnectionOnDisconnect = false
      socket.disconnect() 
    },

    logs: logDataEventListener
  }

  /**
  * start
  *
  * Public exposed method to attempt to connect to server and initialize 
  * the socket application. Uses jwt to authenticate and log stream params
  * to initialize the stream.
  *
  * @params {Object} logStreamParams
  */

  function start (jwt, logStreamParams) {
    return new Promise(function(resolve, reject) {
      _jwt = jwt
      _logStreamParams = logStreamParams

      // Attempt Connection To Server
      attemptConnnection()
        .then(function() {
          // Successful connection

          console.log("[State] ESTABLISHED: Connection Established to server. ")
          authenticate(jwt)
            // Auth success
            .then(function() {
              resolve()

              initLogStream(logStreamParams)

            })
            // Auth error
            .catch(handleStartupError)

        })
        // Timeout
        .catch(handleStartupError)

        function handleStartupError(err) {
          reject(err)
        }
    })

  }

  /*
  * ========================= Private Methods ==============================
  */

  /**
  * initLogStream
  *
  * STATE: ESTABLISHED - Send LOG_STREAM_REQUEST to server.
  * STATE: STREAMING - On receipt of LOG_STREAM_REPONSE from server.
  *
  * @params {Object} logStreamParams
  */

  function initLogStream(logStreamParams) {

    console.log("[State] ESTABLISHED: Sending LOG_STREAM_REQ to server. ")
    socket.emit('LOG_STREAM_REQUEST', logStreamParams)

    socket.on('LOG_STREAM_RESPONSE', function(response) {

      // Successful Response
      if (response.success) {
        console.log("[State] ESTABLISHED: Received 'SUCCESS' LOG_STREAM_RESPONSE from server. ")
        console.log("[State] STREAMING: Listening for logging data. ")

        socket.on('logdata', function(data) {
          logDataEventListener.emit('logdata', data)
        })

      // Failure Response
      } else {
        console.log("[State] ESTABLISHED: Received 'FAILURE' LOG_STREAM_RESPONSE from server.")


      }
    })
  }

  /**
  * connect()
  *
  * STATE: CONNECTION_ATTEMPT
  * Attempts to form a connection with the server with configuration port and address
  * 
  * @return {Promise}
  */

  function attemptConnnection () {
    return new Promise(function(resolve, reject) {
      socket = io(config.serverAddr + ":" + config.serverPort);
      console.log("[State] CONNECTION_ATTEMPT: Attempting to connect to server ")
      
      var CONN_TIMEOUT_PARAMS = [3 * 1000]

      var retransmissionAttempts = 0;

      var timeout = setInterval(function () {
        console.log("[State] CONNECTION_ATTEMPT: CONN_TIMEOUT hit ", CONN_TIMEOUT_PARAMS[0])

        if (retransmissionAttempts === 10) {
          clearTimeout(timeout)
          reject({
            code: "retransmission_expired"
          })
        }
        retransmissionAttempts++

      }, CONN_TIMEOUT_PARAMS[0])

      socket.on('connect', function() {
        clearTimeout(timeout);
        // Cancel timeout
        resolve()
      })
    })
  }

  /**
  * authenticate()
  * 
  * @param {String}   jwt
  * @return {Promise}
  */

  function authenticate (jwt) {
    return new Promise(function(resolve, reject) {
      socket
        .emit('authenticate', {token: jwt}) //send the jwt
        .on('authenticated', function() {
          resolve()
          setDisconnectionHandler()
        })
        .on('unauthorized', function(msg) {
          console.log("unauthorized: " + JSON.stringify(msg.data));
          reject(new Error(msg.data.type))
        })
    })
  }

  /*
  * setDisconnectionHandler
  * 
  * On successful authenticatino, sets the disconnection handler 'reconnectionProcedure' Function.
  * 
  * @return void
  */

  function setDisconnectionHandler () {
    console.log("[State] AUTHENTICATED: Successfuly authenticated with JWT. ")

    socket.on('disconnect', reconnectionProcedure)
  }

  /*
  * reconnectionProcdeure
  *
  * On SERVER disconnect, we will attempt to reconnect to the server until it's up.
  * This ends only on CLIENT disconnect setting 'shouldAttemptReconnectionOnDisconnect' to false.
  *
  * @return void
  */

  function reconnectionProcedure () {
    console.log("[State] DISCONNECTED: Lost connection to the server. ")

    if(shouldAttemptReconnectionOnDisconnect) {
      socket.disconnect()
      socket = null

      // Attempt to reconnect
      start(_jwt, _logStreamParams)
        .then(function(yol) {
          console.log("lkjasd", yol)
        })
        .catch(function(err) {
          if(err.code == "invalid_token") {
            socket = null 
            socket.disconnect()

            console.log("Closed until user obtains a new JWT", err.code)
          } else {
            socket = null 
            socket.disconnect()

            console.log("Closed")
          }
        })
    }

    
  }

})()


// // Test Harness
// var jwt = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7InVzZXJfaWQiOjQsInVzZXJfdXNlcm5hbWUiOiJrc3RlbW1sZXIiLCJjcmVhdGVkQXQiOiIyMDE2LTExLTI5VDAxOjM2OjIyLjk0MloifSwiaWF0IjoxNDgwNTQ1Mzk5LCJleHAiOjE0ODA1NTI1OTl9.bSq41HFrB9pPY4gbdEhndwCLFBgPDB9ULVmQsWe30JM"

// var logParams = {
//   logGroupName: "/var/log/messages",
//   logStreamNames: ["i-0fb837bcaaa38bc3d", "i-0449133481c0b5822"]
// }

// stream.start(jwt, logParams)
//   .then(handLogDataToApplication)
//   .catch(function(err) {
//     console.log("It didn't work!!", err)
//   })

//   function handLogDataToApplication () {

//     console.log("ready!!")

//     stream.logs.on('logdata', function(data) {

//       console.log("Received log data!!", data)

//     })

//   }













