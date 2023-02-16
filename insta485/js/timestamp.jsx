import React, { useState, useEffect } from "react";
import moment from 'moment';
import PropTypes from 'prop-types';

function Get_time(props){
    const convertTimeStamp = (timeStamp) => moment(timeStamp).fromNow();
    return (
        <p>
            {convertTimeStamp(props.created_time)}
        </p>
    )
}

export default Get_time;