import React from 'react';
import Iconify from '../../../components/iconify/Iconify';
import DocumentList from '../../document/machine/DocumentList';
import MachineNoteList from '../MachineNoteList';
import MachineSettingList from '../MachineSettingList';
import DocumentTagPage from '../../document/documents/DocumentTagPage';
import MachineToolsInstalledList from '../MachineToolsInstalledList';

export const TABS = (currentComponent, showDevTabs, disableTab) => [
  {
    //   disabled: siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
    value: 'Machine-info',
    label: 'Machine Info',
    icon: <Iconify icon="mdi:window-open-variant" />,
    component: currentComponent,
  },
  {
    // disabled: setMachineEditFormVisibility,
    value: 'settings',
    label: 'Settings',
    icon: <Iconify icon="mdi:cogs" />,
    component: <MachineSettingList />,
  },
  {
    // disabled: setMachineEditFormVisibility,
    value: 'toolsInstalled',
    label: 'Tools Installed',
    icon: <Iconify icon="mdi:folder-wrench" />,
    component: <MachineToolsInstalledList />,
  },
  {
    // disabled: setMachineEditFormVisibility,
    value: 'notes',
    label: 'Notes',
    icon: <Iconify icon="mdi:note-multiple" />,
    component: <MachineNoteList />,
  },
  {
    // disabled: setMachineEditFormVisibility,
    value: 'documents',
    label: 'Documents',
    icon: <Iconify icon="mdi:folder-open" />,
    component: <DocumentTagPage customerPage={false} machinePage />,
  },
  ...(showDevTabs
    ? [
        {
          // disabled: setMachineEditFormVisibility,
          value: 'license',
          label: 'License',
          icon: <Iconify icon="mdi:book-cog-outline" />,
          // component: <MachineLicenseList />,
        },
        {
          // disabled: setMachineEditFormVisibility,
          value: 'repairHistory',
          label: 'Repair History',
          icon: <Iconify icon="ic:round-manage-history" />,
        },
        {
          // disabled: setMachineEditFormVisibility,
          value: 'serviceHistory',
          label: 'Service History',
          icon: <Iconify icon="mdi:clipboard-text-clock" />,
        },
      ]
    : []),
];
