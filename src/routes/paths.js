// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_CALENDAR = '/Calendar';
const ROOTS_CRM = '/crm';
const ROOTS_MACHINE = '/products';
const ROOTS_SECURITY = '/security';
const ROOTS_SETTING = '/settings';
const ROOTS_DOCUMENT = '/documents';
const ROOTS_MACHINE_DRAWING = '/machineDrawings';
const ROOTS_SITEMAP = '/site';

// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newpassword: (token, userId) => path(ROOTS_AUTH, `/new-password/${token}/${userId}`),
  authenticate: path(ROOTS_AUTH, '/authenticate'),
  // newPassword: path(ROOTS_AUTH, '/new-password/${id}/asset/${userId}/edit'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
  userInviteLanding: (id, code, expiry) => path(`/invite/${id}/{$code}/{$expiry}`),
  invalidErrorPage:'/InvalidErrorPage',
  expiredErrorPage:'/ExpiredErrorPage',
  machineNotFound:'/machineNotFound',
};

    // --------------------- Dashboard ----------------------
export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_AUTH, '/login'),
  general: {
    machineByCountries: path(ROOTS_DASHBOARD, `/machineByCountries`),
    machineByModels: path(ROOTS_DASHBOARD, '/machineByModels'),
    machineByYears: path(ROOTS_DASHBOARD, '/machineByYears'),
  },
};

// --------------------- CALENDAR ----------------------
export const PATH_CALENDAR = {
  root: ROOTS_CALENDAR,
  new: path(ROOTS_CALENDAR, `/new`),
  edit: (id) => path(ROOTS_CALENDAR, `/{id}/edit`),
  view: (id) => path(ROOTS_CALENDAR, `/{id}/view`),
};

    // --------------------- Customer -----------------------
