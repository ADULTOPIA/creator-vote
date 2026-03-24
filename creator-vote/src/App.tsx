import React, { Suspense, useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import styled from 'styled-components';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import i18n from './i18n';
import { I18nextProvider } from 'react-i18next';

import { AuthProvider } from './contexts/AuthContext';
import { theme } from './styles/theme';
import { GlobalStyle } from './styles/GlobalStyle';
import HomePage from './pages/HomePage';
import AdminPage from './pages/AdminPage';
import analytics from './services/analytics';
import Modal from './components/Modal';
import { isWebView } from './utils/webViewDetector';

const InstructionText = styled.p`
  margin: 12px 0;
  font-size: 14px;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.black};
`;

const Main = styled.main`
  background-color: ${({ theme }) => theme.colors.white};
`;

function AppContent() {
  const { t } = useTranslation();
  const faviconHref = `${process.env.PUBLIC_URL}/favicon.ico`;
  const location = useLocation();
  const [showWebViewModal, setShowWebViewModal] = useState(false);
  const [showCopySuccess, setShowCopySuccess] = useState(false);

  useEffect(() => {
    // WebView判定は一度だけ実行する
    if (isWebView()) {
      setShowWebViewModal(true);
    }
  }, []);

  useEffect(() => {
    const path = `${location.pathname}${location.search}${location.hash}`;
    analytics.pageview(path);
  }, [location]);

  const handleCopyUrl = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url).then(() => {
      setShowWebViewModal(false);
      setShowCopySuccess(true);
    });
  };

  const handleCloseAll = () => {
    setShowWebViewModal(false);
    setShowCopySuccess(false);
  };

  const webViewButtons = [
    {
      label: t('copyUrlButton'),
      onClick: handleCopyUrl,
      variant: 'primary' as const,
    },
  ];

  const copySuccessButtons = [
    {
      label: t('closeButton'),
      onClick: handleCloseAll,
      variant: 'primary' as const,
    },
  ];

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
          <Route path="/admin" element={<AdminPage />} />
        </Routes>
      </Main>

      {/* WebView案内モーダル - コピーボタン付き */}
      <Modal
        isOpen={showWebViewModal}
        title={t('webViewTitle')}
        buttons={webViewButtons}
        onCancel={handleCloseAll}
      >
        <InstructionText>{t('webViewMessage')}</InstructionText>
        <InstructionText>{t('webViewInstructions')}</InstructionText>
        <InstructionText>{t('webViewFallback')}</InstructionText>
      </Modal>

      {/* コピー成功モーダル */}
      <Modal
        isOpen={showCopySuccess}
        title={t('webViewCopySuccessTitle')}
        buttons={copySuccessButtons}
        onCancel={handleCloseAll}
      >
        <InstructionText>{t('webViewCopySuccessMessage')}</InstructionText>
      </Modal>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
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
    </HelmetProvider>
  );
}

export default App;
