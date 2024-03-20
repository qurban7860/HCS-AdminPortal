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

// CUSTOMER
export const CustomerList = Loadable(lazy(() => import('../pages/crm/reports/customers/CustomerList')));
export const CustomerAdd = Loadable(lazy(() => import('../pages/crm/customers/CustomerAdd')));
export const CustomerEdit = Loadable(lazy(() => import('../pages/crm/customers/CustomerEdit')));
export const CustomerView = Loadable(lazy(() => import('../pages/crm/customers/CustomerView')));

// SITE
export const CustomerSiteList = Loadable(lazy(() => import('../pages/crm/reports/sites/CustomerSiteList')));
export const CustomerSiteDynamicList = Loadable(lazy(() => import('../pages/crm/sites/CustomerSiteDynamicList')));

// CONTACT
export const CustomerContactList = Loadable(lazy(() => import('../pages/crm/reports/contacts/CustomerContactList')));
export const CustomerContactDynamicList = Loadable(lazy(() => import('../pages/crm/contacts/CustomerContactDynamicList')));

// NOTE
export const NoteList = Loadable(lazy(() => import('../pages/crm/notes/NoteList')));
export const NoteAddForm = Loadable(lazy(() => import('../pages/crm/notes/NoteAddForm')));
export const NoteEditForm = Loadable(lazy(() => import('../pages/crm/notes/NoteEditForm')));
export const NoteViewForm = Loadable(lazy(() => import('../pages/crm/notes/NoteViewForm')));

// CUSTOMER MACHINESS
export const CustomerMachines = Loadable(lazy(() => import('../pages/crm/machines/machine_list/CustomerMachines')));
export const CustomerMachineAddForm = Loadable(lazy(() => import('../pages/crm/machines/NewMachine')));
export const CustomerMachineMove = Loadable(lazy(() => import('../pages/crm/machines/machine_move/CustomerMachineMove')));

// CUSTOMER DOCUMENTS
export const CustomerDocumentList             = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentList')));
export const CustomerDocumentAddForm          = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentAddForm')));
export const CustomerDocumentEditForm         = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentEditForm')));
export const CustomerDocumentViewForm         = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentViewForm')));
export const CustomerDocumentHistoryViewForm  = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentHistoryViewForm')));
export const CustomerDocumentGallery          = Loadable(lazy(() => import('../pages/crm/documents/CustomerDocumentGallery')));

// DASHBOARD: USER
export const SecurityUserProfile = Loadable(lazy(() => import('../pages/security/profile/SecurityUserProfile')))  
export const SecurityUserProfileEditForm = Loadable(lazy(() => import('../pages/security/profile/SecurityUserProfileEditForm')));
export const SecurityUserChangePassword = Loadable(lazy(() => import('../pages/security/passwordChange/SecurityUserChangePassword')));
export const SecurityUserChangePasswordByAdmin = Loadable(lazy(() => import('../pages/security/passwordChange/SecurityUserChangePasswordByAdmin')));
export const SecurityUserList = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserList')));
export const SecurityUserAdd = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserAdd')));
export const SecurityUserEdit = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserEdit')));
export const SecurityUserViewForm = Loadable(lazy(() => import('../pages/security/securityUsers/SecurityUserView')));

// SECURITY USERS ROLES
export const RoleList = Loadable(lazy(() => import('../pages/Settings/securitySettings/role/RoleList')));
export const RoleAdd = Loadable(lazy(() => import('../pages/Settings/securitySettings/role/RoleAddForm')));
export const RoleEdit = Loadable(lazy(() => import('../pages/Settings/securitySettings/role/RoleEditForm')));
export const RoleView = Loadable(lazy(() => import('../pages/Settings/securitySettings/role/RoleView')));

//----------------------------------------------------------------

// Machine
export const MachineSetting = Loadable(lazy(() => import('../pages/machine/Machine')));
export const MachineAddForm = Loadable(lazy(() => import('../pages/machine/MachineAdd')));
export const MachineList = Loadable(lazy(() => import('../pages/machine/MachineList')));
export const MachineView = Loadable(lazy(() => import('../pages/machine/MachineView')));
export const MachineEdit = Loadable(lazy(() => import('../pages/machine/MachineEdit')));
export const MachineTransfer = Loadable(lazy(() => import('../pages/machine/MachineTransfer')));

