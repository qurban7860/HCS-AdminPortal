import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import SimpleLayout from '../layouts/simple';
import CompactLayout from '../layouts/compact';
import DashboardLayout from '../layouts/dashboard';
// config
import { PATH_AFTER_LOGIN } from '../config-global';
//
import {
  // Auth
  LoginPage,
  RegisterPage,
  VerifyCodePage,
  NewPasswordPage,
  ResetPasswordPage,
  Authenticate,

  // ----------------------------------------------------------------

  // AUTH SECURITY USER 
  SecurityUserProfile,
  SecurityUserProfileEdit,
  SecurityUserChangePassword,

  // ----------------------------------------------------------------

  // Dashboard
  Dashboard,
  MachineByModelsView,
  MachineByYearsView,
  MachineByCountriesView,

  // Visits
  Visits,
  NewVisits,
  EditVisits,
  ViewVisits,

  // Customer
  CustomerList,
  CustomerAdd,
  CustomerEdit,
  CustomerView,

  // SITE REPORTS
  CustomerSiteList,

  // CONTACT REPORTS
  CustomerContactList,

  // CUSTOMERS SITES
  CustomerSiteDynamicList,

  // CUSTOMERS CONTACTS
  CustomerContactDynamicList,

  // Customer Notes
  CustomerNoteList,
  CustomerNoteAdd,
  CustomerNoteEdit,
  CustomerNoteView,

  // customer Documents
  CustomerDocumentList,
  CustomerDocumentAdd,
  CustomerDocumentAddFiles,
  CustomerDocumentNewVersion,
  CustomerDocumentHistoryAddFiles,
  CustomerDocumentHistoryNewVersion,
  CustomerDocumentEdit,
  CustomerDocumentView,
  CustomerDocumentHistoryView,
  CustomerDocumentGallery,

  // Customer Machines
  CustomerMachines,
  CustomerMachineMove,
  CustomerMachineAdd,

  // Customer Jira
  CustomerJiraList,

  // Modules Access
  ModulesAccess,

  // ----------------------------------------------------------------

  // CUSTOMER SETTING DEPARTMENTS
  DepartmentAdd,
  DepartmentList,
  DepartmentEdit,
  DepartmentView,

  // CUSTOMER SETTING REGIONS
  RegionList,
  RegionAdd,
  RegionView,
  RegionEdit,

  // Customer Registrations
  PortalRegistrationList,
  PortalRegistrationEdit,
  PortalRegistrationView,

  // ----------------------------------------------------------------

  // Machine
  MachineList,
  MachineAdd,
  MachineView,
  MachineEdit,
  GetMachineId,
  MachineTransfer,

  // --------------------------- SETTING -------------------------------------
  SettingList,
  SettingAdd,
  SettingView,
  SettingEdit,

  // --------------------------- Tool Installed -------------------------------------
  MachineToolInstalledList,
  MachineToolInstalledAdd,
  MachineToolInstalledView,
  MachineToolInstalledEdit,

  // --------------------------- Machine Notes -------------------------------------
  MachineNoteList,
  MachineNoteAdd,
  MachineNoteView,
  MachineNoteEdit,

  // --------------------------- MACHINE Drawings  -------------------------------------
  MachineDrawingList,
  MachineDrawingAdd,
  MachineDrawingAddFile,
  MachineDrawingNewVersion,
  MachineDrawingAttach,
  MachineDrawingListAdd,
  MachineDrawingView,
  MachineDrawingEdit,

  // --------------------------- Machine Documents -------------------------------------
  MachineDocumentList,
  MachineDocumentAdd,
  MachineDocumentAddFile,
  MachineDocumentNewVersion,
  MachineDocumentHistoryAddFile,
  MachineDocumentHistoryNewVersion,
  MachineDocumentEditForm,
  MachineDocumentGallery,
  MachineDocumentViewForm,
  MachineDocumentHistoryViewForm,

  // --------------------------- MACHINE Licenses -------------------------------------
  MachineLicenseList,
  MachineLicenseAdd,
  MachineLicenseView,
  MachineLicenseEdit,

  // --------------------------- MACHINE Profile -------------------------------------
  MachineProfileList,
  MachineProfileAdd,
  MachineProfileView,
  MachineProfileEdit,

  // --------------------------- MACHINE Service Reports -------------------------------------
  MachineServiceReportList,
  MachineServiceReportAdd,
  MachineServiceReportView,

  // --------------------------- MACHINE INI -------------------------------------
  MachineINIList,
  MachineINIAdd,
  MachineINIView,
  MachineINICompareView,

  // --------------------------- MACHINE LOGS -------------------------------------
  MachineLogsList,
  MachineLogsAdd,
  // MachineLogsView,
  MachineLogsGraphView,

  // --------------------------- MACHINE DASHBOARD -------------------------------------
  MachineDashboard,

  // --------------------------- MACHINE INTEGRATION -------------------------------------
  MachineIntegrationViewForm,

  // --------------------------- MACHINE Jira --------------------------------
  MachineJiraList,

  // MACHINE SETTINGS
  MachineSetting,

  // --------------------- Categories & Models ----------------------

  // MACHINE SETTINGS Machine Groups
  MachineGroupList,
  MachineGroupAdd,
  MachineGroupView,
  MachineGroupEdit,

  // MACHINE SETTINGS: MACHINE Categories
  MachineCategoryList,
  MachineCategoryAdd,
  MachineCategoryView,
  MachineCategoryEdit,

  // MACHINE SETTINGS: MACHINE Model
  MachineModelList,
  MachineModelAdd,
  MachineModelView,
  MachineModelEdit,

  // MACHINE SETTINGS: MACHINE Supplier
  MachineSupplierList,
  MachineSupplierAdd,
  MachineSupplierView,
  MachineSupplierEdit,

  // ----------------------- Tools Information -----------------------

  // MACHINE SETTINGS: MACHINE Tools
  MachineToolList,
  MachineToolAdd,
  MachineToolView,
  MachineToolEdit,

  // MACHINE SETTING REPORT
  MachineSettingReportList,

  // ----------------------- Machine Jobs ---------------------------
  MachineJobsList,

  // --------------- Service Report Template --------------------

  // MACHINE SETTINGS CHECK Item Categories
  CheckItemCategoryList,
  CheckItemCategoryAdd,
  CheckItemCategoryView,
  CheckItemCategoryEdit,

  // MACHINE SETTINGS CHECK ITEM
  CheckItemList,
  CheckItemAdd,
  CheckItemView,
  CheckItemEdit,

  // MACHINE SETTINGS Service Report Template / Document
  ServiceReportTemplateList,
  ServiceReportTemplateAdd,
  ServiceReportTemplateView,
  ServiceReportTemplateEdit,

  // Service Report Status
  ServiceReportStatusList,
  ServiceReportStatusAdd,
  ServiceReportStatusView,
  ServiceReportStatusEdit,
  // ------------------------ Others / Machine Status ------------------------

  // MACHINE SETTINGS: MACHINE Statuses
  MachineStatusList,
  MachineStatusAdd,
  MachineStatusView,
  MachineStatusEdit,

  // --------------------------- MACHINE LOG -------------------------------------
  AllMachinesLogs,
  // CoilLogs,
  // ErpLogs,
  // ProductionLogs,

  // --------------------------- MACHINE GRAPHS -------------------------------------
  AllMachinesGraphs,

  // --------------------- Machine Settings --------------------------

  // ----------------------Machine Lifecycle----------------------
  MachineLifecycle,

  // MACHINE SETTINGS: MACHINE Technical Parameters 
  TechnicalParameterCategoryList,
  TechnicalParameterCategoryAdd,
  TechnicalParameterCategoryView,
  TechnicalParameterCategoryEdit,

  // MACHINE SETTINGS: MACHINE Parameters
  TechnicalParameterList,
  TechnicalParameterAdd,
  TechnicalParameterView,
  TechnicalParameterEdit,

  // ----------------------------------------------------------------

  // DOCUMENT dashboard  
  DocumentList,
  DocumentAdd,
  DocumentAddFile,
  DocumentNewVersion,
  DocumentAddList,
  DocumentEdit,
  DocumentView,
  DocumentGallery,

  // ----------------------------------------------------------------

  // DOCUMENT SETTING Document Type
  DocumentTypeList,
  DocumentTypeAdd,
  DocumentTypeView,
  DocumentTypeEdit,

  // DOCUMENT SETTING Document Category
  DocumentCategoryList,
  DocumentCategoryAdd,
  DocumentCategoryView,
  DocumentCategoryEdit,

  // ----------------------------------------------------------------

  // MACHINE DRAWINGS
  MachineDrawings,
  MachineDrawingsAdd,
  MachineDrawingsAddFiles,
  MachineDrawingsNewVersion,
  MachineDrawingsView,
  MachineDrawingsEdit,

  // ----------------------------------------------------------------
  // Jobs
  JobsList,
  JobsAdd,
  JobsView,

  // TICKET DASHBOARD
  SupportDashboard,
  TicketIssueTypeView,
  TicketRequestTypeView,
  TicketOpenIssueTypeView,
  TicketOpenRequestTypeView,
  TicketStatusTypeView,
  TicketStatusView,

  // TICKETS
  TicketFormList,
  TicketForm,
  TicketView,
  // Tickets / Ticket Settings
  TicketSetting,
  // Tickets / Ticket Settings / Collection
  // --------------------------- Issue Type --------------------------
  IssueTypeList,
  IssueTypeForm,
  IssueTypeView,
  // --------------------------- Request Type --------------------------
  RequestTypeList,
  RequestTypeForm,
  RequestTypeView,
  // --------------------------- Priority --------------------------
  PriorityList,
  PriorityForm,
  PriorityView,
  // --------------------------- Status --------------------------
  StatusList,
  StatusForm,
  StatusView,
  // --------------------------- Status Type --------------------------
  StatusTypeList,
  StatusTypeForm,
  StatusTypeView,
  // --------------------------- Impact --------------------------
  ImpactList,
  ImpactForm,
  ImpactView,
  // --------------------------- Change Type --------------------------
  ChangeTypeList,
  ChangeTypeForm,
  ChangeTypeView,
  // --------------------------- Change Reason --------------------------
  ChangeReasonList,
  ChangeReasonForm,
  ChangeReasonView,
  // --------------------------- Investigation Reason --------------------------
  InvestigationReasonList,
  InvestigationReasonForm,
  InvestigationReasonView,
  // --------------------------- Fault --------------------------
  FaultList,
  FaultForm,
  FaultView,
  // REPORTS / SETTINGS
  Setting,

  // modules
  ModuleList,
  ModuleAdd,
  ModuleEdit,
  ModuleView,

  // System Configs
  SystemConfigList,
  SystemConfigAdd,
  SystemConfigEdit,
  SystemConfigView,

  // ----------------------------------------------------------------

  // REPORTS 
  ReportsIntroduction,

  // REPORTS: User Blocked Customers
  BlockedCustomerAdd,
  BlockedCustomerList,

  // REPORTS: User Blocked Users
  BlockedUserList,
  BlockedUserAdd,

  // REPORTS: Blacklist IP
  BlacklistIPList,
  BlacklistIPAdd,

  // REPORTS: Whitelist IP
  WhitelistIPList,
  WhitelistIPAdd,

  // REPORTS: Signin Logs
  SignInLogList,

  // REPORTS: User Invitations List
  UserInvitationList,
  UserInvitationView,

  // REPORTS: RELEASES
  ReleasesList,
  ReleasesView,

  // ----------------------------------------------------------------

  // LOGS: PM2 LOGS
  Pm2LogsList,
  Pm2LogView,

  // LOGS: DB BACKUP LOGS
  DbBackupLogsList,
  DbBackupLogsViewForm,

  // LOGS: API LOGS
  ApiLogsList,
  ApiLogsSummary,

  // ----------------------------------------------------------------

  // SECURITY USER
  SecurityUserList,
  SecurityUserAdd,
  SecurityUserEdit,
  SecurityUserView,
  SecurityUserChangePasswordByAdmin,

  // SECURITY SETTIGS ROLES
  RoleList,
  RoleAdd,
  RoleView,
  RoleEdit,

  // ----------------------------------------------------------------

  // SITE MAP / SITES REPORT
  SitesReport,

  // ----------------------------------------------------------------

  // Email 
  Email,
  Emailview,

  // ----------------------------------------------------------------

  // MAIN
  Page500,
  Page403,
  Page404,
  MachineNotFoundPage,
  UserInviteLanding,
  ComingSoonPage,
  MaintenancePage,
  ErrorPage,
  BlankPage,
  PermissionDeniedPage,
  JiraTickets,
  UnderDevelopment,
  SectionUnderConstruction,
  ArticleList,
  ArticleAdd,
  ArticleEdit,
  ArticleView,
  ArticleCategoryList,
  ArticleCategoryAdd,
  ArticleCategoryEdit,
  ArticleCategoryView,

  // SUPPORT Projects
  ProjectList,
  ProjectAdd,
  ProjectEdit,
  ProjectView,
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    {
      // Auth
      path: 'auth',
      children: [
        {
          path: 'login',
          element: (
            <GuestGuard>
              <LoginPage />
            </GuestGuard>
          ),
        },
        {
          path: 'authenticate',
          element: (
            <GuestGuard>
              <Authenticate />
            </GuestGuard>
          ),
        },
        {
          path: 'register',
          element: (
            <GuestGuard>
              <RegisterPage />
            </GuestGuard>
          ),
        },
        { path: 'login-unprotected', element: <LoginPage /> },
        { path: 'register-unprotected', element: <RegisterPage /> },
        {
          element: <CompactLayout />,
          children: [
            { path: 'reset-password', element: <ResetPasswordPage /> },
            { path: 'new-password/:token/:userId', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // ----------------------------- Main Routes ----------------------------------

    {
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
      ],
    },
    { element: <SimpleLayout /> },
    { path: 'invite/:id/:code/:expiry', element: <UserInviteLanding /> },
    { path: '500', element: <Page500 /> },
    { path: '403', element: <Page403 /> },
    { path: '404', element: <Page404 /> },
    { path: 'machineNotFound', element: <MachineNotFoundPage /> },
    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: 'invalidErrorPage', element: <ErrorPage title='Invalid Code' /> },
        { path: 'expiredErrorPage', element: <ErrorPage title='Invitation Expired' /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },

    // --------------------- Dashboard ----------------------
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Dashboard to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'machineByCountries', element: <MachineByCountriesView /> },
        { path: 'machineByModels', element: <MachineByModelsView /> },
        { path: 'machineByYears', element: <MachineByYearsView /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
      ],
    },

    // --------------------- CALENDAR  ----------------------
    {
      path: 'calendar',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Visits to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'new', element: <MachineByCountriesView /> },
        { path: 'edit', element: <MachineByModelsView /> },
        { path: 'view', element: <MachineByYearsView /> },
      ],
    },
    // --------------------- Customer -----------------------

    {
      path: 'crm',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/crm/customers" replace />, index: true },
        { path: 'contacts', element: <CustomerContactList /> },
        { path: 'sites', element: <CustomerSiteList /> },
        {
          path: 'customers',
          children: [
            { element: <CustomerList />, index: true },
            { path: 'new', element: <CustomerAdd /> },
            { path: ':customerId/edit', element: <CustomerEdit /> },
            { path: ':customerId/view', element: <CustomerView /> },
            {
              path: ':customerId/sites',
              children: [
                { element: <CustomerSiteDynamicList />, index: true },
                { path: 'new', element: <CustomerSiteDynamicList siteAddForm /> },
                { path: ':id/edit', element: <CustomerSiteDynamicList siteEditForm /> },
                { path: ':id/view', element: <CustomerSiteDynamicList siteViewForm /> }
              ],
            },
            {
              path: ':customerId/contacts',
              children: [
                { element: <CustomerContactDynamicList />, index: true },
                { path: 'new', element: <CustomerContactDynamicList contactAddForm /> },
                { path: ':id/edit', element: <CustomerContactDynamicList contactEditForm /> },
                { path: ':id/view', element: <CustomerContactDynamicList contactViewForm /> },
                { path: ':id/move', element: <CustomerContactDynamicList contactMoveForm /> },
              ],
            },
            {
              path: ':customerId/notes',
              children: [
                { element: <CustomerNoteList />, index: true },
                { path: 'new', element: <CustomerNoteAdd /> },
                { path: ':id/edit', element: <CustomerNoteEdit /> },
                { path: ':id/view', element: <CustomerNoteView /> }
              ],
            },
            {
              path: ':customerId/documents',
              children: [
                { element: <CustomerDocumentList />, index: true },
                { path: 'new', element: <CustomerDocumentAdd /> },
                { path: 'viewGallery', element: <CustomerDocumentGallery /> },
                { path: ':id/edit', element: <CustomerDocumentEdit /> },
                { path: 'gallery', element: <CustomerDocumentGallery /> },
                {
                  path: ':id/view',
                  children: [
                    { element: <CustomerDocumentView />, index: true },
                    { path: 'addFile', element: <CustomerDocumentAddFiles /> },
                    { path: 'newVersion', element: <CustomerDocumentNewVersion /> },
                  ]
                },
                {
                  path: ':id/history',
                  children: [
                    { element: <CustomerDocumentHistoryView />, index: true },
                    { path: 'addFile', element: <CustomerDocumentHistoryAddFiles /> },
                    { path: 'newVersion', element: <CustomerDocumentHistoryNewVersion /> },
                  ]
                },
              ],
            },
            // ------------------------------ Customer Machines ----------------------------------     
            {
              path: ':customerId/machines',
              children: [
                { element: <CustomerMachines />, index: true },
                { path: 'new', element: <CustomerMachineAdd /> },
                { path: ':id/move', element: <CustomerMachineMove /> },
              ],
            },
            // ------------------------------ Customer Jira ----------------------------------     
            {
              path: ':customerId/jira',
              children: [
                { element: <CustomerJiraList />, index: true },
              ],
            },
            {
              path: ':customerId/modulesAccess',
              children: [
                { element: <ModulesAccess />, index: true },
              ],
            },

            { path: 'permission-denied', element: <PermissionDeniedPage /> },
            { path: 'blank', element: <BlankPage /> },
          ]
        },
        // ------------------------------ ARCHIVED CUSTOMERS ----------------------------------
        {
          path: 'archived-customers',
          children: [
            { element: <CustomerList isArchived />, index: true },
            { path: ':id/view', element: <CustomerView isArchived /> },
          ],
        },
        {
          path: 'sitesMap',
          children: [
            { element: <SitesReport />, index: true },
          ]
        },
        {
          path: 'portalRegistrations',
          children: [
            { element: <PortalRegistrationList to={PATH_AFTER_LOGIN} replace />, index: true },
            { path: ':customerId/edit', element: <PortalRegistrationEdit /> },
            { path: ':customerId/view', element: <PortalRegistrationView /> },
            { path: 'permission-denied', element: <PermissionDeniedPage /> },
          ],
        },
        // ------------------------------ departments ----------------------------------
        {
          path: 'departments',
          children: [
            { path: 'list', element: <DepartmentList /> },
            { path: 'new', element: <DepartmentAdd /> },
            { path: ':id/view', element: <DepartmentView /> },
            { path: ':id/edit', element: <DepartmentEdit /> },
          ],
        },
      ],
    },

    // ------------------------- Machine ---------------------------

    {
      path: 'products',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/products/machines" replace />, index: true },
        {
          path: 'machines',
          children: [
            { element: <MachineList />, index: true },
            { path: 'new', element: <MachineAdd /> },
            { path: ':machineId/view', element: <MachineView /> },
            { path: ':machineId/edit', element: <MachineEdit /> },
            { path: ':machineId/transfer', element: <MachineTransfer /> },
            {
              path: 'serialNo',
              children: [
                { path: ':serialNo/customer/:ref/view', element: <GetMachineId /> },
                { path: ':serialNo', element: <GetMachineId /> },
                { path: ':serialNo/:ref', element: <GetMachineId /> },
              ]
            },
            {
              path: ':machineId/settings',
              children: [
                { element: <SettingList />, index: true },
                { path: 'new', element: <SettingAdd /> },
                { path: ':id/view', element: <SettingView /> },
                { path: ':id/edit', element: <SettingEdit /> },
              ]
            },
            {
              path: ':machineId/machineLifecycle',
              children: [
                {
                  element: <MachineLifecycle />, index: true
                }
              ]
            },

            {
              path: ':machineId/toolsInstalled',
              children: [
                { element: <MachineToolInstalledList />, index: true },
                { path: 'new', element: <MachineToolInstalledAdd /> },
                { path: ':id/view', element: <MachineToolInstalledView /> },
                { path: ':id/edit', element: <MachineToolInstalledEdit /> },
              ]
            },
            {
              path: ':machineId/jobs',
              children: [
                { element: <MachineJobsList />, index: true },
              ]
            },
            {
              path: ':machineId/notes',
              children: [
                { element: <MachineNoteList />, index: true },
                { path: 'new', element: <MachineNoteAdd /> },
                { path: ':id/view', element: <MachineNoteView /> },
                { path: ':id/edit', element: <MachineNoteEdit /> },
              ]
            },
            {
              path: ':machineId/drawings',
              children: [
                { element: <MachineDrawingList />, index: true },
                { path: 'new', element: <MachineDrawingAdd /> },
                { path: 'attach', element: <MachineDrawingAttach /> },
                { path: 'multipleNew', element: <MachineDrawingListAdd /> },
                { path: ':id/edit', element: <MachineDrawingEdit /> },
                {
                  path: ':id/view',
                  children: [
                    { element: <MachineDrawingView />, index: true },
                    { path: 'addFile', element: <MachineDrawingAddFile /> },
                    { path: 'newVersion', element: <MachineDrawingNewVersion /> },
                  ]
                },
              ]
            },
            {
              path: ':machineId/documents',
              children: [
                { element: <MachineDocumentList />, index: true },
                { path: 'new', element: <MachineDocumentAdd /> },
                { path: 'gallery', element: <MachineDocumentGallery /> },
                { path: ':id/edit', element: <MachineDocumentEditForm /> },
                { path: ':id/newFile', element: <MachineDocumentViewForm /> },
                { path: ':id/newVersion', element: <MachineDocumentViewForm /> },
                {
                  path: ':id/view',
                  children: [
                    { element: <MachineDocumentViewForm />, index: true },
                    { path: 'addFile', element: <MachineDocumentAddFile /> },
                    { path: 'newVersion', element: <MachineDocumentNewVersion /> },
                  ]
                },
                {
                  path: ':id/history',
                  children: [
                    { element: <MachineDocumentHistoryViewForm />, index: true },
                    { path: 'addFile', element: <MachineDocumentHistoryAddFile /> },
                    { path: 'newVersion', element: <MachineDocumentHistoryNewVersion /> },
                  ]
                },
              ]
            },
            {
              path: ':machineId/licenses',
              children: [
                { element: <MachineLicenseList />, index: true },
                { path: 'new', element: <MachineLicenseAdd /> },
                { path: ':id/view', element: <MachineLicenseView /> },
                { path: ':id/edit', element: <MachineLicenseEdit /> },
              ]
            },
            {
              path: ':machineId/profiles',
              children: [
                { element: <MachineProfileList />, index: true },
                { path: 'new', element: <MachineProfileAdd /> },
                { path: ':id/view', element: <MachineProfileView /> },
                { path: ':id/edit', element: <MachineProfileEdit /> },
              ]
            },
            {
              path: ':machineId/serviceReports',
              children: [
                { element: <MachineServiceReportList />, index: true },
                { path: 'new', element: <MachineServiceReportAdd /> },
                { path: ':id/view', element: <MachineServiceReportView /> },
                { path: ':id/edit', element: <MachineServiceReportAdd /> },
              ]
            },
            {
              path: ':machineId/ini',
              children: [
                { element: <MachineINIList />, index: true },
                { path: 'new', element: <MachineINIAdd /> },
                { path: ':id/view', element: <MachineINIView /> },
                { path: 'compare', element: <MachineINICompareView /> },
              ]
            },
            {
              path: ':machineId/logs',
              children: [
                { element: <MachineLogsList />, index: true },
                { path: 'new', element: <MachineLogsAdd /> },
                { path: 'graph', element: <MachineLogsGraphView /> },
                // {path: ':id/view', element: <MachineLogsView/>},
              ]
            },
            {
              path: ':machineId/dashboard',
              children: [
                { element: <MachineDashboard />, index: true },
              ]
            },
            {
              path: ':machineId/integration',
              children: [
                { element: <MachineIntegrationViewForm />, index: true },
              ]
            },
            {
              path: ':machineId/jira',
              children: [
                { element: <MachineJiraList />, index: true },
                // {path: 'new', element: </>}, 
                // {path: ':id/view', element: </>},
              ]
            },
          ]
        },
        {
          path: 'reports',
          children: [
            { element: <Navigate to="/products/reports/serviceReports" replace />, index: true },
            {
              path: 'serviceReports',
              children: [
                {
                  element: <MachineServiceReportList reportsPage />,
                  index: true,
                },
                { path: ':id/view', element: <MachineServiceReportView reportsPage /> },
              ],
            },
            {
              path: 'machineSettingsReport',
              children: [
                { element: <MachineSettingReportList />, index: true },
                // { path: ':id/view', element: <MachineSettingReportView /> },
              ],
            },
            { path: 'machineLogs', children: [{ element: <AllMachinesLogs />, index: true }] },
            { path: 'machineGraphs', children: [{ element: <AllMachinesGraphs />, index: true }] },
            { path: 'apiLogs', children: [{ element: <ApiLogsList />, index: true }] },
            { path: 'apiLogSummary', element: <ApiLogsSummary /> },
          ]
        },
        

        // ------------------------------ DOCUMENNT ----------------------------------
        {
          path: 'documents',
          children: [
            { element: <Navigate to="/products/documents/list" replace />, index: true },
            { path: 'list', element: <DocumentList />, index: true },
            { path: 'new', element: <DocumentAdd /> },
            { path: 'newList', element: <DocumentAddList /> },
            { path: ':id/edit', element: <DocumentEdit /> },
            { path: ':id/gallery', element: <DocumentGallery /> },
            {
              path: ':id/view',
              children: [
                { element: <DocumentView />, index: true },
                { path: 'addFile', element: <DocumentAddFile /> },
                { path: 'newVersion', element: <DocumentNewVersion /> },
              ]
            },
            // ------------------------------ document Category ----------------------------------
            {
              path: 'documentCategory',
              children: [
                { path: 'list', element: <DocumentCategoryList /> },
                { path: 'new', element: <DocumentCategoryAdd /> },
                { path: ':id/edit', element: <DocumentCategoryEdit /> },
                { path: ':id/view', element: <DocumentCategoryView /> },
                { path: 'archived', element: <DocumentCategoryList isArchived /> },
                { path: 'archived/:id/view', element: <DocumentCategoryView /> },
              ],
            },
            // ------------------------------ document Type ----------------------------------
            {
              path: 'documentType',
              children: [
                { path: 'list', element: <DocumentTypeList /> },
                { path: 'new', element: <DocumentTypeAdd /> },
                { path: ':id/edit', element: <DocumentTypeEdit /> },
                { path: ':id/view', element: <DocumentTypeView /> },
                { path: 'archived', element: <DocumentTypeList isArchived /> },
                { path: 'archived/:id/view', element: <DocumentTypeView /> },
              ],
            },
          ],
        },

        // ------------------------------ Drawings ----------------------------------
        {
          path: 'machineDrawings',
          children: [
            { element: <MachineDrawings />, index: true },
            { path: 'new', element: <MachineDrawingsAdd /> },
            { path: 'newList', element: <DocumentAddList machineDrawings /> },
            { path: ':id/edit', element: <MachineDrawingsEdit machineDrawings /> },
            {
              path: ':id/view',
              children: [
                { element: <MachineDrawingsView />, index: true },
                { path: 'addFile', element: <MachineDrawingsAddFiles /> },
                { path: 'newVersion', element: <MachineDrawingsNewVersion /> },
              ]
            },
          ],
        },
        // --------------------------- Machine Settings --------------------------------
        {
          path: 'machineSettings',
          children: [
            { element: <MachineSetting />, index: true },
            // --------------------- Machine Groups --------------------------------
            {
              path: 'groups',
              children: [
                { element: <MachineGroupList />, index: true },
                { path: 'new', element: <MachineGroupAdd /> },
                { path: ':id/view', element: <MachineGroupView /> },
                { path: ':id/edit', element: <MachineGroupEdit /> },
              ]
            },
            // --------------------- Machine Categories --------------------------------
            {
              path: 'categories',
              children: [
                { element: <MachineCategoryList />, index: true },
                { path: 'new', element: <MachineCategoryAdd /> },
                { path: ':id/view', element: <MachineCategoryView /> },
                { path: ':id/edit', element: <MachineCategoryEdit /> },
              ]
            },
            // ---------------------------- Machine Model -----------------------------
            {
              path: 'models',
              children: [
                { element: <MachineModelList />, index: true },
                { path: 'new', element: <MachineModelAdd /> },
                { path: ':id/view', element: <MachineModelView /> },
                { path: ':id/edit', element: <MachineModelEdit /> },
              ]
            },
            // ---------------------------- Machine Model Supplier ------------------------------------
            {
              path: 'suppliers',
              children: [
                { element: <MachineSupplierList />, index: true },
                { path: 'new', element: <MachineSupplierAdd /> },
                { path: ':id/view', element: <MachineSupplierView /> },
                { path: ':id/edit', element: <MachineSupplierEdit /> },
              ]
            },
            // -------------------------- Machine Tools ------------------------------
            {
              path: 'tools',
              children: [
                { element: <MachineToolList />, index: true },
                { path: 'new', element: <MachineToolAdd /> },
                { path: ':id/view', element: <MachineToolView /> },
                { path: ':id/edit', element: <MachineToolEdit /> },
              ]
            },
            // --------------------- Check Item Categories --------------------------------
            {
              path: 'checkItemCategories',
              children: [
                { element: <CheckItemCategoryList />, index: true },
                { path: 'new', element: <CheckItemCategoryAdd /> },
                { path: ':id/view', element: <CheckItemCategoryView /> },
                { path: ':id/edit', element: <CheckItemCategoryEdit /> },
              ]
            },
            // ------------------------ Check Item----------------------------------------
            {
              path: 'checkItems',
              children: [
                { element: <CheckItemList />, index: true },
                { path: 'new', element: <CheckItemAdd /> },
                { path: ':id/view', element: <CheckItemView /> },
                { path: ':id/edit', element: <CheckItemEdit /> },
              ]
            },
            // ----------------------------- Service Reports Template -----------------------------------
            {
              path: 'serviceReportsTemplate',
              children: [
                { element: <ServiceReportTemplateList />, index: true },
                { path: 'new', element: <ServiceReportTemplateAdd /> },
                { path: ':id/copy', element: <ServiceReportTemplateAdd /> },
                { path: ':id/view', element: <ServiceReportTemplateView /> },
                { path: ':id/edit', element: <ServiceReportTemplateEdit /> },
              ]
            },
            // ----------------------------- SERVICE REPORT Status -----------------------------------
            {
              path: 'serviceReportsStatus',
              children: [
                { element: <ServiceReportStatusList />, index: true },
                { path: 'new', element: <ServiceReportStatusAdd /> },
                { path: ':id/view', element: <ServiceReportStatusView /> },
                { path: ':id/edit', element: <ServiceReportStatusEdit /> },
              ]
            },
            // ----------------------------- Others / Machine Status -----------------------------------
            {
              path: 'status',
              children: [
                { element: <MachineStatusList />, index: true },
                { path: 'new', element: <MachineStatusAdd /> },
                { path: ':id/view', element: <MachineStatusView /> },
                { path: ':id/edit', element: <MachineStatusEdit /> },
              ]
            },
            // ----------------- MACHINE Technical Parameters Categories ------------------------
            {
              path: 'technicalParameterCategories',
              children: [
                { element: <TechnicalParameterCategoryList />, index: true },
                { path: 'new', element: <TechnicalParameterCategoryAdd /> },
                { path: ':id/view', element: <TechnicalParameterCategoryView /> },
                { path: ':id/edit', element: <TechnicalParameterCategoryEdit /> },
              ]
            },
            // ----------------------------- MACHINE Parameters -----------------------------------
            {
              path: 'technicalParameters',
              children: [
                { element: <TechnicalParameterList />, index: true },
                { path: 'new', element: <TechnicalParameterAdd /> },
                { path: ':id/view', element: <TechnicalParameterView /> },
                { path: ':id/edit', element: <TechnicalParameterEdit /> },
              ]
            },
          ]
        },
        // --------------------------- Machine Sites Map --------------------------------
        {
          path: 'sitesMap',
          children: [
            { element: <SitesReport />, index: true },
          ]
        },
        // ------------------------------ ARCHIVED MACHINES ----------------------------------
        {
          path: 'archived-machines',
          children: [
            { element: <MachineList isArchived />, index: true },
            { path: ':id/view', element: <MachineView isArchived /> },
          ],
        },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },

    {
      path: 'jobs',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to="/jobs/machineJobs" replace />, index: true },
        {
          path: 'machineJobs',
          children: [
            { element: <JobsList />, index: true },
            { path: 'new', element: <JobsAdd /> },
            { path: ':id/view', element: <JobsView /> },
            { path: ':id/edit', element: <JobsAdd /> },
          ],
        },
      ]
    },

    // --------------------- SUPPORT  ----------------------
    {
      path: 'support',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {
          path: 'projects',
          children: [
            { element: <ProjectList />, index: true },
            { path: 'new', element: <ProjectAdd /> },
            { path: ':id/view', element: <ProjectView /> },
            { path: ':id/edit', element: <ProjectEdit /> },
          ],
        },
        { element: <Navigate to="/support/supportTickets" replace />, index: true },
        {
          path: 'supportDashboard',
          children: [
            { element: <SupportDashboard />, index: true },
            { path: 'issueType', element: <TicketIssueTypeView /> },
            { path: 'requestType', element: <TicketRequestTypeView /> },
            { path: 'openIssueType', element: <TicketOpenIssueTypeView /> },
            { path: 'openRequestType', element: <TicketOpenRequestTypeView /> },
            { path: 'statusType', element: <TicketStatusTypeView /> },
            { path: 'status', element: <TicketStatusView /> },
          ],
        },
        {
          path: 'supportTickets',
          children: [
            { element: <TicketFormList />, index: true },
            { path: 'new', element: <TicketForm /> },
            { path: ':id/edit', element: <TicketForm /> },
            { path: ':id/view', element: <TicketView /> },
          ],
        },
        {
          path: 'settings',
          children: [
            { element: <TicketSetting />, index: true },
            // --------------------- Ticket Collection --------------------------------
            {
              path: 'issueTypes',
              children: [
                { element: <IssueTypeList />, index: true },
                { path: 'new', element: <IssueTypeForm /> },
                { path: ':id/edit', element: <IssueTypeForm /> },
                { path: ':id/view', element: <IssueTypeView /> },
              ]
            },
            {
              path: 'RequestTypes',
              children: [
                { element: <RequestTypeList />, index: true },
                { path: 'new', element: <RequestTypeForm /> },
                { path: ':id/edit', element: <RequestTypeForm /> },
                { path: ':id/view', element: <RequestTypeView /> },
              ]
            },
            {
              path: 'priorities',
              children: [
                { element: <PriorityList />, index: true },
                { path: 'new', element: <PriorityForm /> },
                { path: ':id/edit', element: <PriorityForm /> },
                { path: ':id/view', element: <PriorityView /> },
              ]
            },
            {
              path: 'statuses',
              children: [
                { element: <StatusList />, index: true },
                { path: 'new', element: <StatusForm /> },
                { path: ':id/edit', element: <StatusForm /> },
                { path: ':id/view', element: <StatusView /> },
              ]
            },
            {
              path: 'StatusTypes',
              children: [
                { element: <StatusTypeList />, index: true },
                { path: 'new', element: <StatusTypeForm /> },
                { path: ':id/edit', element: <StatusTypeForm /> },
                { path: ':id/view', element: <StatusTypeView /> },
              ]
            },
            {
              path: 'impacts',
              children: [
                { element: <ImpactList />, index: true },
                { path: 'new', element: <ImpactForm /> },
                { path: ':id/edit', element: <ImpactForm /> },
                { path: ':id/view', element: <ImpactView /> },
              ]
            },
            {
              path: 'changeTypes',
              children: [
                { element: <ChangeTypeList />, index: true },
                { path: 'new', element: <ChangeTypeForm /> },
                { path: ':id/edit', element: <ChangeTypeForm /> },
                { path: ':id/view', element: <ChangeTypeView /> },
              ]
            },
            {
              path: 'changeReasons',
              children: [
                { element: <ChangeReasonList />, index: true },
                { path: 'new', element: <ChangeReasonForm /> },
                { path: ':id/edit', element: <ChangeReasonForm /> },
                { path: ':id/view', element: <ChangeReasonView /> },
              ]
            },
            {
              path: 'investigationReasons',
              children: [
                { element: <InvestigationReasonList />, index: true },
                { path: 'new', element: <InvestigationReasonForm /> },
                { path: ':id/edit', element: <InvestigationReasonForm /> },
                { path: ':id/view', element: <InvestigationReasonView /> },
              ]
            },
            {
              path: 'faults',
              children: [
                { element: <FaultList />, index: true },
                { path: 'new', element: <FaultForm /> },
                { path: ':id/edit', element: <FaultForm /> },
                { path: ':id/view', element: <FaultView /> },
              ]
            },
            { path: 'articleCategories', 
              children: [
                { element: <ArticleCategoryList />, index: true },
                { path: 'new', element: <ArticleCategoryAdd /> },
                { path: ':id/edit', element: <ArticleCategoryEdit /> },
                { path: ':id/view', element: <ArticleCategoryView /> },
                { path: 'archived', element: <ArticleCategoryList isArchived /> },
                { path: ':id/archived/view', element: <ArticleCategoryView /> },
              ]
            },
          ],
        },
        { element: <Navigate to="/support/supportTickets" replace />, index: true },
        { path: 'jiraTickets', element: <JiraTickets /> },
        {
          path: 'knowledgeBase',
          children: [
            { path: 'article', 
              children: [
                { element: <ArticleList />, index: true },
                { path: 'new', element: <ArticleAdd /> },
                { path: ':id/edit', element: <ArticleEdit /> },
                { path: ':id/view', element: <ArticleView /> },
                { path: 'archived', element: <ArticleList isArchived /> },
                { path: ':id/archived/view', element: <ArticleView /> },
              ]
            }
          ]
         },
        { path: 'manuals', element: <SectionUnderConstruction /> },
      ],
    },

    // --------------------- REPORTS  ----------------------
    {
      path: 'reports',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <ReportsIntroduction />, index: true },
        { path: 'machineLogs', children: [{ element: <AllMachinesLogs />, index: true }] },
        { path: 'machineGraphs', children: [{ element: <AllMachinesGraphs />, index: true }] },
         { path: 'apiLogs', children: [{ element: <ApiLogsList />, index: true }] },
         { path: 'apiLogSummary', element: <ApiLogsSummary /> },
        
        {
          path: 'email',
          children: [
            { path: 'list', element: <Email /> },
            { path: ':id/view', element: <Emailview /> }
          ]
        },
        // ------------------------------ Sign In Logs ----------------------------------
        {
          path: 'signInLogs',
          children: [
            { path: 'list', element: <SignInLogList /> },
          ],
        },
        {
          path: 'logs',
          children: [
            { element: <Navigate to="/reports/logs/pm2" replace />, index: true },
            {
              path: 'pm2',
              children: [
                { element: <Pm2LogsList />, index: true },
                { path: ':id/view', element: <Pm2LogView /> },
              ]
            },
            {
              path: 'dbBackup',
              children: [
                { element: <DbBackupLogsList />, index: true },
                { path: ':search', element: <DbBackupLogsList /> },
                { path: ':id/view', element: <DbBackupLogsViewForm /> },
              ]
            },
            {
              path: 'api',
              children: [
                { element: <ApiLogsList />, index: true },
              ]
            },
            { path: 'apiLogSummary', element: <ApiLogsSummary /> },
          ],
        },
      ],
    },

    // ----------------------------- SETTING -----------------------------------
    {
      path: 'settings',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        // {element: <Setting  />, index: true },
        { element: <Navigate to="/settings/security" replace />, index: true },
        {
          path: 'security',
          children: [
            { element: <SecurityUserList />, index: true },
            {
              path: 'users',
              children: [
                { path: 'profile', element: <SecurityUserProfile /> },
                { path: 'editProfile', element: <SecurityUserProfileEdit /> },
                { path: 'password', element: <SecurityUserChangePassword /> },
                { path: 'changePassword', element: <SecurityUserChangePasswordByAdmin /> },
                { path: 'new', element: <SecurityUserAdd /> },
                { path: 'invite', element: <SecurityUserAdd isInvite /> },
                { path: ':id/edit', element: <SecurityUserEdit /> },
                { path: ':id/view', element: <SecurityUserView /> },
              ],
            },
            { path: 'permission-denied', element: <PermissionDeniedPage /> },
            { path: 'blank', element: <BlankPage /> },
          ],
        },
        {
          path: 'restrictions',
          children: [
            {
              path: 'blockedCustomer',
              children: [
                { path: 'list', element: <BlockedCustomerList /> },
                { path: 'new', element: <BlockedCustomerAdd /> },
              ],
            },
            {
              path: 'blockedUser',
              children: [
                { path: 'list', element: <BlockedUserList /> },
                { path: 'new', element: <BlockedUserAdd /> },
              ],
            },
            {
              path: 'blacklistIP',
              children: [
                { path: 'list', element: <BlacklistIPList /> },
                { path: 'new', element: <BlacklistIPAdd /> },
              ],
            },
            {
              path: 'whitelistIP',
              children: [
                { path: 'list', element: <WhitelistIPList /> },
                { path: 'new', element: <WhitelistIPAdd /> },
              ],
            },
          ]
        },
        // ------------------------------ role ----------------------------------
        {
          path: 'role',
          children: [
            { path: 'list', element: <RoleList /> },
            { path: 'new', element: <RoleAdd /> },
            { path: ':id/edit', element: <RoleEdit /> },
            { path: ':id/view', element: <RoleView /> }
          ],
        },
        // ------------------------------ regions ----------------------------------
        {
          path: 'regions',
          children: [
            { path: 'list', element: <RegionList /> },
            { path: 'new', element: <RegionAdd /> },
            { path: ':id/view', element: <RegionView /> },
            { path: ':id/edit', element: <RegionEdit /> }
          ],
        },
        // ------------------------------ modules ----------------------------------
        {
          path: 'modules',
          children: [
            { path: 'list', element: <ModuleList /> },
            { path: 'new', element: <ModuleAdd /> },
            { path: ':id/view', element: <ModuleView /> },
            { path: ':id/edit', element: <ModuleEdit /> }
          ],
        },
        // ------------------------------ System Configuration ----------------------------------
        {
          path: 'configs',
          children: [
            { path: 'list', element: <SystemConfigList /> },
            { path: 'new', element: <SystemConfigAdd /> },
            { path: ':id/view', element: <SystemConfigView /> },
            { path: ':id/edit', element: <SystemConfigEdit /> }
          ],
        },
        // // ------------------------------ DB BACKUP LOGS  ----------------------------------
        // {
        //   path: 'dbBackup',
        //   children: [
        //     {
        //       path: 'logs',
        //       children: [
        //         { element: <DbBackupLogsList /> , index: true },
        //         { path: ':id/view', element: <DbBackupLogsViewForm /> },
        //       ]
        //     }
        //   ],
        // },
        //  // ------------------------------ API LOGS  ----------------------------------
        //  {
        //   path: 'api',
        //   children: [
        //     {
        //       path: 'logs',
        //       children: [
        //         { element: <ApiLogsList /> , index: true },
        //       ]
        //     }
        //   ],
        // },
        // // ------------------------------ PM2 LOGS ----------------------------------
        // {
        //   path: 'pm2',
        //   children: [
        //     {
        //       path: 'logs',
        //       children: [
        //         { element: <Pm2LogsList /> , index: true },
        //         { path: ':id/view', element: <Pm2LogView /> },
        //       ]
        //     }
        //   ],
        // },
        // ------------------------------ invite ----------------------------------
        {
          path: 'invite',
          children: [
            { path: 'list', element: <UserInvitationList /> },
            { path: ':id/view', element: <UserInvitationView /> },
          ],
        },
        // ------------------------------ releases ----------------------------------
        {
          path: 'releases',
          children: [
            { path: 'list', element: <ReleasesList /> },
            { path: ':id/view', element: <ReleasesView /> },
          ],
        }
      ],
    },

  ]);
}
