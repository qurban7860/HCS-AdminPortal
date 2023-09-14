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
      { title: 'Security', path: PATH_SECURITY.users.list, icon: ICONS.user },
      { title: 'Sites Map', path: PATH_SITEMAP.app, icon: ICONS.reports },
      // {
      //   title: 'Button Title',
      //   path: '/PATH_DASHBOARD.customer.new',
      //   // icon: <Button variant="contained" color="primary">Add Customer</Button>,
      // },
      // deleted components
      // { title: 'ecommerce', path: PATH_DASHBOARD.general.ecommerce, icon: ICONS.ecommerce },
      // { title: 'analytics', path: PATH_DASHBOARD.general.analytics, icon: ICONS.analytics },
      // { title: 'booking', path: PATH_DASHBOARD.general.booking, icon: ICONS.booking },
      // { title: 'file', path: PATH_DASHBOARD.general.file, icon: ICONS.file },
    ],
  },
]

if (userEmailRole) {
  navConfig.map((obj) => obj.items?.push({ title: 'Email', path: PATH_EMAIL.email.list, icon: ICONS.email }));
} 
  // MANAGEMENT
  // ----------------------------------------------------------------------
  // {
  // subheader: 'management',
  // items: [
  //   // USER
  //   {
  //     title: 'user',
  //     path: PATH_DASHBOARD.user.root,
  //     icon: ICONS.user,
  //     children: [
  //       // { title: 'profile', path: PATH_DASHBOARD.user.profile },
  //       // { title: 'cards', path: PATH_DASHBOARD.user.cards },
  //       // { title: 'list', path: PATH_DASHBOARD.user.list },
  //       { title: 'create', path: PATH_DASHBOARD.user.new },
  //       { title: 'edit', path: PATH_DASHBOARD.user.demoEdit },
  //       { title: 'account', path: PATH_DASHBOARD.user.account },
  //     ],
  //   },

  //   // E-COMMERCE

  //   // ASSET
  //   {
  //     title: 'asset',
  //     path: PATH_DASHBOARD.asset.root,
  //     icon: ICONS.analytics,
  //     children: [
  //       // { title: 'shop', path: PATH_DASHBOARD.asset.shop },
  //       // { title: 'product', path: PATH_DASHBOARD.asset.demoView },
  //       { title: 'list', path: PATH_DASHBOARD.asset.list },
  //       { title: 'create', path: PATH_DASHBOARD.asset.new },
  //       // { title: 'edit', path: PATH_DASHBOARD.asset.demoEdit },
  //       // { title: 'checkout', path: PATH_DASHBOARD.asset.checkout },
  //     ],
  //   },

  // CUSTOMER
  // {
  //   title: 'customer',
  //   path: PATH_CUSTOMER.general.app,
  //   icon: ICONS.banking,
  //   children: [
  //     // { title: 'dashboard', path: PATH_CUSTOMER.general.app},
  //     { title: 'list', path: PATH_DASHBOARD.customer.list },
  //     { title: 'create', path: PATH_DASHBOARD.customer.new },

  //   ],
  // },

  // // SITE
  // {
  //   title: 'site',
  //   path: PATH_DASHBOARD.site.root,
  //   icon: ICONS.analytics,
  //   children: [

  //     { title: 'list', path: PATH_DASHBOARD.site.list },
  //     { title: 'create', path: PATH_DASHBOARD.site.new },

  //   ],
  // },

  // // CONTACT
  // {
  //   title: 'contact',
  //   path: PATH_DASHBOARD.contact.root,
  //   icon: ICONS.analytics,
  //   children: [

  //     { title: 'list', path: PATH_DASHBOARD.contact.list },
  //     { title: 'create', path: PATH_DASHBOARD.contact.new },

  //   ],
  // },

  // // NOTE
  // {
  //   title: 'note',
  //   path: PATH_DASHBOARD.note.root,
  //   icon: ICONS.analytics,
  //   children: [

  //     { title: 'list', path: PATH_DASHBOARD.note.list },
  //     { title: 'create', path: PATH_DASHBOARD.note.new },

  //   ],
  // },

  // INVOICE

  // BLOG
  // ],
  // },

  // APP
  // ----------------------------------------------------------------------

  // DEMO MENU STATES
  // {
  //   subheader: 'Other cases',
  //   items: [
  //     {
  //       // default roles : All roles can see this entry.
  //       // roles: ['user'] Only users can see this item.
  //       // roles: ['admin'] Only admin can see this item.
  //       // roles: ['admin', 'manager'] Only admin/manager can see this item.
  //       // Reference from 'src/guards/RoleBasedGuard'.
  //       title: 'item_by_roles',
  //       path: PATH_DASHBOARD.permissionDenied,
  //       icon: ICONS.lock,
  //       roles: ['admin'],
  //       caption: 'only_admin_can_see_this_item',
  //     },
  //     {
  //       title: 'menu_level',
  //       path: '#/dashboard/menu_level',
  //       icon: ICONS.menuItem,
  //       children: [
  //         {
  //           title: 'menu_level_2a',
  //           path: '#/dashboard/menu_level/menu_level_2a',
  //         },
  //         {
  //           title: 'menu_level_2b',
  //           path: '#/dashboard/menu_level/menu_level_2b',
  //           children: [
  //             {
  //               title: 'menu_level_3a',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3a',
  //             },
  //             {
  //               title: 'menu_level_3b',
  //               path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b',
  //               children: [
  //                 {
  //                   title: 'menu_level_4a',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4a',
  //                 },
  //                 {
  //                   title: 'menu_level_4b',
  //                   path: '#/dashboard/menu_level/menu_level_2b/menu_level_3b/menu_level_4b',
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //       ],
  //     },
  //     {
  //       title: 'item_disabled',
  //       path: '#disabled',
  //       icon: ICONS.disabled,
  //       disabled: true,
  //     },

  //     {
  //       title: 'item_label',
  //       path: '#label',
  //       icon: ICONS.label,
  //       info: (
  //         <Label color="info" startIcon={<Iconify icon="eva:email-fill" />}>
  //           NEW
  //         </Label>
  //       ),
  //     },
  //     {
  //       title: 'item_caption',
  //       path: '#caption',
  //       icon: ICONS.menuItem,
  //       caption:
  //         'Quisque malesuada placerat nisl. In hac habitasse platea dictumst. Cras id dui. Pellentesque commodo eros a enim. Morbi mollis tellus ac sapien.',
  //     },
  //     {
  //       title: 'item_external_link',
  //       path: 'https://www.google.com/',
  //       icon: ICONS.external,
  //     },
  //     {
  //       title: 'blank',
  //       path: PATH_DASHBOARD.blank,
  //       icon: ICONS.blank,
  //     },
  //   ],
  // },
// ];

export default navConfig;
