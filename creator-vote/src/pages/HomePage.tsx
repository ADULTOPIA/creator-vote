import React from 'react';

import { useAuth } from '../contexts/AuthContext';
import { fetchCreators } from '../services/creatorService';
import { fetchUserVotesToday } from '../services/userVoteService';
import { submitVotes, VoteApiError } from '../services/voteService';
import { Creator } from '../types/creator';

const HomePage: React.FC = () => {
  const { user, loading: authLoading, loginInfo, signInWithGoogle, getIdToken, refreshLoginInfo, loginError, clearLoginError } = useAuth();

  const dayVotes = loginInfo?.dayVotes ?? 5;
  const usedVotes = loginInfo?.usedVotes ?? 0;
  const isBlocked = loginInfo?.isBlocked ?? false;
  const maxVotes = dayVotes;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [lockedIds, setLockedIds] = React.useState<string[]>([]);
  const [creators, setCreators] = React.useState<Creator[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const cardRadiusClass = 'rounded-2xl';

  React.useEffect(() => {
    const controller = new AbortController();

    const loadPageData = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      setSubmitMessage(null);

      try {
        let idToken: string | undefined;
        if (user) {
          try {
            idToken = await user.getIdToken();
          } catch {
            // token fetch failed — proceed without auth for creators list
          }
        }

        const [creatorData, todayVotes] = await Promise.all([
          fetchCreators({ signal: controller.signal }),
          user && idToken
            ? fetchUserVotesToday({ signal: controller.signal, idToken })
            : Promise.resolve({ creatorIds: [] as string[] }),
        ]);
        const sorted = [...creatorData].sort((a, b) => b.totalVoteCount - a.totalVoteCount);

        setCreators(sorted);
        setLockedIds(todayVotes.creatorIds);
        setSelectedIds(todayVotes.creatorIds);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        const fallbackMessage = error instanceof Error ? error.message : '不明なエラーが発生しました。';
        setErrorMessage(fallbackMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();

    return () => controller.abort();
  }, [refreshToken, user]);

  const retryFetch = () => {
    setSelectedIds([]);
    setLockedIds([]);
    setCreators([]);
    setErrorMessage(null);
    setIsLoading(true);
    setRefreshToken(previous => previous + 1);
  };

  const toggleSelect = (id: string) => {
    if (lockedIds.includes(id)) {
      return;
    }

    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(item => item !== id);
      }
      if (prev.length >= maxVotes) {
        return prev;
      }
      return [...prev, id];
    });
  };

  const remaining = Math.max(0, maxVotes - selectedIds.length);
  const reachedLimit = selectedIds.length >= maxVotes;

  const newSelections = selectedIds.filter(id => !lockedIds.includes(id));

  const handleConfirm = async () => {
    if (newSelections.length === 0) return;

    if (!user) {
      try {
        await signInWithGoogle();
      } catch {
        setSubmitMessage({ type: 'error', text: 'ログインがキャンセルされました。' });
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const idToken = await getIdToken();
      const result = await submitVotes(idToken, newSelections);

      // Update locked IDs with the newly accepted ones
      setLockedIds(prev => [...prev, ...result.acceptedCreatorIds]);
      setSubmitMessage({
        type: 'success',
        text: `${result.acceptedCreatorIds.length} 人への投票が完了しました！`,
      });

      // Refresh login info to get updated usedVotes
      await refreshLoginInfo();
    } catch (error) {
      if (error instanceof VoteApiError) {
        switch (error.status) {
          case 401:
            // AUTH_INVALID_TOKEN → try re-login
            setSubmitMessage({
              type: 'error',
              text: '認証エラーが発生しました。再ログインしてください。',
            });
            try {
              await signInWithGoogle();
              setSubmitMessage(null);
              // Retry automatically after re-login
              const newToken = await getIdToken();
              const retryResult = await submitVotes(newToken, newSelections);
              setLockedIds(prev => [...prev, ...retryResult.acceptedCreatorIds]);
              setSubmitMessage({
                type: 'success',
                text: `${retryResult.acceptedCreatorIds.length} 人への投票が完了しました！`,
              });
              await refreshLoginInfo();
            } catch {
              setSubmitMessage({ type: 'error', text: '再認証に失敗しました。ページをリロードしてください。' });
            }
            break;
          case 403:
            // USER_BLOCKED
            setSubmitMessage({ type: 'error', text: 'アカウントがブロックされているため投票できません。' });
            break;
          case 400:
            // VOTE_RULE_VIOLATION
            setSubmitMessage({
              type: 'error',
              text: error.message || '投票ルール違反: 残票不足または当日重複の可能性があります。',
            });
            break;
          default:
            // 500 etc.
            setSubmitMessage({
              type: 'error',
              text: 'サーバーエラーが発生しました。しばらくしてから再試行してください。',
            });
        }
      } else {
        setSubmitMessage({
          type: 'error',
          text: error instanceof Error ? error.message : '投票中にエラーが発生しました。',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderContent = () => {
    if (authLoading || isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-600">
            {authLoading ? '認証を確認しています…' : 'クリエイターを取得しています…'}
          </p>
        </div>
      );
    }

    if (loginError) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-red-600">{loginError}</p>
          <button
            type="button"
            onClick={clearLoginError}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            閉じる
          </button>
        </div>
      );
    }

    if (isBlocked) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-red-600">アカウントがブロックされています。操作を行うことができません。</p>
        </div>
      );
    }

    if (errorMessage) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
          <p className="text-sm text-red-600">{errorMessage}</p>
          <button
            type="button"
            onClick={retryFetch}
            className="rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700"
          >
            再試行
          </button>
        </div>
      );
    }

    if (!creators.length) {
      return (
        <div className="flex flex-1 flex-col items-center justify-center text-center text-sm text-gray-600">
          公開中のクリエイターが見つかりません。
        </div>
      );
    }

    const votedCreators = lockedIds
      .map(id => creators.find(creator => creator.creatorId === id))
      .filter((creator): creator is Creator => Boolean(creator));

    return (
      <div className="flex flex-col gap-6">
        {submitMessage && (
          <div
            className={`rounded-2xl border p-4 shadow-sm ${
              submitMessage.type === 'success'
                ? 'border-green-200 bg-green-50 text-green-700'
                : 'border-red-200 bg-red-50 text-red-700'
            }`}
          >
            <p className="text-sm font-medium">{submitMessage.text}</p>
          </div>
        )}

        {lockedIds.length > 0 && (
          <section className="rounded-2xl border border-pink-100 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-semibold text-pink-500">
              本日すでに {lockedIds.length} 票 投票済みです
            </p>
            <p className="mt-1 text-xs text-gray-600">
              既存の投票はキャンセルできません。翌日以降に再度投票できます。
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {(votedCreators.length ? votedCreators : lockedIds).map(item => (
                <span
                  key={typeof item === 'string' ? item : item.creatorId}
                  className="rounded-full bg-pink-50 px-3 py-1 text-xs font-medium text-pink-600"
                >
                  {typeof item === 'string' ? item : item.displayName}
                </span>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {creators.map(creator => {
            const isSelected = selectedIds.includes(creator.creatorId);
            const isLocked = lockedIds.includes(creator.creatorId);
            const isDisabled = reachedLimit && !isSelected;
            const stateClass = isLocked
              ? 'cursor-not-allowed opacity-80'
              : isDisabled
                ? 'opacity-50 pointer-events-none'
                : 'cursor-pointer';

            return (
              <button
                key={creator.creatorId}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    return;
                  }
                  toggleSelect(creator.creatorId);
                }}
                className={`text-left ${cardRadiusClass} bg-white shadow-sm transition hover:shadow-md ${
                  isSelected
                    ? 'border-[3px] border-[#FF69B4] ring-2 ring-[#FF69B4]/60'
                    : 'border border-gray-200'
                } ${stateClass}`}
              >
                <div className="overflow-hidden rounded-t-2xl aspect-[3/4]">
                  <img
                    src={creator.imageUrl}
                    alt={creator.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-3 py-3">
                  <h3 className="text-sm font-semibold text-gray-800 md:text-base">{creator.displayName}</h3>
                  <p className="text-xs text-gray-500 md:text-sm">
                    累計投票数: {creator.totalVoteCount.toLocaleString()}
                  </p>
                  {isLocked && (
                    <span className="mt-2 inline-flex items-center rounded-full bg-pink-50 px-2 py-0.5 text-[11px] font-semibold text-pink-500">
                      本日投票済
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div
      className="relative min-h-screen"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/adultopia/hero.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-white/50 shadow-lg backdrop-blur"
      />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="fixed inset-x-0 top-0 z-20 border-b border-gray-200 bg-white/70 backdrop-blur">
          <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={`${process.env.PUBLIC_URL}/adultopia/logoYoko.png`}
                alt="Creator Vote"
                className="h-8 w-auto"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm font-medium text-gray-700">
                残り <span className="text-pink-500 font-semibold">{remaining}</span> / {maxVotes} 票
              </div>
              {user ? (
                <div className="flex items-center gap-2">
                  {user.photoURL && (
                    <img src={user.photoURL} alt="" className="h-7 w-7 rounded-full" />
                  )}
                  <span className="hidden text-xs text-gray-500 sm:inline">{user.displayName}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={signInWithGoogle}
                  className="rounded-full bg-[#FF69B4] px-4 py-1.5 text-xs font-semibold text-white shadow transition hover:brightness-105"
                >
                  Googleでログイン
                </button>
              )}
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-28">{renderContent()}</main>

        {newSelections.length > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isSubmitting}
                className={`w-full max-w-md rounded-full px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#FF69B4] hover:brightness-105'
                }`}
              >
                {isSubmitting
                  ? '送信中…'
                  : user
                    ? `${newSelections.length} 人に投票を確定する`
                    : `ログインして ${newSelections.length} 人に投票する`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
