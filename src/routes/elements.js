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
export const SecurityUserProfile = Loadable(lazy(() => import('../pages/security/Profile/SecurityUserProfile')));
export const SecurityUserProfileEditForm = Loadable(lazy(() => import('../pages/security/Profile/SecurityUserProfileEditForm')));
export const SecurityUserChangePassword = Loadable(lazy(() => import('../pages/security/password-change/SecurityUserChangePassword')));
export const SecurityUserChangePasswordByAdmin = Loadable(lazy(() => import('../pages/security/password-change/SecurityUserChangePasswordByAdmin')));
export const SecurityUserList = Loadable(lazy(() => import('../pages/security/security_user/SecurityUserList')));
export const SecurityUserAdd = Loadable(lazy(() => import('../pages/security/security_user/SecurityUserAdd')));
export const SecurityUserEdit = Loadable(lazy(() => import('../pages/security/security_user/SecurityUserEdit')));
export const SecurityUserViewForm = Loadable(lazy(() => import('../pages/security/security_user/SecurityUserView')));

// SECURITY USERS ROLES
export const RoleList = Loadable(lazy(() => import('../pages/Settings/security_setting/role/RoleList')));
export const RoleAdd = Loadable(lazy(() => import('../pages/Settings/security_setting/role/RoleAddForm')));
export const RoleEdit = Loadable(lazy(() => import('../pages/Settings/security_setting/role/RoleEditForm')));
export const RoleView = Loadable(lazy(() => import('../pages/Settings/security_setting/role/RoleView')));

//----------------------------------------------------------------

// Machine
export const MachineSetting = Loadable(lazy(() => import('../pages/machine/Machine')));
export const MachineAdd = Loadable(lazy(() => import('../pages/machine/MachineAddForm')));
export const MachineList = Loadable(lazy(() => import('../pages/machine/MachineList')));
export const MachineView = Loadable(lazy(() => import('../pages/machine/MachineView')));
export const MachineEdit = Loadable(lazy(() => import('../pages/machine/MachineEdit')));
export const MachineTransfer = Loadable(lazy(() => import('../pages/machine/MachineTransfer')));

// Supplier
export const SupplierAddForm = Loadable(
  lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierAddForm'))
);
export const SupplierList = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierList')));
export const SupplierView = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierView')));
export const SupplierViewForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierViewForm')));
export const SupplierEdit = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierEdit')));
export const SupplierEditForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierEditForm')));
export const SForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Supplier/SupplierEditForm')));

export const CheckItemList = Loadable(lazy(() => import('../pages/machine_settings/service_settings/check_item/CheckItemList')));
export const CheckItemViewForm = Loadable(lazy(() => import('../pages/machine_settings/service_settings/check_item/CheckItemView')));
export const CheckItemEditForm = Loadable(lazy(() => import('../pages/machine_settings/service_settings/check_item/CheckItemEditForm')));
export const CheckItemAddForm  = Loadable(lazy(() => import('../pages/machine_settings/service_settings/check_item/CheckItemAddForm')));
// Signin Logs
export const SignInLogList = Loadable(lazy(() => import('../pages/Settings/Reports/signInLog/SignInLogList')));

// User Invitations List
export const UserInvitationList = Loadable(lazy(() => import('../pages/Settings/Reports/invite/UserInviteList')));
export const UserInvitationView = Loadable(lazy(() => import('../pages/Settings/Reports/invite/UserInviteViewForm')));

// User Blocked Customers
export const BlockedCustomerList = Loadable(lazy(() => import('../pages/Settings/security_setting/blocked_customer/BlockedCustomerList')));
export const BlockedCustomerAddForm = Loadable(lazy(() => import('../pages/Settings/security_setting/blocked_customer/BlockedCustomerAddForm')));

// User Blocked Users
export const BlockedUserList = Loadable(lazy(() => import('../pages/Settings/security_setting/blocked_user/BlockedUserList')));
export const BlockedUserAddForm = Loadable(lazy(() => import('../pages/Settings/security_setting/blocked_user/BlockedUserAddForm')));

