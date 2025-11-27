import { useState } from "react";
import useNotification from "../../../shared/hooks/useNotification";
import { dataService } from "../services/dataService";


export default function useData() {
    const notify = useNotification();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [dashboardData, setDashboardData] = useState(null);
    const [todayLoans, setTodayLoans] = useState([]);
    const [activitySummary, setActivitySummary] = useState({
        weeklyLoansCount: 0,
        mostRequestedItemsCount: 0,
        activeProfessorsCount: 0,
    });

    const fetchData = async () => {
        try {
            setLoading(true);

            const data = await dataService.fetchData();

            setDashboardData(prev => ({
                ...prev,
                inventoryTotal: Number(data.totalInventoryItems || 0),
                inventoryAvailable: Number(data.availableInventoryItems || 0),
                activeLoans: Number(data.activeLoans || 0),
                schedulesCount: Number(data.totalSchedules || 0),
            }));

            setError(null);
        } catch (error) {
            setError(error);
            notify(error?.message || 'Error al obtener los datos del dashboard', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchTodayLoans = async () => {
        try {
            setLoading(true);

            const loans = await dataService.fetchTodayLoans();
            setTodayLoans(loans.map((l, idx) => ({
                id: idx + 1,
                item: l.item_name,
                professor: l.user_name,
                time: l.time,
            })));
            setError(null);
        } catch (error) {
            setError(error);
            notify(error?.message || 'Error al obtener préstamos de hoy', 'error');
        } finally {
            setLoading(false);
        }
    };

    const fetchActivitySummary = async () => {
        try {
            setLoading(true);

            const data = await dataService.fetchActivitySummary();

            setActivitySummary({
                weeklyLoansCount: Number(data.weeklyLoansCount || 0),
                mostRequestedItemsCount: Number(data.mostRequestedItemsCount || 0),
                activeProfessorsCount: Number(data.activeProfessorsCount || 0),
            });

            setError(null);
        } catch (error) {
            setError(error);
            notify(error?.message || 'Error al obtener resumen de actividad', 'error');
        } finally {
            setLoading(false);
        }
    };

    return {
        loading,
        error,
        dashboardData,
        todayLoans,
        activitySummary,
        fetchData,
        fetchTodayLoans,
        fetchActivitySummary,
    }
}