import React from 'react';
import styled from 'styled-components';

import Modal from './Modal';

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


const privacyPolicyText = (
  <div style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.7 }}>
    <ol style={{ paddingLeft: 18 }}>
      <li style={{ marginBottom: 8 }}>
        <strong>取得する情報</strong><br />
        当サイトでは、サービス提供のために以下の情報を取得する場合があります。<br />
        <ul>
          <li>Googleログインにより取得されるユーザー識別情報（UID）</li>
          <li>サービス利用に関する情報（投票履歴など）</li>
          <li>アクセスログ、IPアドレス等の技術情報</li>
        </ul>
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>利用目的</strong><br />
        取得した情報は、以下の目的のために利用します。
        <ul>
          <li>ユーザー認証およびアカウント管理</li>
          <li>投票機能の提供</li>
          <li>サービスの改善および不正利用の防止</li>
          <li>システムの安全性確保</li>
        </ul>
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>使用している外部サービス</strong><br />
        当サイトでは、以下の外部サービスを利用しています。<br />
        <ul>
          <li>Google Authentication（ユーザー認証）</li>
          <li>Firebase（データベースおよびインフラ）</li>
        </ul>
        これらのサービス提供者は、それぞれのプライバシーポリシーに基づいて情報を管理します。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>個人情報の第三者提供</strong><br />
        当サイトは、法令に基づく場合を除き、取得した情報を第三者に提供することはありません。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>セキュリティ</strong><br />
        当サイトでは、不正アクセスや情報漏洩を防止するため、適切なセキュリティ対策を実施します。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>プライバシーポリシーの変更</strong><br />
        本ポリシーの内容は、必要に応じて変更されることがあります。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>お問い合わせ</strong><br />
        本ポリシーに関するお問い合わせは、当サイトの運営者までご連絡ください。
      </li>
    </ol>
  </div>
);

const termsText = (
  <div style={{ textAlign: 'left', fontSize: 14, lineHeight: 1.7 }}>
    <p>本サイト（以下、「当サイト」）を利用することにより、ユーザーは本利用規約に同意したものとみなします。</p>
    <br/>
    <ol style={{ paddingLeft: 18 }}>
      <li style={{ marginBottom: 8 }}>
        <strong>サービス内容</strong><br />
        当サイトは、クリエイターに対する投票機能を提供するサービスです。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>禁止行為</strong><br />
        ユーザーは以下の行為を行ってはなりません。
        <ul>
          <li>不正な手段による投票</li>
          <li>複数アカウントによる投票操作</li>
          <li>サービスの運営を妨害する行為</li>
          <li>法令または公序良俗に反する行為</li>
        </ul>
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>投票について</strong><br />
        運営は、不正投票または不適切な投票と判断した場合、投票の削除または調整を行う権利を有します。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>サービスの変更</strong><br />
        運営は、事前の通知なくサービス内容を変更または停止する場合があります。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>免責事項</strong><br />
        当サイトの利用によって生じたいかなる損害についても、運営は責任を負いません。
      </li>
      <li style={{ marginBottom: 8 }}>
        <strong>規約の変更</strong><br />
        本利用規約は、必要に応じて変更される場合があります。
      </li>
    </ol>
  </div>
);

const Footer = () => {
  const [showPolicy, setShowPolicy] = React.useState(false);
  const [showTerms, setShowTerms] = React.useState(false);
  return (
    <FooterContainer>
      <FooterText>
        <button
          style={{ background: 'none', border: 'none', color: '#575757', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0 }}
          onClick={() => setShowTerms(true)}
        >
          利用規約
        </button>
        <button
          style={{ background: 'none', border: 'none', color: '#575757', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0 }}
          onClick={() => setShowPolicy(true)}
        >
          プライバシーポリシー
        </button>

        <button
          style={{ background: 'none', border: 'none', color: '#575757', textDecoration: 'underline', cursor: 'pointer', fontSize: 14, padding: 0 }}
          onClick={() => window.open('https://mimictype.com/', '_blank', 'noopener,noreferrer')}
        >
          © mimictype
        </button>
      </FooterText>
      <Modal
        isOpen={showPolicy}
        title="プライバシーポリシー"
        onCancel={() => setShowPolicy(false)}
        buttons={[{
          label: '閉じる',
          onClick: () => setShowPolicy(false),
          variant: 'primary',
        }]}
        scrollable
      >
        {privacyPolicyText}
      </Modal>
      <Modal
        isOpen={showTerms}
        title="利用規約"
        onCancel={() => setShowTerms(false)}
        buttons={[{
          label: '閉じる',
          onClick: () => setShowTerms(false),
          variant: 'primary',
        }]}
        scrollable
      >
        {termsText}
      </Modal>
    </FooterContainer>
  );
};

export default Footer;