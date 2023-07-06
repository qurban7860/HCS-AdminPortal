import { Helmet } from 'react-helmet-async';
import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { Link as RouterLink, useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, Container, Box, tabsClasses } from '@mui/material';
import { useTheme } from '@emotion/react';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import TabContainer from '../components/Tabs/TabContainer';
// routes
import { PATH_DASHBOARD, PATH_MACHINE } from '../../routes/paths';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import { getMachine } from '../../redux/slices/products/machine';
// components
import Iconify from '../../components/iconify';
import UnderDevelopment from '../boundaries/UnderDevelopment';
// sections
import { Cover } from '../components/Defaults/Cover';
import DocumentList from '../document/machine/DocumentList';
import MachineViewForm from './MachineViewForm';
import MachineEditForm from './MachineEditForm';
import MachineNoteList from './MachineNoteList';
import MachineSettingList from './MachineSettingList';
import MachineLicenseList from './MachineLicenseList';
import MachineToolsInstalledList from './MachineToolsInstalledList';
import { TABS as TABSFunc } from './util/Tabs';
import { FORMLABELS } from '../../constants/default-constants';

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
  const [currentTab, setCurrentTab] = useState('Machine-info');
  const [currentComponent, setCurrentComponent] = useState(<MachineViewForm />);
  const [machineFlag, setMachineFlag] = useState(true);
  const [disableTab, setDisableTab] = useState(false);

  const TABS = TABSFunc(currentComponent, disableTab);

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

  // const TABS = [
  //   {
  //     //   disabled: siteEditFormVisibility || contactEditFormVisibility || noteEditFormVisibility,
  //     value: 'Machine-info',
  //     label: 'Machine Info',
  //     icon: <Iconify icon="mdi:window-open-variant" />,
  //     component: currentComponent,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     disabled: disableTab,
  //     value: 'settings',
  //     label: 'Settings',
  //     icon: <Iconify icon="mdi:cogs" />,
  //     component: <MachineSettingList />,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     disabled: disableTab,
  //     value: 'license',
  //     label: 'License',
  //     icon: <Iconify icon="mdi:book-cog-outline" />,
  //     component: <MachineLicenseList />,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     disabled: disableTab,
  //     value: 'toolsInstalled',
  //     label: 'Tools Installed',
  //     icon: <Iconify icon="mdi:folder-wrench" />,
  //     component: <MachineToolsInstalledList />,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     value: 'notes',
  //     label: 'Notes',
  //     icon: <Iconify icon="mdi:note-multiple" />,
  //     component: <MachineNoteList />,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     disabled: disableTab,
  //     value: 'documents',
  //     label: 'Documents',
  //     icon: <Iconify icon="mdi:folder-open" />,
  //     component: <DocumentList />,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     disabled: disableTab,
  //     value: 'repairHistory',
  //     label: 'Repair History',
  //     icon: <Iconify icon="ic:round-manage-history" />,
  //   },
  //   {
  //     // disabled: setMachineEditFormVisibility,
  //     disabled: disableTab,
  //     value: 'serviceHistory',
  //     label: 'Service History',
  //     icon: <Iconify icon="mdi:clipboard-text-clock" />,
  //   },
  // ];

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover
          name={machine?.name}
          serialNo={machine ? machine.serialNo : FORMLABELS.MACHINE_PLACEHOLDER}
          setting
        />
        <TabContainer
          tabsClasses={tabsClasses.scrollButtons}
          currentTab={currentTab}
          setCurrentTab={setCurrentTab}
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
        </TabContainer>
      </StyledCardContainer>
      {TABS.map(
        (tab) =>
          tab.value === currentTab && (
            <Box key={tab.value}> {tab.component ? tab.component : <UnderDevelopment />} </Box>
          )
      )}
    </Container>
  );
}
