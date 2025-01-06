import { useState } from "react";
import { useAuthContext } from "../../auth/useAuthContext";
import {
  PATH_CALENDAR,
  PATH_CRM,
  PATH_DASHBOARD,
  PATH_MACHINE,
  PATH_MACHINE_DRAWING,
  PATH_PORTAL_REGISTRATION,
  PATH_REPORTS,
  PATH_SETTING,
  PATH_SUPPORT,
  ROOTS_CALENDAR,
  ROOTS_CRM,
  ROOTS_MACHINE,
  ROOTS_REPORTS,
  ROOTS_SETTING,
  ROOTS_SUPPORT,
} from '../../routes/paths';
import Iconify from "../../components/iconify";
import { MachineIcon } from "../../theme/overrides/CustomIcons";

export const MAIN_CATEGORIES = [
  { title: 'Customers', id: 'customers', path: ROOTS_CRM },
  { title: 'Machines', id: 'machines', path: ROOTS_MACHINE },
  { title: 'Support Services', id: 'support', path: ROOTS_SUPPORT },
  { title: 'Reports', id: 'reports', path: ROOTS_REPORTS }
];

export const OTHER_MAIN_CATEGORIES = [
  { title: 'Calendar', id: 'calendar', icon: 'mdi:calendar-month', path: ROOTS_CALENDAR },
  { title: 'Settings', id: 'settings', icon: 'mdi:settings', path: ROOTS_SETTING },
];

export const generalSideBarOptions = {
  subheader: 'General',
  items: [
    { title: 'Dashboard', path: PATH_DASHBOARD.root, icon: <Iconify icon="mdi:view-dashboard" /> },
  ],
};

