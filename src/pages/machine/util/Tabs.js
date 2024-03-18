import React from 'react';
import Iconify from '../../../components/iconify/Iconify';
import DocumentTagPage from '../../document/documents/DocumentTagPage';
import MachineDrawings from '../drawings/MachineDrawings';
import MachineLicenses from '../licenses/MachineLicenses';
import MachineServiceRecordList from '../MachineServiceRecordList';
import HistoricalConfigurations from '../HistoricalConfigurations';
import MachineProfiles from '../profiles/MachineProfiles';
import MachineSetting from '../settings/MachineSetting';
import MachineToolInstalled from '../toolsInstalled/MachineToolInstalled';
import MachineNotes from '../notes/MachineNotes';
import MachineERPLogsList from '../MachineERPLogsList';

export const TABS = (currentComponent, showDevTabs, disableTab) => [
  {
    value: 'info',
    label: 'Machine Info',
    icon: <Iconify icon="mdi:window-open-variant" />,
    component: currentComponent,
  },
  {
    disabled: disableTab,
    value: 'settings',
    label: 'Settings',
    icon: <Iconify icon="mdi:cogs" />,
    component: <MachineSetting />,
  },
  {
    disabled: disableTab,
    value: 'tools',
    label: 'Tools',
    icon: <Iconify icon="mdi:folder-wrench" />,
    component: <MachineToolInstalled />,
  },
  {
    disabled: disableTab,
    value: 'notes',
    label: 'Notes',
    icon: <Iconify icon="mdi:note-multiple" />,
    component: <MachineNotes />,
  },
  {
    disabled: disableTab,
    value: 'drawings',
    label: 'Drawings',
    icon: <Iconify icon="mdi:folder-open" />,
    component: <MachineDrawings  />,
  },
  {
    disabled: disableTab,
    value: 'documents',
    label: 'Documents',
    icon: <Iconify icon="mdi:folder-open" />,
    component: <DocumentTagPage customerPage={false} machinePage />,
  },
  {
    disabled: disableTab,
    value: 'license',
    label: 'Licenses',
    icon: <Iconify icon="mdi:book-cog-outline" />,
    component: <MachineLicenses />,
  },
  {
    disabled: disableTab,
    value: 'profile',
    label: 'Profiles',
    icon: <Iconify icon="mdi:window-open-variant" />,
    component: <MachineProfiles />,
  },
  {
    disabled: disableTab,
    value: 'serviceRecords',
    label: 'Service Records',
    icon: <Iconify icon="mdi:clipboard-text-clock" />,
    component : <MachineServiceRecordList />,
  },
  {
    disabled: disableTab,
    value: 'ini',
    label: 'INI',
    icon: <Iconify icon="ic:round-manage-history" />,
    component : <HistoricalConfigurations />,
  },
  {
    disabled: disableTab,
    value: 'logs',
    label: 'Logs',
    icon: <Iconify icon="entypo:bar-graph" />,
    component : <MachineERPLogsList />,
  },
 
];
