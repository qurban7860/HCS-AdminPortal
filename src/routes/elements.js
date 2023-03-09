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

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));

// ASSET
export const AssetList= Loadable(  lazy(() => import('../pages/asset/AssetList')));
export const AssetAdd = Loadable(  lazy(() => import('../pages/asset/AssetAdd')));
export const AssetEdit = Loadable(  lazy(() => import('../pages/asset/AssetEdit')));
export const AssetView = Loadable(  lazy(() => import('../pages/asset/AssetView')));

// CUSTOMER
export const CustomerDashboard = Loadable(  lazy(() => import('../pages/customer/CustomerDashboardPage')));

export const CustomerList= Loadable(  lazy(() => import('../pages/customer/CustomerList')));
export const CustomerAdd = Loadable(  lazy(() => import('../pages/customer/CustomerAdd')));
export const CustomerEdit = Loadable(  lazy(() => import('../pages/customer/CustomerEdit')));
export const CustomerView = Loadable(  lazy(() => import('../pages/customer/CustomerView')));

// Machine
export const MachinePage = Loadable(lazy(()=> import('../pages/machine/Machine')));
export const MachineAdd = Loadable(lazy(()=> import('../pages/machine/MachineAddForm')));
// Supplier
export const MachineSupplier = Loadable(lazy(()=> import('../pages/machine/Supplier/MachineSuppliers')));
export const SupplierList = Loadable(lazy(()=> import('../pages/machine/Supplier/SupplierList')));
export const SupplierView = Loadable(lazy(()=> import('../pages/machine/Supplier/SupplierView')));
export const SupplierViewForm = Loadable(lazy(()=> import('../pages/machine/Supplier/SupplierViewForm')));
export const SupplierEdit = Loadable(lazy(()=> import('../pages/machine/Supplier/SupplierEdit')));
export const SupplierEditForm = Loadable(lazy(()=> import('../pages/machine/Supplier/SupplierEditForm')));
// License
export const MachineLicenses = Loadable(lazy(()=> import('../pages/machine/License/MachineLicenses')));
export const LicenseList = Loadable(lazy(()=> import('../pages/machine/License/LicenseList')));

// Machine Categories
export const MachineCategories = Loadable(lazy(()=> import('../pages/machine/Categories/MachineCategories')));
export const CategoryList = Loadable(lazy(()=> import('../pages/machine/Categories/CategoryList')));
export const CategoryView = Loadable(lazy(()=> import('../pages/machine/Categories/CategoryView')));
export const CategoryViewForm = Loadable(lazy(()=> import('../pages/machine/Categories/CategoryViewForm')));
export const CategoryEdit = Loadable(lazy(()=> import('../pages/machine/Categories/CategoryEdit')));
export const CategoryEditForm = Loadable(lazy(()=> import('../pages/machine/Categories/CategoryEditForm')));

// Machine Tools
export const MachineTool = Loadable(lazy(()=> import('../pages/machine/Tool/MachineTool')));
export const ToolList = Loadable(lazy(()=> import('../pages/machine/Tool/ToolList')));
export const ToolView = Loadable(lazy(()=> import('../pages/machine/Tool/ToolView')));
export const ToolViewForm = Loadable(lazy(()=> import('../pages/machine/Tool/ToolViewForm')));
export const ToolEdit = Loadable(lazy(()=> import('../pages/machine/Tool/ToolEdit')));
export const ToolEditForm = Loadable(lazy(()=> import('../pages/machine/Tool/ToolEditForm')));

// MachineTechParam
export const MachineTechParam = Loadable(lazy(()=> import('../pages/machine/TechParamCategory/MachineTechParam')));
export const TechParamList = Loadable(lazy(()=> import('../pages/machine/TechParamCategory/TechParamList')));
export const TechParamCategoryViewForm = Loadable(lazy(()=> import('../pages/machine/TechParamCategory/TechParamCategoryViewForm')));
export const TechParamCategoryView = Loadable(lazy(()=> import('../pages/machine/TechParamCategory/TechParamCategoryView')));
export const TechParamCategoryEdit = Loadable(lazy(()=> import('../pages/machine/TechParamCategory/TechParamCategoryEdit')));
export const TechParamCategoryEditForm = Loadable(lazy(()=> import('../pages/machine/TechParamCategory/TechParamCategoryEditForm')));

