export const ICONS = {
  //  defaults
  size: '30px',
  variant: 'overline',
  badge: 'body2',
  // default icons
  warning: 'mdi:alert-circle-outline',

  // ------------------------------------------------------------

  // @root - src/components/IconPopover -ViewFormFields
  // isActive
  ACTIVE: {
    icon: 'mdi:check-circle',
    color: 'green',
    heading: 'Active',
  },
  INACTIVE: {
    icon: 'mdi:power-off',
    color: 'red',
    heading: 'Inactive',
  },
  // ------------------------------------------------------------
  // deleteDisabled
  DELETE_DISABLED: {
    icon: 'mdi:delete-forever',
    color: 'green',
    heading: 'Delete Disabled',
  },
  DELETE_ENABLED: {
    icon: 'mdi:delete',
    color: 'red',
    heading: 'Delete Enabled',
  },
  // ------------------------------------------------------------
  // isVerified
  VERIFIED: {
    icon: 'ic:round-verified-user',
    color: 'green',
    heading: 'Verified',
  },
  NOT_VERIFIED: {
    icon: 'ic:round-verified-user',
    color: 'red',
    heading: 'Not Verified',
  },
  // ------------------------------------------------------------
  // isActive -Documents
  DOCUMENT_ACTIVE: {
    icon: 'basil:document-solid',
    color: 'green',
    heading: 'Active',
  },
  DOCUMENT_INACTIVE: {
    icon: 'basil:document-solid',
    color: 'green',
    heading: 'Inactive',
  },
  // ------------------------------------------------------------
  // customerAccess
  ALLOWED: {
    icon: 'mdi:book-check',
    color: 'green',
    heading: 'Allowed',
  },
  DISALLOWED: {
    icon: 'mdi:book-cancel-outline',
    color: 'red',
    heading: 'Disallowed',
  },
  // ------------------------------------------------------------
  // map icon
  MAP: {
    icon: 'mdi:google-maps',
    color: 'red',
    heading: 'Open Map',
  },
  // ------------------------------------------------------------

  // @root - Machine - settings
  // common settings
  MACHINE_CATEGORIES: {
    icon: 'mdi:shape-plus',
    heading: 'Machine Categories',
  },
  MACHINE_MODELS: {
    icon: 'mdi:cube-outline',
    heading: 'Machine Models',
  },
  MACHINE_SUPPLIERS: {
    icon: 'mdi:circle-opacity',
    heading: 'Machine Suppliers',
  },
  MACHINE_STATUS: {
    icon: 'mdi:list-status',
    heading: 'Machine Status',
  },
  // technical settings
  TECHPARAM_CATEGORIES: {
    icon: 'mdi:table-cog',
    heading: 'Technical Parameter Categories',
  },
  PARAMETERS: {
    icon: 'mdi:abacus',
    heading: 'Parameters',
  },
  // tools information
  TOOLS: {
    icon: 'mdi:tools',
    heading: 'Tools',
  },

  // @root - Settings - settings
  // document settings
  DOCUMENT_TYPE: {
    icon: 'mdi:rename',
    heading: 'Document Type',
  },
  DOCUMENT_CATEGORY: {
    icon: 'ic:round-category',
    heading: 'Document Category',
  },
  // security settings
  SECURITY_ROLES: {
    icon: 'carbon:user-role',
    heading: 'User Roles',
  },
  SIGNIN_LOGS: {
    icon: 'mdi:clipboard-text',
    heading: 'User Sign In Logs',
  },
  REGION: {
    icon: 'mdi:map-marker-circle',
    heading: 'Region',
  },
};
