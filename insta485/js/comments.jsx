import { get } from "cypress/types/jquery";
import React, { useEffect, useState, useCallback } from "react";
import DeleteCommentButton from "./deleteCommentButton";

function Comments({ url, postid }) {
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [deletec, setDeletec] = useState(0);

  const get_all = () => {
    fetch(url, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        const newcmt = data.comments.map(
          ({ ownerShowUrl, commentid, owner, text, lognameOwnsThis }) => ({
            ownerShowUrl,
            commentid,
            owner,
            text,
            lognameOwnsThis,
          })
        );
        setComments(newcmt);
      })
      .catch((error) => console.log(error));
  };

  get_all();

  const handle_click = () => {
    console.log("handle_click");
    fetch(`/api/v1/comments/${comment.commentid}/`, {
      credentials: "same-origin",
      method: "DELETE",
    })
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
      
    })
    .then(updateFn)
    .catch((error) => console.log(error));
  };

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetch(`/api/v1/comments/?postid=${postid}`, {
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      method: "POST",
      body: JSON.stringify({ text: value }),
    })
      .then((response) => {
        setValue("");
        return response.json();
      })
      .catch((error) => console.log(error));
  };

  return (
    <div>
      {comments.map((comment) => {
        let delete_button;
        if (comment.lognameOwnsThis === true) {
          delete_button = <DeleteCommentButton handle_click={handle_click} />;
        } else {
          delete_button = null;
        }
        return (
          <div key={comment.commentid}>
            {delete_button}
            <a href={comment.ownerShowUrl}>{comment.owner} &nbsp;</a>
            <span>{comment.text}</span>
          </div>
        );
      })}
      <form onSubmit={handleSubmit}>
        <input value={value} onChange={handleChange} required />
      </form>
    </div>
  );
}

export default Comments;
