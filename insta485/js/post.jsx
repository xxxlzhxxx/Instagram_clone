import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import moment from "moment";
import LikeButton from "./likeButton";

// The parameter of this function is an object with a string called url inside it.
// url is a prop for the Post component.
export default function Post({ url }) {
  /* Display image and post owner of a single post */
  const [imgUrl, setImgUrl] = useState("");
  const [owner, setOwner] = useState("");
  const [time, setTime] = useState("");
  const [postid, setPostid] = useState("");
  const [likes, setLikes] = useState([]);
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [num, setNum] = useState(0);
  const [ownerImgUrl, setOwnerImgUrl] = useState("");
  const [ownerShowUrl, setOwnershowurl] = useState("");
  const [dataLoaded, setDataLoaded] = useState(false);
  let commentid;

  useEffect(() => {
    // Declare a boolean flag that we can use to cancel the API request.
    let ignoreStaleRequest = false;

    // Call REST API to get the post's information
    fetch(url, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
      })
      .then((data) => {
        // If ignoreStaleRequest was set to true, we want to ignore the results of the
        // the request. Otherwise, update the state to trigger a new render.
        if (!ignoreStaleRequest) {
          setImgUrl(data.imgUrl);
          setOwner(data.owner);
          setTime(moment.utc(data.created).local().fromNow());
          setPostid(data.postid);
          setOwnershowurl(data.ownerShowUrl);
          setLikes(data.likes);
          setOwnerImgUrl(data.ownerImgUrl);
          const newcmt = data.comments.forEach((comment) => {
            newcmt.ownerShowUrl = comment.owenerShowUrl;
            newcmt.commentid = comment.commentid;
            newcmt.owner = comment.owner;
            newcmt.text = comment.text;
            newcmt.lognameOwnsThis = comment.lognameOwnsThis;
          });
          setComments(newcmt);
          setDataLoaded(true);
        }
      })
      .catch((error) => console.log(error));

    return () => {
      // This is a cleanup function that runs whenever the Post component
      // unmounts or re-renders. If a Post is about to unmount or re-render, we
      // should avoid updating state.
      ignoreStaleRequest = true;
    };
  }, [url, value, num]);

  const changelikes = () => {
    let method;
    let uurl;
    if (likes.lognameLikesThis) {
      method = "DELETE";
      uurl = likes.url;
    } else {
      method = "POST";
      uurl = `/api/v1/likes/?postid=${postid}`;
    }
    fetch(uurl, {
      credentials: "same-origin",
      method,
    })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        setNum(num + 1);
      })
      .catch((error) => console.log(error));
  };

  const imageChangeLikes = () => {
    let method;
    const uurl = `/api/v1/likes/?postid=${postid}`;
    if (!likes.lognameLikesThis) {
      method = "POST";
      fetch(uurl, {
        credentials: "same-origin",
        method,
      })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          setNum(num + 1);
        })
        .catch((error) => console.log(error));
    }
  };

  let liketext;
  if (likes.numLikes === 1) {
    liketext = "like";
  } else {
    liketext = "likes";
  }

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
      .then(() => {
        setValue("");
      })
      .catch((error) => console.log(error));
  };

  const handleClick = (e) => {
    e.preventDefault();
    fetch(`/api/v1/comments/${commentid}/`, {
      credentials: "same-origin",
      method: "DELETE",
    })
      .then((response) => {
        setNum(num + 1);
        if (!response.ok) throw Error(response.statusText);
      })
      .catch((error) => console.log(error));
  };

  const likeCom = () => {
    if (likes !== []) {
      return (
        <p>
          <LikeButton
            lognameLikesThis={likes.lognameLikesThis}
            changeLikes={changelikes}
          />
          &nbsp;
          {likes.numLikes} {liketext}
        </p>
      );
    }
    return null;
  };
  // Render post image and post owner
  if (dataLoaded) {
    return (
      <div className="post">
        <div className="post card mx-auto m-2" style={{ width: `${30}rem` }}>
          <div className="card-body row">
            <div className="col-5">
              <a
                href={ownerShowUrl}
                className="row fw-bold text-body text-decoration-none"
              >
                <div className="col-5">
                  <img
                    src={ownerImgUrl}
                    className="img-thumbnail"
                    alt={owner}
                  />
                </div>
                <div className="col-7 mt-3">{owner}</div>
              </a>
            </div>

            <div className="col-4 offset-3 mt-3">
              <a
                href={`/posts/${postid}/`}
                className="text-secondary fw-bold text-decoration-none"
              >
                {time}
              </a>
            </div>
          </div>

          <img src={imgUrl} alt="post_image" onDoubleClick={imageChangeLikes} />

          {likeCom()}
          <div className="comment-text">
            {comments.map((comment) => {
              let deleteButton;
              if (comment.lognameOwnsThis === true) {
                deleteButton = (
                  <button
                    type="button"
                    className="delete-comment-button"
                    onClick={(e) => handleClick(e, comment.commentid)}
                  >
                    Delete
                  </button>
                );
              } else {
                deleteButton = null;
              }
              return (
                <div key={comment.commentid}>
                  <a href={comment.ownerShowUrl}>{comment.owner} </a>
                  &nbsp;
                  <span>{comment.text}</span>
                  &nbsp;
                  {deleteButton}
                </div>
              );
            })}

            <form onSubmit={handleSubmit} className="comment-form">
              <input
                type="text"
                value={value}
                onChange={handleChange}
                required
              />
            </form>
          </div>
        </div>
      </div>
    );
  }
  return <div>Loading...</div>;
}

Post.propTypes = {
  url: PropTypes.string.isRequired,
};
