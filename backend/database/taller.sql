CREATE TABLE IF NOT EXISTS taller (
    id_taller INT PRIMARY KEY AUTO_INCREMENT,
    nombre_taller VARCHAR(100) NOT NULL,
    direccion_taller VARCHAR(200) NOT NULL,
    id_usuario INT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

-- Insertar algunos talleres de ejemplo
INSERT INTO taller (nombre_taller, direccion_taller) VALUES
('Taller Mecánico Santiago', 'Av. 27 de Febrero #123, Santiago'),
('Auto Servicio Express', 'Calle El Sol #45, Santiago'),
('Taller Hermanos Pérez', 'Av. Estrella Sadhalá #78, Santiago'),
('Centro Automotriz RD', 'Av. Las Carreras #234, Santiago'),
('Mecánica Rápida', 'Calle Del Sol #56, Santiago'); 