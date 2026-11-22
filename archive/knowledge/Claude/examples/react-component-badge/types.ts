export type BadgeVariant = 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
export type BadgeSize = 'sm' | 'md' | 'lg';

export interface BadgeProps {
  /** Contenu du badge */
  children: React.ReactNode;

  /** Style visuel du badge */
  variant?: BadgeVariant;

  /** Taille du badge */
  size?: BadgeSize;

  /** Afficher un point coloré à gauche du texte */
  dot?: boolean;

  /** Icône optionnelle (remplace le dot) */
  icon?: React.ReactNode;

  /** Callback de suppression — affiche un bouton ✕ */
  onRemove?: () => void;

  /** Classes CSS additionnelles */
  className?: string;

  /** Label accessible pour les lecteurs d'écran */
  'aria-label'?: string;
}
