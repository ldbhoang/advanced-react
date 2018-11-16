import React, { Component } from 'react';
import { Mutation } from 'react-apollo';
import PropsType from 'prop-types';
import Router from 'next/router';
import gql from 'graphql-tag';
import Form from './styles/Form';
import Error from './ErrorMessage';
import { CURRENT_USER_QUERY } from './User';

const RESET_PASSWORD_MUTATION = gql`
  mutation RESET_PASSWORD_MUTATION($resetToken: String!, $password: String!, $confirmPassword: String!) {
    resetPassword(resetToken: $resetToken, password: $password, confirmPassword: $confirmPassword) {
      email
      name
    }
  }
`;

class ResetPassword extends Component {
  static propTypes = {
    resetToken: PropsType.string.isRequired,
  };

  state = {
    password: '',
    confirmPassword: '',
  };

  saveToState = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <Mutation
        mutation={RESET_PASSWORD_MUTATION}
        variables={{
          ...this.state,
          resetToken: this.props.resetToken
        }}
        refetchQueries={[{query: CURRENT_USER_QUERY}]}
        onCompleted={() => {
          Router.push({
            pathname: '/',
          })
        }}
      >
        {(resetPassword, {error, loading, called}) => (
          <Form method="post" onSubmit={async (e) => {
            e.preventDefault();
            const res = await resetPassword();
            this.setState({
              password: '',
              confirmPassword: '',
            })
          }}>
            <fieldset disabled={loading} aria-busy={loading} >
              <h2> Reset Password </h2>
              {error && <Error error={error} />}
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password..."
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>
              <label htmlFor="confirmPassword">
                Confirm Password
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password..."
                  value={this.state.confirmPassword}
                  onChange={this.saveToState}
                />
              </label>
              <button type="submit">Reset!</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default ResetPassword;
