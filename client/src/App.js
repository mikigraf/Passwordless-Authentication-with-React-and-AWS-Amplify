import React from 'react';
import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Route } from 'react';
import { Auth } from 'aws-amplify';
import { Form, Button, Input, Notification, Radio, Progress } from "element-react";


function App() {
  const state = {
    email: ""
  };

  render(){
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
          </Form>
        </div>
      </div>
    );
  }
}

export default App;
