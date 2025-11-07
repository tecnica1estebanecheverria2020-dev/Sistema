-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 30-10-2025 a las 22:47:28
-- Versión del servidor: 10.4.32-MariaDB
-- Versión de PHP: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `eestn1`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `inventory`
--

CREATE TABLE `inventory` (
  `id_inventory` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `code` varchar(255) DEFAULT NULL,
  `category` varchar(100) NOT NULL,
  `amount` int(11) DEFAULT 0,
  `available` int(11) DEFAULT 0,
  `state` enum('Disponible','Mantenimiento','No disponible') NOT NULL DEFAULT 'Disponible',
  `location` varchar(100) DEFAULT NULL,
  `description` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `inventory` (`id_inventory`, `name`, `code`, `category`, `amount`, `available`, `state`, `location`, `description`) VALUES
(1, 'Martillo', '2', 'Herramienta', 5, 2, 'Disponible', 'Pañol', NULL),
(5, 'Net', 'ASFS', 'Computadoras', 2, 2, 'Mantenimiento', 'Atras', 'DEscriptcion');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `loans`
--

CREATE TABLE `loans` (
  `id_loan` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_inventory` int(11) NOT NULL,
  `quantity` int(11) DEFAULT 1,
  `applicant` varchar(100) DEFAULT NULL,
  `date_loan` datetime DEFAULT current_timestamp(),
  `date_return` datetime DEFAULT NULL,
  `state` enum('activo','devuelto') DEFAULT 'activo',
  `observations_loan` text DEFAULT NULL,
  `observations_return` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `roles`
--

CREATE TABLE `roles` (
  `id_role` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_role`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `roles` (`id_role`, `name`) VALUES
(1, 'EMTP Server'),
(2, 'EMTP Pañol'),
(3, 'EMPT Laboratorio'),
(4, 'Bibliotecario'),
(5, 'Profesor'),
(6, 'Jefe_Area'),
(7, 'Directivo');


CREATE TABLE `users_roles` (
  `id_user_roles` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL,
  `id_role` int(11) NOT NULL,
  PRIMARY KEY (`id_user_roles`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `users_roles` (`id_user_roles`, `id_user`, `id_role`) VALUES
(1, 1, 1),
(2, 1, 2),
(3, 1, 3),
(4, 1, 4),
(5, 1, 5),
(6, 1, 6),
(7, 1, 7);

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (  
  `id_user` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lock_until` datetime DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `tel` VARCHAR(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


INSERT INTO `users` (`id_user`, `email`, `name`, `password`, `lock_until`, `failed_attempts`, `active`, `tel`, `created_at`) VALUES
(1, 'admin@radiopad.com', 'Cuenta Admin', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '1234567890', '2025-10-30 22:47:28');



CREATE TABLE `schedules` (
  `id_schedule` int(11) NOT NULL,
  `id_classroom` int(11) NOT NULL,
  `id_workshop_group` int(11) NOT NULL,
  `id_subject_user` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` TIME NOT NULL,
  `end_time` TIME NOT NULL,
  `shift` enum('Mañana','Tarde') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;


CREATE TABLE `classroom` (
  `id_classroom` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  PRIMARY KEY (`id_classroom`),
  UNIQUE KEY `uq_classroom_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `classroom` (`name`) VALUES
('AULA 1'),('AULA 2'),('AULA 3'),('AULA 4'),('AULA 5'),('AULA 6'),('AULA 7'),('AULA 8'),
('AULA 9'),('AULA 10'),('AULA 11'),('AULA 12'),('AULA 13'),('AULA 14'),('AULA 15'),
('AULA 16'),('AULA 17'),('AULA 18'),('AULA 19'),('AULA 20'),('AULA 21'),
('TALLER GRANDE'),('LABORATORIO');


CREATE TABLE `workshop_group` (
  `id_workshop_group` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(10) NOT NULL,
  PRIMARY KEY (`id_workshop_group`),
  UNIQUE KEY `uq_workshop_group_name` (`name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `workshop_group` (`name`) VALUES
('1.1'),('1.2'),('1.3'),('1.4'),('1.5'),
('2.1'),('2.2'),('2.3'),('2.4'),('2.5'),
('3.1'),('3.2'),('3.3'),('3.4'),('3.5'),('3.6'),('3.7'),
('4.1'),('4.2'),('4.3'),('4.4'),('4.5'),
('5.1'),('5.2'),('5.3'),('5.4'),('5.5'),
('6.1'),('6.2'),('6.3'),('6.4'),('6.5'),
('7.1'),('7.2'),('7.3'),('7.4'),('7.5');


CREATE TABLE `subject` (
  `id_subject` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id_subject`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `subject` (`id_subject`, `name`) VALUES
(1, 'Matemáticas'),
(2, 'Física'),
(3, 'Química'),
(4, 'Biología'),
(5, 'Historia'),
(6, 'Programacion');

CREATE TABLE `subject_user` (
  `id_subject_user` int(11) NOT NULL AUTO_INCREMENT,
  `id_subject` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  PRIMARY KEY (`id_subject_user`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

INSERT INTO `subject_user` (`id_subject_user`, `id_subject`, `id_user`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1);

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `inventory`
--
ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id_inventory`);

--
-- Indices de la tabla `loans`
--
ALTER TABLE `loans`
  ADD PRIMARY KEY (`id_loan`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_inventory` (`id_inventory`);

--
-- Indices de la tabla `roles`
--
-- PK ya definido en CREATE TABLE `roles` (no se requiere ALTER)
-- ALTER TABLE `roles`
--   ADD PRIMARY KEY (`id_role`);

--
-- Indices de la tabla `schedules`
--
ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id_schedule`);


-- ------

ALTER TABLE `users_roles`
  -- ADD PRIMARY KEY (`id_user_roles`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_role` (`id_role`);

-- ------
--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);


-- ------------------

-- PK ya definido en CREATE TABLE `subject`
-- ALTER TABLE `subject`
--   ADD PRIMARY KEY (`id_subject`);

-- ------------------
ALTER TABLE `subject_user`
  -- ADD PRIMARY KEY (`id_subject_user`),
  ADD KEY `id_subject` (`id_subject`),
  ADD KEY `id_user` (`id_user`);

-- ------------------
--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `inventory`
--
ALTER TABLE `inventory`
  MODIFY `id_inventory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `loans`
--
ALTER TABLE `loans`
  MODIFY `id_loan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de la tabla `roles`
--
ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `schedules`
--
ALTER TABLE `schedules`
  MODIFY `id_schedule` int(11) NOT NULL AUTO_INCREMENT;

-- Índices para llaves foráneas en schedules
ALTER TABLE `schedules`
  ADD KEY `id_classroom` (`id_classroom`),
  ADD KEY `id_workshop_group` (`id_workshop_group`),
  ADD KEY `id_subject_user` (`id_subject_user`);

-- Índice único para evitar duplicados exactos de horarios
ALTER TABLE `schedules`
  ADD UNIQUE KEY `uq_schedules_composite` (`id_classroom`, `id_workshop_group`, `id_subject_user`, `day_of_week`, `start_time`, `end_time`, `shift`);

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `loans`
--
ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`id_inventory`) REFERENCES `inventory` (`id_inventory`) ON DELETE CASCADE ON UPDATE CASCADE;

-- FKs para subject_user
ALTER TABLE `subject_user`
  ADD CONSTRAINT `subject_user_fk_subject` FOREIGN KEY (`id_subject`) REFERENCES `subject` (`id_subject`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subject_user_fk_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

-- FKs para schedules
ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_fk_classroom` FOREIGN KEY (`id_classroom`) REFERENCES `classroom` (`id_classroom`) ON UPDATE CASCADE,
  ADD CONSTRAINT `schedules_fk_workshop_group` FOREIGN KEY (`id_workshop_group`) REFERENCES `workshop_group` (`id_workshop_group`) ON UPDATE CASCADE,
  ADD CONSTRAINT `schedules_fk_subject_user` FOREIGN KEY (`id_subject_user`) REFERENCES `subject_user` (`id_subject_user`) ON UPDATE CASCADE;

--
-- Filtros para la tabla `users`
--

INSERT INTO `users` (`id_user`, `email`, `name`, `password`, `lock_until`, `failed_attempts`, `active`, `tel`, `created_at`) VALUES
(2, 'ana.garcia@escuela.com', 'Ana García', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '111222333', NOW()),
(3, 'carlos.perez@escuela.com', 'Carlos Pérez', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '222333444', NOW()),
(4, 'lucia.gomez@escuela.com', 'Lucía Gómez', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '333444555', NOW()),
(5, 'martin.rodriguez@escuela.com', 'Martín Rodríguez', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '444555666', NOW()),
(6, 'sofia.lopez@escuela.com', 'Sofía López', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '555666777', NOW()),
(7, 'diego.sanchez@escuela.com', 'Diego Sánchez', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '666777888', NOW()),
(8, 'valentina.ramos@escuela.com', 'Valentina Ramos', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '777888999', NOW());

INSERT INTO `users_roles` (`id_user`, `id_role`) VALUES
(2, 5), (3, 5), (4, 5), (5, 5), (6, 5), (7, 5), (8, 5);

INSERT INTO `inventory` (`id_inventory`, `name`, `code`, `category`, `amount`, `available`, `state`, `location`, `description`) VALUES
(2, 'Destornillador', 'DST-001', 'Herramienta', 10, 8, 'Disponible', 'Pañol', 'Juego de destornilladores'),
(3, 'Taladro', 'TLR-045', 'Herramienta', 4, 3, 'Disponible', 'Pañol', 'Taladro percutor'),
(4, 'Osciloscopio', 'OSC-200', 'Laboratorio', 2, 2, 'Disponible', 'Laboratorio', 'Osciloscopio digital'),
(6, 'Multímetro', 'MLT-120', 'Laboratorio', 6, 5, 'Disponible', 'Laboratorio', 'Multímetro de precisión');

INSERT INTO `subject_user` (`id_subject_user`, `id_subject`, `id_user`) VALUES
(7, 1, 2), (8, 2, 2),
(9, 6, 3), (10, 5, 3),
(11, 3, 4), (12, 4, 4),
(13, 2, 5), (14, 6, 5),
(15, 1, 6), (16, 5, 6),
(17, 4, 7), (18, 3, 7),
(19, 1, 8), (20, 6, 8);

INSERT INTO `schedules` (`id_classroom`, `id_workshop_group`, `id_subject_user`, `day_of_week`, `start_time`, `end_time`, `shift`) VALUES
((SELECT id_classroom FROM classroom WHERE name = 'AULA 1' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '1.1' LIMIT 1), 7, 'Monday', '07:00:00', '09:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 2' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '1.2' LIMIT 1), 8, 'Wednesday', '09:00:00', '10:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'LABORATORIO' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '3.1' LIMIT 1), 9, 'Tuesday', '13:00:00', '15:30:00', 'Tarde'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 3' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '2.3' LIMIT 1), 10, 'Thursday', '15:30:00', '17:30:00', 'Tarde'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 4' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '3.2' LIMIT 1), 11, 'Monday', '10:00:00', '12:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 5' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '2.1' LIMIT 1), 12, 'Friday', '07:00:00', '09:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 6' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '1.3' LIMIT 1), 15, 'Tuesday', '07:00:00', '09:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 7' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '4.1' LIMIT 1), 16, 'Wednesday', '13:00:00', '15:30:00', 'Tarde'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 8' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '5.2' LIMIT 1), 17, 'Thursday', '09:00:00', '10:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 9' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '5.3' LIMIT 1), 18, 'Tuesday', '15:30:00', '17:30:00', 'Tarde'),
((SELECT id_classroom FROM classroom WHERE name = 'AULA 10' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '6.1' LIMIT 1), 19, 'Monday', '07:00:00', '09:00:00', 'Mañana'),
((SELECT id_classroom FROM classroom WHERE name = 'LABORATORIO' LIMIT 1), (SELECT id_workshop_group FROM workshop_group WHERE name = '6.2' LIMIT 1), 20, 'Friday', '13:00:00', '15:30:00', 'Tarde');

INSERT INTO `loans` (`id_loan`, `id_user`, `id_inventory`, `quantity`, `applicant`, `date_loan`, `state`, `observations_loan`) VALUES
(1, 2, (SELECT id_inventory FROM inventory WHERE name = 'Martillo' LIMIT 1), 1, 'Ana García', NOW(), 'activo', 'Préstamo para clase de taller'),
(2, 3, (SELECT id_inventory FROM inventory WHERE name = 'Osciloscopio' LIMIT 1), 1, 'Carlos Pérez', NOW(), 'activo', 'Mediciones en laboratorio'),
(3, 4, (SELECT id_inventory FROM inventory WHERE name = 'Multímetro' LIMIT 1), 2, 'Lucía Gómez', NOW(), 'activo', 'Clase práctica de electrónica'),
(4, 6, (SELECT id_inventory FROM inventory WHERE name = 'Destornillador' LIMIT 1), 1, 'Sofía López', NOW(), 'activo', 'Ajustes en aula'),
(5, 7, (SELECT id_inventory FROM inventory WHERE name = 'Taladro' LIMIT 1), 1, 'Diego Sánchez', NOW(), 'activo', 'Montaje en taller');
