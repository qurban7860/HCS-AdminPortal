import React from 'react';
import PropTypes from 'prop-types';
import { Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import Iconify from '../../../components/iconify/Iconify';
import { PATH_MACHINE } from '../../../routes/paths';

function CoverSettingsIcons({
  setting,
  handleNavigate,
  backLink,
  handleBacklink,
  handleBackLinks,
  machineDrawingsBackLink,
  generalSettings,
  handleSettingsNavigate,
}) {

  const navigate = useNavigate();
  
  return (
    <Grid style={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
      {setting && (
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
          onClick={()=>navigate(PATH_MACHINE.machines.settings.app)}
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
};

export default CoverSettingsIcons;
