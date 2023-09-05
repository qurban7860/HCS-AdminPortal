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

  REQUIRED: {
    icon: 'mdi:required-circle',
    color: 'green',
    heading: 'Required',
  },
  NOTREQUIRED: {
    icon: 'mdi:required-circle',
    color: 'red',
    heading: 'Not Required',
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
    color: 'red',
    heading: 'Inactive',
  },
  // ------------------------------------------------------------
  // MultiAuth
  MULTIAUTH_ACTIVE: {
    icon: 'mdi:password-outline',
    color: 'green',
    heading: 'MFA Enabled',
  },
  MULTIAUTH_INACTIVE: {
    icon: 'mdi:password-off-outline',
    color: 'red',
    heading: 'MFA Disabled',
  },

  // ------------------------------------------------------------
  // CURRENT EMPLOYEE
  CURR_EMP_ACTIVE: {
    icon: 'raphael:employee',
    color: 'green',
    heading: 'Employee',
  },
  CURR_EMP_INACTIVE: {
    icon: 'clarity:employee-line',
    color: 'red',
    heading: 'Not Employee',
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
  MACHINE_SERVICE_PARAMETERS: {
    icon: 'carbon:parameter',
    heading: 'Machine Service Parameters',
  },
  // tools information
  TOOLS: {
    icon: 'mdi:tools',
    heading: 'Tools',
  },
  // service information
  MACHINE_SERVICE_RECORD_CONFIG: {
    icon: 'mdi:tools',
    heading: 'Machine Service Record Configs',
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
  USER_CONFIG: {
    icon: 'mdi:account-settings-variant',
    heading: 'User Configurations',
  },
  REGION: {
    icon: 'mdi:map-marker-circle',
    heading: 'Regions',
  },
  MODULE: {
    icon: 'ic:round-view-module',
    heading: 'Module',
  },
  CONFIG: {
    icon: 'icon-park-outline:setting-config',
    heading: 'Config',
  },
};
