// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_PORTAL_REGISTRATIONS = '/crm/portalRegistrations';
export const ROOTS_CRM = '/crm';
export const ROOTS_MACHINE = '/products';
export const ROOTS_SUPPORT = '/support';
export const ROOTS_REPORTS = '/reports';
export const ROOTS_CALENDAR = '/calendar';
export const ROOTS_SETTING = '/settings';
export const ROOTS_JOB = '/jobs';
// const ROOTS_MACHINE_SETTING_REPORT = '/machineSettingReports'
// const ROOTS_SERVICE_REPORTS = '/serviceReports'
// const ROOTS_SECURITY = '/security';
// const ROOTS_DOCUMENT = '/products/documents';
const ROOTS_MACHINE_DRAWING = '/products/machineDrawings';
// const ROOTS_TICKET = '/tickets';
// const ROOTS_SITEMAP = '/sites';
// const ROOTS_MACHINE_LOGS = '/machineLogs';


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
  invalidErrorPage: '/InvalidErrorPage',
  expiredErrorPage: '/ExpiredErrorPage',
  machineNotFound: '/machineNotFound',
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
      root: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/sites`),
      new: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/sites/new`),
      view: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/sites/${id}/view`),
      edit: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/sites/${id}/edit`),
    },
    // --------------------- Customer Contacts -----------------------
    contacts: {
      root: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/contacts`),
      new: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/contacts/new`),
      view: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/contacts/${id}/view`),
      edit: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/contacts/${id}/edit`),
      move: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/contacts/${id}/move`),
    },
    // --------------------- Customer Notes -----------------------
    notes: {
      root: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/notes`),
      new: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/notes/new`),
      view: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/notes/${id}/view`),
      edit: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/notes/${id}/edit`),
    },
    // --------------------- Customer Documents -----------------------
    documents: {
      root: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/documents`),
      new: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/documents/new`),
      viewGallery: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/documents/viewGallery`),
      edit: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/edit`),
      view: {
        root: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/view`),
        addFile: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/view/addFile`),
        newVersion: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/view/newVersion`),
      },
      history: {
        root: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/history`),
        addFile: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/history/addFile`),
        newVersion: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/documents/${id}/history/newVersion`),
      },
    },
    // --------------------- Customer Machines -----------------------
    machines: {
      root: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/machines`),
      move: (customerId, id) => path(ROOTS_CRM, `/customers/${customerId}/machines/${id}/move`),
      new: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/machines/new`),
    },
    // --------------------- Customer Jira -----------------------
    jira: {
      root: (customerId) => path(ROOTS_CRM, `/customers/${customerId}/jira`),
    },
    // ------------------------ ARCHIVED CUSTOMERS ----------------------------------------
    archived: {
      root: path(ROOTS_CRM, '/archived-customers'),
      view: (id) => path(ROOTS_CRM, `/archived-customers/${id}/view`),
    },
  },
  sitesMap: {
    root: path(ROOTS_CRM, '/sitesMap'),
  },
  // ------------------------ DEPARTMENTS ----------------------------------------
  departments: {
    list: path(ROOTS_CRM, '/departments/list'),
    new: path(ROOTS_CRM, '/departments/new'),
    view: (id) => path(ROOTS_CRM, `/departments/${id}/view`),
    edit: (id) => path(ROOTS_CRM, `/departments/${id}/edit`)
  },
};

// --------------------- CUSTOMER REGISTRATIONS ----------------------
export const PATH_PORTAL_REGISTRATION = {
  root: ROOTS_PORTAL_REGISTRATIONS,
  edit: (customerId) => path(ROOTS_PORTAL_REGISTRATIONS, `/${customerId}/edit`),
  view: (customerId) => path(ROOTS_PORTAL_REGISTRATIONS, `/${customerId}/view`),
  permissionDenied: path(ROOTS_PORTAL_REGISTRATIONS, '/permission-denied'),
  blank: path(ROOTS_AUTH, '/login'),
};

// MACHINE
export const PATH_MACHINE = {
  root: ROOTS_MACHINE,
  permissionDenied: path(ROOTS_MACHINE, '/permission-denied'),
  // --------------------- Machines -----------------------
  machines: {
    root: path(ROOTS_MACHINE, '/machines'),
    new: path(ROOTS_MACHINE, '/machines/new'),
    view: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/view`),
    edit: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/edit`),
    transfer: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/transfer`),
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
    machineLifecycle: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/machineLifecycle`),
    },
    
    // --------------------- Tool Installed -----------------------
    toolsInstalled: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/toolsinstalled/${id}/edit`),
    },
    // --------------------- Machine Jobs ---------------------------------
    jobs: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/jobs`),
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
    serviceReports: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceReports`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceReports/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceReports/${id}/view`),
      edit: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/serviceReports/${id}/edit`),
    },
    // --------------------- Machine Tool Installed -----------------------
    ini: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/ini`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/ini/new`),
      view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/ini/${id}/view`),
      compare: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/ini/compare`),
    },
    // --------------------- Machine Logs -----------------------
    logs: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs`),
      new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/new`),
      graph: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/graph`),
      // view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/${id}/view`),
    },
    // --------------------- Machine Dashboard -----------------------
    dashboard: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/dashboard`),
    },

    // --------------------- Machine Integration -----------------------
    integration: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/integration`),
    },
    jira: {
      root: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/jira`),
      // new: (machineId) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/new`),
      // view: (machineId, id) => path(ROOTS_MACHINE, `/machines/${machineId}/logs/${id}/view`),
    },
  },
  reports: {
    root: path(ROOTS_MACHINE, '/reports'),
    serviceReports: {
      root: path(ROOTS_MACHINE, '/reports/serviceReports'),
      // view: ( id ) => path(ROOTS_MACHINE, `/serviceReports/${id}/view`),
    },
    machineSettingsReport: {
      root: path(ROOTS_MACHINE, '/reports/machineSettingsReport'),
      // view: ( id ) => path(ROOTS_MACHINE, `/machineSettingsReport/${id}/view`),
    },
    machineLogs: {
      root: path(ROOTS_MACHINE, '/reports/machineLogs'),
    },
    machineGraphs: {
      root: path(ROOTS_MACHINE, '/reports/machineGraphs'),
    },
  },
  documents: {
    root: path(ROOTS_MACHINE, '/documents'),
    list: path(ROOTS_MACHINE, '/documents/list'),
    document: {
      new: path(ROOTS_MACHINE, '/documents/new'),
      newList: path(ROOTS_MACHINE, '/documents/newList'),
      gallery: (id) => path(ROOTS_MACHINE, `/documents/${id}/gallery`),
      edit: (id) => path(ROOTS_MACHINE, `/documents/${id}/edit`),
      view: {
        root: (id) => path(ROOTS_MACHINE, `/documents/${id}/view`),
        addFile: (id) => path(ROOTS_MACHINE, `/documents/${id}/view/addFile`),
        newVersion: (id) => path(ROOTS_MACHINE, `/documents/${id}/view/newVersion`),
      },
      customer: (id) => path(ROOTS_MACHINE, `/documents/${id}/customer`),
      machine: (id) => path(ROOTS_MACHINE, `/documents/${id}/machine`),
    },
    // ------------------------ Document Type ----------------------------------------
    documentType: {
      list: path(ROOTS_MACHINE, '/documents/documentType/list'),
      new: path(ROOTS_MACHINE, '/documents/documentType/new'),
      view: (id) => path(ROOTS_MACHINE, `/documents/documentType/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/documents/documentType/${id}/edit`),
    },
    // ------------------------ Document Category ----------------------------------------
    documentCategory: {
      list: path(ROOTS_MACHINE, '/documents/documentCategory/list'),
      new: path(ROOTS_MACHINE, '/documents/documentCategory/new'),
      view: (id) => path(ROOTS_MACHINE, `/documents/documentCategory/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/documents/documentCategory/${id}/edit`),
    },
  },
  // --------------------- MACHINE SETTINGS -----------------------
  machineSettings: {
    root: path(ROOTS_MACHINE, '/machineSettings'),
    groups: {
      root: path(ROOTS_MACHINE, '/machineSettings/groups'),
      new: path(ROOTS_MACHINE, '/machineSettings/groups/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/groups/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/groups/${id}/edit`),
    },
    // --------------------- MACHINE categories -----------------------
    categories: {
      root: path(ROOTS_MACHINE, '/machineSettings/categories'),
      new: path(ROOTS_MACHINE, '/machineSettings/categories/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/categories/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/categories/${id}/edit`),
    },
    // --------------------- MACHINE model -----------------------
    models: {
      root: path(ROOTS_MACHINE, '/machineSettings/models'),
      new: path(ROOTS_MACHINE, '/machineSettings/models/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/models/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/models/${id}/edit`),
    },
    // --------------------- MACHINE supplier -----------------------
    suppliers: {
      root: path(ROOTS_MACHINE, '/machineSettings/suppliers'),
      new: path(ROOTS_MACHINE, '/machineSettings/suppliers/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/suppliers/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/suppliers/${id}/edit`),
    },
    // --------------------- MACHINE tool -----------------------
    tools: {
      root: path(ROOTS_MACHINE, '/machineSettings/tools'),
      new: path(ROOTS_MACHINE, '/machineSettings/tools/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/tools/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/tools/${id}/edit`),
    },
    // --------------------- MACHINE Check Item Categories -----------------------
    checkItemCategories: {
      root: path(ROOTS_MACHINE, '/machineSettings/checkItemCategories'),
      new: path(ROOTS_MACHINE, '/machineSettings/checkItemCategories/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/checkItemCategories/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/checkItemCategories/${id}/edit`),
    },
    // --------------------- MACHINE check Items -----------------------
    checkItems: {
      root: path(ROOTS_MACHINE, '/machineSettings/checkItems'),
      new: path(ROOTS_MACHINE, '/machineSettings/checkItems/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/checkItems/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/checkItems/${id}/edit`),
    },
    // --------------------- MACHINE service Report Templates -----------------------
    serviceReportsTemplate: {
      root: path(ROOTS_MACHINE, '/machineSettings/serviceReportsTemplate'),
      new: path(ROOTS_MACHINE, '/machineSettings/serviceReportsTemplate/new'),
      copy: (id) => path(ROOTS_MACHINE, `/machineSettings/serviceReportsTemplate/${id}/copy`),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/serviceReportsTemplate/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/serviceReportsTemplate/${id}/edit`),
    },
    // --------------------- MACHINE status -----------------------
    serviceReportsStatus: {
      root: path(ROOTS_MACHINE, '/machineSettings/serviceReportsStatus'),
      new: path(ROOTS_MACHINE, '/machineSettings/serviceReportsStatus/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/serviceReportsStatus/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/serviceReportsStatus/${id}/edit`),
    },
    // --------------------- MACHINE status -----------------------
    status: {
      root: path(ROOTS_MACHINE, '/machineSettings/status'),
      new: path(ROOTS_MACHINE, '/machineSettings/status/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/status/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/status/${id}/edit`),
    },
    // --------------------- MACHINE Technical Parameter Categories -----------------------
    technicalParameterCategories: {
      root: path(ROOTS_MACHINE, '/machineSettings/technicalParameterCategories'),
      new: path(ROOTS_MACHINE, '/machineSettings/technicalParameterCategories/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/technicalParameterCategories/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/technicalParameterCategories/${id}/edit`),
    },
    // --------------------- MACHINE Technical Parameters -----------------------
    technicalParameters: {
      root: path(ROOTS_MACHINE, '/machineSettings/technicalParameters'),
      new: path(ROOTS_MACHINE, '/machineSettings/technicalParameters/new'),
      view: (id) => path(ROOTS_MACHINE, `/machineSettings/technicalParameters/${id}/view`),
      edit: (id) => path(ROOTS_MACHINE, `/machineSettings/technicalParameters/${id}/edit`),
    },
  },
  sitesMap: {
    root: path(ROOTS_MACHINE, '/sitesMap'),
  },
  // ------------------------ ARCHIVED MACHINES ----------------------------------------
  archived: {
    root: path(ROOTS_MACHINE, '/archived-machines'),
    view: (id) => path(ROOTS_MACHINE, `/archived-machines/${id}/view`),
  },
};

// JOBS
export const PATH_JOBS = {
  permissionDenied: path(ROOTS_JOB, '/permission-denied'),
  machineJobs: {
    root: path(ROOTS_JOB, '/machineJobs'),
    new: path(ROOTS_JOB, '/machineJobs/new'),
    view: (id) => path(ROOTS_JOB, `/machineJobs/${id}/view`),
    edit: (id) => path(ROOTS_JOB, `/machineJobs/${id}/edit`),
  }
}

// ----------------------- SUPPORT SERVICES -----------------------------------------
export const PATH_SUPPORT = {
  permissionDenied: path(ROOTS_SUPPORT, '/permission-denied'),
  supportDashboard: {
    root: path(ROOTS_SUPPORT, '/supportDashboard'),
    issueType: path(ROOTS_SUPPORT, '/supportDashboard/issueType'),
    requestType: path(ROOTS_SUPPORT, '/supportDashboard/requestType'),
    openIssueType: path(ROOTS_SUPPORT, '/supportDashboard/openIssueType'),
    openRequestType: path(ROOTS_SUPPORT, '/supportDashboard/openRequestType'),
    statusType: path(ROOTS_SUPPORT, '/supportDashboard/statusType'),
    status: path(ROOTS_SUPPORT, '/supportDashboard/status'),
  },
  supportTickets: {
    root: path(ROOTS_SUPPORT, '/supportTickets'),
    new: path(ROOTS_SUPPORT, '/supportTickets/new'),
    view: (id) => path(ROOTS_SUPPORT, `/supportTickets/${id}/view`),
    edit: (id) => path(ROOTS_SUPPORT, `/supportTickets/${id}/edit`),
  },
  ticketSettings: {
    root: path(ROOTS_SUPPORT, '/ticketSettings'),
    // ----------------------- Ticket Collection -----------------------------------------
    issueTypes: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/issueTypes'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/issueTypes/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/issueTypes/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/issueTypes/${id}/edit`),
    },
    requestTypes: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/requestTypes'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/requestTypes/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/requestTypes/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/requestTypes/${id}/edit`),
    },
    priorities: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/priorities'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/priorities/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/priorities/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/priorities/${id}/edit`),
    },
    statuses: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/statuses'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/statuses/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/statuses/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/statuses/${id}/edit`),
    },
    statusTypes: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/statusTypes'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/statusTypes/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/statusTypes/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/statusTypes/${id}/edit`),
    },
    impacts: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/impacts'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/impacts/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/impacts/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/impacts/${id}/edit`),
    },
    changeTypes: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/changeTypes'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/changeTypes/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/changeTypes/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/changeTypes/${id}/edit`),
    },
    changeReasons: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/changeReasons'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/changeReasons/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/changeReasons/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/changeReasons/${id}/edit`),
    },
    investigationReasons: {
      root: path(ROOTS_SUPPORT, '/ticketSettings/investigationReasons'),
      new: path(ROOTS_SUPPORT, '/ticketSettings/investigationReasons/new'),
      view: (id) => path(ROOTS_SUPPORT, `/ticketSettings/investigationReasons/${id}/view`),
      edit: (id) => path(ROOTS_SUPPORT, `/ticketSettings/investigationReasons/${id}/edit`),
    },
  },
  jiraTickets: {
    root: path(ROOTS_SUPPORT, '/jiraTickets')
  },
  knowledgeBase: {
    root: path(ROOTS_SUPPORT, '/knowledgeBase'),
  },
  manuals: {
    root: path(ROOTS_SUPPORT, '/manuals'),
  },
};

