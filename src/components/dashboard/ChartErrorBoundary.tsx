'use client';

/**
 * ChartErrorBoundary
 *
 * Catches render errors from chart/map components so one failing
 * visualization doesn't crash the entire dashboard.
 *
 * Must be a class component — React 18/19 has no hook-based equivalent.
 */

import { Component, type ReactNode, type ErrorInfo } from 'react';

interface Props {
  /** The chart/map to render */
  children: ReactNode;
  /** Panel label shown in the fallback (e.g. "Recession History") */
  label?: string;
}

interface State {
  hasError: boolean;
  message: string;
}

export class ChartErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      `[ChartErrorBoundary] "${this.props.label ?? 'chart'}" crashed:`,
      error.message,
      info.componentStack,
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          padding: '20px 16px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: 80,
        }}>
          <span style={{ fontSize: '20px' }}>⚠️</span>
          <div style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--text-secondary)',
            fontFamily: 'var(--font-body)',
          }}>
            {this.props.label ?? 'Chart'} unavailable
          </div>
          <div style={{
            fontSize: '10px',
            color: 'rgba(255,255,255,0.25)',
            fontFamily: 'var(--font-data)',
            maxWidth: 280,
            textAlign: 'center',
            lineHeight: 1.4,
          }}>
            {this.state.message}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
