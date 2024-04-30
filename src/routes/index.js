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

  // --------------------------- MACHINE Service Records -------------------------------------
  MachineServiceRecordList,
  MachineServiceRecordAdd,
  MachineServiceRecordView,
  MachineServiceRecordEdit,
  MachineServiceRecordHistoryList,

  // --------------------------- MACHINE INI -------------------------------------
  MachineINIList,
  MachineINIAdd,
  MachineINIView,
  MachineINICompareView,

  // --------------------------- MACHINE LOGS -------------------------------------
  MachineLogsList,
  MachineLogsAdd,
  MachineLogsView,
  MachineLogsGraphView,

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

  // --------------- Service Record Configuration --------------------

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

  // MACHINE SETTINGS Service Record Config / Document
  ServiceRecordConfigList,
  ServiceRecordConfigAdd, 
  ServiceRecordConfigView,
  ServiceRecordConfigEdit,

  // ------------------------ Others / Machine Status ------------------------

  // MACHINE SETTINGS: MACHINE Statuses
  MachineStatusList,
  MachineStatusAdd, 
  MachineStatusView,
  MachineStatusEdit,

  // --------------------- Machine Settings --------------------------

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
    { element: <SimpleLayout />},
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
    // --------------------- Customer -----------------------

    {
      path: 'crm',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: 'contacts', element: <CustomerContactList />},
        { path: 'sites', element: <CustomerSiteList />},
        { path: 'customers',
          children: [
            { element: <CustomerList />, index: true  },
            { path: 'new', element: <CustomerAdd /> },
            { path: ':customerId/edit', element: <CustomerEdit />},
            { path: ':customerId/view', element: <CustomerView />},
            { path: ':customerId/sites',
            children: [
                { element: <CustomerSiteDynamicList />, index: true  },
                { path: 'new', element: <CustomerSiteDynamicList siteAddForm /> },
                { path: ':id/edit', element: <CustomerSiteDynamicList siteEditForm />},
                { path: ':id/view', element: <CustomerSiteDynamicList siteViewForm />}
              ],
            },
            { path: ':customerId/contacts',
              children: [
                { element: <CustomerContactDynamicList />, index: true  },
                { path: 'new', element: <CustomerContactDynamicList contactAddForm /> },
                { path: ':id/edit', element: <CustomerContactDynamicList contactEditForm />},
                { path: ':id/view', element: <CustomerContactDynamicList contactViewForm />},
                { path: ':id/move', element: <CustomerContactDynamicList contactMoveForm />},
              ],
            },
            { path: ':customerId/notes',
              children: [
                { element: <CustomerNoteList />, index: true  },
                { path: 'new', element: <CustomerNoteAdd /> },
                { path: ':id/edit', element: <CustomerNoteEdit />},
                { path: ':id/view', element: <CustomerNoteView />}
              ],
            },
            { path: ':customerId/documents',
              children: [
                { element: <CustomerDocumentList />, index: true  },
                { path: 'new', element: <CustomerDocumentAdd /> },
                { path: 'viewGallery', element: <CustomerDocumentGallery />},
                { path: ':id/edit', element: <CustomerDocumentEdit />},
                { path: 'gallery', element: <CustomerDocumentGallery />},
                {path: ':id/view', 
                  children:[
                    { element: <CustomerDocumentView/>, index: true },
                    { path: 'addFile', element: <CustomerDocumentAddFiles /> },
                    { path: 'newVersion', element: <CustomerDocumentNewVersion /> },
                  ]
                },
                {path: ':id/history', 
                  children:[
                    { element: <CustomerDocumentHistoryView/>, index: true },
                    { path: 'addFile', element: <CustomerDocumentHistoryAddFiles /> },
                    { path: 'newVersion', element: <CustomerDocumentHistoryNewVersion /> },
                  ]
                },
              ],
            },        
            { path: ':customerId/machines',
              children: [
                { element: <CustomerMachines />, index: true  },
                { path: 'new',element: <CustomerMachineAdd />  },
                { path: ':id/move',element: <CustomerMachineMove />  },
              ],
            },
            // ------------------------------ ARCHIVED CUSTOMERS ----------------------------------
            {
              path: 'archived',
              children: [
                { element: <CustomerList isArchived />, index: true },
                { path: ':id/view', element: <CustomerView isArchived/> },
              ],
            },
            { path: 'permission-denied', element: <PermissionDeniedPage /> },
            { path: 'blank', element: <BlankPage /> },
          ]
        },
      ],
    },
    // ------------------------- Machine ---------------------------
    { path: 'products',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { path: 'machines',
          children: [
            { element: <MachineList />, index: true },
            { path: 'new', element: <MachineAdd /> },  
            { path: ':machineId/view', element: <MachineView /> }, 
            { path: ':machineId/edit', element: <MachineEdit /> }, 
            { path: ':machineId/transfer', element: <MachineTransfer />},
            { path: 'serialNo',                 
              children: [
                  { path: ':serialNo/customer/:ref/view', element: <GetMachineId /> },
                  { path: ':serialNo', element: <GetMachineId /> },
                  { path: ':serialNo/:ref', element: <GetMachineId /> },
              ]
            },
            { path: ':machineId/settings',
              children:[
                {element: <SettingList/>, index: true },
                {path: 'new', element: <SettingAdd/>},
                {path: ':id/view', element: <SettingView/>},
                {path: ':id/edit', element: <SettingEdit/>}, 
              ]
            },
            { path: ':machineId/toolsInstalled',
              children:[
                {element: <MachineToolInstalledList/>, index: true},
                {path: 'new', element: <MachineToolInstalledAdd/>},
                {path: ':id/view', element: <MachineToolInstalledView/>},
                {path: ':id/edit', element: <MachineToolInstalledEdit/>}, 
              ]
            },
            { path: ':machineId/notes',
              children:[
                {element: <MachineNoteList/>, index: true},
                {path: 'new', element: <MachineNoteAdd/>},
                {path: ':id/view', element: <MachineNoteView/>},
                {path: ':id/edit', element: <MachineNoteEdit/>}, 
              ]
            },
            { path: ':machineId/drawings',
              children:[
                {element: <MachineDrawingList/>, index: true},
                {path: 'new', element: <MachineDrawingAdd />},
                {path: 'attach', element: <MachineDrawingAttach/>},
                {path: 'multipleNew', element: <MachineDrawingListAdd/>},
                {path: ':id/edit', element: <MachineDrawingEdit/>}, 
                {path: ':id/view', 
                  children:[
                    { element: <MachineDrawingView />, index: true },
                    { path: 'addFile', element: <MachineDrawingAddFile /> },
                    { path: 'newVersion', element: <MachineDrawingNewVersion /> },
                  ]
                },
              ]
            },
            { path: ':machineId/documents',
              children:[
                {element: <MachineDocumentList/>, index: true},
                {path: 'new', element: <MachineDocumentAdd/>},
                {path: 'gallery', element: <MachineDocumentGallery/>},
                {path: ':id/edit', element: <MachineDocumentEditForm/>},
                {path: ':id/newFile', element: <MachineDocumentViewForm/>},
                {path: ':id/newVersion', element: <MachineDocumentViewForm/>},
                {path: ':id/view', 
                  children:[
                    { element: <MachineDocumentViewForm />, index: true },
                    { path: 'addFile', element: <MachineDocumentAddFile /> },
                    { path: 'newVersion', element: <MachineDocumentNewVersion /> },
                  ]
                },
                {path: ':id/history', 
                  children:[
                    { element: <MachineDocumentHistoryViewForm />, index: true },
                    { path: 'addFile', element: <MachineDocumentHistoryAddFile /> },
                    { path: 'newVersion', element: <MachineDocumentHistoryNewVersion /> },
                  ]
                },
              ]
            },
            { path: ':machineId/licenses',
              children:[
                {element: <MachineLicenseList/>, index: true},
                {path: 'new', element: <MachineLicenseAdd/>},
                {path: ':id/view', element: <MachineLicenseView/>},
                {path: ':id/edit', element: <MachineLicenseEdit/>}, 
              ]
            },
            { path: ':machineId/profiles',
              children:[
                {element: <MachineProfileList/>, index: true},
                {path: 'new', element: <MachineProfileAdd/>},
                {path: ':id/view', element: <MachineProfileView/>},
                {path: ':id/edit', element: <MachineProfileEdit/>}, 
              ]
            },
            { path: ':machineId/serviceRecords',
              children:[
                {element: <MachineServiceRecordList/>, index: true},
                {path: 'new', element: <MachineServiceRecordAdd/>},
                {path: ':id/view', element: <MachineServiceRecordView/>},
                {path: ':id/edit', element: <MachineServiceRecordEdit/>}, 
                {path: ':serviceId/history',children:[
                    {element: <MachineServiceRecordHistoryList/>, index: true}, 
                    {path: ':id/view', element: <MachineServiceRecordView serviceHistoryView />},
                  ]
                }, 
              ]
            },
            { path: ':machineId/ini',
              children:[
                {element: <MachineINIList/>, index: true},
                {path: 'new', element: <MachineINIAdd/>},
                {path: ':id/view', element: <MachineINIView/>},
                {path: ':id1/:id2/compare', element: <MachineINICompareView/>}, 
              ]
            },
            { path: ':machineId/logs',
              children:[
                {element: <MachineLogsList/>, index: true},
                {path: 'new', element: <MachineLogsAdd/>},
                {path: 'graph', element: <MachineLogsGraphView/>}, 
                {path: ':id/view', element: <MachineLogsView/>},
              ]
            },
            // --------------------------- Machine Settings --------------------------------
            { path: 'machineSettings',
              children: [
              { element: <MachineSetting />, index: true },
              // --------------------- Machine Groups --------------------------------
              {
                path: 'groups',
                children:[
                  {element: <MachineGroupList />, index: true },
                  {path: 'new', element: <MachineGroupAdd />},
                  {path: ':id/view', element: <MachineGroupView />},
                  {path: ':id/edit', element: <MachineGroupEdit />},
                ]
              },
              // --------------------- Machine Categories --------------------------------
              { path: 'categories',
                children:[
                  {element: <MachineCategoryList/>, index: true },
                  {path: 'new', element: <MachineCategoryAdd/>},
                  {path: ':id/view', element: <MachineCategoryView/>},
                  {path: ':id/edit', element: <MachineCategoryEdit/>}, 
                ]
              },
              // ---------------------------- Machine Model -----------------------------
              { path: 'models',
                children:[
                  {element: <MachineModelList/>, index: true },
                  {path: 'new', element: <MachineModelAdd/>},
                  {path: ':id/view', element: <MachineModelView/>},
                  {path: ':id/edit', element: <MachineModelEdit/>},
                ]
              },
              // ---------------------------- Machine Model Supplier ------------------------------------
              { path : 'suppliers',
                children:[
                  { element: <MachineSupplierList/>, index: true }, 
                  { path: 'new', element: <MachineSupplierAdd /> },
                  { path: ':id/view', element: <MachineSupplierView/>},
                  { path: ':id/edit', element: <MachineSupplierEdit/>},
                ]
              },
              // -------------------------- Machine Tools ------------------------------
              { path: 'tools',
                children:[
                  {element: <MachineToolList/>, index: true },
                  {path: 'new', element: <MachineToolAdd/>},
                  {path: ':id/view', element: <MachineToolView/>},
                  {path: ':id/edit', element: <MachineToolEdit/>},
                ]
              },
              // --------------------- Check Item Categories --------------------------------
              { path: 'checkItemCategories',
                children:[
                  {element: <CheckItemCategoryList/>, index: true },
                  {path: 'new', element: <CheckItemCategoryAdd/>},
                  {path: ':id/view', element: <CheckItemCategoryView/>},
                  {path: ':id/edit', element: <CheckItemCategoryEdit/>},
                ]
              },
              // ------------------------ Check Item----------------------------------------
              { path: 'checkItems',
                children:[
                  {element: <CheckItemList/>, index: true },
                  {path: 'new', element: <CheckItemAdd/>},
                  {path: ':id/view', element: <CheckItemView/>},
                  {path: ':id/edit', element: <CheckItemEdit/>},
                ]
              },
              { path: 'serviceRecordsConfig',
                children:[
                  {element: <ServiceRecordConfigList/>, index: true },
                  {path: 'new', element: <ServiceRecordConfigAdd/>},
                  {path: ':id/copy', element: <ServiceRecordConfigAdd/>},
                  {path: ':id/view', element: <ServiceRecordConfigView/>},
                  {path: ':id/edit', element: <ServiceRecordConfigEdit/>},
                ]
              },
              // ----------------------------- Others / Machine Status -----------------------------------
              { path: 'status',
                children:[
                  {element: <MachineStatusList/>, index: true },
                  {path: 'new', element: <MachineStatusAdd/>},
                  {path: ':id/view', element: <MachineStatusView/>},
                  {path: ':id/edit', element: <MachineStatusEdit/>},
                ]
              },
              // ----------------- MACHINE Technical Parameters Categories ------------------------
              { path: 'technicalParameterCategories',
                children:[
                  {element: <TechnicalParameterCategoryList/>, index: true },
                  {path: 'new', element: <TechnicalParameterCategoryAdd/>},
                  {path: ':id/view', element: <TechnicalParameterCategoryView/>},
                  {path: ':id/edit', element: <TechnicalParameterCategoryEdit/>},
                ]
              },
              // ----------------------------- MACHINE Parameters -----------------------------------
              { path: 'technicalParameters',
                children:[
                  {element: <TechnicalParameterList/>, index: true },
                  {path: 'new', element: <TechnicalParameterAdd/>},
                  {path: ':id/view', element: <TechnicalParameterView/>},
                  {path: ':id/edit', element: <TechnicalParameterEdit/>},
                ]
              },
            ]
            },
            // ------------------------------ ARCHIVED MACHINES ----------------------------------
            {
              path: 'archived',
              children: [
                { element: <MachineList isArchived />, index: true },
                { path: ':id/view', element: <MachineView isArchived /> },
              ],
            },
          ]
        }, 
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },

    // SECURITY
    {
      path: 'security',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <SecurityUserList />, index: true },
        {
          path: 'users',
          children: [
            { path: 'profile', element: <SecurityUserProfile/> },
            { path: 'editProfile', element: <SecurityUserProfileEdit/> },
            { path: 'password', element: <SecurityUserChangePassword/> },
            { path: 'changePassword', element: <SecurityUserChangePasswordByAdmin/> },
            { path: 'new', element: <SecurityUserAdd /> },
            { path: 'invite', element: <SecurityUserAdd isInvite /> },
            { path: ':id/edit', element: <SecurityUserEdit /> },
            { path: ':id/view', element: <SecurityUserView /> },
          ],
        },
        {
          path: 'config',
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
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
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
        {element: <Setting  />, index: true },
        // ------------------------------ document Category ----------------------------------
        {
          path: 'documentCategory',
          children: [
            { path: 'list', element: <DocumentCategoryList /> },
            { path: 'new', element: <DocumentCategoryAdd /> },
            { path: ':id/edit', element: <DocumentCategoryEdit />},
            { path: ':id/view', element: <DocumentCategoryView />}
          ],
        },
        // ------------------------------ document Type ----------------------------------
        {
          path: 'documentType',
          children: [
            { path: 'list', element: <DocumentTypeList /> },
            { path: 'new', element: <DocumentTypeAdd /> },
            { path: ':id/edit', element: <DocumentTypeEdit />},
            { path: ':id/view', element: <DocumentTypeView />}
          ],
        },
        // ------------------------------ role ----------------------------------
        {
          path: 'role',
          children: [
            { path: 'list', element: <RoleList /> },
            { path: 'new', element: <RoleAdd /> },
            { path: ':id/edit', element: <RoleEdit />},
            { path: ':id/view', element: <RoleView />}
          ],
        },
        // ------------------------------ Sign In Logs ----------------------------------
        {
          path: 'signInLogs',
          children: [
            { path: 'list', element: <SignInLogList /> },
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
        // ------------------------------ departments ----------------------------------
        {
          path: 'departments',
          children: [
            { path: 'list', element: <DepartmentList /> },
            { path: 'new', element: <DepartmentAdd /> },
            { path: ':id/view', element: <DepartmentView /> },
            { path: ':id/edit', element: <DepartmentEdit /> }
          ],
        },
        // ------------------------------ PM2 Logs ----------------------------------
        {
          path: 'dbBackup',
          children: [
            {
              path: 'logs',
              children: [
                { element: <DbBackupLogsList /> , index: true },
                { path: ':id/view', element: <DbBackupLogsViewForm /> },
              ]
            }
          ],
        },
        // ------------------------------ DB BACKUP LOGS ----------------------------------
        {
          path: 'pm2',
          children: [
            {
              path: 'logs',
              children: [
                { element: <Pm2LogsList /> , index: true },
                { path: ':id/view', element: <Pm2LogView /> },
              ]
            }
          ],
        },
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
    // ------------------------------ DOCUMENNT ----------------------------------
    {
      path: 'documents',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {element: <DocumentList />, index: true},
        {path: 'new', element: <DocumentAdd /> },
        {path: 'newList', element: <DocumentAddList /> },
        {path: ':id/edit', element: <DocumentEdit /> },
        {path: ':id/gallery', element: <DocumentGallery /> },
        {path: ':id/view', 
          children:[
            { element: <DocumentView />, index: true },
            { path: 'addFile', element: <DocumentAddFile /> },
            { path: 'newVersion', element: <DocumentNewVersion /> },
          ]
        },
      ],
    },
        // ------------------------------ Drawings ----------------------------------
        {
          path: 'machineDrawings',
          element: (
            <AuthGuard>
              <DashboardLayout />
            </AuthGuard>
          ),
          children: [
            { element: <MachineDrawings/>, index: true  },
            { path: 'new', element: <MachineDrawingsAdd/> },
            { path: 'newList', element: <DocumentAddList machineDrawings /> },
            { path: ':id/edit', element: <MachineDrawingsEdit machineDrawings /> },
            {path: ':id/view', 
              children:[
                { element: <MachineDrawingsView />, index: true },
                { path: 'addFile', element: <MachineDrawingsAddFiles /> },
                { path: 'newVersion', element: <MachineDrawingsNewVersion /> },
              ]
            },
          ],
        },
    // ----------------------------- Sites Report -----------------------------------
    {
      // Sites
      path: 'site',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <SitesReport /> },
      ]
    },
    // ----------------------------- Email ----------------------------------
    { path: 'email',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'list', element: <Email /> },
        { path: ':id/view', element: <Emailview/> }
      ]
    },

  ]);
}
