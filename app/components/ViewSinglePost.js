import React, { useEffect, useState } from "react";
import Page from "./Page";
import Axios from "axios";
import { useParams, Link } from "react-router-dom";
import LoadingDotsIcon from "./LoadingDotsIcon";
import ReactMarkdown from "react-markdown";
import ReactTooltip from "react-tooltip";
import NotFound from "./NotFound";

function ViewSinglePost() {
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [post, setPost] = useState();

  useEffect(() => {
    // Identify the axios request
    const serverRequest = Axios.CancelToken.source();

    async function fetchPost() {
      try {
        const response = await Axios.get(`/post/${id}`, {
          cancelToken: serverRequest.token,
        });
        setPost(response.data);
        setIsLoading(false);
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
    ViewSinglePost@webpack-internal:///./app/components/
    ViewSinglePost.js:21:66 */
    return () => {
      serverRequest.cancel();
    };
  }, []);

  if (!isLoading && !post) {
    return <NotFound />;
  }

  if (isLoading) {
    return (
      <Page title="...">
        <LoadingDotsIcon />
      </Page>
    );
  }

  // After fetching a post, get its date and format it
  const date = new Date(post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Page title={post.title}>
      <div className="d-flex justify-content-between">
        <h2>{post.title}</h2>
        <span className="pt-2">
          <Link
            to={`/post/${post._id}/edit`}
            data-tip="Edit"
            data-for="edit"
            className="text-primary mr-2"
          >
            <i className="fas fa-edit"></i>
          </Link>
          <ReactTooltip id="edit" className="custom-tooltip" />{" "}
          <a
            data-tip="Delete"
            data-for="delete"
            className="delete-post-button text-danger"
          >
            <i className="fas fa-trash"></i>
          </a>
          <ReactTooltip id="delete" className="custom-tooltip" />
        </span>
      </div>

      <p className="text-muted small mb-4">
        <Link to={`/profile/${post.author.username}`}>
          <img className="avatar-tiny" src={post.author.avatar} />
        </Link>
        Posted by{" "}
        <Link to={`/profile/${post.author.username}`}>
          {post.author.username}
        </Link>{" "}
        on {dateFormatted}
      </p>

      <div className="body-content">
        <ReactMarkdown
          children={post.body}
          allowedTypes={[
            "paragraph",
            "strong",
            "emphasis",
            "text",
            "list",
            "listItem",
          ]}
        />
      </div>
    </Page>
  );
}

export default ViewSinglePost;
