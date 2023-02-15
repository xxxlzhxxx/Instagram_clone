
import React, { useState, useEffect } from "react";
import PropTypes from 'prop-types';


class Comments extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        new_value: '',
        comments: []
      };
  
      this.handleChange = this.handleChange.bind(this);
      this.handleSubmit = this.handleSubmit.bind(this);
    }
  
    get_all(){
        fetch(this.props.url, { credentials: "same-origin" })
        .then((response) => {
            if (!response.ok) throw Error(response.statusText);
            return response.json();
        })
        .then((data) => {
            this.setState({
                comments:data.comments
            })
        })
        .catch((error) => console.log(error));
    };
    
    handleChange(event) {
        this.setState({new_value: event.target.new_value});
    }
    

    handleSubmit(event) {

        event.preventDefault();
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
        
    }
  
    render() {
        this.get_all()
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
  }

export default Comments