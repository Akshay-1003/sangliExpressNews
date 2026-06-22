"use client";

import React, { useState } from "react";
import Image from "next/image";

interface NewsImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  loading?: "lazy" | "eager";
}

const NewsImage: React.FC<NewsImageProps> = ({
  src,
  alt,
  width = 800,
  height = 400,
  className = "",
  priority = false,
  loading = "lazy",
}) => {
  const [imgSrc, setImgSrc] = useState(src);
  const [hasError, setHasError] = useState(false);

  const handleError = () => {
    if (!hasError) {
      setHasError(true);
      setImgSrc("/images/logo/logo-dark.png");
    }
  };

  return (
    <Image
      src={imgSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      onError={handleError}
      priority={priority}
      loading={priority ? "eager" : loading}
    />
  );
};

export default NewsImage;
