document.addEventListener('DOMContentLoaded', () => {
    const cursos = document.querySelectorAll('.curso');
    const storageKey = 'malla_mona_monita_aprobados';

    // Definición de los requisitos de los ramos
    const requisitos = {
        's2-1': ['s1-1', 's1-2'], // Neurociencias requiere Biologia Celular y su Lab
        's2-2': ['s1-3', 's1-4'], // Neuroanatomia requiere Anatomía Humana y su Lab
        's2-4': ['s1-7'], // Fundamentos de TO requiere Introducción a TO
        's3-2': ['s2-2'], // Lab Neuroanatomia requiere Neuroanatomia
        's3-4': ['s2-4'], // Marcos Conceptuales requiere Fundamentos de TO
        's3-6': ['s2-5'], // Metodologia de la Investigación I requiere Bioestadística
        's4-2': ['s1-3', 's1-4'], // Anatomia Aplicada requiere Anatomia Humana y su Lab
        's4-4': ['s3-4'], // Procesos Evaluativos requiere Marcos Conceptuales en TO
        's4-5': ['s1-7'], // Destrezas Terapéuticas requiere Introducción a TO
        's4-6': ['s3-6'], // Metodologia de la Investigación II requiere Metodologia de la Investigación I
        's5-1': ['s4-1'], // TO en Salud Fisica del Adulto requiere Fisiopatologia
        's5-2': ['s4-2'], // Ortótica y Adaptaciones I requiere Anatomia Aplicada
        's5-3': ['s1-6', 's2-3', 's3-3'], // Salud Mental y Psiquiatria requiere Psicología General, Psicología Evolutiva y Psicología Social
        's5-4': ['s4-4'], // TO en Niños y Adolescentes requiere Procesos Evaluativos
        's5-5': ['s4-4'], // TO en Area Psicosocial requiere Procesos Evaluativos
        's5-6': ['s4-5'], // Destrezas Terapéuticas II requiere Destrezas Terapéuticas
        's6-1': ['s5-1'], // TO en Salud Fisica del Adulto II requiere TO en Salud Fisica del Adulto
        's6-2': ['s5-2'], // Ortótica y Adaptaciones II requiere Ortótica y Adaptaciones I
        's6-3': ['s5-3'], // Psicopatologia requiere Salud Mental y Psiquiatria
        's6-4': ['s5-4'], // TO en Niños y Adolescentes II requiere TO en Niños y Adolescentes
        's6-5': ['s5-5'], // TO en Area Psicosocial II requiere TO en Area Psicosocial
        's6-6': ['s5-6'], // Destrezas Terapéuticas III requiere Destrezas Terapéuticas II
        's6-7': ['s4-6'], // Seminario de Investigación requiere Metodologia de la Investigación II
        's7-1': ['s6-1'], // Salud Ocupacional y Ergonomla requiere TO en Salud Fisica del Adulto II
        's7-2': ['s6-4'], // Pediatria requiere TO en Niños y Adolescentes II
        's7-3': ['s6-5'], // Neuropsiquiatria Infantil requiere TO en Area Psicosocial II
        's7-4': ['s6-6'], // Destrezas Terapéuticas IV requiere Destrezas Terapéuticas III
        's7-6': ['s6-1', 's6-4', 's6-5'], // Práctica Profesional I requiere TO en Salud Fisica del Adulto II, TO en Niños y Adolescentes II, TO en Area Psicosocial II
        's8-1': ['s7-1'], // Gerontologia y Geriatria requiere Salud Ocupacional y Ergonomla
        's8-2': ['s7-2', 's7-3'], // TO para la Inclusión I requiere Pediatria y Neuropsiquiatria Infantil
        's8-3': ['s7-4'], // Patologia II requiere Destrezas Terapéuticas IV
        's8-4': ['s7-6'], // Práctica Profesional II requiere Práctica Profesional I
        's9-1': ['s8-1'], // TO en Adulto Mayor requiere Gerontologia y Geriatria
        's9-2': ['s8-2'], // TO para la Inclusión II requiere TO para la Inclusión I
        's9-3': ['s8-4'], // Práctica Profesional III requiere Práctica Profesional II
        's10-1': ['s9-3'], // Práctica Profesional IV requiere Práctica Profesional III
        's10-2': ['s10-1'], // Examen de Titulo requiere Práctica Profesional IV
    };

    // Cargar el estado de los ramos guardado en el navegador
    const aprobados = JSON.parse(localStorage.getItem(storageKey)) || [];

    function cargarEstado() {
        cursos.forEach(curso => {
            const id = curso.dataset.id;
            if (aprobados.includes(id)) {
                curso.classList.add('aprobado');
            }
        });
        actualizarBloqueados();
    }

    function actualizarBloqueados() {
        cursos.forEach(curso => {
            const id = curso.dataset.id;
            const prereq = requisitos[id] || [];
            const cumpleRequisitos = prereq.every(reqId => aprobados.includes(reqId));
            
            if (!cumpleRequisitos && !aprobados.includes(id)) {
                curso.classList.add('bloqueado');
            } else {
                curso.classList.remove('bloqueado');
            }
        });
    }

    function guardarEstado() {
        const aprobadosIds = [];
        document.querySelectorAll('.curso.aprobado').forEach(curso => {
            aprobadosIds.push(curso.dataset.id);
        });
        localStorage.setItem(storageKey, JSON.stringify(aprobadosIds));
        aprobados.length = 0;
        aprobadosIds.forEach(id => aprobados.push(id));
        actualizarBloqueados();
    }

    cursos.forEach(curso => {
        curso.addEventListener('click', (e) => {
            const id = e.target.dataset.id;

            if (e.target.classList.contains('aprobado')) {
                // Desmarcar como aprobado si ya lo estaba
                e.target.classList.remove('aprobado');
                guardarEstado();
                return;
            }

            // Comprobar requisitos antes de aprobar
            const prereq = requisitos[id] || [];
            const cumpleRequisitos = prereq.every(reqId => {
                return aprobados.includes(reqId);
            });

            if (cumpleRequisitos) {
                e.target.classList.add('aprobado');
                guardarEstado();
            } else {
                const faltantes = prereq.filter(reqId => !aprobados.includes(reqId));
                const nombresFaltantes = faltantes.map(reqId => document.querySelector(`.curso[data-id="${reqId}"]`).textContent);
                alert(`No puedes aprobar este ramo. Debes aprobar primero: ${nombresFaltantes.join(', ')}`);
            }
        });
    });

    cargarEstado();
});
