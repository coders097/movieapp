import express from 'express';
const router=express.Router();
import jwtVerify from '../middlewares/jwtAuthentication';
import User from '../models/User';

// @type  POST
// @route /bookmarkService/allBookmarks
// @desc  for getting all bookmarks
// @access PRIVATE
router.post("/allBookmarks",jwtVerify,async (req,res)=>{
    let {id}= req.body;
    console.log("Here",id);
    if(!id){
        res.status(404).json({
            success:false,
            error:"Invalid Url!"
        });
        return;
    }
    User.findById(id).then(user=>{
        res.status(200).json({
            success:true,
            data:user.bookmarks
        });
    }).catch(err=>{
        console.log(err);
        res.status(401).json({
            success:false,
            error:"SERVER PROBLEM!"
        });
    })
});


// @type  POST
// @route /bookmarkService/manageBookmark
// @desc  for adding/deleting a bookmark
// @access PRIVATE
router.post("/manageBookmark",jwtVerify,async (req,res)=>{
    let {id,type,data,command}=req.body;
    if(!id || !type || !data || !command){
        res.status(404).json({
            success:false,
            error:"Invalid Url!"
        });
        return;
    }
    if(type!=="MOViE" && type!=="SHOW" && type!=="ACTOR"){
        res.status(404).json({
            success:false,
            error:"Invalid Url!"
        });
        return;
    }
    if(command!=="ADD" && command!=="DEL"){
        console.log(command);
        res.status(404).json({
            success:false,
            error:"Invalid Url!"
        });
        return;
    }
    User.findById(id).then(user=>{
        switch(type){
            case "MOViE":
                if(command==="ADD") user.bookmarks.movies.push(data);
                else user.bookmarks.movies=user.bookmarks.movies.filter(bookmark=>bookmark.id!==data.id);
                break;
            case "SHOW":
                if(command==="ADD") user.bookmarks.shows.push(data);
                else user.bookmarks.shows=user.bookmarks.shows.filter(bookmark=>bookmark.id!==data.id);
                break;
            case "ACTOR":
                if(command==="ADD") user.bookmarks.actors.push(data);
                else user.bookmarks.actors=user.bookmarks.actors.filter(bookmark=>bookmark.id!==data.id);
                break;
        }
        user.save().then(()=>{
            res.status(200).json({
                success:true
            });
        }).catch(()=>{
            res.status(200).json({
                success:false,
                error:"SERVER PROBLEM!"
            });
        });
    }).catch(err=>{
        console.log(err);
        res.status(401).json({
            success:false,
            error:"SERVER PROBLEM!"
        });
    });
});


export default router;