export const PATH_CRM = {
  permissionDenied: path(ROOTS_CRM, '/permission-denied'),
  // --------------------- Customers Sites Report -----------------------
  sites: path(ROOTS_CRM, '/sites'),
  // --------------------- Customers Contacts Report -----------------------
  contacts: path(ROOTS_CRM, '/contacts'),
  // --------------------- Customers -----------------------
  customers: {
    list: path(ROOTS_CRM, '/customers'),
    new: path(ROOTS_CRM, '/customers/new'),
    view: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/view`),
    edit: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/edit`),
    // --------------------- Customer Sites -----------------------
    sites: {
      root: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/sites`),
      new: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/sites/new`),
      view: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/sites/${id}/view`),
      edit: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/sites/${id}/edit`),
    },
    // --------------------- Customer Contacts -----------------------
    contacts: {
      root: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/contacts`),
      new: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/contacts/new`),
      view: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/contacts/${id}/view`),
      edit: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/contacts/${id}/edit`),
      move: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/contacts/${id}/move`),
    },
    // --------------------- Customer Notes -----------------------
    notes: {
      root: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/notes`),
      new: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/notes/new`),
      view: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/notes/${id}/view`),
      edit: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/notes/${id}/edit`),
    },  
    // --------------------- Customer Documents -----------------------
    documents: {
      root: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/documents`),
      new: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/documents/new`),
      viewGallery: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/documents/viewGallery`),
      edit: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/edit`),
      view: {
        root: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/view`),
        addFile: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/view/addFile`),
        newVersion: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/view/newVersion`),
      },
      history: {
        root: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/history`),
        addFile: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/history/addFile`),
        newVersion: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/history/newVersion`),
      },
    },
    // --------------------- Customer Machines -----------------------
    machines: {
      root: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/machines`),
      move: ( customerId, id ) => path(ROOTS_CRM, `/customers/${customerId}/machines/${id}/move`),
      new: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/machines/new`),
    },
    // --------------------- Customer Jira -----------------------
    jira: {
      root: ( customerId ) => path(ROOTS_CRM, `/customers/${customerId}/jira`),
    },
    // ------------------------ ARCHIVED CUSTOMERS ----------------------------------------
    archived: {
      root: path(ROOTS_CRM, '/customers/archived'),
      view: (id) => path(ROOTS_CRM, `/customers/archived/${id}/view`),
    },
  },
  
};

// MACHINE
export const PATH_MACHINE = {
  root: ROOTS_MACHINE,
  permissionDenied: path(ROOTS_MACHINE, '/permission-denied'),
  // --------------------- Machines -----------------------
  machines: {
    root: path(ROOTS_MACHINE, '/machines'),
    new: path(ROOTS_MACHINE, '/machines/new'),
    view: ( machineId ) => path(ROOTS_MACHINE, `/machines/${machineId}/view`),
    edit: ( machineId ) => path(ROOTS_MACHINE, `/machines/${machineId}/edit`),
    transfer: ( machineId ) => path(ROOTS_MACHINE, `/machines/${machineId}/transfer`),
    // -------------------------- ATLASIAN LANDING ROUTES --------------------------------------
    serialNo: {
      view: [
          {
              name: 'view1',
              path: (serialNo, ref) => path(ROOTS_MACHINE, `/machines/serialNo/${serialNo}/customer/${ref}/view`),
          },
          {
              name: 'view2',
              path: (serialNo, ref) => path(ROOTS_MACHINE, `/machines/serialNo/${serialNo}`),
          },
          {
            name: 'view3',
            path: (serialNo, ref) => path(ROOTS_MACHINE, `/machines/serialNo/${serialNo}/${ref}`),
        }
      ]
    },
    // --------------------- SETTINGS -----------------------
    settings: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/settings`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/settings/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/settings/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/settings/${id}/edit`),
    },
    // --------------------- Tool Installed -----------------------
    toolsInstalled: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled/${id}/edit`),
    },
    // --------------------- Machine Tool Installed -----------------------
    notes: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/notes`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/notes/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/notes/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/notes/${id}/edit`),
    },
    // --------------------- Machine Tool Installed -----------------------
    drawings: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/new`),
      attach: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/attach`),
      multipleNew: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/multipleNew`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/${id}/edit`),
      view: {
        root: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/${id}/view`),
        addFile: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/${id}/view/addFile`),
        newVersion: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/drawings/${id}/view/newVersion`),
      },
    },
    // --------------------- Machine Tool Installed -----------------------
    documents: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/documents`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/new`),
      gallery: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/gallery`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/edit`),
      view: {
        root: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/view`),
        addFile: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/view/addFile`),
        newVersion: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/view/newVersion`),
      },
      history: {
        root: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/history`),
        addFile: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/history/addFile`),
        newVersion: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/documents/${id}/history/newVersion`),
      },
    },
    // --------------------- Machine Tool Installed -----------------------
    licenses: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/licenses`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/licenses/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/licenses/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/licenses/${id}/edit`),
    },    
    // --------------------- Machine Tool Installed -----------------------
    profiles: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/profiles`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/profiles/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/profiles/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/profiles/${id}/edit`),
    },    
    // --------------------- Machine Tool Installed -----------------------
    serviceRecords: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceRecords`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceRecords/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceRecords/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceRecords/${id}/edit`),
      history: {
        root: (machineId, serviceId) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceRecords/${serviceId}/history`),
        view: (machineId, serviceId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceRecords/${serviceId}/history/${id}/view`),
      },
    },    
    // --------------------- Machine Tool Installed -----------------------
    ini: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/ini`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/ini/new`),
      view: (machineId, id ) => path(ROOTS_MACHINE, `/machines/${machineId}/ini/${id}/view`),
      compare: (machineId, id1, id2 ) => path(ROOTS_MACHINE, `/machines/${machineId}/ini/${id1}/${id2}/compare`),
    },    
    // --------------------- Machine Tool Installed -----------------------
    logs: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/new`),
      graph: (machineId ) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/graph`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/${id}/view`),
    },    
    jira: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/jira`),
      // new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/new`),
      // view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/${id}/view`),
    },   
    // ------------------------ ARCHIVED MACHINES ----------------------------------------
    archived: {
      root: path(ROOTS_MACHINE, '/machines/archived'),
      view: (id) => path(ROOTS_MACHINE, `/machines/archived/${id}/view`),
    }, 
    // --------------------- MACHINE SETTINGS -----------------------
    machineSettings: {
      root: path(ROOTS_MACHINE, '/machines/machineSettings'),
      groups: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/groups'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/groups/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/groups/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/groups/${id}/edit`),
      },
    // --------------------- MACHINE categories -----------------------
      categories: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/categories'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/categories/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/categories/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/categories/${id}/edit`),
      },
    // --------------------- MACHINE model -----------------------
      models: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/models'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/models/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/models/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/models/${id}/edit`),
      },
    // --------------------- MACHINE supplier -----------------------
      suppliers: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/suppliers'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/suppliers/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/suppliers/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/suppliers/${id}/edit`),
      },
      // --------------------- MACHINE tool -----------------------
      tools: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/tools'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/tools/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/tools/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/tools/${id}/edit`),
      },
      // --------------------- MACHINE Check Item Categories -----------------------
      checkItemCategories: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/checkItemCategories'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/checkItemCategories/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/checkItemCategories/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/checkItemCategories/${id}/edit`),
      },
      // --------------------- MACHINE check Items -----------------------
      checkItems:{
        root: path(ROOTS_MACHINE, '/machines/machineSettings/checkItems'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/checkItems/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/checkItems/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/checkItems/${id}/edit`),
      },
      // --------------------- MACHINE service Record Configs -----------------------
      serviceRecordsConfig: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/serviceRecordsConfig'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/serviceRecordsConfig/new'),
        copy: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/serviceRecordsConfig/${id}/copy`),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/serviceRecordsConfig/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/serviceRecordsConfig/${id}/edit`),
      },
      // --------------------- MACHINE status -----------------------
      status: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/status'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/status/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/status/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/status/${id}/edit`),
      },
      // --------------------- MACHINE Technical Parameter Categories -----------------------
      technicalParameterCategories: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/technicalParameterCategories'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/technicalParameterCategories/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/technicalParameterCategories/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/technicalParameterCategories/${id}/edit`),
      },
      // --------------------- MACHINE Technical Parameters -----------------------
      technicalParameters: {
        root: path(ROOTS_MACHINE, '/machines/machineSettings/technicalParameters'),
        new: path(ROOTS_MACHINE, '/machines/machineSettings/technicalParameters/new'),
        view: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/technicalParameters/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/machineSettings/technicalParameters/${id}/edit`),
      },
    },
  },
};


export const PATH_SETTING = {
  permissionDenied: path(ROOTS_SETTING, '/permission-denied'),
  root: ROOTS_SETTING,
  // ------------------------ Document Type ----------------------------------------
  documentType: {
    list: path(ROOTS_SETTING, '/documentType/list'),
    new: path(ROOTS_SETTING, '/documentType/new'),
    view: (id) => path(ROOTS_SETTING, `/documentType/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/documentType/${id}/edit`),
  },
  // ------------------------ Document Category ----------------------------------------
  documentCategory: {
    list: path(ROOTS_SETTING, '/documentCategory/list'),
    new: path(ROOTS_SETTING, '/documentCategory/new'),
    view: (id) => path(ROOTS_SETTING, `/documentCategory/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/documentCategory/${id}/edit`),
  },
  // ------------------------ SECURITY USER ROLE ----------------------------------------
  role: {
    new: path(ROOTS_SETTING, '/role/new'),
    list: path(ROOTS_SETTING, '/role/list'),
    view: (id) => path(ROOTS_SETTING, `/role/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/role/${id}/edit`),
  },
  // ------------------------ SIG IN LOGS ----------------------------------------
  signInLogs: {
    list: path(ROOTS_SETTING, '/signInLogs/list'),
  },
  // ------------------------ REGIONS ----------------------------------------
  regions: {
    list: path(ROOTS_SETTING, '/regions/list'),
    new: path(ROOTS_SETTING, '/regions/new'),
    view: (id) => path(ROOTS_SETTING, `/regions/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/regions/${id}/edit`)
  },
  // ------------------------ MODULES ----------------------------------------
  modules: {
    list: path(ROOTS_SETTING, '/modules/list'),
    new: path(ROOTS_SETTING, '/modules/new'),
    view: (id) => path(ROOTS_SETTING, `/modules/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/modules/${id}/edit`)
  },
  // ------------------------ SYSTEM CONFIG ----------------------------------------
  configs: {
    list: path(ROOTS_SETTING, '/configs/list'),
    new: path(ROOTS_SETTING, '/configs/new'),
    view: (id) => path(ROOTS_SETTING, `/configs/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/configs/${id}/edit`)
  },
  email : {
    list:path(ROOTS_SETTING, '/email/list'),
    new: path(ROOTS_SETTING, '/email/new'), 
    view: (id) => path(ROOTS_SETTING, `/email/${id}/view`),
  },
  // ------------------------ DEPARTMENTS ----------------------------------------
  departments: {
    list: path(ROOTS_SETTING, '/departments/list'),
    new: path(ROOTS_SETTING, '/departments/new'),
    view: (id) => path(ROOTS_SETTING, `/departments/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/departments/${id}/edit`)
  },
  // ------------------------ PM2 LOGS ----------------------------------------
  pm2: {
      logs: {
        root: path(ROOTS_SETTING, '/pm2/logs/'),
        view: (id) => path(ROOTS_SETTING, `/pm2/logs/${id}/view`),
      }
  },  
  dbBackup: {
    logs: {
      root: path(ROOTS_SETTING, '/dbBackup/logs/'),
      view: (id) => path(ROOTS_SETTING, `/dbBackup/logs/${id}/view`),
    }
},
  // ------------------------ SECURITY USER INVITES ----------------------------------------
  invite: {
    list: path(ROOTS_SETTING, '/invite/list'),
    view: (id) => path(ROOTS_SETTING, `/invite/${id}/view`)
  },
  // ------------------------ RELEASES ----------------------------------------
  releases: {
    list: path(ROOTS_SETTING, '/releases/list'),
    view: (id) => path(ROOTS_SETTING, `/releases/${id}/view`)
  },
};

export const PATH_SECURITY = {
  root: ROOTS_SECURITY,
  permissionDenied: path(ROOTS_SECURITY, '/permission-denied'),
  // ------------------------ SECURITY USERS ----------------------------------------
  users: {
    new: path(ROOTS_SECURITY, `/users/new/`),
    invite: path(ROOTS_SECURITY, `/users/invite/`),
    cards: path(ROOTS_SECURITY, '/users/cards'),
    profile: path(ROOTS_SECURITY, '/users/profile'),
    editProfile: path(ROOTS_SECURITY, '/users/editProfile'),
    password: path(ROOTS_SECURITY, '/users/password'),
    userPassword: path(ROOTS_SECURITY, '/users/changePassword'),
    account: path(ROOTS_SECURITY, '/users/account'),
    view: (id) => path(ROOTS_SECURITY, `/users/${id}/view`),
    edit: (id) => path(ROOTS_SECURITY, `/users/${id}/edit`),
    demoEdit: path(ROOTS_SECURITY, `/users/reece-chung/edit`),
    signInLogList: path(ROOTS_SECURITY, '/users/signInLogList'),
  },
  // ------------------------ SECURITY USER SETTING ----------------------------------------
  config:{
    // ------------------------ BLOCKED CUSTOMERS ----------------------------------------
    blockedCustomer: {
      list: path(ROOTS_SECURITY, '/config/blockedCustomer/list'),
      new: path(ROOTS_SECURITY, `/config/blockedCustomer/new`)
    },
  // ------------------------ BLOCKED USERS ----------------------------------------
    blockedUser: {
      list: path(ROOTS_SECURITY, '/config/blockedUser/list'),
      new: path(ROOTS_SECURITY, `/config/blockedUser/new`)
    },
  // ------------------------ BLACK LIST IP ----------------------------------------
    blacklistIP: {
      list: path(ROOTS_SECURITY, '/config/blacklistIP/list'),
      new: path(ROOTS_SECURITY, `/config/blacklistIP/new`)
    },
  // ------------------------ WHITE LIST IP ----------------------------------------
    whitelistIP: {
      list: path(ROOTS_SECURITY, '/config/whitelistIP/list'),
      new: path(ROOTS_SECURITY, `/config/whitelistIP/new`)
    },
  }
};

export const PATH_SITEMAP = {
  root: ROOTS_SITEMAP,
  permissionDenied: path(ROOTS_SITEMAP, '/permission-denied'),
  general: {
    app: path(ROOTS_SITEMAP, '/app'),
  },
  app: path(ROOTS_SITEMAP, '/app'),
};

// ----------------------- Documents -----------------------------------------
export const PATH_DOCUMENT = {
  root: ROOTS_DOCUMENT,
  permissionDenied: path(ROOTS_DOCUMENT, '/permission-denied'),
  // ----------------------- Documents -----------------------------------------
  document: {
    new: path(ROOTS_DOCUMENT, '/new'),
    newList: path(ROOTS_DOCUMENT, '/newList'),
    gallery: (id) => path(ROOTS_DOCUMENT, `/${id}/gallery`),
    edit: (id) => path(ROOTS_DOCUMENT, `/${id}/edit`),
    view: {
      root: ( id ) => path(ROOTS_DOCUMENT, `/${id}/view`),
      addFile: ( id ) => path(ROOTS_DOCUMENT, `/${id}/view/addFile`),
      newVersion: ( id ) => path(ROOTS_DOCUMENT, `/${id}/view/newVersion`),
    },
    customer: (id) => path(ROOTS_DOCUMENT, `/${id}/customer`),
    machine: (id) => path(ROOTS_DOCUMENT, `/${id}/machine`),
  },
};

// ----------------------- MACHINE DRAWINGS -----------------------------------------
export const PATH_MACHINE_DRAWING = {
  root: ROOTS_MACHINE_DRAWING,
  permissionDenied: path(ROOTS_MACHINE_DRAWING, '/permission-denied'),
  // ----------------------- Documents -----------------------------------------
  machineDrawings:{
    new: path(ROOTS_MACHINE_DRAWING, '/new'),
    newList: path(ROOTS_MACHINE_DRAWING, '/newList'),
    edit: ( id ) => path(ROOTS_MACHINE_DRAWING, `/${id}/edit`),
    view: {
      root: ( id ) => path(ROOTS_MACHINE_DRAWING, `/${id}/view`),
      addFile: ( id ) => path(ROOTS_MACHINE_DRAWING, `/${id}/view/addFile`),
      newVersion: ( id ) => path(ROOTS_MACHINE_DRAWING, `/${id}/view/newVersion`),
    },
  }
};

export const PATH_DOCS = {
  root: 'https://www.howickltd.com/why-howick',
  changelog: 'https://www.howickltd.com/why-howick',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
