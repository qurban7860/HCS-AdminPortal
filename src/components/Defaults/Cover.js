import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Button, Grid, Typography, Box } from '@mui/material';
import { StyledRoot, StyledInfo } from '../../theme/styles/default-styles';
// utils
import { PATH_CRM, PATH_MACHINE, PATH_SETTING, PATH_MACHINE_LOGS } from '../../routes/paths';
// auth
import CoverSettingsIcons from './CoverSettingsIcons';
import CoverTitles from './CoverTitles';
import useResponsive from '../../hooks/useResponsive';
import CoverAvatar from './CoverAvatar';
import Iconify from '../iconify';
import { useAuthContext } from '../../auth/useAuthContext';

// ----------------------------------------------------------------------

Cover.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  avatar: PropTypes.bool,
  setting: PropTypes.bool,
  generalSettings: PropTypes.bool,
  customerSites: PropTypes.bool,
  customerContacts: PropTypes.bool,
  backLink: PropTypes.bool,
  isArchived: PropTypes.bool,
  isArchivedCustomers: PropTypes.bool,
  isArchivedMachines: PropTypes.bool,
  productionLogs: PropTypes.bool,
  coilLogs: PropTypes.bool,
  erpLogs: PropTypes.bool,
};

export function Cover({
  name,
  icon,
  avatar,
  setting,
  generalSettings,
  customerSites,
  customerContacts,
  backLink,
  isArchived,
  isArchivedCustomers,
  isArchivedMachines,
  productionLogs,
  coilLogs,
  erpLogs
}) {
  const navigate = useNavigate();
  const handleSettingsNavigate = () => navigate(PATH_SETTING.root);
  const linkCustomerSites = () => navigate(PATH_CRM.sites);
  const linkCustomerContacts = () =>  navigate(PATH_CRM.contacts);
  const linkArchivedCustomers = () =>  navigate(PATH_CRM.customers.archived.root);
  const linkArchivedMachines = () =>  navigate(PATH_MACHINE.machines.archived.root);
  const handleBackLink = () => window.history.back();
  const handleCoilLog = () => navigate(PATH_MACHINE_LOGS.machineLogs.CoilGraph);
  const handleErpLog = () => navigate(PATH_MACHINE_LOGS.machineLogs.ErpGraph);
  const handleProductionLog = () => navigate(PATH_MACHINE_LOGS.machineLogs.ProductionGraph);
  const { isAllAccessAllowed, isSettingReadOnly } = useAuthContext();
  const isMobile = useResponsive('down', 'sm');
  const [expandedButton, setExpandedButton] = useState(null);

  const handleClick = (buttonId) => {
    setExpandedButton(prev => (prev === buttonId ? null : buttonId));
  };
  
  const handleOnClick = async (buttonId, action) => {
    if (isMobile) {
      handleClick(buttonId);
      await new Promise(resolve => setTimeout(resolve, 300));
      action();
    } else {
      action();
    }
  };
  
  return (
    <StyledRoot style={{ p: { xs: 0, md: 0 } }} isArchived={isArchived} >
    <StyledInfo style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }} >
      {avatar && <CoverAvatar avatar={name} />}
      <CoverTitles title={avatar && isMobile ? '' : name} />
      <CoverSettingsIcons setting={ !isArchived && setting} handleSettingsNavigate={handleSettingsNavigate} generalSettings={generalSettings && !isArchived } />
    </StyledInfo>
    <Grid container justifyContent='space-between' columnGap={2} sx={{ position: 'absolute', bottom:10, px:3}}>
        <Grid item>
          {backLink && <Button size='small' startIcon={<Iconify icon="mdi:arrow-left" />} variant='outlined' sx={{float:'left'}} onClick={() => handleOnClick('back', handleBackLink)}> {(!isMobile || expandedButton === 'back') && ( <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' }, }}>Back</Typography> )}</Button>}
        </Grid>
        <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'row',  alignItems: 'flex-start', justifyContent: isMobile ? 'center' : 'flex-start',  textAlign: 'center', '& .MuiButton-startIcon': { marginRight: 0 } }}>
          { !isArchived && customerSites && (<Button size='small' startIcon={<Iconify icon="mdi:map-legend" sx={{ mr: 0.3 }}/>} variant='outlined' sx={{ mr: 1 }} onClick={() => handleOnClick('sites', linkCustomerSites)}> {(!isMobile || expandedButton === 'sites') && ( <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Sites</Typography> )}</Button> )}
          { !isArchived && customerContacts && (<Button size='small' startIcon={<Iconify icon="mdi:account-multiple" sx={{ mr: 0.3 }}/>} variant='outlined' sx={{ mr: 1 }}  onClick={() => handleOnClick('contacts', linkCustomerContacts)}> {(!isMobile || expandedButton === 'contacts') && ( <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Contacts</Typography> )}</Button> )}
          { isAllAccessAllowed && !isSettingReadOnly && isArchivedCustomers && (<Button size='small' startIcon={<Iconify icon="fa6-solid:users-slash" sx={{ mr: 0.5 }}/>} variant='outlined' onClick={() => handleOnClick('archivedCustomers', linkArchivedCustomers)}> {(!isMobile || expandedButton === 'archivedCustomers') && ( <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' }, }}>Archived Customers</Typography> )}</Button> )}
          { isAllAccessAllowed && !isSettingReadOnly && isArchivedMachines && <Button size='small' startIcon={<Iconify icon="fluent:table-delete-column-16-filled" sx={{ mr: 0.3 }}/>} variant='outlined' sx={{ml:2}} onClick={linkArchivedMachines}>Archived Machines</Button>}
          {erpLogs && (<Button size='small' startIcon={<Iconify icon="mdi:report" sx={{ mr: 0.3 }}/>} variant='outlined' sx={{ mr: 1 }} onClick={() => handleOnClick('erpLog', handleErpLog)}> {(!isMobile || expandedButton === 'erpLog') && ( <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' }, }}>Erp Logs</Typography> )}</Button> )}
          {coilLogs && (<Button size='small' startIcon={<Iconify icon="mdi:graph-bar" sx={{ mr: 0.3 }}/>} variant='outlined' sx={{ mr: 1 }} onClick={() => handleOnClick('coilLog', handleCoilLog)}> {(!isMobile || expandedButton === 'coilLog') && ( <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' }, }}>Coil Logs</Typography> )}</Button> )}
          {productionLogs && (<Button size='small' startIcon={<Iconify icon="mdi:chart-line" sx={{ mr: 0.3 }}/>} variant='outlined' onClick={() => handleOnClick('productionLog', handleProductionLog)}> {(!isMobile || expandedButton === 'productionLog') && ( <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' }, }}>Production Logs</Typography> )}</Button> )}
        </Box>
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
