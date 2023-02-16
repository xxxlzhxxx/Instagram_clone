
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';


function Comments (props){
    const [value, setValue] = useState("");
    const [comments, setComments] = useState([]);

    useEffect(()=>{
        // get
        fetch(props.url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            setComments(data.comments)
        })
        .catch((error) => console.log(error));


        // submit
        fetch('/api/v1/comments/', {
            headers: {'Content-Type': 'application/json'},
            credentials: 'same-origin',
            method: 'POST',
            body: JSON.stringify({ text: this.state.new_value }),
        })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState(prevState => ({
                comments: prevState.comments.concat([data]),
                new_value: '',
            }));
        })
        .catch(error => console.log(error));   
    }, [url])
  

      
    return (
    <div>
        {
            this.state.comments.map((comment)=> (
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

        <form onSubmit={this.handleSubmit}>
            <input new_value={this.state.new_value} onChange={this.handleChange} required/>     
            <input type="submit" new_value="comment" />
        </form>
    </div>
    );
    }


export default Comments