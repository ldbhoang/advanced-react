import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      name
      email
    }
  }
`;

class SignIn extends Component {
  state = {
    password: '',
    email: '',
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[
          {query: CURRENT_USER_QUERY}
        ]}
        onCompleted={() => {
          Router.push({
            pathname: '/',
          })
        }}
      >
        {(signin, {error, loading}) => (
          <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            const res = await signin();
            this.setState({
              password: '',
              email: '',
            })
          }}>
            <fieldset disabled={loading} aria-busy={loading} >
              <h2> Sign Ip </h2>
              {error && <Error error={error} />}
              <label htmlFor="email">
                Email
                <input
                  type="text"
                  name="email"
                  placeholder="Email..."
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="Password..."
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Sign Up!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default SignIn;