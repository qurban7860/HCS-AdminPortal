export const FORMLABELS = {
  // Default FormLabels
  _def: {
    CUSTOMER: 'Customer',
    MACHINE: 'Machine',
    USER: 'User',
    DOCUMENT: 'Document',
  },
  isACTIVE: {
    label: 'Active',
    name: 'isActive',
    required: true,
  },
  isCUSTOMER_ACCESS: {
    label: 'Customer Access',
    name: 'customerAccess',
  },
  isCONNECTABLE: {
    label: 'Connect as a child',
    name: 'connections',
  },
  DESC: {
    label: 'Description',
    name: 'description',
  },
  COVER: {
    NEW_CUSTOMER: 'New Customer',
    NEW_DOCUMENT: 'New Document',
    NEW_DOCUMENT_CATEGORY: 'New Document Category',
    NEW_DOCUMENT_TYPE: 'New Document Type',
    EDIT_DOCUMENT_TYPE: 'Edit Document Type',
    EDIT_MODEL: 'Edit Model',
    EDIT_DOCUMENT_CATEGORY: 'Edit Document Category',
    MACHINE_PLACEHOLDER: 'Machine',
    TOOLS: 'Tools',
    LOGS: 'Logs',
    SETTINGS: 'Settings',
    MACHINE_SETTINGS: 'Machine Settings',
    CUSTOMERS: 'Customers',
    REGISTERED_REQUESTS: "Portal Registrations",
    ARCHIVED_CUSTOMERS: 'Archived Customers',
    DOCUMENTS: 'Documents',
    ADD_DOCUMENTS: 'Add Documents',
    MACHINE_DRAWINGS: 'Machine Drawings',
    ADD_MACHINE_DRAWINGSS: 'New Machine Drawing',
    DEPARTMENTS: 'Departments',
    DEPARTMENTS_ADD: 'Add Department',
    DEPARTMENTS_EDIT: 'Edit Department',
    MACHINE_CHECK_ITEM_SERVICE_CATEGORIES: 'Check Item Categories',
    MACHINE_CHECK_ITEM_SERVICE_CATEGORY_ADD: 'New Check Item Category',
    MACHINE_CHECK_ITEM_SERVICE_CATEGORY_EDIT: 'Edit Check Item Category',
    MACHINE_CHECK_ITEM_SERVICE_PARAMS: 'Check Items',
    MACHINE_CHECK_ITEM_SERVICE_PARAMS_CONSTRCTUION: 'Check Items (Under Construction)',
    MACHINE_CHECK_ITEM_SERVICE_PARAM_ADD: 'New Check Item',
    MACHINE_CHECK_ITEM_SERVICE_PARAM_EDIT: 'Edit Check Item',
    MACHINE_CHECK_ITEM_SERVICE_CONFIGS: 'Service Report Template',
    MACHINE_CHECK_ITEM_SERVICE_CONFIGS_ADD: 'New Service Template',
    MACHINE_CHECK_ITEM_SERVICE_CONFIGS_EDIT: 'Edit Service Template',
    MACHINE_CHECK_ITEM_SERVICE_REPORTS: 'Check Items Service Reports',
    MACHINE_CHECK_ITEM_SERVICE_REPORT_ADD: 'New Check Items Service Report',
    MACHINE_CHECK_ITEM_SERVICE_CHECK_PARAM_REPORT_ADD: 'New Check Items Service Parameter',
    MACHINE_CHECK_ITEM_SERVICE_REPORT_EDIT: 'Edit Check Items Service Report',
    MACHINE_SERVICE_REPORT_NOTES: 'Notes / Comments',
    TICKET_ATTACHMENTS: 'Attachments',
    TICKET_COMMENTS: 'Notes / Comments',
    TICKET_HISTORY: 'Ticket History',
    TICKET_WORKLOG: 'Ticket WorkLog',
    EDIT_DOCUMENT: 'Edit Document',
  },

  // @root FormLabels
  ADDMULTIPLEDRAWING: 'Upload Multiple Drawing',
  HOWICK: 'Howick Resources',
  ADDRESS: 'Address Information',
  SITEINFORMATION: 'Site Information',
  CUSTOMER: 'Customer Information',
  SITE: 'Site Information',
  SITELOC: 'Site Location',
  KEYDETAILS: 'Key Details',
  BILLING_CONTACT: 'Billing Contact Information',
  TECHNICAL_CONTACT: 'Technical Contact Information',

  // @root - Machine -settings
  COMMON_SETTINGS: 'Categories & Models',
  TECHNICAL_SETTINGS: 'Machine Settings',
  TOOLS_INFO: 'Tools Information',
  SERVICE: 'Service Report Template Settings',
  OTHERS: 'Others',

  // @root - Settings
  DOCUMENT_SETTINGS: 'Document Settings',
  SECURITY_SETTINGS: 'Security Settings',
  REPORTS: 'Reports',
  CONFIG: 'Configuration',
  EMAILS: 'Emails',
  ARCHIVED_REPORTS: 'Archived Reports',
  LOGS_SETTINGS: 'Logs',

  // @root - Ticket Settings
  REQUEST_SETTINGS: 'Request Settings',
  REQUEST_STATUS_SETTINGS: 'Request Status Settings',
  CHANGE_SETTINGS: 'Change Settings',
  PRIORITY_SETTINGS: 'Priority Settings',

  // @root DocumentAddForm in dashboard/documents
  SELECT_CUSTOMER: 'Select Customer',
  SELECT_SITE: 'Select Site',
  SELECT_MACHINE: 'Select Machine',
  SELECT_MODEL: 'Select Model',
  SELECT_DOCUMENT: 'Select Document',
  SELECT_DOCUMENT_CATEGORY: 'Select Document Category',
  SELECT_DOCUMENT_TYPE: 'Select Document Type',
  SELECT_CATEGORY: 'Select Category',
  SYSTEM_LOGS: 'System Logs',
  DOCUMENT_NAME: 'Document Name',
  DOCUMENT_DESC: 'Description',

  // @root CustomerAddForm
  NAME: {
    label: 'Name',
    name: 'name',
  },

  // @root - ModelEditForm - machine
  MODEL_NAME: {
    label: 'Name',
    name: 'name',
  },
  MODEL_DESC: {
    label: 'Description',
    name: 'description',
  },

  // @root SettingAddForm
  SETTING_TECHPARAM: {
    label: 'Technical Parameter Value',
    name: 'techParamValue',
  },

  // @root LicenseAddForm
  LICENSE_KEY: {
    label: 'License Key',
    name: 'licenseKey',
  },
  LICENSE_DETAILS: {
    label: 'License Details',
    name: 'licenseDetail',
  },
};

