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
  // Dashboard: General
  GeneralAppPage,
  // User
  SecurityUserList,
  SecurityUserEdit,
  SecurityUserAdd,
  SecurityUserProfile,
  SecurityUserChangePassword,
  SecurityUserChangePasswordByAdmin,

  SecurityUserViewForm,
  // Customer
  CustomerDashboard,
  CustomerList,
  CustomerAdd,
  CustomerEdit,
  CustomerView,
  // Machine
  MachineSetting,
  MachineAdd,
  MachineList,
  MachineView,
  MachineEdit,
  // Supplier
  SupplierAddForm,
  SupplierList,
  SupplierView,
  SupplierViewForm,
  SupplierEdit,
  SupplierEditForm,

  MachineServiceParamList, 
  MachineServiceParamViewForm,
  MachineServiceParamEditForm,
  MachineServiceParamAddForm,

  // License
  // MachineLicenses,
  // LicenseList,
  // Categories

  CategoryAddForm,
  CategoryList,
  CategoryView,
  CategoryViewForm,
  CategoryEditForm,
  CategoryEdit,

  // Parameters
  ParameterAddForm,
  ParameterList,
  ParameterView,
  ParameterViewForm,
  ParameterEditForm,
  ParameterEdit,

  // Tool
  ToolAddForm,
  ToolList,
  ToolView,
  ToolViewForm,
  ToolEdit,
  ToolEditForm,

  // MachineTechParamCategory
  TechParamCategoryAddForm,
  TechParamList,
  TechParamCategoryViewForm,
  TechParamCategoryView,
  TechParamCategoryEdit,
  TechParamCategoryEditForm,

  // Status
  StatusAddForm,
  StatusViewForm,
  StatusView,
  StatusEdit,
  StatusEditForm,
  StatusList,

  // Model
  ModelAddForm,
  ModelList,
  ModelViewForm,
  ModelView,
  ModelEdit,
  ModelEditForm,

  // Role
  RoleList,
  RoleAdd,
  RoleView,
  RoleEdit,

  // USER CONFIG
  UserConfigList,
  UserConfigAddForm,
  UserConfigEditForm,
  UserConfigViewForm,

  // Site
  SiteList,
  SiteAdd,
  SiteEdit,
  SiteView,

  // Contact
  ContactList,
  ContactAdd,
  ContactEdit,
  ContactView,

  // Note
  NoteList,
  NoteAdd,
  NoteEdit,
  NoteView,

  // Document Name
  DocumentNameAddForm  ,
  DocumentNameList     ,
  DocumentNameViewForm ,
  DocumentNameEditForm ,

// File Category
  DocumentCategoryAddForm  ,
  DocumentCategoryList     ,
  DocumentCategoryView ,
  DocumentCategoryEditForm ,
  // Service Record Config
  ServiceRecordConfigAddForm,
  ServiceRecordConfigList,
  ServiceRecordConfigView,
  ServiceRecordConfigViewForm,
  ServiceRecordConfigEditForm,
  ServiceRecordConfigEdit,

  // DocumentDashboard    
  DocumentList, 
  DocumentAddForm, 
  DocumentEditForm, 
  DocumentViewForm, 
  
  // MachineDocumentView,
  MachineDrawings,
  MachineDrawingsAddForm,
  MachineDrawingsViewForm,

  // Setting
  Setting,
  // Email 
  Email,
  Emailviewform,

  // Reports
  Reports,
  SignInLogList,

  // Regions
  RegionList,
  RegionAdd,
  RegionView,
  RegionEdit,

   // modules
   ModuleList,
   ModuleAdd,
   ModuleEdit,
   ModuleView,

  // Configs
  ConfigList,
  ConfigAdd,
  ConfigView,
  ConfigEdit,

//   
  BlankPage,
  PermissionDeniedPage,
