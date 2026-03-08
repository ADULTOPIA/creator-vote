import React from 'react';
import { useTranslation } from 'react-i18next';

import { useAuth } from '../contexts/AuthContext';
import { fetchCreators } from '../services/creatorService';
import { fetchUserVotesToday } from '../services/userVoteService';
import { submitVotes, VoteApiError } from '../services/voteService';
import { Creator } from '../types/creator';
import Modal from '../components/Modal';
import SmallCreatorCard from '../components/SmallCreatorCard';
import Footer from '../components/Footer';
import FloatingHeart from '../components/FloatingHeart';
import { availableLanguages, languageNames } from '../i18n';

const HomePage: React.FC = () => {
  const { user, loading: authLoading, loginInfo, signInWithGoogle, getIdToken, refreshLoginInfo, loginError, clearLoginError } = useAuth();
  const { t, i18n } = useTranslation();

  const dayVotes = loginInfo?.dayVotes ?? 5;
  const isBlocked = loginInfo?.isBlocked ?? false;
  const maxVotes = dayVotes;

  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [lockedIds, setLockedIds] = React.useState<string[]>([]);
  const [creators, setCreators] = React.useState<Creator[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState(0);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [submitMessage, setSubmitMessage] = React.useState<{ type: 'success' | 'error'; text: string; code?: string; status?: number } | null>(null);
  const [showConfirmPopup, setShowConfirmPopup] = React.useState(false);
  const [showLoginModal, setShowLoginModal] = React.useState(false);
  const [showNoVotesModal, setShowNoVotesModal] = React.useState(false);
  const [showAlreadyVotedModal, setShowAlreadyVotedModal] = React.useState(false);
  const [showAccountBlockedModal, setShowAccountBlockedModal] = React.useState(false);
  const [showNoCreatorsModal, setShowNoCreatorsModal] = React.useState(false);
  const [floatingHearts, setFloatingHearts] = React.useState<Array<{ id: string; x: number; y: number; size: 'large' | 'small'; duration: number }>>([]);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const menuRef = React.useRef<HTMLDivElement>(null);
  const cardRadiusClass = 'rounded-2xl';

  // メニュー外クリック検出
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowUserMenu(false);
      }
    };

    if (showUserMenu) {
      document.addEventListener('mousedown', handleOutsideClick);
      return () => document.removeEventListener('mousedown', handleOutsideClick);
    }
  }, [showUserMenu]);

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
        // Fisher-Yates shuffle for true random order
        const shuffled = [...creatorData];
        for (let i = shuffled.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }

        setCreators(shuffled);
        setLockedIds(todayVotes.creatorIds);
        setSelectedIds(todayVotes.creatorIds);
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }

        const fallbackMessage = error instanceof Error ? error.message : t('unknownError');
        setErrorMessage(fallbackMessage);
      } finally {
        setIsLoading(false);
      }
    };

    loadPageData();

    return () => controller.abort();
  }, [refreshToken, user]);

  React.useEffect(() => {
    if (isBlocked) setShowAccountBlockedModal(true);
  }, [isBlocked]);

  React.useEffect(() => {
    if (!isLoading && !errorMessage && creators.length === 0) {
      setShowNoCreatorsModal(true);
    } else {
      setShowNoCreatorsModal(false);
    }
  }, [isLoading, errorMessage, creators]);

  const retryFetch = () => {
    setSelectedIds([]);
    setLockedIds([]);
    setCreators([]);
    setErrorMessage(null);
    setIsLoading(true);
    setRefreshToken(previous => previous + 1);
  };

  const createFloatingHearts = (x: number, y: number) => {
    // 複数のハート粒子を生成（クリック位置周辺に分散させる）
    const count = 3 + Math.floor(Math.random() * 3); // 3～5個のハート
    // 小さいハートの配置方向（四方八方に拡散）
    const directions = [
      { x: 20, y: -20 },   // 右上
      { x: -20, y: -20 },  // 左上
      { x: 10, y: 10 },    // 右下
      { x: -10, y: 10 },   // 左下
      { x: 20, y: 0 },    // 右
    ];
    
    const newHearts = Array.from({ length: count }).map((_, i) => {
      const duration = 1 + Math.random() * 0.8; // 1.0～1.8秒でバラバラに
      
      if (i === 0) {
        return {
          id: `heart-${Date.now()}-${i}`,
          x: x + (Math.random() - 0.5) * 40, // ±20pxの範囲内でランダム
          y: y + (Math.random() - 0.5) * 40,
          size: 'large' as const,
          duration,
        };
      }
      
      const direction = directions[(i - 1) % directions.length];
      const variation = 1 + (Math.random() - 0.5) * 0.4; // 0.8～1.2の変動
      
      return {
        id: `heart-${Date.now()}-${i}`,
        x: x + direction.x * variation + (Math.random() - 0.5) * 20,
        y: y + direction.y * variation + (Math.random() - 0.5) * 20,
        size: 'small' as const,
        duration,
      };
    });
    setFloatingHearts(prev => [...prev, ...newHearts]);
  };

  const removeFloatingHeart = (id: string) => {
    setFloatingHearts(prev => prev.filter(heart => heart.id !== id));
  };

  const toggleSelect = (id: string, isDisabled: boolean) => {
    if (lockedIds.includes(id)) {
      return;
    }

    if (isDisabled) {
      setShowNoVotesModal(true);
      return;
    }

    if (!user) {
      setShowLoginModal(true);
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

  // Show confirmation popup instead of submitting immediately
  const handleVoteClick = () => {
    if (newSelections.length === 0) return;
    setShowConfirmPopup(true);
  };

  // Actually submit votes after confirmation
  const handleConfirmVote = async () => {
    if (newSelections.length === 0) return;

    if (!user) {
      try {
        await signInWithGoogle();
      } catch {
        setSubmitMessage({ type: 'error', text: t('loginCancelled') });
        setShowConfirmPopup(false);
        return;
      }
    }

    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      const idToken = await getIdToken();
      const result = await submitVotes(idToken, newSelections);

      setLockedIds(prev => [...prev, ...result.acceptedCreatorIds]);
      setCreators(prev => prev.map(creator =>
        result.acceptedCreatorIds.includes(creator.creatorId)
          ? { ...creator, totalVoteCount: creator.totalVoteCount + 1 }
          : creator
      ));
      await refreshLoginInfo();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      if (error instanceof VoteApiError) {
        switch (error.status) {
          case 401:
            setSubmitMessage({
              type: 'error',
              text: t('authError'),
            });
            try {
              await signInWithGoogle();
              setSubmitMessage(null);
              const newToken = await getIdToken();
              const retryResult = await submitVotes(newToken, newSelections);
              setLockedIds(prev => [...prev, ...retryResult.acceptedCreatorIds]);
              setCreators(prev => prev.map(creator =>
                retryResult.acceptedCreatorIds.includes(creator.creatorId)
                  ? { ...creator, totalVoteCount: creator.totalVoteCount + 1 }
                  : creator
              ));
              await refreshLoginInfo();
              window.scrollTo({ top: 0, behavior: 'smooth' });
            } catch {
              setSubmitMessage({ type: 'error', text: t('reauthFailed') });
            }
            break;
          case 403:
            setSubmitMessage({ type: 'error', text: t('accountBlocked') });
            break;
          case 400: {
            const isRuleViolation = (error.code || '') === 'VOTE_RULE_VIOLATION';
            setSubmitMessage({
              type: 'error',
              text: isRuleViolation ? t('votingRuleViolation') : (error.message || t('votingRuleViolation')),
              code: isRuleViolation ? 'VOTE_RULE_VIOLATION' : error.code,
              status: error.status,
            });
            break;
          }
          default:
            setSubmitMessage({
              type: 'error',
              text: t('serverError'),
              status: error.status,
            });
        }
      } else {
        // Try to detect structured server error messages like { error: 'INTERNAL_ERROR' }
        let parsedCode: string | undefined;
        let displayText = t('votingError');
        if (error instanceof Error) {
          displayText = error.message;
          try {
            const parsed = JSON.parse(error.message);
            if (parsed && typeof parsed === 'object' && 'error' in parsed) {
              parsedCode = (parsed as any).error;
              if (parsedCode === 'INTERNAL_ERROR') {
                displayText = t('serverError');
              }
            }
          } catch {
            // not JSON — keep raw message
          }
        }

        setSubmitMessage({
          type: 'error',
          text: displayText,
          code: parsedCode,
        });
      }
    } finally {
      setIsSubmitting(false);
      setShowConfirmPopup(false);
    }
  };

  const renderContent = () => {
    if (authLoading || isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-600">
            {authLoading ? t('authChecking') : t('loadingCreators')}
          </p>
        </div>
      );
    }


    const votedCreators = lockedIds
      .map(id => creators.find(creator => creator.creatorId === id))
      .filter((creator): creator is Creator => Boolean(creator));

    return (
      <div className="flex flex-col gap-6">
        {lockedIds.length > 0 && (
          <section className="rounded-2xl border border-pink-100 bg-white/80 p-4 shadow-sm">
            <p className="text-sm font-semibold text-pink-500">
              {t('votedToday')} {lockedIds.length} {t('votedTickets')}
            </p>
            <p className="mt-1 text-xs text-gray-600">
              {t('cannotCancelVotes')}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              {votedCreators.map(creator => (
                <SmallCreatorCard key={creator.creatorId} creator={creator} />
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
          {creators.map(creator => {
            const isSelected = selectedIds.includes(creator.creatorId);
            const isLocked = lockedIds.includes(creator.creatorId);
            const isDisabled = reachedLimit && !isSelected;
            let cardClass = '';
            if (isLocked) {
              cardClass = 'bg-white border border-gray-200 cursor-not-allowed';
            } else if (isSelected) {
              cardClass = 'bg-pink-50 border-[3px] border-[#FF69B4] ring-2 ring-[#FF69B4] cursor-pointer';
            } else {
              cardClass = 'bg-white border border-gray-200 cursor-pointer';
            }
            return (
              <button
                key={creator.creatorId}
                type="button"
                onClick={() => {
                  if (isLocked) {
                    setShowAlreadyVotedModal(true);
                    return;
                  }
                  toggleSelect(creator.creatorId, isDisabled);
                }}
                className={`text-left ${cardRadiusClass} shadow-sm transition hover:shadow-md ${cardClass}`}
              >
                <div className="overflow-hidden rounded-t-2xl aspect-[3/4] relative">
                  <img
                    src={creator.imageUrl}
                    alt={creator.displayName}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="px-3 py-3">
                  <h3 className="text-sm font-semibold md:text-base text-gray-800">{creator.displayName}</h3>
                  <div className="flex items-center justify-between gap-1">
                    <p className="text-xs md:text-sm text-gray-500">
                      {t('totalVotes')} {creator.totalVoteCount.toLocaleString()}
                    </p>
                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold whitespace-nowrap ${
                      isLocked
                        ? 'bg-pink-50 text-pink-500'
                        : 'invisible'
                    }`}>
                      {t('votedBadge')}
                    </span>
                  </div>
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
      onMouseDown={(e) => {
        createFloatingHearts(e.clientX, e.clientY);
      }}
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

      {floatingHearts.map(heart => (
        <FloatingHeart
          key={heart.id}
          id={heart.id}
          x={heart.x}
          y={heart.y}
          size={heart.size}
          duration={heart.duration}
          onComplete={removeFloatingHeart}
        />
      ))}

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
              {user && (
                <div className="text-sm font-medium text-gray-700">
                  {t('remaining')} <span className="text-pink-500 font-semibold">{remaining}</span> / {maxVotes} {t('votes')}
                </div>
              )}
              <div className="relative" ref={menuRef}>
                {user ? (
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 hover:opacity-75 transition"
                    title="メニュー"
                  >
                    {user.photoURL && (
                      <img src={user.photoURL} alt="" className="h-8 w-8 rounded-full object-cover" />
                    )}
                    <span className="hidden text-xs text-gray-500 sm:inline">{user.displayName}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center justify-center h-8 w-8 rounded-full bg-gray-300 hover:bg-gray-400 transition shadow flex-shrink-0"
                    title="メニュー"
                  >
                    <svg
                      className="h-5 w-5 text-gray-600"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                    </svg>
                  </button>
                )}

                {/* ドロップダウンメニュー */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 rounded-lg bg-white border border-gray-200 shadow-lg z-50">
                    <div className="py-2">
                      {/* 言語選択 */}
                      <div className="px-4 py-2 border-b border-gray-200">
                        <p className="text-xs font-semibold text-gray-600 mb-2">{t('language')}</p>
                        <div className="space-y-1">
                          {availableLanguages.map(lang => (
                            <button
                              key={lang}
                              type="button"
                              onClick={async () => {
                                await i18n.changeLanguage(lang);
                                setShowUserMenu(false);
                              }}
                              className={`block w-full text-left px-3 py-2 text-sm rounded transition ${
                                i18n.language === lang
                                  ? 'bg-pink-50 text-pink-600 font-semibold'
                                  : 'text-gray-700 hover:bg-gray-100'
                              }`}
                            >
                              {languageNames[lang]}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* ログインボタン（未ログイン時のみ） */}
                      {!user && (
                        <button
                          type="button"
                          onClick={() => {
                            signInWithGoogle();
                            setShowUserMenu(false);
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition"
                        >
                          {t('googleLoginButton')}
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-12">{renderContent()}</main>

        {newSelections.length > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
              <button
                type="button"
                onClick={handleVoteClick}
                disabled={isSubmitting}
                className={`w-full max-w-md rounded-full px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition ${
                  isSubmitting
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[#FF69B4] hover:brightness-105'
                }`}
              >
                {isSubmitting
                  ? t('submitting')
                  : user
                    ? t('confirmVotesButton', { count: newSelections.length })
                    : t('loginAndVoteButton', { count: newSelections.length })}
              </button>
            </div>
          </div>
        )}

        <Footer />

        <Modal
          isOpen={showConfirmPopup}
          title={t('confirmVotesTitle')}
          onCancel={() => setShowConfirmPopup(false)}
          buttons={[
            {
              label: isSubmitting ? t('submitting') : t('confirmVotesButtonLabel'),
              onClick: handleConfirmVote,
              variant: 'primary' as const,
              loading: isSubmitting,
              disabled: isSubmitting,
            },
            {
              label: t('cancelButton'),
              onClick: () => setShowConfirmPopup(false),
              variant: 'secondary' as const,
              disabled: isSubmitting,
            },
          ]}
          selectedCreators={creators.filter(c => newSelections.includes(c.creatorId))}
        />

        <Modal
          isOpen={showLoginModal}
          title={t('loginRequired')}
          onCancel={() => setShowLoginModal(false)}
          buttons={[
            {
              label: t('googleLoginButton'),
              onClick: async () => {
                try {
                  await signInWithGoogle();
                  setShowLoginModal(false);
                } catch (error) {
                  console.error('Login failed:', error);
                }
              },
              variant: 'primary' as const,
            },
            {
              label: t('cancelButton'),
              onClick: () => setShowLoginModal(false),
              variant: 'secondary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{t('loginRequiredText')}</p>
        </Modal>

        <Modal
          isOpen={showNoVotesModal}
          title={t('noVotesLeftTitle')}
          onCancel={() => setShowNoVotesModal(false)}
          buttons={[
            {
              label: t('okButton'),
              onClick: () => setShowNoVotesModal(false),
              variant: 'primary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{t('noVotesLeftText')}</p>
        </Modal>

        <Modal
          isOpen={showNoCreatorsModal}
          title={t('noCreatorsFound')}
          onCancel={() => setShowNoCreatorsModal(false)}
          buttons={[
            {
              label: t('retryButton'),
              onClick: () => {
                retryFetch();
                setShowNoCreatorsModal(false);
              },
              variant: 'primary' as const,
            },
            {
              label: t('cancelButton'),
              onClick: () => setShowNoCreatorsModal(false),
              variant: 'secondary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{t('noCreatorsFound')}</p>
        </Modal>

        <Modal
          isOpen={showAlreadyVotedModal}
          title={t('alreadyVotedTitle')}
          onCancel={() => setShowAlreadyVotedModal(false)}
          buttons={[
            {
              label: t('okButton'),
              onClick: () => setShowAlreadyVotedModal(false),
              variant: 'primary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{t('alreadyVotedText')}</p>
        </Modal>

        {/* Notification modal for submit results */}
        <Modal
          isOpen={!!submitMessage}
          title={submitMessage?.type === 'success' ? t('success') : t('error')}
          onCancel={() => setSubmitMessage(null)}
          buttons={
            // VOTE_RULE_VIOLATION -> force reload
            submitMessage?.type === 'error' && submitMessage?.code === 'VOTE_RULE_VIOLATION'
              ? [
                  {
                    label: t('reloadButton'),
                    onClick: () => window.location.reload(),
                    variant: 'primary' as const,
                    disabled: isSubmitting,
                  },
                ]
              : [
                  {
                    label: t('retryButton'),
                    onClick: () => handleConfirmVote(),
                    variant: 'primary' as const,
                    loading: isSubmitting,
                    disabled: isSubmitting,
                  },
                  {
                    label: t('okButton'),
                    onClick: () => setSubmitMessage(null),
                    variant: 'secondary' as const,
                    disabled: isSubmitting,
                  },
                ]
          }
        >
          <p className="text-sm text-gray-600">{submitMessage?.text}</p>
        </Modal>

        {/* General error modal (fetch errors, etc.) */}
        <Modal
          isOpen={!!errorMessage}
          title={t('error')}
          onCancel={() => setErrorMessage(null)}
          buttons={[
            {
              label: t('retryButton'),
              onClick: () => {
                retryFetch();
                setErrorMessage(null);
              },
              variant: 'primary' as const,
            },
            {
              label: t('cancelButton'),
              onClick: () => setErrorMessage(null),
              variant: 'secondary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{errorMessage}</p>
        </Modal>

        {/* Login error from auth context */}
        <Modal
          isOpen={!!loginError}
          title={t('loginError')}
          onCancel={clearLoginError}
          buttons={[
            {
              label: t('closeButton'),
              onClick: clearLoginError,
              variant: 'primary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{loginError}</p>
        </Modal>

        {/* Account blocked modal shown once when detected */}
        <Modal
          isOpen={showAccountBlockedModal}
          title={t('accountBlocked')}
          onCancel={() => setShowAccountBlockedModal(false)}
          buttons={[
            {
              label: t('okButton'),
              onClick: () => setShowAccountBlockedModal(false),
              variant: 'primary' as const,
            },
          ]}
        >
          <p className="text-sm text-gray-600">{t('accountBlockedFull')}</p>
        </Modal>
      </div>
    </div>
  );
};

export default HomePage;
