import React, { useState, useEffect } from "react"

export default function likeButton(props) {
    const {lognameLikesThis, changeLikes} = props
    let buttonText
    if (lognameLikesThis === true) {
        buttonText = 'unlike';
    } else {
        buttonText = 'like';
    }
    return (
        <button className="like-unlike-button" 
            onClick={changeLikes}>
            {buttonText}
        </button>
    )
}