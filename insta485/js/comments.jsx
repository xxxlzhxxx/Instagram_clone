
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';



function Comments ({url}){
    const [value, setValue] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(()=>{
        // get
        fetch(url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            const newcmt = data.comments.map(({owner, text}) => ({owner, text}));
            setComments(newcmt)
        })
        .catch((error) => console.log(error));


        // submit
        fetch('/api/v1/comments/', {
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify(value)
        })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            console.log(data);
            setValue("");
        })
        .catch(error => console.log(error));   
    }, [url])
  


    function handleChange(event){
        setValue(event.target.value);
    }


    function handleSubmit(event){
        let tmp = {
            owner: "awderio",
            text: value
        }
        console.log(tmp);
        setComments(preComments => preComments.concat(tmp));
        console.log(comments);
    }
      

    
    return (
        <div>
            {
                comments.map((comment)=> (
                    <div>
                        <a href= "/users/{comments.owner}/">
                            { comment.owner } &nbsp;
                        </a>  
                        <span> 
                            { comment.text }
                        </span>
                    </div>
                ))
            }
            <form onSubmit={handleSubmit}>
                <input value={value} onChange={handleChange} required/>     
                <input type="submit" value="comment" />
            </form>
        </div>
    );
    }


export default Comments