// dialog contents
export const DIALOGS = {
  // customer
  CUSTOMER: 'Go to Customer',

  // machine
  MACHINE: 'Go to Machine',

  //  confirm dialogs
  CONFIRM: 'Confirm',
  //   discard changes
  DISCARD: 'Are you sure you want to Discard your changes?',
  DISCARD_TITLE: 'Discard Changes',
  TRANSFER_CONFIRM: 'Are you sure to transfer this machine?',
  TRANSFER_CONFIRM_TITLE: 'Transfer Machine',
  //   delete
  DELETE: {
    content: 'Are you sure you want to Delete?',
    title: 'Delete',
  },
};

export const BUTTONS = {
  SAVE: 'Save',
  SAVE_AS_DRAFT: 'Save as Draft',
  EXPORT: {
    label: 'Export CSV',
    icon: 'icon-park-outline:excel',
  },
  CLEAR: 'Clear',
  CANCEL: 'Cancel',
  BACK: 'Back',
  DISCARD: 'Discard',
  TRANSFER: 'Transfer',
  CONTINUE: 'Continue',
  DELETE: 'Delete',

  // New Buttons on the TOP of Modules
  NEWCUSTOMER: 'New Customer',
  NEWDOCUMENT: 'New Document',
  NEWNOTE: 'New Note',
  NEWSITE: 'New Site',
  NEWCONTACT: 'New Contact',
  NEWSETTING: 'New Setting',
  NEWMODEL: 'New Model',
  NEWMACHINE: 'New Machine',
  NEWLICENSE: 'New License',
  NEWTOOL: 'New Tool',
  INSTALLTOOL: 'Install Tool',

  // Add Buttons on the list pages
  ADDCUSTOMER: 'Add Customer',
  ADDMACHINE: 'Add Machine',
  ADDUSER: 'Add User',
  INVITEUSER: 'Invite User',
  ADDSITE: 'Add Site',
  // settings
  ADDCATEGORY: 'Add Category',
  ADDMODEL: 'Add Model',
  ADDSUPPLIER: 'Add Supplier',
  ADDSTATUS: 'Add Status',
  ADDTECHPARAM: 'Add Technical Parameter',
  // Ticket settings
  ADDTICKET: 'Add New Ticket',
  // Service settings
  ADDSERVICESETTING: 'Add Service Setting',
  EDITSERVICESETTING: 'Edit Service Setting',
  // machine
  ADDTOOLINSTALLED: 'Add Tool Installed',
  ADDLICENSE: 'Add License',
  ADDPROFILE: 'Add Profile',

  // documents
  ADDDOCUMENT: 'Add Document',
  ADDDRAWING: 'Upload Single Drawing',
  ADDSETTING: 'Add Setting',
  ADDTOOL: 'Add Tool',

  // security
  ADDROLE: 'Add Role',
  ADDDOCUMENT_CATEGORY: 'Add Document Category',
  ADDDOCUMENT_TYPE: 'Add Document Type',
  THUMBNAIL_UPLOAD: 'Add / Upload Files',

  // region
  ADDREGION: 'Add Region',
  // module
  ADDMODULE: 'Add Module',
  // note
  ADDNOTE: 'Add Note',
  // CONFIG
  ADDCONFIG: 'Add Config',

  // MACHINE SETTINGS
  ADD_CHECK_ITEM_CATEGORY: 'Add Category',
  ADD_SERVICE_CHECK_ITEM: 'Add Check Item',
  ADD_MACHINE_SERVICE_CONFIG: 'Add New Template',
  ADD_SERVICE_REPORT_STATUS: "Add Service Report Status",
  ADD_MACHINE_SERVICE_REPORT: 'Add Service Report',
  ADD_MACHINE_INI: 'Add INI',
  ADD_MACHINE_LOGS: 'Add New Log',
  SHOW_LOG_GRAPH: 'Show Logs Graph',

  // auth
  UPDATEPASSWORD: 'Update Password',
  UPDATED: (param) => `${param} Updated`
};

