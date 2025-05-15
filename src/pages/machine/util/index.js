import { label } from 'yet-another-react-lightbox';
import { ICONS } from '../../../constants/icons/default-icons';

export function checkValuesNotNull(obj) {
  return Object.values(obj).some(value => value !== null);
}

export const inputTypes = [
  { _id: 1, name: 'Boolean' },
  { _id: 2, name: 'Date' },
  { _id: 3, name: 'Long Text' },
  { _id: 4, name: 'Number' },
  { _id: 5, name: 'Short Text' },
  { _id: 6, name: 'Status' },
]

export const unitTypes = [
  { _id: 1, name: 'Cycle' },
  { _id: 2, name: 'Feet' },
  { _id: 3, name: 'Inches' },
  { _id: 4, name: 'Meter' },
  { _id: 5, name: 'Milimeter' },
  { _id: 6, name: 'Unit' },
]

export const statusTypes = [
  { _id: 1, name: 'Healthy' },
  { _id: 2, name: 'Service Required' },
  { _id: 3, name: 'Under Service' },
  { _id: 4, name: 'Replacement Required' },
  { _id: 5, name: 'Replaced Recently' },
  { _id: 6, name: 'Yes' },
  { _id: 6, name: 'No' },

]

export const reportTypes = [
  { _id: 1, name: 'SERVICE' },
  { _id: 2, name: 'REPAIR' },
  { _id: 3, name: 'TRAINING' },
  { _id: 4, name: 'PRE-INSTALL' },
  { _id: 5, name: 'INSTALL' },
]

export const headerFooterTypes = [
  { _id: 1, name: 'Text' },
  { _id: 2, name: 'Image' },
]

export const status = [
  { _id: 1, name: 'Draft' },
  { _id: 2, name: 'Submitted' },
  { _id: 3, name: 'Approved' },
]

export const today = new Date();
export const tomorrow = new Date();
tomorrow.setDate(tomorrow.getDate() + 1);

export const yesterday = new Date();
yesterday.setDate(tomorrow.getDate() - 1);

export const future5yearDate = new Date(today);
future5yearDate.setFullYear(today.getFullYear() + 5);

export const future20yearDate = new Date(today);
future20yearDate.setFullYear(today.getFullYear() + 20);

export const pastDate = new Date(1960, 0, 1);

const TABS = [
  {
    value: 'machine',
    label: 'Machine Info',
    icon: ICONS.MACHINE.icon,
  },
  {
    value: 'settings',
    label: 'Settings',
    icon: ICONS.SETTINGS.icon,
  },
  {
    value: 'toolsinstalled',
    label: 'Tools Installed',
    icon: ICONS.TOOLS_INSTALLED.icon,
  },
  // {
  //   value: 'jobs',
  //   label: 'Machine Jobs',
  //   icon: ICONS.JOBS.icon,
  // },
  {
    value: 'notes',
    label: 'Notes',
    icon: ICONS.NOTES.icon,
  },
  {
    value: 'drawings',
    label: 'Drawings',
    icon: ICONS.DRAWINGS.icon,
  },
  {
    value: 'documents',
    label: 'Documents',
    icon: ICONS.DOCUMENTS.icon,
  },
  {
    value: 'license',
    label: 'Licenses',
    icon: ICONS.LICENSES.icon,
  },
  {
    value: 'profile',
    label: 'Profiles',
    icon: ICONS.PROFILES.icon,
  },
  {
    value: 'serviceReports',
    label: 'Service Reports',
    icon: ICONS.SERVICE_REPORTS.icon,
  },
  {
    value: 'ini',
    label: 'INI',
    icon: ICONS.INI.icon,
  },
  {
    value: 'integration',
    label: 'Machine Integration',
    icon: ICONS.INTEGRATION.icon,
  },
  {
    value: 'jira',
    label: 'Jira',
    icon: ICONS.JIRA.icon,
  },
  {
    value: 'machineLifecycle',
    label: 'Machine Lifecycle',
    icon: ICONS.MACHINE_LIFECYCLE.icon,
  },
  {
    value: 'dashboard',
    label: 'Dashboard',
    icon: ICONS.DASHBOARD.icon,
    align: 'right',
  },
  {
    value: 'logs',
    label: 'Logs',
    icon: ICONS.LOGS.icon,
    align: 'right',
  },
  {
    value: 'graphs',
    label: 'Graphs',
    icon: ICONS.GRAPHS.icon,
    align: 'right',
  },

];

export default TABS