// Blacklist IP
export const BlacklistIPList = Loadable(lazy(() => import('../pages/Settings/security_setting/blacklist_IP/BlacklistIPList')));
export const BlacklistIPAddForm = Loadable(lazy(() => import('../pages/Settings/security_setting/blacklist_IP/BlacklistIPAddForm')));

// Whitelist IP
export const WhitelistIPList = Loadable(lazy(() => import('../pages/Settings/security_setting/whitelist_IP/WhitelistIPList')));
export const WhitelistIPAddForm = Loadable(lazy(() => import('../pages/Settings/security_setting/whitelist_IP/WhitelistIPAddForm')));

// License
// export const MachineLicenses = Loadable(lazy(()=> import('../pages/machine/License/MachineLicenses')));
// export const LicenseList = Loadable(lazy(()=> import('../pages/machine/License/LicenseList')));

// Machine Groups
export const GroupAddForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/groups/GroupAddForm')));
export const GroupList = Loadable(lazy(() => import('../pages/machine_settings/common_settings/groups/GroupList')));
export const GroupViewForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/groups/GroupViewForm')));
export const GroupEditForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/groups/GroupEditForm')));

// Machine Categories
export const CategoryAddForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/categories/CategoryAddForm')));
export const CategoryList = Loadable(lazy(() => import('../pages/machine_settings/common_settings/categories/CategoryList')));
export const CategoryView = Loadable(lazy(() => import('../pages/machine_settings/common_settings/categories/CategoryView')));
export const CategoryViewForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/categories/CategoryViewForm')));
export const CategoryEdit = Loadable(lazy(() => import('../pages/machine_settings/common_settings/categories/CategoryEdit')));
export const CategoryEditForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/categories/CategoryEditForm')));

// Machine Service Categories
export const ServiceCategoryAddForm = Loadable(lazy(() => import('../pages/machine_settings/service_settings/item_categories/ServiceCategoryAddForm')));
export const ServiceCategoryList = Loadable(lazy(() => import('../pages/machine_settings/service_settings/item_categories/ServiceCategoryList')));
export const ServiceCategoryView = Loadable(lazy(() => import('../pages/machine_settings/service_settings/item_categories/ServiceCategoryView')));
export const ServiceCategoryViewForm = Loadable(lazy(() => import('../pages/machine_settings/service_settings/item_categories/ServiceCategoryViewForm')));
export const ServiceCategoryEdit = Loadable(lazy(() => import('../pages/machine_settings/service_settings/item_categories/ServiceCategoryEdit')));
export const ServiceCategoryEditForm = Loadable(lazy(() => import('../pages/machine_settings/service_settings/item_categories/ServiceCategoryEditForm')));


// Machine Parameters
export const ParameterAddForm = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/parameters/ParameterAddForm'))
);
export const ParameterList = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/parameters/ParameterList'))
);
export const ParameterView = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/parameters/ParameterView'))
);
export const ParameterViewForm = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/parameters/ParameterViewForm'))
);
export const ParameterEdit = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/parameters/ParameterEdit'))
);
export const ParameterEditForm = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/parameters/ParameterEditForm'))
);

// Machine Tools
export const ToolAddForm = Loadable(lazy(() => import('../pages/machine_settings/tool_information/tool/ToolAddForm')));
export const ToolList = Loadable(lazy(() => import('../pages/machine_settings/tool_information/tool/ToolList')));
export const ToolView = Loadable(lazy(() => import('../pages/machine_settings/tool_information/tool/ToolView')));
export const ToolViewForm = Loadable(lazy(() => import('../pages/machine_settings/tool_information/tool/ToolViewForm')));
export const ToolEdit = Loadable(lazy(() => import('../pages/machine_settings/tool_information/tool/ToolEdit')));
export const ToolEditForm = Loadable(lazy(() => import('../pages/machine_settings/tool_information/tool/ToolEditForm')));