// ----------------------- REPORTS -----------------------------------------
export const PATH_REPORTS = {
  root: ROOTS_REPORTS,
  permissionDenied: path(ROOTS_REPORTS, '/permission-denied'),
  machineLogs: {
    root: path(ROOTS_REPORTS, '/machineLogs'),
  },
  machineGraphs: {
    root: path(ROOTS_REPORTS, '/machineGraphs'),
  },
  email: {
    list: path(ROOTS_REPORTS, '/email/list'),
    new: path(ROOTS_REPORTS, '/email/new'),
    view: (id) => path(ROOTS_REPORTS, `/email/${id}/view`),
  },
  // ------------------------ SIGN IN LOGS ----------------------------------------
  signInLogs: {
    list: path(ROOTS_REPORTS, '/signInLogs/list'),
  },
  logs: {
    root: path(ROOTS_REPORTS, '/logs'),
    pm2: {
      root: path(ROOTS_REPORTS, '/logs/pm2/'),
      view: (id) => path(ROOTS_REPORTS, `/logs/pm2/${id}/view`),
    },
    dbBackup: {
      root: path(ROOTS_REPORTS, '/logs/dbBackup/'),
      search: (search) => path(ROOTS_REPORTS, `/logs/dbBackup/${search}`),
      view: (id) => path(ROOTS_REPORTS, `/logs/dbBackup/${id}/view`),
    },
    api: {
      root: path(ROOTS_REPORTS, '/logs/api/'),
      view: (id) => path(ROOTS_REPORTS, `/logs/api/${id}/view`),
    },
  },
};

