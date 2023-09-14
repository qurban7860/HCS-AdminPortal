export const allowedImageExtensions = ['png', 'jpeg', 'jpg', 'gif', 'bmp', 'webp'];
export const allowedDocumentExtension = ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'];
export const document = {
  icon: {
    pdf: 'bxs:file-pdf',
    doc: 'mdi:file-word',
    docx: 'mdi:file-word',
    xls: 'mdi:file-excel',
    xlsx: 'mdi:file-excel',
    ppt: 'mdi:file-powerpoint',
    pptx: 'mdi:file-powerpoint',
    img: 'mdi:file-image',
  },
  color: {
    pdf: '#f44336',
    doc: '#448aff',
    docx: '#448aff',
    xls: '#388e3c',
    xlsx: '#388e3c',
    ppt: '#e65100',
    pptx: '#e65100',
    img: '#0f8c20',
  },
};

export const fileTypesArray = [
  'png',
  'jpeg',
  'jpg',
  'gif',
  'bmp',
  'webp',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
];

export const fileTypesMessage = `
Only the following formats are accepted:
.png,
.jpeg,
.jpg,
.gif,
.bmp,
.webp,
.pdf,
.doc,
.docx,
.xls,
.xlsx,
.ppt,
.pptx
`;

export const allowedExtensions = [
  'png',
  'jpeg',
  'jpg',
  'gif',
  'bmp',
  'webp',
  'djvu',
  'heic',
  'heif',
  'ico',
  'jfif',
  'jp2',
  'jpe',
  'jpeg',
  'jpg',
  'jps',
  'mng',
  'nef',
  'nrw',
  'orf',
  'pam',
  'pbm',
  'pcd',
  'pcx',
  'pef',
  'pes',
  'pfm',
  'pgm',
  'picon',
  'pict',
  'png',
  'pnm',
  'ppm',
  'psd',
  'raf',
  'ras',
  'rw2',
  'sfw',
  'sgi',
  'svg',
  'tga',
  'tiff',
  'psd',
  'jxr',
  'wbmp',
  'x3f',
  'xbm',
  'xcf',
  'xpm',
  'xwd',
  'pdf',
  'doc',
  'docx',
  'xls',
  'xlsx',
  'ppt',
  'pptx',
  'csv',
  'txt',
  'odp',
  'ods',
  'odt',
  'ott',
  'rtf',
  'txt',
];

// NOTE: These are the constants for the document upload radio buttons for adding a document

// Values for the radio buttons
export const DocRadioValue = {
  new: 'new',
  newVersion: 'newVersion',
  existing: 'existingVersion',

  // documentAddForm in documents
  customer: 'customer',
  machine: 'machine',
};
// Labels for the radio buttons
export const DocRadioLabel = {
  new: 'New Document',
  existing: 'Upload New File Against Existing Document',
  newVersion: 'New Version',
  currentVersion: 'Current Version',

  // documentAddForm in documents
  customer: 'Customer',
  machine: 'Machine',
};
// Radio button options - 'DocRadioLabel & DocRadioValue are confusing, so I have separted them'
export const DocRadioNewVersion = {
  value: 'newVersion',
  label: 'New Version',
};

export const DocRadioNewDocument = {
  value: 'new',
  label: 'New Document',
};

export const DocRadioExistingDocument = {
  value: 'existingVersion',
  label: 'Upload New File Against Existing Document',
  currLabel: 'Current Version',
};

// Snackbars constants
export const Snacks = {
  docSaved: 'Document UPLOAD Successful',
  docUpdated: 'Document UPDATE Successful',
  docVersionUpdated: 'Document Version UPDATE Successful',
  failedSaveDoc: 'FAILED to Save the Document',

  // @root - DocumentCategoryAddForm - documents dashboard
  addedDocCategory: 'Document Category ADD Successful', // Add Success message
  updatedDocCategory: 'Document Category UPDATE Successful', // Update Success message
  deletedDocCategory: 'Document Category DELETE Successful', // Delete Success message
  failedSaveDocCategory: 'FAILED to Save Document Category', // Add Failed message

  // @root - DocumentAddForm - machine documents
  addedMachineDoc: 'Machine Document UPLOAD Successful', // Upload Success message
  updatedMachineDoc: 'Machine Document UPDATE Successful', // Update Success message
  updatedVersionMachineDoc: 'Machine Document Version UPDATE Successful', // Update Success message
  deletedMachineDoc: 'Machine Document DELETE Successful', // Delete Success message

  addedDoc: 'Document UPLOAD Successful', // Upload Success message
  updatedDoc: 'Document UPDATE Successful', // Update Success message
  deletedDoc: 'Document DELETE Successful', // Delete Success message

  failedDoc: 'FAILED to UPLOAD Document', // Update Failed message
  failedUpdateDoc: 'FAILED to UPDATE Document', // Update Failed message
  failedDeleteDoc: 'FAILED to DELETE Document', // Delete Failed message

  // documentAddForm -documents dashboard
  fileRequired: 'File is required',
  fileMaxSize: 'File size should be less than 10MB',
  fileMaxCount: 'Maximum 10 files can be uploaded at a time.',
  docMaxSize: 'Document Name must not exceed 40 characters',

  // @root - DocumentViewForm - documents dashboard
  // preview
  UNEXPECTED: 'Unexpected error occurred',
  DOC_REQUIRED: 'File is required',
};

// @root - DocumentViewForm - documents dashboard
export const FORMLABELS = {
  DOCUMENT_NAME: 'Name',
  ACTIVE_VERSION: 'Active Version',
  DOCUMENT_CATEGORY: 'Document Category',
  DOCUMENT_TYPE: 'Document Type',
  DOCUMENT_CUSTOMER: 'Customer',
  DOCUMENT_MACHINE: 'Machine',
  DOCUMENT_DESC: 'Description',
  ACCOUNT: 'Account Manager',
  PROJECT: 'Project Manager',
  SUPPORT: 'Support Manager',

  // @root - DocumentCategoryAddForm - documents dashboard
  CATEGORY: {
    name: 'name',
    label: 'Category Name',
  },
  CATEGORY_DESC: {
    name: 'description',
    label: 'Description',
  },
  TYPE: {
    name: 'name',
    label: 'Type Name',
  },

  // dialog customer
  CUSTOMER: {
    NAME: 'Name',
    TRADING_NAME: 'Trading Name',
    PHONE: 'Phone',
    FAX: 'Fax',
    EMAIL: 'Email',
    WEBSITE: 'Website',
    SITE_NAME: 'Site Name',
    ADDRESS: {
      STREET: 'Street',
      SUBURB: 'Suburb',
      CITY: 'City',
      REGION: 'Region',
      POSTCODE: 'Post Code',
      COUNTRY: 'Country',
    },
    BILLING: 'Primary Billing Contact',
    TECHNICAL: 'Primary Technical Contact',
  },

  // dialog machine
  MACHINE: {
    SERIALNO: 'Serial No',
    NAME: 'Name',
    PREVIOUS_SN: 'Previous Machine Serial No',
    PREVIOUS_MACHINE: 'Previous Machine',
    SUPPLIER: 'Supplier',
    MACHINE_MODEL: 'Machine Model',
    INSTALLATION_SITE: 'Installation Site',
    BILLING_SITE: 'Billing Site',
    NEARBY_MILESTONE: 'Nearby Milestone',
  },
};
