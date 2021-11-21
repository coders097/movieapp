import express from 'express';
const router=express.Router();
import jwtVerify from '../middlewares/jwtAuthentication';
import fetch from 'node-fetch';
const apikey="985c5a83c66571b9db65fbae360eba47";


// @type  POST
// @route /fetchService/allMoviesOrShows
// @desc  for getting movies or shows
// @access PRIVATE
router.post("/allMoviesOrShows",jwtVerify,async (req,res)=>{
    let {type,page,id,media}=req.body;
    if(!(media==="tv") && !(media==="movie")){
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }
    let link="https://api.themoviedb.org/3/";
    switch(type){
        case "trending":
            link+=`trending/${media}/week?api_key=${apikey}`;
        break;
        case "popular":
            link+=`${media}/popular?api_key=${apikey}&language=en-US`;
            if(page) link+=`&page=${page}`;
        break;
        case "top_rated":
            link+=`${media}/top_rated?api_key=${apikey}&language=en-US`;
            if(page) link+=`&page=${page}`;
        break;
        case "similar":
            if(!id){
                res.status(404).json({
                    success:false,
                    error:"Invalid URL!"
                });
                return;
            }
            link+=`${media}/${id}/similar?api_key=${apikey}&language=en-US`;
            if(page) link+=`&page=${page}`;
        break;
        default:
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
    }
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }
        let _results=[];
        data.results.forEach(e=>{
            let obj=(media==="movie")?{
                backdrop_path:e.backdrop_path,
                genre_ids:e.genre_ids,
                id:e.id,
                original_title:e.original_title,
                overview:e.overview,
                poster_path:e.poster_path,
                release_date:e.release_date,
                vote_average:e.vote_average
            }:{
                backdrop_path:e.backdrop_path,
                genre_ids:e.genre_ids,
                id:e.id,
                name:e.name,
                overview:e.overview,
                poster_path:e.poster_path,
                vote_average:e.vote_average,
                first_air_date:e.first_air_date
            };
            _results.push(obj);
        });
        res.status(200).json({
            success:true,
            data:_results
        });
    }catch(e){
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});


// @type  POST
// @route /fetchService/getMovieOrTVCastCrew
// @desc  for getting the casts & crews of movie or tv
// @access PRIVATE
router.post("/getMovieOrTVCastCrew",jwtVerify,async (req,res)=>{
    let {id, type}=req.body;
    if(!id || !type){
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }

    let link=`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apikey}&language=en-US`;
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }

        let _crew=data.crew?.splice(0,10).map(e=>{
            return {
                gender:e.gender,
                id:e.id,
                known_for_department:e.known_for_department,
                name:e.name,
                profile_path:e.profile_path,
                job:e.job
            };
        });
        let _cast=data.cast?.sort((a,b)=>a.order-b.order).splice(0,10).map(e=>{
            return {
                gender:e.gender,
                id:e.id,
                known_for_department:e.known_for_department,
                name:e.name,
                profile_path:e.profile_path,
                character:e.character,
                order:e.order,
            };
        });
        res.status(200).json({
            success:true,
            data:{
                crew:_crew,
                cast:_cast
            }
        });
    }catch(e){
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});




// @type  POST
// @route /fetchService/getMovieOrTVTrailer
// @desc  for getting the trailer of movie or tv
// @access PRIVATE
router.post("/getMovieOrTVTrailer",jwtVerify,async (req,res)=>{
    let {id,type}=req.body;
    if(!id || !type){
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }

    let link=`https://api.themoviedb.org/3/${type}/${id}/videos?api_key=${apikey}&language=en-US`;
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }
        let results={};
        let temp=data.results.find(e=>e.site==="YouTube");
        if(temp){
            results["key"]=temp.key;
        }
        res.status(200).json({
            success:true,
            data:results
        });
    }catch(e){
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});



// @type  GET
// @route /fetchService/getAllGenre
// @desc  for getting all types of genre
// @access PUBLIC
router.get('/getAllGenre/:type',async (req,res)=>{
    let type=req.params.type;
    let link="https://api.themoviedb.org/3/";
    if(type==="tv"){
        link+=`genre/tv/list?api_key=${apikey}&language=en-US`;
    }else if(type==="movie"){
        link+=`genre/movie/list?api_key=${apikey}&language=en-US`;
    }else{
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }

    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
    
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"SERVER PROBLEM!"
            });
            return;
        }
        res.status(200).json({
            success:true,
            data:data.genres
        });
    }catch(e){
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});


// @type  POST
// @route /fetchService/getAllSeasons
// @desc  for getting all types of seasons
// @access PRIVATE
router.post('/getAllSeasons',jwtVerify,async (req,res)=>{
    let {id}=req.body;
    if(!id){
        console.log("here");
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }
    let link=`https://api.themoviedb.org/3/tv/${id}?api_key=985c5a83c66571b9db65fbae360eba47&language=en-US`;
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(401).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }
// air_date: "2016-09-19",
// episode_count: 18,
// id: 78529,
// name: "Season 2",
// overview: "Lucifer returns for another season, but his devil-may-care attitude may soon need an adjustment: His mother is coming to town.",
// poster_path: "/fTQzbse8HKh0z6UJbMUumdbZ8PX.jpg",
// season_number: 2
        let results=[];
        data.seasons.forEach(_data=>results.push(_data));
        res.status(200).json({
            success:true,
            data:results
        });
    }catch(e){
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});


