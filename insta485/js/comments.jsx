import React, { useEffect, useState } from "react";
import DeleteCommentButton from './deleteCommentButton';

function Comments ({url, postid, owner}){
    const [value, setValue] = useState("");
    const [comments, setComments] = useState([]);
    const [numUpdates, setNumUpdates] = useState(0);
    
    const update = useCallback(() => {
        setNumUpdates(numUpdates + 1);
    }, [numUpdates]);

    const get_all = () => {
        fetch(url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            const newcmt = data.comments.map(({
                ownerShowUrl, commentid, owner, text
            }) => ({
                ownerShowUrl, commentid, owner, text}));
            setComments(newcmt)
        })
        .catch((error) => console.log(error));
    }

    useEffect(() => {
        get_all();
    }, [numUpdates, comments])
    

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
        })
        .then((response) => {    
            setValue("");
            return response.json();
        })
        .catch(error => console.log(error));  
    };
      

    return (
        <div>
            {
                comments.map((comment) => {
                    if (comment.owner === owner){
                        <DeleteCommentButton 
                        url={`/api/v1/comments/$(comment.commentid)/`} 
                        updateFn={update}/>
                    }
                    <div>
                        <a href={comment.ownerShowUrl}>
                            { comment.owner } &nbsp;
                        </a>  
                        <span> 
                            { comment.text }
                        </span>
                    </div> 
                })
            }
            <form onSubmit={handleSubmit}>
                <input value={value} onChange={handleChange} required/>     
            </form>
        </div>
    );
    }


export default Comments