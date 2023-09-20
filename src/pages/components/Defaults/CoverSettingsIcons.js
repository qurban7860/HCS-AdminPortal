import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Grid, Link } from '@mui/material';
import { useNavigate } from 'react-router';
import Iconify from '../../../components/iconify/Iconify';
import { PATH_DOCUMENT, } from '../../../routes/paths';
import { setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';
import { setLicenseViewFormVisibility } from '../../../redux/slices/products/license';
import { setProfileViewFormVisibility } from '../../../redux/slices/products/profile';
import { setAllFlagsFalse } from '../../../redux/slices/products/machineServiceRecord';

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
  const { machineServiceRecordViewFormFlag } = useSelector((state) => state.machineServiceRecord);
  const { drawingViewFormVisibility } = useSelector((state) => state.drawing );
  const { licenseViewFormVisibility } = useSelector((state) => state.license );
  const { profileViewFormVisibility } = useSelector((state) => state.profile );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const navigateTo= (path)=>{ navigate(path) }

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
      {handleBackLinks && machineServiceRecordViewFormFlag && (
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
          onClick={()=>dispatch(setAllFlagsFalse())}
        >
          <Iconify icon="material-symbols:arrow-back-rounded" />
        </Link>
      )}
      {handleBackLinks && drawingViewFormVisibility && (
        <Link
          title="Go Back"
          sx={{ ml: 'auto', mr: 1, mt: 'auto', mb: 1, color: 'common.white',}}
          component="button"
          variant="body2"
          onClick={()=> dispatch(setDrawingViewFormVisibility(false))}
        >
          <Iconify icon="material-symbols:arrow-back-rounded" />
        </Link>
      )}

      {handleBackLinks && licenseViewFormVisibility && (
        <Link
          title="Go Back"
          sx={{ ml: 'auto', mr: 1, mt: 'auto', mb: 1, color: 'common.white',}}
          component="button"
          variant="body2"
          onClick={()=> dispatch(setLicenseViewFormVisibility(false))}
        >
          <Iconify icon="material-symbols:arrow-back-rounded" />
        </Link>
      )}

      {handleBackLinks && profileViewFormVisibility && (
        <Link
          title="Go Back"
          sx={{ ml: 'auto', mr: 1, mt: 'auto', mb: 1, color: 'common.white',}}
          component="button"
          variant="body2"
          onClick={()=> dispatch(setProfileViewFormVisibility(false))}
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
