import Image from "next/image";
import React from "react";
import { useSelector } from "react-redux";

export default function Loading() {
  const isLoading = useSelector((state) => state.loading.isLoading);
  return (
    <div>
      {isLoading && (
        <div className="absolute z-50 flex items-center justify-center w-full h-screen bg-blue-800">
          <Image src="loading.svg" alt="loading" width={100} height={100} />
        </div>
      )}
    </div>
  );
}
