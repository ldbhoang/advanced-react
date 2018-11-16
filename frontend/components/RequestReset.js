import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`;

class RequestReset extends Component {
  state = {
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
        mutation={REQUEST_RESET_MUTATION}
        variables={this.state}
      >
        {(requestReset, {error, loading, called}) => (
          <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            const res = await requestReset();
            this.setState({
              email: '',
            })
          }}>
            <fieldset disabled={loading} aria-busy={loading} >
              <h2> Request Reset </h2>
              {error && <Error error={error} />}
              {!error && !loading && called && <p>Check email for reset link!</p>}
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
              <button type="submit">Reset Pass!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default RequestReset;
