import movieState, {MovieData,MoviesState} from '../states/moviesState';
const reducer=(state:MoviesState,action:{
    type:string,
    payload:MovieData[]
})=>{
    switch(action.type){
        case "LOAD_TRENDING_MOVIES":
            return {
                ...state,
                trending:action.payload
            };
        case "LOAD_POPULAR_MOVIES": 
            return {
                ...state,
                popular:action.payload
            };
        case "LOAD_TOP_RATED_MOVIES":
            return {
                ...state,
                top_rated:action.payload
            };
        case "LOAD_CAROUSAL_MOVIES":
            return {
                ...state,
                carousal_data:action.payload
            };
        default:
            return state;
    }
};

export default reducer;

