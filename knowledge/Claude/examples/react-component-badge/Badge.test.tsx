import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Badge } from './Badge';

describe('Badge', () => {
  // ─── Rendu de base ──────────────────────────────────────────────────────
  describe('Rendu', () => {
    it('affiche le contenu children', () => {
      render(<Badge>Actif</Badge>);
      expect(screen.getByText('Actif')).toBeInTheDocument();
    });

    it('applique la variante par défaut (default)', () => {
      const { container } = render(<Badge>Test</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-surface-subtle');
    });

    it('applique la variante success', () => {
      const { container } = render(<Badge variant="success">Succès</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('bg-success-subtle');
    });

    it('applique la taille sm', () => {
      const { container } = render(<Badge size="sm">Petit</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('text-xs');
    });

    it('applique les classes custom via className', () => {
      const { container } = render(<Badge className="my-custom-class">Test</Badge>);
      const badge = container.firstChild as HTMLElement;
      expect(badge.className).toContain('my-custom-class');
    });
  });

  // ─── Dot ────────────────────────────────────────────────────────────────
  describe('Dot', () => {
    it('affiche le point quand dot=true', () => {
      const { container } = render(<Badge dot variant="success">En ligne</Badge>);
      // Le dot est un span avec aria-hidden
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toBeInTheDocument();
      expect(dot?.className).toContain('rounded-full');
    });

    it("n'affiche pas de dot quand dot=false (défaut)", () => {
      const { container } = render(<Badge>Sans dot</Badge>);
      const spans = container.querySelectorAll('[aria-hidden="true"]');
      expect(spans).toHaveLength(0);
    });
  });

  // ─── Bouton de suppression ───────────────────────────────────────────────
  describe('onRemove', () => {
    it('affiche le bouton de suppression quand onRemove est fourni', () => {
      const onRemove = vi.fn();
      render(<Badge onRemove={onRemove}>React</Badge>);
      const removeBtn = screen.getByRole('button', { name: /supprimer react/i });
      expect(removeBtn).toBeInTheDocument();
    });

    it("n'affiche pas de bouton sans onRemove", () => {
      render(<Badge>Sans remove</Badge>);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('appelle onRemove au clic', () => {
      const onRemove = vi.fn();
      render(<Badge onRemove={onRemove}>TypeScript</Badge>);
      const removeBtn = screen.getByRole('button', { name: /supprimer typescript/i });
      fireEvent.click(removeBtn);
      expect(onRemove).toHaveBeenCalledTimes(1);
    });

    it('a un aria-label correct sur le bouton de suppression', () => {
      const onRemove = vi.fn();
      render(<Badge onRemove={onRemove}>Tailwind</Badge>);
      const removeBtn = screen.getByRole('button');
      expect(removeBtn).toHaveAttribute('aria-label', 'Supprimer Tailwind');
    });
  });

  // ─── Accessibilité ──────────────────────────────────────────────────────
  describe('Accessibilité', () => {
    it('accepte et applique aria-label', () => {
      render(<Badge aria-label="Statut : actif">✓</Badge>);
      const badge = screen.getByLabelText('Statut : actif');
      expect(badge).toBeInTheDocument();
    });

    it('le dot est masqué des lecteurs d\'écran (aria-hidden)', () => {
      const { container } = render(<Badge dot>En ligne</Badge>);
      const dot = container.querySelector('[aria-hidden="true"]');
      expect(dot).toHaveAttribute('aria-hidden', 'true');
    });

    it('ajoute role=group quand onRemove est présent', () => {
      render(<Badge onRemove={vi.fn()}>Tag</Badge>);
      const badge = screen.getByRole('group');
      expect(badge).toBeInTheDocument();
    });

    it("n'ajoute pas role=group sans onRemove", () => {
      render(<Badge>Tag simple</Badge>);
      expect(screen.queryByRole('group')).not.toBeInTheDocument();
    });
  });

  // ─── Instantiations combinées ───────────────────────────────────────────
  describe('Combinaisons', () => {
    it('fonctionne avec variant + size + dot + onRemove', () => {
      const onRemove = vi.fn();
      render(
        <Badge variant="success" size="lg" dot onRemove={onRemove}>
          Actif
        </Badge>
      );
      expect(screen.getByText('Actif')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeInTheDocument();
    });
  });
});
