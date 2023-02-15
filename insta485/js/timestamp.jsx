import React, { useState, useEffect } from "react";
import moment from 'moment';
import PropTypes from 'prop-types';

function Get_time(props){
    const [time, setTime] = useState("");

    fetch(props.url)
    .then((response) => {
        if (!response.ok) throw Error(response.statusText);
        return response.json();
    })
    .then((data) => {
        setTime(moment.utc(data.created).local().fromNow())
    })
    .catch (error => console.log(error)); 

    return (
        <p>
            {time}
        </p>
    )
}

export default Get_time;