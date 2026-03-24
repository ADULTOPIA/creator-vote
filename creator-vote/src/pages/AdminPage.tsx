import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { collection, onSnapshot } from 'firebase/firestore';
import { adminDb } from '../firebaseAdmin';
import { submitAdminVote } from '../services/adminVoteService';
import { Creator } from '../types/creator';
import { useAuth } from '../contexts/AuthContext';
import Modal from '../components/Modal';

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px;
  font-family: 'Inter', 'Noto Sans JP', sans-serif;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 24px;
  color: #1a1a1a;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

const Th = styled.th`
  text-align: left;
  padding: 10px 12px;
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  font-weight: 600;
  color: #555;
`;

const Tr = styled.tr`
  &:nth-child(even) {
    background: #fafafa;
  }
`;

const Td = styled.td`
  padding: 10px 12px;
  border-bottom: 1px solid #eee;
  vertical-align: middle;
`;

const Avatar = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  cursor: pointer;
  transition: opacity 0.15s;
  &:hover {
    opacity: 0.75;
  }
`;

const Rank = styled.span<{ rank: number }>`
  font-weight: 700;
  font-size: 16px;
  color: ${({ rank }) => (rank === 1 ? '#FFD700' : rank === 2 ? '#C0C0C0' : rank === 3 ? '#CD7F32' : '#888')};
`;

const VoteCount = styled.span`
  font-weight: 600;
  color: #e91e8c;
`;

const SnsLink = styled.a`
  color: #1976d2;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ErrorMsg = styled.p`
  color: #c00;
  padding: 16px;
`;

const Loading = styled.p`
  padding: 16px;
  color: #888;
`;

const ConfirmContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 8px 0;
`;

const ConfirmAvatar = styled.img`
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
`;

const ConfirmName = styled.p`
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
`;

const ConfirmMessage = styled.p`
  font-size: 14px;
  color: #555;
`;

const ResultMsg = styled.p<{ success: boolean }>`
  color: ${({ success }) => (success ? '#1a7a1a' : '#c00')};
  padding: 16px;
  text-align: center;
`;

export default function AdminPage() {
  const { loginInfo, loading: authLoading, user } = useAuth();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [targetCreator, setTargetCreator] = useState<Creator | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [voteResult, setVoteResult] = useState<{ success: boolean; message: string } | null>(null);

  const isAdmin = loginInfo?.role === 'admin';

  useEffect(() => {
    if (authLoading || !isAdmin) return;

    const unsubscribe = onSnapshot(
      collection(adminDb, 'creators'),
      (snapshot) => {
        const data: Creator[] = snapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            creatorId: d.creatorId ?? doc.id,
            displayName: d.displayName ?? '',
            imageUrl: d.imageUrl ?? '',
            snsLink: d.snsLink,
            totalVoteCount: d.totalVoteCount ?? 0,
          };
        });
        data.sort((a, b) => b.totalVoteCount - a.totalVoteCount);
        setCreators(data);
        setLoading(false);
      },
      (err) => {
        setError(err.message);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [authLoading, isAdmin]);

  const handleConfirmVote = async () => {
    if (!targetCreator) return;
    setIsSubmitting(true);
    try {
      const email = user?.email ?? '';
      await submitAdminVote(email, targetCreator.creatorId);
      setTargetCreator(null);
      setVoteResult({ success: true, message: `「${targetCreator.displayName}」に投票しました` });
    } catch (err: any) {
      setTargetCreator(null);
      setVoteResult({ success: false, message: err.message ?? '投票に失敗しました' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (authLoading) return <Loading>読み込み中...</Loading>;
  if (!isAdmin) return <ErrorMsg>アクセス権がありません</ErrorMsg>;

  return (
    <Container>
      <Title>クリエイター ランキング</Title>
      {loading && <Loading>読み込み中...</Loading>}
      {error && <ErrorMsg>{error}</ErrorMsg>}
      {voteResult && (
        <ResultMsg success={voteResult.success}>{voteResult.message}</ResultMsg>
      )}
      {!loading && !error && (
        <Table>
          <thead>
            <tr>
              <Th style={{ width: 48 }}>順位</Th>
              <Th style={{ width: 56 }}></Th>
              <Th>名前</Th>
              <Th style={{ width: 100 }}>票数</Th>
              <Th>SNS</Th>
            </tr>
          </thead>
          <tbody>
            {creators.map((creator, index) => (
              <Tr key={creator.creatorId}>
                <Td>
                  <Rank rank={index + 1}>{index + 1}</Rank>
                </Td>
                <Td>
                  <Avatar
                    src={creator.imageUrl}
                    alt={creator.displayName}
                    onClick={() => { setVoteResult(null); setTargetCreator(creator); }}
                  />
                </Td>
                <Td>{creator.displayName}</Td>
                <Td>
                  <VoteCount>{creator.totalVoteCount.toLocaleString()}</VoteCount>
                </Td>
                <Td>
                  {creator.snsLink ? (
                    <SnsLink href={creator.snsLink} target="_blank" rel="noopener noreferrer">
                      リンク
                    </SnsLink>
                  ) : (
                    <span style={{ color: '#ccc' }}>—</span>
                  )}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal
        isOpen={!!targetCreator}
        title="投票確認"
        onCancel={() => setTargetCreator(null)}
        buttons={[
          {
            label: '投票する',
            onClick: handleConfirmVote,
            variant: 'primary',
            loading: isSubmitting,
            disabled: isSubmitting,
          },
        ]}
      >
        {targetCreator && (
          <ConfirmContent>
            <ConfirmAvatar src={targetCreator.imageUrl} alt={targetCreator.displayName} />
            <ConfirmName>{targetCreator.displayName}</ConfirmName>
            <ConfirmMessage>このクリエイターに投票しますか？</ConfirmMessage>
          </ConfirmContent>
        )}
      </Modal>
    </Container>
  );
}
