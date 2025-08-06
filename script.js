
const malla = {
  "Semestre 1": ["Biología Celular", "Laboratorio Biología Celular", "Anatomía Humana", "Psicología General", "Introducción a la Terapia Ocupacional", "Formación Integral I"],
  "Semestre 2": ["Neuroanatomía", "Laboratorio Neuroanatomía", "Introducción a la Física", "Psicología Evolutiva", "Fundamentos de Terapia Ocupacional", "Formación Integral II"],
  "Semestre 3": ["Anatomía Aplicada", "Fisiopatología", "Pediatría", "Psicología Social", "Epidemiología e Infecciones Asociadas a la Atención en Salud", "Destrezas Terapéuticas I", "Formación Integral III"],
  "Semestre 4": ["Patología I", "Neuropsiquiatría Infantil", "Socioantropología", "Salud Mental y Psiquiatría", "Destrezas Terapéuticas II", "Bioestadística", "Formación Integral IV"],
  "Semestre 5": ["Patología II", "Psicopatología", "Ortótica y Adaptaciones I", "Terapia Ocupacional para la Inclusión I", "Destrezas Terapéuticas III", "Marcos Conceptuales en Terapia Ocupacional"],
  "Semestre 6": ["Salud Ocupacional y Ergonomía", "Terapia Ocupacional para la Inclusión II", "Destrezas Terapéuticas IV", "Ortótica y Adaptaciones II", "Procesos Evaluativos", "Metodología de la Investigación I"],
  "Semestre 7": ["Gerontología y Geriatría", "Terapia Ocupacional en Salud Física del Adulto I", "Terapia Ocupacional en Niños y Adolescentes I", "Terapia Ocupacional en el Área Psicosocial I", "Metodología de la Investigación II"],
  "Semestre 8": ["Terapia Ocupacional en Salud Física del Adulto II", "Terapia Ocupacional en Niños y Adolescentes II", "Terapia Ocupacional en el Área Psicosocial II", "Salud Pública, Administración y Gestión en Salud", "Seminario de Investigación", "Bioética"],
  "Semestre 9": ["Práctica Profesional I", "Práctica Profesional II"],
  "Semestre 10": ["Práctica Profesional III", "Práctica Profesional IV", "Examen de Título"]
};

const requisitos = {
  "Neuroanatomía": ["Biología Celular"],
  "Anatomía Aplicada": ["Anatomía Humana"],
  "Patología I": ["Fisiopatología"],
  "Psicopatología": ["Psicología Evolutiva", "Psicología Social"],
  "Ortótica y Adaptaciones II": ["Ortótica y Adaptaciones I"],
  "Terapia Ocupacional para la Inclusión II": ["Terapia Ocupacional para la Inclusión I"],
  "Terapia Ocupacional en Salud Física del Adulto II": ["Terapia Ocupacional en Salud Física del Adulto I"],
  "Terapia Ocupacional en Niños y Adolescentes II": ["Terapia Ocupacional en Niños y Adolescentes I"],
  "Terapia Ocupacional en el Área Psicosocial II": ["Terapia Ocupacional en el Área Psicosocial I"],
  "Práctica Profesional II": ["Práctica Profesional I"],
  "Práctica Profesional IV": ["Práctica Profesional III"],
  "Examen de Título": ["Práctica Profesional I", "Práctica Profesional II", "Práctica Profesional III", "Práctica Profesional IV"]
};

const aprobados = new Set(JSON.parse(localStorage.getItem("aprobados")) || []);

function guardarEstado() {
  localStorage.setItem("aprobados", JSON.stringify([...aprobados]));
}

function crearMalla() {
  const contenedor = document.getElementById("malla-container");
  contenedor.innerHTML = "";

  for (let [semestre, ramos] of Object.entries(malla)) {
    const col = document.createElement("div");
    col.className = "semestre";

    const titulo = document.createElement("h2");
    titulo.textContent = semestre;
    col.appendChild(titulo);

    ramos.forEach(ramo => {
      const div = document.createElement("div");
      div.textContent = ramo;
      div.className = "ramo";

      const prereqs = requisitos[ramo] || [];
      const bloqueado = prereqs.some(req => !aprobados.has(req));

      if (aprobados.has(ramo)) {
        div.classList.add("aprobado");
      } else if (bloqueado) {
        div.classList.add("bloqueado");
      }

      div.addEventListener("click", () => {
        if (bloqueado && !aprobados.has(ramo)) {
          alert(`Para aprobar "${ramo}" primero debes aprobar:
- ${prereqs.filter(req => !aprobados.has(req)).join("
- ")}`);
          return;
        }

        if (aprobados.has(ramo)) {
          aprobados.delete(ramo);
        } else {
          aprobados.add(ramo);
        }

        guardarEstado();
        crearMalla();
      });

      col.appendChild(div);
    });

    contenedor.appendChild(col);
  }
}

crearMalla();
