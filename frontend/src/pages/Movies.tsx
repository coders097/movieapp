import React, { useContext, useEffect, useState } from 'react';
import { MOVIESCONTEXT } from '../App';
import Carousal from '../components/Carousal';
import HorizontalListView from '../components/HorizontalListView';



const Movies=({setPartialView}:{
        setPartialView:React.Dispatch<React.SetStateAction<{
            show: boolean;
            data: {};
            type: string;
        }>>
    })=>{

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);
    let moviesState = useContext(MOVIESCONTEXT);

    return (
        <>
            <Carousal type="movies" data={moviesState?.moviesState.carousal_data} genreMap={moviesState?.moviesGenre}/>
            <HorizontalListView type="movie" name="Trending Now" data={moviesState?.moviesState.trending} setPartialView={setPartialView}/>
            <HorizontalListView type="movie" name="Popular Now" data={moviesState?.moviesState.popular} setPartialView={setPartialView}/>
            <HorizontalListView type="movie" name="Top-rated Now" data={moviesState?.moviesState.top_rated} setPartialView={setPartialView}/>
        </>
    );
}

export default Movies;