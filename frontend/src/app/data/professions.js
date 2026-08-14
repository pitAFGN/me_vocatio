export const PROFESSIONS = [
    {
        id: "1",
        slug: "desarrollador-de-software",
        title: "Ingeniería de Software",
        area: "Tecnología & Desarrollo",
        nivelRecomendado: "Avanzado",
        desc: "Crea soluciones digitales complejas y arquitectura de sistemas innovadores.",
        demanda: "Alta",
        competencias: "JavaScript, Python, React, Next.js, Node.js, SQL/NoSQL, Git.",
        proyeccion: "Excelente crecimiento laboral con opción de trabajo remoto global."
    },
    {
        id: "2",
        slug: "disenador-ux-ui",
        title: "Diseño de Producto",
        area: "Diseño & UX",
        nivelRecomendado: "Intermedio",
        desc: "Diseña experiencias intuitivas y memorables que resuelven problemas reales de usuarios.",
        demanda: "Media-Alta",
        competencias: "Figma, Prototipado interactivo, Investigación de usuarios, Design Systems.",
        proyeccion: "Alta demanda en startups, agencias digitales y empresas de tecnología."
    },
    {
        id: "3",
        slug: "analista-de-datos",
        title: "Ciencia de Datos",
        area: "Análisis de Datos",
        nivelRecomendado: "Intermedio",
        desc: "Analiza patrones complejos y transforma datos crudos para predecir tendencias y apoyar decisiones.",
        demanda: "Alta",
        competencias: "SQL, Python, Power BI, Excel Avanzado, Estadística descriptiva.",
        proyeccion: "Crecimiento sostenido en todos los sectores empresariales en proceso de digitalización."
    },
    {
        id: "4",
        slug: "arquitectura-cloud",
        title: "Arquitectura Cloud",
        area: "Infraestructura IT",
        nivelRecomendado: "Avanzado",
        desc: "Diseña y gestiona soluciones escalables, eficientes y seguras en la nube.",
        demanda: "Alta",
        competencias: "AWS, Azure, GCP, Docker, Kubernetes, Terraform.",
        proyeccion: "Sectores corporativos en constante migración a arquitecturas serverless y nube."
    },
    {
        id: "5",
        slug: "ciberseguridad",
        title: "Ciberseguridad",
        area: "Seguridad Digital",
        nivelRecomendado: "Avanzado",
        desc: "Protege activos digitales, redes y aplicaciones contra amenazas y vulnerabilidades críticas.",
        demanda: "Alta",
        competencias: "Redes, Ethical Hacking, Linux, Auditoría de seguridad, Protocolos de cifrado.",
        proyeccion: "Sectores financiero, corporativo y gubernamental con salarios altamente competitivos."
    },
    {
        id: "6",
        slug: "desarrollo-ia",
        title: "Desarrollo de IA",
        area: "Inteligencia Artificial",
        nivelRecomendado: "Avanzado",
        desc: "Desarrolla modelos de aprendizaje automático, redes neuronales y soluciones basadas en IA.",
        demanda: "Alta",
        competencias: "Python, PyTorch, TensorFlow, NLP, Computer Vision, MLOps.",
        proyeccion: "Uno de los campos de mayor expansión y transformación tecnológica del mercado actual."
    },
    {
        id: "7",
        slug: "desarrollo-backend",
        title: "Desarrollo Backend",
        area: "Tecnología",
        nivelRecomendado: "Avanzado",
        desc: "Domina la lógica del servidor, API REST/GraphQL y la gestión de bases de datos robustas.",
        demanda: "Alta",
        competencias: "Node.js, Python/FastAPI, Go, PostgreSQL, Redis, Microservicios.",
        proyeccion: "Rol fundamental en cualquier arquitectura de software a escala de producción."
    },
    {
        id: "8",
        slug: "especialista-frontend",
        title: "Especialista Frontend",
        area: "Desarrollo Web",
        nivelRecomendado: "Intermedio",
        desc: "Crea interfaces visuales impactantes, dinámicas, accesibles y de alto rendimiento.",
        demanda: "Alta",
        competencias: "React, Next.js, TypeScript, Tailwind CSS, Performance & Web Vitals.",
        proyeccion: "Sostenida por la constante necesidad de mejores productos orientados al cliente."
    },
    {
        id: "9",
        slug: "desarrollo-movil",
        title: "Desarrollo Móvil",
        area: "Apps Móviles",
        nivelRecomendado: "Intermedio",
        desc: "Construye experiencias nativas y multiplataforma fluidas para dispositivos iOS y Android.",
        demanda: "Alta",
        competencias: "React Native, Flutter, Swift, Kotlin, Publicación en Stores.",
        proyeccion: "Alta demanda en empresas de consumo masivo, fintechs y startups."
    },
    {
        id: "10",
        slug: "administracion-db",
        title: "Administración DB",
        area: "Datos",
        nivelRecomendado: "Avanzado",
        desc: "Optimiza, asegura y garantiza la alta disponibilidad e integridad de grandes volúmenes de datos.",
        demanda: "Media-Alta",
        competencias: "PostgreSQL, MySQL, MongoDB, Tiling, Replicación, Tuning de queries.",
        proyeccion: "Esencial en empresas con manejo masivo de transacciones y datos sensibles."
    },
    {
        id: "11",
        slug: "devops-engineer",
        title: "DevOps Engineer",
        area: "Infraestructura",
        nivelRecomendado: "Avanzado",
        desc: "Automatiza procesos de integración/despliegue continuo (CI/CD) e infraestructura.",
        demanda: "Alta",
        competencias: "GitLab CI/GitHub Actions, Docker, Kubernetes, Bash, Observabilidad.",
        proyeccion: "Posición clave para acelerar el ciclo de entrega de productos de software."
    },
    {
        id: "12",
        slug: "ingenieria-de-redes",
        title: "Ingeniería de Redes",
        area: "Sistemas",
        nivelRecomendado: "Intermedio",
        desc: "Diseña, implementa y mantiene infraestructuras de comunicación empresarial seguras.",
        demanda: "Media-Alta",
        competencias: "Routing & Switching, Firewalls, VPNs, Cisco/MikroTik, Protocolos TCP/IP.",
        proyeccion: "Indispensable en empresas de telecomunicaciones, data centers y multinacionales."
    }
];

/**
 * Helper para buscar una vocación por slug o id
 * @param {string|number} key - Slug o ID de la profesión
 */
export const getProfessionById = (key) => {
    if (!key) return null;
    return PROFESSIONS.find(
        (item) => item.slug === String(key) || String(item.id) === String(key)
    );
};