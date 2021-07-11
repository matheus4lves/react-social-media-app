import React, { useEffect } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import { useImmerReducer } from "use-immer";

function EditPost() {
  const initialState = {
    title: {
      value: "",
      hasErros: false,
      errorMessage: "",
    },
    body: {
      value: "",
      hasErros: false,
      errorMessage: "",
    },
    isFetching: true,
    isSaving: false,
    id: useParams().id,
    sendCount: 0,
  };

  // Remember that draft is a "copy" of the initialState
  function reducer(draft, action) {
    switch (action.type) {
      case "fetchCompleted":
        draft.title.value = action.value.title;
        draft.body.value = action.value.body;
        draft.isFetching = false;
        return;
    }
  }

  const [state, dispatch] = useImmerReducer(reducer, initialState);

  useEffect(() => {
    // Identify the axios request
    const serverRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${state.id}`, {
          cancelToken: serverRequest.token,
        });
        // the value will be used by the fetchCompleted case inside the
        // switch
        dispatch({ type: "fetchCompleted", value: response.data });
      } catch (e) {
        console.log(e.response.data);
      }
    }

    fetchPost();

    // Cleanup function to solve the following memory leak:
    /*     Warning: Can't perform a React state update on an unmounted 
    component. This is a no-op, but it indicates a memory leak in your
    application. To fix, cancel all subscriptions and asynchronous tasks 
    in a useEffect cleanup function.
    EditPost@webpack-internal:///./app/components/
    ViewSinglePost.js:21:66 */
    return () => {
      serverRequest.cancel();
    };
  }, []);

  if (state.isFetching) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  return (
    <Page title="Edit Post">
      <form>
        <div className="form-group">
          <label htmlFor="post-title" className="text-muted mb-1">
            <small>Title</small>
          </label>
          <input
            autoFocus
            name="title"
            id="post-title"
            value={state.title.value}
            className="form-control form-control-lg form-control-title"
            type="text"
            placeholder=""
            autoComplete="off"
          />
        </div>

        <div className="form-group">
          <label htmlFor="post-body" className="text-muted mb-1 d-block">
            <small>Body Content</small>
          </label>
          <textarea
            name="body"
            id="post-body"
            value={state.body.value}
            className="body-content tall-textarea form-control"
            type="text"
          />
        </div>

        <button className="btn btn-primary">Save Updates</button>
      </form>
    </Page>
  );
}

export default EditPost;
