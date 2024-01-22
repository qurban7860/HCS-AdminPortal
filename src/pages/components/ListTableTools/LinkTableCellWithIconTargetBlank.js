import PropTypes from 'prop-types';
import { TableCell, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
import VerificationIcon from '../Icons/VerificationIcon';
import OpenInNewPage from '../Icons/OpenInNewPage';
// import Iconify from '../../../components/iconify';

export default function LinkTableCellWithIconTargetBlank({ align, onViewRow, onClick, param, isVerified }) {
  return (
    <TableCell align={align} sx={{minWidth:'130px'}}>
      <VerificationIcon isVerified={isVerified} />
      <Link
        onClick={onViewRow}
        color="inherit"
        sx={{
          mt:0.5,
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
      <OpenInNewPage onClick={onClick} /> 
    </TableCell>
  );
}

LinkTableCellWithIconTargetBlank.propTypes = {
  align: PropTypes.string,
  onViewRow: PropTypes.func,
  onClick: PropTypes.func,
  param: PropTypes.string,
  isVerified: PropTypes.bool,
};
