import React from 'react';

interface DescriptionTitleWithImageProps {
  children: React.ReactNode;
  imgSrc: string;
  imgAlt?: string;
  imgStyle?: React.CSSProperties;
}

const DescriptionTitleWithImage: React.FC<DescriptionTitleWithImageProps> = ({ children, imgSrc, imgAlt = '', imgStyle }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
    <img src={imgSrc} alt={imgAlt} style={{ width: 32, height: 32, ...imgStyle }} />
    <span>{children}</span>
  </div>
);

export default DescriptionTitleWithImage;
