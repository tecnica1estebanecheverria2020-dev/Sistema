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
    const [mostRequestedItems, setMostRequestedItems] = useState([]);
    const [loansByTime, setLoansByTime] = useState([]);

    const fetchData = async (background = false) => {
        try {
            if (!background) setLoading(true);

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
            if (!background) setLoading(false);
        }
    };

    const fetchTodayLoans = async (background = false) => {
        try {
            if (!background) setLoading(true);

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
            if (!background) setLoading(false);
        }
    };

    const fetchActivitySummary = async (background = false) => {
        try {
            if (!background) setLoading(true);

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
            if (!background) setLoading(false);
        }
    };

    const fetchMostRequestedItems = async (background = false) => {
        try {
            if (!background) setLoading(true);
            const data = await dataService.fetchMostRequestedItems();
            setMostRequestedItems(data);
            setError(null);
        } catch (error) {
            setError(error);
            notify(error?.message || 'Error al obtener items más solicitados', 'error');
        } finally {
            if (!background) setLoading(false);
        }
    };

    const fetchLoansByTime = async (background = false) => {
        try {
            if (!background) setLoading(true);
            const data = await dataService.fetchLoansByTimeOfDay();
            setLoansByTime(data);
            setError(null);
        } catch (error) {
            setError(error);
            notify(error?.message || 'Error al obtener préstamos por hora', 'error');
        } finally {
            if (!background) setLoading(false);
        }
    };

    return {
        loading,
        error,
        dashboardData,
        todayLoans,
        activitySummary,
        mostRequestedItems,
        loansByTime,
        fetchData,
        fetchTodayLoans,
        fetchActivitySummary,
        fetchMostRequestedItems,
        fetchLoansByTime,
    }
}