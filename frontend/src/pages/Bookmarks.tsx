import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router';
import { BOOKMARKSCONTEXT } from '../App';
import HorizontalListView from '../components/HorizontalListView';

function Bookmarks({setPartialView}:{
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>>
}) {

    let history=useHistory();
    let bookmarksContext=useContext(BOOKMARKSCONTEXT);

    let downloadInfo=()=>{
        let anchor = document.createElement('a');
        anchor.setAttribute('href', 'data:text/plain;charset=utf-8,' + 
        "::VIDEONET EXPORTS::     DATE: "+new Date()+"\n"+
        "**************MOVIES************************************************" + "\n" +
        `${bookmarksContext?.bookmarksState.movies.map((bookmarkName,index)=>`${index} ${bookmarkName.original_title} - ${bookmarkName.vote_average}`).join("\n")} \n\n`+
        "**************TV SHOWS************************************************" + "\n" +
        `${bookmarksContext?.bookmarksState.shows.map((bookmarkName,index)=>`${index} ${bookmarkName.name} - ${bookmarkName.vote_average}`).join("\n")} \n\n`+
        "**************ACTORS************************************************" + "\n" +
        `${bookmarksContext?.bookmarksState.actors.map((bookmarkName,index)=>`${index} ${bookmarkName.name} - ${bookmarkName.gender===1?"FEMALE":"MALE"} - ${bookmarkName.known_for_department}`).join("\n")} \n`
        );
        anchor.setAttribute('download',"list.txt");
        anchor.style.display = 'none';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
    }

    useEffect(()=>{
        window.scrollTo(0,0);
    },[]);

    return (
        <section style={{
            width:"100%",
            minHeight:"calc(100vh - 120px)"
        }}>
            <h1 style={{
                fontSize:"45px",
                textAlign:"center",
                fontWeight:500,
                cursor:"default",
                fontFamily:`'Poppins', sans-serif`
            }}>WATCHLIST</h1>
            <div style={{
                display:"flex",
                cursor:"default",
                alignItems:"center",
                justifyContent:"center",
                padding:"0px 15px",
                gap:"30px",
                marginBottom:"30px"
            }}>
                <p style={{
                    fontSize:"25px",
                    cursor:"default",
                    textAlign:"center",
                    fontWeight:400,
                    color:"grey",
                    fontFamily:`'Work Sans', sans-serif`
                }}>Save all your movies, shows and actors in one place</p>
                <button className="btn" onClick={()=>downloadInfo()}>GET LISTED DATA</button>
            </div>
            {(bookmarksContext===null?0:bookmarksContext?.bookmarksState.movies.length)
            >0?<HorizontalListView
                name="Movies"
                type="movie"
                key="0"
                setPartialView={setPartialView}
                data={bookmarksContext?.bookmarksState.movies}
            />:<h4 style={{
                fontFamily:`'Work Sans', sans-serif`,
                textAlign:"center",
                fontSize:"22px",
                cursor:"default",
                color:"grey"
            }}
            onClick={()=>history.push("/movies")}><i className="fa fa-plus" aria-hidden="true"></i> Add your Favorite Movies!</h4>}
            {(bookmarksContext===null?0:bookmarksContext?.bookmarksState.shows.length)
            >0?<HorizontalListView
                name="Shows"
                type="show"
                key="1"
                setPartialView={setPartialView}
                data={bookmarksContext?.bookmarksState.shows}
            />:<h4 style={{
                fontFamily:`'Work Sans', sans-serif`,
                textAlign:"center",
                fontSize:"22px",
                cursor:"default",
                marginBottom:"30px",
                color:"grey"
            }}
            onClick={()=>history.push("/shows")}><i className="fa fa-plus" aria-hidden="true"></i> Add your Favorite Shows!</h4>}
            {(bookmarksContext===null?0:bookmarksContext?.bookmarksState.actors.length)
            >0?<HorizontalListView
                name="Actors"
                type="people"
                key="2"
                setPartialView={undefined}
                data={bookmarksContext?.bookmarksState.actors}
            />:<h4 style={{
                fontFamily:`'Work Sans', sans-serif`,
                textAlign:"center",
                marginBottom:"30px",
                fontSize:"22px",
                cursor:"default",
                color:"grey"
            }}>Your Favorite Actors appear here!</h4>}

        </section>
    );
}

export default Bookmarks;