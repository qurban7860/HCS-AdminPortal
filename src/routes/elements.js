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
export const NoteAdd = Loadable(lazy(() => import('../pages/customer/note/NoteAdd')));
export const NoteEdit = Loadable(lazy(() => import('../pages/customer/note/NoteEdit')));
export const NoteView = Loadable(lazy(() => import('../pages/customer/note/NoteView')));

// DASHBOARD: USER
export const SecurityUserProfile = Loadable(
  lazy(() => import('../pages/user/SecurityUserProfile'))
);
export const SecurityUserChangePassword = Loadable(
  lazy(() => import('../pages/user/SecurityUserChangePassword'))
);
export const SecurityUserChangePasswordByAdmin = Loadable(
  lazy(() => import('../pages/user/SecurityUserChangePasswordByAdmin'))
);
export const SecurityUserList = Loadable(lazy(() => import('../pages/user/SecurityUserList')));
export const SecurityUserAdd = Loadable(lazy(() => import('../pages/user/SecurityUserAdd')));
export const SecurityUserEdit = Loadable(lazy(() => import('../pages/user/SecurityUserEdit')));
export const SecurityUserViewForm = Loadable(
  lazy(() => import('../pages/user/SecurityUserViewForm'))
);

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

export const MachineServiceParamList     = Loadable(lazy(() => import('../pages/machine/MachineServiceParams/MachineServiceParamList')));
export const MachineServiceParamViewForm = Loadable(lazy(() => import('../pages/machine/MachineServiceParams/MachineServiceParamView')));
export const MachineServiceParamEditForm = Loadable(lazy(() => import('../pages/machine/MachineServiceParams/MachineServiceParamEditForm')));
export const MachineServiceParamAddForm  = Loadable(lazy(() => import('../pages/machine/MachineServiceParams/MachineServiceParamAddForm')));
// Signin Logs
export const SignInLogList = Loadable(lazy(() => import('../pages/user/signInLog/SignInLogList')));

// config List
export const UserConfigList = Loadable(lazy(() => import('../pages/user/config/ConfigList')));
export const UserConfigAddForm = Loadable(lazy(() => import('../pages/user/config/ConfigAddForm')));
export const UserConfigEditForm = Loadable(lazy(() => import('../pages/user/config/ConfigEditForm')));
export const UserConfigViewForm = Loadable(lazy(() => import('../pages/user/config/ConfigView')));



// License
// export const MachineLicenses = Loadable(lazy(()=> import('../pages/machine/License/MachineLicenses')));
// export const LicenseList = Loadable(lazy(()=> import('../pages/machine/License/LicenseList')));

// Machine Categories
export const CategoryAddForm = Loadable(
  lazy(() => import('../pages/machine/Categories/CategoryAddForm'))
);
export const CategoryList = Loadable(
  lazy(() => import('../pages/machine/Categories/CategoryList'))
);
export const CategoryView = Loadable(
  lazy(() => import('../pages/machine/Categories/CategoryView'))
);
export const CategoryViewForm = Loadable(
  lazy(() => import('../pages/machine/Categories/CategoryViewForm'))
);
export const CategoryEdit = Loadable(
  lazy(() => import('../pages/machine/Categories/CategoryEdit'))
);
export const CategoryEditForm = Loadable(
  lazy(() => import('../pages/machine/Categories/CategoryEditForm'))
);

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
export const DocumentList = Loadable(
  lazy(() => import('../pages/document/documents/GlobalDocument'))
);
export const DocumentAddForm = Loadable(
  lazy(() => import('../pages/document/documents/DocumentAddForm'))
);
export const DocumentEditForm = Loadable(
  lazy(() => import('../pages/document/documents/DocumentEditForm'))
);
export const DocumentViewForm = Loadable(
  lazy(() => import('../pages/document/documents/DocumentHistoryViewForm'))
);
export const MachineDrawings = Loadable(
  lazy(() => import('../pages/document/documents/MachineDrawings'))
);
export const MachineDrawingsAddForm = Loadable(
  lazy(() => import('../pages/document/documents/MachineDrawingsAddForm'))
);
export const MachineDrawingsViewForm = Loadable(
  lazy(() => import('../pages/document/documents/MachineDrawingsViewForm'))
);

