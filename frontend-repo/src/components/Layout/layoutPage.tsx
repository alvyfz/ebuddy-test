import React from "react";
import LoadingScreen from "../Loading/LoadingScreen";

export default function Layout({
  children,
  isLoading,
  className = "",
}: {
  children: React.ReactNode;
  isLoading?: boolean;
  className?: string;
}) {
  return (
    <div className="flex flex-row min-h-screen justify-center">
      <div
        className={`flex flex-col w-full h-full max-w-[1600px] mx-4 sm:mx-8 md:mx-12 xl:mx-16 ${className}`}
      >
        {isLoading ? (
          <div className="flex flex-1 justify-center items-center">
            <LoadingScreen />
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}
