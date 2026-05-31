# Spec Technique — [Feature / Composant]

**Auteur** : [Nom]  
**Date** : [YYYY-MM-DD]  
**PRD de référence** : [lien vers PRD]  
**Statut** : Draft | Review | Approved

---

## Résumé

[Description en 2-3 phrases de ce qui est construit et pourquoi]

---

## Architecture

### Vue d'ensemble

```
[Diagramme ASCII ou description du flux de données]

Client → [composant A] → [service B] → [base de données C]
```

### Composants touchés

| Composant | Type | Action |
|-----------|------|--------|
| [Composant 1] | Frontend / Backend / DB | Créé / Modifié / Supprimé |
| [Composant 2] | | |

---

## API

### Endpoints nouveaux ou modifiés

#### `POST /api/[resource]`

**Description** : [Ce que fait cet endpoint]

**Request** :
```json
{
  "field1": "string",
  "field2": 123
}
```

**Response (200)** :
```json
{
  "id": "uuid",
  "field1": "string",
  "createdAt": "ISO8601"
}
```

**Errors** :
| Code | Raison |
|------|--------|
| 400 | [Validation échouée] |
| 404 | [Resource non trouvée] |
| 403 | [Non autorisé] |

---

## Base de données

### Nouvelles tables ou colonnes

```sql
-- Table [nom]
CREATE TABLE nom (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- colonnes
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Migrations

- [ ] Migration de création
- [ ] Migration de données (si nécessaire)
- [ ] Index créés

---

## Frontend

### Composants

| Composant | Rôle | Nouvelles props |
|-----------|------|----------------|
| [Composant] | [Description] | [Props ajoutées] |

### États UI

| État | Déclencheur | Comportement |
|------|------------|-------------|
| Loading | [Trigger] | [Skeleton / spinner] |
| Error | [Trigger] | [Message + action] |
| Empty | [Trigger] | [État vide UI] |
| Success | [Trigger] | [Confirmation] |

---

## Tests

### Stratégie de test

- [ ] Tests unitaires : [liste des fonctions critiques]
- [ ] Tests d'intégration : [liste des endpoints]
- [ ] Tests E2E : [scénarios critiques]

### Critères de couverture

Couverture minimale : 80% sur les chemins critiques

---

## Sécurité

- [ ] Validation des inputs
- [ ] Autorisation vérifiée sur les endpoints
- [ ] Pas de données sensibles dans les logs
- [ ] Rate limiting si pertinent

---

## Performance

- [ ] Requêtes DB optimisées (index, N+1 évité)
- [ ] Mise en cache si pertinent : [stratégie]
- [ ] Taille de bundle vérifiée (si frontend)

---

## Rollout

- [ ] Feature flag implémenté : `[flag_name]`
- [ ] Monitoring configuré : [métrique à surveiller]
- [ ] Rollback possible : [procédure]

---

## Open Questions techniques

| Question | Owner | Date |
|----------|-------|------|
| [Question technique non résolue] | [Nom] | [Date] |
