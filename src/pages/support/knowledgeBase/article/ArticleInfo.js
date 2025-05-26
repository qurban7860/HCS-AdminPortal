import PropTypes from 'prop-types';
import { Button, IconButton, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Iconify from '../../../../components/iconify';
import { StyledTooltip } from '../../../../theme/styles/default-styles';

const StyledButtonRoot = styled(Button)({
  textTransform: 'none',
  color: 'inherit',
  fontWeight: 'inherit',
  '&:disabled': {
    color: 'inherit',
    fontWeight: 'inherit',
    cursor: 'not-allowed',
    opacity: 1
  }
});

export default function ArticleInfo({ icon, label, onClick, tooltip, ...other }) {

  const isReadOnly = !onClick;
  
  return (
    isReadOnly ? (
      <StyledTooltip title={tooltip} placement="top" disableFocusListener>
        <IconButton disableRipple sx={{ p: 0, gap: 0.5 }}>
          <Iconify icon={icon} width="15px" />
          {label && <Typography variant="caption" sx={{ p: 0, fontStyle: 'italic' }}>{label}</Typography>}
        </IconButton>
      </StyledTooltip>
    ) : (
      <StyledButtonRoot
            size="small"
            startIcon={icon && <Iconify icon={icon} width="15px" />}
            onClick={onClick}
            {...other}
        >
        {label && <Typography variant="caption" sx={{ p: 0, fontStyle: 'italic' }}>{label}</Typography>}
      </StyledButtonRoot>
    )
  );
}

ArticleInfo.propTypes = {
  icon: PropTypes.string,
  label: PropTypes.string,
  tooltip: PropTypes.string,
  onClick: PropTypes.func
};

