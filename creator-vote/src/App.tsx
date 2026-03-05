import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';

import { AuthProvider } from './contexts/AuthContext';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import HomePage from './pages/HomePage';

const Main = styled.main`
  background-color: ${({ theme }) => theme.colors.white};
`;

function App() {
  const faviconHref = `${process.env.PUBLIC_URL}/favicon.ico`;

  return (
    <AuthProvider>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Helmet>
            <link rel="icon" href={faviconHref} />
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;700&family=Noto+Sans+JP:wght@400;500;700&display=swap" rel="stylesheet" />
          </Helmet>
          <Main>
            <Routes>
              <Route path="/" element={<HomePage />} />
            </Routes>
          </Main>
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
