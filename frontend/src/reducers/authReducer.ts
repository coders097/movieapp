import authState,{ AuthState } from "../states/authState";


const reducer=(state:AuthState,action:any)=>{
    switch(action.type){
        case 'LOGIN':
            localStorage.setItem("_login_data",JSON.stringify(action.payload));
            return action.payload;
        case "CACHE_LOAD_LOGIN":
            let data=localStorage.getItem("_login_data");
            if(data){
                action.payload.setSignIn(true);
                return JSON.parse(data);
            }else return state;
        case 'LOGOUT':
            localStorage.removeItem("_login_data");
            return {
                email:"",
                name:"",
                pic:"",
                token:"",
                _id:""
            };
        case 'EDITPROFILE':
            let newState={
                ...state,
                ...action.payload
            }
            localStorage.setItem("_login_data",JSON.stringify(newState));
            return newState;

        default:
            return state;
    }
};

export default reducer;