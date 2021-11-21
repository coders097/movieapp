import React, { useContext, useEffect, useState } from 'react';
import GalleryView from '../components/GalleryView';
import HorizontalListView from '../components/HorizontalListView';
import MovieOrTVHeaderView from '../components/MovieOrTVHeaderView';
import pic from '../assets/test.jpg';
import { useHistory, useLocation } from 'react-router';
import { AUTHCONTEXT, BOOKMARKSCONTEXT, ERRORCONTEXT, MOVIESCONTEXT } from '../App';
import ImageViewer from '../components/ImageViewer';
import bookmarkManager from '../utils/bookmarkManager';
import keyGen from "../utils/uniqueKeysGenerator";
import "../scss/People.scss";


function People({setPartialView,setPicState}:{
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>>,
    setPicState:React.Dispatch<React.SetStateAction<{
        pic: string;
        show: boolean;
    }>>
}) {

    let location=useLocation();
    let history=useHistory();

    let bookmarksContext=useContext(BOOKMARKSCONTEXT);

    interface PersonState{
        gender:number,
        id:number,
        known_for_department:string,
        name:string,
        profile_path:string
    }

    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);
    let [data,setData]=useState<PersonState | null>(null);
    let [tvData,setTVData]=useState([]);
    let [movieData,setMoviesData]=useState([]);

    useEffect(()=>{
        window.scrollTo(0,0);
        let data=location.state;
        if(data){
            setData(data as PersonState);
        }else{
            history.push("/");
            return;
        }
    },[location.state]);

    useEffect(()=>{
        if(data?.id){
            fetch("http://localhost:3200/fetchService/getAllShowsOrMoviesOfActor",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${authContext?.authState.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id:data.id,
                    type:"movie"
                })
            }).then(res=>res.json()) 
            .then(data=>{
                if(data.success){
                    setMoviesData(data.data);
                }else if(data.error==='Invalid or expired Token!'){
                    authContext?.logOut();
                }
            }).catch(err=>{
                console.log(err);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"ACTOR DATA FETCH",
                    message:"Failed To Fetch Actor's Movies!"
                });
            });

            fetch("http://localhost:3200/fetchService/getAllShowsOrMoviesOfActor",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${authContext?.authState.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id:data.id,
                    type:"tv"
                })
            }).then(res=>res.json()) 
            .then(data=>{
                if(data.success){
                    setTVData(data.data);
                }else if(data.error==='Invalid or expired Token!'){
                    authContext?.logOut();
                }
            }).catch(err=>{
                console.log(err);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"ACTOR DATA FETCH",
                    message:"Failed To Fetch Actor's Shows!"
                })
            });
        }
    },[data]);

    return (
        <>
            {/* gender:e.gender,
            id:e.id,
            known_for_department:e.known_for_department,
            name:e.name, */}
            <div className="PeopleHeader">
                <img alt="people" src={`https://image.tmdb.org/t/p/w500/${data?.profile_path}`} />
                <div className="details">
                    <h1>{data?.name}</h1>
                    <h2>{data?.known_for_department}</h2>
                    {bookmarksContext?.bookmarksMap.get(`ACTOR-${data?.id}`)?<button className="btn btn-danger" onClick={()=>{
                        bookmarkManager.manageBookmark({
                            bookmarksContext:bookmarksContext,
                            authContext:authContext,
                            command:"DEL",
                            type:"ACTOR",
                            data:data
                        });
                    }}><i className="fa fa-times-circle" aria-hidden="true"></i> Remove from Watchlist</button>
                    :<button className="btn" onClick={()=>{
                        bookmarkManager.manageBookmark({
                            bookmarksContext:bookmarksContext,
                            authContext:authContext,
                            command:"ADD",
                            type:"ACTOR",
                            data:data 
                        });
                    }}><i className="fa fa-plus" aria-hidden="true"></i> Add to Watchlist</button>}
                    
                    <p>{data?.gender===1?"Female":"Male"}</p>
                </div>
            </div>
            <GalleryView id={data?.id} setPicState={setPicState}/>
            <HorizontalListView key={0} type="movie" name={`MOVIES BY ${data?.gender===1?"HER":"HIM"}`} data={movieData} setPartialView={setPartialView}/>
            <HorizontalListView key={1} name={`SHOWS BY ${data?.gender===1?"HER":"HIM"}`} data={tvData} type="show" setPartialView={setPartialView}/>
            

        </>
    );
}

export default People;