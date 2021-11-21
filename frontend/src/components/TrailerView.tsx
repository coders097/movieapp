import React, { useContext, useEffect, useState } from 'react';
import { AUTHCONTEXT, ERRORCONTEXT } from '../App';
import "../scss/TrailerView.scss";
import pic from '../assets/test.jpg';
import keyGen from "../utils/uniqueKeysGenerator";

const TrailerView=({pic,id,type}:{
    pic:string | undefined,
    id:number | undefined
    type:string | undefined
})=>{

    let [key,setKey]=useState("");
    let authContext=useContext(AUTHCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);

    useEffect(()=>{
        (function _(){
            fetch("http://localhost:3200/fetchService/getMovieOrTVTrailer",{
                method:"POST",
                headers:{
                    "Authorization":`Bearer ${authContext?.authState.token}`,
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    type,
                    id
                })
            }).then(res=>res.json())
            .then(data=>{
                if(data.success){
                    setKey(data.data.key);
                }else if(data.error==='Invalid or expired Token!'){
                    authContext?.logOut();
                }
            }).catch(err=>{
                errorContext?.addErrorMessage({
                    id:keyGen(),
                    title:"TRAILER FETCH",
                    message:"Failed To Fetch Movie/TV Trailer!"
                })
            });
        })()
    },[id]);
    return (
        <section className="TailerView">
            <div style={
                {
                    backgroundImage: `linear-gradient(to right bottom,rgba(0, 0, 0, 0.562),rgba(80, 79, 79, 0.582)),url(${
                        "https://image.tmdb.org/t/p/w500/"+pic})`,
                    backgroundPosition:"center",
                    backgroundRepeat:"no-repeat",
                    backgroundSize: "cover"       
                }
            }>
                <h1>Watch the trailer Now!</h1>
            </div>
            <iframe src={`https://www.youtube.com/embed/${key}?modestbranding=1`}  title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen={true}></iframe>
        </section>
    );
}

export default TrailerView;