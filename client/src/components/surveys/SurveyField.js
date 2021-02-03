// SurveyField contains logic to render a single label and text input

import React from 'react';

export default (props) => {
    // console.log(props.input)
    // console.log(props.meta)
    return (
        <div>
            <label>{props.label}</label>
            <input {...props.input} style={{ marginBottom: '5px' }}/>
            {/* if the field has been touched (clicked into) by the user, then we show the error */}
            <div className="red-text" style={{ marginBottom: '20px' }}> 
                {props.meta.touched && props.meta.error}
            </div>
        </div>
    );
};