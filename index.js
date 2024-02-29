const express = require("express");
const mongoose = require("mongoose");
const env = require("dotenv");
const cors = require("cors");
// const { userRoute } = require("./Routes/userRoute");
const userRouter = require("./Routes/userRoute");
const messageRouter = require("./Routes/messageRoutes");
const socket = require("socket.io")


env.config();

const URI = process.env.MONGODB_URI;
const PORT = process.env.PORT;
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());


// Routes
app.use("/", (req, res) => {
    res.send("Welcome to snappy chat app");
});
app.use("/api/auth/", userRouter);
app.use("/api/messages", messageRouter);


// DB CONNECTION
mongoose.connect(URI, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log("MongoDB Connected!!!")
    }
});


const server = app.listen(PORT, (err) => {
    if (err) {
        console.log(err);
    } else {
        console.log(`Server running on PORT: ${PORT}`);
    }
});

const io = socket(server, {
    cors: {origin: "*"}
});

// create global online users map....
global.onlineUsers = new Map();

// INITIALIAZATION
io.on("connection", (socket) => {
    // console.log("a user connected", socket.id);
    global.chatSocket = socket;

    // add users
    socket.on("add-user", (userId) => {
        // set users online (conneted to socket) to the global online users
        onlineUsers.set(userId, socket.id)
        // console.log(onlineUsers, chatSocket)
    });

    // send message to a user
    socket.on("send-msg", async (data) => {
        // get the receiver (to) from the data and the onlineusers 
        const sendToUserSocket = await onlineUsers.get(data.to);
        await console.log(data, sendToUserSocket)

        // check if user is online
        if (sendToUserSocket) {
            // emit the message to the specified user 
            // ## socket.to(specifiedUser).emit("event", data);
    
            socket.to(sendToUserSocket).emit("msg-receive", data.message);
        }
    });


    // disconnected user
    socket.on("disconnect", () => {
        console.log("user disconnected", socket.id);
        console.log(onlineUsers);
    });
});