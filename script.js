document.addEventListener('DOMContentLoaded', () => {
    const cursos = document.querySelectorAll('.curso');
    const storageKey = 'malla_mona_monita_aprobados';

    // Definición de los requisitos de los ramos según la malla actualizada
    const requisitos = {
        's2-1': ['s1-3', 's1-4'], // Neuroanatomía requiere Anatomía Humana y su Lab
        's2-2': ['s2-1'], // Lab Neuroanatomía requiere Neuroanatomía
        's2-3': ['s1-3', 's1-4'], // Anatomía Aplicada requiere Anatomía Humana y su Lab
        's2-5': ['s1-7'], // Fundamentos de Terapia Ocupacional requiere Introducción a la TO
        's3-1': ['s1-1', 's1-2'], // Neurociencias requiere Biología Celular y su Lab
        's3-2': ['s1-5'], // Fisiopatología requiere Introducción a la Física
        's3-3': ['s1-6'], // Psicología Social requiere Psicología General
        's3-4': ['s2-6'], // Epidemiología requiere Bioestadística
        's3-5': ['s1-7'], // Destrezas Terapéuticas I requiere Introducción a la TO
        's3-6': ['s2-5'], // Marcos Conceptuales requiere Fundamentos de Terapia Ocupacional
        's4-1': ['s3-1'], // Patología I requiere Neurociencias
        's4-2': ['s3-3'], // Socioantropología requiere Psicología Social
        's4-3': ['s3-5'], // Destrezas Terapéuticas II requiere Destrezas Terapéuticas I
        's4-4': ['s3-6'], // Procesos Evaluativos requiere Marcos Conceptuales
        's4-5': ['s3-4'], // Salud Pública requiere Epidemiología
        's5-1': ['s2-3'], // Ortótica y Adaptaciones I requiere Anatomía Aplicada
        's5-2': ['s4-1'], // Patología II requiere Patología I
        's5-3': ['s4-4'], // Pediatría requiere Procesos Evaluativos
        's5-4': ['s1-6', 's2-4', 's3-3'], // Salud Mental requiere Psicología Gral, Evolutiva y Social
        's5-5': ['s4-3'], // Destrezas Terapéuticas III requiere Destrezas Terapéuticas II
        's6-1': ['s5-1'], // Ortótica y Adaptaciones II requiere Ortótica y Adaptaciones I
        's6-2': ['s4-5'], // Salud Ocupacional requiere Salud Pública
        's6-3': ['s5-4'], // Neuropsiquiatría Infantil requiere Salud Mental
        's6-4': ['s5-4'], // Psicopatología requiere Salud Mental
        's6-5': ['s5-5'], // Destrezas Terapéuticas IV requiere Destrezas Terapéuticas III
        's6-6': ['s3-4'], // Metodología de la Investigación I requiere Epidemiología
        's7-1': ['s3-2'], // TO en Salud Física Adulto I requiere Fisiopatología
        's7-2': ['s6-2'], // Gerontología y Geriatría requiere Salud Ocupacional
        's7-3': ['s4-4'], // TO en Niños y Adolescentes I requiere Procesos Evaluativos
        's7-4': ['s4-4'], // TO en Área Psicosocial I requiere Procesos Evaluativos
        's7-5': ['s6-3'], // TO para la Inclusión I requiere Neuropsiquiatría Infantil
        's7-6': ['s6-6'], // Metodología de la Investigación II requiere Metodología de la Investigación I
        's8-1': ['s7-1'], // TO en Salud Física Adulto II requiere TO en Salud Física Adulto I
        's8-2': ['s7-2'], // TO en Adulto Mayor requiere Gerontología y Geriatría
        's8-3': ['s7-3'], // TO en Niños y Adolescentes II requiere TO en Niños y Adolescentes I
        's8-4': ['s7-4'], // TO en Área Psicosocial II requiere TO en Área Psicosocial I
        's8-5': ['s7-5'], // TO para la Inclusión II requiere TO para la Inclusión I
        's8-6': ['s7-6'], // Seminario de Investigación requiere Metodología de la Investigación II
        's9-1': ['s8-1', 's8-3', 's8-4'], // Práctica Profesional I requiere TO en Salud Física II, Niños II y Psicosocial II
        's9-2': ['s9-1'], // Práctica Profesional II requiere Práctica Profesional I
        's10-1': ['s9-2'], // Práctica Profesional III requiere Práctica Profesional II
        's10-2': ['s10-1'], // Práctica Profesional IV requiere Práctica Profesional III
        's10-3': ['s10-2'], // Examen de Título requiere Práctica Profesional IV
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
                e.target.classList.remove('aprobado');
                guardarEstado();
                return;
            }

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