// MachineTechParam
export const TechParamCategoryAddForm = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/technical_parameter_category/TechParamCategoryAddForm'))
);
export const TechParamList = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/technical_parameter_category/TechParamList'))
);
export const TechParamCategoryViewForm = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/technical_parameter_category/TechParamCategoryViewForm'))
);
export const TechParamCategoryView = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/technical_parameter_category/TechParamCategoryView'))
);
export const TechParamCategoryEdit = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/technical_parameter_category/TechParamCategoryEdit'))
);
export const TechParamCategoryEditForm = Loadable(
  lazy(() => import('../pages/machine_settings/technical_settings/technical_parameter_category/TechParamCategoryEditForm'))
);

// Machine Statuses
export const StatusAddForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Status/StatusAddForm')));
export const StatusList = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Status/StatusList')));
export const StatusViewForm = Loadable(
  lazy(() => import('../pages/machine_settings/common_settings/Status/StatusViewForm'))
);
export const StatusView = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Status/StatusView')));
export const StatusEditForm = Loadable(
  lazy(() => import('../pages/machine_settings/common_settings/Status/StatusEditForm'))
);
export const StatusEdit = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Status/StatusEdit')));

// Machine Model
export const ModelAddForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Model/ModelAddForm')));
export const ModelList = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Model/ModelList')));
export const ModelViewForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Model/ModelViewForm')));
export const ModelView = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Model/ModelView')));
export const ModelEditForm = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Model/ModelEditForm')));
export const ModelEdit = Loadable(lazy(() => import('../pages/machine_settings/common_settings/Model/ModelEdit')));

// Machine Service Record Config
export const ServiceRecordConfigAddForm = Loadable(
  lazy(() => import('../pages/machine_settings/service_settings/service_document_configuration/ServiceRecordConfigAddForm'))
);
export const ServiceRecordConfigList = Loadable(
  lazy(() => import('../pages/machine_settings/service_settings/service_document_configuration/ServiceRecordConfigList'))
);
export const ServiceRecordConfigView = Loadable(
  lazy(() => import('../pages/machine_settings/service_settings/service_document_configuration/ServiceRecordConfigView'))
);
export const ServiceRecordConfigViewForm = Loadable(
  lazy(() => import('../pages/machine_settings/service_settings/service_document_configuration/ServiceRecordConfigViewForm'))
);
export const ServiceRecordConfigEdit = Loadable(
  lazy(() => import('../pages/machine_settings/service_settings/service_document_configuration/ServiceRecordConfigEdit'))
);
export const ServiceRecordConfigEditForm = Loadable(
  lazy(() => import('../pages/machine_settings/service_settings/service_document_configuration/ServiceRecordConfigEditForm'))
);

// Document dashboard
export const DocumentList = Loadable(lazy(() => import('../pages/document/documents/GlobalDocument')));
export const DocumentAddForm = Loadable(lazy(() => import('../pages/document/documents/DocumentAddForm')));
export const DocumentEditForm = Loadable(lazy(() => import('../pages/document/documents/DocumentEditForm')));
export const DocumentViewForm = Loadable(lazy(() => import('../pages/document/documents/DocumentHistoryViewForm')));
export const DocumentGallery = Loadable(lazy(() => import('../pages/document/documents/DocumentGallery')));

// Machine Drawings dashboard
export const MachineDrawings = Loadable(lazy(() => import('../pages/document/documents/MachineDrawings')));
export const MachineDrawingsAddForm = Loadable(lazy(() => import('../pages/document/documents/MachineDrawingsAddForm')));
export const MachineDrawingsViewForm = Loadable(lazy(() => import('../pages/document/documents/MachineDrawingsViewForm')));

