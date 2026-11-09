import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class RootErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error in TEIC application:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#1C3728] text-[#E7E3D3] flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full p-6 sm:p-8 rounded-xl bg-[#224231] border border-[#355D46] shadow-lg text-center space-y-4">
            <h2 className="font-serif text-2xl font-semibold text-[#F5F1E4]">
              TEIC Research Group
            </h2>
            <p className="text-xs sm:text-sm text-[#C8C2AF] leading-relaxed">
              An unexpected display issue occurred. Please refresh or reset stored preferences.
            </p>
            {this.state.error?.message && (
              <pre className="p-3 bg-[#162B1F] rounded text-left font-mono text-xs text-amber-300 overflow-x-auto whitespace-pre-wrap">
                {this.state.error.message}
              </pre>
            )}
            <div className="pt-2">
              <button
                onClick={() => {
                  try {
                    localStorage.removeItem('teic_custom_publications_md');
                    localStorage.removeItem('teic_custom_meetings_md');
                  } catch {
                    // ignore
                  }
                  window.location.reload();
                }}
                className="px-4 py-2 text-xs font-semibold text-[#162B1F] bg-[#E7E3D3] hover:bg-[#F5F1E4] rounded-lg transition-colors cursor-pointer"
              >
                Reset Stored Cache & Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <RootErrorBoundary>
    <App />
  </RootErrorBoundary>
);
