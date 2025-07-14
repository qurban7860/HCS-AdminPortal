import PropTypes from 'prop-types';
// @mui
import { Box, TableRow, TableCell, TableHead, TableSortLabel } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
import { useWidth } from '../../hooks/useResponsive';
import Iconify from '../iconify';
import { StyledTooltip } from '../../theme/styles/default-styles';

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

const renderLabelWithTooltip = (headCell) => {
  const display = headCell.title ?? headCell.label;

  return headCell.tooltip ? (
    <StyledTooltip title={headCell.tooltip} placement="top">
      <Box component="span">{display}</Box>
    </StyledTooltip>
  ) : (
    display
  );
};


// ----------------------------------------------------------------------

TableHeadFilter.propTypes = {
  order: PropTypes.oneOf(['asc', 'desc']),
  orderBy: PropTypes.string,
  headLabel: PropTypes.array,
  hiddenColumns: PropTypes.object,
  onSort: PropTypes.func,
  sx: PropTypes.object,
};

export default function TableHeadFilter({
  order,
  orderBy,
  headLabel,
  hiddenColumns,
  onSort,
  sx,
}) {

  const width = useWidth();
  // Which point the columns will be hiden 
  const mdNone = " md: |  md1 md2 md3 md4 md5 | ";
  const smNone = " md: |  md1 md2 md3 md4 md5 | sm: | sm1 sm2 sm3 sm4 sm5| "
  const xsNone = " md: |  md1 md2 md3 md4 md5 | sm: | sm2 sm3 sm4 sm5 | xs: | xs1 xs2 xs3 xs4 xs5 |"

  const theme = createTheme({ palette: { success: green } });

  let displayHeadIs

  return (
    <TableHead>
      <TableRow>
        {headLabel?.map((headCell) => {
          if( width === 'md' && headCell?.visibility ) {
            displayHeadIs = !hiddenColumns[headCell.id] && mdNone?.includes(headCell.id)
            displayHeadIs = mdNone?.includes(headCell?.visibility)
          }else if( width === 'sm' && headCell?.visibility){
            displayHeadIs = !hiddenColumns[headCell.id] && smNone?.includes(headCell.id)
            displayHeadIs = smNone?.includes(headCell?.visibility)
          }else if( width === 'xs' && headCell?.visibility){
            displayHeadIs = !hiddenColumns[headCell.id] && xsNone?.includes(headCell.id)
            displayHeadIs = xsNone?.includes(headCell?.visibility)
          }

          return (
            hiddenColumns?(
              !hiddenColumns[headCell.id] && (
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
                        // sx={{ textTransform: 'capitalize' }}
                      >
                         {renderLabelWithTooltip(headCell)} 
  
                        {orderBy === headCell.id ? (
                          <Box sx={{ ...visuallyHidden }}>
                            {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                          </Box>
                        ) : null}
                      </TableSortLabel>
                    ) : (
                     renderLabelWithTooltip(headCell)
                    )}
                </TableCell>
              )
            ):(<TableCell
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
                    {renderLabelWithTooltip(headCell)}

                    {orderBy === headCell.id ? (
                      <Box sx={{ ...visuallyHidden }}>
                        {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                      </Box>
                    ) : null}
                  </TableSortLabel>
                ) : (
                renderLabelWithTooltip(headCell)
                )}
            </TableCell>)
            
          )
        })}
      </TableRow>
    </TableHead>
  );
}
