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
export const MachinePage = Loadable(lazy(()=> import('../pages/machine/Machine')))
export const MachineAdd = Loadable(lazy(()=> import('../pages/machine/MachineAddForm')))
export const MachineSupplier = Loadable(lazy(()=> import('../pages/machine/MachineSuppliers')))
export const S_Detail = Loadable(lazy(()=> import('../pages/machine/SupplierDetail')))
// SITE
export const SiteList= Loadable(  lazy(() => import('../pages/customer/site/SiteList')));
export const SiteAdd = Loadable(  lazy(() => import('../pages/customer/site/SiteAdd')));
export const SiteEdit = Loadable(  lazy(() => import('../pages/customer/site/SiteEdit')));
export const SiteView = Loadable(  lazy(() => import('../pages/customer/site/SiteView')));

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

