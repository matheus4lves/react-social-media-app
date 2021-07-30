import React, { useState, useReducer, useEffect, Suspense } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";
import { CSSTransition } from "react-transition-group";

Axios.defaults.baseURL = "http://localhost:8080";

import StateContext from "./StateContext";
import DispatchContext from "./DispatchContext";

// My components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Home from "./components/Home";
import Footer from "./components/Footer";
import About from "./components/About";
import Terms from "./components/Terms";
// import() is a dynamic import
const CreatePost = React.lazy(() => import("./components/CreatePost"));
const ViewSinglePost = React.lazy(() => import("./components/ViewSinglePost"));
import FlashMessages from "./components/FlashMessages";
import Profile from "./components/Profile";
import EditPost from "./components/EditPost";
import NotFound from "./components/NotFound";
const Search = React.lazy(() => import("./components/Search"));
const Chat = React.lazy(() => import("./components/Chat"));
import LoadingDotsIcon from "./components/LoadingDotsIcon";

function Main() {
  const initialState = {
    loggedIn: Boolean(localStorage.getItem("socialMediaAppToken")),
    flashMessages: [],
    // Centralize local storage manipulation
    user: {
      token: localStorage.getItem("socialMediaAppToken"),
      username: localStorage.getItem("socialMediaAppUsername"),
      avatar: localStorage.getItem("socialMediaAppAvatar"),
    },
    isSearchOpen: false,
    isChatOpen: false,
    unreadMessagesCount: 0,
  };

  // When you call dispatch, the type passed refers to the action to be
  // executed
  function reducer(draft, action) {
    switch (action.type) {
      case "login":
        draft.loggedIn = true;
        draft.user = action.data;
        // You could've used "break" here, but since you're inside a
        // function, the "return" statement fits well
        return;
      case "logout":
        draft.loggedIn = false;
        return;
      case "flashMessage":
        draft.flashMessages.push(action.value);
        return;
      case "searchOpened":
        draft.isSearchOpen = true;
        return;
      case "searchClosed":
        draft.isSearchOpen = false;
        return;
      case "chatToggled":
        draft.isChatOpen = !draft.isChatOpen;
        return;
      case "chatClosed":
        draft.isChatOpen = false;
        return;
      case "unreadMessagesCountIncremented":
        draft.unreadMessagesCount++;
        return;
      case "unreadMessagesCountReseted":
        draft.unreadMessagesCount = 0;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.loggedIn) {
      localStorage.setItem("socialMediaAppToken", state.user.token);
      localStorage.setItem("socialMediaAppUsername", state.user.username);
      localStorage.setItem("socialMediaAppAvatar", state.user.avatar);
    } else {
      localStorage.removeItem("socialMediaAppToken");
      localStorage.removeItem("socialMediaAppUsername");
      localStorage.removeItem("socialMediaAppAvatar");
    }
  }, [state.loggedIn]);

  // Check if the token has expired or not on first render
  useEffect(() => {
    // We only check the token if the user has one
    if (state.loggedIn) {
      const serverRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/checkToken",
            { token: state.user.token },
            { cancelToken: serverRequest.token }
          );
          if (!response.data) {
            dispatch({ type: "logout" });
            dispatch({
              type: "flashMessage",
              value: "You have to login again.",
            });
          }
        } catch (e) {
          console.log(e.response.data);
        }
      }

      fetchResults();
      return () => serverRequest.cancel();
    }
  }, []);

  return (
    /* Everything inside value will be available for all wrapped 
    components */
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Suspense fallback={<LoadingDotsIcon />}>
            <Switch>
              {/* to make an url parameter (which is dynamic), use colon */}
              <Route path="/profile/:username">
                <Profile />
              </Route>
              <Route path="/" exact>
                {state.loggedIn ? <Home /> : <HomeGuest />}
              </Route>
              {/* The :id will be replaced by the unique id of the post,
            for example, ...post/tyojlBalj81jlpzZoU */}
              <Route path="/post/:id" exact>
                <ViewSinglePost />
              </Route>
              <Route path="/post/:id/edit" exact>
                <EditPost />
              </Route>
              <Route path="/create-post">
                <CreatePost />
              </Route>
              <Route path="/about-us">
                <About />
              </Route>
              <Route path="/terms">
                <Terms />
              </Route>
              <Route>
                <NotFound />
              </Route>
            </Switch>
          </Suspense>
          <CSSTransition
            timeout={330}
            in={state.isSearchOpen}
            classNames="search-overlay"
            unmountOnExit
          >
            <div className="search-overlay">
              <Suspense fallback={null}>
                <Search />
              </Suspense>
            </div>
          </CSSTransition>
          <Suspense fallback={null}>{state.loggedIn && <Chat />}</Suspense>
          <Footer />
        </BrowserRouter>
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
