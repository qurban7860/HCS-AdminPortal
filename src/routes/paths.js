// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_CUSTOMER = '/customers';
const ROOTS_MACHINE = '/products';
const ROOTS_EMAIL =   '/email';
const ROOTS_SECURITY = '/security';
const ROOTS_SETTING = '/settings';
const ROOTS_DOCUMENT = '/documents';
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
  expiredErrorPage:'/ExpiredErrorPage'
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  blank: path(ROOTS_AUTH, '/login'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  asset: {
    root: path(ROOTS_DASHBOARD, '/asset'),
    shop: path(ROOTS_DASHBOARD, '/asset/shop'),
    list: path(ROOTS_DASHBOARD, '/asset/list'),
    // checkout: path(ROOTS_DASHBOARD, '/asset/checkout'),
    new: path(ROOTS_DASHBOARD, '/asset/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/asset/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/asset/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, '/asset/product/nike-bblazer-low-77-vintage/edit'),
    demoView: path(ROOTS_DASHBOARD, '/asset/product/nike-air-force-1-ndestrukt'),
  },
  customer: {
    dashboard: path(ROOTS_DASHBOARD, '/customer/dashboard'),
    list: path(ROOTS_DASHBOARD, '/customer/list'),
    new: path(ROOTS_DASHBOARD, '/customer/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/customer/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/customer/${id}/edit`),
  },
};

export const PATH_CUSTOMER = {
  root: ROOTS_CUSTOMER,
  permissionDenied: path(ROOTS_CUSTOMER, '/permission-denied'),
  list: path(ROOTS_CUSTOMER, '/list'),
  new: path(ROOTS_CUSTOMER, '/new'),
  view: (id) => path(ROOTS_CUSTOMER, `/${id}/view`),
  edit: (id) => path(ROOTS_CUSTOMER, `/${id}/edit`),
  general: {
    app: path(ROOTS_CUSTOMER, '/app'),
  },
  site: {
    root: path(ROOTS_CUSTOMER, '/site'),
    list: path(ROOTS_CUSTOMER, '/site/list'),
    new: path(ROOTS_CUSTOMER, '/site/new'),
    view: (id) => path(ROOTS_CUSTOMER, `/site/${id}/view`),
    edit: (id) => path(ROOTS_CUSTOMER, `/site/${id}/edit`),
  },
  contact: {
    root: path(ROOTS_CUSTOMER, '/contact'),
    list: path(ROOTS_CUSTOMER, '/contact/list'),
    new: path(ROOTS_CUSTOMER, '/contact/new'),
    view: (id) => path(ROOTS_CUSTOMER, `/contact/${id}/view`),
    edit: (id) => path(ROOTS_CUSTOMER, `/contact/${id}/edit`),
  },
  note: {
    root: path(ROOTS_CUSTOMER, '/note'),
    list: path(ROOTS_CUSTOMER, '/note/list'),
    new: path(ROOTS_CUSTOMER, '/note/new'),
    view: (id) => path(ROOTS_CUSTOMER, `/note/${id}/view`),
    edit: (id) => path(ROOTS_CUSTOMER, `/note/${id}/edit`),
  },
};

// Machine

export const PATH_MACHINE = {
  root: ROOTS_MACHINE,
  permissionDenied: path(ROOTS_MACHINE, '/permission-denied'),
  machines: {
    root: path(ROOTS_MACHINE, '/machines'),
    new: path(ROOTS_MACHINE, '/machines/new'),
    list: path(ROOTS_MACHINE, '/machines/list'),
    view: (id) => path(ROOTS_MACHINE, `/machines/${id}/view`),
    edit: (id) => path(ROOTS_MACHINE, `/machines/${id}/edit`),
    settings: {
      app: path(ROOTS_MACHINE, '/machines/settings/app'),

      categories: {
        new: (ROOTS_MACHINE, '/products/machines/settings/categories/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/categories/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/categories/${id}/view`),
        categoryedit: (id) => path(ROOTS_MACHINE, `/machines/settings/categories/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/categories/${id}/edit`),
      },

      model: {
        root: path(ROOTS_MACHINE, '/products/machines/settings'),
        new: (ROOTS_MACHINE, '/products/machines/settings/model/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/model/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/model/${id}/view`),
        modeledit: (id) => path(ROOTS_MACHINE, `/machines/settings/model/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/model/${id}/edit`),
      },

      supplier: {
        root: path(ROOTS_MACHINE, '/products/machines/settings'),
        new: (ROOTS_MACHINE, '/products/machines/settings/supplier/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/supplier/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/supplier/${id}/view`),
        supplieredit: (id) => path(ROOTS_MACHINE, `/machines/settings/supplier/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/supplier/${id}/edit`),
      },

      status: {
        root: path(ROOTS_MACHINE, '/products/machines/settings'),
        new: (ROOTS_MACHINE, '/products/machines/settings/status/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/status/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/status/${id}/view`),
        statusedit: (id) => path(ROOTS_MACHINE, `/machines/settings/status/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/status/${id}/edit`),
      },
      
      technicalParameterCategories: {
        root: path(ROOTS_MACHINE, '/products/machines/settings'),
        new: (ROOTS_MACHINE, '/products/machines/settings/technicalParameterCategories/new'),
        list:
          (ROOTS_MACHINE, '/products/machines/settings/technicalParameterCategories/list'),
        view: (id) =>
          path(ROOTS_MACHINE, `/machines/settings/technicalParameterCategories/${id}/view`),
        techparamcategoryedit: (id) =>
          path(ROOTS_MACHINE, `/machines/settings/technicalParameterCategories/${id}/edit`),
        edit: (id) =>
          path(ROOTS_MACHINE, `/machines/settings/technicalParameterCategories/${id}/edit`),
      },

      machineServiceParams:{
        new: (ROOTS_MACHINE, '/products/machines/settings/machineServiceParams/new'),
        list:(ROOTS_MACHINE, '/products/machines/settings/machineServiceParams/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/machineServiceParams/${id}/view`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/machineServiceParams/${id}/edit`),
      },

      parameters: {
        root: path(ROOTS_MACHINE, '/products/machines/settings'),
        new: (ROOTS_MACHINE, '/products/machines/settings/parameters/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/parameters/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/parameters/${id}/view`),
        parameteredit: (id) =>
          path(ROOTS_MACHINE, `/machines/settings/parameters/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/parameters/${id}/edit`),
      },
      tool: {
        root: path(ROOTS_MACHINE, '/products/machines/settings'),
        new: (ROOTS_MACHINE, '/products/machines/settings/tool/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/tool/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/tool/${id}/view`),
        tooledit: (id) => path(ROOTS_MACHINE, `/machines/settings/tool/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/tool/${id}/edit`),
      },
      serviceRecordConfigs: {
        new: (ROOTS_MACHINE, '/products/machines/settings/serviceRecordConfigs/new'),
        list: (ROOTS_MACHINE, '/products/machines/settings/serviceRecordConfigs/list'),
        view: (id) => path(ROOTS_MACHINE, `/machines/settings/serviceRecordConfigs/${id}/view`),
        servicerecordconfigedit: (id) => path(ROOTS_MACHINE, `/machines/settings/serviceRecordConfigs/${id}/edit`),
        edit: (id) => path(ROOTS_MACHINE, `/machines/settings/serviceRecordConfigs/${id}/edit`),
      },
    },
  },
};

export const PATH_EMAIL = {
  root: ROOTS_EMAIL,
  permissionDenied: path(ROOTS_EMAIL, '/permission-denied'),
  email : {
    list:path(ROOTS_EMAIL, '/list'),
    new: path(ROOTS_EMAIL, '/new'), 
    view: (id) => path(ROOTS_EMAIL, `/${id}/view`),
  },
}

export const PATH_SECURITY = {
  root: ROOTS_SECURITY,
  permissionDenied: path(ROOTS_SECURITY, '/permission-denied'),
  users: {
    root: path(ROOTS_SECURITY, '/users'),
    new: path(ROOTS_SECURITY, '/users/new'),
    list: path(ROOTS_SECURITY, '/users/list'),
    cards: path(ROOTS_SECURITY, '/users/cards'),
    profile: path(ROOTS_SECURITY, '/users/profile'),
    password: path(ROOTS_SECURITY, '/users/password'),
    userPassword: path(ROOTS_SECURITY, '/users/changePassword'),
    account: path(ROOTS_SECURITY, '/users/account'),
    view: (id) => path(ROOTS_SECURITY, `/users/${id}/view`),
    edit: (id) => path(ROOTS_SECURITY, `/users/${id}/edit`),
    demoEdit: path(ROOTS_SECURITY, `/users/reece-chung/edit`),
    signInLogList: path(ROOTS_SECURITY, '/users/signInLogList'),
  },
};

export const PATH_SETTING = {
  root: ROOTS_SETTING,
  permissionDenied: path(ROOTS_SETTING, '/permission-denied'),
  general: {
    app: path(ROOTS_SETTING, '/app'),
  },
  app: path(ROOTS_SETTING, '/app'),
  documentType: {
    list: path(ROOTS_SETTING, '/documentType/list'),
    new: path(ROOTS_SETTING, '/documentType/new'),
    view: (id) => path(ROOTS_SETTING, `/documentType/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/documentType/${id}/edit`),
  },
  documentCategory: {
    list: path(ROOTS_SETTING, '/documentCategory/list'),
    new: path(ROOTS_SETTING, '/documentCategory/new'),
    view: (id) => path(ROOTS_SETTING, `/documentCategory/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/documentCategory/${id}/edit`),
  },
  role: {
    new: path(ROOTS_SETTING, '/role/new'),
    list: path(ROOTS_SETTING, '/role/list'),
    view: (id) => path(ROOTS_SETTING, `/role/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/role/${id}/edit`),
  },
  signInLogs: {
    list: path(ROOTS_SETTING, '/signInLogs/list'),
  },
  regions: {
    list: path(ROOTS_SETTING, '/regions/list'),
    new: path(ROOTS_SETTING, '/regions/new'),
    view: (id) => path(ROOTS_SETTING, `/regions/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/regions/${id}/edit`)
  },
  modules: {
    list: path(ROOTS_SETTING, '/modules/list'),
    new: path(ROOTS_SETTING, '/modules/new'),
    view: (id) => path(ROOTS_SETTING, `/modules/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/modules/${id}/edit`)
  },
  configs: {
    list: path(ROOTS_SETTING, '/configs/list'),
    new: path(ROOTS_SETTING, '/configs/new'),
    view: (id) => path(ROOTS_SETTING, `/configs/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/configs/${id}/edit`)
  },
  userConfig: {
    list: path(ROOTS_SETTING, '/userConfig/list'),
    new: path(ROOTS_SETTING, '/userConfig/new'),
    view: (id) => path(ROOTS_SETTING, `/userConfig/${id}/view`),
    edit: (id) => path(ROOTS_SETTING, `/userConfig/${id}/edit`)
  },
};

export const PATH_SITEMAP = {
  root: ROOTS_SITEMAP,
  permissionDenied: path(ROOTS_SITEMAP, '/permission-denied'),
  general: {
    app: path(ROOTS_SITEMAP, '/app'),
  },
  app: path(ROOTS_SITEMAP, '/app'),
};

export const PATH_DOCUMENT = {
  root: ROOTS_DOCUMENT,
  permissionDenied: path(ROOTS_DOCUMENT, '/permission-denied'),
  document: {
    list: path(ROOTS_DOCUMENT, '/list'),
    new: path(ROOTS_DOCUMENT, '/new'),
    edit: (id) => path(ROOTS_DOCUMENT, `/${id}/edit`),
    view: (id) => path(ROOTS_DOCUMENT, `/${id}/view`),
    customer: (id) => path(ROOTS_DOCUMENT, `/${id}/customer`),
    machine: (id) => path(ROOTS_DOCUMENT, `/${id}/machine`),
    machineDrawings:{
      list: path(ROOTS_DOCUMENT, '/machineDrawings/list'),
      new: path(ROOTS_DOCUMENT, '/machineDrawings/new'),
      view: (id) => path(ROOTS_DOCUMENT, `/machineDrawings/${id}/view`),
    }

  },
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
