import React from 'react';

/**
 * Loading Spinner Component - Modern & Beautiful
 * Sử dụng khi đang tải dữ liệu hoặc xử lý
 */

export const LoadingSpinner = ({ size = 'md', text = 'Đang tải...', color = 'primary' }) => {
  const sizes = {
    sm: { spinner: '20px', fontSize: '12px' },
    md: { spinner: '40px', fontSize: '14px' },
    lg: { spinner: '60px', fontSize: '16px' },
  };

  const colors = {
    primary: '#2563eb',
    accent: '#8b5cf6',
    success: '#10b981',
    warning: '#f59e0b',
    danger: '#ef4444',
  };

  const spinnerSize = sizes[size].spinner;
  const fontSize = sizes[size].fontSize;
  const spinnerColor = colors[color] || colors.primary;

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '16px',
      padding: '32px',
    }}>
      {/* Spinner với gradient border */}
      <div style={{
        width: spinnerSize,
        height: spinnerSize,
        border: '4px solid rgba(0, 0, 0, 0.1)',
        borderTop: `4px solid ${spinnerColor}`,
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      
      {/* Loading text */}
      {text && (
        <p style={{
          margin: 0,
          fontSize: fontSize,
          fontWeight: 600,
          color: '#64748b',
          letterSpacing: '0.3px',
        }}>
          {text}
        </p>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * Skeleton Loader - Cho danh sách items
 */
export const SkeletonLoader = ({ count = 3, height = '60px' }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '20px' }}>
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          style={{
            height: height,
            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.5s infinite',
            borderRadius: '8px',
          }}
        />
      ))}
      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
};

/**
 * Pulse Loader - Loader đơn giản dạng pulse
 */
export const PulseLoader = ({ size = 'md', color = 'primary' }) => {
  const sizes = {
    sm: '8px',
    md: '12px',
    lg: '16px',
  };

  const colors = {
    primary: '#2563eb',
    accent: '#8b5cf6',
    success: '#10b981',
  };

  const dotSize = sizes[size];
  const dotColor = colors[color] || colors.primary;

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
    }}>
      {[0, 1, 2].map((idx) => (
        <div
          key={idx}
          style={{
            width: dotSize,
            height: dotSize,
            borderRadius: '50%',
            backgroundColor: dotColor,
            animation: `pulse 1.4s infinite ease-in-out ${idx * 0.2}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes pulse {
          0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
          }
          40% {
            transform: scale(1);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;