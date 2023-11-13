import PropTypes from 'prop-types';
import { TableCell, TableRow } from '@mui/material';
import EmptyContent from '../empty-content';


// ----------------------------------------------------------------------

TableNoData.propTypes = {
  isNotFound: PropTypes.bool,
};

export default function TableNoData({ isNotFound }) {
  return (
    <>
      {isNotFound ? (
        <TableRow>
        <TableCell colSpan={12}>
          <EmptyContent
            title="Empty"
            sx={{
              color: '#DFDFDF'
            }}
          />
        </TableCell>
        </TableRow>
      ) : (
        <TableRow>
        <TableCell colSpan={12} sx={{ p: 0 }} />
        </TableRow>
      )}
    </>
  );
}
