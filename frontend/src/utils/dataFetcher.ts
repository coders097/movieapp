import { AuthState } from "../states/authState";
import { ActorData } from "../states/bookmarksState";
import { MovieData } from "../states/moviesState";
import { ShowData } from "../states/showsState";
import keyGen from './uniqueKeysGenerator';

let trendingMoviesOrShowsFetch=(helper:any)=>{
    fetch("http://localhost:3200/fetchService/allMoviesOrShows",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${helper.authState.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            type:"trending",
            media:helper.type==="movie"?"movie":"tv"
        })
    }).then(res=>res.json()) 
    .then(data=>{
        if(data.success){
            if(helper.type==="movie"){
                helper.moviesDispatch({ 
                    type:"LOAD_CAROUSAL_MOVIES",
                    payload:data.data.slice(0,5)
                });
                helper.moviesDispatch({
                    type:"LOAD_TRENDING_MOVIES",
                    payload:data.data.slice(5)
                });
            }else{
                helper.showsDispatch({ 
                    type:"LOAD_CAROUSAL_SHOWS",
                    payload:data.data.slice(0,5)
                });
                helper.showsDispatch({
                    type:"LOAD_TRENDING_SHOWS",
                    payload:data.data.slice(5)
                });
            }
            // console.log(data.data);
        }
        else if(data.error==='Invalid or expired Token!'){
            helper.addErrorMessage({
                id:keyGen(),
                title:"AUTHENTICATION",
                message:"Invalid or expired Token. Login Again!"
            });
            helper.logOut();
        }
    }).catch(err=>{
        helper.addErrorMessage({
            id:keyGen(),
            title:"BROWSER PROBLEM",
            message:"Don't Panic Will recover itself or just Refresh!"
        });
        console.log(err);
    });
}

let popularMoviesOrShowsFetch=(helper:any)=>{
    fetch("http://localhost:3200/fetchService/allMoviesOrShows",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${helper.authState.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            type:"popular",
            media:helper.type==="movie"?"movie":"tv",
            page:1
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.success){
            if(helper.type==="movie"){
                helper.moviesDispatch({
                    type:"LOAD_POPULAR_MOVIES",
                    payload:data.data
                });
            }else{
                helper.showsDispatch({
                    type:"LOAD_POPULAR_SHOWS",
                    payload:data.data
                });
            }
            // console.log(data.data);
        }
        else if(data.error==='Invalid or expired Token!'){
            helper.addErrorMessage({
                id:keyGen(),
                title:"AUTHENTICATION",
                message:"Invalid or expired Token. Login Again!"
            });
            helper.logOut();
        }
    }).catch(err=>{
        helper.addErrorMessage({
            id:keyGen(),
            title:"BROWSER PROBLEM",
            message:"Don't Panic Will recover itself or just Refresh!"
        });
        console.log(err);
    });
}

let topRatedMoviesOrShowsFetch=(helper:any)=>{
    fetch("http://localhost:3200/fetchService/allMoviesOrShows",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${helper.authState.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            type:"top_rated",
            media:helper.type==="movie"?"movie":"tv",
            page:1
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.success){
            if(helper.type==="movie"){
                helper.moviesDispatch({
                    type:"LOAD_TOP_RATED_MOVIES",
                    payload:data.data
                });
            }else{
                helper.showsDispatch({
                    type:"LOAD_TOP_RATED_SHOWS",
                    payload:data.data
                });
            }
            // console.log(data.data);
        }
        else if(data.error==='Invalid or expired Token!'){
            helper.addErrorMessage({
                id:keyGen(),
                title:"AUTHENTICATION",
                message:"Invalid or expired Token. Login Again!"
            });
            helper.logOut();
        }
    }).catch(err=>{
        helper.addErrorMessage({
            id:keyGen(),
            title:"BROWSER PROBLEM",
            message:"Don't Panic Will recover itself or just Refresh!"
        });
        console.log(err);
    });
}

let fetchAllMovieOrShowGenres=(helper:any)=>{
    fetch(`http://localhost:3200/fetchService/getAllGenre/${helper.type==="movie"?"movie":"tv"}`).then(res=>res.json())
    .then(data=>{
        if(data.success){
            let map=new Map<number,string>();
            data.data.forEach((e:{
                id:Number,
                name:string
            })=> {
                map.set(e.id as number,e.name);
            });
            if(helper.type==="movie") helper.setMoviesGenre(map);
            else helper.setShowsGenre(map);
        }else if(data.error==='Invalid or expired Token!'){
            helper.addErrorMessage({
                id:keyGen(),
                title:"AUTHENTICATION",
                message:"Invalid or expired Token. Login Again!"
            });
            helper.logOut();
        }
    }).catch(err=>{
        console.log(err);
        helper.addErrorMessage({
            id:keyGen(),
            title:"BROWSER PROBLEM",
            message:"Don't Panic Will recover itself or just Refresh!"
        });
    });
}

let fetchAllSearchResults=({searchText,setSearchResults,authState,addErrorMessage}:{
    searchText:string,
    setSearchResults:React.Dispatch<React.SetStateAction<{
        loaded: boolean;
        results: {
            shows: ShowData[],
            movies: MovieData[],
            actors: ActorData[]
        };
    }>>,
    authState:AuthState | undefined,
    addErrorMessage:((error: {
        id: string;
        title: string;
        message: string;
    }) => void) | undefined
})=>{
    fetch("http://localhost:3200/fetchService/searchForMovies&Shows",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${authState?.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            searchText
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.success){
            setSearchResults({
                loaded:true,
                results:data.data
            })
        }else{
            if(addErrorMessage)
                addErrorMessage({
                    id:keyGen(),
                    title:"SEARCH",
                    message:"Data Fetching Failed. Try Again!"
                })
            console.log(data.error);
        }
    })
    .catch(err=>{
        console.log(err);
        if(addErrorMessage)
            addErrorMessage({
                id:keyGen(),
                title:"BROWSER PROBLEM",
                message:"Don't Panic Will recover itself or just Refresh!"
            });
    });
}
export default {
    trendingMoviesOrShowsFetch,
    popularMoviesOrShowsFetch,
    topRatedMoviesOrShowsFetch,
    fetchAllMovieOrShowGenres,
    fetchAllSearchResults
}