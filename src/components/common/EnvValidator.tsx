import React, { useEffect, useState } from 'react';

interface EnvValidatorProps {
  children: React.ReactNode;
}

export const EnvValidator: React.FC<EnvValidatorProps> = ({ children }) => {
  const [missingVars, setMissingVars] = useState<string[]>([]);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const requiredVars = [
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_GEMINI_API_KEY',
    ];

    const missing = requiredVars.filter(
      (v) => !import.meta.env[v] || import.meta.env[v].startsWith('mock-')
    );
    setMissingVars(missing);
    setIsChecking(false);
  }, []);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (missingVars.length > 0) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6">
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-8 max-w-2xl w-full">
          <div className="flex items-center gap-3 text-red-500 mb-6">
            <span className="text-3xl">⚠</span>
            <h1 className="text-2xl font-bold">Missing Environment Configuration</h1>
          </div>

          <p className="text-slate-300 mb-4">
            The application cannot start because the following required environment variables are
            missing or invalid:
          </p>

          <ul className="list-disc pl-6 space-y-2 mb-8 text-slate-400 font-mono text-sm">
            {missingVars.map((v) => (
              <li key={v}>
                <span className="bg-slate-900 px-2 py-1 rounded text-red-400 border border-red-500/20">
                  {v}
                </span>
              </li>
            ))}
          </ul>

          <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
            <h3 className="font-semibold text-slate-200 mb-2">How to fix this:</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-slate-400">
              <li>
                Create a{' '}
                <code className="text-slate-300 bg-slate-800 px-1 py-0.5 rounded">.env.local</code>{' '}
                file in the root of the project.
              </li>
              <li>Add the missing variables with valid keys.</li>
              <li>Restart the development server.</li>
            </ol>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors border border-slate-600"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
