import React, { useContext } from 'react';
import { useHistory } from 'react-router';
import { AUTHCONTEXT, BOOKMARKSCONTEXT, ERRORCONTEXT, MOVIESCONTEXT, SHOWSCONTEXT } from '../App';
import pic from '../assets/test.jpg';
import '../scss/MovieOrTVHeaderView.scss';
import { MovieData } from '../states/moviesState';
import { ShowData } from '../states/showsState';
import bookmarkManager from "../utils/bookmarkManager";


function MovieOrTVHeaderView({partialView,setPartialView,headingView}:{
    partialView:{
        show: boolean;
        data: {} | ShowData | MovieData;
        type: string;
    },
    setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>> | undefined,
    headingView?:boolean
}) {

    let history=useHistory();

    let authContext=useContext(AUTHCONTEXT);
    let movieContext=useContext(MOVIESCONTEXT);
    let showsContext=useContext(SHOWSCONTEXT);
    let bookmarksContext=useContext(BOOKMARKSCONTEXT);
    let errorContext=useContext(ERRORCONTEXT);

    function getStars(rating:number | undefined):any {
        if(rating){
            rating=rating/2;
            let whole=parseInt(rating+"");
            // console.log(whole);
            return <>
                {[...new Array(whole)].map((e,index)=><i key={"first"+index} className="fa fa-star" aria-hidden="true"></i>)}
                {rating>whole?<i key={"second"} className="fa fa-star-half-o" aria-hidden="true"></i>:null}
                {[...new Array(rating>whole?5-whole-1:5-whole)].map((e,index)=><i key={"third"+index} className="fa fa-star-o" aria-hidden="true"></i>)}
            </>;
        }
    }

    return (
        <section className="MovieOrTVHeaderView">
            <img alt="cover" src={`https://image.tmdb.org/t/p/w500/${partialView.type==="movie"?(partialView.data as MovieData).poster_path:
                (partialView.data as ShowData).poster_path}`}/>
            <div className="details">
                <p className="title">{partialView.type==="movie"?(partialView.data as MovieData).original_title:
                (partialView.data as ShowData).name}  <span>{partialView.type==="movie"?"MOVIE":"TV"}</span>  </p>
                <p className="desc">{partialView.type==="movie"?(partialView.data as MovieData).overview:
                (partialView.data as ShowData).overview}</p>
                <ul className="genre">
                    {(partialView.type==="movie"?(partialView.data as MovieData).genre_ids:
                (partialView.data as ShowData).genre_ids)?.map((e,id)=><li key={id}>{partialView.type==="movie"?movieContext?.moviesGenre.get(e):
                showsContext?.showsGenre.get(e)}</li>)}
                </ul>
                <div className="characteristics">
                    <p>
                        {getStars(partialView.type==="movie"?(partialView.data as MovieData).vote_average:
                (partialView.data as ShowData).vote_average)}
                    </p>
                    <h2>Rating: <span style={{color:"green"}}>{partialView.type==="movie"?(partialView.data as MovieData).vote_average:
                (partialView.data as ShowData).vote_average}</span></h2>
                </div>
                <div className="line-flow">
                    {!bookmarksContext?.bookmarksMap.get((partialView.type==="movie"?"MOVIE-":"SHOW-")+
                    (partialView.type==="movie"?(partialView.data as MovieData).id:(partialView.data as ShowData).id))?
                        <button className="btn" onClick={()=>{
                            bookmarkManager.manageBookmark({
                                addErrorMessage:errorContext?.addErrorMessage,
                                bookmarksContext:bookmarksContext,
                                authContext:authContext,
                                command:"ADD",
                                type:(partialView.type==="movie")?"MOViE":"SHOW",
                                data:(partialView.type==="movie")?(partialView.data as MovieData):(partialView.data as ShowData)
                            });
                        }}><i className="fa fa-plus" aria-hidden="true"></i> Add to Watchlist</button>
                        :<button className="btn btn-danger" onClick={()=>{
                            bookmarkManager.manageBookmark({
                                addErrorMessage:errorContext?.addErrorMessage,
                                bookmarksContext:bookmarksContext,
                                authContext:authContext,
                                command:"DEL",
                                type:(partialView.type==="movie")?"MOViE":"SHOW",
                                data:(partialView.type==="movie")?(partialView.data as MovieData):(partialView.data as ShowData)
                            });
                        }}><i className="fa fa-times-circle" aria-hidden="true"></i> Remove from Watchlist</button>}
                    {!headingView?
                        <>
                            <button className="btn" style={{marginLeft:"auto"}} onClick={()=>{
                                if(partialView.type==="movie") history.push("/movie",partialView.data);
                                else history.push("/show",partialView.data);
                                if(setPartialView) setPartialView({show:false,data:{},type:""});
                            }}><i className="fa fa-external-link-square" aria-hidden="true"></i></button>
                            <button className="btn btn-danger" onClick={()=>{
                                if(setPartialView)
                                    setPartialView({
                                        show:false,
                                        data:{},
                                        type:""
                                    });
                            }}><i className="fa fa-times-circle" aria-hidden="true"></i></button>
                        </>
                    :null}
                </div>
                
            </div>
        </section>
    );
}

export default MovieOrTVHeaderView;