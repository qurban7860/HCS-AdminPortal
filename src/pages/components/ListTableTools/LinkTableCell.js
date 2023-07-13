import PropTypes from 'prop-types';
import { TableCell, Link } from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';

export default function LinkTableCell({ align, onClick, param }) {
  return (
    <TableCell align={align}>
      <Link
        onClick={onClick}
        color="inherit"
        sx={{
          cursor: 'pointer',
          textDecoration: 'underline',
          textDecorationStyle: 'dotted',
          fontWeight: 'bold',
          // bgcolor: (theme) => alpha(theme.palette.info.dark, 0.92),
          '&:hover': {
            color: (theme) => alpha(theme.palette.info.main, 0.98),
          },
        }}
      >
        {param}
      </Link>
    </TableCell>
  );
}

LinkTableCell.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
};