// Machine Statuses
export const MachineStatus = Loadable(lazy(()=> import('../pages/machine/Status/MachineStatus')));
export const StatusList = Loadable(lazy(()=> import('../pages/machine/Status/StatusList')));
export const StatusViewForm = Loadable(lazy(()=> import('../pages/machine/Status/StatusViewForm')));
export const StatusView = Loadable(lazy(()=> import('../pages/machine/Status/StatusView')));
export const StatusEditForm = Loadable(lazy(()=> import('../pages/machine/Status/StatusEditForm')));
export const StatusEdit = Loadable(lazy(()=> import('../pages/machine/Status/StatusEdit')));

// Machine Model
export const MachineModel = Loadable(lazy(()=> import('../pages/machine/Model/MachineModel')));
export const ModelList = Loadable(lazy(()=> import('../pages/machine/Model/ModelList')));
export const ModelViewForm = Loadable(lazy(()=> import('../pages/machine/Model/ModelViewForm')));
export const ModelView = Loadable(lazy(()=> import('../pages/machine/Model/ModelView')));
export const ModelEditForm = Loadable(lazy(()=> import('../pages/machine/Model/ModelEditForm')));
export const ModelEdit = Loadable(lazy(()=> import('../pages/machine/Model/ModelEdit')));
// SITE


// CONTACT
export const ContactList= Loadable(  lazy(() => import('../pages/customer/contact/ContactList')));
export const ContactAdd = Loadable(  lazy(() => import('../pages/customer/contact/ContactAdd')));
export const ContactEdit = Loadable(  lazy(() => import('../pages/customer/contact/ContactEdit')));
export const ContactView = Loadable(  lazy(() => import('../pages/customer/contact/ContactView')));

// NOTE
export const NoteList= Loadable(  lazy(() => import('../pages/customer/note/NoteList')));
export const NoteAdd = Loadable(  lazy(() => import('../pages/customer/note/NoteAdd')));
export const NoteEdit = Loadable(  lazy(() => import('../pages/customer/note/NoteEdit')));
export const NoteView = Loadable(  lazy(() => import('../pages/customer/note/NoteView')));

// DASHBOARD: USER
export const UserProfilePage = Loadable(lazy(() => import('../pages/dashboard/UserProfilePage')));
export const UserCardsPage = Loadable(lazy(() => import('../pages/dashboard/UserCardsPage')));
export const UserListPage = Loadable(lazy(() => import('../pages/dashboard/UserListPage')));
export const UserAccountPage = Loadable(lazy(() => import('../pages/dashboard/UserAccountPage')));
export const UserCreatePage = Loadable(lazy(() => import('../pages/dashboard/UserCreatePage')));
export const UserEditPage = Loadable(lazy(() => import('../pages/dashboard/UserEditPage')));


// TEST RENDER PAGE BY ROLE
export const PermissionDeniedPage = Loadable(
  lazy(() => import('../pages/dashboard/PermissionDeniedPage'))
);

// BLANK PAGE
export const BlankPage = Loadable(lazy(() => import('../pages/dashboard/BlankPage')));

// MAIN
export const Page500 = Loadable(lazy(() => import('../pages/Page500')));
export const Page403 = Loadable(lazy(() => import('../pages/Page403')));
export const Page404 = Loadable(lazy(() => import('../pages/Page404')));
export const HomePage = Loadable(lazy(() => import('../pages/HomePage')));
export const ComingSoonPage = Loadable(lazy(() => import('../pages/ComingSoonPage')));
export const MaintenancePage = Loadable(lazy(() => import('../pages/MaintenancePage')));

export const ComponentsOverviewPage = Loadable(
  lazy(() => import('../pages/components/ComponentsOverviewPage'))
);

