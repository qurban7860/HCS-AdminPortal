import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
// @mui
import { Tab, Container, Box, tabsClasses } from '@mui/material';
import TabContainer from '../components/Tabs/TabContainer';
// redux
import { useDispatch, useSelector } from '../../redux/store';
import {
  getMachine, 
  setMachineTab,
} from '../../redux/slices/products/machine';
import {
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
} from '../../redux/slices/document/document';
import { setResetFlags } from '../../redux/slices/products/machineServiceRecord';
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
  const { machine, machineEditFormFlag, machineTab } = useSelector((state) => state.machine);
  const [currentComponent, setCurrentComponent] = useState(<MachineViewForm />);
  const TABS = TABSFunc(currentComponent, showDevTabs, machineEditFormFlag );

  useEffect(() => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(false));
    if (id !== 'null') {
      dispatch(getMachine(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    /* eslint-disable */
    if (machineEditFormFlag) {
      setCurrentComponent(<MachineEditForm />);
    } else {
      setCurrentComponent(<MachineViewForm />);
    }
    /* eslint-enable */
  }, [dispatch, machineEditFormFlag, machine]);

  return (
    <Container maxWidth={false} sx={{mb:3}}>
      <StyledCardContainer>
        <Cover
          name={machine?.name}
          serialNo={`${machine?.serialNo ? machine?.serialNo : 'Serial Number'} ${machine?.machineModel?.name ? '-' : '' } ${machine?.machineModel?.name ? machine?.machineModel?.name : '' }`}
          icon="et:gears"
          setting
        />
        <TabContainer
          tabsClasses={tabsClasses.scrollButtons}
          currentTab={machineTab}
          setCurrentTab={(tab)=> {
            dispatch(setMachineTab(tab));
            dispatch(setResetFlags(true));
            }
          }
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
            tab.value === machineTab && (
              <Box key={tab.value}> {tab.component ? tab.component : <UnderDevelopment />} </Box>
            )
        )}
    </Container>
  );
}
