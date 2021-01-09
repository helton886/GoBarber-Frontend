import React from 'react';
import GlobalStyle from './styles/global';
import SignIn from '../src/pages/SignIn/signIn';
import SignUp from '../src/pages/SignUp/signUp';

import AppProvider from './hooks';

const App: React.FC = () => (
  <>
    <AppProvider>
      <SignIn />
    </AppProvider>

    <GlobalStyle />
  </>
);

export default App;
