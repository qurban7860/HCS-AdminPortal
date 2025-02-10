// components
import { allSideBarOptions, generalSideBarOptions } from '../navigationConstants';

// ----------------------------------------------------------------------

// function NavigationConfig({selectedCategory}) {

//   const icon = (name) => (
//     <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
//   );
  
//   const ICONS = {
//     blog: icon('ic_blog'),
//     cart: icon('ic_cart'),
//     chat: icon('ic_chat'),
//     mail: icon('ic_mail'),
//     user: icon('ic_user'),
//     register: <Iconify icon="mdi:users-add" />,
//     file: icon('ic_file'),
//     lock: icon('ic_lock'),
//     label: icon('ic_label'),
//     blank: icon('ic_blank'),
//     kanban: icon('ic_kanban'),
//     folder: icon('ic_folder'),
//     banking: icon('ic_banking'),
//     booking: icon('ic_booking'),
//     invoice: icon('ic_invoice'),
//     calendar: <Iconify icon="lets-icons:date-range-light" /> ,
//     disabled: icon('ic_disabled'),
//     external: icon('ic_external'),
//     menuItem: icon('ic_menu_item'),
//     ecommerce: icon('ic_ecommerce'),
//     asset: icon('ic_ecommerce'),
//     analytics: icon('ic_analytics'),
//     dashboard: <Iconify icon="mdi:view-dashboard" />,
//     setting: <Iconify icon="ant-design:setting-filled" />,
//     supportTickets: <Iconify icon="icomoon-free:ticket" />,
//     email: <Iconify icon ="eva:email-fill"/>,
//     document: <Iconify icon="lets-icons:file-dock-fill" />,
//     drawing: <Iconify icon="streamline:hand-held-tablet-drawing-solid" />,
//     reports: <Iconify icon="mdi:report-box-outline" />,
//     machines: <MachineIcon key="machine"/>,
//     serviceReports: <Iconify icon="mdi:clipboard-text-clock" />,
//     users: <Iconify icon="mdi:account-group" />,
//     security: <Iconify icon="mdi:security-account" />,
//     machineLogs: <Iconify icon="lucide:list-end" />,
//     map: <Iconify icon="mdi:map-marker" />,
//     machineSettingReports: <Iconify icon="tdesign:task-setting-filled" />,
//   };

const NavigationConfig = ({
  selectedCategory,
  isDocumentAccessAllowed,
  isDrawingAccessAllowed,
  isSettingAccessAllowed,
  isSecurityUserAccessAllowed,
  requireDashboard = true
}) => {
  let navItems = allSideBarOptions[selectedCategory?.id] || allSideBarOptions.customers;

  if (!isDocumentAccessAllowed) {
    navItems = navItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.title.toLowerCase().includes('document')),
    }));
  }

  if (!isDrawingAccessAllowed) {
    navItems = navItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.title.toLowerCase().includes('drawing')),
    }));
  }

  if (!isSecurityUserAccessAllowed) {
    navItems = navItems.map((section) => ({
      ...section,
      items: section.items.filter((item) => !item.title.toLowerCase().includes('user')),
    }));
  }

  if (!isSettingAccessAllowed && selectedCategory?.id === 'settings') {
    navItems = [];
  }

  if (!isSettingAccessAllowed) {
    navItems = navItems.filter((section) => section.subheader !== 'Config Reports');
  }
  
  if (requireDashboard) {
    navItems = [generalSideBarOptions, ...navItems];
  }

  return navItems;
};
export default NavigationConfig;
