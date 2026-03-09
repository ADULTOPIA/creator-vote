import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import Modal from './Modal';
import analytics from '../services/analytics';

const FooterContainer = styled.footer`
  width: 100%;
  padding: 12px 24px;
  border-top: 1px solid #a7a7a7;
  // background-color: #ffffff;
  display: flex;
  justify-content: center;
`;


const FooterText = styled.div`
  margin: 0;
  font-size: 14px;
  color: #575757;
  text-align: center;
  letter-spacing: 0.02em;
  display: flex;
  gap: 24px;
  align-items: center;
`;


const Footer = () => {
  const { t } = useTranslation();
  const [showPolicy, setShowPolicy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  return (
    <FooterContainer>
      <FooterText>
        <button
          style={{ background: 'none', border: 'none', color: '#575757', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0 }}
          onClick={() => {
            analytics.event({
              action: 'terms_button_click',
              category: 'engagement',
            });
            setShowTerms(true);
          }}
        >
          {t('termsButton')}
        </button>
        <button
          style={{ background: 'none', border: 'none', color: '#575757', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0 }}
          onClick={() => {
            analytics.event({
              action: 'privacy_button_click',
              category: 'engagement',
            });
            setShowPolicy(true);
          }}
        >
          {t('privacyButton')}
        </button>

        <button
          style={{ background: 'none', border: 'none', color: '#575757', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0 }}
          onClick={() => {
            analytics.event({
              action: 'mimictype_button_click',
              category: 'engagement',
            });
            window.open('https://mimictype.com/', '_blank', 'noopener,noreferrer');
          }}
        >
          {t('copyright')}
        </button>
      </FooterText>
      <Modal
        isOpen={showPolicy}
        title={t('privacyTitle')}
        onCancel={() => setShowPolicy(false)}
        buttons={[{
          label: t('closeButton'),
          onClick: () => setShowPolicy(false),
          variant: 'primary',
        }]}
        scrollable
      >
        <div style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: t('privacyContent') || '' }} />
      </Modal>
      <Modal
        isOpen={showTerms}
        title={t('termsTitle')}
        onCancel={() => setShowTerms(false)}
        buttons={[{
          label: t('closeButton'),
          onClick: () => setShowTerms(false),
          variant: 'primary',
        }]}
        scrollable
      >
        <div style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: t('termsContent') || '' }} />
      </Modal>
    </FooterContainer>
  );
};

export default Footer;