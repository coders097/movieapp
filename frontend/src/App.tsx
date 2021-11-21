import React, { createContext, useEffect, useReducer, useState } from "react";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import Movies from "./pages/Movies";
import PNF from "./pages/PNF";
import TVShows from "./pages/TVShows";
import Movie from "./pages/Movie";
import TVShow from "./pages/TVShow";
import Bookmarks from "./pages/Bookmarks";
import People from "./pages/People";
import HomePage from "./pages/HomePage";
import fetcher from "./utils/dataFetcher";
import bookmarkManager from "./utils/bookmarkManager";

// importing all required states and reducers
import _authState, { AuthState } from "./states/authState";
import _authReducer from "./reducers/authReducer";
import _moviesState, { MoviesState, MovieData } from "./states/moviesState";
import _moviesReducer from "./reducers/movieReducer";
import _showsState, { ShowData, ShowState } from "./states/showsState";
import _showsReducer from "./reducers/showReducer";
import _bookmarksState, {
  ActorData,
  BookmarkState,
} from "./states/bookmarksState";
import _bookmarksReducer from "./reducers/bookmarksReducer";

import PartialView from "./components/PartialView";
import EditProfile from "./components/EditProfile";
import ImageViewer from "./components/ImageViewer";
import ErrorContainer from "./components/ErrorContainer";

// Contexts
export const AUTHCONTEXT = createContext<{
  signIn: boolean;
  setSignIn: React.Dispatch<React.SetStateAction<boolean>>;
  authState: AuthState;
  authDispatch: React.Dispatch<{
    type: string;
    payload: any;
  }>;
  logOut: () => void;
} | null>(null);

export const MOVIESCONTEXT = createContext<{
  moviesState: MoviesState;
  moviesDispatch: React.Dispatch<{
    type: string;
    payload: MovieData[];
  }>;
  moviesGenre: Map<number, string>;
} | null>(null);

export const SHOWSCONTEXT = createContext<{
  showsState: ShowState;
  showsDispatch: React.Dispatch<{
    type: string;
    payload: ShowData[];
  }>;
  showsGenre: Map<number, string>;
} | null>(null);

export const BOOKMARKSCONTEXT = createContext<{
  bookmarksState: BookmarkState;
  bookmarksDispatch: React.Dispatch<{
    type: string;
    payload?: MovieData | ShowData | BookmarkState | ActorData | undefined;
  }>;
  bookmarksMap: Map<string, boolean>;
} | null>(null);

export const ERRORCONTEXT = createContext<{
  errorMessagesState: {
    id: string;
    title: string;
    message: string;
  }[];
  setErrorMessagesState: React.Dispatch<
    React.SetStateAction<
      {
        id: string;
        title: string;
        message: string;
      }[]
    >
  >;
  removeErrorMessage: (id: string) => void;
  addErrorMessage: (error: {
    id: string;
    title: string;
    message: string;
  }) => void;
} | null>(null);

