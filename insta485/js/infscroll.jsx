import React, { useState, useEffect } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Post from "./post";

export default function InfScroll() {
    const [posts, setPosts] = useState([]);
    const [nextURL, setNextURL] = useState("/api/v1/posts/");
    function fetchPostIDs() {
        console.log("posts", posts); 
        console.log("url", nextURL);
        fetch(nextURL, {credentials: "same-origin"})
            .then((response) => {
                if (!response.ok) throw Error(response.statusText);
                return response.json();
            })
            .then((data) => {
                setPosts(posts.concat(data['results']));
                setNextURL(data['next']);
            })
            .catch((error) => console.log(error));
    }
    fetchPostIDs();
    return (
        <InfiniteScroll
            dataLength={posts.length}
            next={fetchPostIDs}
            hasMore={nextURL === "" ? false : true}>
            {posts.map((post) => <Post key={post.postid} url={post.url} />)}

        </InfiniteScroll>
        );
}