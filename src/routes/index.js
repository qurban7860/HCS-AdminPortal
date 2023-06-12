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
  MachinePage,
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

// Customer document 
  CustomerDocumentAddForm  ,
  CustomerDocumentList     ,
  CustomerDocumentViewForm ,
  CustomerDocumentEditForm ,
//  machine document
  MachineDocumentAddForm  ,
  MachineDocumentList     ,
  MachineDocumentViewForm ,
  MachineDocumentEditForm ,

  // DocumentDashboard    
  DocumentDashboard, 
  DocumentAddForm, 
  DocumentEditForm, 
  DocumentViewForm, 
  CustomerDocumentView,
  MachineDocumentView,

// Setting

  Setting,

// Reports
  Reports,
//   
  BlankPage,
  PermissionDeniedPage,
//
  Page500,
  Page403,
  Page404,
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
            { path: 'new-password/:token/:userId', element: <NewPasswordPage /> }, 
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
        { path: 'setting', element: <Setting /> },
        { path: 'reports', element: <Reports /> },
        { path: 'document', element: <DocumentDashboard /> },
        { path: 'document', element: <DocumentDashboard /> },
        { path: 'document',
          children: [
            {path: 'dashboard',element: <DocumentDashboard />},
            { path: 'new', element: <DocumentAddForm /> },
            { path: ':id/edit', element: <DocumentEditForm /> },
            { path: ':id/view', element: <DocumentViewForm /> },
            {path: ':id/customer',element: <CustomerDocumentView />},
            {path: ':id/machine',element: <MachineDocumentView/>} ,
          ]
        },
        {
          path: 'user',
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
        { path: 'list', element: <MachineList /> }, 
        { path: ':id/view', element: <MachineView /> }, 
        { path: ':id/edit', element: <MachineEdit /> }, 

        {
          path : 'supplier',
          children:[
            { path: 'supplier', element: <SupplierAddForm /> },
            { path: 'list', element: <SupplierList/>}, 
            { path: ':id/view', element: <SupplierView/>},
            { path: 'viewform', element: <SupplierViewForm/>},
            { path: ':id/edit', element: <SupplierEdit/>}, 
            { path: 'editform', element: <SupplierEditForm/>},
          ]
        },
        // {
        //   path: 'license',
        //   children:[
        //     {path: 'license', element: <MachineLicenses/>},
        //     {path: 'list', element: <LicenseList/>}
        //   ]
        // },
        {
          path: 'categories',
          children:[
            {path: 'categories', element: <CategoryAddForm/>},
            {path: 'list', element: <CategoryList/>},
            {path: ':id/view', element: <CategoryView/>},
            {path: 'viewform', element: <CategoryViewForm/>},
            {path: ':id/edit', element: <CategoryEdit/>}, 
            {path: 'editform', element: <CategoryEditForm/>},
          ]
        },
        {
          path: 'machine-parameters',
          children:[
            {path: 'params', element: <ParameterAddForm/>},
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
            {path: 'tool', element: <ToolAddForm/>},
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
            {path: 'params', element: <TechParamCategoryAddForm/>},
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
            {path: 'status', element: <StatusAddForm/>},
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
            {path: 'model', element: <ModelAddForm/>},
            {path: 'list', element: <ModelList/>},
            {path: 'viewform', element: <ModelViewForm/>},
            {path: ':id/view', element: <ModelView/>},
            {path: ':id/edit', element: <ModelEdit/>}, 
            {path: 'editform', element: <ModelEditForm/>},
          ]
        },
      ]
    },
    {
      path: 'document',
      element: (
        <AuthGuard>
          <DashboardLayout />
        </AuthGuard>
      ),
      children: [
        { element: <Navigate to={PATH_AFTER_LOGIN} replace />, index: true },
        { path: 'list', element: <DocumentNameList /> },
        { path: 'new', element: <DocumentNameAddForm /> },
        { path: ':id/edit', element: <DocumentNameEditForm />},
        { path: ':id/view', element: <DocumentNameViewForm />}, 
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
        { path: 'permission-denied', element: <PermissionDeniedPage /> },
        { path: 'blank', element: <BlankPage /> },
      ],
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
