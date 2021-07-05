import React, { useState, useReducer, useEffect } from "react";
import ReactDOM from "react-dom";
import { useImmerReducer } from "use-immer";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Axios from "axios";

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
import CreatePost from "./components/CreatePost";
import ViewSinglePost from "./components/ViewSinglePost";
import FlashMessages from "./components/FlashMessages";

function Main() {
  const initalState = {
    loggedIn: Boolean(localStorage.getItem("socialMediaAppToken")),
    flashMessages: [],
    // Centralize local storage manipulation
    user: {
      token: localStorage.getItem("socialMediaAppToken"),
      username: localStorage.getItem("socialMediaAppUsername"),
      avatar: localStorage.getItem("socialMediaAppAvatar"),
    },
  };

  // When you call dispatch, the type passed refers to the action to be
  // executed
  function ourReducer(draft, action) {
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
    }
  }

  const [state, dispatch] = useImmerReducer(ourReducer, initalState);

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

  return (
    /* Everything inside value will be available for all wrapped 
    components */
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        <BrowserRouter>
          <FlashMessages messages={state.flashMessages} />
          <Header />
          <Switch>
            <Route path="/" exact>
              {state.loggedIn ? <Home /> : <HomeGuest />}
            </Route>
            {/* The :id will be replaced by the unique id of the post,
            for example, ...post/tyojlBalj81jlpzZoU */}
            <Route path="/post/:id">
              <ViewSinglePost />
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
          </Switch>
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