const App: React.FC = () => {
  let [signIn, setSignIn] = useState(false);

  // Show popup movie view config
  let [partialView, setPartialView] = useState({
    show: false,
    data: {},
    type: "",
  });
  useEffect(() => {
    let container = document.querySelector(".PartialView");
    if (partialView.show) {
      container?.classList.add("PartialView--show");
    } else {
      container?.classList.remove("PartialView--show");
    }
  }, [partialView]);

  // Show edit profile view config
  let [showEditProfileView, setShowEditProfileView] = useState(false);
  useEffect(() => {
    let editView = document.getElementById("EditProfile") as HTMLElement;
    if (editView && showEditProfileView) {
      editView!.style.opacity = "1";
      editView!.style.visibility = "unset";
    } else {
      editView!.style.opacity = "0";
      editView!.style.visibility = "hidden";
    }
  }, [showEditProfileView]);

  // load reducers
  let [authState, authDispatch] = useReducer(_authReducer, _authState);
  let [moviesState, moviesDispatch] = useReducer(_moviesReducer, _moviesState);
  let [showsState, showsDispatch] = useReducer(_showsReducer, _showsState);

  let [bookmarksState, bookmarksDispatch] = useReducer(
    _bookmarksReducer,
    _bookmarksState
  );
  let [bookmarksMap, setBookmarksMap] = useState(new Map<string, boolean>());

  useEffect(() => {
    let newMap = new Map<string, boolean>();
    bookmarksState.shows.forEach((bookmark) =>
      newMap.set(`SHOW-${bookmark.id}`, true)
    );
    bookmarksState.movies.forEach((bookmark) =>
      newMap.set(`MOVIE-${bookmark.id}`, true)
    );
    bookmarksState.actors.forEach((bookmark) =>
      newMap.set(`ACTOR-${bookmark.id}`, true)
    );
    setBookmarksMap(newMap);
    // console.log(bookmarksState);
  }, [bookmarksState]);

  // all genres
  let [moviesGenre, setMoviesGenre] = useState(new Map<number, string>());
  let [showsGenre, setShowsGenre] = useState(new Map<number, string>());

  let logOut = () => {
    authDispatch({
      type: "LOGOUT",
    });
    setSignIn(false);
  };

  useEffect(() => {
    if (signIn) {
      // check for expiration of account in cache
      (function _() {
        fetch("http://localhost:3200/auth/checkValidity", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success) {
              console.log("working");
            } else logOut();
          });
      })();
    } else setShowEditProfileView(false);
  }, [signIn]);

  useEffect(() => {
    if (signIn) {
      // load all movies data
      fetcher.fetchAllMovieOrShowGenres({
        logOut,
        setMoviesGenre,
        type: "movie",
        addErrorMessage
      });
      fetcher.trendingMoviesOrShowsFetch({
        moviesDispatch,
        logOut,
        authState,
        type: "movie",
        addErrorMessage
      });
      fetcher.popularMoviesOrShowsFetch({
        moviesDispatch,
        logOut,
        authState,
        type: "movie",
        addErrorMessage
      });
      fetcher.topRatedMoviesOrShowsFetch({
        moviesDispatch,
        logOut,
        authState,
        type: "movie",
        addErrorMessage
      });

      // load all shows data
      fetcher.fetchAllMovieOrShowGenres({
        logOut,
        setShowsGenre,
        type: "show",
        addErrorMessage
      });
      fetcher.trendingMoviesOrShowsFetch({
        logOut,
        authState,
        showsDispatch,
        type: "show",
        addErrorMessage
      });
      fetcher.popularMoviesOrShowsFetch({
        logOut,
        authState,
        showsDispatch,
        type: "show",
        addErrorMessage
      });
      fetcher.topRatedMoviesOrShowsFetch({
        logOut,
        authState,
        showsDispatch,
        type: "show",
        addErrorMessage
      });

      // Bookmarks fetch
      bookmarkManager.fetchBookmarks({
        authContext: { signIn, setSignIn, authState, authDispatch, logOut },
        bookmarksContext: {
          bookmarksDispatch,
          bookmarksState,
          bookmarksMap,
        },
        addErrorMessage
      });
    }
  }, [signIn]);

  // Image Viewer config
  let [picState, setPicState] = useState({
    pic: "",
    show: false,
  });
  useEffect(() => {
    let container = document.getElementById("ImageViewer") as HTMLElement;
    if (picState.show) {
      container.style.opacity = "1";
      container.style.visibility = "unset";
    } else {
      container.style.opacity = "0";
      container.style.visibility = "hidden";
    }
  }, [picState]);

  // Error Message Config
  let [errorMessagesState, setErrorMessagesState] = useState<
    {
      id: string;
      title: string;
      message: string;
    }[]
  >([]);
  let removeErrorMessage = (id: string) => {
    errorMessagesState = errorMessagesState.filter((e) => e.id !== id);
    setErrorMessagesState([...errorMessagesState]);
  };
  let addErrorMessage = (error: {
    id: string;
    title: string;
    message: string;
  }) => {
    console.log("Run");
    errorMessagesState.push(error);
    setTimeout(() => {
      removeErrorMessage(error.id);
    }, 5000);
    setErrorMessagesState([...errorMessagesState]);
  };

  return (
    <AUTHCONTEXT.Provider
      value={{ signIn, setSignIn, authState, authDispatch, logOut }}
    >
      <ERRORCONTEXT.Provider
          value={{
            addErrorMessage,
            errorMessagesState,
            removeErrorMessage,
            setErrorMessagesState,
          }}
        >
      {signIn ? (
        <BrowserRouter>
          <MOVIESCONTEXT.Provider
            value={{ moviesState, moviesDispatch, moviesGenre }}
          >
            <SHOWSCONTEXT.Provider
              value={{ showsState, showsDispatch, showsGenre }}
            >
              <BOOKMARKSCONTEXT.Provider
                value={{ bookmarksDispatch, bookmarksState, bookmarksMap }}
              >     
                  <Navbar setShowEditProfileView={setShowEditProfileView} setPartialView={setPartialView}/>
                  <Switch>
                    <Route exact path="/" render={() => <HomePage />} />
                    <Route
                      path="/movies"
                      render={() => <Movies setPartialView={setPartialView} />}
                    />
                    <Route
                      path="/shows"
                      render={() => <TVShows setPartialView={setPartialView} />}
                    />
                    <Route
                      path="/movie"
                      render={() => <Movie setPartialView={setPartialView} />}
                    />
                    <Route
                      path="/show"
                      render={() => <TVShow setPartialView={setPartialView} />}
                    />
                    <Route
                      path="/bookmarks"
                      render={() => (
                        <Bookmarks setPartialView={setPartialView} />
                      )}
                    />
                    <Route
                      path="/people"
                      render={() => (
                        <People
                          setPartialView={setPartialView}
                          setPicState={setPicState}
                        />
                      )}
                    />
                    <Route render={() => <PNF />} />
                  </Switch>
                  <Footer />
                  <PartialView
                    partialView={partialView}
                    setPartialView={setPartialView}
                  />
                  <EditProfile
                    setShowEditProfileView={setShowEditProfileView}
                  />
                  <ImageViewer pic={picState.pic} setPicState={setPicState} />
              </BOOKMARKSCONTEXT.Provider>
            </SHOWSCONTEXT.Provider>
          </MOVIESCONTEXT.Provider>
        </BrowserRouter>
      ) : (
        <LandingPage />
        )}
        {errorMessagesState.length > 0 ? <ErrorContainer /> : null}
      </ERRORCONTEXT.Provider>
    </AUTHCONTEXT.Provider>
  );
};

export default App;
