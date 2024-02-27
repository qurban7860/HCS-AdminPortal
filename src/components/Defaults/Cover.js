import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { Button, Grid } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { StyledRoot, StyledInfo } from '../../theme/styles/default-styles';
// utils
import { PATH_CUSTOMER, PATH_SETTING } from '../../routes/paths';
// auth
import CoverSettingsIcons from './CoverSettingsIcons';
import CoverTitles from './CoverTitles';
import useResponsive from '../../hooks/useResponsive';
import CoverAvatar from './CoverAvatar';
import Iconify from '../iconify';
import { BUTTONS } from '../../constants/default-constants';
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
};
export function Cover({
  name,
  icon,
  avatar,
  setting,
  generalSettings,
  customerSites,
  customerContacts
}) {
  const navigate = useNavigate();

  const handleSettingsNavigate = () => {
    navigate(PATH_SETTING.app);
  };

  const linkCustomerSites = () => {
    navigate(PATH_CUSTOMER.sites)
  }

  const linkCustomerContacts = () => {
    navigate(PATH_CUSTOMER.contacts)
  }
  
  const isMobile = useResponsive('down', 'sm');
  const { isAllAccessAllowed } = useAuthContext()

  return (
    <StyledRoot style={{ p: { xs: 0, md: 0 } }}>
      <StyledInfo style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }} >
        {avatar && <CoverAvatar avatar={name} />}
        <CoverTitles title={avatar && isMobile ? '' : name} />
        <CoverSettingsIcons setting={setting} handleSettingsNavigate={handleSettingsNavigate} generalSettings={generalSettings} />
      </StyledInfo>
      {isAllAccessAllowed &&
        <Grid container justifyContent='flex-end' columnGap={2} sx={{ position: 'absolute', bottom: 10, right: 10}}>
          {customerSites && <Button variant='contained' onClick={linkCustomerSites}>Sites</Button>}
          {customerContacts && <Button variant='contained' onClick={linkCustomerContacts}>Conatcts</Button>}
        </Grid>
      }
    </StyledRoot>
  );
}
