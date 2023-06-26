import PropTypes from 'prop-types';
import { TableCell, Link } from '@mui/material';
import { makeStyles } from '@mui/styles'; // will uninstall this later
import { alpha } from '@mui/material/styles';
import { StyledTooltip } from '../../theme/styles/default-styles';
import Iconify from '../../components/iconify';

LinkTableCellWithIcon.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
  isVerified: PropTypes.bool,
};
export default function LinkTableCellWithIcon({ align, onClick, param, isVerified }) {
  return (
    <TableCell align={align}>
      <StyledTooltip
        title={isVerified ? 'Verified' : 'Not Verified'}
        placement="top"
        disableFocusListener
        toolTipColor={isVerified ? 'green' : 'red'}
      >
        <Iconify
          icon="ic:round-verified-user"
          color={isVerified ? 'green' : 'red'}
          sx={{
            mb: -0.5,
            mr: 0.5,
          }}
        />
      </StyledTooltip>
      <Link
        onClick={onClick}
        color="inherit"
        sx={{
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          fontWeight: 'bold',
          '&:hover': {
            color: (themes) => alpha(themes.palette.info.main, 0.98),
          },
        }}
      >
        {param}
      </Link>
    </TableCell>
  );
}
