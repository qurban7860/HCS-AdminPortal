import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Button, Grid, Typography, Box } from '@mui/material';
import { StyledRoot, StyledInfo } from '../../theme/styles/default-styles';
// utils
import { PATH_CRM, PATH_MACHINE, PATH_SETTING } from '../../routes/paths';
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
}) {
  const navigate = useNavigate();
  const handleSettingsNavigate = () => navigate(PATH_SETTING.root);
  const linkCustomerSites = () => navigate(PATH_CRM.sites);
  const linkCustomerContacts = () =>  navigate(PATH_CRM.contacts);
  const linkArchivedCustomers = () =>  navigate(PATH_CRM.customers.archived.root);
  const linkArchivedMachines = () =>  navigate(PATH_MACHINE.machines.archived.root);
  const handleBackLink = () => window.history.back();
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
          {backLink && <Button size='small' startIcon={<Iconify icon="mdi:arrow-left" />} variant='outlined' sx={{float:'left'}} onClick={handleBackLink}>Back</Button>}
        </Grid>
        <Grid item>
        <Box sx={{ display: 'flex', flexDirection: 'row',  alignItems: 'flex-start' }}>
          { !isArchived && customerSites && (<Button size='small' startIcon={<Iconify icon="mdi:map-legend" />} variant='outlined' sx={{ mr: 1 }} onClick={() => handleOnClick('sites', linkCustomerSites)}> {(!isMobile || expandedButton === 'sites') && ( <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Sites</Typography> )}</Button> )}
          { !isArchived && customerContacts && (<Button size='small' startIcon={<Iconify icon="mdi:account-multiple" />} variant='outlined' sx={{ mr: 1 }}  onClick={() => handleOnClick('contacts', linkCustomerContacts)}> {(!isMobile || expandedButton === 'contacts') && ( <Typography variant="caption" sx={{ fontWeight: 'bold' }}>Contacts</Typography> )}</Button> )}
          { isAllAccessAllowed && !isSettingReadOnly && isArchivedCustomers && (<Button size='small' startIcon={<Iconify icon="fa6-solid:users-slash" />} variant='outlined' onClick={() => handleOnClick('archivedCustomers', linkArchivedCustomers)}> {(!isMobile || expandedButton === 'archivedCustomers') && ( <Typography variant="caption" sx={{ fontWeight: 'bold', fontSize: { xs: '0.65rem', sm: '0.75rem' }, }}>Archived Customers</Typography> )}</Button> )}
          { isAllAccessAllowed && !isSettingReadOnly && isArchivedMachines && <Button size='small' startIcon={<Iconify icon="fluent:table-delete-column-16-filled" />} variant='outlined' sx={{ml:2}} onClick={linkArchivedMachines}>Archived Machines</Button>}
        </Box>
        </Grid>
      </Grid>
    </StyledRoot>
  );
}
