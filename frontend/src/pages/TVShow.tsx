import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation } from 'react-router';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import HorizontalListView from '../components/HorizontalListView';
import MovieOrTVHeaderView from '../components/MovieOrTVHeaderView';
import SeasonsEpisodes from '../components/SeasonsEpisodes';
import TrailerView from '../components/TrailerView';
import { ShowData } from '../states/showsState';
import keyGen from "../utils/uniqueKeysGenerator";


function TVShow({setPartialView}:{
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>>
}) {

    let location=useLocation();
    let history=useHistory();
    let [userData,setUserData]=useState<ShowData>({});
    let [castData,setCastData]=useState([]);
    let [crewData,setCrewData]=useState([]);
    let [similarShoes,setSimilarShoes]=useState([]);
    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);

    useEffect(()=>{
        window.scrollTo(0,0);
        let data=location.state;
        if(data){
            // console.log(data);
            setUserData(data as ShowData);
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
                    type:"tv",
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
                    title:"SHOW DATA FETCH",
                    message:"Failed To Get Cast/Crew of Shows"
                });
            });
        })();

        // load similar shows
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
                    media:"tv",
                    page:1
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.success){
                    // console.log(data);
                    setSimilarShoes(data.data);
                }else if(data.error==='Invalid or expired Token!'){
                    authContext?.logOut();
                }
            }).catch(err=>{
                console.log(err);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"SHOW DATA FETCH",
                    message:"Failed To Get Similar Shows"
                });
            });
        })();

    },[userData]);

    return (
        <>
            <MovieOrTVHeaderView partialView={{
                type:"show",
                data:userData,
                show:true
            }} setPartialView={undefined} headingView={true}/>
            <TrailerView pic={userData.poster_path} id={userData.id} type="tv"/>
            <SeasonsEpisodes id={userData.id}/>
            <HorizontalListView data={castData} type="people" name="Cast" setPartialView={undefined}/>
            <HorizontalListView data={crewData} type="people" name="Crew" setPartialView={undefined}/>
            <HorizontalListView data={similarShoes} type="show" name="Similar TV Shoes" setPartialView={setPartialView}/>

        </>
    );
}

export default TVShow;