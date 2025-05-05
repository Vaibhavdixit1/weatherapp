"use client";

import { useEffect, useState } from "react";
import { FaWifi, FaSync, FaCloudRain, FaWind } from "react-icons/fa";
import { FiRefreshCw } from "react-icons/fi";
import { LuRefreshCw } from "react-icons/lu";

export default function OfflineWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOnline, setIsOnline] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [isRetrying, setIsRetrying] = useState(false);

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);

    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryCount((prev) => prev + 1);

    // Simulate checking for connection
    setTimeout(() => {
      setIsRetrying(false);
      // If we're actually online now, the event listener will catch it
    }, 1500);
  };

  if (!isOnline) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-slate-800 to-slate-900 text-white p-6">
        <div className="w-full max-w-md bg-slate-700/60 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-slate-600">
          <div className="flex flex-col items-center gap-6">
            {/* Icon */}
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 rounded-full blur-xl"></div>
              <div className="relative bg-red-500 text-white p-4 rounded-full">
                <FaWifi size={32} style={{ opacity: 0.5 }} />
              </div>
            </div>

            {/* Weather icons animation */}
            <div className="flex justify-center gap-3 animate-pulse">
              <FaCloudRain className="text-slate-400" size={24} />
              <FaWind className="text-slate-400" size={24} />
            </div>

            {/* Main message */}
            <div className="text-center">
              <h2 className="text-xl font-bold mb-2">No Internet Connection</h2>
              <p className="text-slate-300 mb-4">
                We can&apos;t load your weather data right now. Please check your
                connection and try again.
              </p>
            </div>

            {/* Retry button */}
            <button
              onClick={handleRetry}
              disabled={isRetrying}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 px-6 py-3 rounded-lg font-medium transition-all w-full justify-center"
            >
              {isRetrying ? (
                <>
                  <LuRefreshCw className="animate-spin" size={18} />
                  <span>Checking connection...</span>
                </>
              ) : (
                <>
                  <FiRefreshCw size={18} />
                  <span>Retry</span>
                </>
              )}
            </button>

            {/* Retry count */}
            {retryCount > 0 && (
              <p className="text-sm text-slate-400">
                Retry attempts: {retryCount}
              </p>
            )}

            {/* Tips */}
            <div className="mt-6 bg-slate-800/80 p-4 rounded-lg w-full">
              <h3 className="font-medium text-sm text-slate-300 mb-2">
                Troubleshooting tips:
              </h3>
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• Check your Wi-Fi or mobile data connection</li>
                <li>• Try switching to a different network</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-xs text-slate-500">
          © {new Date().getFullYear()} Weather-TeachEdison · Vaibhav Dixit
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
