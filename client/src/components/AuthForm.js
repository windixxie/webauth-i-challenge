import React from 'react';

class AuthForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      registering: false,
      username: '',
      password: '',
      email: '',
      firstName: '',
      lastName: '',
    };
  }
  handleChange = ev => {
    this.setState({ [ev.target.name]: ev.target.value });
  };
  changeOperation = ev => {
    ev.preventDefault();
    this.setState(prevState => {
      return {
        registering: !prevState.registering,
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
      };
    });
  };
  handleSubmit = ev => {
    ev.preventDefault();
    if (this.state.registering) {
      const user = {
        username: this.state.username,
        password: this.state.password,
        email: this.state.email,
        firstName: this.state.firstName,
        lastName: this.state.lastName,
      };
      this.setState({
        username: '',
        password: '',
        email: '',
        firstName: '',
        lastName: '',
      });
      this.props.onRegister(user);
    } else {
      const user = {
        username: this.state.username,
        password: this.state.password,
      };
      this.setState({
        username: '',
        password: '',
      });
      this.props.onLogin(user);
    }
  };
  createInput = (name, type = 'text') => {
    let placeholder = name.replace(/(?<!\b)[A-Z]/g, char => ' ' + char);
    placeholder = placeholder.charAt(0).toUpperCase() + placeholder.slice(1); // If I was better with regex, this would have been built into the expression above.
    return (
      <input
        type={type}
        placeholder={placeholder}
        name={name}
        onChange={this.handleChange}
        value={this.state[name]}
      />
    );
  };
  render() {
    return (
      <section className="auth-container">
        {this.state.registering ? (
          <form onSubmit={this.handleSubmit}>
            {this.createInput('username')}
            {this.createInput('password', 'password')}
            {this.createInput('email', 'email')}
            {this.createInput('firstName')}
            {this.createInput('lastName')}
            <button>Register</button>
            <button onClick={this.changeOperation}>
              Already a User? Sign in!
            </button>
          </form>
        ) : (
          <form onSubmit={this.handleSubmit}>
            {this.createInput('username')}
            {this.createInput('password', 'password')}
            <button>Login</button>
            <button type="button" onClick={this.changeOperation}>
              Not Currently a User? Register!
            </button>
          </form>
        )}
      </section>
    );
  }
}

export default AuthForm;
