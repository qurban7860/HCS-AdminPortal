import PropTypes from 'prop-types';
import { TableCell, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerificationIcon from '../Icons/VerificationIcon';
import OpenInNewPage from '../Icons/OpenInNewPage';
import useLimitString from '../../hooks/useLimitString';
import { StyledTooltip } from '../../theme/styles/default-styles';

export default function LinkTableCellWithIconTargetBlank({ align, onViewRow, onClick, param, tooltip, isVerified, ...other }) {
  const limitedString = useLimitString(param, 30);
  return (
    <TableCell align={align} sx={{minWidth:'130px'}} {...other}>
      {isVerified!==undefined && <VerificationIcon isVerified={isVerified} />}
      { tooltip && ( typeof tooltip === 'string' || tooltip instanceof Node ) ? 
        <StyledTooltip
          title={ tooltip }
          placement="top"
          disableFocusListener
          tooltipcolor="#103996" 
          color="#103996"
        >
          <Link
            onClick={!onViewRow ? undefined : onViewRow}
            color="inherit"
            sx={{
              mt: 0.5,
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationStyle: 'dotted',
              fontWeight: 'bold',
              '&:hover': {
                color: (theme) => alpha(theme.palette.mode === 'light' ? theme.palette.info.main : theme.palette.info.light, 0.98),
              },
            }}
          >
            {limitedString}
          </Link>
        </StyledTooltip>
       : 
        <Link
          onClick={!onViewRow ? undefined : onViewRow}
          color="inherit"
          sx={{
            mt: 0.5,
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            fontWeight: 'bold',
            '&:hover': {
              color: (themes) => alpha(themes.palette.info.dark, 0.98),
            },
          }}
        >
          {limitedString}
        </Link>
      }

      {onClick && <OpenInNewPage onClick={onClick} /> }
    </TableCell>
  );
}

LinkTableCellWithIconTargetBlank.propTypes = {
  align: PropTypes.string,
  onViewRow: PropTypes.func,
  onClick: PropTypes.func,
  param: PropTypes.string,
  tooltip: PropTypes.any,
  isVerified: PropTypes.bool,
};
