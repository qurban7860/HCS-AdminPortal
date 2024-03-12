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
  MachineByModelsViewForm,
  MachineByYearsViewForm,
  MachineByCountriesViewForm,
  // User
  SecurityUserList,
  SecurityUserEdit,
  SecurityUserAdd,
  SecurityUserProfile,
  SecurityUserProfileEditForm,
  SecurityUserChangePassword,
  SecurityUserChangePasswordByAdmin,

  SecurityUserViewForm,
  // Customer
  CustomerList,
  CustomerAdd,
  CustomerEdit,
  CustomerView,

  // Customer Machines
  CustomerMachines,
  // Machine
  MachineSetting,
  MachineAdd,
  MachineList,
  MachineView,
  MachineEdit,
  MachineTransfer,

  // Supplier
  SupplierAddForm,
  SupplierList,
  SupplierView,
  SupplierEdit,
  // SupplierEditForm,

  // Check Items
  CheckItemList, 
  CheckItemViewForm,
  CheckItemEditForm,
  CheckItemAddForm,

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

  // Site
  CustomerSiteDynamicList,
  CustomerSiteList,

  // Contact
  CustomerContactDynamicList,
  CustomerContactList,
  // Note
  NoteList,
  NoteAddForm,
  NoteEditForm,
  NoteViewForm,

  // customer Documents
  CustomerDocumentList,
  CustomerDocumentAddForm,
  CustomerDocumentEditForm,
  CustomerDocumentViewForm,
  CustomerDocumentHistoryViewForm,
  CustomerDocumentGallery,

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

  // Servivce Categories
  ServiceCategoryAddForm,
  ServiceCategoryList,
  ServiceCategoryView,
  ServiceCategoryViewForm,
  ServiceCategoryEditForm,
  ServiceCategoryEdit,

  // DocumentDashboard    
  DocumentList, 
  DocumentAddForm, 
  DocumentAddListForm,
  DocumentEditForm, 
  DocumentViewForm,
  DocumentGallery, 
  
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

  // Configuration
  ConfigurationAdd,
  ConfigurationList,
  ConfigurationEdit,
  ConfigurationView, 

   // User Invite
   UserInvitationList,
   UserInvitationView,

//   
  BlankPage,
  PermissionDeniedPage,

  // Departmennts
  DepartmentAdd, 
  DepartmentList,
  DepartmentEdit,
  DepartmentView,

