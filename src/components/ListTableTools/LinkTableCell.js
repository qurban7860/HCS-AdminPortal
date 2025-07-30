import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
import { alpha, createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../iconify';
import { ICONS } from '../../constants/icons/default-icons';
import useLimitString from '../../hooks/useLimitString';

export default function LinkTableCell({ align, onClick, param, node, stringLength, isDefault }) {

  const theme = createTheme({
    palette: { success: green },
  });

  return (
      <TableCell className='ellipsis-cell' onClick={onClick} align={align}
          color="inherit"
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            fontWeight: 'bold',
            whiteSpace: 'nowrap',      // Prevent text from wrapping
            overflow: 'hidden',       // Hide any overflow
            textOverflow: 'ellipsis', // Add ellipsis for overflowed text
            maxWidth: '400px',   
            '&:hover': {
              color: () => alpha(theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.info.light, 0.98)
            },
          }}
          >
        { useLimitString( param , stringLength || 30) } 
        {isDefault && 
          <StyledTooltip onClick={onClick} title={ICONS.DEFAULT.heading} placement="top" disableFocusListener tooltipcolor={theme.palette.primary.main}>
            <Iconify icon={ICONS.DEFAULT.icon} color={theme.palette.primary.main} width="17px" height="17px" sx={{ mb: -0.3, ml: 0.5, cursor:"pointer"}}/>
          </StyledTooltip>
        }
        { node }
      </TableCell>
  );
}

LinkTableCell.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  node: PropTypes.node,
  param: PropTypes.string,
  stringLength: PropTypes.number,
  isDefault: PropTypes.bool,
};
