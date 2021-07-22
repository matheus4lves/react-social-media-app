import React, { useEffect } from "react";
import { Link } from "react-router-dom";

function Post(props) {
  const date = new Date(props.post.createdDate);
  const dateFormatted = `${
    date.getMonth() + 1
  }/${date.getDate()}/${date.getFullYear()}`;

  return (
    <Link
      onClick={props.onClick}
      to={`/post/${props.post._id}`}
      className="list-group-item list-group-item-action"
    >
      <img className="avatar-tiny" src={props.post.author.avatar} />{" "}
      <strong>{props.post.title}</strong>{" "}
      <span className="text-muted small">
        {!props.hideAuthor && <>by {props.post.author.username}</>} on{" "}
        {dateFormatted}{" "}
      </span>
    </Link>
  );
}

export default Post;
