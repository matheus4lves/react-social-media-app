import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";

function ProfileFollowers() {
  const [isLoading, setIsLoading] = useState(true);
  // The initial state is an empty array because the server will send
  // an array with posts
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const serverRequest = Axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/followers`, {
          cancelToken: serverRequest.token,
        });
        setPosts(response.data);
        setIsLoading(false);
      } catch (e) {
        console.log(e.response.data);
      }
    }

    fetchPosts();

    // cleanup function
    return () => {
      serverRequest.cancel();
    };
  }, [username]);

  if (isLoading) return <LoadingDotsIcon />;

  return (
    <div className="list-group">
      {posts.map((follower, index) => {
        return (
          <Link
            key={index}
            to={`/profile/${follower.username}`}
            className="list-group-item list-group-item-action"
          >
            <img className="avatar-tiny" src={follower.avatar} />
            {follower.username}
          </Link>
        );
      })}
    </div>
  );
}

export default ProfileFollowers;
