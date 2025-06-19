import PropTypes from 'prop-types';
import SvgIcon from '@mui/material/SvgIcon';
import { styled, alpha } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import { Tooltip } from '@mui/material';

// ----------------------------------------------------------------------

export function ToolbarItem({ sx, icon, tooltip, label, active, disabled, ...other }) {
  return (
    <Tooltip title={tooltip} placement='bottom'>
      <ItemRoot active={active} disabled={disabled} sx={sx} {...other}>
        {icon && <SvgIcon sx={{ fontSize: 18 }}>{icon}</SvgIcon>}
        {label && label}
      </ItemRoot>
    </Tooltip>
  );
}

// ----------------------------------------------------------------------

const ItemRoot = styled(ButtonBase, {
  shouldForwardProp: (prop) => !['active', 'disabled', 'sx'].includes(prop),
})(({ theme }) => ({
  ...theme.typography.body2,
  width: 28,
  height: 28,
  padding: theme.spacing(0, 0.75),
  borderRadius: theme.shape.borderRadius * 0.75,
  '&:hover': {
    backgroundColor: theme.palette.action.hover,
  },
  variants: [
    {
      props: { active: true },
      style: {
        backgroundColor: theme.palette.action.selected,
        border: `solid 1px ${theme.palette.action.hover}`,
      },
    },
    {
      props: { disabled: true },
      style: {
        opacity: 0.48,
        pointerEvents: 'none',
        cursor: 'not-allowed',
      },
    },
  ],
}));

ToolbarItem.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.array,
    PropTypes.func,
  ]),
  icon: PropTypes.node,
  label: PropTypes.node,
  tooltip: PropTypes.string,
  active: PropTypes.bool,
  disabled: PropTypes.bool,
};
