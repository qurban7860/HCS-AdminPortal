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

// DASHBOARD: GENERAL
export const GeneralAppPage = Loadable(lazy(() => import('../pages/dashboard/GeneralAppPage')));
export const MachineByCountriesViewForm = Loadable(lazy(() => import('../pages/dashboard/MachineByCountriesViewForm')));
export const MachineByModelsViewForm = Loadable(lazy(() => import('../pages/dashboard/MachineByModelsViewForm')));
export const MachineByYearsViewForm = Loadable(lazy(() => import('../pages/dashboard/MachineByYearsViewForm')));

// --------------------------

// CUSTOMER
export const CustomerDashboard = Loadable(lazy(() => import('../pages/customer/CustomerDashboardPage')));

export const CustomerList = Loadable(lazy(() => import('../pages/customer/CustomerList')));
export const CustomerAdd = Loadable(lazy(() => import('../pages/customer/CustomerAdd')));
export const CustomerEdit = Loadable(lazy(() => import('../pages/customer/CustomerEdit')));
export const CustomerView = Loadable(lazy(() => import('../pages/customer/CustomerView')));

// SITE
export const SiteList = Loadable(lazy(() => import('../pages/customer/site/SiteList')));
export const SiteAdd = Loadable(lazy(() => import('../pages/customer/site/SiteAdd')));
export const SiteEdit = Loadable(lazy(() => import('../pages/customer/site/SiteEdit')));
export const SiteView = Loadable(lazy(() => import('../pages/customer/site/SiteView')));

// CONTACT
export const ContactList = Loadable(lazy(() => import('../pages/customer/contact/ContactList')));
export const ContactAdd = Loadable(lazy(() => import('../pages/customer/contact/ContactAdd')));
export const ContactEdit = Loadable(lazy(() => import('../pages/customer/contact/ContactEdit')));
export const ContactView = Loadable(lazy(() => import('../pages/customer/contact/ContactView')));

// NOTE
export const NoteList = Loadable(lazy(() => import('../pages/customer/note/NoteList')));
export const NoteAddForm = Loadable(lazy(() => import('../pages/customer/note/NoteAddForm')));
export const NoteEditForm = Loadable(lazy(() => import('../pages/customer/note/NoteEditForm')));
export const NoteViewForm = Loadable(lazy(() => import('../pages/customer/note/NoteViewForm')));

// DASHBOARD: USER
export const SecurityUserProfile = Loadable(lazy(() => import('../pages/user/SecurityUserProfile')));
export const SecurityUserChangePassword = Loadable(lazy(() => import('../pages/user/SecurityUserChangePassword')));
export const SecurityUserChangePasswordByAdmin = Loadable(lazy(() => import('../pages/user/SecurityUserChangePasswordByAdmin')));
export const SecurityUserList = Loadable(lazy(() => import('../pages/user/SecurityUserList')));
export const SecurityUserAdd = Loadable(lazy(() => import('../pages/user/SecurityUserAdd')));
export const SecurityUserEdit = Loadable(lazy(() => import('../pages/user/SecurityUserEdit')));
export const SecurityUserViewForm = Loadable(lazy(() => import('../pages/user/SecurityUserView')));

// SECURITY USERS ROLES
export const RoleList = Loadable(lazy(() => import('../pages/user/role/RoleList')));
export const RoleAdd = Loadable(lazy(() => import('../pages/user/role/RoleAddForm')));
export const RoleEdit = Loadable(lazy(() => import('../pages/user/role/RoleEditForm')));
export const RoleView = Loadable(lazy(() => import('../pages/user/role/RoleView')));

//----------------------------------------------------------------

// Machine
export const MachineSetting = Loadable(lazy(() => import('../pages/machine/Machine')));
export const MachineAdd = Loadable(lazy(() => import('../pages/machine/MachineAddForm')));
export const MachineList = Loadable(lazy(() => import('../pages/machine/MachineList')));
export const MachineView = Loadable(lazy(() => import('../pages/machine/MachineView')));
export const MachineEdit = Loadable(lazy(() => import('../pages/machine/MachineEdit')));

