SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

-- Crear tablas

CREATE TABLE `classroom` (
  `id_classroom` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE comunicados (
  id_comunicado INT AUTO_INCREMENT PRIMARY KEY,
  tipo VARCHAR(20) NOT NULL,
  titulo VARCHAR(255) NOT NULL,
  contenido_html MEDIUMTEXT,
  bg_color VARCHAR(20),
  bg_image_url TEXT,
  bg_opacity DECIMAL(3,2) DEFAULT 0.0,
  payload JSON NOT NULL,
  created_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

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

CREATE TABLE `roles` (
  `id_role` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `schedules` (
  `id_schedule` int(11) NOT NULL,
  `id_classroom` int(11) NOT NULL,
  `id_workshop_group` int(11) NOT NULL,
  `id_subject_user` int(11) NOT NULL,
  `day_of_week` enum('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday') NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `shift` enum('Mañana','Tarde') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `subject` (
  `id_subject` int(11) NOT NULL,
  `name` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `subject_user` (
  `id_subject_user` int(11) NOT NULL,
  `id_subject` int(11) NOT NULL,
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `email` varchar(100) NOT NULL,
  `name` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `lock_until` datetime DEFAULT NULL,
  `failed_attempts` int(11) DEFAULT 0,
  `active` tinyint(1) DEFAULT 1,
  `tel` varchar(11) DEFAULT NULL,
  `created_at` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `users_roles` (
  `id_user_roles` int(11) NOT NULL,
  `id_user` int(11) NOT NULL,
  `id_role` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE `workshop_group` (
  `id_workshop_group` int(11) NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Volcado de datos

INSERT INTO `classroom` (`id_classroom`, `name`) VALUES
(1, 'Aula 1'),
(2, 'Aula 2'),
(3, 'Aula 3'),
(4, 'Aula 4'),
(5, 'Aula 5'),
(6, 'Aula 6'),
(7, 'Aula 7'),
(8, 'Aula 8'),
(9, 'Aula 9'),
(10, 'Aula 10'),
(11, 'Aula 11'),
(12, 'Aula 12'),
(13, 'Aula 13'),
(14, 'Aula 14'),
(15, 'Aula 15'),
(16, 'Aula 16'),
(17, 'Aula 17'),
(18, 'Aula 18'),
(19, 'Aula 19'),
(20, 'Aula 20'),
(21, 'Aula 21'),
(23, 'Laboratorio'),
(22, 'Taller grande');

INSERT INTO `inventory` (`id_inventory`, `name`, `code`, `category`, `amount`, `available`, `state`, `location`, `description`) VALUES
(1, 'Computadora', 'PC-001', 'Computadoras', 20, 18, 'Disponible', 'Laboratorio de Informática', 'PC de escritorio'),
(2, 'Mouse', 'MOU-001', 'Perifericos', 50, 45, 'Disponible', 'Pañol', 'Mouse óptico USB'),
(3, 'Teclado', 'KEY-001', 'Perifericos', 40, 35, 'Disponible', 'Pañol', 'Teclado estándar USB'),
(4, 'Proyector', 'PRJ-001', 'Audiovisual', 3, 2, 'Disponible', 'Aula', 'Proyector multimedia'),
(5, 'Laptop', 'LAP-001', 'Computadoras', 10, 8, 'Mantenimiento', 'Laboratorio de Informática', 'Notebook para prácticas'),
(6, 'Monitor', 'MON-001', 'Perifericos', 10, 9, 'Disponible', 'Pañol', 'Monitor LED 24"');

INSERT INTO `loans` (`id_loan`, `id_user`, `id_inventory`, `quantity`, `applicant`, `date_loan`, `date_return`, `state`, `observations_loan`, `observations_return`) VALUES
(1, 2, 1, 1, 'Ana García', '2025-11-25 17:14:11', NULL, 'activo', 'Préstamo para clase de taller', NULL),
(2, 3, 4, 1, 'Carlos Pérez', '2025-11-25 17:14:11', NULL, 'activo', 'Mediciones en laboratorio', NULL),
(3, 4, 6, 2, 'Lucía Gómez', '2025-11-25 17:14:11', NULL, 'activo', 'Clase práctica de electrónica', NULL),
(4, 6, 2, 1, 'Sofía López', '2025-11-25 17:14:11', NULL, 'activo', 'Ajustes en aula', NULL),
(5, 7, 3, 1, 'Diego Sánchez', '2025-11-25 17:14:11', NULL, 'activo', 'Montaje en taller', NULL);

INSERT INTO `roles` (`id_role`, `name`) VALUES
(1, 'EMTP Server'),
(2, 'EMTP Pañol'),
(3, 'EMPT Laboratorio'),
(4, 'Bibliotecario'),
(5, 'Profesor'),
(6, 'Jefe_Area'),
(7, 'Directivo'),
(8, 'Admin');

INSERT INTO `schedules` (`id_schedule`, `id_classroom`, `id_workshop_group`, `id_subject_user`, `day_of_week`, `start_time`, `end_time`, `shift`) VALUES
(1, 1, 1, 7, 'Monday', '07:00:00', '09:00:00', 'Mañana'),
(2, 2, 2, 8, 'Wednesday', '09:00:00', '10:00:00', 'Mañana'),
(4, 3, 8, 10, 'Thursday', '15:30:00', '17:30:00', 'Tarde'),
(5, 4, 12, 11, 'Monday', '10:00:00', '12:00:00', 'Mañana'),
(6, 5, 6, 12, 'Friday', '07:00:00', '09:00:00', 'Mañana'),
(7, 6, 3, 15, 'Tuesday', '07:00:00', '09:00:00', 'Mañana'),
(8, 7, 18, 16, 'Wednesday', '13:00:00', '15:30:00', 'Tarde'),
(9, 8, 24, 17, 'Thursday', '09:00:00', '10:00:00', 'Mañana'),
(10, 9, 25, 18, 'Tuesday', '15:30:00', '17:30:00', 'Tarde'),
(11, 10, 28, 19, 'Monday', '07:00:00', '09:00:00', 'Mañana'),
(3, 23, 11, 9, 'Tuesday', '13:00:00', '15:30:00', 'Tarde'),
(12, 23, 29, 20, 'Friday', '13:00:00', '15:30:00', 'Tarde');

INSERT INTO `subject` (`id_subject`, `name`) VALUES
(1, 'Programación 1'),
(2, 'Programación 2'),
(3, 'Programación 3'),
(4, 'Modelos y Sistemas'),
(5, 'Base de Datos'),
(6, 'Sistemas Operativos'),
(7, 'Diseño Web');

INSERT INTO `subject_user` (`id_subject_user`, `id_subject`, `id_user`) VALUES
(1, 1, 1),
(2, 2, 1),
(3, 3, 1),
(4, 4, 1),
(5, 5, 1),
(6, 6, 1),
(7, 1, 2),
(8, 2, 2),
(9, 6, 3),
(10, 5, 3),
(11, 3, 4),
(12, 4, 4),
(13, 2, 5),
(14, 6, 5),
(15, 1, 6),
(16, 5, 6),
(17, 4, 7),
(18, 3, 7),
(19, 1, 8),
(20, 6, 8);

INSERT INTO `users` (`id_user`, `email`, `name`, `password`, `lock_until`, `failed_attempts`, `active`, `tel`, `created_at`) VALUES
(1, 'admin@radiopad.com', 'Cuenta Admin', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '1234567890', '2025-10-30 22:47:28'),
(2, 'celeste.basterra@escuela.com', 'Basterra Celeste', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '111222333', '2025-11-25 17:14:11'),
(3, 'pablo.gareis@escuela.com', 'Gareis Pablo', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '222333444', '2025-11-25 17:14:11'),
(4, 'maciel.avalos@escuela.com', 'Avalos Maciel', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '333444555', '2025-11-25 17:14:11'),
(5, 'callamullo@escuela.com', 'Callamullo', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '444555666', '2025-11-25 17:14:11'),
(6, 'lautaro.aragon@escuela.com', 'Lautaro Aragon', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '555666777', '2025-11-25 17:14:11'),
(7, 'teresita.salazar@escuela.com', 'Teresita Salazar', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '666777888', '2025-11-25 17:14:11'),
(8, 'vanesa@escuela.com', 'Vanesa', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '777888999', '2025-11-25 17:14:11'),
(11, 'juan@gmail.com', 'Juan', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '1111111111', '2025-11-26 13:55:58'),
(12, 'mateo@gmail.com', 'Mateo', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '12344321', '2025-11-26 14:54:12'),
(13, 'tttt@gmail.com', 'Thiago', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '1234321', '2025-11-26 16:15:18'),
(15, 'daniela.monje@escuela.com', 'Monje Daniela', '$2b$10$KwKPKY1456nonu57JGJha.v.tFQ.A8KaMJOWMq1MR90doGXnuBSgy', NULL, 0, 1, '999888777', '2025-11-26 16:15:18');

INSERT INTO `users_roles` (`id_user_roles`, `id_user`, `id_role`) VALUES
(8, 2, 5),
(9, 3, 5),
(10, 4, 5),
(11, 5, 5),
(12, 6, 5),
(14, 8, 1),
(15, 11, 8),
(16, 12, 8),
(17, 12, 4),
(18, 12, 7),
(19, 12, 5),
(24, 13, 6),
(25, 13, 1),
(26, 1, 8),
(27, 7, 5),
(28, 15, 6);

INSERT INTO `workshop_group` (`id_workshop_group`, `name`) VALUES
(1, '1.1'),
(2, '1.2'),
(3, '1.3'),
(4, '1.4'),
(5, '1.5'),
(6, '2.1'),
(7, '2.2'),
(8, '2.3'),
(9, '2.4'),
(10, '2.5'),
(11, '3.1'),
(12, '3.2'),
(13, '3.3'),
(14, '3.4'),
(15, '3.5'),
(16, '3.6'),
(17, '3.7'),
(18, '4.1'),
(19, '4.2'),
(20, '4.3'),
(21, '4.4'),
(22, '4.5'),
(23, '5.1'),
(24, '5.2'),
(25, '5.3'),
(26, '5.4'),
(27, '5.5'),
(28, '6.1'),
(29, '6.2'),
(30, '6.3'),
(31, '6.4'),
(32, '6.5'),
(33, '7.1'),
(34, '7.2'),
(35, '7.3'),
(36, '7.4'),
(37, '7.5');

ALTER TABLE `classroom`
  ADD PRIMARY KEY (`id_classroom`),
  ADD UNIQUE KEY `uq_classroom_name` (`name`);

ALTER TABLE `inventory`
  ADD PRIMARY KEY (`id_inventory`);

ALTER TABLE `loans`
  ADD PRIMARY KEY (`id_loan`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_inventory` (`id_inventory`);

ALTER TABLE `roles`
  ADD PRIMARY KEY (`id_role`);

ALTER TABLE `schedules`
  ADD PRIMARY KEY (`id_schedule`),
  ADD UNIQUE KEY `uq_schedules_composite` (`id_classroom`,`id_workshop_group`,`id_subject_user`,`day_of_week`,`start_time`,`end_time`,`shift`),
  ADD KEY `id_classroom` (`id_classroom`),
  ADD KEY `id_workshop_group` (`id_workshop_group`),
  ADD KEY `id_subject_user` (`id_subject_user`);

ALTER TABLE `subject`
  ADD PRIMARY KEY (`id_subject`);

ALTER TABLE `subject_user`
  ADD PRIMARY KEY (`id_subject_user`),
  ADD KEY `id_subject` (`id_subject`),
  ADD KEY `id_user` (`id_user`);

ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

ALTER TABLE `users_roles`
  ADD PRIMARY KEY (`id_user_roles`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_role` (`id_role`);

ALTER TABLE `workshop_group`
  ADD PRIMARY KEY (`id_workshop_group`),
  ADD UNIQUE KEY `uq_workshop_group_name` (`name`);

ALTER TABLE `classroom`
  MODIFY `id_classroom` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

ALTER TABLE `inventory`
  MODIFY `id_inventory` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `loans`
  MODIFY `id_loan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

ALTER TABLE `roles`
  MODIFY `id_role` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

ALTER TABLE `schedules`
  MODIFY `id_schedule` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

ALTER TABLE `subject`
  MODIFY `id_subject` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

ALTER TABLE `subject_user`
  MODIFY `id_subject_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

ALTER TABLE `users_roles`
  MODIFY `id_user_roles` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=29;

ALTER TABLE `workshop_group`
  MODIFY `id_workshop_group` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

ALTER TABLE `loans`
  ADD CONSTRAINT `loans_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`),
  ADD CONSTRAINT `loans_ibfk_2` FOREIGN KEY (`id_inventory`) REFERENCES `inventory` (`id_inventory`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `schedules`
  ADD CONSTRAINT `schedules_fk_classroom` FOREIGN KEY (`id_classroom`) REFERENCES `classroom` (`id_classroom`) ON UPDATE CASCADE,
  ADD CONSTRAINT `schedules_fk_subject_user` FOREIGN KEY (`id_subject_user`) REFERENCES `subject_user` (`id_subject_user`) ON UPDATE CASCADE,
  ADD CONSTRAINT `schedules_fk_workshop_group` FOREIGN KEY (`id_workshop_group`) REFERENCES `workshop_group` (`id_workshop_group`) ON UPDATE CASCADE;

ALTER TABLE `subject_user`
  ADD CONSTRAINT `subject_user_fk_subject` FOREIGN KEY (`id_subject`) REFERENCES `subject` (`id_subject`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `subject_user_fk_user` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE `users_roles`
  ADD CONSTRAINT `users_roles_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `users_roles_ibfk_2` FOREIGN KEY (`id_role`) REFERENCES `roles` (`id_role`) ON DELETE CASCADE ON UPDATE CASCADE;

COMMIT;
