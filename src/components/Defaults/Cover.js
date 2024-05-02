import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Button, Grid } from '@mui/material';
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
  const { isSettingReadOnly, isAllAccessAllowed } = useAuthContext()

  const handleSettingsNavigate = () => navigate(PATH_SETTING.root);
  const linkCustomerSites = () => navigate(PATH_CRM.sites);
  const linkCustomerContacts = () =>  navigate(PATH_CRM.contacts);
  const linkArchivedCustomers = () =>  navigate(PATH_CRM.customers.archived.root);
  const linkArchivedMachines = () =>  navigate(PATH_MACHINE.machines.archived.root);
  const handleBackLink = () => window.history.back();

  const isMobile = useResponsive('down', 'sm');

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
            { !isArchived && customerSites && <Button size='small' startIcon={<Iconify icon="mdi:map-legend" />} variant='outlined' onClick={linkCustomerSites}>Sites</Button>}
            { !isArchived && customerContacts && <Button size='small' startIcon={<Iconify icon="mdi:account-multiple" />} variant='outlined' sx={{ml:2}} onClick={linkCustomerContacts}>Contacts</Button>}
            {/* { isAllAccessAllowed && !isSettingReadOnly && isArchivedCustomers && <Button size='small' startIcon={<Iconify icon="fa6-solid:users-slash" />} variant='outlined' sx={{ml:2}} onClick={linkArchivedCustomers}>Archived Customers</Button>} */}
            {/* { isAllAccessAllowed && !isSettingReadOnly && isArchivedMachines && <Button size='small' startIcon={<Iconify icon="fluent:table-delete-column-16-filled" />} variant='outlined' sx={{ml:2}} onClick={linkArchivedMachines}>Archived Machines</Button>} */}
            
          </Grid>
      </Grid>
    </StyledRoot>
  );
}
