```markdown
# Reef Js - Monolit Webapp Guidelines
- **Reef script BEFORE module**: `<script src="cdn.jsdelivr.net/npm/reefjs@13/dist/reef.min.js"></script>` then `<script type="module">`
- **Single state**: `const data = signal({ items: [], input: '' })` – Direct access `data.items` (NOT `data.value.items`)
- **Pure actions**: `const actions = { add() { data.items.push(...); actions.save(); } }` – Manually save after mutations
- **Pure template**: `function template() { return \`<div>${data.items.map(i => `<li>${i}</li>`).join('')}</div>` }`– Always`.join('')`
- **Event delegation**: `document.addEventListener('click', e => { if (e.target.matches('[data-action]')) ... })` – data-* attributes
- **Component init**: `const { signal, component } = reef; component('#app', template); actions.load();`
- **LocalStorage**: `save() { localStorage.setItem('key', JSON.stringify(data)) }` then `load() { data.items = JSON.parse(stored) }`
- **Inline styles**: Use `style="${condition ? 'opacity: 0.5' : ''}"` in templates for dynamic states
- **Input binding**: `<input value="${data.input}">` + `document.addEventListener('input', e => { data.input = e.target.value })`
- **v13 pitfalls**: ❌ No `.value` on signal | ❌ No auto watchers | ❌ Reef AFTER modules | ✅ Manual save
```