import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell, Typography, Grid, Link } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow } from '../../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

ReleasesListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ReleasesListTableRow({
  row,
  selected,
  onViewRow
}) {
  
  const { name, startDate, releaseDate, released, description  } = row;

  return (
      <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
          { ( released && description ) ? <TableCell align="left" sx={{ display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', pt: 1, mb: -1 }} >
                  <Link onClick={onViewRow} sx={{ cursor: 'pointer' }} ><b>Version:  </b>{`  ${name}`} {released && <Switch checked={released} disabled size="small" sx={{ ml:2}} />} </Link> 
                  {releaseDate && <Typography variant="body2" ><b>Release Date:  </b>{fDate(releaseDate)} </Typography> }
          </TableCell>
          : <TableCell align="left" sx={{ display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', py:1.5 }}  >
                  <Typography variant="body2" ><b  >Version:  </b>{` ${name}`} {released && <Switch checked={released} disabled size="small" sx={{ ml:2}} /> }</Typography> 
                  {releaseDate && <Typography variant="body2" ><b>Release Date:  </b>{fDate(releaseDate)}</Typography> }
            </TableCell>
          }
          {description && <TableCell align='left' sx={{ pb: 1, 
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word' }}  >{description}</TableCell>}
      </StyledTableRow>
  );
}
