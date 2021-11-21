import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import pic from '../assets/ggg.jpg';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import keyGen from "../utils/uniqueKeysGenerator";


interface Props{
    check:boolean,
    data:{
        air_date:string,
        episode_count:number,
        id:number,
        name:string,
        overview:string,
        poster_path:string,
        season_number:number
    },
    id:number | undefined
}

const SeasonView:React.FC<Props>=({check,data,id}) =>{

    let [show,setShow]=useState(false);
    let [episodes,setEpisodes]=useState<{
        air_date:string,
        name:string,
        overview:string,
        still_path:string
    }[]>([]);
    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);

    useEffect(()=>{
        if(id)
            fetch("http://localhost:3200/fetchService/getAllEpisodes",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${authContext?.authState.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    id:id,
                    season:data.season_number
                })
            }).then(res=>res.json()).then(data=>setEpisodes(data.data))
            .catch(err=>{
                console.log(err);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"SHOW DATA FETCH",
                    message:"Failed To Fetch All Episodes!"
                })
            });
    },[data,id]);

    return (
        <div className="season" >
            <div className="overview" onClick={()=>setShow(!show)}>
                {(check)?<>
                    <img alt="poster" src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}/>
                    <div className="details">
                        <h1>{data.season_number}. {data.name}</h1>
                        <p>{data.overview}</p>
                        <h3>Release Date : <span>{data.air_date}</span></h3>
                        <h4>{show?<i className="fa fa-chevron-up" aria-hidden="true"></i>:
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>}</h4>
                    </div>
                </>:<>
                    <div className="details">
                        <h1>{data.season_number}. {data.name}</h1>
                        <p>{data.overview}</p>
                        <h3>Release Date : <span>{data.air_date}</span></h3>
                        <h4>{show?<i className="fa fa-chevron-up" aria-hidden="true"></i>:
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>}</h4>
                    </div>
                    <img alt="poster" src={`https://image.tmdb.org/t/p/w500/${data.poster_path}`}/>
                </>}
            </div>
            <div className={show?"episodes --episodes-visible":"episodes"}>
                {episodes?.map((episode,i)=><div className="episode" key={i}>
                    <img alt="episode-still" src={`https://image.tmdb.org/t/p/w500/${episode.still_path}`}/>
                    <div className="details">
                        <h2>{i}. {episode.name}</h2>
                        <p>{episode.overview}</p>
                    </div>
                </div>)}
            </div>
        </div>
    );
}

export default SeasonView;