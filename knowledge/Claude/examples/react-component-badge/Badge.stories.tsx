import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';

const meta = {
  title: 'Components/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Affiche un indicateur de statut ou une étiquette colorée. Supporte des variantes, des tailles, un point coloré, une icône et un bouton de suppression.',
      },
    },
  },
  argTypes: {
    variant: {
      control: 'select',
      description: 'Style visuel du badge',
    },
    size: {
      control: 'select',
      description: 'Taille du badge',
    },
    dot: {
      control: 'boolean',
      description: 'Afficher un point coloré',
    },
    onRemove: {
      action: 'removed',
      description: 'Callback appelé quand on clique sur ✕',
    },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── Story principale (Playground) ────────────────────────────────────────
export const Playground: Story = {
  args: {
    children: 'Badge',
    variant: 'default',
    size: 'md',
    dot: false,
  },
};

// ─── Variantes ────────────────────────────────────────────────────────────
export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="default">Default</Badge>
      <Badge variant="primary">Primary</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};

// ─── Tailles ──────────────────────────────────────────────────────────────
export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Badge size="sm" variant="primary">Small</Badge>
      <Badge size="md" variant="primary">Medium</Badge>
      <Badge size="lg" variant="primary">Large</Badge>
    </div>
  ),
};

// ─── Avec point ───────────────────────────────────────────────────────────
export const WithDot: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="success" dot>Actif</Badge>
      <Badge variant="warning" dot>En attente</Badge>
      <Badge variant="error" dot>Hors ligne</Badge>
      <Badge variant="info" dot size="sm">Nouveau</Badge>
    </div>
  ),
};

// ─── Avec bouton de suppression ────────────────────────────────────────────
export const Removable: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge variant="primary" onRemove={() => console.log('removed')}>React</Badge>
      <Badge variant="default" onRemove={() => console.log('removed')}>TypeScript</Badge>
      <Badge variant="success" onRemove={() => console.log('removed')}>Tailwind</Badge>
    </div>
  ),
};

// ─── Cas d'usage réels ─────────────────────────────────────────────────────
export const StatusExamples: Story = {
  render: () => (
    <div className="space-y-3">
      <div className="flex gap-2 items-center">
        <span className="text-sm text-text-secondary w-24">Statut PRD :</span>
        <Badge variant="warning" dot>Draft</Badge>
        <Badge variant="info" dot>In Review</Badge>
        <Badge variant="success" dot>Approved</Badge>
        <Badge variant="default" dot>Shipped</Badge>
      </div>
      <div className="flex gap-2 items-center">
        <span className="text-sm text-text-secondary w-24">Priorité :</span>
        <Badge variant="error" size="sm">P1</Badge>
        <Badge variant="warning" size="sm">P2</Badge>
        <Badge variant="default" size="sm">P3</Badge>
      </div>
    </div>
  ),
};
