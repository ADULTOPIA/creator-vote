import React from 'react';

const USER_STATUS = {
  loggedIn: true,
  remainingVotes: 5,
};

type Creator = {
  id: string;
  displayName: string;
  imageUrl: string;
  updatedAt: string;
};

const API_PATH = '/creators';
const DEFAULT_API_BASE =
  process.env.NODE_ENV === 'production'
    ? 'https://us-central1-adultopia-creator-vote.cloudfunctions.net/api'
    : 'http://127.0.0.1:5001/adultopia-creator-vote/us-central1/api';
const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL?.replace(/\/$/, '') ?? DEFAULT_API_BASE;
const API_ENDPOINT = `${API_BASE_URL}${API_PATH}`;

const HomePage: React.FC = () => {
  const maxVotes = USER_STATUS.remainingVotes;
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);
  const [creators, setCreators] = React.useState<Creator[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [errorMessage, setErrorMessage] = React.useState<string | null>(null);
  const [refreshToken, setRefreshToken] = React.useState(0);
  const cardRadiusClass = 'rounded-2xl';

  React.useEffect(() => {
    const controller = new AbortController();

    const fetchCreators = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      try {
        const response = await fetch(API_ENDPOINT, { signal: controller.signal });

        if (!response.ok) {
          const previewText = await response.text().catch(() => null);
          const details = previewText ? `: ${previewText.slice(0, 120)}` : '';
          throw new Error(`クリエイターの取得に失敗しました (status ${response.status})${details}`);
        }

        const contentType = response.headers.get('content-type') ?? '';
        if (!contentType.includes('application/json')) {
          const previewText = await response.text().catch(() => null);
          const preview = previewText ? `: ${previewText.slice(0, 120)}` : '';
          throw new Error(`JSON ではないレスポンスを受信しました${preview}`);
        }

        const data: Creator[] = await response.json();
        const sorted = [...data].sort(
          (a, b) => new Date(b.updatedAt).valueOf() - new Date(a.updatedAt).valueOf(),
        );

        setCreators(sorted);
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

    fetchCreators();

    return () => controller.abort();
  }, [refreshToken]);

  const retryFetch = () => {
    setSelectedIds([]);
    setCreators([]);
    setErrorMessage(null);
    setIsLoading(true);
    setRefreshToken(previous => previous + 1);
  };

  const toggleSelect = (id: string) => {
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

  const remaining = maxVotes - selectedIds.length;
  const reachedLimit = selectedIds.length >= maxVotes;

  const handleConfirm = () => {
    alert(`選択したID: ${selectedIds.join(', ')}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-1 items-center justify-center">
          <p className="text-sm text-gray-600">クリエイターを取得しています…</p>
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

    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {creators.map(creator => {
          const isSelected = selectedIds.includes(creator.id);
          const isDisabled = reachedLimit && !isSelected;

          return (
            <button
              key={creator.id}
              type="button"
              onClick={() => toggleSelect(creator.id)}
              className={`text-left ${cardRadiusClass} bg-white shadow-sm transition hover:shadow-md ${
                isSelected
                  ? 'border-[3px] border-[#FF69B4] ring-2 ring-[#FF69B4]/60'
                  : 'border border-gray-200'
              } ${isDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
            >
              <div className="overflow-hidden rounded-t-2xl">
                <img
                  src={creator.imageUrl}
                  alt={creator.displayName}
                  className="h-40 w-full object-cover"
                />
              </div>
              <div className="px-3 py-3">
                <h3 className="text-sm font-semibold text-gray-800 md:text-base">{creator.displayName}</h3>
                <p className="text-xs text-gray-500 md:text-sm">
                  更新: {new Date(creator.updatedAt).toLocaleDateString()}
                </p>
              </div>
            </button>
          );
        })}
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
            <div className="text-sm font-medium text-gray-700">
              残り <span className="text-pink-500 font-semibold">{remaining}</span> / {maxVotes} 票
            </div>
          </div>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-24 pb-28">{renderContent()}</main>

        {selectedIds.length > 0 && (
          <div className="fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl justify-center px-4 py-4">
              <button
                type="button"
                onClick={handleConfirm}
                className="w-full max-w-md rounded-full bg-[#FF69B4] px-6 py-3 text-center text-base font-semibold text-white shadow-lg transition hover:brightness-105"
              >
                {selectedIds.length} 人に投票を確定する
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
