-- ============================================
-- CASO 3: EduPlatform - Plataforma de Cursos
-- ============================================

CREATE TABLE usuarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(100) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    tipo ENUM('estudiante', 'instructor', 'admin') DEFAULT 'estudiante',
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE instructores (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL UNIQUE,
    bio TEXT,
    especialidades VARCHAR(255),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

CREATE TABLE cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(200) NOT NULL,
    descripcion TEXT,
    instructor_id INT NOT NULL,
    fecha_inicio DATE,
    precio DECIMAL(10, 2) DEFAULT 0,
    portada_url VARCHAR(255),
    estado ENUM('activo', 'borrador', 'inactivo') DEFAULT 'borrador',
    FOREIGN KEY (instructor_id) REFERENCES instructores(id)
);

CREATE TABLE lecciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    curso_id INT NOT NULL,
    numero INT,
    titulo VARCHAR(200) NOT NULL,
    contenido_text TEXT,
    video_url VARCHAR(255),
    duracion_minutos INT,
    orden INT,
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE estudiantes_cursos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    curso_id INT NOT NULL,
    fecha_inscripcion DATETIME DEFAULT CURRENT_TIMESTAMP,
    progreso INT DEFAULT 0,
    estado ENUM('activo', 'completado', 'abandonado') DEFAULT 'activo',
    UNIQUE KEY (usuario_id, curso_id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (curso_id) REFERENCES cursos(id)
);

CREATE TABLE calificaciones (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    leccion_id INT NOT NULL,
    puntaje INT CHECK (puntaje BETWEEN 0 AND 100),
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id),
    FOREIGN KEY (leccion_id) REFERENCES lecciones(id)
);

CREATE TABLE comentarios (
    id INT PRIMARY KEY AUTO_INCREMENT,
    leccion_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leccion_id) REFERENCES lecciones(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- DATOS INICIALES

INSERT INTO usuarios (email, contraseña, nombre, tipo) VALUES
('instructor1@edu.com', 'pass123', 'Dr. Juan Pérez', 'instructor'),
('instructor2@edu.com', 'pass123', 'Dra. María García', 'instructor'),
('alumno1@edu.com', 'pass123', 'Carlos López', 'estudiante'),
('alumno2@edu.com', 'pass123', 'Ana Rodríguez', 'estudiante'),
('alumno3@edu.com', 'pass123', 'Luis Martínez', 'estudiante');

INSERT INTO instructores (usuario_id, bio, especialidades) VALUES
(1, 'Especialista en Python con 10 años de experiencia', 'Python, Django'),
(2, 'Experta en frontend y UX', 'React, JavaScript');

INSERT INTO cursos (nombre, descripcion, instructor_id, precio) VALUES
('Python para Principiantes', 'Aprende Python desde cero', 1, 49.99),
('React Avanzado', 'Domina React y sus frameworks', 2, 59.99),
('JavaScript ES6+', 'JavaScript moderno', 2, 44.99);

INSERT INTO lecciones (curso_id, numero, titulo, contenido_text, duracion_minutos) VALUES
(1, 1, 'Introducción a Python', 'En esta lección aprenderás...', 30),
(1, 2, 'Variables y tipos de datos', 'Variables en Python...', 45),
(2, 1, 'Componentes en React', 'Los componentes son...', 40),
(3, 1, 'ES6 Basics', 'Arrow functions, let/const...', 35);

INSERT INTO estudiantes_cursos (usuario_id, curso_id, progreso) VALUES
(3, 1, 50),
(4, 1, 75),
(5, 2, 25),
(3, 3, 100);

INSERT INTO calificaciones (usuario_id, leccion_id, puntaje) VALUES
(3, 1, 85),
(4, 1, 90),
(5, 3, 78);

INSERT INTO comentarios (leccion_id, usuario_id, texto) VALUES
(1, 3, 'Excelente explicación, muy clara'),
(1, 4, 'Necesitaba más ejemplos'),
(3, 5, 'Muy completo el tema');

CREATE INDEX idx_usuario_email ON usuarios(email);
CREATE INDEX idx_curso_instructor ON cursos(instructor_id);
CREATE INDEX idx_leccion_curso ON lecciones(curso_id);
CREATE INDEX idx_inscripcion_usuario ON estudiantes_cursos(usuario_id);