export const BREADCRUMBS = {
  // breadcrumbs
  CUSTOMERS: 'Customers',
  NEWCONTACT: 'Add new Contact',
  NEWSITE: 'Add new Site',
  MACHINES: 'Machines',
  MODELS: 'Models',

  // @root - DocumentList - customer
  DOCUMENTS: 'Documents',
  NEWDOCUMENT: 'New Document',
  EDITDOCUMENT: 'Edit Document',
  NEWDOCUMENT_TYPE: 'New Document Type',
  NEWDOCUMENT_CATEGORY: 'New Document Category',

  // @root - MachineLicenseList
  NEWLICENSE: ' New License',
  LICENSE: 'License',
  EDITLICENSE: 'Edit License',

  // @root - MachineToolInstalledList
  NEWTOOL: 'New Tool',
  TOOL: 'Tools',
  EDITTOOL: 'Edit Tool',

  // @root - MachineNoteList
  MACHINE_NEWNOTE: 'New Note',
  MACHINE_NOTE: 'Notes',
  MACHINE_EDITNOTE: 'Edit Note',
};

export const TITLES = {
  UNDERDEVELOPMENT: 'Under Development',

  // @root - GeneralAppPage - dashboard
  //  Welcome
  WELCOME: `CUSTOMER \n SERVICE & SUPPORT`,
  WELCOME_DESC: 'Providing seamless and hassle-free experience that exceeds your expectations and helps you to achieve your business goals.',
  SUPPORT_SERV: 'Support Services',
  // @root - LicenseAddForm
  NEWLICENSE: 'New License',
  // @root - ResetPasswordPage - forgot password
  FORGOT_PASSWORD: 'Forgot your password?',
 CHECK_EMAIL: 'Check your E-mail',
  FORGOT_DESC:
    'Enter your email address below and we will send you instructions on how to reset your password.',
  FORGOT_RETURN: 'Return to sign in',
  FORGOT_REQUEST: 'Send Request',
  // @root -MachineViewForm - site location
  NO_SITELOC: 'No site location was provided',

  // @root - AccountPopover - settings drawer
  SETTINGS: 'Settings',
  CUSTOMIZE: 'Theme Settings',
  LOGOUT: 'Logout',
  MODE: 'Mode',
  CONTRAST: 'Contrast',
  DIRECTION: 'Direction',
  LAYOUT: 'Layout',
  STRETCH: {
    label: 'Stretch',
    tooltip: 'Only available at large resolutions > 1600px (xl)',
  },
  PRESETS: 'Presets',
  REPORTS_TITLE: 'Reports',
  REPORTS_DESC: 'Access comprehensive reports and analytics to monitor your machine performance, track maintenance history, and analyze operational data. Our reporting system provides detailed insights across various categories to help you make informed decisions.',
};

export const TOGGLE = {
  // @root - TOGGLE BUTTONS
  CUSTOMER_ACCESS: 'Customer Access',
  ACTIVE: 'Active',
  DEFAULT: 'Default',
  CONNECTABLE: 'Connect as a child',
};

export const Snacks = {
  configuration_Verification_Success: 'Verification Success',
  configuration_Verification_Failed: 'Verification Failed!',
  configuration_approve_Success: 'Template approved Successfully!',
  configuration_approve_Failed: 'Template approve Failed!',
  // auth: reset
  password_changed: 'Password update Successful',
  password_change_failed: 'Password update Failed'
}
