# Buscador de usuarios de GitHub — Solución `try / catch / finally`

**Cuenta:** [leonmiguel2622](https://github.com/leonmiguel2622) — **Miguel León Oliveros** — 7 repos públicos · 14 followers · `https://api.github.com/users/leonmiguel2622`

> Ejercicio del PDF `ejericio.pdf`: página con `input` + botón **Buscar**. Al hacer clic se muestra `nombre`, `avatar`, `repos` y link a GitHub. Si el usuario no existe (404), contiene `@`, o falla la red, se muestra mensaje de error **sin romper la app** usando `try / catch / finally`.

---

## Estructura organizada (requerida)

```
uscador_de_usuarios_de_GitHub/
├── index.html          # HTML + Matrix (enlace a css/style.css y js/script.js)
├── css/
│   └── style.css       # Estilos completos + Matrix morado — css/style.css:1
├── js/
│   └── script.js       # Lógica try/catch/finally + fetch — js/script.js:143
├── codigo.js           # Respaldo snippet aislado (opcional)
└── README.md           # Este archivo
```

**Enlaces en `index.html`:**
- `index.html:13` → `<link rel="stylesheet" href="css/style.css">`
- `index.html:329` → `<script src="js/script.js"></script>`
- `index.html:18` → `<div class="matrix-container">` (5× `.matrix-pattern` ×40 `.matrix-column` = 200 columnas)

---

## Paleta morada (requisito: todo gira en torno al morado)

**`css/style.css:1` `:root`:**
```css
--bg:#0a0620; --card:#1a1033; --card-border:#3b2560;
--input-bg:#1e1240; --input-border:#4a2d7a;
--primary:#7c3aed; --primary-hover:#6d28d9; --primary-active:#5b21b6; --primary-light:#a78bfa;
--text:#ede9fe; --muted:#b8a9d9;
--log-bg:#140e2a; --log-border:#2e1f4d;
```
- Fondo `body` morado oscuro con dos `radial-gradient` (`#2a145a`, `#1a0b3a`) sobre `var(--bg)`.
- Card `linear-gradient(#1e1035→#120a24)`, inputs, log y scrollbar en morado.
- Estados: `input:focus` → `border-color:var(--primary)` + `box-shadow:var(--primary-glow)`, `loading-box` morado, `log .success` → `#c084fc`.

**Matrix morado (`css/style.css:619`):**
- `.matrix-container` `position:fixed; inset:0; z-index:-1; opacity:0.45; background:#05020f`
- `.matrix-column::before` degradado morado:
  `linear-gradient(to bottom, #ffffff 0%/5%, #d8b4fe 10%, #c084fc 20%, #a855f7 30%, #9333ea 40%, #7c3aed 50%, #6d28d9 60%, #5b21b6 70%, #4c1d95 80%, rgba(124,58,237,0.5) 90%, transparent)`
- Animación `fall` 2.3s–4.5s, 40 posiciones `left:0–975px`, variantes `odd/even/3n/4n/5n` con katakana + alfanumérico.

---

## Botón Buscar (diseño solicitado)

**`index.html:247`:**
```html
<button id="btnBuscar"><span class="text">Buscar</span></button>
```

**`css/style.css:171` `#btnBuscar`:**
```css
#btnBuscar{
  background-image:linear-gradient(144deg,#af40ff,#5b42f3 50%,#00ddeb);
  border-radius:8px; box-shadow:rgba(151,65,252,0.2) 0 15px 30px -5px;
  padding:3px; min-width:140px; font-size:18px;
}
#btnBuscar span{
  background-color:rgb(5,6,45); padding:16px 24px;
  border-radius:6px; transition:300ms;
}
#btnBuscar:hover span{background:none}
#btnBuscar:active{transform:scale(0.9)}
#btnBuscar:disabled{opacity:0.6; pointer-events:none}
```

**`js/script.js:157` / `:293` adaptación al `<span>`:**
```js
const span = btn.querySelector('.text');
if (span) span.textContent = 'Buscando...'; // y 'Buscar' en finally
```

---

## Snippet exigido (verbatim)

```js
async function buscarUsuario(username) {
    log(`Iniciando fetch para "${username}"...`);
    const respuesta = await fetch(`https://api.github.com/users/${username}`);
```

Presente en `js/script.js:177` + `215` y `index.html:311` dentro de:

```js
// js/script.js:143
async function buscarUsuario(username){
  username = String(raw).trim();
  btn.disabled=true; const span=btn.querySelector('.text'); span.textContent='Buscando...';
  try{
    log(`Iniciando fetch para "${username}"...`); // siempre primero para loguear @ como en PDF
    if(!username) throw new Error('Debes ingresar...');
    if(username.includes('@')) throw new Error(`Usuario "${username}" no encontrado (código 404)`);
    const respuesta = await fetch(`https://api.github.com/users/${username}`);
    if(!respuesta.ok){
      if(respuesta.status===404) throw new Error(`Usuario "${username}" no encontrado (código 404)`);
      if(respuesta.status===403) throw new Error('Límite excedido (403)');
    }
    const datos = await respuesta.json();
    mostrarUsuario(datos); // avatar, nombre, repos, link, followers
    log(`Éxito: datos de "${username}" cargados correctamente.`, 'success');
  }catch(error){
    let mensaje = error.message;
    if(error instanceof TypeError && mensaje.includes('fetch')) mensaje='Fallo de conexión...';
    mostrarError(mensaje); log(`Error capturado: ${mensaje}`,'error');
  }finally{
    log('Búsqueda finalizada (bloque finally ejecutado).','info');
    btn.disabled=false; span.textContent='Buscar';
  }
}
```

- **try** muestra resultado (`mostrarUsuario`).
- **catch** valida `@` y cualquier error (404, red) → caja roja `Ocurrió un error: ...` sin romper UI.
- **finally** siempre restaura botón y loguea.

---

## Cómo probar

1. Doble clic en `index.html`.
2. Casos:
   - `leonmiguel2622` → **éxito**: `Miguel León Oliveros` · `Repositorios públicos: 7` · `· 14 seguidores · 13 siguiendo` · `Ver perfil en GitHub →` + bio `Desarrollador en desarrollo`.
   - `@leonmiguel2622` → **error** rojo `Ocurrió un error: Usuario "@leonmiguel2622" no encontrado (código 404)` (misma estética PDF pág.2).
   - `usuarioque_no_existe_12345` → 404 genérico.
   - `""` (vacío) → `Debes ingresar un nombre...`
   - Sin internet → `Fallo de conexión...`
3. **Log** (`#log`) muestra `> Iniciando fetch para "..."...` → `> Éxito / Error capturado` → `> Búsqueda finalizada (bloque finally ejecutado).` con colores `info`/`success`/`error` morados.
4. **Matrix** de fondo morado animado detrás de `.wrapper` (`z-index:1`).

---

## Créditos

Miguel León · **Try/Catch Evidencias** — 2026 — https://github.com/leonmiguel2622  
Stack: HTML5 + CSS3 (variables, gradients, animations) + JS vanilla `fetch` + `try/catch/finally`. Sin dependencias externas salvo `api.github.com`.
