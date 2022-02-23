const mongoose = require("mongoose");
const dotenv  = require("dotenv");
const cors = require("cors");
const express = require("express");
const http = require('http');
const { Server } = require("socket.io");

require("colors");

dotenv.config();

(async function(){
    try{
    
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log(`connected to mongodb : ${conn.connection.host}`.blue.underline);

        const app = express();
        const server = http.createServer(app);
        const io = new Server(server,{
           cors:{
               origin : "*"
           }
        });
        const PORT = process.env.PORT || 5000;

        app.use(cors({
           origin: "*"
        }));

        app.use(express.json());
        app.use(express.urlencoded({
            extended:false
        }));

        app.use("/api/user/",require("./router/userRouter.js"));
        app.use("/api/project/",require("./router/projectRouter.js"));

        io.on('connection', (socket) => {
            socket.on("join-project", (id) => socket.join(id));
            socket.on("send-code", (projectId, code) =>
                socket.broadcast.to(projectId).emit("receive-code", code)
            );
        });

        server.listen(PORT,() => console.log(`App running at port ${PORT}`.white.underline));

    }catch(err){
        console.error(err);
        process.exit(1);
    }

})()