// Document Name
export const DocumentNameAddForm = Loadable(lazy(() => import('../pages/Settings/document_settings/documentType/DocumentTypeAddForm')));
export const DocumentNameList = Loadable(lazy(() => import('../pages/Settings/document_settings/documentType/DocumentTypeList')));
export const DocumentNameViewForm = Loadable(lazy(() => import('../pages/Settings/document_settings/documentType/DocumentTypeView')));
export const DocumentNameEditForm = Loadable(lazy(() => import('../pages/Settings/document_settings/documentType/DocumentTypeEditForm')));

// Fime Category
export const DocumentCategoryAddForm = Loadable(lazy(() => import('../pages/Settings/document_settings/documentCategory/DocumentCategoryAddForm')));
export const DocumentCategoryList = Loadable(lazy(() => import('../pages/Settings/document_settings/documentCategory/DocumentCategoryList')));
export const DocumentCategoryView = Loadable(lazy(() => import('../pages/Settings/document_settings/documentCategory/DocumentCategoryView')));
export const DocumentCategoryEditForm = Loadable(lazy(() => import('../pages/Settings/document_settings/documentCategory/DocumentCategoryEditForm')));

// Configs
export const RegionAdd = Loadable(lazy(() => import('../pages/Settings/configuration/region/RegionAdd')));
export const RegionList = Loadable(lazy(() => import('../pages/Settings/configuration/region/RegionList')));
export const RegionEdit = Loadable(lazy(() => import('../pages/Settings/configuration/region/RegionEdit')));
export const RegionView = Loadable(lazy(() => import('../pages/Settings/configuration/region/RegionView')));


// Modules
export const ModuleAdd = Loadable(lazy(() => import('../pages/Settings/configuration/module/ModuleAdd')));
export const ModuleList = Loadable(lazy(() => import('../pages/Settings/configuration/module/ModuleList')));
export const ModuleEdit = Loadable(lazy(() => import('../pages/Settings/configuration/module/ModuleEdit')));
export const ModuleView = Loadable(lazy(() => import('../pages/Settings/configuration/module/ModuleView')));

// Configuration
export const ConfigurationAdd  = Loadable(lazy(() => import('../pages/machine_settings/service_settings/service_setting/ConfigurationAddForm')));
export const ConfigurationList = Loadable(lazy(() => import('../pages/machine_settings/service_settings/service_setting/ConfigurationList')));
export const ConfigurationEdit = Loadable(lazy(() => import('../pages/machine_settings/service_settings/service_setting/ConfigurationEdit')));
export const ConfigurationView = Loadable(lazy(() => import('../pages/machine_settings/service_settings/service_setting/ConfigurationView')));

// Configs

export const ConfigAdd = Loadable(lazy(() => import('../pages/Settings/configuration/system_config/ConfigAdd')));
export const ConfigList = Loadable(lazy(() => import('../pages/Settings/configuration/system_config/ConfigList')));
export const ConfigEdit = Loadable(lazy(() => import('../pages/Settings/configuration/system_config/ConfigEdit')));
export const ConfigView = Loadable(lazy(() => import('../pages/Settings/configuration/system_config/ConfigView')));

// Configs

export const DepartmentAdd  = Loadable(lazy(() => import('../pages/Settings/configuration/Department/DepartmentAddForm')));
export const DepartmentList = Loadable(lazy(() => import('../pages/Settings/configuration/Department/DepartmentList')));
export const DepartmentEdit = Loadable(lazy(() => import('../pages/Settings/configuration/Department/DepartmentEditForm')));
export const DepartmentView = Loadable(lazy(() => import('../pages/Settings/configuration/Department/DepartmentView')));

// DASHBOARD: SETTINGS
export const Setting = Loadable(lazy(() => import('../pages/Settings/Setting')));


// DASHBOARD: Email
export const Email = Loadable(lazy(() => import('../pages/email/Email')));

export const Emailviewform = Loadable(lazy(() => import('../pages/email/EmailViewform')));

// DASHBOARD: REPORTS
export const Reports = Loadable(lazy(() => import('../pages/sites_map/Reports')));

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
