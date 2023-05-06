// ----------------------------------------------------------------------

function path(root, sublink) {
  return `${root}${sublink}`;
}

const ROOTS_AUTH = '/auth';
const ROOTS_DASHBOARD = '/dashboard';
const ROOTS_CUSTOMER = '/customer';
const ROOTS_MACHINE = '/machine';
// ----------------------------------------------------------------------

export const PATH_AUTH = {
  root: ROOTS_AUTH,
  login: path(ROOTS_AUTH, '/login'),
  register: path(ROOTS_AUTH, '/register'),
  loginUnprotected: path(ROOTS_AUTH, '/login-unprotected'),
  registerUnprotected: path(ROOTS_AUTH, '/register-unprotected'),
  verify: path(ROOTS_AUTH, '/verify'),
  resetPassword: path(ROOTS_AUTH, '/reset-password'),
  newPassword: path(ROOTS_AUTH, '/new-password'),
};

export const PATH_PAGE = {
  comingSoon: '/coming-soon',
  maintenance: '/maintenance',
  page403: '/403',
  page404: '/404',
  page500: '/500',
  components: '/components',
};

export const PATH_DASHBOARD = {
  root: ROOTS_DASHBOARD,
  permissionDenied: path(ROOTS_DASHBOARD, '/permission-denied'),
  // blank: path(ROOTS_DASHBOARD, '/blank'),
  blank: path(ROOTS_AUTH, '/login'),
  general: {
    app: path(ROOTS_DASHBOARD, '/app'),
  },
  user: {
    root: path(ROOTS_DASHBOARD, '/user'),
    new: path(ROOTS_DASHBOARD, '/user/new'),
    list: path(ROOTS_DASHBOARD, '/user/list'),
    cards: path(ROOTS_DASHBOARD, '/user/cards'),
    profile: path(ROOTS_DASHBOARD, '/user/profile'),
    password: path(ROOTS_DASHBOARD, '/user/password'),
    userPassword: path(ROOTS_DASHBOARD, '/user/changePassword'),
    account: path(ROOTS_DASHBOARD, '/user/account'),
    view: (id) => path(ROOTS_DASHBOARD, `/user/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/user/${id}/edit`),
    demoEdit: path(ROOTS_DASHBOARD, `/user/reece-chung/edit`),
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
  site: {
    root: path(ROOTS_DASHBOARD, '/site'),
    list: path(ROOTS_DASHBOARD, '/site/list'),
    new: path(ROOTS_DASHBOARD, '/site/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/site/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/site/${id}/edit`),
  },
  contact: {
    root: path(ROOTS_DASHBOARD, '/contact'),
    list: path(ROOTS_DASHBOARD, '/contact/list'),
    new: path(ROOTS_DASHBOARD, '/contact/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/contact/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/contact/${id}/edit`),
  },
  note: {
    root: path(ROOTS_DASHBOARD, '/note'),
    list: path(ROOTS_DASHBOARD, '/note/list'),
    new: path(ROOTS_DASHBOARD, '/note/new'),
    view: (id) => path(ROOTS_DASHBOARD, `/note/${id}/view`),
    edit: (id) => path(ROOTS_DASHBOARD, `/note/${id}/edit`),
  },
};


export const PATH_CUSTOMER = {
  root: ROOTS_CUSTOMER,
  permissionDenied: path(ROOTS_CUSTOMER, '/permission-denied'),
  dashboard: path(ROOTS_CUSTOMER, '/customer/dashboard'),
  list: path(ROOTS_CUSTOMER, '/customer/list'),
  new: path(ROOTS_CUSTOMER, '/customer/new'),
  view: path(ROOTS_CUSTOMER, `/customer/view`),
  edit: (id) => path(ROOTS_CUSTOMER, `/customer/${id}/edit`),
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
  general: {
    app: path(ROOTS_MACHINE, '/app'),
  },
  machine:{
    new: path(ROOTS_MACHINE, '/new'),
    list: path(ROOTS_MACHINE, '/list'),
    view: (id) => path(ROOTS_MACHINE, `/${id}/view`),
    edit: (id) => path(ROOTS_MACHINE, `/${id}/edit`),
  },
  supplier:{
    supplier: (ROOTS_MACHINE, '/machine/supplier/supplier'),
    list: (ROOTS_MACHINE, '/machine/supplier/list'),
    view: (id) => path(ROOTS_MACHINE, `/supplier/${id}/view`),
    supplieredit: (id) => path(ROOTS_MACHINE, `/supplier/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/supplier/${id}/editform`),
  },
  license:{
    license: (ROOTS_MACHINE, '/machine/license/license'),
    list: (ROOTS_MACHINE, '/machine/license/list')
  },
  categories:{
    categories: (ROOTS_MACHINE, '/machine/categories/categories'),
    list: (ROOTS_MACHINE, '/machine/categories/list'),
    view: (id) => path(ROOTS_MACHINE, `/categories/${id}/view`),
    categoryedit: (id) => path(ROOTS_MACHINE, `/categories/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/categories/${id}/editform`),
  },
  tool:{
    tool: (ROOTS_MACHINE, '/machine/tool/tool'),
    list: (ROOTS_MACHINE, '/machine/tool/list'),
    view: (id) => path(ROOTS_MACHINE, `/tool/${id}/view`),
    tooledit: (id) => path(ROOTS_MACHINE, `/tool/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/tool/${id}/editform`),
  },
  techParam:{
    techParam: (ROOTS_MACHINE, '/machine/machine-tech/params'),
    list: (ROOTS_MACHINE, '/machine/machine-tech/list'),
    view: (id) => path(ROOTS_MACHINE, `/machine-tech/${id}/view`),
    techparamcategoryedit: (id) => path(ROOTS_MACHINE, `/machine-tech/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/machine-tech/${id}/editform`),
  },
  machineStatus:{
    status: (ROOTS_MACHINE, '/machine/machine-status/status'),
    list: (ROOTS_MACHINE, '/machine/machine-status/list'),
    view: (id) => path(ROOTS_MACHINE, `/machine-status/${id}/view`),
    statusedit: (id) => path(ROOTS_MACHINE, `/machine-status/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/machine-status/${id}/editform`),
  },
  machineModel:{
    model: (ROOTS_MACHINE, '/machine/machine-model/model'),
    list: (ROOTS_MACHINE, '/machine/machine-model/list'),
    view: (id) => path(ROOTS_MACHINE, `/machine-model/${id}/view`),
    modeledit: (id) => path(ROOTS_MACHINE, `/machine-model/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/machine-model/${id}/editform`),
  },
  parameters:{
    params: (ROOTS_MACHINE, '/machine/machine-parameters/params'),
    list: (ROOTS_MACHINE, '/machine/machine-parameters/list'),
    view: (id) => path(ROOTS_MACHINE, `/machine-parameters/${id}/view`),
    parameteredit: (id) => path(ROOTS_MACHINE, `/machine-parameters/${id}/edit`),
    edit: (id) => path(ROOTS_MACHINE, `/machine-parameters/${id}/editform`),
  },

}

export const PATH_DOCS = {
  root: 'https://www.howickltd.com/why-howick',
  changelog: 'https://www.howickltd.com/why-howick',
};

export const PATH_ZONE_ON_STORE = 'https://mui.com/store/items/zone-landing-page/';

export const PATH_MINIMAL_ON_STORE = 'https://mui.com/store/items/minimal-dashboard/';

export const PATH_FREE_VERSION = 'https://mui.com/store/items/minimal-dashboard-free/';

export const PATH_FIGMA_PREVIEW =
  'https://www.figma.com/file/rWMDOkMZYw2VpTdNuBBCvN/%5BPreview%5D-Minimal-Web.26.11.22?node-id=0%3A1&t=ya2mDFiuhTXXLLF1-1';
