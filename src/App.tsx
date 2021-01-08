import React from 'react';
import GlobalStyle from './styles/global';
import SignIn from '../src/pages/SignIn/signIn';
import SignUp from '../src/pages/SignUp/signUp';

const App: React.FC = () => (
  <>
    <SignIn />
    <GlobalStyle />
  </>
);

export default App;
