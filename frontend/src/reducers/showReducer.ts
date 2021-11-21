import showsState, {ShowData,ShowState} from '../states/showsState';
const reducer=(state:ShowState,action:{
    type:string,
    payload:ShowData[]
})=>{
    switch(action.type){
        case "LOAD_TRENDING_SHOWS":
            return {
                ...state,
                trending:action.payload
            };
        case "LOAD_POPULAR_SHOWS": 
            return {
                ...state,
                popular:action.payload
            };
        case "LOAD_TOP_RATED_SHOWS":
            return {
                ...state,
                top_rated:action.payload
            };
        case "LOAD_CAROUSAL_SHOWS":
            return {
                ...state,
                carousal_data:action.payload
            };
        default:
            return state;
    }
};

export default reducer;

