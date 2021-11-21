import { ActorData, BookmarkState } from "../states/bookmarksState";
import { MovieData } from "../states/moviesState";
import { ShowData } from "../states/showsState";

const reducer=(state:BookmarkState,action:{
    type:string,
    payload?:MovieData | ShowData | ActorData | BookmarkState
})=>{
    // console.log(action.payload);
    switch(action.type){
        case "LOAD_BOOKMARKS":
            return action.payload as BookmarkState;
        case "ADD_BOOKMARK_MOVIE":
            return {...action.payload as BookmarkState};
        case "ADD_BOOKMARK_SHOW":
            return {...action.payload as BookmarkState};
        case "ADD_BOOKMARK_ACTOR":
            return {...action.payload as BookmarkState};
        case "DELETE_BOOKMARK_ACTOR":
            return {...action.payload as BookmarkState};
        case "DELETE_BOOKMARK_SHOW":
            let dataToDelete1=action.payload as ShowData;
            state.shows=state.shows.filter(val=>val.id!==dataToDelete1.id);
            return {...state};
        case "DELETE_BOOKMARK_MOVIE":
            let dataToDelete2=action.payload as MovieData;
            state.movies=state.movies.filter(val=>val.id!==dataToDelete2.id);
            return {...state};
        default:
            return state;
    }
};

export default reducer;