export const allSideBarOptions = {
  customers: {
    subheader: 'Customers',
    items: [
      {
        title: 'Customers',
        path: PATH_CRM.customers.list,
        icon: <Iconify icon="mdi:account-group" />,
      },
      { title: 'Sites', path: PATH_CRM.sites, icon: <Iconify icon="mdi:office-building" /> },
      {
        title: 'Contacts',
        path: PATH_CRM.contacts,
        icon: <Iconify icon="mdi:contacts" />,
      },
      {
        title: 'Departments',
        path: PATH_CRM.departments.list,
        icon: <Iconify icon="mingcute:department-line" />,
      },
      {
        title: 'Portal Registrations',
        path: PATH_PORTAL_REGISTRATION.root,
        icon: <Iconify icon="mdi:users-add" />,
      },
      {
        title: 'Archived Customers',
        path: PATH_CRM.customers.archived.root,
        icon: <Iconify icon="mdi:archive" />,
      },
    ],
  },
  machines: {
    subheader: 'Machines',
    items: [
      { title: 'Machines', path: PATH_MACHINE.machines.root, icon: <MachineIcon key="machine" /> },
      {
        title: 'Machine Drawings',
        path: PATH_MACHINE_DRAWING.root,
        icon: <Iconify icon="streamline:hand-held-tablet-drawing-solid" />,
      },
      {
        title: 'Documents',
        path: PATH_MACHINE.documents.root,
        icon: <Iconify icon="mdi:file-document" />,
        children: [
          {
            title: 'Documents List',
            path: PATH_MACHINE.documents.list,
            icon: <Iconify icon="lets-icons:file-dock-fill" />,
          },
          {
            title: 'Document Categories',
            path: PATH_MACHINE.documents.documentCategory.list,
            icon: <Iconify icon="mdi:folder-multiple" />,
          },
          {
            title: 'Document Types',
            path: PATH_MACHINE.documents.documentType.list,
            icon: <Iconify icon="mdi:file-tree" />,
          },
        ],
      },
      {
        title: 'Settings',
        path: PATH_MACHINE.machineSettings.root,
        icon: <Iconify icon="mdi:cog" />,
      },
      {
        title: 'Sites Map',
        path: PATH_MACHINE.sitesMap.root,
        icon: <Iconify icon="mdi:map-marker" />,
      },
      {
        title: 'Archived Machines',
        path: PATH_MACHINE.archived.root,
        icon: <Iconify icon="mdi:archive" />,
      },
    ],
  },
  support: {
    subheader: 'Support Services',
    items: [
      {
        title: 'Support Tickets',
        path: PATH_SUPPORT.supportTickets.root,
        icon: <Iconify icon="icomoon-free:ticket" />,
      },
      {
        title: 'Jira Tickets',
        path: PATH_SUPPORT.jiraTickets.root,
        icon: <Iconify icon="mdi:jira" />,
      },
      {
        title: 'Knowledge base',
        path: PATH_DASHBOARD.root,
        icon: <Iconify icon="mdi:book-open-variant" />,
      },
      {
        title: 'Manuals',
        path: PATH_DASHBOARD.root,
        icon: <Iconify icon="mdi:book-open-page-variant" />,
      },
    ],
  },
  reports: {
    subheader: 'Reports',
    items: [
      {
        title: 'Service Reports',
        path: PATH_REPORTS.serviceReports.root,
        icon: <Iconify icon="mdi:file-chart" />,
      },
      {
        title: 'Machine Settings Report',
        path: PATH_REPORTS.machineSettingsReport.root,
        icon: <Iconify icon="mdi:file-cog" />,
      },
      {
        title: 'ERP Logs',
        path: PATH_REPORTS.machineLogs.root,
        icon: <Iconify icon="fluent:document-database-24-filled" />,
      },
      {
        title: 'ERP Graphs',
        path: PATH_REPORTS.machineLogs.root,
        icon: <Iconify icon="mdi:chart-line" />,
      },
    ],
  },
  calendar: {
    subheader: 'Calendar',
    items: [{ title: 'Calendar', path: PATH_CALENDAR.root, icon: <Iconify icon="mdi:calendar" /> }],
  },
  settings: {
    subheader: 'Settings',
    items: [
      {
        title: 'Users',
        path: PATH_SETTING.security.root,
        icon: <Iconify icon="mdi:security-account" />,
      },
      { title: 'Invites', path: PATH_SETTING.invite.list, icon: <Iconify icon="mdi:email-plus" /> },
      {
        title: 'User Roles',
        path: PATH_SETTING.role.list,
        icon: <Iconify icon="ph:user-list-bold" />,
      },
      { title: 'Regions', path: PATH_SETTING.regions.list, icon: <Iconify icon="grommet-icons:map" /> },
      {
        title: 'System Config',
        path: PATH_SETTING.configs.list,
        icon: <Iconify icon="icon-park-outline:setting-config" />,
      },
      { title: 'Emails', path: PATH_SETTING.email.list, icon: <Iconify icon="eva:email-fill" /> },
      {
        title: 'Restrictions',
        path: PATH_SETTING.restrictions.root,
        icon: <Iconify icon="mdi:shield-lock" />,
        children: [
          {
            title: 'Blocked Customers',
            path: PATH_SETTING.restrictions.blockedCustomer.list,
            icon: <Iconify icon="tabler:home-off" />,
          },
          {
            title: 'Blocked Users',
            path: PATH_SETTING.restrictions.blockedUser.list,
            icon: <Iconify icon="fluent:people-lock-20-regular" />,
          },
          {
            title: "Blacklist IP's",
            path: PATH_SETTING.restrictions.blacklistIP.list,
            icon: <Iconify icon="material-symbols:block" />,
          },
          {
            title: "Whitelist IP's",
            path: PATH_SETTING.restrictions.whitelistIP.list,
            icon: <Iconify icon="material-symbols:check-circle-outline" />,
          },
        ],
      },
      { title: 'Sign-in Logs', path: PATH_SETTING.signInLogs.list, icon: <Iconify icon="mdi:login" /> },
      {
        title: 'Software Releases',
        path: PATH_SETTING.releases.list,
        icon: <Iconify icon="mdi:package-variant" />,
      },
      {
        title: 'System Logs',
        path: PATH_SETTING.logs.root,
        icon: <Iconify icon="mdi:text-box-multiple" />,
        children: [
          { title: 'PM2 Logs', path: PATH_SETTING.logs.pm2.root, icon: <Iconify icon="mdi:console" /> },
          {
            title: 'DB Backup Logs',
            path: PATH_SETTING.logs.dbBackup.root,
            icon: <Iconify icon="mdi:database" />,
          },
          { title: 'API logs', path: PATH_SETTING.logs.api.root, icon: <Iconify icon="mdi:api" /> },
        ],
      },
    ],
  },
};
// const SideBarOptions = () => {
//   const { 
//     isDocumentAccessAllowed, 
//     isDrawingAccessAllowed, 
//     isSettingAccessAllowed, 
//     isSecurityUserAccessAllowed, 
//     isEmailAccessAllowed,
//     isDeveloper,
//   } = useAuthContext();
  