// Supplier
export const SupplierAddForm = Loadable(
  lazy(() => import('../pages/machine/Supplier/SupplierAddForm'))
);
export const SupplierList = Loadable(lazy(() => import('../pages/machine/Supplier/SupplierList')));
export const SupplierView = Loadable(lazy(() => import('../pages/machine/Supplier/SupplierView')));
export const SupplierViewForm = Loadable(lazy(() => import('../pages/machine/Supplier/SupplierViewForm')));
export const SupplierEdit = Loadable(lazy(() => import('../pages/machine/Supplier/SupplierEdit')));
export const SupplierEditForm = Loadable(lazy(() => import('../pages/machine/Supplier/SupplierEditForm')));
export const SForm = Loadable(lazy(() => import('../pages/machine/Supplier/SupplierEditForm')));

export const CheckItemList = Loadable(lazy(() => import('../pages/machine/CheckItem/CheckItemList')));
export const CheckItemViewForm = Loadable(lazy(() => import('../pages/machine/CheckItem/CheckItemView')));
export const CheckItemEditForm = Loadable(lazy(() => import('../pages/machine/CheckItem/CheckItemEditForm')));
export const CheckItemAddForm  = Loadable(lazy(() => import('../pages/machine/CheckItem/CheckItemAddForm')));
// Signin Logs
export const SignInLogList = Loadable(lazy(() => import('../pages/user/signInLog/SignInLogList')));

// User Invitations List
export const UserInvitationList = Loadable(lazy(() => import('../pages/user/invite/UserInviteList')));
export const UserInvitationView = Loadable(lazy(() => import('../pages/user/invite/UserInviteViewForm')));

// User Blocked Customers
export const BlockedCustomerList = Loadable(lazy(() => import('../pages/security/config/blockedCustomer/BlockedCustomerList')));
export const BlockedCustomerAddForm = Loadable(lazy(() => import('../pages/security/config/blockedCustomer/BlockedCustomerAddForm')));

// User Blocked Users
export const BlockedUserList = Loadable(lazy(() => import('../pages/security/config/blockedUser/BlockedUserList')));
export const BlockedUserAddForm = Loadable(lazy(() => import('../pages/security/config/blockedUser/BlockedUserAddForm')));

// Blacklist IP
export const BlacklistIPList = Loadable(lazy(() => import('../pages/security/config/blacklistIP/BlacklistIPList')));
export const BlacklistIPAddForm = Loadable(lazy(() => import('../pages/security/config/blacklistIP/BlacklistIPAddForm')));

// Whitelist IP
export const WhitelistIPList = Loadable(lazy(() => import('../pages/security/config/whitelistIP/WhitelistIPList')));
export const WhitelistIPAddForm = Loadable(lazy(() => import('../pages/security/config/whitelistIP/WhitelistIPAddForm')));

// License
// export const MachineLicenses = Loadable(lazy(()=> import('../pages/machine/License/MachineLicenses')));
// export const LicenseList = Loadable(lazy(()=> import('../pages/machine/License/LicenseList')));

// Machine Categories
export const CategoryAddForm = Loadable(lazy(() => import('../pages/machine/Categories/CategoryAddForm')));
export const CategoryList = Loadable(lazy(() => import('../pages/machine/Categories/CategoryList')));
export const CategoryView = Loadable(lazy(() => import('../pages/machine/Categories/CategoryView')));
export const CategoryViewForm = Loadable(lazy(() => import('../pages/machine/Categories/CategoryViewForm')));
export const CategoryEdit = Loadable(lazy(() => import('../pages/machine/Categories/CategoryEdit')));
export const CategoryEditForm = Loadable(lazy(() => import('../pages/machine/Categories/CategoryEditForm')));

// Machine Service Categories
export const ServiceCategoryAddForm = Loadable(lazy(() => import('../pages/machine/ServiceCategories/ServiceCategoryAddForm')));
export const ServiceCategoryList = Loadable(lazy(() => import('../pages/machine/ServiceCategories/ServiceCategoryList')));
export const ServiceCategoryView = Loadable(lazy(() => import('../pages/machine/ServiceCategories/ServiceCategoryView')));
export const ServiceCategoryViewForm = Loadable(lazy(() => import('../pages/machine/ServiceCategories/ServiceCategoryViewForm')));
export const ServiceCategoryEdit = Loadable(lazy(() => import('../pages/machine/ServiceCategories/ServiceCategoryEdit')));
export const ServiceCategoryEditForm = Loadable(lazy(() => import('../pages/machine/ServiceCategories/ServiceCategoryEditForm')));


