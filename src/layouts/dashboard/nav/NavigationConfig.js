// components
import { allSideBarOptions, generalSideBarOptions } from '../navigationConstants';

// ----------------------------------------------------------------------

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
