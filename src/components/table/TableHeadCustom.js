import PropTypes from 'prop-types';
// @mui
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { useWidth } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
};

// ----------------------------------------------------------------------

TableHeadCustom.propTypes = {
  sx: PropTypes.object,
  onSort: PropTypes.func,
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  rowCount: PropTypes.number,
  numSelected: PropTypes.number,
  onSelectAllRows: PropTypes.func,
  order: PropTypes.oneOf(['asc', 'desc']),
};

export default function TableHeadCustom({
  order,
  orderBy,
  rowCount = 0,
  headLabel,
  numSelected = 0,
  onSort,
  onSelectAllRows,
  sx,
}) {

  const width = useWidth();
  // Which point the columns will be hiden 
  const mdNone = " md: |  md1 md2 md3 md4 md5 | ";
  const smNone = " md: |  md1 md2 md3 md4 md5 | sm: | sm1 sm2 sm3 sm4 sm5| "
  const xsNone = " md: |  md1 md2 md3 md4 md5 | sm: | sm2 sm3 sm4 sm5 | xs: | xs1 xs2 xs3 xs4 xs5 |"

  let displayHeadIs

// isDisabled isActive active created_at createdAt
  return (
    <TableHead sx={sx} >
      <TableRow>
        {/* {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )} */}

        {headLabel.map((headCell) => {
          if( width === 'md' ) {
            displayHeadIs = mdNone.includes(headCell.id)
            displayHeadIs = mdNone.includes(headCell.visibility)
          }else if( width === 'sm'){
            displayHeadIs = smNone.includes(headCell.id)
            displayHeadIs = smNone.includes(headCell.visibility)
          }else if( width === 'xs' ){
            displayHeadIs = xsNone.includes(headCell.id)
            displayHeadIs = xsNone.includes(headCell.visibility)
          }
          return(
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{ width: headCell.width, 
            minWidth: headCell.minWidth,
            display: displayHeadIs ? 'none' : 'table-cell',
             }}
          >
            {onSort ? (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
                sx={{ textTransform: 'capitalize' }}
              >
                {headCell.label}

                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : (
              headCell.label
            )}
          </TableCell>
        )})}
      </TableRow>
    </TableHead>
  );
}
