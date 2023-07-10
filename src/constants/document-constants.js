export const document = {
  icon: {
    pdf: 'bxs:file-pdf',
    doc: 'mdi:file-word',
    docx: 'mdi:file-word',
    xls: 'mdi:file-excel',
    xlsx: 'mdi:file-excel',
    ppt: 'mdi:file-powerpoint',
    pptx: 'mdi:file-powerpoint',
  },
  color: {
    pdf: '#f44336',
    doc: '#448aff',
    docx: '#448aff',
    xls: '#388e3c',
    xlsx: '#388e3c',
    ppt: '#e65100',
    pptx: '#e65100',
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

// Snackbars constants
export const Snacks = {
  docSaved: 'Document Saved Successfully',
  docUpdated: 'Document Updated Successfully',
  docVersionUpdated: 'Document Version Updated Successfully',
  failedSaveDoc: 'Failed to Save the Document',

  addedDoc: 'Customer Document UPLOAD Successful', // Upload Success message
  updatedDoc: 'Customer Document UPDATE Successful', // Update Success message
  deletedDoc: 'Customer Document DELETE Successful', // Delete Success message

  failedDoc: 'Failed to UPLOAD Customer Document', // Update Failed message
  failedUpdateDoc: 'Failed to UPDATE Customer Document', // Update Failed message
  failedDeleteDoc: 'Failed to DELETE Customer Document', // Delete Failed message

  // documentAddForm -documents dashboard
  fileRequired: 'File is required',
  fileMaxSize: 'File size should be less than 10MB',
  fileMaxCount: 'Maximum 10 files can be uploaded at a time.',
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
    ACCOUNT: 'Account Manager',
    PRORJECT: 'Project Manager',
    SUPPORT: 'Support Manager',
  },
};