// Machine Parameters
export const ParameterAddForm = Loadable(
  lazy(() => import('../pages/machine/Parameters/ParameterAddForm'))
);
export const ParameterList = Loadable(
  lazy(() => import('../pages/machine/Parameters/ParameterList'))
);
export const ParameterView = Loadable(
  lazy(() => import('../pages/machine/Parameters/ParameterView'))
);
export const ParameterViewForm = Loadable(
  lazy(() => import('../pages/machine/Parameters/ParameterViewForm'))
);
export const ParameterEdit = Loadable(
  lazy(() => import('../pages/machine/Parameters/ParameterEdit'))
);
export const ParameterEditForm = Loadable(
  lazy(() => import('../pages/machine/Parameters/ParameterEditForm'))
);

// Machine Tools
export const ToolAddForm = Loadable(lazy(() => import('../pages/machine/Tool/ToolAddForm')));
export const ToolList = Loadable(lazy(() => import('../pages/machine/Tool/ToolList')));
export const ToolView = Loadable(lazy(() => import('../pages/machine/Tool/ToolView')));
export const ToolViewForm = Loadable(lazy(() => import('../pages/machine/Tool/ToolViewForm')));
export const ToolEdit = Loadable(lazy(() => import('../pages/machine/Tool/ToolEdit')));
export const ToolEditForm = Loadable(lazy(() => import('../pages/machine/Tool/ToolEditForm')));

// MachineTechParam
export const TechParamCategoryAddForm = Loadable(
  lazy(() => import('../pages/machine/TechParamCategory/TechParamCategoryAddForm'))
);
export const TechParamList = Loadable(
  lazy(() => import('../pages/machine/TechParamCategory/TechParamList'))
);
export const TechParamCategoryViewForm = Loadable(
  lazy(() => import('../pages/machine/TechParamCategory/TechParamCategoryViewForm'))
);
export const TechParamCategoryView = Loadable(
  lazy(() => import('../pages/machine/TechParamCategory/TechParamCategoryView'))
);
export const TechParamCategoryEdit = Loadable(
  lazy(() => import('../pages/machine/TechParamCategory/TechParamCategoryEdit'))
);
export const TechParamCategoryEditForm = Loadable(
  lazy(() => import('../pages/machine/TechParamCategory/TechParamCategoryEditForm'))
);

// Machine Statuses
export const StatusAddForm = Loadable(lazy(() => import('../pages/machine/Status/StatusAddForm')));
export const StatusList = Loadable(lazy(() => import('../pages/machine/Status/StatusList')));
export const StatusViewForm = Loadable(
  lazy(() => import('../pages/machine/Status/StatusViewForm'))
);
export const StatusView = Loadable(lazy(() => import('../pages/machine/Status/StatusView')));
export const StatusEditForm = Loadable(
  lazy(() => import('../pages/machine/Status/StatusEditForm'))
);
export const StatusEdit = Loadable(lazy(() => import('../pages/machine/Status/StatusEdit')));

// Machine Model
export const ModelAddForm = Loadable(lazy(() => import('../pages/machine/Model/ModelAddForm')));
export const ModelList = Loadable(lazy(() => import('../pages/machine/Model/ModelList')));
export const ModelViewForm = Loadable(lazy(() => import('../pages/machine/Model/ModelViewForm')));
export const ModelView = Loadable(lazy(() => import('../pages/machine/Model/ModelView')));
export const ModelEditForm = Loadable(lazy(() => import('../pages/machine/Model/ModelEditForm')));
export const ModelEdit = Loadable(lazy(() => import('../pages/machine/Model/ModelEdit')));

// Machine Service Record Config
export const ServiceRecordConfigAddForm = Loadable(
  lazy(() => import('../pages/machine/ServiceRecordConfig/ServiceRecordConfigAddForm'))
);
export const ServiceRecordConfigList = Loadable(
  lazy(() => import('../pages/machine/ServiceRecordConfig/ServiceRecordConfigList'))
);
export const ServiceRecordConfigView = Loadable(
  lazy(() => import('../pages/machine/ServiceRecordConfig/ServiceRecordConfigView'))
);
export const ServiceRecordConfigViewForm = Loadable(
  lazy(() => import('../pages/machine/ServiceRecordConfig/ServiceRecordConfigViewForm'))
);
export const ServiceRecordConfigEdit = Loadable(
  lazy(() => import('../pages/machine/ServiceRecordConfig/ServiceRecordConfigEdit'))
);
export const ServiceRecordConfigEditForm = Loadable(
  lazy(() => import('../pages/machine/ServiceRecordConfig/ServiceRecordConfigEditForm'))
);

