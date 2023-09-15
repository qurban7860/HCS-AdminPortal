import PropTypes from 'prop-types';
import { TableCell } from '@mui/material';
import { alpha } from '@mui/material/styles';
// import useResponsive from '../../../hooks/useResponsive';

export default function LinkTableCell({ align, onClick, param }) {
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
