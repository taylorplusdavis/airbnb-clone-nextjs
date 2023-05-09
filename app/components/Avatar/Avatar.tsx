"use client";

import React from "react";
import Image from "next/image";

interface AvatarProps {
  imageSrc: string | null | undefined;
}

const Avatar: React.FC<AvatarProps> = ({ imageSrc }) => {
  return (
    <Image
      className="rounded-full"
      height="30"
      width="30"
      alt="Avatar"
      src={imageSrc || "/images/placeholder.jpg"}
    />
  );
};

export default Avatar;
