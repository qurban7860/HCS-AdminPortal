import { Navigate, useRoutes } from 'react-router-dom';
// auth
import AuthGuard from '../auth/AuthGuard';
import GuestGuard from '../auth/GuestGuard';
// layouts
import MainLayout from '../layouts/main';
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
  // Dashboard: General
  GeneralAppPage,
  // User
  UserListPage,
  UserEditPage,
  UserCardsPage,
  UserCreatePage,
  UserProfilePage,
  UserAccountPage,
  // Asset
  AssetList,
  AssetAdd,
  AssetEdit,
  AssetView,
  // Customer
  CustomerDashboard,
  CustomerList,
  CustomerAdd,
  CustomerEdit,
  CustomerView,
  // Machine
  MachinePage,
  MachineAdd,
  // MachineList,
  // Supplier
  MachineSupplier,
  SupplierList,
  SupplierView,
  SupplierViewForm,
  SupplierEdit,
  SupplierEditForm,
  // License
  MachineLicenses,
  LicenseList,
  // Categories
  MachineCategories,
  CategoryList,
  CategoryView,
  CategoryViewForm,
  CategoryEditForm,
  CategoryEdit,
  // Tool
  MachineTool,
  ToolList,
  ToolView,
  ToolViewForm,
  ToolEdit,
  ToolEditForm,
  // MachineTechParamCategory
  MachineTechParam,
  TechParamList,
  TechParamCategoryViewForm,
  TechParamCategoryView,
  TechParamCategoryEdit,
  TechParamCategoryEditForm,
  // Status
  MachineStatus,
  StatusViewForm,
  StatusView,
  StatusEdit,
  StatusEditForm,
  StatusList,
  // Model
  MachineModel,
  ModelList,
  ModelViewForm,
  ModelView,
  ModelEdit,
  ModelEditForm,

  
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
  // 
  BlankPage,
  PermissionDeniedPage,
  //
  Page500,
  Page403,
  Page404,
  HomePage,
  ComingSoonPage,
  MaintenancePage,
  
  

  //
} from './elements';

// ----------------------------------------------------------------------

export default function Router() {
  return useRoutes([
    // Auth
    {
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
            { path: 'new-password', element: <NewPasswordPage /> },
            { path: 'verify', element: <VerifyCodePage /> },
          ],
        },
      ],
    },

    // Dashboard
    
    {
      path: 'dashboard',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <GeneralAppPage /> },
        {
          path: 'asset',
          children: [
            { path: 'list', element: <AssetList /> },
            { path: 'new', element: <AssetAdd /> },
            { path: ':id/edit', element: <AssetEdit />},
            { path: 'view', element: <AssetView />}
          ],
        },
        {
          path: 'user',
          children: [
            { element: <Navigate to="/dashboard/user/profile" replace />, index: true },
            { path: 'profile', element: <UserProfilePage /> },
            { path: 'cards', element: <UserCardsPage /> },
            { path: 'list', element: <UserListPage /> },
            { path: 'new', element: <UserCreatePage /> },
            { path: ':id/edit', element: <UserEditPage /> },
            { path: 'account', element: <UserAccountPage /> },
          ],
        },
        {
          path: 'customer',
          children: [
            { path: 'dashboard', element: <CustomerDashboard /> },
            { path: 'list', element: <CustomerList /> },
            { path: 'new', element: <CustomerAdd /> },
            { path: ':id/edit', element: <CustomerEdit />},
            { path: ':id/view', element: <CustomerView />}
          ],
        },
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
      path: 'customer',
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
        { path: 'view', element: <CustomerView />},
        
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
    // Machine
    {
      path : 'machine',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'app', element: <MachinePage /> }, 
        { path: 'new', element: <MachineAdd /> }, 
        // { path: 'list', element: <MachineList /> }, 
        {
          path : 'supplier',
          children:[
            { path: 'supplier', element: <MachineSupplier /> },
            { path: 'list', element: <SupplierList/>}, 
            { path: ':id/view', element: <SupplierView/>},
            { path: 'viewform', element: <SupplierViewForm/>},
            { path: ':id/edit', element: <SupplierEdit/>}, 
            { path: 'editform', element: <SupplierEditForm/>},
          ]
        },
        {
          path: 'license',
          children:[
            {path: 'license', element: <MachineLicenses/>},
            {path: 'list', element: <LicenseList/>}
          ]
        },
        {
          path: 'categories',
          children:[
            {path: 'categories', element: <MachineCategories/>},
            {path: 'list', element: <CategoryList/>},
            {path: ':id/view', element: <CategoryView/>},
            {path: 'viewform', element: <CategoryViewForm/>},
            {path: ':id/edit', element: <CategoryEdit/>}, 
            {path: 'editform', element: <CategoryEditForm/>},
          ]
        },
        {
          path: 'tool',
          children:[
            {path: 'tool', element: <MachineTool/>},
            {path: 'list', element: <ToolList/>},
            {path: ':id/view', element: <ToolView/>},
            {path: 'viewform', element: <ToolViewForm/>},
            {path: ':id/edit', element: <ToolEdit/>}, 
            {path: 'editform', element: <ToolEditForm/>},
          ]
        },
        {
          path: 'machine-tech',
          children:[
            {path: 'params', element: <MachineTechParam/>},
            {path: 'list', element: <TechParamList/>},
            {path: 'viewform', element: <TechParamCategoryViewForm/>},
            {path: ':id/view', element: <TechParamCategoryView/>},
            {path: ':id/edit', element: <TechParamCategoryEdit/>}, 
            {path: 'editform', element: <TechParamCategoryEditForm/>},
          ]
        },
        {
          path: 'machine-status',
          children:[
            {path: 'status', element: <MachineStatus/>},
            {path: 'list', element: <StatusList/>},
            {path: 'viewform', element: <StatusViewForm/>},
            {path: ':id/view', element: <StatusView/>},
            {path: ':id/edit', element: <StatusEdit/>}, 
            {path: 'editform', element: <StatusEditForm/>},
          ]
        },
        {
          path: 'machine-model',
          children:[
            {path: 'model', element: <MachineModel/>},
            {path: 'list', element: <ModelList/>},
            {path: 'viewform', element: <ModelViewForm/>},
            {path: ':id/view', element: <ModelView/>},
            {path: ':id/edit', element: <ModelEdit/>}, 
            {path: 'editform', element: <ModelEditForm/>},
          ]
        },
      ]
    },

    // Main Routes
    {
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
    {
      element: <CompactLayout />,
      children: [
        { path: 'coming-soon', element: <ComingSoonPage /> },
        { path: 'maintenance', element: <MaintenancePage /> },
        { path: '500', element: <Page500 /> },
        { path: '404', element: <Page404 /> },
        { path: '403', element: <Page403 /> },
      ],
    },
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
