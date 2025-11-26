import handleError from '../utils/handleError.js';

class DashboardController {
    constructor(DashboardService) {
        this.DashboardService = DashboardService;
    }

    // Obtener datos para el dashboard
    getData = async (req, res) => {
        try {
            const data = await this.DashboardService.getData();
            res.status(200).json({
                success: true,
                data
            });
        } catch (err) {
            return handleError(res, err);
        }
    };

  // Obtener préstamos del día (fecha de hoy)
  getTodayLoans = async (req, res) => {
        try {
            const loans = await this.DashboardService.getTodayLoans();
            res.status(200).json({
                success: true,
                count: loans.length,
                loans
            });
        } catch (err) {
            return handleError(res, err);
        }
  };

  getActivitySummary = async (req, res) => {
    try {
      const summary = await this.DashboardService.getActivitySummary();
      res.status(200).json({
        success: true,
        data: summary
      });
    } catch (err) {
      return handleError(res, err);
    }
  };
}

export default DashboardController;
