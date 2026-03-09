import React, { Suspense, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from './contexts/AuthContext';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import HomePage from './pages/HomePage';
import analytics from './services/analytics';

const Main = styled.main`
  background-color: ${({ theme }) => theme.colors.white};
`;

function AppContent() {
  const { t } = useTranslation();
  const faviconHref = `${process.env.PUBLIC_URL}/favicon.ico`;
  const location = useLocation();

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    analytics.pageview(path);
  }, [location]);

  return (
    <>
      <Helmet>
        <title>{t('pageTitle')}</title>
        <meta name="description" content={t('metaDescription')} />
        <meta property="og:title" content={t('ogTitle')} />
        <meta property="og:description" content={t('ogDescription')} />
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
    </>
  );
}

function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <Suspense fallback={<div />}>
        <AuthProvider>
          <ThemeProvider theme={theme}>
            <GlobalStyle />
            <Router>
              <AppContent />
            </Router>
          </ThemeProvider>
        </AuthProvider>
      </Suspense>
    </I18nextProvider>
  );
}

export default App;
