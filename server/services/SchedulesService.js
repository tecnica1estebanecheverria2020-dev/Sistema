class SchedulesService {
    constructor(conex) {
        this.conex = conex;
    }

    DAY_NAME_ES = {
        Monday: 'Lunes',
        Tuesday: 'Martes',
        Wednesday: 'Miércoles',
        Thursday: 'Jueves',
        Friday: 'Viernes',
        Saturday: 'Sábado',
        Sunday: 'Domingo',
    };

    DAY_ORDER_SQL = `'Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'`;

    // Crear nuevo horario
    createSchedule = async (scheduleData) => {
        try {
            const { id_classroom, id_workshop_group, id_subject_user, day_of_week, start_time, end_time, shift } = scheduleData;

            // Orden de columnas corregido y parámetros alineados
            const [result] = await this.conex.query(
                'INSERT INTO schedules (id_classroom, id_subject_user, id_workshop_group, day_of_week, start_time, end_time, shift) VALUES (?, ?, ?, ?, ?, ?, ?)',
                [id_classroom, id_subject_user, id_workshop_group, day_of_week, start_time, end_time, shift]
            );

            return {
                id_schedule: result.insertId,
                id_classroom,
                id_workshop_group,
                id_subject_user,
                day_of_week,
                start_time,
                end_time,
                shift
            };
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw { status: 409, message: 'Ya existe un horario con esos datos' };
            }
            throw { status: 500, message: 'Error al crear el horario', cause: error };
        }
    };

    baseSelect = () => `
    SELECT
        s.id_schedule,
        s.id_classroom,
        c.name AS classroom,
        s.id_workshop_group,
        wg.name AS workshop_group,
        s.id_subject_user,
        sub.name AS subject,
        u.name AS teacher,
        s.day_of_week,
        s.start_time,
        s.end_time,
        s.shift
    FROM schedules s
    JOIN classroom c ON c.id_classroom = s.id_classroom
    LEFT JOIN workshop_group wg ON wg.id_workshop_group = s.id_workshop_group
    JOIN subject_user su ON su.id_subject_user = s.id_subject_user
    JOIN subject sub ON sub.id_subject = su.id_subject
    JOIN users u ON u.id_user = su.id_user
    `;


    // Obtener todos los horarios
    getAllSchedules = async (filters = {}) => {
        try {
            let query = this.baseSelect();
            let params = [];
            let conditions = [];

            // Filtro por día de la semana
            if (filters.day_of_week) {
                conditions.push('s.day_of_week = ?');
                params.push(filters.day_of_week);
            }

            if (filters.shift) {
                conditions.push('s.shift = ?');
                params.push(filters.shift);
            }

            // Filtros por IDs (preferidos)
            if (filters.id_classroom) {
                conditions.push('s.id_classroom = ?');
                params.push(filters.id_classroom);
            }

            if (filters.id_workshop_group) {
                conditions.push('s.id_workshop_group = ?');
                params.push(filters.id_workshop_group);
            }

            if (filters.id_subject_user) {
                conditions.push('s.id_subject_user = ?');
                params.push(filters.id_subject_user);
            }

            // Filtros por nombre (compatibilidad retro, si algún cliente los usa)
            if (filters.classroom) {
                conditions.push('c.name = ?');
                params.push(filters.classroom);
            }

            if (filters.workshop_group) {
                conditions.push('wg.name = ?');
                params.push(filters.workshop_group);
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

            query += ` ORDER BY FIELD(s.day_of_week, ${this.DAY_ORDER_SQL}), s.start_time ASC`;

            const [schedules] = await this.conex.query(query, params);
            return schedules;
        } catch (error) {
            throw { status: 500, message: 'Error al obtener los horarios', cause: error };
        }
    };

    // Obtener horario por ID
    getScheduleById = async (id) => {
        try {
            const query = this.baseSelect() + 'WHERE s.id_schedule = ?';
            const [schedules] = await this.conex.query(query, [id]);

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
            const { id_classroom, id_workshop_group, id_subject_user, day_of_week, start_time, end_time, shift } = scheduleData;

            const [result] = await this.conex.query(
                'UPDATE schedules SET id_classroom = ?, id_workshop_group = ?, id_subject_user = ?, day_of_week = ?, start_time = ?, end_time = ?, shift = ? WHERE id_schedule = ?',
                [id_classroom, id_workshop_group, id_subject_user, day_of_week, start_time, end_time, shift, id]
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

            let query = this.baseSelect() + 'WHERE s.day_of_week = ?';
            query += 'ORDER BY s.start_time ASC';

            const [schedules] = await this.conex.query(query, [dayOfWeek]);
            return schedules;

        } catch (error) {
            throw { status: 500, message: 'Error al obtener los horarios del día', cause: error };
        }
    };

    // Verificar conflictos de horarios
    checkScheduleConflicts = async (
        { day_of_week, start_time, end_time, id_classroom, id_workshop_group, id_subject_user },
        excludeId = null
    ) => {
        try {
            let query = this.baseSelect() + ` WHERE s.day_of_week = ? `;
            const params = [day_of_week];

            // Ámbitos de comparación
            const scopeConds = [];
            if (id_classroom) {
                scopeConds.push('s.id_classroom = ?');
                params.push(id_classroom);
            }
            if (id_subject_user) {
                scopeConds.push('s.id_subject_user = ?');
                params.push(id_subject_user);
            }
            if (id_workshop_group != null) {
                scopeConds.push('s.id_workshop_group = ?');
                params.push(id_workshop_group);
            }
            if (scopeConds.length > 0) {
                query += ' AND (' + scopeConds.join(' OR ') + ')';
            }

            if (excludeId) {
                query += ' AND s.id_schedule != ?';
                params.push(excludeId);
            }

            const [conflicts] = await this.conex.query(query, params);

            const toMin = (t) => {

                const [hh, mm, ss] = t.split(':').map(Number);
                return hh * 60 + mm + Math.floor((ss || 0) / 60);

            }

            const aStart = toMin(start_time);
            const aEnd = toMin(end_time);
            const aCross = aEnd < aStart;

            const overlaps = (aS, aE, bS, bE) => {
                const aC = aE < aS;
                const bC = bE < bS;

                if (!aC && !bC) {
                    // ambos normales
                    return aS < bE && bS < aE;
                }

                // expandir a segmentos si cruzan medianoche
                const aSegs = !aC ? [[aS, aE]] : [[aS, 1440], [0, aE]];
                const bSegs = !bC ? [[bS, bE]] : [[bS, 1440], [0, bE]];

                for (const [x1, x2] of aSegs) {
                    for (const [y1, y2] of bSegs) {
                        if (x1 < y2 && y1 < x2) return true;
                    }
                }
                return false;
            };

            const filteredConflicts = conflicts.filter((s) => {

                const bStart = toMin(s.start_time);
                const bEnd = toMin(s.end_time);
                return overlaps(aStart, aEnd, bStart, bEnd);

            });

            return filteredConflicts;

        } catch (error) {
            throw { status: 500, message: 'Error al verificar conflictos de horarios', cause: error };
        }
    };

    // Obtener horarios de la semana actual
    getWeeklySchedule = async () => {
        try {
            const query = this.baseSelect() +
                ` ORDER BY FIELD(s.day_of_week, ${this.DAY_ORDER_SQL}), s.start_time ASC`;

            const [rows] = await this.conex.query(query);

            const weeklySchedule = {};
            rows.forEach((s) => {
                const dayName = this.DAY_NAME_ES[s.day_of_week] || s.day_of_week;
                if (!weeklySchedule[dayName]) {
                    weeklySchedule[dayName] = [];
                }
                weeklySchedule[dayName].push(s);
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
                COUNT(DISTINCT s.day_of_week) as days_with_schedules,
                MIN(s.start_time) as earliest_start,
                MAX(s.end_time) as latest_end,
                AVG(
                    CASE 
                        WHEN s.end_time >= s.start_time THEN TIME_TO_SEC(TIMEDIFF(s.end_time, s.start_time))
                        ELSE TIME_TO_SEC(TIMEDIFF(MAKETIME(24,0,0), s.start_time)) + TIME_TO_SEC(s.end_time)
                    END
                ) / 3600 as avg_duration_hours
            FROM schedules s
        `);

            const [dayStats] = await this.conex.query(`
            SELECT 
                s.day_of_week,
                COUNT(*) as schedule_count,
                MIN(s.start_time) as earliest_start,
                MAX(s.end_time) as latest_end
            FROM schedules s
            GROUP BY s.day_of_week
            ORDER BY FIELD(s.day_of_week, ${this.DAY_ORDER_SQL})
        `);

            // Añadir nombre en español
            const dayStatsWithNames = dayStats.map(d => ({
                ...d,
                day_name: this.DAY_NAME_ES[d.day_of_week] || d.day_of_week
            }));

            return {
                general: stats[0],
                by_day: dayStatsWithNames
            };
        } catch (error) {
            throw { status: 500, message: 'Error al obtener las estadísticas de horarios', cause: error };
        }
    };
}
export default SchedulesService;