// Supplier
export const SupplierAddForm = Loadable(
  lazy(() => import('../pages/machine/configs/suppliers/SupplierAddForm'))
);
export const SupplierList = Loadable(lazy(() => import('../pages/machine/configs/suppliers/SupplierList')));
export const SupplierView = Loadable(lazy(() => import('../pages/machine/configs/suppliers/SupplierView')));
export const SupplierViewForm = Loadable(lazy(() => import('../pages/machine/configs/suppliers/SupplierViewForm')));
export const SupplierEdit = Loadable(lazy(() => import('../pages/machine/configs/suppliers/SupplierEdit')));
export const SupplierEditForm = Loadable(lazy(() => import('../pages/machine/configs/suppliers/SupplierEditForm')));
export const SForm = Loadable(lazy(() => import('../pages/machine/configs/suppliers/SupplierEditForm')));

export const CheckItemList = Loadable(lazy(() => import('../pages/machine/configs/checkItem/CheckItemList')));
export const CheckItemViewForm = Loadable(lazy(() => import('../pages/machine/configs/checkItem/CheckItemView')));
export const CheckItemEditForm = Loadable(lazy(() => import('../pages/machine/configs/checkItem/CheckItemEditForm')));
export const CheckItemAddForm  = Loadable(lazy(() => import('../pages/machine/configs/checkItem/CheckItemAddForm')));
// Signin Logs
export const SignInLogList = Loadable(lazy(() => import('../pages/Settings/Reports/signInLog/SignInLogList')));

// User Invitations List
export const UserInvitationList = Loadable(lazy(() => import('../pages/Settings/Reports/invite/UserInviteList')));
export const UserInvitationView = Loadable(lazy(() => import('../pages/Settings/Reports/invite/UserInviteViewForm')));

// User Blocked Customers
export const BlockedCustomerList = Loadable(lazy(() => import('../pages/Settings/securitySettings/blocked_customer/BlockedCustomerList')));
export const BlockedCustomerAddForm = Loadable(lazy(() => import('../pages/Settings/securitySettings/blocked_customer/BlockedCustomerAddForm')));

// User Blocked Users
export const BlockedUserList = Loadable(lazy(() => import('../pages/Settings/securitySettings/blocked_user/BlockedUserList')));
export const BlockedUserAddForm = Loadable(lazy(() => import('../pages/Settings/securitySettings/blocked_user/BlockedUserAddForm')));

// Blacklist IP
export const BlacklistIPList = Loadable(lazy(() => import('../pages/Settings/securitySettings/blacklist_IP/BlacklistIPList')));
export const BlacklistIPAddForm = Loadable(lazy(() => import('../pages/Settings/securitySettings/blacklist_IP/BlacklistIPAddForm')));

// Whitelist IP
export const WhitelistIPList = Loadable(lazy(() => import('../pages/Settings/securitySettings/whitelist_IP/WhitelistIPList')));
export const WhitelistIPAddForm = Loadable(lazy(() => import('../pages/Settings/securitySettings/whitelist_IP/WhitelistIPAddForm')));

// License
// export const MachineLicenses = Loadable(lazy(()=> import('../pages/machine/License/MachineLicenses')));
// export const LicenseList = Loadable(lazy(()=> import('../pages/machine/License/LicenseList')));

// Machine Groups
export const GroupAddForm = Loadable(lazy(() => import('../pages/machine/configs/groups/GroupAddForm')));
export const GroupList = Loadable(lazy(() => import('../pages/machine/configs/groups/GroupList')));
export const GroupViewForm = Loadable(lazy(() => import('../pages/machine/configs/groups/GroupViewForm')));
export const GroupEditForm = Loadable(lazy(() => import('../pages/machine/configs/groups/GroupEditForm')));

// Machine Categories
export const CategoryAddForm = Loadable(lazy(() => import('../pages/machine/configs/categories/CategoryAddForm')));
export const CategoryList = Loadable(lazy(() => import('../pages/machine/configs/categories/CategoryList')));
export const CategoryView = Loadable(lazy(() => import('../pages/machine/configs/categories/CategoryView')));
export const CategoryViewForm = Loadable(lazy(() => import('../pages/machine/configs/categories/CategoryViewForm')));
export const CategoryEdit = Loadable(lazy(() => import('../pages/machine/configs/categories/CategoryEdit')));
export const CategoryEditForm = Loadable(lazy(() => import('../pages/machine/configs/categories/CategoryEditForm')));

// Machine Service Categories
export const ServiceCategoryAddForm = Loadable(lazy(() => import('../pages/machine/configs/itemCategories/ServiceCategoryAddForm')));
export const ServiceCategoryList = Loadable(lazy(() => import('../pages/machine/configs/itemCategories/ServiceCategoryList')));
export const ServiceCategoryView = Loadable(lazy(() => import('../pages/machine/configs/itemCategories/ServiceCategoryView')));
export const ServiceCategoryViewForm = Loadable(lazy(() => import('../pages/machine/configs/itemCategories/ServiceCategoryViewForm')));
export const ServiceCategoryEdit = Loadable(lazy(() => import('../pages/machine/configs/itemCategories/ServiceCategoryEdit')));
export const ServiceCategoryEditForm = Loadable(lazy(() => import('../pages/machine/configs/itemCategories/ServiceCategoryEditForm')));


