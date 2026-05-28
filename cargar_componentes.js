// ============================================
// CARGA DE COMPONENTES HTML
// ============================================
async function cargarComponente(contenedorId, rutaArchivo) {
    try {
        const url = new URL(rutaArchivo, new URL('.', window.location.href));
        const respuesta = await fetch(url.toString());
        if (!respuesta.ok) {
            throw new Error(`Error al cargar ${rutaArchivo}: ${respuesta.status}`);
        }
        const html = await respuesta.text();
        const contenedor = document.getElementById(contenedorId);
        if (contenedor) {
            contenedor.innerHTML = html;
        }
    } catch (error) {
        console.error('Error cargando componente:', error);
    }
}

// ============================================
// INICIALIZAR NAVEGACIÓN (animar entrada + hamburguesa)
// ============================================
function inicializarNavegacion() {
    const nav = document.querySelector('.barra-de-navegacion');
    if (nav) {
        // Pequeño delay para que la transición CSS sea visible
        requestAnimationFrame(() => {
            setTimeout(() => nav.classList.add('mostrar'), 50);
        });
    }

    // Menú hamburguesa (móvil)
    const hamburguesa = document.getElementById('nav-hamburguesa');
    const navLinks = document.getElementById('nav-links');
    if (hamburguesa && navLinks) {
        hamburguesa.addEventListener('click', () => {
            navLinks.classList.toggle('abierto');
        });
    }
}

// ============================================
// RESALTAR PÁGINA ACTUAL EN EL MENÚ
// ============================================
function resaltarPaginaActual() {
    const paginaActual = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.nav-link');
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && (href === paginaActual || href.endsWith(paginaActual))) {
            link.classList.add('activo');
        }
    });
}

// ============================================
// ACTUALIZAR MENÚ SEGÚN SESIÓN (placeholder)
// ============================================
function actualizarMenuSegunSesion() {
    // Lógica de autenticación - implementar según backend
    // Ejemplo: mostrar/ocultar elementos según si hay sesión activa
    const estaLogueado = sessionStorage.getItem('usuario') !== null;
    // Aquí puedes agregar lógica para mostrar botón de logout, etc.
}

// ============================================
// INICIALIZAR BUSCADOR
// ============================================
function inicializarBuscador() {
    const input = document.getElementById('buscador-input');
    const resultadosPanel = document.getElementById('buscador-resultados');
    const btnLimpiar = document.getElementById('buscador-limpiar');

    if (!input || !resultadosPanel) return;

    // Datos de búsqueda estáticos (puedes reemplazar con una llamada a API/PHP)
    const paginas = [
        { titulo: 'Inicio',        href: 'index.html',    icono: '🏠', subtitulo: 'Página principal' },
        { titulo: 'Proyectos',     href: '#',             icono: '💼', subtitulo: 'Mis trabajos y proyectos' },
        { titulo: 'Sobre mí',      href: '#',             icono: '👤', subtitulo: 'Trayectoria y experiencia' },
        { titulo: 'Contacto',      href: '#',             icono: '✉️', subtitulo: 'Ponte en contacto conmigo' },
        { titulo: 'React / Next.js', href: '#',           icono: '⚛️', subtitulo: 'Habilidad técnica' },
        { titulo: 'Node.js / Express', href: '#',         icono: '🟢', subtitulo: 'Habilidad técnica' },
        { titulo: 'GitHub',        href: 'https://github.com/abbas17', icono: '🐙', subtitulo: 'Ver portafolio' },
    ];

    function escaparRegex(texto) {
        return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    function resaltarTexto(texto, query) {
        const regex = new RegExp(`(${escaparRegex(query)})`, 'gi');
        return texto.replace(regex, '<mark>$1</mark>');
    }

    function buscar(query) {
        if (!query.trim()) {
            resultadosPanel.classList.remove('visible');
            resultadosPanel.innerHTML = '';
            if (btnLimpiar) btnLimpiar.style.display = 'none';
            return;
        }

        if (btnLimpiar) btnLimpiar.style.display = 'flex';

        const filtrados = paginas.filter(p =>
            p.titulo.toLowerCase().includes(query.toLowerCase()) ||
            p.subtitulo.toLowerCase().includes(query.toLowerCase())
        );

        if (filtrados.length === 0) {
            resultadosPanel.innerHTML = `
                <div class="buscador-sin-resultados">
                    Sin resultados para <strong>"${query}"</strong>
                </div>`;
        } else {
            resultadosPanel.innerHTML = filtrados.map(p => `
                <a class="resultado-item" href="${p.href}">
                    <div class="resultado-icono">${p.icono}</div>
                    <div class="resultado-texto">
                        <div class="resultado-titulo">${resaltarTexto(p.titulo, query)}</div>
                        <div class="resultado-subtitulo">${p.subtitulo}</div>
                    </div>
                </a>
            `).join('');
        }

        resultadosPanel.classList.add('visible');
    }

    // Eventos
    input.addEventListener('input', e => buscar(e.target.value));

    if (btnLimpiar) {
        btnLimpiar.addEventListener('click', () => {
            input.value = '';
            buscar('');
            input.focus();
        });
    }

    // Cerrar al hacer clic fuera
    document.addEventListener('click', e => {
        if (!e.target.closest('.nav-buscador')) {
            resultadosPanel.classList.remove('visible');
        }
    });

    // Navegar con teclado (Enter)
    input.addEventListener('keydown', e => {
        if (e.key === 'Escape') {
            resultadosPanel.classList.remove('visible');
            input.blur();
        }
    });
}

// ============================================
// CARGAR TODOS LOS COMPONENTES AL INICIAR
// ============================================
async function cargarTodosLosComponentes() {
    await Promise.all([
        cargarComponente('contenedor-navegacion', 'navegacion.html'),
        // cargarComponente('contenedor-pie', 'pie-pagina.html')  // descomenta cuando tengas este archivo
    ]);

    inicializarNavegacion();
    resaltarPaginaActual();
    actualizarMenuSegunSesion();
    inicializarBuscador();
}

// Iniciar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', cargarTodosLosComponentes);
