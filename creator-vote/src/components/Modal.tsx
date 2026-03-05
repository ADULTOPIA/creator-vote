import React from 'react';
import { Creator } from '../types/creator';
import SmallCreatorCard from './SmallCreatorCard';

interface ModalButton {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
  loading?: boolean;
  disabled?: boolean;
}

interface ModalProps {
  isOpen: boolean;
  title: string;
  children?: React.ReactNode;
  buttons?: ModalButton[];
  // 後方互換性のため従来のプロップも残す
  selectedCreators?: Creator[];
  isSubmitting?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  title,
  children,
  buttons,
  selectedCreators,
  isSubmitting,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  // 後方互換性: buttons が指定されていない場合は従来の形式で構築
  const displayButtons = buttons || (
    selectedCreators && onConfirm && onCancel
      ? [
          {
            label: isSubmitting ? '送信中…' : '投票を確定する',
            onClick: onConfirm,
            variant: 'primary' as const,
            loading: isSubmitting,
            disabled: isSubmitting,
          },
          {
            label: 'キャンセル',
            onClick: onCancel,
            variant: 'secondary' as const,
            disabled: isSubmitting,
          },
        ]
      : []
  );

  // デフォルトコンテンツ: selectedCreators が指定されている場合
  const displayContent = children || (
    selectedCreators ? (
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {selectedCreators.map(creator => (
          <SmallCreatorCard key={creator.creatorId} creator={creator} />
        ))}
      </div>
    ) : null
  );

  const handleBackgroundClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // 背景をクリックしたときのみ処理（モーダル内のクリックは stopPropagation で止める）
    if (e.target === e.currentTarget && onCancel) {
      onCancel();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={handleBackgroundClick}
    >
      <div 
        className="bg-white/70 backdrop-blur rounded-2xl shadow-lg p-6 w-full max-w-md mx-2 border border-gray-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-gray-800">{title}</h2>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSubmitting}
            className="text-2xl text-gray-500 hover:text-gray-700 disabled:text-gray-300 transition"
          >
            ×
          </button>
        </div>
        {displayContent && <div className="mb-4">{displayContent}</div>}
        <div className="flex gap-3 justify-center mt-2">
          {displayButtons
            .filter((button) => button.variant === 'primary')
            .map((button, index) => (
            <button
              key={index}
              type="button"
              onClick={button.onClick}
              disabled={button.disabled}
              className={`rounded-full px-6 py-2 font-semibold shadow transition bg-[#FF69B4] text-white hover:brightness-105 disabled:bg-gray-400`}
            >
              {button.loading ? '送信中…' : button.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Modal;
