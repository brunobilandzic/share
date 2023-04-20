import { Server } from "socket.io";

export default async function SocketHandler(req, res) {
  if (res.socket.server.io) {
    console.log("Already set up");
    res.end();
    return;
  }

  const io = new Server(res.socket.server);
  res.socket.server.io = io;

  io.on("connection", (socket) => {
    socket.on("log-in", (userId) => {
      const userSocket = {
        socketId: socket.id,
        userId: userId,
      };
      if (io.onlineUsers === undefined) {
        io.onlineUsers = [userSocket];
      } else {
        if (
          io.onlineUsers
            ?.map((uSocket) => uSocket.userId)
            .includes(userSocket.userId)
        ) {
          const existingOnlineUserSocket = io.onlineUsers?.find(
            (uSocket) => uSocket.userId === userSocket.userId
          );
          existingOnlineUserSocket.socketId = userSocket.socketId;
          return;
        }
        io.onlineUsers.push(userSocket);
      }
    });
  });

  console.log("Set up socket");
  res.end();
}
