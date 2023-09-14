import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Container, Box, tabsClasses } from '@mui/material';
import TabContainer from '../components/Tabs/TabContainer';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getMachines,
  getMachine,
  setMachineEditFormVisibility,
} from '../../redux/slices/products/machine';
import {
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
} from '../../redux/slices/document/document';

// auth
import { useAuthContext } from '../../auth/useAuthContext';
// components
import UnderDevelopment from '../boundaries/UnderDevelopment';
// sections
import { Cover } from '../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import MachineViewForm from './MachineViewForm';
import MachineEditForm from './MachineEditForm';
import { TABS as TABSFunc } from './util/Tabs';
import { CONFIG } from '../../config-global';

// ----------------------------------------------------------------------

/* eslint-disable */
MachineView.propTypes = {
  editPage: PropTypes.bool,
};
/* eslint-enable */

export default function MachineView({ editPage }) {
  const { id } = useParams();
  const environment = CONFIG.ENV.toLowerCase();
  const showDevTabs = environment !== 'live';
  const dispatch = useDispatch();
  const { machine, machines, machineEditFormFlag } = useSelector((state) => state.machine);
  const [editFlag, setEditFlag] = useState(false);
  const toggleEditFlag = () => setEditFlag((value) => !value);
  const [currentTab, setCurrentTab] = useState('Machine-info');
  const [currentComponent, setCurrentComponent] = useState(<MachineViewForm />);
  const [machineFlag, setMachineFlag] = useState(true);
  const TABS = TABSFunc(currentComponent, showDevTabs, machineEditFormFlag );

  useEffect(() => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(false));
    if (id !== 'null') {
      dispatch(getMachine(id));
      //   dispatch(getSites(id));
      //   dispatch(getContacts(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    /* eslint-disable */
    if (machineEditFormFlag) {
      setCurrentComponent(<MachineEditForm />);
    } else {
      setMachineFlag(false);
      setCurrentComponent(<MachineViewForm />);
    }
    /* eslint-enable */
  }, [dispatch, machineEditFormFlag, machine]);

  return (
    <Container maxWidth={false} sx={{mb:3}}>
      <StyledCardContainer>
        <Cover
          name={machine?.name}
          handleBackLinks={() => {
            dispatch(setDocumentViewFormVisibility(false));
            dispatch(setDocumentHistoryViewFormVisibility(false));
          }}
          serialNo={machine?.serialNo ? machine?.serialNo : 'Serial Number'}
          icon="et:gears"
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
