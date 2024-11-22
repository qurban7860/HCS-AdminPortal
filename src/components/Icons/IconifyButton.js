import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';

export default function IconifyButton({ icon, title, color, onClick, sx }) {
  
  const theme = createTheme({
    palette: { success: green },
  });

  return (
    <StyledTooltip
      arrow
      title={title}
      placement='top'
      tooltipcolor={color}
    >
      <Iconify icon={icon} color={color} sx={{ cursor: 'pointer', ml: 1, mb: -0.7, ...sx }} onClick={onClick}/>
    </StyledTooltip>
  );
}

IconifyButton.propTypes = {
  icon: PropTypes.string,
  title: PropTypes.string,
  color: PropTypes.string,
  onClick: PropTypes.func,
  sx: PropTypes.object,
};