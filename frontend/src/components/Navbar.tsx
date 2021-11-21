import React, { createRef, useContext, useEffect, useState } from "react";
import "../scss/Navbar.scss";
import logo from "../assets/logo.png";
import user from "../assets/user.jpg";
import { AUTHCONTEXT, ERRORCONTEXT } from "../App";
import { useHistory, useLocation } from "react-router";
import { ShowData } from "../states/showsState";
import { MovieData } from "../states/moviesState";
import dataFetcher from "../utils/dataFetcher";
import { ActorData } from "../states/bookmarksState";
import HorizontalListView from "./HorizontalListView";

function Navbar({
  setShowEditProfileView,setPartialView
}: {
  setShowEditProfileView: React.Dispatch<React.SetStateAction<boolean>>,
  setPartialView:React.Dispatch<React.SetStateAction<{
        show: boolean;
        data: {};
        type: string;
    }>>
}) {
  let [profileContextMenu, setProfileContextMenu] = useState(false);
  let authContext = useContext(AUTHCONTEXT);
  let errorContext = useContext(ERRORCONTEXT);
  let [pageView, setPageView] = useState(0);
  let location = useLocation();
  let history = useHistory();

  // Search Control
  let [showSearchView, setSearchView] = useState(false);
  let searchTimerId: any = 0;
  let [written, setWritten] = useState(false);
  let [searchResults, setSearchResults] = useState<{
    loaded: boolean;
    results: {
      shows: ShowData[];
      movies: MovieData[];
      actors: ActorData[];
    };
  }>({
    loaded: false,
    results: {
      shows: [],
      movies: [],
      actors: [],
    },
  });
  let search=(searchText:string)=>{
    console.log("executed");
    dataFetcher.fetchAllSearchResults({
        authState:authContext?.authState,
        searchText,
        setSearchResults,
        addErrorMessage:errorContext?.addErrorMessage
    });
  }
  let doSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value.trim() === "") {
      if(written) setWritten(false);
    } else {
      if(!written) setWritten(true);
        let searchText = e.target.value.trim(); // this is the search text
        if(searchTimerId) clearTimeout(searchTimerId);
        searchTimerId = setTimeout(() => {
            search(searchText);
        }, 1000);
    }
  };


  // for navigation color indication
  useEffect(() => {
    if (location.pathname === "/movies") setPageView(0);
    else if (location.pathname === "/shows") setPageView(1);
    else setPageView(-1);
  }, [location.pathname]);

  return (
    <nav>
      <img alt="logo" src={logo} onClick={() => history.push("/")} />
      <div className="search">
        <div className="search-logo">
          <svg viewBox="0 0 12 12" className="SearchTypeahead-icon-20K">
            <path d="M11.407,10.421,8.818,7.832a4.276,4.276,0,1,0-.985.985l2.589,2.589a.7.7,0,0,0,.985-.985ZM2.355,5.352a3,3,0,1,1,3,3,3,3,0,0,1-3-3Z"></path>
          </svg>
        </div>
        <input
          onChange={(e) => doSearch(e)}
          type="text"
          placeholder="Search for media"
          onClick={() => setSearchView(!showSearchView)}
        />
        <ul>
          <li
            className={pageView === 0 ? "active" : ""}
            onClick={() => history.push("/movies")}
          >
            Movies
          </li>
          <li
            className={pageView === 1 ? "active" : ""}
            onClick={() => history.push("/shows")}
          >
            TV
          </li>
        </ul>
        {showSearchView ? (
          <div
            className="search-results"
            style={
              showSearchView
                ? {
                    display:"unset"
                  }
                : {
                    display:"none"
                  }
            }
          >
            {!written ? (
              <h1>Type to search for movies and shows</h1>
            ) : (
              <>
                {searchResults.loaded ? (
                  <>
                    {(searchResults.results.movies.length===0) && 
                    (searchResults.results.shows.length===0) && 
                    (searchResults.results.actors.length===0)?
                    <h1>Nothing Found. Try Something Else :)</h1>:null}

                    {searchResults.results.movies.length>0?<HorizontalListView
                        key={0}
                        name="Movies"
                        type="movie"
                        setPartialView={setPartialView}
                        data={searchResults.results.movies}
                    />:null}
                    {searchResults.results.shows.length>0?<HorizontalListView
                        key={1}    
                        name="Shows"
                        type="show"
                        data={searchResults.results.shows}
                        setPartialView={setPartialView}
                    />:null}
                    {searchResults.results.actors.length>0?<HorizontalListView
                        key={2}
                        name="Actors"
                        type="people"
                        data={searchResults.results.actors}
                        setPartialView={undefined}
                    />:null}
                  </>
                ) : (
                  <div className="search-loader">
                    <div className="loader"></div>
                    <h2>Searching results for you</h2>
                  </div>
                )}
              </>
            )}

          </div>
        ) : null}
      </div>
      <p onClick={() => history.push("/bookmarks")} title="Watchlist">
        <i className="fa fa-bookmark" aria-hidden="true"></i>
      </p>
      <div className="nav-profile">
        <img
          src={
            "http://localhost:3200/auth/accountPic/" +
            authContext?.authState.pic
          }
          alt="user-pic"
          onClick={() => setProfileContextMenu(!profileContextMenu)}
        />
        <ul
          style={
            profileContextMenu
              ? {
                  opacity: 1,
                  visibility: "unset",
                }
              : {
                  opacity: 0,
                  visibility: "hidden",
                }
          }
        >
          <li
            onClick={() => {
              setShowEditProfileView(true);
            }}
          >
            <i className="fa fa-cog" aria-hidden="true"></i> &nbsp;Edit Profile
          </li>
          <hr></hr>
          <li
            onClick={() => {
              authContext?.logOut();
            }}
          >
            <i className="fa fa-sign-out" aria-hidden="true"></i> &nbsp;Logout
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default React.memo(Navbar);
