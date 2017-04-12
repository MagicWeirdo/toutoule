module.exports = function($authService, io) {
  io.on("connection", function(socket) {

    socket.on("disconnected", function() {
      
    });
  });
};
