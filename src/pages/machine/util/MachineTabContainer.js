import { useLayoutEffect } from 'react';
import PropTypes from 'prop-types';
import { useNavigate, useParams } from 'react-router-dom';
// @mui
import { Tab, tabsClasses } from '@mui/material';
import { useDispatch } from 'react-redux';
import TabContainer from '../../../components/Tabs/TabContainer';
// redux
import { useSelector } from '../../../redux/store';
// sections
import { Cover } from '../../../components/Defaults/Cover';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import TABS from './index';
import { PATH_MACHINE } from '../../../routes/paths';
import { getMachine } from '../../../redux/slices/products/machine';
import TabButtonTooltip from '../../../components/Tabs/TabButtonTooltip';
// ----------------------------------------------------------------------

MachineTabContainer.propTypes = {
  currentTabValue: PropTypes.string,
};

export default function MachineTabContainer({ currentTabValue }) {
  const { machine, isLoading } = useSelector((state) => state.machine);
  const { machineId } = useParams();
  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(getMachine(machineId));
  }, [dispatch, machine?._id, machineId]);

  const navigate = useNavigate();

  const navigatePage = (tab) => {
    if (tab === 'machine' && machineId) {
      navigate(PATH_MACHINE.machines.view(machineId))
    } else if (tab === 'settings' && machineId) {
      navigate(PATH_MACHINE.machines.settings.root(machineId))
    } else if (tab === 'toolsinstalled' && machineId) {
      navigate(PATH_MACHINE.machines.toolsInstalled.root(machineId))
    } else if (tab === 'notes' && machineId) {
      navigate(PATH_MACHINE.machines.notes.root(machineId))
    } else if (tab === 'drawings' && machineId) {
      navigate(PATH_MACHINE.machines.drawings.root(machineId))
    } else if (tab === 'documents' && machineId) {
      navigate(PATH_MACHINE.machines.documents.root(machineId))
    } else if (tab === 'license' && machineId) {
      navigate(PATH_MACHINE.machines.licenses.root(machineId))
    } else if (tab === 'profile' && machineId) {
      navigate(PATH_MACHINE.machines.profiles.root(machineId))
    } else if (tab === 'serviceReports' && machineId) {
      navigate(PATH_MACHINE.machines.serviceReports.root(machineId))
    } else if (tab === 'ini' && machineId) {
      navigate(PATH_MACHINE.machines.ini.root(machineId))
    } else if (tab === 'jira' && machineId) {
      navigate(PATH_MACHINE.machines.jira.root(machineId))
    } else if (tab === 'integration' && machineId) {
      navigate(PATH_MACHINE.machines.integration.root(machineId))
    } else if (tab === 'logs' && machineId) {
      navigate(PATH_MACHINE.machines.logs.root(machineId))
    } else if (tab === 'graphs' && machineId) {
      navigate(PATH_MACHINE.machines.logs.graph(machineId))
    } else if (tab === 'dashboard' && machineId) {
      navigate(PATH_MACHINE.machines.dashboard.root(machineId))
    }
  }


  return (
    <StyledCardContainer>
      <Cover
        name={
          machine
            ? `${machine?.serialNo ? machine?.serialNo : ''} ${machine?.machineModel?.name ? `- ${machine?.machineModel?.name}` : ''
            }`
            : 'New Machine'
        }
        setting
        isArchived={machine?.isArchived}
      />
        <TabContainer
          tabsClasses={tabsClasses.scrollButtons}
          currentTab={currentTabValue}
          setCurrentTab={(tab) => navigatePage(tab)}
        >
          {TABS.filter(tab => tab.align !== 'right').map((tab) => (
            <Tab
              disabled={tab.disabled}
              key={tab.value}
              value={tab.value}
              label={tab?.value === currentTabValue ? tab.label : ''}
              icon={
                <TabButtonTooltip
                  value={tab.value}
                  selected={tab?.value === currentTabValue}
                  title={tab.label}
                  icon={tab.icon}
                />
              }
            />
          ))}
          
          {TABS.filter(tab => tab.align === 'right').map((tab, index) => (
            <Tab
              disabled={tab.disabled}
              key={tab.value}
              value={tab.value}
              label={tab?.value === currentTabValue ? tab.label : ''}
              icon={
                <TabButtonTooltip
                  value={tab.value}
                  selected={tab?.value === currentTabValue}
                  title={tab.label}
                  icon={tab.icon}
                />
              }
              iconPosition="end"
              sx={{ 
                marginLeft: index === 0 ? 'auto' : 0,
                paddingRight: '0 !important',
                paddingLeft: '8px !important',
                columnGap: '8px',
              }}
            />
          ))}
        </TabContainer>
    </StyledCardContainer>
  );
}
