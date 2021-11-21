import React, { Component } from 'react';
import { useHistory } from 'react-router';
import pic from '../assets/avatar.jpg';
import { MovieData } from '../states/moviesState';
import { ShowData } from '../states/showsState';
import keyGen from '../utils/uniqueKeysGenerator';

interface PeopleData{
    job?:string,
    gender?:number,
    id?:number,
    known_for_department?:string,
    name?:string,
    profile_path?:string,
    character?:string,
    order?:number,
}

interface Props{
    type:"movie" | "show" | "people"
    name:string,
    data:MovieData[] | ShowData[] | PeopleData[] | undefined,
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>> | undefined
}

const HorizontalListView=({name,data,type,setPartialView}:Props)=>{

    let getName=(e:any)=>{
        if(type==="movie"){
            return e.original_title;
        }else if(type==="people"){
            return e.name; 
        }else if(type==="show"){
            return e.name;
        }
    }

    let history=useHistory();

    return (
        <section className="HorizontalListView" style={
            {
                width: "100%",
                padding: "20px",
                paddingBottom: "5px"
            }
        }>
            <h2 style={
                {
                    fontSize: "30px",
                    fontFamily: "'Poppins', sans-serif",
                    fontWeight: 600,
                    color:"#585858",
                    marginBottom: '10px'
                }
            }>{name}</h2>
            <ul className="display" style={
                {
                    width: "100%",
                    paddingBottom: "10px",
                    overflowX: "auto",
                    display: "inline-flex",
                    gap: "20px"
                }
            }>

                {data?.map((e,i)=>{
                    return ((type==="people")?(e as PeopleData).profile_path:
                            (e as MovieData | ShowData).poster_path)?
                            <li className="item" style={
                        {
                            minWidth: "200px",
                            width: "200px",
                            listStyle:"none"
                        }
                    }
                    key={keyGen()} 
                    onClick={()=>{
                        if(setPartialView)
                            setPartialView({
                                show:true,
                                type,
                                data:e
                            });
                        if(type==="people"){
                            history.push("/people",e);
                        }
                    }}>
                        <img alt="movie-tv-person" src={`https://image.tmdb.org/t/p/w500/${type==="people"?
                        (e as PeopleData).profile_path:(e as MovieData | ShowData).poster_path}`} style={{
                            width: "100%",
                            borderRadius: "5px",
                            height: "270px",
                            objectFit: "cover"
                        }}
                        />
                        <p style={
                            {
                                textAlign: "center",
                                fontSize: "20px",
                                fontFamily:"'Open Sans', sans-serif",
                                fontWeight:600,
                                whiteSpace:"nowrap",
                                overflow:"hidden",
                                textOverflow:"ellipsis"
                            }
                        }>{getName?getName(e):null}</p>
                </li>:null;})}  
            </ul>
        </section>
    );
}


export default HorizontalListView;