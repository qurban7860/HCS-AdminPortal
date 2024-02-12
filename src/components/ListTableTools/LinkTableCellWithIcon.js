import PropTypes from 'prop-types';
import { TableCell, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerificationIcon from '../Icons/VerificationIcon';
import useLimitString from '../../hooks/useLimitString';

export default function LinkTableCellWithIcon({ align, onClick, param, isVerified }) {
  return (
    <TableCell align={align}>
      <VerificationIcon isVerified={isVerified} />
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
        { useLimitString( param, 25 ) }
      </Link>
    </TableCell>
  );
}

LinkTableCellWithIcon.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
  isVerified: PropTypes.bool,
};
