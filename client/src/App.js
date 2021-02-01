import React, { Component } from 'react';
import axios from 'axios';
import './App.css';
import AuthForm from './components/AuthForm';
import UserList from './components/UserList';
axios.defaults.withCredentials = true;

class App extends Component {
  constructor(props){
    super(props);
    this.state = {
      authed: true,
      users: [],
    };
  }
  handleRetrieveUsers = () => {
    axios.get('http://localhost:5000/api/users')
      .then(res => this.setState({ users: res.data.users }))
      .catch(err => {
        this.setState({ authed: false });
      });
  }
  handleLogin = (user) => {
    axios.post('http://localhost:5000/api/login', user)
      .then(res => this.setState({ authed: true }, this.handleRetrieveUsers))
      .catch(err => console.log(err.response.data.error));
  }
  handleLogout = ev => {
    axios.get('http://localhost:5000/api/logout')
        .then(res => this.setState({ authed: false, users: [] }))
        .catch(err => console.log(err));
}
  handleRegister = (user) => {
    axios.post('http://localhost:5000/api/register', user)
      .then(res => this.setState({authed: true }, this.handleRetrieveUsers))
      .catch(err => console.log(err.response.data.error));  
  }
  componentDidMount(){
    this.handleRetrieveUsers();
  }
  render() {
    return (
      <section className="container">
        { this.state.authed 
          ? <UserList 
              users={this.state.users}
              onLogout={this.handleLogout}
            />
          : <AuthForm 
              onLogin={this.handleLogin}
              onRegister={this.handleRegister}
            />
        }
      </section>
    );
  }
}

export default App;