// --------------------- CALENDAR ----------------------
export const PATH_CALENDAR = {
  root: ROOTS_CALENDAR,
  new: path(ROOTS_CALENDAR, `/new`),
  edit: (id) => path(ROOTS_CALENDAR, `/{id}/edit`),
  view: (id) => path(ROOTS_CALENDAR, `/{id}/view`),
};

export const PATH_SETTING = {
  permissionDenied: path(ROOTS_SETTING, '/permission-denied'),
  root: ROOTS_SETTING,
  security: {
    root: path(ROOTS_SETTING, `/security`),
    // ------------------------ SECURITY USERS ----------------------------------------
    users: {
      new: path(ROOTS_SETTING, `/security/users/new/`),
      invite: path(ROOTS_SETTING, `/security/users/invite/`),
      cards: path(ROOTS_SETTING, '/security/users/cards'),
      profile: path(ROOTS_SETTING, '/security/users/profile'),
      editProfile: path(ROOTS_SETTING, '/security/users/editProfile'),
      password: path(ROOTS_SETTING, '/security/users/password'),
      userPassword: path(ROOTS_SETTING, '/security/users/changePassword'),
      account: path(ROOTS_SETTING, '/security/users/account'),
      view: (id) => path(ROOTS_SETTING, `/security/users/${id}/view`),
      edit: (id) => path(ROOTS_SETTING, `/security/users/${id}/edit`),
      signInLogList: path(ROOTS_SETTING, '/security/users/signInLogList'),
    },
  },
  restrictions: {
    root: path(ROOTS_SETTING, `/restrictions`),
    // ------------------------ BLOCKED CUSTOMERS ----------------------------------------
    blockedCustomer: {
      list: path(ROOTS_SETTING, '/restrictions/blockedCustomer/list'),
      new: path(ROOTS_SETTING, `/restrictions/blockedCustomer/new`)
    },
    // ------------------------ BLOCKED USERS ----------------------------------------
    blockedUser: {
      list: path(ROOTS_SETTING, '/restrictions/blockedUser/list'),
      new: path(ROOTS_SETTING, `/restrictions/blockedUser/new`)
    },
    // ------------------------ BLACK LIST IP ----------------------------------------
    blacklistIP: {
      list: path(ROOTS_SETTING, '/restrictions/blacklistIP/list'),
      new: path(ROOTS_SETTING, `/restrictions/blacklistIP/new`)
    },
    // ------------------------ WHITE LIST IP ----------------------------------------
    whitelistIP: {
      list: path(ROOTS_SETTING, '/restrictions/whitelistIP/list'),
      new: path(ROOTS_SETTING, `/restrictions/whitelistIP/new`)
    },
  },
  // ------------------------ SECURITY USER ROLE ----------------------------------------
  role: {
    new: path(ROOTS_SETTING, '/role/new'),
    list: path(ROOTS_SETTING, '/role/list'),
    view: (id) => path(ROOTS_SETTING, `/role/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/role/${id}/edit`),
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

// ----------------------- MACHINE DRAWINGS -----------------------------------------
export const PATH_MACHINE_DRAWING = {
  root: ROOTS_MACHINE_DRAWING,
  permissionDenied: path(ROOTS_MACHINE_DRAWING, '/permission-denied'),
  // ----------------------- Documents -----------------------------------------
  machineDrawings: {
    new: path(ROOTS_MACHINE_DRAWING, '/new'),
    newList: path(ROOTS_MACHINE_DRAWING, '/newList'),
    edit: (id) => path(ROOTS_MACHINE_DRAWING, `/${id}/edit`),
    view: {
      root: (id) => path(ROOTS_MACHINE_DRAWING, `/${id}/view`),
      addFile: (id) => path(ROOTS_MACHINE_DRAWING, `/${id}/view/addFile`),
      newVersion: (id) => path(ROOTS_MACHINE_DRAWING, `/${id}/view/newVersion`),
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