// Machine Parameters
export const ParameterAddForm = Loadable(
  lazy(() => import('../pages/machine/configs/parameters/ParameterAddForm'))
);
export const ParameterList = Loadable(
  lazy(() => import('../pages/machine/configs/parameters/ParameterList'))
);
export const ParameterView = Loadable(
  lazy(() => import('../pages/machine/configs/parameters/ParameterView'))
);
export const ParameterViewForm = Loadable(
  lazy(() => import('../pages/machine/configs/parameters/ParameterViewForm'))
);
export const ParameterEdit = Loadable(
  lazy(() => import('../pages/machine/configs/parameters/ParameterEdit'))
);
export const ParameterEditForm = Loadable(
  lazy(() => import('../pages/machine/configs/parameters/ParameterEditForm'))
);

// Machine Tools
export const ToolAddForm = Loadable(lazy(() => import('../pages/machine/configs/tools/ToolAddForm')));
export const ToolList = Loadable(lazy(() => import('../pages/machine/configs/tools/ToolList')));
export const ToolView = Loadable(lazy(() => import('../pages/machine/configs/tools/ToolView')));
export const ToolViewForm = Loadable(lazy(() => import('../pages/machine/configs/tools/ToolViewForm')));
export const ToolEdit = Loadable(lazy(() => import('../pages/machine/configs/tools/ToolEdit')));
export const ToolEditForm = Loadable(lazy(() => import('../pages/machine/configs/tools/ToolEditForm')));

// MachineTechParam
export const TechParamCategoryAddForm = Loadable(
  lazy(() => import('../pages/machine/configs/technicalParameterCategories/TechParamCategoryAddForm'))
);
export const TechParamList = Loadable(
  lazy(() => import('../pages/machine/configs/technicalParameterCategories/TechParamList'))
);
export const TechParamCategoryViewForm = Loadable(
  lazy(() => import('../pages/machine/configs/technicalParameterCategories/TechParamCategoryViewForm'))
);
export const TechParamCategoryView = Loadable(
  lazy(() => import('../pages/machine/configs/technicalParameterCategories/TechParamCategoryView'))
);
export const TechParamCategoryEdit = Loadable(
  lazy(() => import('../pages/machine/configs/technicalParameterCategories/TechParamCategoryEdit'))
);
export const TechParamCategoryEditForm = Loadable(
  lazy(() => import('../pages/machine/configs/technicalParameterCategories/TechParamCategoryEditForm'))
);

// Machine Statuses
export const StatusAddForm = Loadable(lazy(() => import('../pages/machine/configs/status/StatusAddForm')));
export const StatusList = Loadable(lazy(() => import('../pages/machine/configs/status/StatusList')));
export const StatusViewForm = Loadable(
  lazy(() => import('../pages/machine/configs/status/StatusViewForm'))
);
export const StatusView = Loadable(lazy(() => import('../pages/machine/configs/status/StatusView')));
export const StatusEditForm = Loadable(
  lazy(() => import('../pages/machine/configs/status/StatusEditForm'))
);
export const StatusEdit = Loadable(lazy(() => import('../pages/machine/configs/status/StatusEdit')));

// Machine Model
export const ModelAddForm = Loadable(lazy(() => import('../pages/machine/configs/Model/ModelAddForm')));
export const ModelList = Loadable(lazy(() => import('../pages/machine/configs/Model/ModelList')));
export const ModelViewForm = Loadable(lazy(() => import('../pages/machine/configs/Model/ModelViewForm')));
export const ModelView = Loadable(lazy(() => import('../pages/machine/configs/Model/ModelView')));
export const ModelEditForm = Loadable(lazy(() => import('../pages/machine/configs/Model/ModelEditForm')));
export const ModelEdit = Loadable(lazy(() => import('../pages/machine/configs/Model/ModelEdit')));

// Machine Service Record Config
export const ServiceRecordConfigAddForm = Loadable(
  lazy(() => import('../pages/machine/configs/serviceDocumentConfiguration/ServiceRecordConfigAddForm'))
);
export const ServiceRecordConfigList = Loadable(
  lazy(() => import('../pages/machine/configs/serviceDocumentConfiguration/ServiceRecordConfigList'))
);
export const ServiceRecordConfigView = Loadable(
  lazy(() => import('../pages/machine/configs/serviceDocumentConfiguration/ServiceRecordConfigView'))
);
export const ServiceRecordConfigViewForm = Loadable(
  lazy(() => import('../pages/machine/configs/serviceDocumentConfiguration/ServiceRecordConfigViewForm'))
);
export const ServiceRecordConfigEdit = Loadable(
  lazy(() => import('../pages/machine/configs/serviceDocumentConfiguration/ServiceRecordConfigEdit'))
);
export const ServiceRecordConfigEditForm = Loadable( lazy(() => import('../pages/machine/configs/serviceDocumentConfiguration/ServiceRecordConfigEditForm')));

