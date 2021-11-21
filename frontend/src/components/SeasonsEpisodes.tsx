import React, { useContext, useEffect, useState } from 'react';
import '../scss/SeasonsEpisodes.scss';
import SeasonView from './SeasonView';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import keyGen from "../utils/uniqueKeysGenerator";


function SeasonsEpisodes({id}:{
    id:number | undefined
}) {

    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);
    let [data,setData]=useState([]);

    useEffect(()=>{
        if(id)
        fetch("http://localhost:3200/fetchService/getAllSeasons",{
            method:"POST",
            headers:{
                "Authorization":`Bearer ${authContext?.authState.token}`,
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id
            })
        }).then(res=>res.json()).then(data=>{
            // console.log("SE ",data);
            if(data.success) setData(data.data);
            else {
                console.log(data.error);
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"SHOW DATA FETCH",
                    message:"Failed to get all seasons!"
                });
            }
        })
        .catch(err=>console.log(err));
    },[id]);


    return (
        <section className="EpisodeView">
            <h2>All Seasons</h2>
            {data?.map((e,i)=><SeasonView key={i} check={i%2==0} data={e} id={id}/>)}
        </section>
    );
}

export default SeasonsEpisodes;