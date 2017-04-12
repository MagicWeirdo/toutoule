/**
 * @desc
 * 1. register socket with given username
 * 2. get socket with given username
 * 3. automatically remove socket when it is disconnected or encounters an error
**/
module.exports = {
  scope: "singleton",
  name: "$socketCollection",
  factory: function() {
    return {
      _list: [],
      /**
       * @public
       * @param {String} username
       * @param {Socket} socket
       * @desc
       * register a socket with given username
      **/
      put: function(username, socket) {
        this._list.push({
          username: username,
          socket: socket
        });
      },
      /**
       * 
      **/
      get: function(username) {

      }
    };
  }
};
