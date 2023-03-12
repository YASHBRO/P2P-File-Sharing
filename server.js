import express from "express";
import dotenv from "dotenv";
import { ExpressPeerServer } from "peer";

import Logger from "./middleware/Logger.js";

import { handler } from "./client/build/handler.js";

dotenv.config();

const app = express();

const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(Logger);

// app.use(handler);

app.get("/test", (_req, res) => {
    res.send("Hello World");
});

const server = app.listen(port, function () {
    console.log(`App is listening to port ${port}`);
});

const peerServer = ExpressPeerServer(server);

app.use("/peerjs", peerServer);
