import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

// --- Styled Components ---

const FooterContainer = styled.footer`
  background-color: #ffffff;
  padding: 80px 40px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: center;
  width: 100%;
`;

const FooterInner = styled.div`
  max-width: 1200px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 40px;
  }
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  flex: 1;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
    justify-content: flex-start;
    align-items: center;
  }
  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    align-items: center;
  }
`;

const MascotIcons = styled.img`
  height: 60px;
  width: auto;
  object-fit: contain;
`;

const BrandLogo = styled.img`
  max-width: 100%;
  height: auto;
  max-height: 108px;
  object-fit: contain;
  display: block;
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  text-align: left;
  flex: 1;
  align-items: flex-start;
  max-width: 50%;

  @media (max-width: 768px) {
    max-width: 100%;
    width: 100%;
  }
`;

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: flex-start;
  padding-left: 84px;

  @media (max-width: 768px) {
    padding-left: 0;
  }

`;

const Title = styled.h3`
  font-size: 24px;
  font-weight: 600;
  color: #000000;
  margin: 0;
  letter-spacing: -0.02em;
`;

const TextGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  align-items: flex-start;

  p {
    font-size: 18px;
    color: #333333;
    margin: 0;
    font-weight: 300;
    line-height: 1.5;
  }
`;

// --- Component ---

const Footer = () => {
  const { t } = useTranslation();
  return (
    <FooterContainer>
      <FooterInner>
        {/* 左側：ロゴエリア */}
        <LogoSection>
          {/* ロゴ画像は一つのみ */}
          <BrandLogo src={process.env.PUBLIC_URL + "/adultopia/logoYoko.png"} alt="ADULTOPIA" />
        </LogoSection>

        {/* 右側：情報エリア */}
        <InfoSection>
          <InfoBlock>
            <Title>{t('contactTitle', '大人國｜創作者聯繫')}</Title>
            <TextGroup>
              <p>{t('contactWindow', '創作者聯繫窗口：')}范范</p>
              <p>biz@platinum-star.com</p>
            </TextGroup>
          </InfoBlock>
          <InfoBlock>
            <Title>{t('organizer', '主辦單位')}</Title>
            <TextGroup>
              <p>白金之星音樂娛樂股份有限公司</p>
              <p>白金之星國際娛樂股份有限公司</p>
            </TextGroup>
          </InfoBlock>
        </InfoSection>
      </FooterInner>
    </FooterContainer>
  );
};

export default Footer;