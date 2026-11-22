```markdown
# Reef Js - Monolit Webapp Guidelines
1. **Script Reef AVANT module** : `<script src="cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>` puis `<script type="module">`
2. **State unique** : `const data = signal({ items: [], input: '' })` - Accès direct `data.items` (PAS `data.value.items`)
3. **Actions pures** : `const actions = { add() { data.items.push(...); actions.save(); } }` - Sauver manuellement après mutations
4. **Template pur** : `function template() { return \`<div>${data.items.map(i => \`<li>${i}</li>\`).join('')}</div>\` }` - Toujours `.join('')`
5. **Event delegation** : `document.addEventListener('click', e => { if (e.target.matches('[data-action]')) ... })` - data-* attributes
6. **Component init** : `const { signal, component } = reef; component('#app', template); actions.load();`
7. **LocalStorage** : `save() { localStorage.setItem('key', JSON.stringify(data)) }` puis `load() { data.items = JSON.parse(stored) }`
8. **Inline styles** : Utiliser `style="${condition ? 'opacity: 0.5' : ''}"` dans templates pour états dynamiques
9. **Input binding** : `<input value="${data.input}">` + `document.addEventListener('input', e => { data.input = e.target.value })`
10. **Pièges v13** : ❌ Pas de `.value` sur signal | ❌ Pas de watchers auto | ❌ Reef AVANT modules | ✅ Sauver manuellement
```