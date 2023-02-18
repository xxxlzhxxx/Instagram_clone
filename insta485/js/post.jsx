import React, { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { sys } from "typescript";
import Comments from "./comments";
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
          setLikes(data.likes)
        }
      })
      .catch((error) => console.log(error));


    return () => {
      // This is a cleanup function that runs whenever the Post component
      // unmounts or re-renders. If a Post is about to unmount or re-render, we
      // should avoid updating state.
      ignoreStaleRequest = true;
    };
  }, [url]);


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

  // Render post image and post owner
  return (
    <div className="post">
      <p>
        <a>
          {owner}
        </a>
        <a>
          {time}
        </a>
      </p>
      <a>{likes.numLikes} {liketext}</a>
      <LikeButton lognameLikesThis = {likes.lognameLikesThis} changeLikes = {changelikes}/>
      <img src={imgUrl} alt="post_image" onDoubleClick={imageChangeLikes}/>
       
      <Comments url={url} postid={postid} />
    </div>
  );
}





Post.propTypes = {
  url: PropTypes.string.isRequired,
};
