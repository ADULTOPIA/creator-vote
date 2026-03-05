import React from 'react';
import { Creator } from '../types/creator';

interface SmallCreatorCardProps {
  creator: Creator;
}

const SmallCreatorCard: React.FC<SmallCreatorCardProps> = ({ creator }) => {
  return (
    <div className="w-24 text-left rounded-2xl shadow-sm border border-gray-200 bg-white overflow-hidden">
      <div className="overflow-hidden aspect-[3/4] relative">
        <img
          src={creator.imageUrl}
          alt={creator.displayName}
          className="h-full w-full object-cover"
        />
      </div>
      <div className="px-1 py-1">
        <span className="text-xs font-semibold text-gray-800 line-clamp-2">
          {creator.displayName}
        </span>
      </div>
    </div>
  );
};

export default SmallCreatorCard;
