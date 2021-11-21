let _state:ShowState={
    trending:[],
    popular:[],
    top_rated:[],
    carousal_data:[],
}


export interface ShowState{
    trending:ShowData[],
    popular:ShowData[],
    top_rated:ShowData[],
    carousal_data:ShowData[],
} 

export interface ShowData{
    backdrop_path?:string,
    genre_ids?:[number],
    id?:number,
    overview?:string,
    poster_path?:string,
    release_date?:string,
    vote_average?:number
    name?:string,
    first_air_date?:string
}

export default _state;