import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { alpha } from '@mui/system';
// import { useSelector } from 'react-redux';
import { StyledRoot, StyledInfo } from '../../../theme/styles/default-styles';
// utils
import { PATH_SETTING } from '../../../routes/paths';
// auth
// import { useAuthContext } from '../../../auth/useAuthContext';
// components
// import Image from '../../../components/image';
import CoverCustomAvatar from './CoverCustomAvatar';
import CoverSettingsIcons from './CoverSettingsIcons';
import CoverTitles from './CoverTitles';
import LogoAvatar from '../../../components/logo-avatar/LogoAvatar';
import useResponsive from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

Cover.propTypes = {
  tradingName: PropTypes.string,
  cover: PropTypes.string,
  name: PropTypes.string,
  role: PropTypes.string,
  setting: PropTypes.bool,
  photoURL: PropTypes.object,
  icon: PropTypes.string,
  serialNo: PropTypes.string,
  backLink: PropTypes.string,
  handleBackLinks: PropTypes.func,
  machineDrawingsBackLink: PropTypes.string,
  model: PropTypes.string,
  customer: PropTypes.string,
  generalSettings: PropTypes.bool,
  titleLength: PropTypes.number,
};
export function Cover({
  tradingName,
  cover,
  name,
  serialNo,
  role,
  setting,
  photoURL,
  icon,
  backLink,
  handleBackLinks,
  machineDrawingsBackLink,
  model,
  customer,
  generalSettings,
  titleLength
}) {
  const navigate = useNavigate();

  const handleSettingsNavigate = () => {
    navigate(PATH_SETTING.app);
  };

  const isMobile = useResponsive('down', 'sm');
  const nameNumMaxLength = name?.split(' ')[0];
  const nameNumMaxLength2 = name?.split(' ')[1]?.substring(0, 10);
  const nameTitle = `${nameNumMaxLength} ${nameNumMaxLength2 || ''}`;

  if(titleLength && name?.length>titleLength){
    name = `${name.substring(0,titleLength)}...`;
  }

  return (
    <StyledRoot style={{ p: { xs: 0, md: 0 } }}>
      <StyledInfo
        style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }}
      >
        {photoURL && (
          <CoverCustomAvatar name={name !== 'HOWICK LTD.' && name} alt={name}>
            {/* if the page is Howick, will show the howick logo */}
            {name !== 'HOWICK LTD.' ? null : <LogoAvatar />}
          </CoverCustomAvatar>
        )}
        <CoverTitles sx={{whiteSpace: 'nowrap',      // Prevent text from wrapping
            overflow: 'hidden',       // Hide any overflow
            textOverflow: 'ellipsis', // Add ellipsis for overflowed text
            maxWidth: '400px',   
            '&:hover': {
              color: (theme) => alpha(theme.palette.info.main, 0.98),
            },}}
          name={name}
          nameTitle={nameTitle}
          serialNo={serialNo}
          photoURL={photoURL}
          isMobile={isMobile}
          machineChildren={
            <>
              {serialNo && serialNo}
              {name && name.length > 15 && `/${nameTitle}`}
            </>
          }
          children={isMobile && name?.length > 15 ? '' : name}
        />
        <CoverSettingsIcons
          setting={setting}
          handleSettingsNavigate={handleSettingsNavigate}
          generalSettings={generalSettings}
        />
      </StyledInfo>
    </StyledRoot>
  );
}
