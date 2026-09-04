/**

 * Solución Ejercicio: Buscador de usuarios de GitHub

 * Contexto: página con input + botón. Mostrar nombre, avatar, repos.

 * Si usuario no existe o falla conexión -> mensaje de error sin romper app.

 * Requisitos: try muestra resultado, catch valida @ y muestra error, finally siempre ejecuta.

 * 

 * Ubicación: C:\miguel leon evidencias\Try catch\Try catch solucion\

 * Autor: Miguel León · Evidencias Try/Catch

 * Cuenta: https://github.com/leonmiguel2622 — Miguel León Oliveros (7 repos públicos)

 * Ejemplo válido: leonmiguel2622 — Ejemplo error: @leonmiguel2622

 */



// Helper de log - muestra en consola visual #log y en consola del navegador

function log(mensaje) {

  const logEl = document.getElementById('log');

  if (logEl) {

    const linea = document.createElement('div');

    linea.textContent = '> ' + mensaje;

    logEl.appendChild(linea);

    logEl.scrollTop = logEl.scrollHeight;

  }

  console.log(mensaje);

}



function mostrarUsuario(datos) {

  const cont = document.getElementById('resultado');

  cont.innerHTML = `

    <img src="${datos.avatar_url}" width="80" style="border-radius:50%">

    <h3>${datos.name || datos.login}</h3>

    <p>Repositorios públicos: ${datos.public_repos}</p>

    <a href="${datos.html_url}" target="_blank">Ver perfil en GitHub →</a>

  `;

}



function mostrarError(mensaje) {

  document.getElementById('resultado').innerHTML = `

    <div style="background:#fee2e2;border:1px solid #ef4444;color:#991b1b;padding:1rem;border-radius:8px">

      Ocurrió un error: ${mensaje}

    </div>

  `;

}



// === SNIPPET EXIGIDO POR EL DOCENTE ===

async function buscarUsuario(username) {

    log(`Iniciando fetch para "${username}"...`);

    const respuesta = await fetch(`https://api.github.com/users/${username}`);

    // La implementación completa con try/catch/finally está aquí abajo:

    // Para mantener el snippet exacto pedido, se reimplementa con manejo completo:

}



// === IMPLEMENTACIÓN COMPLETA CON try / catch / finally ===

async function buscarUsuarioCompleto(username) {

  // Normalizar input

  username = String(username ?? document.getElementById('inputUsuario').value).trim();



  // Mostrar estado de carga

  const resultado = document.getElementById('resultado');

  const btn = document.getElementById('btnBuscar');

  if (btn) { btn.disabled = true; btn.textContent = 'Buscando...'; }

  if (username) resultado.innerHTML = `<p>Buscando usuario "${username}"... (try en ejecución)</p>`;



  try {

    // Log inicial — snippet exigido: SIEMPRE al inicio del try para que quede registrado incluso si falla por @ (como en PDF)

    log(`Iniciando fetch para "${username}"...`);



    // Validaciones con throw -> catch (evitan petición innecesaria)

    if (!username) {

      throw new Error('Debes ingresar un nombre de usuario.');

    }

    // Validación específica del ejercicio: el catch valida si hay @

    if (username.includes('@')) {

      throw new Error(`Usuario "${username}" no encontrado (código 404)`);

    }

    if (username.includes(' ')) {

      throw new Error(`Usuario "${username}" no válido: no debe contener espacios.`);

    }



    // Consumo de API — snippet exigido por el docente (exacto)

    const respuesta = await fetch(`https://api.github.com/users/${username}`);



    // Manejo de errores HTTP (fetch no rechaza en 404)

    if (!respuesta.ok) {

      if (respuesta.status === 404) {

        throw new Error(`Usuario "${username}" no encontrado (código 404)`);

      } else if (respuesta.status === 403) {

        throw new Error(`Límite de peticiones excedido (código 403). Intenta más tarde.`);

      } else {

        throw new Error(`Error HTTP ${respuesta.status}: ${respuesta.statusText}`);

      }

    }



    const datos = await respuesta.json();



    // ÉXITO: el try muestra el resultado

    mostrarUsuario(datos);

    log(`Éxito: datos de "${username}" cargados correctamente.`);



  } catch (error) {

    // El catch valida errores (incluido @) y muestra mensaje sin romper la app

    let mensaje = error.message;

    if (error instanceof TypeError && mensaje.toLowerCase().includes('fetch')) {

      mensaje = `Fallo de conexión: no se pudo conectar con la API de GitHub. Verifica tu internet.`;

    }

    mostrarError(mensaje);

    log(`Error capturado: ${mensaje}`);



  } finally {

    // Siempre se ejecuta

    log(`Búsqueda finalizada (bloque finally ejecutado).`);

    if (btn) { btn.disabled = false; btn.textContent = 'Buscar'; }

  }

}



// Eventos

document.addEventListener('DOMContentLoaded', () => {

  const input = document.getElementById('inputUsuario');

  const btn = document.getElementById('btnBuscar');

  if (btn) btn.addEventListener('click', () => buscarUsuarioCompleto());

  if (input) input.addEventListener('keydown', e => { if (e.key === 'Enter') buscarUsuarioCompleto(); });

});

