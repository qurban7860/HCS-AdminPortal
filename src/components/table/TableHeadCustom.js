import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
// @mui
import { Box, Checkbox, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';

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
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mdNone = " md: | customerMainSiteAddress instalationSite documentMachine documentCustomer userRole | ";
  const smNone = " md: | customerMainSiteAddress customerTradingName instalationSite machineCustomer  documentMachine documentCustomer userPhone userRole | sm: | tradingName city country phone doctype doccategory type connections | "
  const xsNone = " md: | customerMainSiteAddress customerTradingName instalationSite machineCustomer  documentMachine documentCustomer userPhone userRole | sm: | customerAccess tradingName city country phone doctype doccategory version type connections | xs: | machineModel machineName machineStatus |"
  let displayHeadIs
// isDisabled isActive active created_at createdAt
  return (
    <TableHead sx={sx} >
      <TableRow>
        {onSelectAllRows && (
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>
        )}

        {headLabel.map((headCell) => {
          if( window.innerWidth > 900 && window.innerWidth < 1200 ) {
            displayHeadIs = mdNone.includes(headCell.id)
          }else if( window.innerWidth > 600 && window.innerWidth < 900 ){
            displayHeadIs = smNone.includes(headCell.id)
          }else if( window.innerWidth < 600 ){
            displayHeadIs = xsNone.includes(headCell.id)
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
