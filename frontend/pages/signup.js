import SignUpComponent from '../components/SignUp';
import SignInComponent from '../components/SignIn';
import RequestResetComponent from '../components/RequestReset';
import styled from 'styled-components';

const Columns = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 20px;
`;

const signup = () => {
  return (
    <Columns>
      <SignUpComponent />
      <SignInComponent />
      <RequestResetComponent />
    </Columns>
  );
};

export default signup;