//
  Page500,
  Page403,
  Page404,
  ComingSoonPage,
  MaintenancePage,
  ErrorPage,
  UserInviteLanding
  
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
    {
      // Dashboard
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    {
      // Customers
      path: 'customers',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <CustomerDashboard /> },
        { path: 'list', element: <CustomerList /> },
        { path: 'new', element: <CustomerAdd /> },
        { path: ':id/edit', element: <CustomerEdit />},
        { path: ':id/view', element: <CustomerView />},
        {
          path: 'site',
          children: [
            { path: 'list', element: <SiteList /> },
            { path: 'new', element: <SiteAdd /> },
            { path: ':id/edit', element: <SiteEdit />},
            { path: ':id/view', element: <SiteView />}
          ],
        },
        {
          path: 'contact',
          children: [
            { path: 'list', element: <ContactList /> },
            { path: 'new', element: <ContactAdd /> },
            { path: ':id/edit', element: <ContactEdit />},
            { path: ':id/view', element: <ContactView />}
          ],
        },
        {
          path: 'note',
          children: [
            { path: 'list', element: <NoteList /> },
            { path: 'new', element: <NoteAdd /> },
            { path: ':id/edit', element: <NoteEdit />},
            { path: ':id/view', element: <NoteView />}
          ],
        },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    {
      // Machine
      path: 'products',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'machines',
          children: [
            { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
            { path: 'new', element: <MachineAdd /> }, 
            { path: 'list', element: <MachineList /> }, 
            { path: ':id/view', element: <MachineView /> }, 
            { path: ':id/edit', element: <MachineEdit /> }, 
            { path: 'settings',
              children: [
              {path: 'app', element: <MachineSetting />},
              {
                path: 'categories',
                children:[
                  {path: 'new', element: <CategoryAddForm/>},
                  {path: 'list', element: <CategoryList/>},
                  {path: ':id/view', element: <CategoryView/>},
                  {path: 'viewform', element: <CategoryViewForm/>},
                  {path: ':id/edit', element: <CategoryEdit/>}, 
                  {path: 'editform', element: <CategoryEditForm/>},
                ]
              },
              {
                path: 'serviceRecordConfigs',
                children:[
                  {path: 'new', element: <ServiceRecordConfigAddForm/>},
                  {path: 'list', element: <ServiceRecordConfigList/>},
                  {path: ':id/view', element: <ServiceRecordConfigView/>},
                  {path: 'viewform', element: <ServiceRecordConfigViewForm/>},
                  {path: ':id/edit', element: <ServiceRecordConfigEdit/>}, 
                  {path: 'editform', element: <ServiceRecordConfigEditForm/>},
                ]
              },
              {
                path: 'model',
                children:[
                  {path: 'new', element: <ModelAddForm/>},
                  {path: 'list', element: <ModelList/>},
                  {path: 'viewform', element: <ModelViewForm/>},
                  {path: ':id/view', element: <ModelView/>},
                  {path: ':id/edit', element: <ModelEdit/>}, 
                  {path: 'editform', element: <ModelEditForm/>},
                ]
              },
              {
                path : 'supplier',
                children:[
                  { path: 'new', element: <SupplierAddForm /> },
                  { path: 'list', element: <SupplierList/>}, 
                  { path: ':id/view', element: <SupplierView/>},
                  // { path: 'viewform', element: <SupplierViewForm/>},
                  { path: ':id/edit', element: <SupplierEdit/>}, 
                  // { path: 'editform', element: <SupplierEditForm/>},
                ]
              },
              {
                path: 'status',
                children:[
                  {path: 'new', element: <StatusAddForm/>},
                  {path: 'list', element: <StatusList/>},
                  {path: 'viewform', element: <StatusViewForm/>},
                  {path: ':id/view', element: <StatusView/>},
                  {path: ':id/edit', element: <StatusEdit/>}, 
                  {path: 'editform', element: <StatusEditForm/>},
                ]
              },
              {
                path: 'technicalParameterCategories',
                children:[
                  {path: 'new', element: <TechParamCategoryAddForm/>},
                  {path: 'list', element: <TechParamList/>},
                  {path: 'viewform', element: <TechParamCategoryViewForm/>},
                  {path: ':id/view', element: <TechParamCategoryView/>},
                  {path: ':id/edit', element: <TechParamCategoryEdit/>}, 
                  {path: 'editform', element: <TechParamCategoryEditForm/>},
                ]
              },
              {
                path: 'machineServiceParams',
                children:[
                  {path: 'new', element: <MachineServiceParamAddForm/>},
                  {path: 'list', element: <MachineServiceParamList/>},
                  {path: ':id/view', element: <MachineServiceParamViewForm/>},
                  {path: ':id/edit', element: <MachineServiceParamEditForm/>},
                ]
              },
              {
                path: 'parameters',
                children:[
                  {path: 'new', element: <ParameterAddForm/>},
                  {path: 'list', element: <ParameterList/>},
                  {path: ':id/view', element: <ParameterView/>},
                  {path: 'viewform', element: <ParameterViewForm/>},
                  {path: ':id/edit', element: <ParameterEdit/>}, 
                  {path: 'editform', element: <ParameterEditForm/>},
                ]
              },
              {
                path: 'tool',
                children:[
                  {path: 'new', element: <ToolAddForm/>},
                  {path: 'list', element: <ToolList/>},
                  {path: ':id/view', element: <ToolView/>},
                  {path: 'viewform', element: <ToolViewForm/>},
                  {path: ':id/edit', element: <ToolEdit/>}, 
                  {path: 'editform', element: <ToolEditForm/>},
                ]
              },
            ]
            }
          ]
        }, 
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    {
      // Email
      path: 'email',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'list', element: <Email /> },
        { path: ':id/view', element: <Emailviewform/> }
      ]
    },
    {
      // SECURITY
      path: 'security',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {
          path: 'users',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <SecurityUserProfile/> },
            { path: 'password', element: <SecurityUserChangePassword/> },
            { path: 'changePassword', element: <SecurityUserChangePasswordByAdmin/> },
            { path: 'list', element: <SecurityUserList /> },
            { path: 'new', element: <SecurityUserAdd /> },
            { path: ':id/edit', element: <SecurityUserEdit /> },
            { path: ':id/view', element: <SecurityUserViewForm /> },
          ],
        }, 
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    {
      // SETTING
      path: 'settings',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <Setting /> },
        {
          path: 'documentCategory',
          children: [
            { path: 'list', element: <DocumentCategoryList /> },
            { path: 'new', element: <DocumentCategoryAddForm /> },
            { path: ':id/edit', element: <DocumentCategoryEditForm />},
            { path: ':id/view', element: <DocumentCategoryView />}
          ],
        },
        {
          path: 'documentType',
          children: [
            { path: 'list', element: <DocumentNameList /> },
            { path: 'new', element: <DocumentNameAddForm /> },
            { path: ':id/edit', element: <DocumentNameEditForm />},
            { path: ':id/view', element: <DocumentNameViewForm />}
          ],
        },
        {
          path: 'role',
          children: [
            { path: 'list', element: <RoleList /> },
            { path: 'new', element: <RoleAdd /> },
            { path: ':id/edit', element: <RoleEdit />},
            { path: ':id/view', element: <RoleView />}
          ],
        },
        {
          path: 'signInLogs',
          children: [
            { path: 'list', element: <SignInLogList /> },
          ],
        },
        {
          path: 'regions',
          children: [
            { path: 'list', element: <RegionList /> },
            { path: 'new', element: <RegionAdd /> },
            { path: ':id/view', element: <RegionView /> },
            { path: ':id/edit', element: <RegionEdit /> }
          ],
        },
        {
          path: 'modules',
          children: [
            { path: 'list', element: <ModuleList /> },
            { path: 'new', element: <ModuleAdd /> },
            { path: ':id/view', element: <ModuleView /> },
            { path: ':id/edit', element: <ModuleEdit /> }
          ],
        },
        {
          path: 'configs',
          children: [
            { path: 'list', element: <ConfigList /> },
            { path: 'new', element: <ConfigAdd /> },
            { path: ':id/view', element: <ConfigView /> },
            { path: ':id/edit', element: <ConfigEdit /> }
          ],
        },
        {
          path: 'userConfig',
          children: [
            { path: 'list', element: <UserConfigList /> },
            { path: 'new', element: <UserConfigAddForm /> },
            { path: ':id/view', element: <UserConfigViewForm /> },
            { path: ':id/edit', element: <UserConfigEditForm /> }

          ],
        },
      ],
    },
    {
      // DOCUMENNT
      path: 'documents',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        {element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        {path: 'list',element: <DocumentList />},
        {path: 'new', element: <DocumentAddForm /> },
        {path: ':id/edit', element: <DocumentEditForm /> },
        {path: ':id/view', element: <DocumentViewForm /> },
        // {path: ':id/customer',element: <CustomerDocumentView />},
        // {path: ':id/machine',element: <MachineDocumentView/>},
        {path: 'machineDrawings',
          children: [
            { path: 'list', element: <MachineDrawings/> },
            { path: 'new', element: <MachineDrawingsAddForm/> },
            { path: ':id/view', element: <MachineDrawingsViewForm /> },
          ]
        }
      ],
    },
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
        { path: 'app', element: <Reports /> },
      ]
    },
    {
      // Main Routes
      element: <DashboardLayout />,
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
      ],
    },
    {
      element: <SimpleLayout />,
      children: [
        { path: 'invite/:id/:code/:expiry', element: <UserInviteLanding /> },
      ],
    },
    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
        { path: 'invalidErrorPage', element: <ErrorPage title='Invalid Code' /> },
        { path: 'expiredErrorPage', element: <ErrorPage title='Invitation Expired' /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
