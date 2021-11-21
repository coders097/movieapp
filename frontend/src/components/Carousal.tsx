import React, { createRef, useContext, useEffect, useState } from 'react';
import '../scss/Carousal.scss';
import pic from '../assets/ggg.jpg';
import { MovieData } from '../states/moviesState';
import { ShowData } from '../states/showsState';
import { useHistory } from 'react-router';
import keyGen from '../utils/uniqueKeysGenerator';
import { AUTHCONTEXT, BOOKMARKSCONTEXT, ERRORCONTEXT } from '../App';
import bookmarkManager from '../utils/bookmarkManager';


interface Props{
    type:"movies" | "shows",
    data:MovieData[] | ShowData[] | undefined,
    genreMap:Map<number,string> | undefined
}
const Carousal=({type,data,genreMap}:Props)=>{

    let history=useHistory();
    useEffect(()=>{
        if(data){
            setRollState({ 
                length:data.length,
                i:0
            });
        }
    },[data]);

    let [rollstate,setRollState]=useState({
        length:data!.length,
        i:0
    });

    let bookmarksContext=useContext(BOOKMARKSCONTEXT);
    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);
    
    return (
        <section className="Carousal">
            <div className="display">
                {data!.map((e,index)=>{
                    return <div style={
                        {
                            background:`url(https://image.tmdb.org/t/p/original/${e.backdrop_path}) top no-repeat`,
                            backgroundSize: "cover"
                        }
                    } className={(index==rollstate.i)?"movie-head-card --active":"movie-head-card"} key={keyGen()}>
                    <div className={type==="movies"?"details":"details tv-add-on"}>
                        <h2 onClick={()=>{
                            if(type==="movies") history.push("/movie",e);
                                else history.push("/show",e);
                            }}>{type==="movies"?(e as MovieData).original_title:(e as ShowData).name}</h2>
                        {type==="shows"?<h4>{`Rating : ${e.vote_average} out of 10`}</h4>:null}
                        <div className="flow">
                            {e.genre_ids?.map(id=><div className="card" key={id}>
                                {genreMap?.get(id)}
                            </div>)}
                            <div className="card">
                                {type==="movies"?new Date(e.release_date as string).getFullYear():
                                new Date((e as ShowData).first_air_date as string).getFullYear()}
                            </div>
                        </div>
                        <p onClick={()=>{
                            if(type==="movies") history.push("/movie",e);
                                else history.push("/show",e);
                            }}>{e.overview}</p> 
                        <div className="flow">
                            <button className="btn btn-custom" onClick={()=>{
                            if(type==="movies") history.push("/movie",e);
                                else history.push("/show",e);
                            }}>Watch Trailer</button>
                            {/* <button className="btn btn-danger">Add To Wishlist</button> */}
                            {!bookmarksContext?.bookmarksMap.get((type==="movies"?"MOVIE-":"SHOW-")+
                            (type==="movies"?(e as MovieData).id:(e as ShowData).id))?
                                <button className="btn" onClick={()=>{
                                    bookmarkManager.manageBookmark({
                                        addErrorMessage:errorContext?.addErrorMessage,
                                        bookmarksContext:bookmarksContext,
                                        authContext:authContext,
                                        command:"ADD",
                                        type:(type==="movies")?"MOViE":"SHOW",
                                        data:(type==="movies")?(e as MovieData):(e as ShowData)
                                    });
                                }}><i className="fa fa-plus" aria-hidden="true"></i> Add to Watchlist</button>
                                :<button className="btn btn-danger" onClick={()=>{
                                    bookmarkManager.manageBookmark({
                                        addErrorMessage:errorContext?.addErrorMessage,
                                        bookmarksContext:bookmarksContext,
                                        authContext:authContext,
                                        command:"DEL",
                                        type:(type==="movies")?"MOViE":"SHOW",
                                        data:(type==="movies")?(e as MovieData):(e as ShowData)
                                    });
                                }}><i className="fa fa-times-circle" aria-hidden="true"></i> Remove from Watchlist</button>}
                        </div>
                    </div>
                </div>;
                })} 
                
            </div>  
            <div className="left" onClick={()=>{
                setRollState({
                    length:rollstate.length,
                    i:((rollstate.i-1)<0)?rollstate.length-1:(rollstate.i-1)
                })
            }}>
                <i className="fa fa-arrow-left" aria-hidden="true"></i>
            </div>
            <div className="right" onClick={()=>{
                setRollState({
                    length:rollstate.length,
                    i:(rollstate.i+1)%rollstate.length
                })
            }}>
                <i className="fa fa-arrow-right" aria-hidden="true"></i>
            </div>
        </section>
    );
}

export default Carousal;