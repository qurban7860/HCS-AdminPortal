import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import Iconify from '../iconify/Iconify';
import { PATH_MACHINE } from '../../routes/paths';
import { useAuthContext } from '../../auth/useAuthContext';

function CoverSettingsIcons({
  setting,
  handleNavigate,
  backLink,
  handleBacklink,
  handleBackLinks,
  machineDrawingsBackLink,
  generalSettings,
  handleSettingsNavigate,
  supportTicketSettings,
  handleSupportTicketSettingsNavigate,
}) {

  const { isSettingAccessAllowed } = useAuthContext()
  const navigate = useNavigate();
  
  return (
    <Grid style={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
      {setting && isSettingAccessAllowed && (
        <Link
          title="Machine Setting"
          sx={{
            cursor: 'hover',
            mt: 'auto',
            color: 'common.white',
            mr: 2,
            mb: { xs: 0, md: 1 },
          }}
          component="button"
          variant="body2"
          onClick={()=>navigate(PATH_MACHINE.machineSettings.root)}
        >
          <Iconify icon="mdi:cog" />
        </Link>
      )}
      {generalSettings && (
        <Link
          title="Settings"
          sx={{
            cursor: 'hover',
            mt: 'auto',
            color: 'common.white',
            mx: 2,
            mb: { xs: 0, md: 1 },
          }}
          component="button"
          variant="body2"
          onClick={handleSettingsNavigate}
        >
          <Iconify icon="mdi:cog" />
        </Link>
      )}
      {supportTicketSettings && (
        <Link
          title="Settings"
          sx={{
            cursor: 'hover',
            mt: 'auto',
            color: 'common.white',
            mx: 2,
            mb: { xs: 0, md: 1 },
          }}
          component="button"
          variant="body2"
          onClick={handleSupportTicketSettingsNavigate}
        >
          <Iconify icon="mdi:cog" />
        </Link>
      )}
    </Grid>
  );
}

CoverSettingsIcons.propTypes = {
  setting: PropTypes.bool,
  handleNavigate: PropTypes.func,
  backLink: PropTypes.bool,
  handleBacklink: PropTypes.func,
  handleBackLinks: PropTypes.func,
  generalSettings: PropTypes.bool,
  handleSettingsNavigate: PropTypes.func,
  machineDrawingsBackLink: PropTypes.string,
  supportTicketSettings: PropTypes.bool,
  handleSupportTicketSettingsNavigate: PropTypes.func,
};

export default CoverSettingsIcons;
