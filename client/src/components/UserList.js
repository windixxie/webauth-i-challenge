import React from 'react';
import User from './User'

class UserList extends React.Component {
    render(){
        return (
            <ul className="user-list">
                {this.props.users.map(user => <User key={user.id} {...user} />)}
                <button className="logout" onClick={this.props.onLogout}>Logout</button>
            </ul>
        );
    }
}

export default UserList;