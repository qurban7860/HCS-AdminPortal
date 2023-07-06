import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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
import UnderDevelopment from '../boundaries/UnderDevelopment';
// sections
import { Cover } from '../components/Defaults/Cover';
import MachineViewForm from './MachineViewForm';
import MachineEditForm from './MachineEditForm';
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

  const TABS = TABSFunc(currentComponent);

  useEffect(() => {
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
