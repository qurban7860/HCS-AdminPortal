export const FORMLABELS = {
  // Default FormLabels
  isACTIVE: {
    label: 'Active',
    name: 'isActive',
    required: true,
  },

  COVER: {
    EDIT_MODEL: 'Edit Model',
  },

  // for FormLabels
  HOWICK: 'Howick Resources',
  ADDRESS: 'Address Information',
  CUSTOMER: 'Customer Information',
  SITE: 'Site Information',
  SITELOC: 'Site Location',
  BILLING_CONTACT: 'Billing Contact Information',
  TECHNICAL_CONTACT: 'Technical Contact Information',

  // for DocumentAddForm in dashboard/documents
  SELECT_CUSTOMER: 'Select Customer',
  SELECT_SITE: 'Select Site',
  SELECT_MACHINE: 'Select Machine',
  SELECT_MODEL: 'Select Model',
  SELECT_DOCUMENT: 'Select Document',
  SELECT_DOCUMENT_TYPE: 'Select Document Type',
  SELECT_CATEGORY: 'Select Category',

  DOCUMENT_NAME: 'Document Name',
  DOCUMENT_DESC: 'Description',

  // @root - ModelEditForm - machine
  MODEL_NAME: {
    label: 'Name',
    name: 'name',
  },
  MODEL_DESC: {
    label: 'Description',
    name: 'description',
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
  DELETE: 'Are you sure you want to Delete?',
  DELETE_TITLE: 'Delete',
};

export const BUTTONS = {
  CLEAR: 'Clear',
  DISCARD: 'Discard',
  CONTINUE: 'Continue',
  DELETE: 'Delete',
  // New Buttons on the TOP of Modules
  NEWDOCUMENT: 'New Document',
  NEWNOTE: 'New Note',
  NEWSITE: 'New Site',
  NEWCONTACT: 'New Contact',

  // Add Buttons on the list pages
  ADDCUSTOMER: 'Add Customer',
  ADDMACHINE: 'Add Machine',
};

export const BREADCRUMBS = {
  // breadcrumbs
  CUSTOMERS: 'Customers',
  NEWCONTACT: 'Add new Contact',
  NEWSITE: 'Add new Site',
};