//   const [allSideBarOptions, setAllSideBarOptions] = useState({
//     customers: {
//       subheader: 'Customers',
//       items: [
//         { title: 'Customers', path: PATH_CRM.customers, icon: 'mdi:account-group' },
//         { title: 'Sites', path: PATH_CRM.sites, icon: 'mdi:office-building' },
//         {
//           title: 'Contacts',
//           path: PATH_CRM.contacts,
//           icon: 'mdi:contacts',
//           children: [{ title: 'Departments', path: PATH_CRM.departments, icon: 'mdi:domain' }],
//         },
//         { title: 'Portal Registrations', path: PATH_PORTAL_REGISTRATION.root, icon: 'mdi:account-key' },
//         { title: 'Archived Customers', path: PATH_CRM.customers.archived, icon: 'mdi:archive' },
//       ],
//     },
//     machines: {
//       subheader: 'Machines',
//       items: [
//         { title: 'Machines', path: PATH_CRM.customers, icon: 'mdi:robot-industrial' },
//         { title: 'Machine Drawings', path: PATH_CRM.sites, hidden: !isDrawingAccessAllowed, icon: 'mdi:drawing' },
//         {
//           title: 'Documents',
//           path: PATH_DOCUMENT.root,
//           hidden: !isDocumentAccessAllowed,
//           icon: 'mdi:file-document',
//           children: [
//             { title: 'Document Categories', path: PATH_DOCUMENT.categories, icon: 'mdi:folder-multiple' },
//             { title: 'Document Types', path: PATH_DOCUMENT.types, icon: 'mdi:file-tree' },
//           ],
//         },
//         { title: 'Settings', path: PATH_CRM.sites, icon: 'mdi:cog' },
//         { title: 'Archived Machines', path: PATH_CRM.sites, icon: 'mdi:archive' },
//       ],
//     },
//     support: {
//       subheader: 'Support Services',
//       items: [
//         { title: 'Tickets', path: PATH_CRM.customers, icon: 'mdi:ticket' },
//         { title: 'Knowledge base', path: PATH_CRM.customers, icon: 'mdi:book-open-variant' },
//         { title: 'Manuals', path: PATH_CRM.customers, icon: 'mdi:book-information-variant' },
//       ],
//     },
//     reports: {
//       subheader: 'Reports',
//       items: [
//         { title: 'Service Reports', path: PATH_CRM.customers, icon: 'mdi:file-chart' },
//         { title: 'ERP Logs', path: PATH_CRM.customers, icon: 'mdi:text-box-search' },
//         { title: 'ERP Graphs', path: PATH_CRM.customers, icon: 'mdi:chart-line' },
//       ],
//     },
//     settings: {
//       subheader: 'Machines',
//       items: [
//         { title: 'Users', path: PATH_CRM.customers, hidden: !isSecurityUserAccessAllowed, icon: 'mdi:account-multiple' },
//         { title: 'Invites', path: PATH_CRM.customers, icon: 'mdi:email-plus' },
//         { title: 'User Roles', path: PATH_CRM.customers, icon: 'mdi:shield-account' },
//         { title: 'Regions', path: PATH_CRM.customers, icon: 'mdi:map-marker' },
//         {
//           title: 'Restrictions',
//           path: PATH_DOCUMENT.root,
//           icon: 'mdi:shield-lock',
//           children: [
//             { title: 'Blocked Customers', path: PATH_DOCUMENT.categories, icon: 'mdi:account-cancel' },
//             { title: 'Blocked Users', path: PATH_DOCUMENT.types, icon: 'mdi:account-off' },
//             { title: "Blac IP's", path: PATH_DOCUMENT.types, icon: 'mdi:ip-network' },
//             { title: "Whit IP's", path: PATH_DOCUMENT.types, icon: 'mdi:ip' },
//           ],
//         },
//         { title: 'Sign-in Logs', path: PATH_CRM.customers, icon: 'mdi:login' },
//         { title: 'Software Releases', path: PATH_CRM.customers, icon: 'mdi:package-variant' },
//         {
//           title: 'System Logs',
//           path: PATH_DOCUMENT.root,
//           icon: 'mdi:text-box-multiple',
//           children: [
//             { title: 'PM2 Logs', path: PATH_DOCUMENT.categories, icon: 'mdi:console' },
//             { title: 'DB Backup Logs', path: PATH_DOCUMENT.types, icon: 'mdi:database' },
//             { title: 'Email logs', path: PATH_DOCUMENT.types, icon: 'mdi:email-sync' },
//           ],
//         },
//       ],
//     },
//   });
//   return allSideBarOptions;
// }

// export default SideBarOptions;