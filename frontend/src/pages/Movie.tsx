import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import HorizontalListView from '../components/HorizontalListView';
import MovieOrTVHeaderView from '../components/MovieOrTVHeaderView';
import TrailerView from '../components/TrailerView';
import { MovieData } from '../states/moviesState';
import keyGen from "../utils/uniqueKeysGenerator";


function Movie({setPartialView}:{
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>>
}) {
    let location=useLocation();
    let history=useHistory();
    let [userData,setUserData]=useState<MovieData>({});
    let [castData,setCastData]=useState([]);
    let [crewData,setCrewData]=useState([]);
    let [similarMovies,setSimilarMovies]=useState([]);
    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);
    
    useEffect(()=>{
        window.scrollTo(0,0);
        let data=location.state;
        if(data){
            setUserData(data as MovieData);
        }else {
            history.push("/");
            return;
        }
    },[location.state]);

    useEffect(()=>{
        // load casts and crews
        (function _(){
            fetch("http://localhost:3200/fetchService/getMovieOrTVCastCrew",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${authContext?.authState.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    type:"movie",
                    id:userData.id
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.success){
                    // console.log(data);
                    setCastData(data.data.cast);
                    setCrewData(data.data.crew);
                }else if(data.error==='Invalid or expired Token!'){
                    authContext?.logOut();
                }
            }).catch(err=>{
                console.log(err);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"MOVIE DATA FETCH",
                    message:"Failed To Get Movie Cast & Crew"
                });
            });
        })();

        // load similar movies
        (function _(){
            fetch("http://localhost:3200/fetchService/allMoviesOrShows",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${authContext?.authState.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    type:"similar",
                    id:userData.id,
                    media:"movie",
                    page:1
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.success){
                    // console.log(data);
                    setSimilarMovies(data.data);
                }else if(data.error==='Invalid or expired Token!'){
                    authContext?.logOut();
                }
            }).catch(err=>{
                console.log(err);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"MOVIE DATA FETCH",
                    message:"Failed To Get Similar Movies"
                });
            });
        })();

    },[userData]);


    return (
        <> 
            <MovieOrTVHeaderView partialView={{
                type:"movie",
                data:userData,
                show:true
            }} setPartialView={undefined} headingView={true}/>
            <TrailerView pic={userData.backdrop_path} id={userData.id} type="movie"/>
            <HorizontalListView data={castData} type="people" name="Cast" setPartialView={undefined}/>
            <HorizontalListView data={crewData} type="people" name="Crew" setPartialView={undefined}/>
            <HorizontalListView data={similarMovies} type="movie" name="Similar Movies" setPartialView={setPartialView}/>

        </>
    );
}

export default Movie;