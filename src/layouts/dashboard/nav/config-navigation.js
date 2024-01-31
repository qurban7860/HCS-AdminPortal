// routes
// import { Button } from '@mui/material';
import { PATH_CUSTOMER, PATH_DASHBOARD, PATH_MACHINE, PATH_DOCUMENT, PATH_SETTING, PATH_SITEMAP, PATH_SECURITY, PATH_EMAIL } from '../../../routes/paths';
// components
// import Label from '../../../components/label';
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';

// ----------------------------------------------------------------------

const userRolesString = localStorage.getItem('userRoles');
const userRoles = userRolesString ? JSON.parse(userRolesString) : [];
const userEmailRole = userRoles?.some((role) => role.roleType === 'Email');
const isSuperAdmin = JSON.parse(localStorage.getItem('userRoles'))?.some((role) => role.roleType === 'SuperAdmin');

const icon = (name) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
);

const ICONS = {
  blog: icon('ic_blog'),
  cart: icon('ic_cart'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: <Iconify icon="mdi:account" />,
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  asset: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: <Iconify icon="mdi:view-dashboard" />,
  setting: <Iconify icon="ant-design:setting-filled" />,
  email: <Iconify icon ="eva:email-fill"/>,
  document: <Iconify icon="basil:document-solid" />,
  reports: <Iconify icon="mdi:report-box-outline" />,
  map: <Iconify icon="mdi:map-legend" />,
  machines: <Iconify icon="mdi:gate-open" />,
  users: <Iconify icon="mdi:account-group" />,
};

const navConfig = [
  // GENERAL
  // ----------------------------------------------------------------------
  {
    subheader: 'general',
    items: [
      { title: 'Dashboard', path: PATH_DASHBOARD.general.app, icon: ICONS.dashboard },
      { title: 'Customers', path: PATH_CUSTOMER.list, icon: ICONS.users },
      { title: 'Machines', path: PATH_MACHINE.machines.list, icon: ICONS.machines },
      { title: 'Documents', path: PATH_DOCUMENT.document.list, icon: ICONS.document },
      { title: 'Machine Drawings', path: PATH_DOCUMENT.document.machineDrawings.list, icon: ICONS.document },
      { title: 'Settings', path: PATH_SETTING.app, icon: ICONS.setting },
      { title: 'Sites Map', path: PATH_SITEMAP.app, icon: ICONS.reports },
    ],
  },
]
if(isSuperAdmin){
  navConfig[0].items.splice(6, 0, { title: 'Security', path: PATH_SECURITY.users.list, icon: ICONS.user });
}
if (userEmailRole) {
  navConfig.map((obj) => obj.items?.push({ title: 'Email', path: PATH_EMAIL.email.list, icon: ICONS.email }));
} 


export default navConfig;
