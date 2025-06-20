import { Suspense, lazy } from 'react';
// components
import LoadingScreen from '../components/loading-screen';

// ----------------------------------------------------------------------

const Loadable = (Component) => (props) =>
(
  <Suspense fallback={<LoadingScreen />}>
    <Component {...props} />
  </Suspense>
);

// ----------------------------------------------------------------------

// AUTH
export const LoginPage = Loadable(lazy(() => import('../pages/auth/LoginPage')));
export const RegisterPage = Loadable(lazy(() => import('../pages/auth/RegisterPage')));
export const VerifyCodePage = Loadable(lazy(() => import('../pages/auth/VerifyCodePage')));
export const NewPasswordPage = Loadable(lazy(() => import('../pages/auth/NewPasswordPage')));
export const ResetPasswordPage = Loadable(lazy(() => import('../pages/auth/ResetPasswordPage')));
export const Authenticate = Loadable(lazy(() => import('../sections/auth/Authenticate')));

// ----------------------------------------------------------------

// MAIN
export const PermissionDeniedPage = Loadable(lazy(() => import('../pages/dashboard/PermissionDeniedPage')));
export const BlankPage = Loadable(lazy(() => import('../pages/dashboard/BlankPage')));
export const Page500 = Loadable(lazy(() => import('../pages/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const MachineNotFoundPage = Loadable(lazy(() => import('../pages/MachineNotFoundPage')));
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
export const ComingSoonPage = Loadable(lazy(() => import('../pages/ComingSoonPage')));
export const MaintenancePage = Loadable(lazy(() => import('../pages/MaintenancePage')));
export const ErrorPage = Loadable(lazy(() => import('../pages/ErrorPage')));
export const UserInviteLanding = Loadable(lazy(() => import('../pages/UserInviteLanding')));
export const ComponentsOverviewPage = Loadable(lazy(() => import('../components/Defaults/ComponentsOverviewPage')));

// ----------------------------------------------------------------

// AUTH SECURITY USER 
export const SecurityUserProfile = Loadable(lazy(() => import('../pages/security/profile/SecurityUserProfile')))
export const SecurityUserProfileEdit = Loadable(lazy(() => import('../pages/security/profile/SecurityUserProfileEditForm')));
export const SecurityUserChangePassword = Loadable(lazy(() => import('../pages/security/passwordChange/SecurityUserChangePassword')));

// ----------------------------------------------------------------

// DASHBOARD
export const Dashboard = Loadable(lazy(() => import('../pages/dashboard/Dashboard')));
export const MachineByCountriesView = Loadable(lazy(() => import('../pages/dashboard/MachineByCountriesViewForm')));
export const MachineByModelsView = Loadable(lazy(() => import('../pages/dashboard/MachineByModelsViewForm')));
export const MachineByYearsView = Loadable(lazy(() => import('../pages/dashboard/MachineByYearsViewForm')));

// ----------------------------------------------------------------

// DASHBOARD
export const Visits = Loadable(lazy(() => import('../pages/calendar/CalendarView')));
export const NewVisits = Loadable(lazy(() => import('../pages/calendar/CalendarView')));
export const EditVisits = Loadable(lazy(() => import('../pages/calendar/CalendarView')));
export const ViewVisits = Loadable(lazy(() => import('../pages/calendar/CalendarView')));

// JIRA REPORT
export const JiraTickets = Loadable(lazy(() => import('../pages/jira/JiraList')));

// CUSTOMER
export const CustomerList = Loadable(lazy(() => import('../pages/crm/reports/customers/CustomerList')));
export const CustomerAdd = Loadable(lazy(() => import('../pages/crm/customers/CustomerAdd')));
export const CustomerEdit = Loadable(lazy(() => import('../pages/crm/customers/CustomerEdit')));
export const CustomerView = Loadable(lazy(() => import('../pages/crm/customers/CustomerView')));

// CUSTOMERS SITE REPORTS
export const CustomerSiteList = Loadable(lazy(() => import('../pages/crm/reports/sites/CustomerSiteList')));

// CUSTOMERS CONTACT REPORTS
export const CustomerContactList = Loadable(lazy(() => import('../pages/crm/reports/contacts/CustomerContactList')));

// CUSTOMER SITES
export const CustomerSiteDynamicList = Loadable(lazy(() => import('../pages/crm/sites/CustomerSiteDynamicList')));

// CUSTOMER CONTACTS
export const CustomerContactDynamicList = Loadable(lazy(() => import('../pages/crm/contacts/CustomerContactDynamicList')));

// CUSTOMER NOTE
export const CustomerNoteList = Loadable(lazy(() => import('../pages/crm/notes/NoteList')));
export const CustomerNoteAdd = Loadable(lazy(() => import('../pages/crm/notes/NoteAddForm')));
export const CustomerNoteEdit = Loadable(lazy(() => import('../pages/crm/notes/NoteEditForm')));
export const CustomerNoteView = Loadable(lazy(() => import('../pages/crm/notes/NoteViewForm')));

// CUSTOMER DOCUMENTS
export const CustomerDocumentList = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentList')));
export const CustomerDocumentAdd = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentAddForm')));
export const CustomerDocumentAddFiles = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentAddFiles')));
export const CustomerDocumentNewVersion = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentNewVersion')));
export const CustomerDocumentHistoryAddFiles = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentHistoryAddFiles')));
export const CustomerDocumentHistoryNewVersion = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentHistoryNewVersion')));
export const CustomerDocumentEdit = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentEditForm')));
export const CustomerDocumentView = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentViewForm')));
export const CustomerDocumentHistoryView = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentHistoryViewForm')));
export const CustomerDocumentGallery = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentGallery')));

// CUSTOMER MACHINESS
export const CustomerMachines = Loadable(lazy(() => import('../pages/crm/machines/machine_list/CustomerMachines')));
export const CustomerMachineAdd = Loadable(lazy(() => import('../pages/crm/machines/NewMachine')));
export const CustomerMachineMove = Loadable(lazy(() => import('../pages/crm/machines/machine_move/CustomerMachineMove')));

// CUSTOMER Jira
export const CustomerJiraList = Loadable(lazy(() => import('../pages/crm/jira/CustomerJiraList')));
// CUSTOMER PORTAL ACESS

export const ModulesAccess = Loadable(lazy(() => import('../pages/crm/moduleAccess/ModulesAccess')));

// ----------------------------------------------------------------

// CUSTOMER SETTING DEPARTMENTS
export const DepartmentAdd = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentAddForm')));
export const DepartmentList = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentList')));
export const DepartmentEdit = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentEditForm')));
export const DepartmentView = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentView')));

// CUSTOMER SETTING REGIONS
export const RegionList = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionList')));
export const RegionAdd = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionAdd')));
export const RegionEdit = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionEdit')));
export const RegionView = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionView')));

// CUSTOMER REQUESTS
export const PortalRegistrationList = Loadable(lazy(() => import('../pages/crm/portalRegistration/PortalRegistrationList')));
export const PortalRegistrationEdit = Loadable(lazy(() => import('../pages/crm/portalRegistration/PortalRegistrationEdit')));
export const PortalRegistrationView = Loadable(lazy(() => import('../pages/crm/portalRegistration/PortalRegistrationView')));

//----------------------------------------------------------------

// Machine
export const MachineAdd = Loadable(lazy(() => import('../pages/machine/MachineAdd')));
export const MachineList = Loadable(lazy(() => import('../pages/machine/MachineList')));
export const MachineView = Loadable(lazy(() => import('../pages/machine/MachineView')));
export const GetMachineId = Loadable(lazy(() => import('../pages/machine/GetMachineId')));
export const MachineEdit = Loadable(lazy(() => import('../pages/machine/MachineEdit')));
export const MachineTransfer = Loadable(lazy(() => import('../pages/machine/MachineTransfer')));

// --------------------------- MACHINE SETTING -------------------------------------

export const SettingList = Loadable(lazy(() => import('../pages/machine/settings/SettingList')));
export const SettingAdd = Loadable(lazy(() => import('../pages/machine/settings/SettingAdd')));
export const SettingView = Loadable(lazy(() => import('../pages/machine/settings/SettingView')));
export const SettingEdit = Loadable(lazy(() => import('../pages/machine/settings/SettingEdit')));

// -----------------------------MACHINE LIFECYCLE---------------------------------------

export const MachineLifecycle = Loadable(lazy(() => import('../pages/machine/machineLifecycle/MachineLifecycle')));


// --------------------------- Tool Installed -------------------------------------

export const MachineToolInstalledList = Loadable(lazy(() => import('../pages/machine/toolsInstalled/ToolInstalledList')));
export const MachineToolInstalledAdd = Loadable(lazy(() => import('../pages/machine/toolsInstalled/ToolInstalledAddForm')));
export const MachineToolInstalledView = Loadable(lazy(() => import('../pages/machine/toolsInstalled/ToolInstalledViewForm')));
export const MachineToolInstalledEdit = Loadable(lazy(() => import('../pages/machine/toolsInstalled/ToolInstalledEditForm')));

// --------------------------- Tool Installed -------------------------------------

export const MachineJobsList = Loadable(lazy(() => import('../pages/machine/jobs/MachineJobsList')));

// --------------------------- Machine Notes -------------------------------------

export const MachineNoteList = Loadable(lazy(() => import('../pages/machine/notes/NoteList')));
export const MachineNoteAdd = Loadable(lazy(() => import('../pages/machine/notes/NoteAddForm')));
export const MachineNoteView = Loadable(lazy(() => import('../pages/machine/notes/NoteViewForm')));
export const MachineNoteEdit = Loadable(lazy(() => import('../pages/machine/notes/NoteEditForm')));

// --------------------------- MACHINE Drawings  -------------------------------------

export const MachineDrawingList = Loadable(lazy(() => import('../pages/machine/drawings/DrawingList')));
export const MachineDrawingAdd = Loadable(lazy(() => import('../pages/machine/drawings/DrawingAddForm')));
export const MachineDrawingAddFile = Loadable(lazy(() => import('../pages/machine/drawings/DrawingAddFile')));
export const MachineDrawingNewVersion = Loadable(lazy(() => import('../pages/machine/drawings/DrawingNewVersion')));
export const MachineDrawingAttach = Loadable(lazy(() => import('../pages/machine/drawings/DrawingAttach')));
export const MachineDrawingListAdd = Loadable(lazy(() => import('../pages/machine/drawings/DrawingListAdd')));
export const MachineDrawingView = Loadable(lazy(() => import('../pages/machine/drawings/DrawingView')));
export const MachineDrawingEdit = Loadable(lazy(() => import('../pages/machine/drawings/DrawingEdit')));

// --------------------------- Machine Documents -------------------------------------

export const MachineDocumentList = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentList')));
export const MachineDocumentAdd = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentAdd')));
export const MachineDocumentAddFile = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentAddFile')));
export const MachineDocumentNewVersion = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentNewVersion')));
export const MachineDocumentHistoryAddFile = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentHistoryAddFile')));
export const MachineDocumentHistoryNewVersion = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentHistoryNewVersion')));
export const MachineDocumentEditForm = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentEdit')));
export const MachineDocumentGallery = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentGallery')));
export const MachineDocumentViewForm = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentView')));
export const MachineDocumentHistoryViewForm = Loadable(lazy(() => import('../pages/machine/documents/MachineDocumentHistoryView')));

// --------------------------- MACHINE Licenses -------------------------------------

export const MachineLicenseList = Loadable(lazy(() => import('../pages/machine/licenses/LicenseList')));
export const MachineLicenseAdd = Loadable(lazy(() => import('../pages/machine/licenses/LicenseAddForm')));
export const MachineLicenseView = Loadable(lazy(() => import('../pages/machine/licenses/LicenseViewForm')));
export const MachineLicenseEdit = Loadable(lazy(() => import('../pages/machine/licenses/LicenseEditForm')));

// --------------------------- MACHINE Profile -------------------------------------

export const MachineProfileList = Loadable(lazy(() => import('../pages/machine/profiles/ProfileList')));
export const MachineProfileAdd = Loadable(lazy(() => import('../pages/machine/profiles/ProfileAddForm')));
export const MachineProfileView = Loadable(lazy(() => import('../pages/machine/profiles/ProfileViewForm')));
export const MachineProfileEdit = Loadable(lazy(() => import('../pages/machine/profiles/ProfileEditForm')));

// --------------------------- MACHINE Service Reports -------------------------------------

export const MachineServiceReportList = Loadable(lazy(() => import('../pages/machine/serviceReports/MachineServiceReportList')));
export const MachineServiceReportAdd = Loadable(lazy(() => import('../pages/machine/serviceReports/MachineServiceReportAddForm')));
export const MachineServiceReportView = Loadable(lazy(() => import('../pages/machine/serviceReports/MachineServiceReportViewForm')));

// --------------------------- MACHINE INI -------------------------------------

export const MachineINIList = Loadable(lazy(() => import('../pages/machine/historicalConfigurations/HistoricalConfigurationsList')));
export const MachineINIAdd = Loadable(lazy(() => import('../pages/machine/historicalConfigurations/HistoricalConfigurationsAddForm')));
export const MachineINIView = Loadable(lazy(() => import('../pages/machine/historicalConfigurations/HistoricalConfigurationsViewForm')));
export const MachineINICompareView = Loadable(lazy(() => import('../pages/machine/historicalConfigurations/HistoricalConfigurationsCompareView')));

// --------------------------- MACHINE LOGS -------------------------------------

export const MachineLogsList = Loadable(lazy(() => import('../pages/machine/logs/MachineLogsList')));
export const MachineLogsAdd = Loadable(lazy(() => import('../pages/machine/logs/MachineLogsAddForm')));
// export const MachineLogsView = Loadable(lazy(() => import('../pages/machine/logs/MachineLogsViewForm')));
export const MachineLogsGraphView = Loadable(lazy(() => import('../pages/machine/logs/MachineLogsGraphViewForm')));

// --------------------------- MACHINE DASHBOARD -------------------------------------

export const MachineDashboard = Loadable(lazy(() => import('../pages/machine/dashboard/MachineDashboard')));

// --------------------------- MACHINE INTEGRATION -------------------------------------

export const MachineIntegrationViewForm = Loadable(lazy(() => import('../pages/machine/integration/IntegrationViewForm')));

// --------------------------- MACHINE JIRA -------------------------------------

export const MachineJiraList = Loadable(lazy(() => import('../pages/machine/jira/MachineJiraList')));

// ---------------------  SETTINGS -------------------------------------------

export const MachineSetting = Loadable(lazy(() => import('../pages/machineSettings/Machine')));

// ---------------------  REPORTS INTRODUCTION -------------------------------------------

export const ReportsIntroduction = Loadable(lazy(() => import('../pages/Reports/ReportsIntroduction')));

// ---------------------  MACHINE SETTING REPORT -------------------------------------------

export const MachineSettingReportList = Loadable(lazy(() => import('../pages/machineSettingReports/MachineSettingReportList')));

// ---------------------  MACHINE LOGS -------------------------------------------

export const AllMachinesLogs = Loadable(lazy(() => import('../pages/Reports/AllMachineLogs')));
// export const CoilLogs = Loadable(lazy(() => import('../pages/machineLogs/graph/CoilLogs')));
// export const ErpLogs = Loadable(lazy(() => import('../pages/machineLogs/graph/ErpLogs')));
// export const ProductionLogs = Loadable(lazy(() => import('../pages/machineLogs/graph/ProductionLogs')));

// ---------------------  MACHINE Graphs -------------------------------------------
export const AllMachinesGraphs = Loadable(lazy(() => import('../pages/Reports/AllMachineGraphs')));

// --------------------- Categories & Models ----------------------

// MACHINE SETTINGS Machine Groups
export const MachineGroupList = Loadable(lazy(() => import('../pages/machineSettings/groups/GroupList')));
export const MachineGroupAdd = Loadable(lazy(() => import('../pages/machineSettings/groups/GroupAddForm')));
export const MachineGroupView = Loadable(lazy(() => import('../pages/machineSettings/groups/GroupViewForm')));
export const MachineGroupEdit = Loadable(lazy(() => import('../pages/machineSettings/groups/GroupEditForm')));

// MACHINE SETTINGS: MACHINE Categories
export const MachineCategoryList = Loadable(lazy(() => import('../pages/machineSettings/categories/CategoryList')));
export const MachineCategoryAdd = Loadable(lazy(() => import('../pages/machineSettings/categories/CategoryAddForm')));
export const MachineCategoryView = Loadable(lazy(() => import('../pages/machineSettings/categories/CategoryView')));
export const MachineCategoryEdit = Loadable(lazy(() => import('../pages/machineSettings/categories/CategoryEdit')));

// MACHINE SETTINGS: MACHINE Model
export const MachineModelList = Loadable(lazy(() => import('../pages/machineSettings/Model/ModelList')));
export const MachineModelAdd = Loadable(lazy(() => import('../pages/machineSettings/Model/ModelAddForm')));
export const MachineModelView = Loadable(lazy(() => import('../pages/machineSettings/Model/ModelView')));
export const MachineModelEdit = Loadable(lazy(() => import('../pages/machineSettings/Model/ModelEdit')));

// MACHINE SETTINGS: MACHINE Supplier
export const MachineSupplierList = Loadable(lazy(() => import('../pages/machineSettings/suppliers/SupplierList')));
export const MachineSupplierAdd = Loadable(lazy(() => import('../pages/machineSettings/suppliers/SupplierAddForm')));
export const MachineSupplierView = Loadable(lazy(() => import('../pages/machineSettings/suppliers/SupplierView')));
export const MachineSupplierEdit = Loadable(lazy(() => import('../pages/machineSettings/suppliers/SupplierEdit')));

// ----------------------- Tools Information -----------------------

// MACHINE SETTINGS: MACHINE Tools
export const MachineToolList = Loadable(lazy(() => import('../pages/machineSettings/tools/ToolList')));
export const MachineToolAdd = Loadable(lazy(() => import('../pages/machineSettings/tools/ToolAddForm')));
export const MachineToolView = Loadable(lazy(() => import('../pages/machineSettings/tools/ToolView')));
export const MachineToolEdit = Loadable(lazy(() => import('../pages/machineSettings/tools/ToolEdit')));

// --------------- Service Report Template --------------------

// MACHINE SETTINGS CHECK Item Categories
export const CheckItemCategoryList = Loadable(lazy(() => import('../pages/machineSettings/checkItemsCategories/CheckItemCategoryList')));
export const CheckItemCategoryAdd = Loadable(lazy(() => import('../pages/machineSettings/checkItemsCategories/CheckItemCategoryAddForm')));
export const CheckItemCategoryView = Loadable(lazy(() => import('../pages/machineSettings/checkItemsCategories/CheckItemCategoryView')));
export const CheckItemCategoryEdit = Loadable(lazy(() => import('../pages/machineSettings/checkItemsCategories/CheckItemCategoryEdit')));

// MACHINE SETTINGS CHECK ITEM
export const CheckItemList = Loadable(lazy(() => import('../pages/machineSettings/checkItem/CheckItemList')));
export const CheckItemAdd = Loadable(lazy(() => import('../pages/machineSettings/checkItem/CheckItemAddForm')));
export const CheckItemView = Loadable(lazy(() => import('../pages/machineSettings/checkItem/CheckItemView')));
export const CheckItemEdit = Loadable(lazy(() => import('../pages/machineSettings/checkItem/CheckItemEditForm')));

// MACHINE SETTINGS Service Report Template / Document
export const ServiceReportTemplateList = Loadable(lazy(() => import('../pages/machineSettings/serviceReportTemplate/ServiceReportTemplateList')));
export const ServiceReportTemplateAdd = Loadable(lazy(() => import('../pages/machineSettings/serviceReportTemplate/ServiceReportTemplateAddForm')));
export const ServiceReportTemplateView = Loadable(lazy(() => import('../pages/machineSettings/serviceReportTemplate/ServiceReportTemplateView')));
export const ServiceReportTemplateEdit = Loadable(lazy(() => import('../pages/machineSettings/serviceReportTemplate/ServiceReportTemplateEdit')));


export const ServiceReportStatusList = Loadable(lazy(() => import('../pages/machineSettings/serviceReportStatus/ServiceReportStatusList')));
export const ServiceReportStatusAdd = Loadable(lazy(() => import('../pages/machineSettings/serviceReportStatus/ServiceReportStatusAddForm')));
export const ServiceReportStatusView = Loadable(lazy(() => import('../pages/machineSettings/serviceReportStatus/ServiceReportStatusView')));
export const ServiceReportStatusEdit = Loadable(lazy(() => import('../pages/machineSettings/serviceReportStatus/ServiceReportStatusEdit')));
// ------------------------ Others / Machine Status ------------------------

// MACHINE SETTINGS: MACHINE Statuses
export const MachineStatusList = Loadable(lazy(() => import('../pages/machineSettings/status/StatusList')));
export const MachineStatusAdd = Loadable(lazy(() => import('../pages/machineSettings/status/StatusAddForm')));
export const MachineStatusView = Loadable(lazy(() => import('../pages/machineSettings/status/StatusView')));
export const MachineStatusEdit = Loadable(lazy(() => import('../pages/machineSettings/status/StatusEdit')));

// --------------------- Machine Settings --------------------------

// MACHINE SETTINGS: MACHINE Technical Parameters Categories 
export const TechnicalParameterCategoryList = Loadable(lazy(() => import('../pages/machineSettings/technicalParameterCategories/TechParamCategoryList')));
export const TechnicalParameterCategoryAdd = Loadable(lazy(() => import('../pages/machineSettings/technicalParameterCategories/TechParamCategoryAddForm')));
export const TechnicalParameterCategoryView = Loadable(lazy(() => import('../pages/machineSettings/technicalParameterCategories/TechParamCategoryView')));
export const TechnicalParameterCategoryEdit = Loadable(lazy(() => import('../pages/machineSettings/technicalParameterCategories/TechParamCategoryEdit')));

// MACHINE SETTINGS: MACHINE Parameters
export const TechnicalParameterList = Loadable(lazy(() => import('../pages/machineSettings/technicalParameters/ParameterList')));
export const TechnicalParameterAdd = Loadable(lazy(() => import('../pages/machineSettings/technicalParameters/ParameterAddForm')));
export const TechnicalParameterView = Loadable(lazy(() => import('../pages/machineSettings/technicalParameters/ParameterView')));
export const TechnicalParameterEdit = Loadable(lazy(() => import('../pages/machineSettings/technicalParameters/ParameterEdit')));

// ----------------------------------------------------------------

// DOCUMENT dashboard
export const DocumentList = Loadable(lazy(() => import('../pages/documents/GlobalDocument')));
export const DocumentAdd = Loadable(lazy(() => import('../pages/documents/DocumentAddForm')));
export const DocumentAddFile = Loadable(lazy(() => import('../pages/documents/DocumentAddFile')));
export const DocumentNewVersion = Loadable(lazy(() => import('../pages/documents/DocumentNewVersion')));
export const DocumentAddList = Loadable(lazy(() => import('../pages/documents/DocumentListAddForm')));
export const DocumentEdit = Loadable(lazy(() => import('../pages/documents/DocumentEditForm')));
export const DocumentView = Loadable(lazy(() => import('../pages/documents/DocumentHistoryViewForm')));
export const DocumentGallery = Loadable(lazy(() => import('../pages/documents/DocumentGallery')));

// ----------------------------------------------------------------

// DOCUMENT SETTING Document Type
export const DocumentTypeList = Loadable(lazy(() => import('../pages/settings/documentSettings/documentType/DocumentTypeList')));
export const DocumentTypeAdd = Loadable(lazy(() => import('../pages/settings/documentSettings/documentType/DocumentTypeAddForm')));
export const DocumentTypeView = Loadable(lazy(() => import('../pages/settings/documentSettings/documentType/DocumentTypeView')));
export const DocumentTypeEdit = Loadable(lazy(() => import('../pages/settings/documentSettings/documentType/DocumentTypeEditForm')));

// DOCUMENT SETTING Document Category
export const DocumentCategoryList = Loadable(lazy(() => import('../pages/settings/documentSettings/documentCategory/DocumentCategoryList')));
export const DocumentCategoryAdd = Loadable(lazy(() => import('../pages/settings/documentSettings/documentCategory/DocumentCategoryAddForm')));
export const DocumentCategoryView = Loadable(lazy(() => import('../pages/settings/documentSettings/documentCategory/DocumentCategoryView')));
export const DocumentCategoryEdit = Loadable(lazy(() => import('../pages/settings/documentSettings/documentCategory/DocumentCategoryEditForm')));

// ----------------------------------------------------------------

// Machine Drawings dashboard
export const MachineDrawings = Loadable(lazy(() => import('../pages/machineDrawings/MachineDrawings')));
export const MachineDrawingsAdd = Loadable(lazy(() => import('../pages/machineDrawings/MachineDrawingsAddForm')));
export const MachineDrawingsAddFiles = Loadable(lazy(() => import('../pages/machineDrawings/MachineDrawingsAddFiles')));
export const MachineDrawingsNewVersion = Loadable(lazy(() => import('../pages/machineDrawings/MachineDrawingsNewVersion')));
export const MachineDrawingsView = Loadable(lazy(() => import('../pages/machineDrawings/MachineDrawingsViewForm')));
export const MachineDrawingsEdit = Loadable(lazy(() => import('../pages/machineDrawings/MachineDrawingsEditForm')));

// ----------------------------------------------------------------

// REPORTS / SETTINGS
export const Setting = Loadable(lazy(() => import('../pages/settings/Setting')));

// UNKNOWN: Modules
export const ModuleList = Loadable(lazy(() => import('../pages/settings/configuration/modules/ModuleList')));
export const ModuleAdd = Loadable(lazy(() => import('../pages/settings/configuration/modules/ModuleAdd')));
export const ModuleEdit = Loadable(lazy(() => import('../pages/settings/configuration/modules/ModuleEdit')));
export const ModuleView = Loadable(lazy(() => import('../pages/settings/configuration/modules/ModuleView')));

// System Configs
export const SystemConfigList = Loadable(lazy(() => import('../pages/settings/configuration/systemConfigs/ConfigList')));
export const SystemConfigAdd = Loadable(lazy(() => import('../pages/settings/configuration/systemConfigs/ConfigAdd')));
export const SystemConfigEdit = Loadable(lazy(() => import('../pages/settings/configuration/systemConfigs/ConfigEdit')));
export const SystemConfigView = Loadable(lazy(() => import('../pages/settings/configuration/systemConfigs/ConfigView')));

// REPORTS 

// REPORTS: User Blocked Customers
export const BlockedCustomerList = Loadable(lazy(() => import('../pages/settings/securitySettings/blocked_customer/BlockedCustomerList')));
export const BlockedCustomerAdd = Loadable(lazy(() => import('../pages/settings/securitySettings/blocked_customer/BlockedCustomerAddForm')));

// REPORTS: User Blocked Users
export const BlockedUserList = Loadable(lazy(() => import('../pages/settings/securitySettings/blocked_user/BlockedUserList')));
export const BlockedUserAdd = Loadable(lazy(() => import('../pages/settings/securitySettings/blocked_user/BlockedUserAddForm')));

// REPORTS: Blacklist IP
export const BlacklistIPList = Loadable(lazy(() => import('../pages/settings/securitySettings/blacklist_IP/BlacklistIPList')));
export const BlacklistIPAdd = Loadable(lazy(() => import('../pages/settings/securitySettings/blacklist_IP/BlacklistIPAddForm')));

// REPORTS: Whitelist IP
export const WhitelistIPList = Loadable(lazy(() => import('../pages/settings/securitySettings/whitelist_IP/WhitelistIPList')));
export const WhitelistIPAdd = Loadable(lazy(() => import('../pages/settings/securitySettings/whitelist_IP/WhitelistIPAddForm')));

// REPORTS: Signin Logs
export const SignInLogList = Loadable(lazy(() => import('../pages/settings/Reports/signInLog/SignInLogList')));

// REPORTS: User Invitations List
export const UserInvitationList = Loadable(lazy(() => import('../pages/settings/Reports/invite/UserInviteList')));
export const UserInvitationView = Loadable(lazy(() => import('../pages/settings/Reports/invite/UserInviteViewForm')));

// REPORTS: RELEASES
export const ReleasesList = Loadable(lazy(() => import('../pages/settings/Reports/releases/ReleasesList')));
export const ReleasesView = Loadable(lazy(() => import('../pages/settings/Reports/releases/ReleasesViewForm')));

// ----------------------- SYSTEM LOGS -----------------------------------------

// LOGS: PM2 LOGS
export const Pm2LogsList = Loadable(lazy(() => import('../pages/settings/systemLogs/pm2Logs/Pm2LogsList')));
export const Pm2LogView = Loadable(lazy(() => import('../pages/settings/systemLogs/pm2Logs/Pm2LogsViewForm')));

// LOGS: DB BACKUP LOGS
export const DbBackupLogsList = Loadable(lazy(() => import('../pages/settings/systemLogs/dbBackupLogs/DbBackupLogsList')));
export const DbBackupLogsViewForm = Loadable(lazy(() => import('../pages/settings/systemLogs/dbBackupLogs/DbBackupLogsViewForm')));

// LOGS: API LOGS
export const ApiLogsList = Loadable(lazy(() => import('../pages/settings/systemLogs/ApiLogs/ApiLogsList')));
export const ApiLogsSummary = Loadable(lazy(() => import('../pages/settings/systemLogs/ApiLogs/ApiLogsSummary')));

// ----------------------------------------------------------------

// SECURITY USERS
export const SecurityUserList = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserList')));
export const SecurityUserAdd = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserAdd')));
export const SecurityUserView = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserView')));
export const SecurityUserEdit = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserEdit')));
export const SecurityUserChangePasswordByAdmin = Loadable(lazy(() => import('../pages/security/passwordChange/SecurityUserChangePasswordByAdmin')));

// SECURITY SETTIGS ROLES
export const RoleList = Loadable(lazy(() => import('../pages/settings/securitySettings/role/RoleList')));
export const RoleAdd = Loadable(lazy(() => import('../pages/settings/securitySettings/role/RoleAddForm')));
export const RoleEdit = Loadable(lazy(() => import('../pages/settings/securitySettings/role/RoleEditForm')));
export const RoleView = Loadable(lazy(() => import('../pages/settings/securitySettings/role/RoleView')));

// ----------------------------------------------------------------

// SITE MAP / SITES REPORT
export const SitesReport = Loadable(lazy(() => import('../pages/sitesMap/Reports')));

// ----------------------------------------------------------------

// Email
export const Email = Loadable(lazy(() => import('../pages/settings/email/EmailList')));
export const Emailview = Loadable(lazy(() => import('../pages/settings/email/EmailViewform')));

// --------------------------- Jobs -------------------------------------
export const JobsList = Loadable(lazy(() => import('../pages/jobs/JobsListView')));
export const JobsAdd = Loadable(lazy(() => import('../pages/jobs/JobsAddForm')));
export const JobsView = Loadable(lazy(() => import('../pages/jobs/JobsView')));

// --------------------------- Ticket Dashboard -------------------------------------
export const SupportDashboard = Loadable(lazy(() => import('../pages/tickets/dashboard/SupportDashboard')));
export const TicketIssueTypeView = Loadable(lazy(() => import('../pages/tickets/dashboard/TicketIssueTypeViewForm')));
export const TicketRequestTypeView = Loadable(lazy(() => import('../pages/tickets/dashboard/TicketRequestTypeViewForm')));
export const TicketOpenIssueTypeView = Loadable(lazy(() => import('../pages/tickets/dashboard/TicketOpenIssueTypeViewForm')));
export const TicketOpenRequestTypeView = Loadable(lazy(() => import('../pages/tickets/dashboard/TicketOpenRequestTypeViewForm')));
export const TicketStatusTypeView = Loadable(lazy(() => import('../pages/tickets/dashboard/TicketStatusTypeViewForm')));
export const TicketStatusView = Loadable(lazy(() => import('../pages/tickets/dashboard/TicketStatusViewForm')));

// --------------------------- Tickets List -------------------------------------
export const TicketFormList = Loadable(lazy(() => import('../pages/tickets/TicketFormList')));
export const TicketForm = Loadable(lazy(() => import('../pages/tickets/TicketForm')));
export const TicketView = Loadable(lazy(() => import('../pages/tickets/TicketView')));

// Tickets / Ticket Settings
export const TicketSetting = Loadable(lazy(() => import('../pages/tickets/ticketSettings/TicketSetting')));
// Tickets / Ticket Settings / Collection
// --------------------------- Issue Type -------------------------------------
export const IssueTypeList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/issueType/IssueTypeList')));
export const IssueTypeForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/issueType/IssueTypeForm')));
export const IssueTypeView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/issueType/IssueTypeView')));

// --------------------------- Request Type -------------------------------------
export const RequestTypeList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/requestType/RequestTypeList')));
export const RequestTypeForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/requestType/RequestTypeForm')));
export const RequestTypeView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/requestType/RequestTypeView')));

// --------------------------- Priority -------------------------------------
export const PriorityList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/priority/PriorityList')));
export const PriorityForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/priority/PriorityForm')));
export const PriorityView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/priority/PriorityView')));

// --------------------------- Status -------------------------------------
export const StatusList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/status/StatusList')));
export const StatusForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/status/StatusForm')));
export const StatusView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/status/StatusView')));

// --------------------------- Status Type -------------------------------------
export const StatusTypeList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/statusType/StatusTypeList')));
export const StatusTypeForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/statusType/StatusTypeForm')));
export const StatusTypeView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/statusType/StatusTypeView')));

// --------------------------- Impact -------------------------------------
export const ImpactList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/impact/ImpactList')));
export const ImpactForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/impact/ImpactForm')));
export const ImpactView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/impact/ImpactView')));

// --------------------------- Change Type -------------------------------------
export const ChangeTypeList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/changeType/ChangeTypeList')));
export const ChangeTypeForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/changeType/ChangeTypeForm')));
export const ChangeTypeView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/changeType/ChangeTypeView')));

// --------------------------- Change Reason -------------------------------------
export const ChangeReasonList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/changeReason/ChangeReasonList')));
export const ChangeReasonForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/changeReason/ChangeReasonForm')));
export const ChangeReasonView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/changeReason/ChangeReasonView')));

// --------------------------- Investigation Reason -------------------------------------
export const InvestigationReasonList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/investigationReason/InvestigationReasonList')));
export const InvestigationReasonForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/investigationReason/InvestigationReasonForm')));
export const InvestigationReasonView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/investigationReason/InvestigationReasonView')));

// --------------------------- Faults -------------------------------------
export const FaultList = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/fault/FaultList')));
export const FaultForm = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/fault/FaultForm')));
export const FaultView = Loadable(lazy(() => import('../pages/tickets/ticketSettings/ticketCollection/fault/FaultView')));
// --------------------------- Under Development -------------------------------------
export const UnderDevelopment = Loadable(lazy(() => import('../pages/boundaries/UnderDevelopment')));
export const SectionUnderConstruction = Loadable(lazy(() => import('../pages/boundaries/SectionUnderConstruction')));


// --------------------------- Knowledge Base -> Articles -------------------------------------
export const ArticleList = Loadable(lazy(() => import('../pages/support/knowledgeBase/article/ArticleList')));
export const ArticleAdd = Loadable(lazy(() => import('../pages/support/knowledgeBase/article/ArticleAddForm')));
export const ArticleEdit = Loadable(lazy(() => import('../pages/support/knowledgeBase/article/ArticleEditForm')));
export const ArticleView = Loadable(lazy(() => import('../pages/support/knowledgeBase/article/ArticleViewForm')));

// --------------------------- Knowledge Base -> Categories -------------------------------------
export const ArticleCategoryList = Loadable(lazy(() => import('../pages/support/supportSettings/articleCategory/ArticleCategoryList')));
export const ArticleCategoryAdd = Loadable(lazy(() => import('../pages/support/supportSettings/articleCategory/ArticleCategoryAddForm')));
export const ArticleCategoryEdit = Loadable(lazy(() => import('../pages/support/supportSettings/articleCategory/ArticleCategoryEdit')));
export const ArticleCategoryView = Loadable(lazy(() => import('../pages/support/supportSettings/articleCategory/ArticleCategoryView')));

// --------------------------- Settings -> Projects -------------------------------------
export const ProjectList = Loadable(lazy(() => import('../pages/settings/project/ProjectList')));
export const ProjectAdd = Loadable(lazy(() => import('../pages/settings/project/ProjectAddForm')));
export const ProjectEdit = Loadable(lazy(() => import('../pages/settings/project/ProjectEdit')));
export const ProjectView = Loadable(lazy(() => import('../pages/settings/project/ProjectView')));

// --------------------------- Settings -> Release -------------------------------------
export const ReleaseList = Loadable(lazy(() => import('../pages/settings/release/ReleaseList')));
export const ReleaseForm = Loadable(lazy(() => import('../pages/settings/release/ReleaseForm')));
export const ReleaseView = Loadable(lazy(() => import('../pages/settings/release/ReleaseView')));
