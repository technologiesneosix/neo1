import React, { useState, useEffect } from 'react';

interface StartupLoaderProps {
  children: React.ReactNode;
}

const MESSAGES = [
  'Initializing services...',
  'Connecting to backend...',
  'Loading application...',
  'Preparing dashboard...',
  'Almost ready...',
];

export function StartupLoader({ children }: StartupLoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isAwake, setIsAwake] = useState(false);
  const [showLoader, setShowLoader] = useState(true);
  const [fadeAway, setFadeAway] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);
  const [elapsedTime, setElapsedTime] = useState(0);

  const apiBaseUrl = import.meta.env.VITE_API_URL;
  const useRemoteApi = Boolean(apiBaseUrl);

  // Poll health endpoint every 3 seconds
  useEffect(() => {
    if (!apiBaseUrl) {
      setIsAwake(true);
      return;
    }

    let intervalId: ReturnType<typeof setInterval>;
    let activeController: AbortController | null = null;

    const checkHealth = async () => {
      // Abort any pending check if we call it again
      if (activeController) {
        activeController.abort();
      }
      activeController = new AbortController();
      const signal = activeController.signal;

      try {
        const baseUrl = apiBaseUrl.endsWith('/') ? apiBaseUrl : `${apiBaseUrl}/`;
        const healthUrl = `${baseUrl}health`;

        const res = await fetch(healthUrl, { signal });
        if (res.ok) {
          const data = await res.json();
          if (data && data.status === 'ok') {
            setIsAwake(true);
            clearInterval(intervalId);
          }
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          console.warn('Backend is waking up...', err);
        }
      }
    };

    // Initial check
    checkHealth();

    // Check every 3 seconds
    intervalId = setInterval(checkHealth, 3000);

    return () => {
      if (intervalId) clearInterval(intervalId);
      if (activeController) activeController.abort();
    };
  }, [apiBaseUrl, useRemoteApi]);

  // Track elapsed time (1-second intervals)
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedTime((prev) => prev + 1000);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Progress Bar Animation Logic
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (isAwake) {
          return Math.min(100, prev + 5); // Rapid transition to 100% when backend is awake
        }
        if (prev >= 90) {
          return 90; // Hold at 90% until backend wakes up
        }

        let increment = 0;
        if (prev < 30) {
          increment = 1.8; // Quick 0 -> 30
        } else if (prev < 60) {
          increment = 0.8; // Slower 30 -> 60
        } else if (prev < 80) {
          increment = 0.3; // Slower 60 -> 80
        } else {
          increment = 0.08; // Very slow 80 -> 90
        }

        return Math.min(90, Number((prev + increment).toFixed(2)));
      });
    }, 100);

    return () => clearInterval(timer);
  }, [isAwake]);

  // Rotate messages every 4 seconds
  useEffect(() => {
    const msgTimer = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(msgTimer);
  }, []);

  // Transition and Fade out loader when progress reaches 100%
  useEffect(() => {
    if (progress >= 100) {
      const fadeTimeout = setTimeout(() => {
        setFadeAway(true);
        // Wait for CSS opacity transition to complete before unmounting loader
        const unmountTimeout = setTimeout(() => {
          setShowLoader(false);
        }, 500); // matches duration-500 transition
        return () => clearTimeout(unmountTimeout);
      }, 400); // brief pause to display 100% progress
      return () => clearTimeout(fadeTimeout);
    }
  }, [progress]);

  if (!showLoader) {
    return <>{children}</>;
  }

  return (
    <>
      {/* Mount application routes underneath once awake to avoid any loading layout flash */}
      {isAwake && children}

      <div
        className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-b from-mist-50 via-mist-100 to-mist-200 px-4 text-heading transition-opacity duration-500 ease-in-out ${
          fadeAway ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        {/* Subtle glowing background blobs (Neosix Primary & Azure theme colors in light mode opacity) */}
        <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-primary-200/50 blur-[120px] pointer-events-none animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 h-72 w-72 rounded-full bg-azure-200/50 blur-[120px] pointer-events-none animate-pulse"></div>

        {/* Premium container card */}
        <div className="relative overflow-hidden w-full max-w-md bg-white/90 backdrop-blur-xl border border-neutral-200/60 rounded-2xl p-8 flex flex-col items-center justify-center shadow-card">
          {/* Top glowing accent border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-brand-gradient"></div>

          {/* Loading Animation: Outer & Inner spinning rings */}
          <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
            {/* Outer spinning ring (clockwise) */}
            <div className="absolute h-full w-full rounded-full border-4 border-neutral-100 border-t-primary-600 border-r-primary-600 animate-spin"></div>
            {/* Inner spinning ring (counter-clockwise) */}
            <div className="absolute h-12 w-12 rounded-full border-4 border-neutral-100 border-b-azure-500 border-l-azure-500 animate-spin-reverse"></div>
            {/* Center pulsing core */}
            <div className="h-4 w-4 rounded-full bg-brand-gradient shadow-[0_0_8px_rgba(93,92,242,0.4)]"></div>
          </div>

          {/* Branding Header */}
          <h2 className="mb-1 text-2xl font-bold tracking-wide bg-gradient-to-r from-primary-600 to-azure-600 bg-clip-text text-transparent">
            Neosix Technologies
          </h2>
          <span className="text-xs uppercase tracking-[0.25em] text-neutral-400 font-semibold mb-4">
            Starting Application...
          </span>

          {/* Progress message (rotates smoothly) */}
          <div className="h-12 flex items-center justify-center text-center px-2">
            <p className="text-sm text-neutral-500 transition-all duration-300">
              {MESSAGES[messageIndex]}
            </p>
          </div>

          {/* Progress Bar Container */}
          <div className="mt-6 w-full">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs text-neutral-400 font-mono">
                {isAwake ? 'Connected' : 'Connecting...'}
              </span>
              <span className="text-xs text-primary-600 font-bold font-mono">
                {Math.round(progress)}%
              </span>
            </div>
            <div className="h-[6px] w-full rounded-full bg-neutral-100 overflow-hidden p-[1px] border border-neutral-200/50">
              <div
                className="h-full rounded-full bg-brand-gradient transition-all duration-100 ease-out shadow-[0_0_8px_rgba(93,92,242,0.25)]"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
