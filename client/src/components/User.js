import React from 'react';

export default props => (
    <li className="user">
        <p>{props.username}</p>
        <p>{props.email}</p>
        <p>{`${props.firstName} ${props.lastName}`}</p>
    </li>
);