// @type  POST
// @route /fetchService/getAllEpisodes
// @desc  for getting all episodes of season
// @access PRIVATE
router.post('/getAllEpisodes',jwtVerify,async (req,res)=>{
    let {id,season}=req.body;
    if(!id || !season){
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }
    let link=`https://api.themoviedb.org/3/tv/${id}/season/${season}?api_key=985c5a83c66571b9db65fbae360eba47&language=en-US`;
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }
        let results=data.episodes.map(_data=>{
            return {
                air_date:_data.air_date,
                name:_data.name,
                overview:_data.overview,
                still_path:_data.still_path
            };
        });
        res.status(200).json({
            success:true,
            data:results
        });
    }catch(e){
        console.log(e);
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }

});

// @type  POST
// @route /fetchService/getAllPics
// @desc  for getting all pics of actor
// @access PRIVATE
router.post('/getAllPics',jwtVerify,async (req,res)=>{
    let {id}=req.body;
    if(!id){
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }
    let link=`https://api.themoviedb.org/3/person/${id}/images?api_key=985c5a83c66571b9db65fbae360eba47`;
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }
        res.status(200).json({
            success:true,
            data:data.profiles
        });
    }catch(e){
        console.log(e);
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});

// @type  POST
// @route /fetchService/getAllShowsOrMoviesOfActor
// @desc  for getting all tv shows of actor
// @access PRIVATE
router.post('/getAllShowsOrMoviesOfActor',jwtVerify,async (req,res)=>{
    let {id,type}=req.body;
    if(!id || !type){
        res.status(404).json({
            success:false,
            error:"Invalid URL!"
        });
        return;
    }
    let link=`https://api.themoviedb.org/3/person/${id}/${type}_credits?api_key=985c5a83c66571b9db65fbae360eba47&language=en-US`;
    try{
        let data=(await (await fetch(link,{method:"GET"})).json());
        if(("success" in data) && (data.success===false)){
            res.status(404).json({
                success:false,
                error:"Invalid URL!"
            });
            return;
        }
        res.status(200).json({
            success:true,
            data:data.cast.sort((a,b)=>b.popularity-a.popularity)
        });
    }catch(e){
        console.log(e);
        res.status(404).json({
            success:false,
            error:"SERVER Problem!"
        });
    }
});

// @type  POST
// @route /fetchService/searchForMovies&Shows
// @desc  for search
// @access PRIVATE
router.post("/searchForMovies&Shows",jwtVerify,async (req,res)=>{
    let {searchText}=req.body;
    if(!searchText){
        res.status(401).json({
            success:false,
            error:"INVALID URL!"
        })
        return;
    }
    let results={
        shows: [],
        movies: [],
        actors: []
    };
    let _querystring=new URLSearchParams({
        api_key:"985c5a83c66571b9db65fbae360eba47",
        language:"en-US",
        query:searchText,
        page:1,
        include_adult:true
    }).toString();
    // movies
    try{
        let link=`https://api.themoviedb.org/3/search/movie?`;
        link+=_querystring;
        let data=(await (await fetch(link,{method:"GET"})).json());
        let _results=[];
        data.results.forEach(e=>{
            let obj={
                backdrop_path:e.backdrop_path,
                genre_ids:e.genre_ids,
                id:e.id,
                original_title:e.original_title,
                overview:e.overview,
                poster_path:e.poster_path,
                release_date:e.release_date,
                vote_average:e.vote_average
            };
            _results.push(obj);
        });
        results.movies=_results.slice(0,8);
    }catch(e){}
    // shows
    try{
        let link=`https://api.themoviedb.org/3/search/tv?`;
        link+=_querystring;
        let data=(await (await fetch(link,{method:"GET"})).json());
        let _results=[];
        data.results.forEach(e=>{
            let obj={
                backdrop_path:e.backdrop_path,
                genre_ids:e.genre_ids,
                id:e.id,
                name:e.name,
                overview:e.overview,
                poster_path:e.poster_path,
                vote_average:e.vote_average,
                first_air_date:e.first_air_date
            };
            _results.push(obj);
        });
        results.shows=_results.slice(0,8);
    }catch(e){}
    // actors
    try{
        let link=`https://api.themoviedb.org/3/search/person?`;
        link+=_querystring;
        let data=(await (await fetch(link,{method:"GET"})).json());
        data.results.sort((a,b)=>b.popularity-a.popularity);
        results.actors=data.results.slice(0,8);
    }catch(e){}
    res.status(200).json({
        success:true,
        data:results
    });
});

export default router;
