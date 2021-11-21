import { AuthState } from "../states/authState"
import { ActorData, BookmarkState } from "../states/bookmarksState";
import { MovieData } from "../states/moviesState";
import { ShowData } from "../states/showsState";
import keyGen from './uniqueKeysGenerator';

let fetchBookmarks=(helper:{
    authContext:{
        signIn: boolean;
        setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
        authState: AuthState;
        authDispatch: React.Dispatch<{
            type: string;
            payload: any;
        }>;
        logOut: () => void;
    } | null,
    bookmarksContext:{
        bookmarksState: BookmarkState;
        bookmarksDispatch: React.Dispatch<{
            type: string;
            payload?: ShowData | MovieData | BookmarkState | ActorData | undefined;
        }>;
        bookmarksMap: Map<string, boolean>;
    } | null,
    addErrorMessage:(error: {
        id: string;
        title: string;
        message: string;
    }) => void
})=>{
    fetch("http://localhost:3200/bookmarkService/allBookmarks",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${helper.authContext?.authState.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id:helper.authContext?.authState._id
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.success){
            helper.bookmarksContext?.bookmarksDispatch({
                type:"LOAD_BOOKMARKS",
                payload:data.data
            });
        }else{
            helper.addErrorMessage({
                id:keyGen(),
                title:"BOOKMARK DATA FETCH",
                message:"Failed To Fetch All Bookmarks! Check your net connection!"
            })
        }
    })
    .catch(err=>{
        console.log(err);
        helper.addErrorMessage({
            id:keyGen(),
            title:"BROWSER PROBLEM",
            message:"Don't Panic Will recover itself or just Refresh!"
        });
    });
}
let manageBookmark=(helper:{
    authContext:{
        signIn: boolean;
        setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
        authState: AuthState;
        authDispatch: React.Dispatch<{
            type: string;
            payload: any;
        }>;
        logOut: () => void;
    } | null,
    type:"MOViE" | "SHOW" | "ACTOR",
    data:any,
    command:"ADD" | "DEL",
    bookmarksContext:{
        bookmarksState: BookmarkState;
        bookmarksDispatch: React.Dispatch<{
            type: string;
            payload?: ShowData | MovieData | BookmarkState | ActorData | undefined;
        }>;
        bookmarksMap: Map<string, boolean>;
    } | null,
    addErrorMessage?:(error: {
        id: string;
        title: string;
        message: string;
    }) => void
})=>{
    fetch("http://localhost:3200/bookmarkService/manageBookmark",{
        method:"POST",
        headers:{
            "Authorization":`Bearer ${helper.authContext?.authState.token}`,
            "Content-Type":"application/json"
        },
        body:JSON.stringify({
            id:helper.authContext?.authState._id,
            type:helper.type,
            data:helper.data,
            command:helper.command
        })
    }).then(res=>res.json())
    .then(data=>{
        if(data.success){
            if(helper.command==="ADD"){
                if(helper.type==="MOViE"){
                    let newState=helper.bookmarksContext?.bookmarksState;
                    newState?.movies.push(helper.data);
                    helper.bookmarksContext?.bookmarksDispatch({
                        type:"ADD_BOOKMARK_MOVIE",
                        payload:newState
                    });
                } else if(helper.type==="ACTOR"){ 
                    let newState=helper.bookmarksContext?.bookmarksState;
                    newState?.actors.push(helper.data);
                    helper.bookmarksContext?.bookmarksDispatch({
                        type:"ADD_BOOKMARK_ACTOR", 
                        payload:newState
                    });
                } else{
                    let newState=helper.bookmarksContext?.bookmarksState;
                    newState?.shows.push(helper.data);
                    helper.bookmarksContext?.bookmarksDispatch({
                        type:"ADD_BOOKMARK_SHOW",
                        payload:newState
                    });
                }
            }else{
                if(helper.type==="MOViE")
                    helper.bookmarksContext?.bookmarksDispatch({
                        type:"DELETE_BOOKMARK_MOVIE",
                        payload:helper.data
                    });
                else if(helper.type==="ACTOR"){
                    let dataToDelete=helper.data;
                    let newState=helper.bookmarksContext?.bookmarksState;
                    if(newState) newState.actors=newState.actors.filter(val=>val.id!==dataToDelete.id);
                    helper.bookmarksContext?.bookmarksDispatch({
                        type:"DELETE_BOOKMARK_ACTOR",
                        payload:newState
                    });
                }else helper.bookmarksContext?.bookmarksDispatch({
                    type:"DELETE_BOOKMARK_SHOW",
                    payload:helper.data
                });
            }
        }else{
            if(helper.addErrorMessage)
                helper.addErrorMessage({
                    id:keyGen(),
                    title:"BOOKMARK FAILED",
                    message:data.error
                });
            alert(data.error);
        }
    })
    .catch(err=>{
        console.log(err);
        if(helper.addErrorMessage)
            helper.addErrorMessage({
                id:keyGen(),
                title:"BROWSER PROBLEM",
                message:"Don't Panic Will recover itself or just Refresh!"
            });
    });
}


export default {
    fetchBookmarks,
    manageBookmark,
} 