//
  Page500,
  Page403,
  Page404,
  ComingSoonPage,
  MaintenancePage,
  ErrorPage,
  UserInviteLanding,
  BlockedCustomerAddForm,
  BlockedCustomerList,
  BlockedUserList,
  BlockedUserAddForm,
  BlacklistIPList,
  BlacklistIPAddForm,
  WhitelistIPList,
  WhitelistIPAddForm,
  GroupAddForm,
  GroupViewForm,
  GroupEditForm,
  GroupList,
  
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
        { element: <GeneralAppPage to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'machineByCountries', element: <MachineByCountriesViewForm /> },
        { path: 'machineByModels', element: <MachineByModelsViewForm /> },
        { path: 'machineByYears', element: <MachineByYearsViewForm /> },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    {
      // Customers
      path: 'crm/customers',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <CustomerList />, index: true  },
        { path: 'new', element: <CustomerAdd /> },
        { path: ':id/edit', element: <CustomerEdit />},
        { path: ':id/view', element: <CustomerView />},
        { path: 'sites', element: <CustomerSiteList />},
        { path: 'contacts', element: <CustomerContactList />},

        { path: ':customerId/site',
          children: [
            { element: <CustomerSiteDynamicList />, index: true  },
            { path: 'new', element: <CustomerSiteDynamicList siteAddForm /> },
            { path: ':id/edit', element: <CustomerSiteDynamicList siteEditForm />},
            { path: ':id/view', element: <CustomerSiteDynamicList siteViewForm />}
          ],
        },
        { path: ':customerId/contact',
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
            { element: <NoteList />, index: true  },
            { path: 'new', element: <NoteAddForm /> },
            { path: ':id/edit', element: <NoteEditForm />},
            { path: ':id/view', element: <NoteViewForm />}
          ],
        },
        { path: ':customerId/documents',
          children: [
            { element: <CustomerDocumentList />, index: true  },
            { path: 'new', element: <CustomerDocumentAddForm /> },
            { path: 'viewGallery', element: <CustomerDocumentGallery />},
            { path: ':id/edit', element: <CustomerDocumentEditForm />},
            { path: ':id/view', element: <CustomerDocumentViewForm />},
            { path: ':id/viewHistory', element: <CustomerDocumentHistoryViewForm />},
            { path: 'gallery', element: <CustomerDocumentGallery />},
          ],
        },        
        { path: ':customerId/machines',
          children: [
            { element: <CustomerMachines />, index: true  },
          ],
        },
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
    },
    // Machine
    { path: 'products',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'machines',
          children: [
            { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
            { path: 'new', element: <MachineAdd /> }, 
            { path: 'list', element: <MachineList /> }, 
            { path: ':id/view', element: <MachineView /> }, 
            { path: ':id/edit', element: <MachineEdit /> }, 
            { path: ':id/transfer', element: <MachineTransfer />},
            { path: 'settings',
              children: [
              { path: 'app', element: <MachineSetting />},
              {
                path: 'groups',
                children:[
                  {path: 'new', element: <GroupAddForm />},
                  {path: 'list', element: <GroupList />},
                  {path: ':id/view', element: <GroupViewForm />},
                  {path: ':id/edit', element: <GroupEditForm />},
                ]
              },
              { path: 'categories',
                children:[
                  {path: 'new', element: <CategoryAddForm/>},
                  {path: 'list', element: <CategoryList/>},
                  {path: ':id/view', element: <CategoryView/>},
                  {path: 'viewform', element: <CategoryViewForm/>},
                  {path: ':id/edit', element: <CategoryEdit/>}, 
                  {path: 'editform', element: <CategoryEditForm/>},
                ]
              },
              { path: 'serviceCategories',
                children:[
                  {path: 'new', element: <ServiceCategoryAddForm/>},
                  {path: 'list', element: <ServiceCategoryList/>},
                  {path: ':id/view', element: <ServiceCategoryView/>},
                  {path: 'viewform', element: <ServiceCategoryViewForm/>},
                  {path: ':id/edit', element: <ServiceCategoryEdit/>}, 
                  {path: 'editform', element: <ServiceCategoryEditForm/>},
                ]
              },
              { path: 'serviceRecordConfigs',
                children:[
                  {path: 'new', element: <ServiceRecordConfigAddForm/>},
                  {path: ':id/copy', element: <ServiceRecordConfigAddForm/>},
                  {path: 'list', element: <ServiceRecordConfigList/>},
                  {path: ':id/view', element: <ServiceRecordConfigView/>},
                  {path: 'viewform', element: <ServiceRecordConfigViewForm/>},
                  {path: ':id/edit', element: <ServiceRecordConfigEdit/>}, 
                  {path: 'editform', element: <ServiceRecordConfigEditForm/>},
                ]
              },
              { path: 'model',
                children:[
                  {path: 'new', element: <ModelAddForm/>},
                  {path: 'list', element: <ModelList/>},
                  {path: 'viewform', element: <ModelViewForm/>},
                  {path: ':id/view', element: <ModelView/>},
                  {path: ':id/edit', element: <ModelEdit/>}, 
                  {path: 'editform', element: <ModelEditForm/>},
                ]
              },
              { path : 'supplier',
                children:[
                  { path: 'new', element: <SupplierAddForm /> },
                  { path: 'list', element: <SupplierList/>}, 
                  { path: ':id/view', element: <SupplierView/>},
                  // { path: 'viewform', element: <SupplierViewForm/>},
                  { path: ':id/edit', element: <SupplierEdit/>}, 
                  // { path: 'editform', element: <SupplierEditForm/>},
                ]
              },
              { path: 'status',
                children:[
                  {path: 'new', element: <StatusAddForm/>},
                  {path: 'list', element: <StatusList/>},
                  {path: 'viewform', element: <StatusViewForm/>},
                  {path: ':id/view', element: <StatusView/>},
                  {path: ':id/edit', element: <StatusEdit/>}, 
                  {path: 'editform', element: <StatusEditForm/>},
                ]
              },
              { path: 'technicalParameterCategories',
                children:[
                  {path: 'new', element: <TechParamCategoryAddForm/>},
                  {path: 'list', element: <TechParamList/>},
                  {path: 'viewform', element: <TechParamCategoryViewForm/>},
                  {path: ':id/view', element: <TechParamCategoryView/>},
                  {path: ':id/edit', element: <TechParamCategoryEdit/>}, 
                  {path: 'editform', element: <TechParamCategoryEditForm/>},
                ]
              },
              { path: 'checkItems',
                children:[
                  {path: 'new', element: <CheckItemAddForm/>},
                  {path: 'list', element: <CheckItemList/>},
                  {path: ':id/view', element: <CheckItemViewForm/>},
                  {path: ':id/edit', element: <CheckItemEditForm/>},
                ]
              },
              { path: 'parameters',
                children:[
                  {path: 'new', element: <ParameterAddForm/>},
                  {path: 'list', element: <ParameterList/>},
                  {path: ':id/view', element: <ParameterView/>},
                  {path: 'viewform', element: <ParameterViewForm/>},
                  {path: ':id/edit', element: <ParameterEdit/>}, 
                  {path: 'editform', element: <ParameterEditForm/>},
                ]
              },
              { path: 'tool',
                children:[
                  {path: 'new', element: <ToolAddForm/>},
                  {path: 'list', element: <ToolList/>},
                  {path: ':id/view', element: <ToolView/>},
                  {path: 'viewform', element: <ToolViewForm/>},
                  {path: ':id/edit', element: <ToolEdit/>}, 
                  {path: 'editform', element: <ToolEditForm/>},
                ]
              },
              { path: 'configuration',
                children:[
                  {path: 'new', element: <ConfigurationAdd/>},
                  {path: 'list', element: <ConfigurationList/>},
                  {path: ':id/view', element: <ConfigurationView/>},
                  {path: ':id/edit', element: <ConfigurationEdit/>}, 
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
    // Email
    { path: 'email',
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
            { path: 'editProfile', element: <SecurityUserProfileEditForm/> },
            { path: 'password', element: <SecurityUserChangePassword/> },
            { path: 'changePassword', element: <SecurityUserChangePasswordByAdmin/> },
            { path: 'new', element: <SecurityUserAdd /> },
            { path: 'invite', element: <SecurityUserAdd isInvite /> },
            { path: ':id/edit', element: <SecurityUserEdit /> },
            { path: ':id/view', element: <SecurityUserViewForm /> },
          ],
        },
        {
          path: 'config',
          children: [
            {
              path: 'blockedCustomer',
              children: [
                { path: 'list', element: <BlockedCustomerList /> },
                { path: 'new', element: <BlockedCustomerAddForm /> },
              ],
            },
            {
              path: 'blockedUser',
              children: [
                { path: 'list', element: <BlockedUserList /> },
                { path: 'new', element: <BlockedUserAddForm /> },
              ],
            },
            {
              path: 'blacklistIP',
              children: [
                { path: 'list', element: <BlacklistIPList /> },
                { path: 'new', element: <BlacklistIPAddForm /> },
              ],
            },
            {
              path: 'whitelistIP',
              children: [
                { path: 'list', element: <WhitelistIPList /> },
                { path: 'new', element: <WhitelistIPAddForm /> },
              ],
            },
          ]
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
        {element: <Setting  />, index: true },
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
          path: 'departments',
          children: [
            { path: 'list', element: <DepartmentList /> },
            { path: 'new', element: <DepartmentAdd /> },
            { path: ':id/view', element: <DepartmentView /> },
            { path: ':id/edit', element: <DepartmentEdit /> }
          ],
        },
        {
          path: 'invite',
          children: [
            { path: 'list', element: <UserInvitationList /> },
            { path: ':id/view', element: <UserInvitationView /> },
          ],
        }
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
        {path: 'newList', element: <DocumentAddListForm /> },
        {path: ':id/edit', element: <DocumentEditForm /> },
        {path: ':id/view', element: <DocumentViewForm /> },
        {path: ':id/gallery', element: <DocumentGallery /> },
        // {path: ':id/customer',element: <CustomerDocumentView />},
        // {path: ':id/machine',element: <MachineDocumentView/>},
        {path: 'machineDrawings',
          children: [
            { path: 'list', element: <MachineDrawings/> },
            { path: 'new', element: <MachineDrawingsAddForm/> },
            {path: 'newList', element: <DocumentAddListForm machineDrawings /> },
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
      ],
    },
    { path: 'invite/:id/:code/:expiry', element: <UserInviteLanding /> },
    { path: '500', element: <Page500 /> },
    { path: '403', element: <Page403 /> },
    { path: '404', element: <Page404 /> },
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
  ]);
}
