import React, { useContext, useEffect } from 'react';
import { SHOWSCONTEXT } from '../App';
import Carousal from '../components/Carousal';
import HorizontalListView from '../components/HorizontalListView';

function TVShows({setPartialView}:{
        setPartialView:React.Dispatch<React.SetStateAction<{
            show: boolean;
            data: {};
            type: string;
        }>>
    }) {

    let showsContext=useContext(SHOWSCONTEXT);
    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return (
        <>
            <Carousal type="shows" data={showsContext?.showsState.carousal_data} genreMap={showsContext?.showsGenre}/>
            <HorizontalListView key={0} name="Trending Now" data={showsContext?.showsState.trending} type="show" setPartialView={setPartialView}/>
            <HorizontalListView key={1} name="Popular Now" data={showsContext?.showsState.popular} type="show" setPartialView={setPartialView}/>
            <HorizontalListView key={2} name="Top-rated Now" data={showsContext?.showsState.top_rated} type="show" setPartialView={setPartialView}/>
        </>
    );
}

export default TVShows;