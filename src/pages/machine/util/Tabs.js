import React from 'react';
import Iconify from '../../../components/iconify/Iconify';
import MachineNoteList from '../MachineNoteList';
import MachineSettingList from '../MachineSettingList';
import DocumentTagPage from '../../document/documents/DocumentTagPage';
import MachineDrawings from '../Drawing/MachineDrawings';
import MachineToolsInstalledList from '../MachineToolsInstalledList';
import MachineLicenses from '../License/MachineLicenses';
import MachineServiceRecordList from '../MachineServiceRecordList';
import MachineProfiles from '../Profile/MachineProfiles';
import SettingList from '../Setting/SettingList';

export const TABS = (currentComponent, showDevTabs, disableTab) => [
  {
    value: 'Machine-info',
    label: 'Machine Info',
    icon: <Iconify icon="mdi:window-open-variant" />,
    component: currentComponent,
  },
  {
    disabled: disableTab,
    value: 'settings',
    label: 'Settings',
    icon: <Iconify icon="mdi:cogs" />,
    component: <SettingList />,
  },
  {
    disabled: disableTab,
    value: 'toolsInstalled',
    label: 'Tools Installed',
    icon: <Iconify icon="mdi:folder-wrench" />,
    component: <MachineToolsInstalledList />,
  },
  {
    disabled: disableTab,
    value: 'notes',
    label: 'Notes',
    icon: <Iconify icon="mdi:note-multiple" />,
    component: <MachineNoteList />,
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
 
  ...(showDevTabs
    ? [
        
        // {
        //   disabled: disableTab,
        //   value: 'repairHistory',
        //   label: 'Repair History',
        //   icon: <Iconify icon="ic:round-manage-history" />,
        // },
        {
          disabled: disableTab,
          value: 'checkItemRecords',
          label: 'Service Records',
          icon: <Iconify icon="mdi:clipboard-text-clock" />,
          component : <MachineServiceRecordList />,
        },
      ]
    : []),
];
