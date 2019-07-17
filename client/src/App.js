import React from 'react';
import './App.css';
import { Auth } from 'aws-amplify';
import { Form, Button, Input } from "element-react";
import PasswordInput from './components/passwordInput';

class App extends React.Component {
  state = {
    email: "",
    isLogged: false,
    thisUser: null
  };

  handleEmailInput = async event => {
    event.preventDefault();
    /*  const params = {
      username: this.state.email,
      password: 'Spejs$$$123',
      attributes: {
        name: 'Mikolaj Spejs'
      }
    };
            // check if user exists in source database SOT 
    try {
      await Auth.signUp(params);
    } catch(e) {
      console.log(e);
    */
    try {
      const thisUser = await Auth.signIn(this.state.email);
      this.setState({
        thisUser: thisUser
      });
    } catch(e) {
      console.log(e);
    }
    this.setState({
      isLogged: true
    });
  }

  render() {
    const { email, isLogged, thisUser } = this.state;
    return (
      <div className="App">
        { /* login */ }
        <div>
          <Form className="login-form">
            <Form.Item label="email">
              <Input type="text" icon="user" placeholder="Email" onChange={email => this.setState({email})} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" disabled={!email} onClick={this.handleEmailInput}>Sign In</Button>
            </Form.Item>
           {isLogged && <PasswordInput email={thisUser}/>}
          </Form>
        </div>
      </div>
    );
  };
}

export default App;
