import handleError from '../utils/handleError.js';

class SchedulesController {
    constructor(schedulesService) {
        this.schedulesService = schedulesService;
    }

    // Crear nuevo horario
    createSchedule = async (req, res) => {
        try {
            const { day_of_week, start_time, end_time, description } = req.body;

            // Validaciones
            if (!day_of_week || !start_time || !end_time) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Día de la semana, hora de inicio y hora de fin son requeridos' 
                });
            }

            if (day_of_week < 1 || day_of_week > 7) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El día de la semana debe ser un número entre 1 (Lunes) y 7 (Domingo)' 
                });
            }

            // Validar formato de tiempo (HH:MM:SS)
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El formato de tiempo debe ser HH:MM:SS' 
                });
            }

            // Validar que la hora de inicio sea menor que la hora de fin
            if (start_time >= end_time) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La hora de inicio debe ser menor que la hora de fin' 
                });
            }

            // Verificar conflictos de horarios
            const conflicts = await this.schedulesService.checkScheduleConflicts(day_of_week, start_time, end_time);
            if (conflicts.length > 0) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Existe un conflicto con otro horario en el mismo día',
                    conflicts: conflicts
                });
            }

            const scheduleData = { 
                day_of_week: parseInt(day_of_week), 
                start_time, 
                end_time, 
                description: description?.trim() || null 
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

    // Obtener todos los horarios
    getAllSchedules = async (req, res) => {
        try {
            const { day_of_week, start_time, end_time } = req.query;
            
            const filters = {};
            if (day_of_week) filters.day_of_week = parseInt(day_of_week);
            if (start_time) filters.start_time = start_time;
            if (end_time) filters.end_time = end_time;

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

            const schedule = await this.schedulesService.getScheduleById(id);

            res.status(200).json({
                success: true,
                message: 'Horario obtenido exitosamente',
                data: schedule
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Actualizar horario
    updateSchedule = async (req, res) => {
        try {
            const { id } = req.params;
            const { day_of_week, start_time, end_time, description } = req.body;

            // Validaciones
            if (!id || isNaN(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'ID de horario inválido' 
                });
            }

            if (!day_of_week || !start_time || !end_time) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Día de la semana, hora de inicio y hora de fin son requeridos' 
                });
            }

            if (day_of_week < 1 || day_of_week > 7) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El día de la semana debe ser un número entre 1 (Lunes) y 7 (Domingo)' 
                });
            }

            // Validar formato de tiempo
            const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/;
            if (!timeRegex.test(start_time) || !timeRegex.test(end_time)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'El formato de tiempo debe ser HH:MM:SS' 
                });
            }

            // Validar que la hora de inicio sea menor que la hora de fin
            if (start_time >= end_time) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'La hora de inicio debe ser menor que la hora de fin' 
                });
            }

            // Verificar conflictos de horarios (excluyendo el horario actual)
            const conflicts = await this.schedulesService.checkScheduleConflicts(day_of_week, start_time, end_time, id);
            if (conflicts.length > 0) {
                return res.status(409).json({ 
                    success: false, 
                    message: 'Existe un conflicto con otro horario en el mismo día',
                    conflicts: conflicts
                });
            }

            const scheduleData = { 
                day_of_week: parseInt(day_of_week), 
                start_time, 
                end_time, 
                description: description?.trim() || null 
            };
            
            const updatedSchedule = await this.schedulesService.updateSchedule(id, scheduleData);

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

            const result = await this.schedulesService.deleteSchedule(id);

            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            handleError(res, error);
        }
    };

    // Obtener horarios por día de la semana
    getSchedulesByDay = async (req, res) => {
        try {
            const { day } = req.params;

            if (!day || isNaN(day) || day < 1 || day > 7) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Día de la semana inválido. Debe ser un número entre 1 (Lunes) y 7 (Domingo)' 
                });
            }

            const schedules = await this.schedulesService.getSchedulesByDay(parseInt(day));

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