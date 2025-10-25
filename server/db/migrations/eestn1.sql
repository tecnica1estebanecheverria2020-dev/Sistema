-- Desactivar comprobaciones de claves foráneas temporalmente
SET FOREIGN_KEY_CHECKS = 0;

-- ===================================
-- TABLE: roles
-- ===================================
CREATE TABLE IF NOT EXISTS roles (
    id_role INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================
-- TABLE: users
-- ===================================
CREATE TABLE IF NOT EXISTS users (
    id_user INT AUTO_INCREMENT PRIMARY KEY,
    id_role INT NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    password VARCHAR(255) NOT NULL,
    lock_until DATETIME NULL,
    failed_attempts INT DEFAULT 0,
    active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (id_role) REFERENCES roles(id_role) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================
-- TABLE: inventory
-- ===================================
CREATE TABLE IF NOT EXISTS inventory (
    id_inventory INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(255) NULL,
    category VARCHAR(100) NOT NULL,
    amount INT DEFAULT 0,
    available INT DEFAULT 0,
    state ENUM('activo', 'inactivo', 'mantenimiento') DEFAULT 'activo',
    location VARCHAR(100),
    description TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================
-- TABLE: loans
-- ===================================
CREATE TABLE IF NOT EXISTS loans (
    id_loan INT AUTO_INCREMENT PRIMARY KEY,
    id_user INT NOT NULL,
    id_inventory INT NOT NULL,
    quantity INT DEFAULT 1,
    applicant VARCHAR(100),
    date_loan DATETIME DEFAULT CURRENT_TIMESTAMP,
    date_return DATETIME NULL,
    state ENUM('activo', 'devuelto') DEFAULT 'activo',
    observations_loan TEXT,
    observations_return TEXT,
    FOREIGN KEY (id_user) REFERENCES users(id_user),
    FOREIGN KEY (id_inventory) REFERENCES inventory(id_inventory) ON DELETE CASCADE ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ===================================
-- TABLE: schedules
-- ===================================
CREATE TABLE IF NOT EXISTS schedules (
    id_schedule INT AUTO_INCREMENT PRIMARY KEY,
    classroom VARCHAR(50) NOT NULL,
    subject VARCHAR(100) NOT NULL,
    workshop_group VARCHAR(100),
    teacher VARCHAR(100),
    day_of_week ENUM('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Reactivar comprobaciones
SET FOREIGN_KEY_CHECKS = 1;
