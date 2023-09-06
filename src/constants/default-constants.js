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
    EDIT_DOCUMENT_TYPE: 'Edit Document Type',
    EDIT_MODEL: 'Edit Model',
    EDIT_DOCUMENT_CATEGORY: 'Edit Document Category',
    MACHINE_PLACEHOLDER: 'Machine',
    TOOLS: 'Tools',
    SETTINGS: 'Settings',
    CUSTOMERS: 'Customers',
    DOCUMENTS: 'Documents',
    ADD_DOCUMENTS: 'Add Documents',
    MACHINE_DRAWINGS: 'Machine Drawings',
    ADD_MACHINE_DRAWINGSS: 'New Machine Drawing',
    MACHINE_SERVICE_PARAMS: 'Machine Service Parameters',
    MACHINE_SERVICE_PARAM_ADD: 'New Machine Service Parameter',
    MACHINE_SERVICE_PARAM_EDIT: 'Edit Machine Service Parameter',
    MACHINE_SERVICE_CONFIGS: 'Machine Service Configurations',
    MACHINE_SERVICE_CONFIGS_ADD: 'New Machine Service Configurations',
    MACHINE_SERVICE_CONFIGS_EDIT: 'Edit Machine Service Configurations',
    EDIT_DOCUMENT: 'Edit Document',
  },

  // @root FormLabels
  HOWICK: 'Howick Resources',
  ADDRESS: 'Address Information',
  CUSTOMER: 'Customer Information',
  SITE: 'Site Information',
  SITELOC: 'Site Location',
  KEYDETAILS: 'Key Details',
  BILLING_CONTACT: 'Billing Contact Information',
  TECHNICAL_CONTACT: 'Technical Contact Information',

  // @root - Machine -settings
  COMMON_SETTINGS: 'Common Settings',
  TECHNICAL_SETTINGS: 'Technical Settings',
  TOOLS_INFO: ' Tools Information',
  SERVICE: ' Service Settings',


  // @root - Settings
  DOCUMENT_SETTINGS: 'Document Settings',
  SECURITY_SETTINGS: 'Security Settings',

  // @root DocumentAddForm in dashboard/documents
  SELECT_CUSTOMER: 'Select Customer',
  SELECT_SITE: 'Select Site',
  SELECT_MACHINE: 'Select Machine',
  SELECT_MODEL: 'Select Model',
  SELECT_DOCUMENT: 'Select Document',
  SELECT_DOCUMENT_CATEGORY: 'Select Document Category',
  SELECT_DOCUMENT_TYPE: 'Select Document Type',
  SELECT_CATEGORY: 'Select Category',

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

  //   delete
  DELETE: {
    content: 'Are you sure you want to Delete?',
    title: 'Delete',
  },
};

export const BUTTONS = {
  SAVE: 'Save',

  CLEAR: 'Clear',
  CANCEL: 'Cancel',
  DISCARD: 'Discard',
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
  ADDSITE: 'Add Site',
  // settings
  ADDCATEGORY: 'Add Category',
  ADDMODEL: 'Add Model',
  ADDSUPPLIER: 'Add Supplier',
  ADDSTATUS: 'Add Status',
  ADDTECHPARAM: 'Add Technical Parameter',
  ADDSERVICERECORDCONFIG: 'Add Record Config',


  // documents
  ADDDOCUMENT: 'Add Document',
  ADDDRAWING: 'Add Drawing',
  ADDSETTING: 'Add Setting',
  ADDTOOL: 'Add Tool',

  // security
  ADDROLE: 'Add Role',
  ADDDOCUMENT_CATEGORY: 'Add Document Category',
  ADDDOCUMENT_TYPE: 'Add Document Type',

  // region
  ADDREGION: 'Add Region',
  // module
  ADDMODULE: 'Add Module',

  // CONFIG
  ADDCONFIG: 'Add Config',

  // MACHINE SETTINGS
  ADD_MACHINE_SERVICE_PARAM: 'Add Parameter',
  ADD_MACHINE_SERVICE_CONFIG: 'Add Service Config',

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
  WELCOME_DESC:
    'Providing seamless and hassle-free experience that exceeds your expectations and helps you to achieve your business goals.',

  // @root - LicenseAddForm
  NEWLICENSE: 'New License',
  // @root - ResetPasswordPage - forgot password
  FORGOT_PASSWORD: 'Forgot your password?',
  FORGOT_DESC:
    'Enter your email address below and we will send you instructions on how to reset your password.',
  FORGOT_RETURN: 'Return to sign in',
  FORGOT_REQUEST: 'Send Request',
  // @root -MachineViewForm - site location
  NO_SITELOC: 'No site location was provided',

  // @root - AccountPopover - settings drawer
  SETTINGS: 'Settings',
  CUSTOMIZE: 'Customize',
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
};

export const TOGGLE = {
  // @root - TOGGLE BUTTONS
  CUSTOMER_ACCESS: 'Customer Access',
  ACTIVE: 'Active',
  CONNECTABLE: 'Connect as a child',
};
