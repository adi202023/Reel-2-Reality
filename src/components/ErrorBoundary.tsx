import React, { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: React.ReactNode;
}

const ErrorBoundary: React.FC<Props> = ({ children }) => {
  const [hasError, setHasError] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      setHasError(true);
      setError(new Error(event.message));
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      setHasError(true);
      setError(new Error(event.reason));
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  const handleRetry = () => {
    setHasError(false);
    setError(null);
  };

  if (hasError) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        color: '#f1f5f9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}>
        <div style={{
          maxWidth: '28rem',
          margin: '0 auto',
          textAlign: 'center'
        }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{
              width: '4rem',
              height: '4rem',
              color: '#ef4444',
              margin: '0 auto 1rem auto'
            }}>
              ⚠️
            </div>
            <h1 style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              color: '#f1f5f9',
              marginBottom: '0.5rem'
            }}>
              Oops! Something went wrong
            </h1>
            <p style={{
              color: '#94a3b8',
              marginBottom: '1.5rem'
            }}>
              We encountered an unexpected error. Don't worry, it's not your fault!
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <button
              onClick={handleRetry}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg, #3b82f6 0%, #a855f7 100%)',
                color: '#ffffff',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                border: 'none',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.75rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.boxShadow = '0 0 20px rgba(139, 92, 246, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.1)';
              }}
            >
              <span style={{ marginRight: '0.5rem' }}>🔄</span>
              Try Again
            </button>

            <button
              onClick={() => window.location.href = '/'}
              style={{
                width: '100%',
                border: '1px solid #334155',
                background: 'transparent',
                color: '#f1f5f9',
                borderRadius: '0.375rem',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.75rem 2rem',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(51, 65, 85, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
            >
              Go Home
            </button>
          </div>

          {process.env.NODE_ENV === 'development' && error && (
            <details style={{ marginTop: '1.5rem', textAlign: 'left' }}>
              <summary style={{
                fontSize: '0.875rem',
                color: '#94a3b8',
                cursor: 'pointer',
                marginBottom: '0.5rem'
              }}>
                Error Details (Development)
              </summary>
              <pre style={{
                marginTop: '0.5rem',
                fontSize: '0.75rem',
                background: 'rgba(51, 65, 85, 0.3)',
                padding: '1rem',
                borderRadius: '0.5rem',
                overflow: 'auto',
                color: '#f1f5f9'
              }}>
                {error.stack}
              </pre>
            </details>
          )}
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
