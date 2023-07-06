export const FORMLABELS = {
  // Default FormLabels
  isACTIVE: {
    label: 'Active',
    name: 'isActive',
    required: true,
  },
  COVER: {
    NEW_CUSTOMER: 'New Customer',
    EDIT_MODEL: 'Edit Model',
    MACHINE_PLACEHOLDER: 'Machine',
    TOOLS: 'Tools',
    CUSTOMERS: 'Customers',
  },
  // @root FormLabels
  HOWICK: 'Howick Resources',
  ADDRESS: 'Address Information',
  CUSTOMER: 'Customer Information',
  SITE: 'Site Information',
  SITELOC: 'Site Location',
  BILLING_CONTACT: 'Billing Contact Information',
  TECHNICAL_CONTACT: 'Technical Contact Information',

  // @root DocumentAddForm in dashboard/documents
  SELECT_CUSTOMER: 'Select Customer',
  SELECT_SITE: 'Select Site',
  SELECT_MACHINE: 'Select Machine',
  SELECT_MODEL: 'Select Model',
  SELECT_DOCUMENT: 'Select Document',
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

  // Add Buttons on the list pages
  ADDCUSTOMER: 'Add Customer',
  ADDMACHINE: 'Add Machine',
  ADDUSER: 'Add User',
  ADDMODEL: 'Add Model',
  ADDSITE: 'Add Site',
  ADDDOCUMENT: 'Add Document',
  ADDSETTING: 'Add Setting',
  ADDTOOL: 'Add Tool',
};

export const BREADCRUMBS = {
  // breadcrumbs
  CUSTOMERS: 'Customers',
  NEWCONTACT: 'Add new Contact',
  NEWSITE: 'Add new Site',
  MACHINES: 'Machines',
  MODELS: 'Models',

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
};
