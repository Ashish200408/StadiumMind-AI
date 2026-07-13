import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { applyActionCode } from 'firebase/auth';
import { auth } from '@/config/firebase';
import { ROUTES } from '@/constants/routes';

export function VerifyEmailPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get the action code from the URL parameters
    const queryParams = new URLSearchParams(window.location.search);
    const actionCode = queryParams.get('oobCode');

    if (!actionCode) {
      setStatus('error');
      setErrorMessage('Invalid verification link.');
      return;
    }

    applyActionCode(auth, actionCode)
      .then(() => {
        setStatus('success');
        setTimeout(() => {
          navigate(ROUTES.LOGIN);
        }, 3000);
      })
      .catch((error) => {
        setStatus('error');
        setErrorMessage(error.message || 'Failed to verify email.');
      });
  }, [navigate]);

  return (
    <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-xl shadow-lg border text-center">
      {status === 'verifying' && (
        <>
          <h1 className="text-2xl font-bold tracking-tight">Verifying Email...</h1>
          <p className="text-muted-foreground">Please wait while we verify your email address.</p>
        </>
      )}

      {status === 'success' && (
        <>
          <h1 className="text-2xl font-bold text-green-600 tracking-tight">Email Verified!</h1>
          <p className="text-muted-foreground">
            Your email has been successfully verified. Redirecting to login...
          </p>
          <Link to={ROUTES.LOGIN} className="inline-block mt-4 text-primary hover:underline">
            Go to Login
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <h1 className="text-2xl font-bold text-destructive tracking-tight">
            Verification Failed
          </h1>
          <p className="text-muted-foreground">{errorMessage}</p>
          <Link to={ROUTES.LOGIN} className="inline-block mt-4 text-primary hover:underline">
            Back to Login
          </Link>
        </>
      )}
    </div>
  );
}
