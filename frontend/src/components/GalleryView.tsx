import React, { useContext, useEffect, useState } from "react";
import a from "../assets/ggg.jpg";
import b from "../assets/hhh.jpg";
import c from "../assets/user.jpg";
import d from "../assets/test.jpg";
import { AUTHCONTEXT, ERRORCONTEXT } from "../App";
import keyGen from '../utils/uniqueKeysGenerator';


function GalleryView({id,setPicState}:{
  id:number | undefined,
  setPicState:React.Dispatch<React.SetStateAction<{
    pic: string;
    show: boolean;
}>>
}) {

  let authContext=useContext(AUTHCONTEXT);
  let errorContext=useContext(ERRORCONTEXT);
  let [data,setData]=useState<{
    file_path:string
  }[]>([]);
  useEffect(()=>{
    if(id){
        fetch("http://localhost:3200/fetchService/getAllPics",{
          method:"POST",
          headers:{
              "Authorization":`Bearer ${authContext?.authState.token}`,
              "Content-Type":"application/json"
          },
          body:JSON.stringify({
              id:id
          })
      }).then(res=>res.json()) 
      .then(data=>{
          if(data.success){
            setData(data.data);
          }else if(data.error==='Invalid or expired Token!'){
            authContext?.logOut();
        }
      }).catch(err=>{
        console.log(err);
        errorContext?.addErrorMessage({
          id:keyGen(),
          title:"ACTOR DATA FETCH",
          message:"Failed to fetch all pics!"
        });
      });
    }
  },[id]);
  return (
    <>
    <h2 style={{padding:"25px",fontSize:"50px",color:"hotpink"}}>Photos</h2>
    <section
      className="CastView"
      style={{
        width: "100%",
        height: "400px",
        display: "inline-flex",
        overflow: "auto",
        padding: "10px",
        gap: "10px",
      }}
    >
      {data.map((e,i)=><img 
        onClick={()=>setPicState({
          pic:"https://image.tmdb.org/t/p/original/"+e.file_path,
          show:true
        })}
        src={"https://image.tmdb.org/t/p/w500/"+e.file_path}
        key={keyGen()}
        style={{
          borderRadius: "8px",
          height: "100%",
        }}
        alt="photo"
        draggable="false"
      />)}
    </section>
    </>
  );
}

export default GalleryView;
