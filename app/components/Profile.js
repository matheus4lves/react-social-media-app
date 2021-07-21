import React, { useEffect, useContext } from "react";
import Page from "./Page";
import { useParams, NavLink, Switch, Route } from "react-router-dom";
import Axios from "axios";
import StateContext from "../StateContext";
import ProfilePosts from "./ProfilePosts";
import ProfilePeople from "./ProfilePeople";
import { useImmer } from "use-immer";

function Profile() {
  // useParams returns an object with url variables, like :username
  const { username } = useParams();
  const appState = useContext(StateContext);
  const [state, setState] = useImmer({
    followActionLoading: false,
    startFollowingRequestCount: 0,
    stopFollowingRequestCount: 0,
    profileData: {
      profileUsername: "...",
      profileAvatar: "https://gravatar.com/avatar/placeholder?s=128",
      isFollowing: false,
      counts: { postCount: "", followerCount: "", followingCount: "" },
    },
  });

  useEffect(() => {
    // Identify the request
    const serverRequest = Axios.CancelToken.source();

    async function fetchData() {
      try {
        const response = await Axios.post(
          `/profile/${username}`,
          {
            token: appState.user.token,
          },
          { cancelToken: serverRequest.token }
        );
        setState((draft) => {
          draft.profileData = response.data;
        });
      } catch (e) {
        console.log(e.response.data);
      }
    }

    fetchData();

    return () => {
      serverRequest.cancel();
    };
  }, [username]);

  function startFollowing() {
    setState((draft) => {
      draft.startFollowingRequestCount++;
    });
  }

  useEffect(() => {
    if (state.startFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const serverRequest = Axios.CancelToken.source();

      async function fetchData() {
        try {
          const response = await Axios.post(
            `/addFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            { cancelToken: serverRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = true;
            draft.profileData.counts.followerCount++;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log(e.response.data);
        }
      }

      fetchData();

      return () => {
        serverRequest.cancel();
      };
    }
  }, [state.startFollowingRequestCount]);

  function stopFollowing() {
    setState((draft) => {
      draft.stopFollowingRequestCount++;
    });
  }

  useEffect(() => {
    if (state.stopFollowingRequestCount) {
      setState((draft) => {
        draft.followActionLoading = true;
      });

      const serverRequest = Axios.CancelToken.source();

      async function fetchData() {
        try {
          const response = await Axios.post(
            `/removeFollow/${state.profileData.profileUsername}`,
            {
              token: appState.user.token,
            },
            { cancelToken: serverRequest.token }
          );
          setState((draft) => {
            draft.profileData.isFollowing = false;
            draft.profileData.counts.followerCount--;
            draft.followActionLoading = false;
          });
        } catch (e) {
          console.log(e.response.data);
        }
      }

      fetchData();

      return () => {
        serverRequest.cancel();
      };
    }
  }, [state.stopFollowingRequestCount]);

  return (
    <Page title="Profile Screen">
      <h2>
        <img className="avatar-small" src={state.profileData.profileAvatar} />
        {state.profileData.profileUsername}
        {appState.loggedIn &&
          !state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={startFollowing}
              disabled={state.followActionLoading}
              className="btn btn-primary btn-sm ml-2"
            >
              Follow <i className="fas fa-user-plus"></i>
            </button>
          )}

        {appState.loggedIn &&
          state.profileData.isFollowing &&
          appState.user.username != state.profileData.profileUsername &&
          state.profileData.profileUsername != "..." && (
            <button
              onClick={stopFollowing}
              disabled={state.followActionLoading}
              className="btn btn-danger btn-sm ml-2"
            >
              Stop Following <i className="fas fa-user-times"></i>
            </button>
          )}
      </h2>

      <div className="profile-nav nav nav-tabs pt-2 mb-4">
        <NavLink
          exact
          to={`/profile/${state.profileData.profileUsername}`}
          className="nav-item nav-link"
        >
          Posts: {state.profileData.counts.postCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/followers`}
          className="nav-item nav-link"
        >
          Followers: {state.profileData.counts.followerCount}
        </NavLink>
        <NavLink
          to={`/profile/${state.profileData.profileUsername}/following`}
          className="nav-item nav-link"
        >
          Following: {state.profileData.counts.followingCount}
        </NavLink>
      </div>

      <Switch>
        <Route exact path="/profile/:username">
          <ProfilePosts />
        </Route>
        <Route path="/profile/:username/followers">
          <ProfilePeople type="followers" />
        </Route>
        <Route path="/profile/:username/following">
          <ProfilePeople type="following" />
        </Route>
      </Switch>
    </Page>
  );
}

export default Profile;
