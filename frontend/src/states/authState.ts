let _state:AuthState={
    email: "",
    name: "",
    pic: "",
    token: "",
    _id:""
}

export interface AuthState{
    email: string,
    name: string,
    pic: string,
    token: string,
    _id:string
}

export default _state;