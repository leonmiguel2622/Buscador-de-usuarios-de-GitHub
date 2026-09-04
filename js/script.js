const input = document.getElementById('inputUsuario');

  const btn = document.getElementById('btnBuscar');

  const resultado = document.getElementById('resultado');

  const logEl = document.getElementById('log');



  // Helper de logging — muestra en la consola visual y en consola del navegador

  function log(mensaje, tipo = 'info') {

    const linea = document.createElement('div');

    linea.className = 'log-entry ' + tipo;

    linea.textContent = '> ' + mensaje;

    logEl.appendChild(linea);

    logEl.scrollTop = logEl.scrollHeight;

    // también a consola real para depuración

    if (tipo === 'error') console.warn(mensaje);

    else if (tipo === 'success') console.log('%c' + mensaje, 'color:#7c3aed');

    else console.log(mensaje);

  }



  function mostrarCargando(username) {

    resultado.innerHTML = `<div class="loading-box"><div class="spinner"></div> Buscando usuario "${escapeHtml(username)}"... (bloque try en ejecución)</div>`;

  }



  function mostrarUsuario(datos) {

    const nombre = datos.name || datos.login;

    const avatar = datos.avatar_url;

    const repos = datos.public_repos;

    const htmlUrl = datos.html_url;

    const bio = datos.bio ? `<div class="user-extra">${escapeHtml(datos.bio)}</div>` : '';

    const followers = typeof datos.followers === 'number' ? `· ${datos.followers} seguidores · ${datos.following} siguiendo` : '';



    resultado.innerHTML = `

      <div class="user-card">

        <img class="avatar" src="${avatar}" alt="Avatar de ${escapeHtml(datos.login)}" onerror="this.src='https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png'">

        <div class="user-info">

          <h3 title="${escapeHtml(nombre)}">${escapeHtml(nombre)}</h3>

          <div class="login">@${escapeHtml(datos.login)} ${followers}</div>

          <div class="repos">Repositorios públicos: ${repos}</div>

          <a href="${htmlUrl}" target="_blank" rel="noopener noreferrer">Ver perfil en GitHub →</a>

          ${bio}

        </div>

      </div>

    `;

  }



  function mostrarError(mensaje) {

    resultado.innerHTML = `<div class="error-box">Ocurrió un error: ${escapeHtml(mensaje)}</div>`;

  }



  function escapeHtml(str) {

    return String(str).replace(/[&<>"']/g, s => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[s]));

  }



  function limpiarTodo() {

    input.value = '';

    resultado.innerHTML = `<div class="hint">Escribe un usuario de GitHub y presiona <strong>Buscar</strong>. Prueba con <code>leonmiguel2622</code> (válido) o <code>@leonmiguel2622</code> (con @ para forzar error 404).</div>`;

    logEl.innerHTML = `> Consola limpia.\n> Listo para nueva búsqueda.`;

    input.focus();

  }



  function probar(valor) {

    input.value = valor;

    buscarUsuario(valor);

  }



  /**

   * Función principal exigida por el ejercicio.

   * Maneja validación de @, fetch, errores HTTP y de red con try/catch/finally.

   * Incluye exactamente:

   *   log(`Iniciando fetch para "${username}"...`);

   *   const respuesta = await fetch(`https://api.github.com/users/${username}`);

   */

  async function buscarUsuario(username) {

    // Normalizar: si viene del input, tomar su valor; siempre trabajar con 'username' (snippet exigido)

    const raw = typeof username === 'string' ? username : input.value;

    username = String(raw).trim();



    // Bloqueo de UI

    btn.disabled = true;

    const span = btn.querySelector('.text'); if (span) span.textContent = 'Buscando...'; else btn.textContent = 'Buscando...';

    if (!username) {

      // Se deja que try lo maneje como error de validación para demostrar throw/catch

    } else {

      mostrarCargando(username);

    }



    try {

      // 1. Log inicial — snippet exigido: SIEMPRE al inicio del try para que quede registrado incluso si falla por @ (como en PDF)

      //    Captura del PDF para "@leonmiguel2622": > Iniciando fetch para "@leonmiguel2622"... > Error capturado...

      log(`Iniciando fetch para "${username}"...`);



      // 2. Validaciones con throw -> catch (evitan petición innecesaria y demuestran try/catch sin romper app)

      if (!username) {

        throw new Error('Debes ingresar un nombre de usuario.');

      }

      // Validación específica del ejercicio: el catch valida si hay @

      if (username.includes('@')) {

        // Lanzamos error con el mismo formato que el PDF muestra: código 404

        throw new Error(`Usuario "${username}" no encontrado (código 404)`);

      }

      if (username.includes(' ')) {

        throw new Error(`Usuario "${username}" no válido: no debe contener espacios.`);

      }



      // 3. Consumo de API — snippet exigido por el docente (exacto)

      //    Esta línea junto con el log anterior forman el snippet pedido:

      //    log(`Iniciando fetch para "${username}"...`);

      //    const respuesta = await fetch(`https://api.github.com/users/${username}`);

      const respuesta = await fetch(`https://api.github.com/users/${username}`);



      // 4. Manejo de errores HTTP — fetch NO rechaza en 404, por eso verificar response.ok

      if (!respuesta.ok) {

        if (respuesta.status === 404) {

          throw new Error(`Usuario "${username}" no encontrado (código 404)`);

        } else if (respuesta.status === 403) {

          throw new Error(`Límite de peticiones excedido (código 403). Intenta más tarde.`);

        } else {

          throw new Error(`Error HTTP ${respuesta.status}: ${respuesta.statusText}`);

        }

      }



      // 6. Parseo JSON (podría fallar si la respuesta no es JSON válido)

      const datos = await respuesta.json();



      // 7. Éxito — mostrar resultado

      mostrarUsuario(datos);

      log(`Éxito: datos de "${username}" cargados correctamente.`, 'success');



    } catch (error) {

      // Capturamos:

      //  - Errores de validación (throw manual por @ , vacío, espacios)

      //  - Errores HTTP lanzados arriba

      //  - Errores de red (fetch falla si no hay internet -> TypeError: Failed to fetch)

      let mensaje = error.message;



      // Mejorar mensaje para fallos de red

      if (error instanceof TypeError && mensaje.toLowerCase().includes('fetch')) {

        mensaje = `Fallo de conexión: no se pudo conectar con la API de GitHub. Verifica tu internet.`;

      }



      mostrarError(mensaje);

      log(`Error capturado: ${mensaje}`, 'error');



    } finally {

      // Siempre se ejecuta, haya éxito o error

      log('Búsqueda finalizada (bloque finally ejecutado).', 'info');

      btn.disabled = false;

      const span2 = btn.querySelector('.text'); if (span2) span2.textContent = 'Buscar'; else btn.textContent = 'Buscar';

      // Pequeño detalle: enfocar input si hubo error

    }

  }



  // Eventos

  btn.addEventListener('click', () => buscarUsuario(input.value));

  input.addEventListener('keydown', (e) => {

    if (e.key === 'Enter') buscarUsuario(input.value);

  });

  input.addEventListener('input', () => {

    // Si borra el error, no limpiar automático, solo quitar estado loading si existe

  });



  // Demo inicial opcional: precargar leonmiguel2622 para replicar screenshot 1 sin ejecutarlo automáticamente

  // Descomenta si quieres auto-cargar al abrir:

  // window.addEventListener('DOMContentLoaded', () => log('Página lista. Ejecuta una búsqueda para ver try/catch/finally en acción.'));



  console.log('%c✅ Buscador GitHub cargado. Funciones: buscarUsuario(username) con try/catch/finally', 'color:#7c3aed;font-weight:bold');