// Document dashboard
export const DocumentList = Loadable(lazy(() => import('../pages/document/documents/GlobalDocument')));
export const DocumentAddForm = Loadable(lazy(() => import('../pages/document/documents/DocumentAddForm')));
export const DocumentEditForm = Loadable(lazy(() => import('../pages/document/documents/DocumentEditForm')));
export const DocumentViewForm = Loadable(lazy(() => import('../pages/document/documents/DocumentHistoryViewForm')));

// Machine Drawings dashboard
export const MachineDrawings = Loadable(lazy(() => import('../pages/document/documents/MachineDrawings')));
export const MachineDrawingsAddForm = Loadable(lazy(() => import('../pages/document/documents/MachineDrawingsAddForm')));
export const MachineDrawingsViewForm = Loadable(lazy(() => import('../pages/document/documents/MachineDrawingsViewForm')));

// Document Name
export const DocumentNameAddForm = Loadable(lazy(() => import('../pages/document/documentType/DocumentTypeAddForm')));
export const DocumentNameList = Loadable(lazy(() => import('../pages/document/documentType/DocumentTypeList')));
export const DocumentNameViewForm = Loadable(lazy(() => import('../pages/document/documentType/DocumentTypeView')));
export const DocumentNameEditForm = Loadable(lazy(() => import('../pages/document/documentType/DocumentTypeEditForm')));

// Fime Category
export const DocumentCategoryAddForm = Loadable(lazy(() => import('../pages/document/documentCategory/DocumentCategoryAddForm')));
export const DocumentCategoryList = Loadable(lazy(() => import('../pages/document/documentCategory/DocumentCategoryList')));
export const DocumentCategoryView = Loadable(lazy(() => import('../pages/document/documentCategory/DocumentCategoryView')));
export const DocumentCategoryEditForm = Loadable(lazy(() => import('../pages/document/documentCategory/DocumentCategoryEditForm')));

// Configs
export const RegionAdd = Loadable(lazy(() => import('../pages/region/RegionAdd')));
export const RegionList = Loadable(lazy(() => import('../pages/region/RegionList')));
export const RegionEdit = Loadable(lazy(() => import('../pages/region/RegionEdit')));
export const RegionView = Loadable(lazy(() => import('../pages/region/RegionView')));


// Modules
export const ModuleAdd = Loadable(lazy(() => import('../pages/module/ModuleAdd')));
export const ModuleList = Loadable(lazy(() => import('../pages/module/ModuleList')));
export const ModuleEdit = Loadable(lazy(() => import('../pages/module/ModuleEdit')));
export const ModuleView = Loadable(lazy(() => import('../pages/module/ModuleView')));



// Configs

export const ConfigAdd = Loadable(lazy(() => import('../pages/config/ConfigAdd')));
export const ConfigList = Loadable(lazy(() => import('../pages/config/ConfigList')));
export const ConfigEdit = Loadable(lazy(() => import('../pages/config/ConfigEdit')));
export const ConfigView = Loadable(lazy(() => import('../pages/config/ConfigView')));
// export const machineDocumentView = Loadable(lazy(()=>     import('../pages/')));
// export const machineDocumentEdit = Loadable(lazy(()=>     import('../pages/')));

// DASHBOARD: SETTINGS
export const Setting = Loadable(lazy(() => import('../pages/setting/Setting')));


// DASHBOARD: Email
export const Email = Loadable(lazy(() => import('../pages/email/Email')));

export const Emailviewform = Loadable(lazy(() => import('../pages/email/EmailViewform')));

// DASHBOARD: REPORTS
export const Reports = Loadable(lazy(() => import('../pages/Reports/Reports')));

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
export const ErrorPage = Loadable(lazy(() => import('../pages/ErrorPage')));
export const UserInviteLanding = Loadable(lazy(() => import('../pages/UserInviteLanding')));
export const ComponentsOverviewPage = Loadable(
  lazy(() => import('../pages/components/Defaults/ComponentsOverviewPage'))
);
