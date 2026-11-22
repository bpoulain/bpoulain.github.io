/**
 * Badge Component
 *
 * Affiche un indicateur de statut ou une étiquette colorée.
 * Généré avec le skill `component-generator`.
 *
 * @example
 * <Badge variant="success" size="md">Actif</Badge>
 * <Badge variant="warning" size="sm" dot>En attente</Badge>
 */

import React from 'react';
import type { BadgeProps } from './types';

const variantClasses = {
  default: 'bg-surface-subtle text-text-secondary border-border-default',
  primary: 'bg-primary-subtle text-primary-foreground border-primary-muted',
  success: 'bg-success-subtle text-success-foreground border-success-muted',
  warning: 'bg-warning-subtle text-warning-foreground border-warning-muted',
  error:   'bg-error-subtle text-error-foreground border-error-muted',
  info:    'bg-info-subtle text-info-foreground border-info-muted',
} as const;

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs gap-1',
  md: 'px-2.5 py-1 text-sm gap-1.5',
  lg: 'px-3 py-1.5 text-sm gap-2',
} as const;

const dotColorClasses = {
  default: 'bg-text-secondary',
  primary: 'bg-primary',
  success: 'bg-success',
  warning: 'bg-warning',
  error:   'bg-error',
  info:    'bg-info',
} as const;

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'md',
  dot = false,
  icon,
  onRemove,
  className = '',
  'aria-label': ariaLabel,
}) => {
  const isInteractive = Boolean(onRemove);

  return (
    <span
      className={[
        'inline-flex items-center font-medium rounded-full border',
        variantClasses[variant],
        sizeClasses[size],
        className,
      ].join(' ')}
      role={isInteractive ? 'group' : undefined}
      aria-label={ariaLabel}
    >
      {/* Dot indicator */}
      {dot && (
        <span
          className={[
            'rounded-full flex-shrink-0',
            size === 'sm' ? 'w-1.5 h-1.5' : 'w-2 h-2',
            dotColorClasses[variant],
          ].join(' ')}
          aria-hidden="true"
        />
      )}

      {/* Icône optionnelle */}
      {icon && !dot && (
        <span
          className={size === 'sm' ? 'w-3 h-3' : 'w-4 h-4'}
          aria-hidden="true"
        >
          {icon}
        </span>
      )}

      {/* Contenu */}
      <span>{children}</span>

      {/* Bouton de suppression */}
      {onRemove && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          className={[
            'flex-shrink-0 rounded-full flex items-center justify-center',
            'hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-current focus:ring-offset-1',
            'transition-colors duration-150',
            size === 'sm' ? 'w-3.5 h-3.5 -mr-0.5' : 'w-4 h-4 -mr-0.5',
          ].join(' ')}
          aria-label={`Supprimer ${typeof children === 'string' ? children : 'l\'élément'}`}
        >
          <svg
            viewBox="0 0 16 16"
            fill="currentColor"
            className="w-full h-full"
            aria-hidden="true"
          >
            <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
          </svg>
        </button>
      )}
    </span>
  );
};

Badge.displayName = 'Badge';

export default Badge;
