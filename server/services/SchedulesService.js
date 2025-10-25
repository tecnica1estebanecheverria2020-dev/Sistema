class SchedulesService {
    constructor(conex) {
        this.conex = conex;
    }

    // Crear nuevo horario
    createSchedule = async (scheduleData) => {
        try {
            const { day_of_week, start_time, end_time, description } = scheduleData;
            
            const [result] = await this.conex.query(
                'INSERT INTO schedules (day_of_week, start_time, end_time, description) VALUES (?, ?, ?, ?)',
                [day_of_week, start_time, end_time, description]
            );

            return {
                id_schedule: result.insertId,
                day_of_week,
                start_time,
                end_time,
                description
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un horario con esos datos' };
            }
            throw { status: 500, message: 'Error al crear el horario', cause: error };
        }
    };

    // Obtener todos los horarios
    getAllSchedules = async (filters = {}) => {
        try {
            let query = 'SELECT * FROM schedules';
            let params = [];
            let conditions = [];

            // Filtro por día de la semana
            if (filters.day_of_week) {
                conditions.push('day_of_week = ?');
                params.push(filters.day_of_week);
            }

            // Filtro por rango de tiempo
            if (filters.start_time) {
                conditions.push('start_time >= ?');
                params.push(filters.start_time);
            }

            if (filters.end_time) {
                conditions.push('end_time <= ?');
                params.push(filters.end_time);
            }

            if (conditions.length > 0) {
                query += ' WHERE ' + conditions.join(' AND ');
            }

            query += ' ORDER BY day_of_week ASC, start_time ASC';

            const [schedules] = await this.conex.query(query, params);
            return schedules;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los horarios', cause: error };
        }
    };

    // Obtener horario por ID
    getScheduleById = async (id) => {
        try {
            const [schedules] = await this.conex.query(
                'SELECT * FROM schedules WHERE id_schedule = ?',
                [id]
            );

            if (schedules.length === 0) {
                throw { status: 404, message: 'Horario no encontrado' };
            }

            return schedules[0];
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al obtener el horario', cause: error };
        }
    };

    // Actualizar horario
    updateSchedule = async (id, scheduleData) => {
        try {
            const { day_of_week, start_time, end_time, description } = scheduleData;

            const [result] = await this.conex.query(
                'UPDATE schedules SET day_of_week = ?, start_time = ?, end_time = ?, description = ? WHERE id_schedule = ?',
                [day_of_week, start_time, end_time, description, id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Horario no encontrado' };
            }

            return await this.getScheduleById(id);
        } catch (error) {
            if (error.status) throw error;
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un horario con esos datos' };
            }
            throw { status: 500, message: 'Error al actualizar el horario', cause: error };
        }
    };

    // Eliminar horario
    deleteSchedule = async (id) => {
        try {
            const [result] = await this.conex.query(
                'DELETE FROM schedules WHERE id_schedule = ?',
                [id]
            );

            if (result.affectedRows === 0) {
                throw { status: 404, message: 'Horario no encontrado' };
            }

            return { message: 'Horario eliminado correctamente' };
        } catch (error) {
            if (error.status) throw error;
            throw { status: 500, message: 'Error al eliminar el horario', cause: error };
        }
    };

    // Obtener horarios por día de la semana
    getSchedulesByDay = async (dayOfWeek) => {
        try {
            const [schedules] = await this.conex.query(
                'SELECT * FROM schedules WHERE day_of_week = ? ORDER BY start_time ASC',
                [dayOfWeek]
            );

            return schedules;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los horarios del día', cause: error };
        }
    };

    // Verificar conflictos de horarios
    checkScheduleConflicts = async (day_of_week, start_time, end_time, excludeId = null) => {
        try {
            let query = `
                SELECT * FROM schedules 
                WHERE day_of_week = ? 
                AND (
                    (start_time <= ? AND end_time > ?) OR
                    (start_time < ? AND end_time >= ?) OR
                    (start_time >= ? AND end_time <= ?)
                )
            `;
            let params = [day_of_week, start_time, start_time, end_time, end_time, start_time, end_time];

            if (excludeId) {
                query += ' AND id_schedule != ?';
                params.push(excludeId);
            }

            const [conflicts] = await this.conex.query(query, params);
            return conflicts;
        } catch (error) {
            throw { status: 500, message: 'Error al verificar conflictos de horarios', cause: error };
        }
    };

    // Obtener horarios de la semana actual
    getWeeklySchedule = async () => {
        try {
            const [schedules] = await this.conex.query(`
                SELECT 
                    day_of_week,
                    start_time,
                    end_time,
                    description,
                    CASE day_of_week
                        WHEN 1 THEN 'Lunes'
                        WHEN 2 THEN 'Martes'
                        WHEN 3 THEN 'Miércoles'
                        WHEN 4 THEN 'Jueves'
                        WHEN 5 THEN 'Viernes'
                        WHEN 6 THEN 'Sábado'
                        WHEN 7 THEN 'Domingo'
                    END as day_name
                FROM schedules 
                ORDER BY day_of_week ASC, start_time ASC
            `);

            // Agrupar por día de la semana
            const weeklySchedule = {};
            schedules.forEach(schedule => {
                if (!weeklySchedule[schedule.day_name]) {
                    weeklySchedule[schedule.day_name] = [];
                }
                weeklySchedule[schedule.day_name].push(schedule);
            });

            return weeklySchedule;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener el horario semanal', cause: error };
        }
    };

    // Obtener estadísticas de horarios
    getSchedulesStats = async () => {
        try {
            const [stats] = await this.conex.query(`
                SELECT 
                    COUNT(*) as total_schedules,
                    COUNT(DISTINCT day_of_week) as days_with_schedules,
                    MIN(start_time) as earliest_start,
                    MAX(end_time) as latest_end,
                    AVG(TIME_TO_SEC(TIMEDIFF(end_time, start_time))) / 3600 as avg_duration_hours
                FROM schedules
            `);

            const [dayStats] = await this.conex.query(`
                SELECT 
                    day_of_week,
                    CASE day_of_week
                        WHEN 1 THEN 'Lunes'
                        WHEN 2 THEN 'Martes'
                        WHEN 3 THEN 'Miércoles'
                        WHEN 4 THEN 'Jueves'
                        WHEN 5 THEN 'Viernes'
                        WHEN 6 THEN 'Sábado'
                        WHEN 7 THEN 'Domingo'
                    END as day_name,
                    COUNT(*) as schedule_count,
                    MIN(start_time) as earliest_start,
                    MAX(end_time) as latest_end
                FROM schedules
                GROUP BY day_of_week
                ORDER BY day_of_week ASC
            `);

            return {
                general: stats[0],
                by_day: dayStats
            };
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las estadísticas de horarios', cause: error };
        }
    };
}

export default SchedulesService;