import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { sys } from "typescript";
import Comments from "./comments";
import Get_time from "./timestamp";
import moment from 'moment';
import likeButton from "./likeButton";


// The parameter of this function is an object with a string called url inside it.
// url is a prop for the Post component.
export default function Post({ url }) {
  /* Display image and post owner of a single post */

  const [imgUrl, setImgUrl] = useState("");
  const [owner, setOwner] = useState("");
  const [time, setTime] = useState("");


  useEffect(() => {
    // Declare a boolean flag that we can use to cancel the API request.
    let ignoreStaleRequest = false;


    // Call REST API to get the post's information
    fetch(url, { credentials: "same-origin" })
      .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        console.log("hello\n");
        return response.json();
      })
      .then((data) => {
        // If ignoreStaleRequest was set to true, we want to ignore the results of the
        // the request. Otherwise, update the state to trigger a new render.
        console.log("here\n");
        if (!ignoreStaleRequest) {
          setImgUrl(data.imgUrl);
          setOwner(data.owner);
          setTime(data.created);
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

  const changeLikes = (likes) => {
    if (likes.lognameLikesThis) {
      method = 'DELETE'
    } else {
      method = 'POST'
    }
    fetch(
        likes.url,
        {
          method,
        },
      )
    .then((response) => {
      if (!response.ok) throw Error(response.statusText);
    })
    .then(setLikes([]))
    .catch((error) => console.log(error));
  }

  // Render post image and post owner
  return (
    <div className="post">
      <p>
        <a>
          {owner}
        </a>
        <a>
          {moment.utc(time).fromNow()}  
        </a> 
      </p>
      
      <img src={imgUrl} alt="post_image" /> 
      <a>
        {owner}
      </a>
      <a>
        <Get_time url={url}/> 
      </a> 
      <a>
        {likes.numLikes}
      </a>
      <likeButton 
        lognameLikesThis = {likes.lognameLikesThis}
        changeLikes = {changeLikes}
      />
      
      <img src={imgUrl} alt="post_image" onDoubleClick={changeLikes}/>
       
      <Comments url={url}/>
    </div>
  );
}





Post.propTypes = {
  url: PropTypes.string.isRequired,
};
