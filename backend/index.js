import express from "express";
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
dotenv.config({path:"./config.env"});
import mongoose from 'mongoose';
const server=express();
import http from "http";


// Middlewares
server.use(cors());
server.use(express.urlencoded({
    extended:false
}));
server.use(express.json());
server.use(morgan("dev"));


// add routers
import Auth from "./auth/Auth"; 
server.use('/auth',Auth);
import FetchServiceMovieDB from './routes/fetchServiceMoviesDB';
server.use("/fetchService",FetchServiceMovieDB);
import BookMarkServiceMovieDB from './routes/bookMarksServiceMoviesDB';
server.use("/bookmarkService",BookMarkServiceMovieDB);


server.get("/",(req,res)=>{
    res.send("Yah! Working!");
});


// Connecting to db
// connecting to database
mongoose.connect(process.env.MONGO_URL,{useNewUrlParser:true,useUnifiedTopology:true});
const db=mongoose.connection;
db.on('error',()=>console.log("connection error"));
db.once('open',()=>{
    console.log("We are connected!");
});

// keeping alive
function startKeepAlive(){
    setInterval(()=>{
        let options={
            host:"movieapp097.herokuapp.com",
            port:80,
            path:"/"
        };
        http.get(options,(res)=>{
            res.on("data",(chunk)=>{
                try{
                    console.log(chunk);
                }catch(err){
                    console.log("err");
                }
            })
        }).on("error",(err)=>{
            console.log("err"+err.message);
        });
    },20*60*1000);
}
startKeepAlive();

const PORT=process.env.PORT || 3200;
server.listen(PORT,'localhost',()=>{
    console.log("Server running at http://localhost:3200/");
});