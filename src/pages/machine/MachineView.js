import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';

// @mui
import {
  Typography,
  Tab,
  Card,
  Tabs,
  Container,
  Box,
  Button,
  Grid,
  Stack,
  tabsClasses,
} from '@mui/material';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';

// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getMachines,
  getMachine,
  setMachineEditFormVisibility,
} from '../../redux/slices/products/machine';
// import { getSites } from '../../redux/slices/customer/site';
// import { getContacts } from '../../redux/slices/customer/contact';

// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import Iconify from '../../components/iconify';
import UnderDevelopment from '../components/UnderDevelopment';
// sections
import { Cover } from '../components/Defaults/Cover';

// import CustomerAddForm from './CustomerAddForm'
// import SiteAddForm from './site/SiteAddForm';
// import SiteList from './site/SiteList';
// import ContactAddForm from './contact/ContactAddForm';
// import CustomerStepper from './CustomerStepper';
import DocumentList from '../document/machine/DocumentList';

/* eslint-disable */

import MachineViewForm from './MachineViewForm';
/* eslint-enable */

import MachineEditForm from './MachineEditForm';
import MachineNoteList from './MachineNoteList';
import MachineSettingList from './MachineSettingList';
import MachineLicenseList from './MachineLicenseList';

import LogoAvatar from '../../components/logo-avatar/LogoAvatar';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';

import MachineToolsInstalledList from './MachineToolsInstalledList';

// ----------------------------------------------------------------------

/* eslint-disable */
MachineView.propTypes = {
  editPage: PropTypes.bool,
};
/* eslint-enable */

export default function MachineView({ editPage }) {
  const { id } = useParams();

  const dispatch = useDispatch();

  const { machine, machines, machineEditFormFlag } = useSelector((state) => state.machine);
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);

  //   const { site, siteEditFormVisibility } = useSelector((state) => state.site);
  //   const { contactEditFormVisibility } = useSelector((state) => state.contact);
  //   const { noteEditFormVisibility} = useSelector((state) => state.note);
  const [currentTab, setCurrentTab] = useState('Machine-info');
  //   const [editFlag, setEditFlag] = useState(false);
  //   const toggleEditFlag = () => setEditFlag(value => !value);

  const [currentComponent, setCurrentComponent] = useState(<MachineViewForm />);

  const [machineFlag, setMachineFlag] = useState(true);
  const [disableTab, setDisableTab] = useState(false);

  useEffect(() => {
    if (id !== 'null') {
      dispatch(getMachine(id));
      //   dispatch(getSites(id));
      //   dispatch(getContacts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    /* eslint-disable */
    if (machine && machine.transferredMachine) {
      setDisableTab(true);
    } else {
      setDisableTab(false);
    }
    if (machineEditFormFlag) {
      setCurrentComponent(<MachineEditForm />);
    } else {
      setMachineFlag(false);
      setCurrentComponent(<MachineViewForm />);
    }
    /* eslint-enable */
  }, [dispatch, machineEditFormFlag, machine]);

  const TABS = [
    {
      //   disabled: siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
      value: 'Machine-info',
      label: 'Machine Info',
      icon: <Iconify icon="mdi:window-open-variant" />,
      component: currentComponent,
    },
    {
      // disabled: setMachineEditFormVisibility,
      disabled: disableTab,
      value: 'settings',
      label: 'Settings',
      icon: <Iconify icon="mdi:cogs" />,
      component: <MachineSettingList />,
    },
    {
      // disabled: setMachineEditFormVisibility,
      disabled: disableTab,
      value: 'license',
      label: 'License',
      icon: <Iconify icon="mdi:book-cog-outline" />,
      component: <MachineLicenseList />,
    },
    {
      // disabled: setMachineEditFormVisibility,
      disabled: disableTab,
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
      disabled: disableTab,
      value: 'documents',
      label: 'Documents',
      icon: <Iconify icon="mdi:folder-open" />,
      component: <DocumentList />,
    },
    {
      // disabled: setMachineEditFormVisibility,
      disabled: disableTab,
      value: 'repairHistory',
      label: 'Repair History',
      icon: <Iconify icon="ic:round-manage-history" />,
    },
    {
      // disabled: setMachineEditFormVisibility,
      disabled: disableTab,
      value: 'serviceHistory',
      label: 'Service History',
      icon: <Iconify icon="mdi:clipboard-text-clock" />,
    },
  ];

  return (
    <Container maxWidth={false}>
      {/* <CustomBreadcrumbs heading="Machine View" /> */}
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover
          // photoURL={machine.name}
          name={machine?.name}
          serialNo={machine ? machine.serialNo : 'Serial Number'}
          icon="et:gears"
          setting="enable"
        />

        <Tabs
          value={currentTab}
          onChange={(event, newValue) => setCurrentTab(newValue)}
          variant="scrollable"
          allowScrollButtonsMobile
          aria-label="scrollable force tabs example"
          sx={{
            [`& .${tabsClasses.scrollButtons}`]: {
              '&.Mui-disabled': { opacity: 0.3 },
            },
            width: 1,
            bottom: 0,
            zIndex: 9,
            position: 'absolute',
            bgcolor: 'background.paper',
            '& .MuiTabs-flexContainer': {
              pr: { md: 3 },
              pl: { lg: 2 },
              justifyContent: {
                xl: 'flex-end',
              },
            },
          }}
        >
          {TABS.map((tab) => (
            <Tab
              disabled={tab.disabled}
              key={tab.value}
              value={tab.value}
              icon={tab.icon}
              label={tab.label}
            />
          ))}
        </Tabs>
      </Card>
      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value}> {tab.component ? tab.component : <UnderDevelopment />} </Box>
          )
      )}
    </Container>
  );
}
