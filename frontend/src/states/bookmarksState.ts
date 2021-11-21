import { MovieData } from "./moviesState";
import { ShowData } from "./showsState";

let _state:BookmarkState={
    shows:[],
    movies:[],
    actors:[]
}

export interface BookmarkState{
    shows:ShowData[],
    movies:MovieData[],
    actors:ActorData[]
}

export interface ActorData{
    gender:number,
    id:number,
    known_for_department:string,
    name:string,
    profile_path:string
}

export default _state;

