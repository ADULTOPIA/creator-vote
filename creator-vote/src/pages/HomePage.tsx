import React from 'react';

const USER_STATUS = {
  loggedIn: true,
  remainingVotes: 5,
};

const CREATORS = Array.from({ length: 30 }, (_, index) => {
  const id = index + 1;
  return {
    id,
    name: `Creator ${id}`,
    imageUrl: `https://picsum.photos/seed/creator-${id}/400/400`,
    voteCount: 1200 + id * 37,
  };
});

const HomePage: React.FC = () => {
  const maxVotes = USER_STATUS.remainingVotes;
  const [selectedIds, setSelectedIds] = React.useState<number[]>([]);

  const toggleSelect = (id: number) => {
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

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${process.env.PUBLIC_URL}/adultopia/hero.jpg)`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
      }}
    >
      <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
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

      <main className="mx-auto w-full max-w-6xl px-4 py-6 pb-28">
        <div className="rounded-3xl bg-white/90 p-4 shadow-lg backdrop-blur md:p-6">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {CREATORS.map(creator => {
              const isSelected = selectedIds.includes(creator.id);
              const isDisabled = reachedLimit && !isSelected;

              return (
                <button
                  key={creator.id}
                  type="button"
                  onClick={() => toggleSelect(creator.id)}
                  className={`text-left rounded-xl bg-white shadow-sm transition hover:shadow-md ${
                    isSelected
                      ? 'border-[3px] border-[#FF69B4] ring-2 ring-[#FF69B4]/60'
                      : 'border border-gray-200'
                  } ${isDisabled ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
                >
                  <div className="overflow-hidden rounded-lg">
                    <img
                      src={creator.imageUrl}
                      alt={creator.name}
                      className="h-40 w-full object-cover"
                    />
                  </div>
                  <div className="px-3 py-3">
                    <h3 className="text-sm font-semibold text-gray-800 md:text-base">{creator.name}</h3>
                    <p className="text-xs text-gray-500 md:text-sm">累計票数: {creator.voteCount.toLocaleString()}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </main>

      {selectedIds.length > 0 && (
        <div className="fixed bottom-0 inset-x-0 z-30 border-t border-gray-200 bg-white/95 backdrop-blur">
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
  );
};

export default HomePage;
