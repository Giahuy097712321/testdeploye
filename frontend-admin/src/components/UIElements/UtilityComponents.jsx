import React from 'react';

/**
 * Badge Component - Hiển thị trạng thái hoặc số lượng
 */
export const Badge = ({ children, variant = 'primary', size = 'md' }) => {
  const variants = {
    primary: {
      bg: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
      color: '#fff',
    },
    success: {
      bg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      color: '#fff',
    },
    warning: {
      bg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      color: '#fff',
    },
    danger: {
      bg: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
      color: '#fff',
    },
    info: {
      bg: 'linear-gradient(135deg, #06b6d4 0%, #0891b2 100%)',
      color: '#fff',
    },
    gray: {
      bg: '#e5e7eb',
      color: '#374151',
    },
  };

  const sizes = {
    sm: { padding: '2px 8px', fontSize: '11px' },
    md: { padding: '4px 10px', fontSize: '12px' },
    lg: { padding: '6px 12px', fontSize: '13px' },
  };

  const style = variants[variant] || variants.primary;
  const sizeStyle = sizes[size];

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: style.bg,
        color: style.color,
        padding: sizeStyle.padding,
        fontSize: sizeStyle.fontSize,
        fontWeight: 600,
        borderRadius: '6px',
        letterSpacing: '0.3px',
        textTransform: 'uppercase',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
      }}
    >
      {children}
    </span>
  );
};

/**
 * Card Component - Container đẹp cho nội dung
 */
export const Card = ({ 
  children, 
  title, 
  subtitle,
  footer,
  headerColor = 'primary',
  hoverable = false,
}) => {
  const headerColors = {
    primary: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    accent: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  };

  return (
    <div
      style={{
        background: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.2s',
        cursor: hoverable ? 'pointer' : 'default',
      }}
      onMouseEnter={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(0, 0, 0, 0.1)';
        }
      }}
      onMouseLeave={(e) => {
        if (hoverable) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        }
      }}
    >
      {/* Header */}
      {(title || subtitle) && (
        <div
          style={{
            background: headerColors[headerColor] || headerColors.primary,
            color: '#fff',
            padding: '16px 20px',
          }}
        >
          {title && (
            <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>
              {title}
            </h3>
          )}
          {subtitle && (
            <p
              style={{
                margin: '4px 0 0 0',
                fontSize: '13px',
                opacity: 0.9,
              }}
            >
              {subtitle}
            </p>
          )}
        </div>
      )}

      {/* Body */}
      <div style={{ padding: '20px' }}>{children}</div>

      {/* Footer */}
      {footer && (
        <div
          style={{
            padding: '12px 20px',
            background: '#f9fafb',
            borderTop: '1px solid #e5e7eb',
            fontSize: '13px',
            color: '#64748b',
          }}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

/**
 * Alert Component - Thông báo trong trang
 */
export const Alert = ({ 
  type = 'info', 
  title, 
  children, 
  dismissible = false,
  onDismiss,
}) => {
  const types = {
    success: {
      bg: '#d1fae5',
      border: '#10b981',
      text: '#065f46',
      icon: '✓',
    },
    error: {
      bg: '#fee2e2',
      border: '#ef4444',
      text: '#991b1b',
      icon: '✕',
    },
    warning: {
      bg: '#fef3c7',
      border: '#f59e0b',
      text: '#92400e',
      icon: '⚠',
    },
    info: {
      bg: '#cffafe',
      border: '#06b6d4',
      text: '#164e63',
      icon: 'ℹ',
    },
  };

  const config = types[type] || types.info;

  return (
    <div
      style={{
        background: config.bg,
        border: `2px solid ${config.border}`,
        borderRadius: '8px',
        padding: '14px 18px',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '12px',
        marginBottom: '16px',
      }}
    >
      {/* Icon */}
      <div
        style={{
          width: '24px',
          height: '24px',
          borderRadius: '50%',
          background: config.border,
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          fontWeight: 'bold',
          flexShrink: 0,
        }}
      >
        {config.icon}
      </div>

      {/* Content */}
      <div style={{ flex: 1, color: config.text }}>
        {title && (
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px', fontWeight: 700 }}>
            {title}
          </h4>
        )}
        <div style={{ fontSize: '13px', lineHeight: 1.5 }}>{children}</div>
      </div>

      {/* Dismiss Button */}
      {dismissible && (
        <button
          onClick={onDismiss}
          style={{
            background: 'transparent',
            border: 'none',
            color: config.text,
            cursor: 'pointer',
            fontSize: '18px',
            padding: '0',
            width: '20px',
            height: '20px',
            flexShrink: 0,
          }}
        >
          ×
        </button>
      )}
    </div>
  );
};

/**
 * Progress Bar Component
 */
export const ProgressBar = ({ 
  value = 0, 
  max = 100, 
  color = 'primary',
  showLabel = true,
  height = '8px',
}) => {
  const colors = {
    primary: 'linear-gradient(135deg, #2563eb 0%, #1e40af 100%)',
    success: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    warning: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    danger: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  };

  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  const barColor = colors[color] || colors.primary;

  return (
    <div style={{ width: '100%' }}>
      {showLabel && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '6px',
            fontSize: '12px',
            color: '#64748b',
            fontWeight: 600,
          }}
        >
          <span>Progress</span>
          <span>{percentage.toFixed(0)}%</span>
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: height,
          background: '#e5e7eb',
          borderRadius: '100px',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: '100%',
            background: barColor,
            transition: 'width 0.3s ease',
            borderRadius: '100px',
          }}
        />
      </div>
    </div>
  );
};

/**
 * Avatar Component
 */
export const Avatar = ({ 
  src, 
  alt = 'Avatar', 
  size = 'md',
  fallback = '👤',
}) => {
  const sizes = {
    sm: '32px',
    md: '48px',
    lg: '64px',
    xl: '96px',
  };

  const avatarSize = sizes[size];

  return (
    <div
      style={{
        width: avatarSize,
        height: avatarSize,
        borderRadius: '50%',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        fontSize: `calc(${avatarSize} / 2)`,
        fontWeight: 600,
        border: '3px solid #fff',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      }}
    >
      {src ? (
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      ) : (
        fallback
      )}
    </div>
  );
};

/**
 * Divider Component
 */
export const Divider = ({ text, orientation = 'horizontal' }) => {
  if (orientation === 'vertical') {
    return (
      <div
        style={{
          width: '1px',
          height: '100%',
          background: '#e5e7eb',
        }}
      />
    );
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        margin: '20px 0',
      }}
    >
      <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
      {text && (
        <>
          <span
            style={{
              padding: '0 16px',
              fontSize: '13px',
              color: '#64748b',
              fontWeight: 600,
            }}
          >
            {text}
          </span>
          <div style={{ flex: 1, height: '1px', background: '#e5e7eb' }} />
        </>
      )}
    </div>
  );
};

export default {
  Badge,
  Card,
  Alert,
  ProgressBar,
  Avatar,
  Divider,
};