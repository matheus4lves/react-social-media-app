import React, { useEffect } from "react";
import Page from "./Page";
import { useImmerReducer } from "use-immer";
import { CSSTransition } from "react-transition-group";
import Axios from "axios";

function HomeGuest() {
  const initialState = {
    username: {
      value: "",
      hasErros: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    email: {
      value: "",
      hasErros: false,
      message: "",
      isUnique: false,
      checkCount: 0,
    },
    password: {
      value: "",
      hasErros: false,
      message: "",
    },
    submitCount: 0,
  };

  function reducer(draft, action) {
    switch (action.type) {
      case "usernameImmediately":
        draft.username.hasErros = false;
        draft.username.value = action.value;
        if (draft.username.value.length > 30) {
          draft.username.hasErros = true;
          draft.username.message = "Username cannot exceed 30 characters.";
        }
        if (
          draft.username.value &&
          !/^([a-zA-Z0-9]+)$/.test(draft.username.value)
        ) {
          draft.username.hasErros = true;
          draft.username.message =
            "Username can only contain letters and numbers.";
        }
        return;
      case "usernameAfterDelay":
        if (draft.username.value.length < 3) {
          draft.username.hasErros = true;
          draft.username.message = "Username must be at least 3 characters.";
          /* Test if the chosen username wasn't already taken by someone,
          but only if it is a valid username (of course if it is an
            invalid username it will not be in the database, so we
            don't even have to bother about checking it) */
        }
        if (!draft.username.hasErros) {
          draft.username.checkCount++;
        }
        return;
      case "usernameUniqueResults":
        if (action.value) {
          draft.username.hasErros = true;
          draft.username.isUnique = false;
          draft.username.message = "That username has been already taken.";
        } else {
          draft.username.isUnique = true;
        }
        return;
      case "emailImmediately":
        draft.email.hasErros = false;
        draft.email.value = action.value;
        return;
      case "emailAfterDelay":
        if (!/^\S+@\S+$/.test(draft.email.value)) {
          draft.email.hasErros = true;
          draft.email.message = "You must provide a valid email address.";
        }
        if (!draft.email.hasErros) {
          draft.email.checkCount++;
        }
        return;
      case "emailUniqueResults":
        if (action.value) {
          draft.email.hasErros = true;
          draft.email.isUnique = false;
          draft.email.message = "That email has been already taken.";
        } else {
          draft.email.isUnique = true;
        }
        return;
      case "passwordImmediately":
        draft.password.hasErros = false;
        draft.password.value = action.value;
        if (draft.password.value.length > 50) {
          draft.password.hasErros = true;
          draft.password.message = "Password cannot exceed 50 characters!";
        }
        return;
      case "passwordAfterDelay":
        if (draft.password.value.length < 12) {
          draft.password.hasErros = true;
          draft.password.message = "Password must be at least 12 characters.";
        }
        return;
      case "submitForm":
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    if (state.username.value) {
      const delay = setTimeout(
        () => dispatch({ type: "usernameAfterDelay" }),
        750
      );

      return () => clearTimeout(delay);
    }
  }, [state.username.value]);

  useEffect(() => {
    if (state.email.value) {
      const delay = setTimeout(
        () => dispatch({ type: "emailAfterDelay" }),
        750
      );

      return () => clearTimeout(delay);
    }
  }, [state.email.value]);

  useEffect(() => {
    if (state.password.value) {
      const delay = setTimeout(
        () => dispatch({ type: "passwordAfterDelay" }),
        750
      );

      return () => clearTimeout(delay);
    }
  }, [state.password.value]);

  useEffect(() => {
    if (state.username.checkCount) {
      const serverRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/doesUsernameExist",
            { username: state.username.value },
            { cancelToken: serverRequest.token }
          );
          dispatch({ type: "usernameUniqueResults", value: response.data });
        } catch (e) {
          console.log(e.response.data);
        }
      }
      fetchResults();
      return () => serverRequest.cancel();
    }
  }, [state.username.checkCount]);

  useEffect(() => {
    if (state.email.checkCount) {
      const serverRequest = Axios.CancelToken.source();
      async function fetchResults() {
        try {
          const response = await Axios.post(
            "/doesEmailExist",
            { email: state.email.value },
            { cancelToken: serverRequest.token }
          );
          dispatch({ type: "emailUniqueResults", value: response.data });
        } catch (e) {
          console.log(e.response.data);
        }
      }
      fetchResults();
      return () => serverRequest.cancel();
    }
  }, [state.email.checkCount]);

  function handleSubmit(e) {
    e.preventDefault();
  }

  return (
    <Page title="Welcome!" wide={true}>
      <div className="row align-items-center">
        <div className="col-lg-7 py-3 py-md-5">
          <h1 className="display-3">Remember Writing?</h1>
          <p className="lead text-muted">
            Are you sick of short tweets and impersonal &ldquo;shared&rdquo;
            posts that are reminiscent of the late 90&rsquo;s email forwards? We
            believe getting back to actually writing is the key to enjoying the
            internet again.
          </p>
        </div>
        <div className="col-lg-5 pl-lg-5 pb-3 py-lg-5">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="username-register" className="text-muted mb-1">
                <small>Username</small>
              </label>
              <input
                onChange={(e) =>
                  dispatch({
                    type: "usernameImmediately",
                    value: e.target.value,
                  })
                }
                id="username-register"
                name="username"
                className="form-control"
                type="text"
                placeholder="Pick a username"
                autoComplete="off"
              />
              <CSSTransition
                in={state.username.hasErros}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.username.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="email-register" className="text-muted mb-1">
                <small>Email</small>
              </label>
              <input
                onChange={(e) =>
                  dispatch({ type: "emailImmediately", value: e.target.value })
                }
                id="email-register"
                name="email"
                className="form-control"
                type="text"
                placeholder="you@example.com"
                autoComplete="off"
              />
              <CSSTransition
                in={state.email.hasErros}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.email.message}
                </div>
              </CSSTransition>
            </div>
            <div className="form-group">
              <label htmlFor="password-register" className="text-muted mb-1">
                <small>Password</small>
              </label>
              <input
                onChange={(e) =>
                  dispatch({
                    type: "passwordImmediately",
                    value: e.target.value,
                  })
                }
                id="password-register"
                name="password"
                className="form-control"
                type="password"
                placeholder="Create a password"
              />
              <CSSTransition
                in={state.password.hasErros}
                timeout={330}
                classNames="liveValidateMessage"
                unmountOnExit
              >
                <div className="alert alert-danger small liveValidateMessage">
                  {state.password.message}
                </div>
              </CSSTransition>
            </div>
            <button
              type="submit"
              className="py-3 mt-4 btn btn-lg btn-success btn-block"
            >
              Sign up for ComplexApp
            </button>
          </form>
        </div>
      </div>
    </Page>
  );
}

export default HomeGuest;
