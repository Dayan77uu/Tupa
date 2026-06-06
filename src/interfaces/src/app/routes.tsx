import { createBrowserRouter } from "react-router";
import { RootLayout } from "./layouts/RootLayout";
import { DashboardLayout } from "./layouts/DashboardLayout";

// Public pages
import { LandingPage } from "./pages/public/LandingPage";
import { LoginPage } from "./pages/public/LoginPage";
import { RegisterPage } from "./pages/public/RegisterPage";
import { RecoverPasswordPage } from "./pages/public/RecoverPasswordPage";
import { CataloguePage } from "./pages/public/CataloguePage";
import { ProcedureDetailPage } from "./pages/public/ProcedureDetailPage";

// Student pages
import { StudentDashboard } from "./pages/student/StudentDashboard";
import { MyProcedures } from "./pages/student/MyProcedures";
import { NewRequest } from "./pages/student/NewRequest";
import { ProcedureTracking } from "./pages/student/ProcedureTracking";
import { MyDocuments } from "./pages/student/MyDocuments";
import { PaymentsReceipts } from "./pages/student/PaymentsReceipts";
import { Notifications } from "./pages/student/Notifications";
import { UserProfile } from "./pages/student/UserProfile";

// Graduate pages
import { GraduateDashboard } from "./pages/graduate/GraduateDashboard";

// Teacher pages
import { TeacherDashboard } from "./pages/teacher/TeacherDashboard";

// Administrative pages
import { AdministrativeDashboard } from "./pages/administrative/AdministrativeDashboard";
import { RoleSelector } from "./pages/RoleSelector";
// Mesa de Partes pages
import { MesaPartesDashboard } from "./pages/mesa-partes/MesaPartesDashboard";

// Office pages
import { OfficeDashboard } from "./pages/office/OfficeDashboard";
import { ExpedientDetail } from "./pages/office/ExpedientDetail";

// Manager pages
import { ManagerDashboard } from "./pages/manager/ManagerDashboard";

// Admin pages
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { UserManagement } from "./pages/admin/UserManagement";
import { RolesPermissions } from "./pages/admin/RolesPermissions";
import { CatalogMaintenance } from "./pages/admin/CatalogMaintenance";
import { RequirementsMaintenance } from "./pages/admin/RequirementsMaintenance";
import { CostsMaintenance } from "./pages/admin/CostsMaintenance";
import { OfficesMaintenance } from "./pages/admin/OfficesMaintenance";
import { Reports } from "./pages/admin/Reports";
import { VersionHistory } from "./pages/admin/VersionHistory";
import { AuditLog } from "./pages/admin/AuditLog";
import { SystemConfig } from "./pages/admin/SystemConfig";

// Error pages
import { NotFoundPage } from "./pages/errors/NotFoundPage";
import { AccessDeniedPage } from "./pages/errors/AccessDeniedPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      // Public routes
      { index: true, Component: LandingPage },
      { path: "roles", Component: RoleSelector },
      { path: "login", Component: LoginPage },
      { path: "register", Component: RegisterPage },
      { path: "recover-password", Component: RecoverPasswordPage },
      { path: "catalogue", Component: CataloguePage },
      { path: "procedure/:id", Component: ProcedureDetailPage },
      { path: "access-denied", Component: AccessDeniedPage },

      // Dashboard routes (with sidebar)
      {
        path: "dashboard",
        Component: DashboardLayout,
        children: [
          // Student routes
          { path: "student", Component: StudentDashboard },
          { path: "student/procedures", Component: MyProcedures },
          { path: "student/new-request", Component: NewRequest },
          { path: "student/tracking/:id", Component: ProcedureTracking },
          { path: "student/documents", Component: MyDocuments },
          { path: "student/payments", Component: PaymentsReceipts },
          { path: "student/notifications", Component: Notifications },
          { path: "student/profile", Component: UserProfile },

          // Graduate routes
          { path: "graduate", Component: GraduateDashboard },
          { path: "graduate/procedures", Component: MyProcedures },
          { path: "graduate/new-request", Component: NewRequest },
          { path: "graduate/tracking/:id", Component: ProcedureTracking },
          { path: "graduate/documents", Component: MyDocuments },
          { path: "graduate/payments", Component: PaymentsReceipts },
          { path: "graduate/notifications", Component: Notifications },
          { path: "graduate/profile", Component: UserProfile },

          // Teacher routes
          { path: "teacher", Component: TeacherDashboard },
          { path: "teacher/procedures", Component: MyProcedures },
          { path: "teacher/new-request", Component: NewRequest },
          { path: "teacher/tracking/:id", Component: ProcedureTracking },
          { path: "teacher/notifications", Component: Notifications },
          { path: "teacher/profile", Component: UserProfile },

          // Administrative routes
          { path: "administrative", Component: AdministrativeDashboard },
          { path: "administrative/procedures", Component: MyProcedures },
          { path: "administrative/new-request", Component: NewRequest },
          { path: "administrative/tracking/:id", Component: ProcedureTracking },
          { path: "administrative/notifications", Component: Notifications },
          { path: "administrative/profile", Component: UserProfile },

          // Mesa de Partes routes
          { path: "mesa-partes", Component: MesaPartesDashboard },
          { path: "mesa-partes/notifications", Component: Notifications },
          { path: "mesa-partes/profile", Component: UserProfile },

          // Office routes
          { path: "office", Component: OfficeDashboard },
          { path: "office/expedient/:id", Component: ExpedientDetail },
          { path: "office/notifications", Component: Notifications },
          { path: "office/profile", Component: UserProfile },

          // Manager routes
          { path: "manager", Component: ManagerDashboard },
          { path: "manager/notifications", Component: Notifications },
          { path: "manager/profile", Component: UserProfile },

          // Admin routes
          { path: "admin", Component: AdminDashboard },
          { path: "admin/users", Component: UserManagement },
          { path: "admin/roles", Component: RolesPermissions },
          { path: "admin/catalogue", Component: CatalogMaintenance },
          { path: "admin/requirements", Component: RequirementsMaintenance },
          { path: "admin/costs", Component: CostsMaintenance },
          { path: "admin/offices", Component: OfficesMaintenance },
          { path: "admin/reports", Component: Reports },
          { path: "admin/version-history", Component: VersionHistory },
          { path: "admin/audit", Component: AuditLog },
          { path: "admin/config", Component: SystemConfig },
          { path: "admin/notifications", Component: Notifications },
          { path: "admin/profile", Component: UserProfile },
        ],
      },

      // 404
      { path: "*", Component: NotFoundPage },
    ],
  },
]);
