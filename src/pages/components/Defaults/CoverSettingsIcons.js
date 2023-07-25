import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import Iconify from '../../../components/iconify/Iconify';
import { PATH_DASHBOARD, PATH_DOCUMENT, } from '../../../routes/paths';

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
  const { documentViewFormVisibility, documentHistoryViewFormVisibility } = useSelector((state) => state.document);
  const navigate = useNavigate();
const navigateTo= (path)=>{
  navigate(path);
}
  return (
    <Grid style={{ flex: 1, display: 'flex', justifyContent: 'end' }}>
      {backLink && (
        <Link
          title="Go Back"
          sx={{
            ml: 'auto',
            mr: 1,
            mt: 'auto',
            mb: 1,
            color: 'common.white',
          }}
          component="button"
          variant="body2"
          onClick={handleBacklink}
        >
          <Iconify icon="material-symbols:arrow-back-rounded" />
        </Link>
      )}
      {machineDrawingsBackLink && (
        <Link
          title="Go Back"
          sx={{
            ml: 'auto',
            mr: 1,
            mt: 'auto',
            mb: 1,
            color: 'common.white',
          }}
          component="button"
          variant="body2"
          onClick={()=> navigateTo(PATH_DOCUMENT.document.machineDrawings.list) }
        >
          <Iconify icon="material-symbols:arrow-back-rounded" />
        </Link>
      )}
      {handleBackLinks && ( documentHistoryViewFormVisibility || documentViewFormVisibility ) && (
        <Link
          title="Go Back"
          sx={{
            ml: 'auto',
            mr: 1,
            mt: 'auto',
            mb: 1,
            color: 'common.white',
          }}
          component="button"
          variant="body2"
          onClick={handleBackLinks}
        >
          <Iconify icon="material-symbols:arrow-back-rounded" />
        </Link>
      )}
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
          onClick={handleNavigate}
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
  setting: PropTypes.string,
  handleNavigate: PropTypes.func,
  backLink: PropTypes.bool,
  handleBacklink: PropTypes.func,
  handleBackLinks: PropTypes.func,
  generalSettings: PropTypes.bool,
  handleSettingsNavigate: PropTypes.func,
  machineDrawingsBackLink: PropTypes.string,
};

export default CoverSettingsIcons;
