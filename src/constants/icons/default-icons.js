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
    icon: 'mdi:check-circle-outline',
    color: '#008000',
    heading: 'Active',
  },
  INACTIVE: {
    icon: 'mdi:ban',
    color: '#FF0000',
    heading: 'Inactive',
  },

  // isOnline
  ONLINE: {
    icon: 'mdi:circle',
    color: '#008000',
    heading: 'Online',
  },
  OFFLINE: {
    icon: 'mdi:circle',
    color: '#bdbdbd',
    heading: 'Offline',
  },

  // isAPPROVED
  APPROVED: {
    icon: 'mdi:check-decagram',
    color: '#008000',
    heading: 'Approved',
  },
  NOTAPPROVED: {
    icon: 'mdi:alert-decagram',
    color: '#FF0000',
    heading: 'Not Approved',
  },

  REQUIRED: {
    icon: 'mdi:required-circle',
    color: '#008000',
    heading: 'Required',
  },
  NOTREQUIRED: {
    icon: 'mdi:required-circle',
    color: '#FF0000',
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
  SEARCHBTN: {
      color: 'green',
      heading: (btnName) => btnName
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
    icon: 'tabler:2fa',
    color: '#008000',
    heading: 'MFA Enabled',
  },
  MULTIAUTH_INACTIVE: {
    icon: 'tabler:2fa',
    color: '#FF0000',
    heading: 'MFA Disabled',
  },

  // ------------------------------------------------------------
  // CURRENT EMPLOYEE
  CURR_EMP_ACTIVE: {
    icon: 'ph:identification-badge',
    color: '#008000',
    heading: 'Employee',
  },
  CURR_EMP_INACTIVE: {
    icon: 'ph:identification-badge',
    color: '#FF0000',
    heading: 'Not Employee',
  },

  // ------------------------------------------------------------
  // customerAccess
  ALLOWED: {
    icon: 'mdi:book-check',
    color: '#008000',
    heading: 'Allowed',
  },
  DISALLOWED: {
    icon: 'mdi:book-cancel-outline',
    color: '#FF0000',
    heading: 'Customer Access Blocked',
  },
  // ----------------------------------------------------------------
  ADD_NEW_VERSION: {
    icon: 'icon-park-outline:add',
    color: 'primary.main',
    heading: 'Add a New Version',
    width: '16px',
  },
  // ------------------------------------------------------------
  VIEW_VERSIONS: {
    icon: 'mdi:archive-eye',
    color: 'primary.main',
    heading: 'View all Versions',
    width: '16px',
  },
  // ------------------------------------------------------------
  VIEW_PROFILE_SETS: {
    icon: 'mdi:application-cog-outline',
    color: 'primary.main',
    heading: 'View Profile Sets',
    width: '16px',
  },
  // ------------------------------------------------------------
  // Back Link
  BACK_LINK: {
    icon: 'vaadin:arrow-backward',
    color: 'blue',
    heading: 'Back',
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
  // service information
  MACHINE_SERVICE_CATEGORIES: {
    icon: 'mdi:cog',
    heading: 'Service Categories',
  },

  // service information
  MACHINE_SERVICE_CATEGORY: {
    icon: 'mdi:cog',
    heading: 'Item Categories',
  },

  MACHINE_CHECK_ITEMS: {
    icon: 'carbon:parameter',
    heading: 'Check Items',
  },
  MACHINE_SERVICE_RECORD_CONFIG: {
    icon: 'mdi:tools',
    heading: 'Service Doc Configurations',
  },

  // @root - Settings - settings
  // document settings
  DOCUMENT_TYPE: {
    icon: 'lucide:list-todo',
    heading: 'Document Type',
  },
  DOCUMENT_CATEGORY: {
    icon: 'ic:round-category',
    heading: 'Document Category',
  },
  // security settings
  SECURITY_ROLES: {
    icon: 'ph:user-list-bold',
    heading: 'User Roles',
  },
  SIGNIN_LOGS: {
    icon: 'icon-park-outline:log',
    heading: 'User Sign In Logs',
  },
  USER_CONFIG: {
    icon: 'mdi:account-settings-variant',
    heading: 'User Configurations',
  },
  USER_INVITE: {
    icon: 'ph:user-plus-bold',
    heading: 'User Invites',
  },
  BLOCKED_CUSTOMER: {
    icon: 'tabler:home-off',
    heading: 'Blocked Customers',
  },
  BLOCKED_USER: {
    icon: 'fluent:people-lock-20-regular',
    heading: 'Blocked Users',
  },
  BLACKLIST_IP: {
    icon: 'solar:list-cross-bold',
    heading: 'Blacklist IPs',
  },
  WHITELIST_IP: {
    icon: 'solar:list-check-bold',
    heading: 'Whitelist IPs',
  },
  REGION: {
    icon: 'grommet-icons:map',
    heading: 'Regions',
  },
  MODULE: {
    icon: 'ic:round-view-module',
    heading: 'Module',
  },
  SYSTEM_CONFIG: {
    icon: 'icon-park-outline:setting-config',
    heading: 'System Config',
  },
  DEPARTMENNTS: {
    icon: 'mingcute:department-line',
    heading: 'Departments',
  },

  MOVE_MACHINE: {
    icon: 'ri:swap-box-line',
    heading: 'Move',
  },

  USER_LOCK: {
    icon: 'mingcute:lock-fill',
    color: '#FF0000',
    heading: 'Lock User',
  },
  USER_UNLOCK: {
    icon: 'mingcute:unlock-fill',
    color: '#008000',
    heading: 'Unlock User',
  },
  // @root - GoogleMaps - map marker
  MAP_MARKER: {
    url: '/logo/howick_map-marker.svg',
  },
};
