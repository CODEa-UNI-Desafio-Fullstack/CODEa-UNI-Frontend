import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import DashboardPage from "../../features/dashboard/page/DashboardPage";
import MachineryPage from "../../features/machinery/page/MachineryPage";
import OperationsPage from "../../features/operations/page/OperationsPage";
import MaintenancePage from "../../features/maintenance/page/MaintenancePage";
import OperatorsPage from "../../features/operators/page/OperatorsPage";

export const router = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      { path: "/", element: <DashboardPage /> },
      { path: "/machinery", element: <MachineryPage /> },
      { path: "/operations", element: <OperationsPage /> },
      { path: "/maintenance", element: <MaintenancePage /> },
      { path: "/operators", element: <OperatorsPage /> },
    ],
  },
]);
