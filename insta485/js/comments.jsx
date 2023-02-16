
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';



function Comments ({url, postid}){
    const [value, setValue] = useState("");
    const [comments, setComments] = useState([]);

    const get_all = () => {
        console.log(value);
        // get
        fetch(url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            const newcmt = data.comments.map(({ownerShowUrl, owner, text}) => ({ownerShowUrl, owner, text}));
            setComments(newcmt)
        })
        .catch((error) => console.log(error));
    }


    useEffect(()=>{
        get_all();
    }, [comments, value, url])
  


    const handleChange = (event)=>{
        setValue(event.target.value);
    }


    const handleSubmit = (e) =>{
        e.preventDefault();
        fetch(`/api/v1/comments/?postid=${postid}`, {
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({text: value})
        }).then(()=>{
            console.log("chao")
        })
        .then((response) => {    
            return response.json();
        })
        .then((data) => {
            setValue("");
        })
        .catch(error => console.log(error));  
    };
      

    
    return (
        <div>
            {
                comments.map((comment)=> (
                    <div>
                        <a href={comment.ownerShowUrl}>
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