import PropTypes from 'prop-types';
import { useNavigate } from 'react-router';
import { StyledRoot, StyledInfo } from '../../theme/styles/default-styles';
// utils
import { PATH_SETTING } from '../../routes/paths';
// auth
import CoverSettingsIcons from './CoverSettingsIcons';
import CoverTitles from './CoverTitles';
import useResponsive from '../../hooks/useResponsive';
import CoverAvatar from './CoverAvatar';

// ----------------------------------------------------------------------

Cover.propTypes = {
  name: PropTypes.string,
  icon: PropTypes.string,
  avatar: PropTypes.bool,
  setting: PropTypes.bool,
  generalSettings: PropTypes.bool,
};
export function Cover({
  name,
  icon,
  avatar,
  setting,
  generalSettings
}) {
  const navigate = useNavigate();

  const handleSettingsNavigate = () => {
    navigate(PATH_SETTING.app);
  };
  
  const isMobile = useResponsive('down', 'sm');
  
  return (
    <StyledRoot style={{ p: { xs: 0, md: 0 } }}>
      <StyledInfo style={{ width: '100%', flex: 1, display: 'flex', justifyContent: 'space-between' }} >
        {avatar && <CoverAvatar avatar={name} />}
        <CoverTitles title={avatar && isMobile ? '' : name} />
        <CoverSettingsIcons setting={setting} handleSettingsNavigate={handleSettingsNavigate} generalSettings={generalSettings} />
      </StyledInfo>
    </StyledRoot>
  );
}
