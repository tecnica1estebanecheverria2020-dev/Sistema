import moment from 'moment';
import 'moment/locale/es.js';

class DashboardService {
  constructor(conex) {
    this.conex = conex;

    moment.locale('es');
  }

  // Obtener datos para el dashboard
  getData = async () => {
    try {
      const [inventoryTotal] = await this.conex.query(`
        SELECT COUNT(*) AS totalInventory FROM inventory
      `);

      const [inventoryAvailable] = await this.conex.query(`
        SELECT COUNT(*) AS availableItems FROM inventory WHERE state = 'Disponible'
      `);

      const [activeLoans] = await this.conex.query(`
        SELECT COUNT(*) AS activeLoans FROM loans WHERE state = 'activo'
      `);

      const [schedulesCount] = await this.conex.query(`
        SELECT COUNT(*) AS totalSchedules FROM schedules
      `);

      return {

        totalInventoryItems: inventoryTotal[0]?.totalInventory ?? 0,
        availableInventoryItems: inventoryAvailable[0]?.availableItems ?? 0,
        activeLoans: activeLoans[0]?.activeLoans ?? 0,
        totalSchedules: schedulesCount[0]?.totalSchedules ?? 0,
        
      };
    } catch (error) {
      throw { status: 500, message: 'Error al obtener los datos del dashboard', cause: error };
    }
  };

  // Obtener préstamos con fecha de hoy
  getTodayLoans = async () => {
    try {
      const [rows] = await this.conex.query(`
        SELECT 
          l.date_loan,
          u.name AS user_name,
          i.name AS item_name
        FROM loans l
        JOIN users u ON l.id_user = u.id_user
        JOIN inventory i ON l.id_inventory = i.id_inventory
        WHERE DATE(l.date_loan) = CURDATE()
        ORDER BY l.date_loan DESC
      `);

      const loans = rows.map(r => ({
        time: moment(r.date_loan).format('HH:mm'),
        item_name: r.item_name,
        user_name: r.user_name,
      }));

      return loans;
    } catch (error) {
      throw { status: 500, message: 'Error al obtener los préstamos de hoy', cause: error };
    }
  };

  getActivitySummary = async () => {
    try {
      const [weeklyLoans] = await this.conex.query(`
        SELECT COUNT(*) AS count
        FROM loans
        WHERE YEARWEEK(date_loan, 1) = YEARWEEK(CURDATE(), 1)
      `);

      const [distinctItemsWeek] = await this.conex.query(`
        SELECT COUNT(DISTINCT id_inventory) AS count
        FROM loans
        WHERE YEARWEEK(date_loan, 1) = YEARWEEK(CURDATE(), 1)
      `);

      const [activeProfessors] = await this.conex.query(`
        SELECT COUNT(DISTINCT id_user) AS count
        FROM loans
        WHERE state = 'activo'
      `);

      return {
        weeklyLoansCount: weeklyLoans[0]?.count ?? 0,
        mostRequestedItemsCount: distinctItemsWeek[0]?.count ?? 0,
        activeProfessorsCount: activeProfessors[0]?.count ?? 0,
      };
    } catch (error) {
      throw { status: 500, message: 'Error al obtener el resumen de actividad', cause: error };
    }
  };

  // Obtener los ítems más solicitados (top 10)
  getMostRequestedItems = async () => {
    try {
      const [rows] = await this.conex.query(`
        SELECT
          i.name AS item_name,
          COUNT(l.id_loan) AS total_loans
        FROM loans l
        JOIN inventory i ON l.id_inventory = i.id_inventory
        WHERE l.date_loan >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY i.id_inventory, i.name
        ORDER BY total_loans DESC
        LIMIT 10
      `);

      return rows.map(row => ({
        item_name: row.item_name,
        total_loans: Number(row.total_loans)
      }));
    } catch (error) {
      throw { status: 500, message: 'Error al obtener items más solicitados', cause: error };
    }
  };

  // Obtener préstamos agrupados por hora del día
  getLoansByTimeOfDay = async () => {
    try {
      const [rows] = await this.conex.query(`
        SELECT
          HOUR(date_loan) AS hour,
          COUNT(*) AS count
        FROM loans
        WHERE date_loan >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
        GROUP BY HOUR(date_loan)
        ORDER BY hour
      `);

      // Crear array de 24 horas con valor 0
      const hourlyData = Array.from({ length: 24 }, (_, i) => ({
        hour: i,
        count: 0
      }));

      // Llenar con datos reales
      rows.forEach(row => {
        const hourIndex = Number(row.hour);
        if (hourIndex >= 0 && hourIndex < 24) {
          hourlyData[hourIndex].count = Number(row.count);
        }
      });

      return hourlyData;
    } catch (error) {
      throw { status: 500, message: 'Error al obtener préstamos por hora', cause: error };
    }
  };
}

export default DashboardService;
