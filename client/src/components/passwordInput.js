import React from 'react';
import { Form, Button, Input } from "element-react";
import { Auth } from 'aws-amplify';


class PasswordInput extends React.Component {
constructor(props) {
    super();
    this.state = { 
        password: '',
        Auth: false
    }
}

handlePasswordInput = async event => {
    event.preventDefault();
    try {
       await Auth.sendCustomChallengeAnswer(this.props.email, this.state.password);
       this.isAuth();
    } catch(e) {
        console.log(e);
    }
};

isAuth = async () => {
    try {
        await Auth.currentSession();
        this.setState({ Auth: true });
    } catch(e) {
        console.log(e);
    }
;}

renderSuccess = () => {
    if (this.state.Auth) {
        return <h1>You are logged in!</h1>
      }
};

render() {   
    const { password } = this.state; 
 return (
      <div> 
        {this.renderSuccess()}
        <Form.Item label="password">
        <Input type="text" icon="user" placeholder="password" onChange={password => this.setState({password})} />
      </Form.Item>
      <Form.Item>
        <Button type="primary" disabled={!password} onClick={this.handlePasswordInput}>Sign In</Button>
      </Form.Item>
      </div>
    )
 }
}

export default PasswordInput;