// Document Name
export const DocumentNameAddForm = Loadable(
  lazy(() => import('../pages/document/documentType/DocumentTypeAddForm'))
);
export const DocumentNameList = Loadable(
  lazy(() => import('../pages/document/documentType/DocumentTypeList'))
);
export const DocumentNameViewForm = Loadable(
  lazy(() => import('../pages/document/documentType/DocumentTypeView'))
);
export const DocumentNameEditForm = Loadable(
  lazy(() => import('../pages/document/documentType/DocumentTypeEditForm'))
);
// export const documentNameView = Loadable(lazy(()=>      import('../pages/document/DocumentName/')));
// export const documentNameEdit = Loadable(lazy(()=>      import('../pages/document/DocumentName/')));

// Fime Category
export const DocumentCategoryAddForm = Loadable(
  lazy(() => import('../pages/document/documentCategory/DocumentCategoryAddForm'))
);
export const DocumentCategoryList = Loadable(
  lazy(() => import('../pages/document/documentCategory/DocumentCategoryList'))
);
export const DocumentCategoryView = Loadable(
  lazy(() => import('../pages/document/documentCategory/DocumentCategoryView'))
);
export const DocumentCategoryEditForm = Loadable(
  lazy(() => import('../pages/document/documentCategory/DocumentCategoryEditForm'))
);
// export const fileCategoryView = Loadable(lazy(()=>     import('../pages/')));
// export const fileCategoryEdit = Loadable(lazy(()=>     import('../pages/')));

// Customer Documents
// export const CustomerDocumentAddForm = Loadable(
//   lazy(() => import('../pages/document/customer/DocumentAddForm'))
// );
// export const CustomerDocumentList = Loadable(
//   lazy(() => import('../pages/document/customer/DocumentList'))
// );
// export const CustomerDocumentViewForm = Loadable(
//   lazy(() => import('../pages/document/customer/DocumentViewForm'))
// );
// export const CustomerDocumentEditForm = Loadable(
//   lazy(() => import('../pages/document/customer/DocumentEditForm'))
// );
// export const CustomerDocumentView = Loadable(
//   lazy(() => import('../pages/document/archived/ViewCustomerDocument'))
// );
// export const customerDocumentView     = Loadable(lazy(()=>      import('../pages/')));
// export const customerDocumentEdit     = Loadable(lazy(()=>      import('../pages/')));

// Machine Documents
// export const MachineDocumentAddForm = Loadable(
//   lazy(() => import('../pages/document/machine/DocumentAddForm'))
// );
// export const MachineDocumentList = Loadable(
//   lazy(() => import('../pages/document/machine/DocumentList'))
// );
// export const MachineDocumentViewForm = Loadable(
//   lazy(() => import('../pages/document/machine/DocumentViewForm'))
// );
// export const MachineDocumentEditForm = Loadable(
//   lazy(() => import('../pages/document/machine/DocumentEditForm'))
// );
// export const MachineDocumentView = Loadable(
//   lazy(() => import('../pages/document/archived/ViewMachineDocument'))
// );


// Configs
export const RegionAdd = Loadable(
  lazy(() => import('../pages/region/RegionAdd'))
);
export const RegionList = Loadable(
  lazy(() => import('../pages/region/RegionList'))
);
export const RegionEdit = Loadable(
  lazy(() => import('../pages/region/RegionEdit'))
);
export const RegionView = Loadable(
  lazy(() => import('../pages/region/RegionView'))
);


// Configs 

export const ModuleAdd = Loadable(  
  lazy(() => import('../pages/module/ModuleAdd'))
  );
export const ModuleList = Loadable( 
   lazy(() => import('../pages/module/ModuleList'))
);
export const ModuleEdit = Loadable(
  lazy(() => import('../pages/module/ModuleEdit'))
);
export const ModuleView = Loadable(
  lazy(() => import('../pages/module/ModuleView'))
);



// Configs

export const ConfigAdd = Loadable(
  lazy(() => import('../pages/config/ConfigAdd'))
);
export const ConfigList = Loadable(
  lazy(() => import('../pages/config/ConfigList'))
);
export const ConfigEdit = Loadable(
  lazy(() => import('../pages/config/ConfigEdit'))
);
export const ConfigView = Loadable(
  lazy(() => import('../pages/config/ConfigView'))
);
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
