import handleError from '../utils/handleError.js';

class SchedulesController {
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }

    VALID_DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
    TIME_REGEX = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;

    mapDayParam = (day) => {
        // Acepta 'Monday'...'Sunday' o números '1'..'7' y devuelve el string en inglés
        if (!day) return null;
        const d = String(day).trim();
        if (/^[1-7]$/.test(d)) {
            const idx = parseInt(d, 10) - 1;
            return this.VALID_DAYS[idx];
        }
        const normalized = d.charAt(0).toUpperCase() + d.slice(1).toLowerCase();
        return this.VALID_DAYS.includes(normalized) ? normalized : null;
    };

    // Crear nuevo horario (normalizado)
    createSchedule = async (req, res) => {
        try {
            const {
                id_classroom,
                id_workshop_group,
                id_subject_user,
                day_of_week,
                start_time,
                end_time,
                shift
            } = req.body;

            // Validaciones requeridos
            if (!id_classroom || id_workshop_group == null || !id_subject_user || !day_of_week || !start_time || !end_time || !shift) {
                return res.status(400).json({
                    success: false,
                    message: 'id_classroom, id_workshop_group, id_subject_user, day_of_week, start_time, end_time y shift son requeridos'
                });
            }

            const dayStr = this.mapDayParam(day_of_week);
            if (!dayStr) {
                return res.status(400).json({
                    success: false,
                    message: 'El día de la semana debe ser Monday, Tuesday, ... Sunday o un número entre 1 y 7'
                });
            }

            if (!this.TIME_REGEX.test(start_time) || !this.TIME_REGEX.test(end_time)) {
                return res.status(400).json({
                    success: false,
                    message: 'El formato de tiempo debe ser HH:MM:SS'
                });
            }

            // NO validamos start_time < end_time para soportar horarios que crucen medianoche

            // Verificar conflictos de horarios (por aula/docente/grupo)
            const conflicts = await this.schedulesService.checkScheduleConflicts({
                day_of_week: dayStr,
                start_time,
                end_time,
                id_classroom: parseInt(id_classroom, 10),
                id_workshop_group: parseInt(id_workshop_group, 10),
                id_subject_user: parseInt(id_subject_user, 10)
            });
            if (conflicts.length > 0) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Existe un conflicto con otro horario en el mismo día',
                    conflicts: conflicts
                });
            }

            const scheduleData = {
                id_classroom: parseInt(id_classroom, 10),
                id_workshop_group: parseInt(id_workshop_group, 10),
                id_subject_user: parseInt(id_subject_user, 10),
                day_of_week: dayStr,
                start_time,
                end_time,
                shift
            };

            const newSchedule = await this.schedulesService.createSchedule(scheduleData);

            res.status(201).json({
                success: true,
                message: 'Horario creado exitosamente',
                data: newSchedule
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener todos los horarios (con filtros normalizados)
    getAllSchedules = async (req, res) => {
        try {
            const {
                day_of_week,
                start_time,
                end_time,
                shift,
                id_classroom,
                id_workshop_group,
                id_subject_user
            } = req.query;

            const filters = {};

            if (day_of_week) {
                const dayStr = this.mapDayParam(day_of_week);
                if (!dayStr) {
                    return res.status(400).json({
                        success: false,
                        message: 'day_of_week inválido. Use Monday..Sunday o 1..7'
                    });
                }
                filters.day_of_week = dayStr;
            }

            if (shift) filters.shift = shift;
            if (id_classroom) filters.id_classroom = parseInt(id_classroom, 10);
            if (id_workshop_group) filters.id_workshop_group = parseInt(id_workshop_group, 10);
            if (id_subject_user) filters.id_subject_user = parseInt(id_subject_user, 10);

            if (start_time) {
                if (!this.TIME_REGEX.test(start_time)) {
                    return res.status(400).json({ success: false, message: 'start_time debe ser HH:MM:SS' });
                }
                filters.start_time = start_time;
            }

            if (end_time) {
                if (!this.TIME_REGEX.test(end_time)) {
                    return res.status(400).json({ success: false, message: 'end_time debe ser HH:MM:SS' });
                }
                filters.end_time = end_time;
            }

            const schedules = await this.schedulesService.getAllSchedules(filters);

            res.status(200).json({
                success: true,
                message: 'Horarios obtenidos exitosamente',
                data: schedules
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener horario por ID
    getScheduleById = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de horario inválido'
                });
            }

            const schedule = await this.schedulesService.getScheduleById(parseInt(id, 10));

            res.status(200).json({
                success: true,
                message: 'Horario obtenido exitosamente',
                data: schedule
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Actualizar horario (normalizado)
    updateSchedule = async (req, res) => {
        try {
            const { id } = req.params;
            const {
                id_classroom,
                id_workshop_group,
                id_subject_user,
                day_of_week,
                start_time,
                end_time,
                shift
            } = req.body;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de horario inválido'
                });
            }

            if (!id_classroom || id_workshop_group == null || !id_subject_user || !day_of_week || !start_time || !end_time || !shift) {
                return res.status(400).json({
                    success: false,
                    message: 'id_classroom, id_workshop_group, id_subject_user, day_of_week, start_time, end_time y shift son requeridos'
                });
            }

            const dayStr = this.mapDayParam(day_of_week);
            if (!dayStr) {
                return res.status(400).json({
                    success: false,
                    message: 'El día de la semana debe ser Monday..Sunday o un número 1..7'
                });
            }

            if (!this.TIME_REGEX.test(start_time) || !this.TIME_REGEX.test(end_time)) {
                return res.status(400).json({
                    success: false,
                    message: 'El formato de tiempo debe ser HH:MM:SS'
                });
            }

            // NO validamos start_time < end_time para permitir cruces de medianoche

            // Verificar conflictos (excluyendo el propio)
            const conflicts = await this.schedulesService.checkScheduleConflicts({
                day_of_week: dayStr,
                start_time,
                end_time,
                id_classroom: parseInt(id_classroom, 10),
                id_workshop_group: parseInt(id_workshop_group, 10),
                id_subject_user: parseInt(id_subject_user, 10)
            }, parseInt(id, 10));
            if (conflicts.length > 0) {
                return res.status(409).json({
                    success: false,
                    message: 'Existe un conflicto con otro horario en el mismo día',
                    conflicts
                });
            }

            const scheduleData = {
                id_classroom: parseInt(id_classroom, 10),
                id_workshop_group: parseInt(id_workshop_group, 10),
                id_subject_user: parseInt(id_subject_user, 10),
                day_of_week: dayStr,
                start_time,
                end_time,
                shift
            };

            const updatedSchedule = await this.schedulesService.updateSchedule(parseInt(id, 10), scheduleData);

            res.status(200).json({
                success: true,
                message: 'Horario actualizado exitosamente',
                data: updatedSchedule
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Eliminar horario
    deleteSchedule = async (req, res) => {
        try {
            const { id } = req.params;

            if (!id || isNaN(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'ID de horario inválido'
                });
            }

            const result = await this.schedulesService.deleteSchedule(parseInt(id, 10));

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener horarios por día (acepta string o número)
    getSchedulesByDay = async (req, res) => {
        try {
            const { day } = req.params;
            const dayStr = this.mapDayParam(day);

            if (!dayStr) {
                return res.status(400).json({
                    success: false,
                    message: 'Día de la semana inválido. Use Monday..Sunday o 1..7'
                });
            }

            const schedules = await this.schedulesService.getSchedulesByDay(dayStr);

            res.status(200).json({
                success: true,
                message: 'Horarios del día obtenidos exitosamente',
                data: schedules
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener horario semanal
    getWeeklySchedule = async (req, res) => {
        try {
            const weeklySchedule = await this.schedulesService.getWeeklySchedule();

            res.status(200).json({
                success: true,
                message: 'Horario semanal obtenido exitosamente',
                data: weeklySchedule
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener estadísticas de horarios
    getSchedulesStats = async (req, res) => {
        try {
            const stats = await this.schedulesService.getSchedulesStats();

            res.status(200).json({
                success: true,
                message: 'Estadísticas de horarios obtenidas exitosamente',
                data: stats
            });
        } catch (error) {
            handleError(res, error);
        }
    };
}

export default SchedulesController;