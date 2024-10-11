import { useEffect, useState } from 'react';
import { 
  PATH_CRM, 
  PATH_CUSTOMER_REGISTRATION,
  PATH_CALENDAR, 
  PATH_DASHBOARD, 
  PATH_MACHINE, 
  PATH_DOCUMENT, 
  PATH_SETTING, 
  PATH_SITEMAP, 
  PATH_SECURITY, 
  PATH_MACHINE_DRAWING, 
  PATH_SUPPORT_TICKETS, 
  PATH_MACHINE_LOGS 
} from '../../../routes/paths';
// components
import Iconify from '../../../components/iconify';
import SvgColor from '../../../components/svg-color';
import { useAuthContext } from '../../../auth/useAuthContext';   
import { MachineIcon } from '../../../theme/overrides/CustomIcons';

// ----------------------------------------------------------------------

function NavigationConfig() {

  const icon = (name) => (
    <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  );
  
  const ICONS = {
    blog: icon('ic_blog'),
    cart: icon('ic_cart'),
    chat: icon('ic_chat'),
    mail: icon('ic_mail'),
    user: icon('ic_user'),
    register: <Iconify icon="mdi:register" />,
    file: icon('ic_file'),
    lock: icon('ic_lock'),
    label: icon('ic_label'),
    blank: icon('ic_blank'),
    kanban: icon('ic_kanban'),
    folder: icon('ic_folder'),
    banking: icon('ic_banking'),
    booking: icon('ic_booking'),
    invoice: icon('ic_invoice'),
    calendar: <Iconify icon="lets-icons:date-range-light" /> ,
    disabled: icon('ic_disabled'),
    external: icon('ic_external'),
    menuItem: icon('ic_menu_item'),
    ecommerce: icon('ic_ecommerce'),
    asset: icon('ic_ecommerce'),
    analytics: icon('ic_analytics'),
    dashboard: <Iconify icon="mdi:view-dashboard" />,
    setting: <Iconify icon="ant-design:setting-filled" />,
    supportTickets: <Iconify icon="icomoon-free:ticket" />,
    email: <Iconify icon ="eva:email-fill"/>,
    document: <Iconify icon="lets-icons:file-dock-fill" />,
    drawing: <Iconify icon="streamline:hand-held-tablet-drawing-solid" />,
    reports: <Iconify icon="mdi:report-box-outline" />,
    map: <Iconify icon="mdi:map-marker" />,
    machines: <MachineIcon key="machine"/>,
    users: <Iconify icon="mdi:account-group" />,
    security: <Iconify icon="mdi:security-account" />,
    machineLogs: <Iconify icon="lucide:list-end" />
  };

  const { 
    isDocumentAccessAllowed, 
    isDrawingAccessAllowed, 
    isSettingAccessAllowed, 
    isSecurityUserAccessAllowed, 
    isEmailAccessAllowed,
    isDeveloper,
  } = useAuthContext();
    
  const [navConfig, setConfig] = useState([
    {
      subheader: 'general',
      items: [
        { title: 'Dashboard', path: PATH_DASHBOARD.root, icon: ICONS.dashboard },
        { title: 'Customers', path: PATH_CRM.customers.list, icon: ICONS.users },
        { title: 'Customer Registrations', path: PATH_CUSTOMER_REGISTRATION.root, icon: ICONS.register },
        { title: 'Machines', path: PATH_MACHINE.machines.root, icon: ICONS.machines },
      ],
    },
  ]);


  useEffect(() => {
    const updatedConfig = [...navConfig];

    if (isDocumentAccessAllowed && navConfig.some((config) => config.title?.toLowerCase() !== 'documents')) {
      updatedConfig[0].items.push({ title: 'Documents', path: PATH_DOCUMENT.root, icon: ICONS.document });
    }

    if (isDrawingAccessAllowed && navConfig.some((config) => config.title?.toLowerCase() !== 'machine drawings')) {
      updatedConfig[0].items.push({ title: 'Machine Drawings', path: PATH_MACHINE_DRAWING.root, icon: ICONS.drawing });
    }

    // Jira Report
    updatedConfig[0].items.push({ title: 'Support Tickets', path: PATH_SUPPORT_TICKETS.root, icon: ICONS.supportTickets });

    if (isSettingAccessAllowed && navConfig.some((config) => config.title?.toLowerCase() !== 'settings')) {
      updatedConfig[0].items.push({ title: 'Settings', path: PATH_SETTING.root, icon: ICONS.setting });
    }

    if (navConfig.some((config) => config.title?.toLowerCase() !== 'Calendar')) {
      updatedConfig[0].items.push({ title: 'Calendar', path: PATH_CALENDAR.root, icon: ICONS.calendar });
    }

    if (!navConfig.some((config) => config.title?.toLowerCase() === 'machine logs')) {
      updatedConfig[0].items.push({ title: 'Machine Logs', path: PATH_MACHINE_LOGS.root, icon: ICONS.machineLogs });
    }    
    
    if (isSecurityUserAccessAllowed && navConfig.some((config) => config?.title?.toLowerCase() !== 'security')) {
      updatedConfig[0].items.push({ title: 'Security', path: PATH_SECURITY.root, icon: ICONS.security });
    }

    if ( navConfig.some((config) => config?.title?.toLowerCase() !== 'sites map')) {
      updatedConfig[0].items.push({ title: 'Sites Map', path: PATH_SITEMAP.root, icon: ICONS.map });
    }

    setConfig(updatedConfig);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ isDocumentAccessAllowed, isDrawingAccessAllowed, isSettingAccessAllowed, isSecurityUserAccessAllowed, isEmailAccessAllowed, isDeveloper ]);

  return navConfig;
};
export default NavigationConfig;
