import React, { useEffect, useState } from "react";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import Post from "./Post";

function ProfilePosts() {
  const [isLoading, setIsLoading] = useState(true);
  // The initial state is an empty array because the server will send
  // an array with posts
  const [posts, setPosts] = useState([]);
  const { username } = useParams();

  useEffect(() => {
    const serverRequest = Axios.CancelToken.source();

    async function fetchPosts() {
      try {
        const response = await Axios.get(`/profile/${username}/posts`, {
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
      {posts.map((post) => {
        return <Post post={post} key={post._id} hideAuthor={true} />;
      })}
    </div>
  );
}

export default ProfilePosts;
