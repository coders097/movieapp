let _state:MoviesState={
    trending:[],
    popular:[],
    top_rated:[],
    carousal_data:[],
}


export interface MoviesState{
    trending:MovieData[],
    popular:MovieData[],
    top_rated:MovieData[],
    carousal_data:MovieData[],
} 

export interface MovieData{
    backdrop_path?:string,
    genre_ids?:[number],
    id?:number,
    original_title?:string,
    overview?:string,
    poster_path?:string,
    release_date?:string,
    vote_average?:number
}

export default _state;