# CLAUDE.md Templates — par secteur

Templates prêts à l'emploi pour démarrer Claude Code en 5 minutes au lieu de 30.

## Quel template choisir ?

| Template | Pour qui |
|----------|---------|
| `saas-b2b.md` | Outil SaaS vendu à des entreprises (Notion, Linear, Figma, Slack-like) |
| `marketplace.md` | Plateforme mettant en relation offre et demande (Airbnb, Etsy, Upwork-like) |
| `mobile-app.md` | Application mobile (iOS/Android/cross-platform) grand public ou B2B |
| `fintech.md` | Produit financier : paiements, investissement, assurance, banque |
| `ecommerce.md` | E-commerce, retail digital, D2C |

## Comment utiliser

```bash
# Copier le template dans votre projet
cp claude-md-templates/saas-b2b.md mon-projet/CLAUDE.md

# Remplacer toutes les sections [À PERSONNALISER]
# Supprimer les commentaires <!-- --> une fois rempli

# Tester
claude
> Qui es-tu et quel est ce projet ?
```

## Sections à toujours personnaliser

Chaque template a des sections marquées `[À PERSONNALISER]`.
Les sections commentées `<!-- ... -->` contiennent des instructions — supprimez-les une fois le fichier rempli.

**Minimum viable (10 min de travail) :**
- Nom et description du produit
- Rôle de l'IA
- Utilisateurs cibles
- Conventions de nommage

**Version complète (30 min) :**
- Tout le minimum viable
- Stack technique
- Métriques clés
- Contexte concurrentiel
- Fichiers de référence
