import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { sys } from "typescript";
import Get_time from "./timestamp";
import moment from 'moment';
import LikeButton from "./likeButton";



// The parameter of this function is an object with a string called url inside it.
// url is a prop for the Post component.
export default function Post({url}) {
  /* Display image and post owner of a single post */

  const [imgUrl, setImgUrl] = useState("");
  const [owner, setOwner] = useState("");
  const [time, setTime] = useState("");
  const [postid, setPostid] = useState("");
  const [likes, setLikes] = useState([])
  const [value, setValue] = useState("");
  const [comments, setComments] = useState([]);
  const [num, setNum] = useState(0);
  var commentid;


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
        console.log(url);
        if (!ignoreStaleRequest) {
          setImgUrl(data.imgUrl);
          setOwner(data.owner);
          setTime(moment.utc(data.created).local().fromNow());
          setPostid(data.postid);
          setLikes(data.likes);
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
    let method
    if (likes.lognameLikesThis) {
      method = 'DELETE'
    } else {
      method = 'POST'
    }
    fetch(
      likes.url,
      {
        credentials: "same-origin",
        method,
      },
    )
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
    })
    .catch((error) => console.log(error));
    method = 'GET'
    fetch(url, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        // console.log("hello\n");
        return response.json();
      })
      .then((data) => {
        console.log("here\n");
          setLikes(data.likes)
      })
      .catch((error) => console.log(error));
  }

  const imageChangeLikes = () => {
    let method
    if (!likes.lognameLikesThis) {
      method = 'POST'
      fetch(
        likes.url,
        {
          credentials: "same-origin",
          method,
        },
      )
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
      })
      .catch((error) => console.log(error));
      method = 'GET'
      console.log(url)
      fetch(url, { credentials: "same-origin" })
        .then((response) => {
          if (!response.ok) throw Error(response.statusText);
          // console.log("hello\n");
          return response.json();
        })
        .then((data) => {
          console.log("here\n");
            setLikes(data.likes)
        })
        .catch((error) => console.log(error));
    }
  }

  let liketext
  if (likes.numLikes === 1) {
    liketext = 'like'
  } else {
    liketext = 'likes'
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
      .then((response) => {
        setValue("");
      })
      .catch((error) => console.log(error));
  };

  const handle_click = (e, commentid) => {
    console.log("handle_click");
    e.preventDefault();
    fetch(`/api/v1/comments/${commentid}/`, {
      credentials: "same-origin",
      method: "DELETE",
    })
    .then((response) => {
      console.log("you click");
      setNum(num+1);
      if (!response.ok) throw Error(response.statusText);
    })
    .catch((error) => console.log(error));
  };

  // Render post image and post owner
  console.log(url)
  return (
    <div className="post">
      <p>
        <a>
          {owner}&nbsp;
        </a>
        <a>
          {time}
        </a>
      </p>
      
      <img src={imgUrl} alt="post_image" onDoubleClick={imageChangeLikes}/>
      
      <p>
        <LikeButton lognameLikesThis = {likes.lognameLikesThis} changeLikes = {changelikes}/>
        &nbsp;
        {likes.numLikes} {liketext}
      </p>



      
      <div>
        {comments.map((comment) => {
          let delete_button;
          if (comment.lognameOwnsThis === true) {
            commentid - comment.commentid;
            delete_button = 
              <button
              type="button"
              className="delete-comment-button btn btn-warning"
              onClick={(e) => handle_click(e, comment.commentid)}
              >
                Delete
            </button>;
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
    </div>
  );
}





Post.propTypes = {
  url: PropTypes.string.isRequired,
};
