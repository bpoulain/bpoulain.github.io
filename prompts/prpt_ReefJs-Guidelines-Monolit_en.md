```markdown
# Reef Js - Monolit Webapp Guidelines
1. **Reef script BEFORE module**: `<script src="cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>` then `<script type="module">`
2. **Single state**: `const data = signal({ items: [], input: '' })` – Direct access `data.items` (NOT `data.value.items`)
3. **Pure actions**: `const actions = { add() { data.items.push(...); actions.save(); } }` – Manually save after mutations
4. **Pure template**: `function template() { return \`<div>${data.items.map(i => \`<li>${i}</li>\`).join('')}</div>\` }` – Always`.join('')`
5. **Event delegation**: `document.addEventListener('click', e => { if (e.target.matches('[data-action]')) ... })` – data-* attributes
6. **Component init**: `const { signal, component } = reef; component('#app', template); actions.load();`
7. **LocalStorage**: `save() { localStorage.setItem('key', JSON.stringify(data)) }` then `load() { data.items = JSON.parse(stored) }`
8. **Inline styles**: Use `style="${condition ? 'opacity: 0.5' : ''}"` in templates for dynamic states
9. **Input binding**: `<input value="${data.input}">` + `document.addEventListener('input', e => { data.input = e.target.value })`
10. **v13 pitfalls**: ❌ No `.value` on signal | ❌ No auto watchers | ❌ Reef AFTER modules | ✅ Manual save
```