// Document dashboard
export const DocumentList = Loadable(lazy(() => import('../pages/document/documents/GlobalDocument')));
export const DocumentAddForm = Loadable(lazy(() => import('../pages/document/documents/DocumentAddForm')));
export const DocumentAddListForm = Loadable(lazy(() => import('../pages/document/documents/DocumentListAddForm')));
export const DocumentEditForm = Loadable(lazy(() => import('../pages/document/documents/DocumentEditForm')));
export const DocumentViewForm = Loadable(lazy(() => import('../pages/document/documents/DocumentHistoryViewForm')));
export const DocumentGallery = Loadable(lazy(() => import('../pages/document/documents/DocumentGallery')));

// Machine Drawings dashboard
export const MachineDrawings = Loadable(lazy(() => import('../pages/document/documents/MachineDrawings')));
export const MachineDrawingsAddForm = Loadable(lazy(() => import('../pages/document/documents/MachineDrawingsAddForm')));
export const MachineDrawingsViewForm = Loadable(lazy(() => import('../pages/document/documents/MachineDrawingsViewForm')));

// Document Name
export const DocumentNameAddForm = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentType/DocumentTypeAddForm')));
export const DocumentNameList = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentType/DocumentTypeList')));
export const DocumentNameViewForm = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentType/DocumentTypeView')));
export const DocumentNameEditForm = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentType/DocumentTypeEditForm')));

// Document Category
export const DocumentCategoryAddForm = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentCategory/DocumentCategoryAddForm')));
export const DocumentCategoryList = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentCategory/DocumentCategoryList')));
export const DocumentCategoryView = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentCategory/DocumentCategoryView')));
export const DocumentCategoryEditForm = Loadable(lazy(() => import('../pages/Settings/documentSettings/documentCategory/DocumentCategoryEditForm')));

// Configs
export const RegionAdd = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionAdd')));
export const RegionList = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionList')));
export const RegionEdit = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionEdit')));
export const RegionView = Loadable(lazy(() => import('../pages/crm/configs/regions/RegionView')));


// Modules
export const ModuleAdd = Loadable(lazy(() => import('../pages/Settings/configuration/modules/ModuleAdd')));
export const ModuleList = Loadable(lazy(() => import('../pages/Settings/configuration/modules/ModuleList')));
export const ModuleEdit = Loadable(lazy(() => import('../pages/Settings/configuration/modules/ModuleEdit')));
export const ModuleView = Loadable(lazy(() => import('../pages/Settings/configuration/modules/ModuleView')));

// Configuration
export const ConfigurationAdd  = Loadable(lazy(() => import('../pages/machine/configs/serviceSettings/ConfigurationAddForm')));
export const ConfigurationList = Loadable(lazy(() => import('../pages/machine/configs/serviceSettings/ConfigurationList')));
export const ConfigurationEdit = Loadable(lazy(() => import('../pages/machine/configs/serviceSettings/ConfigurationEdit')));
export const ConfigurationView = Loadable(lazy(() => import('../pages/machine/configs/serviceSettings/ConfigurationView')));

// Configs

export const ConfigAdd = Loadable(lazy(() => import('../pages/Settings/configuration/systemConfigs/ConfigAdd')));
export const ConfigList = Loadable(lazy(() => import('../pages/Settings/configuration/systemConfigs/ConfigList')));
export const ConfigEdit = Loadable(lazy(() => import('../pages/Settings/configuration/systemConfigs/ConfigEdit')));
export const ConfigView = Loadable(lazy(() => import('../pages/Settings/configuration/systemConfigs/ConfigView')));

// Configs

export const DepartmentAdd  = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentAddForm')));
export const DepartmentList = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentList')));
export const DepartmentEdit = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentEditForm')));
export const DepartmentView = Loadable(lazy(() => import('../pages/crm/configs/departments/DepartmentView')));

// DASHBOARD: SETTINGS
export const Setting = Loadable(lazy(() => import('../pages/Settings/Setting')));


// DASHBOARD: Email
export const Email = Loadable(lazy(() => import('../pages/email/Email')));

export const Emailviewform = Loadable(lazy(() => import('../pages/email/EmailViewform')));

// DASHBOARD: REPORTS
export const Reports = Loadable(lazy(() => import('../pages/crm/reports/sites/Reports')));

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
  lazy(() => import('../components/Defaults/ComponentsOverviewPage'))
);
