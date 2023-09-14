import PropTypes from 'prop-types';
import { TableCell, Link } from '@mui/material';
import { alpha } from '@mui/material/styles';
// import useResponsive from '../../../hooks/useResponsive';

export default function LinkTableCell({ align, onClick, param }) {
  return (
        <TableCell onClick={onClick} align={align}
          width='300px'
          color="inherit"
          sx={{
            cursor: 'pointer',
            textDecoration: 'underline',
            textDecorationStyle: 'dotted',
            fontWeight: 'bold',
            // whiteSpace: 'nowrap',      // Prevent text from wrapping
            // overflow: 'hidden',       // Hide any overflow
            // textOverflow: 'ellipsis', // Add ellipsis for overflowed text
            // maxWidth: '30%',   
            '&:hover': {
              color: (theme) => alpha(theme.palette.info.main, 0.98),
            },
          }}
        >
        {param}
    </TableCell>
  );
}

LinkTableCell.propTypes = {
  align: PropTypes.string,
  onClick: PropTypes.func,
  param: PropTypes.string,
};
