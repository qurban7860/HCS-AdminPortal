import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell, Typography, Grid, Link } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { green } from '@mui/material/colors';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { StyledTableRow, StyledTooltip } from '../../../../theme/styles/default-styles'
import { ICONS } from '../../../../constants/icons/default-icons';

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
  
  const theme = createTheme({
    palette: {
      success: green,
    },
  });

  const { name, startDate, releaseDate, released, description  } = row;

  return (
      <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
          { released && <TableCell align="left" sx={{ display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', pt: 1, mb: -1 }} >
            <b>Version: <Link onClick={onViewRow} sx={{ cursor: 'pointer' }} >{`  ${name}`}</Link>
                <StyledTooltip 
                  placement="top" 
                  disableFocusListener  
                  color={ released ? ICONS.RELEASE.color : ICONS.NOTRELEASE.color } 
                  title={ released ? ICONS.RELEASE.heading : ICONS.NOTRELEASE.heading } 
                  tooltipcolor={ released ? theme.palette.primary.main : theme.palette.error.main } 
                > 
                  <Switch checked={released} disabled size="small" sx={{ ml:2}} color={ released ? 'primary' : 'error'} />
                </StyledTooltip>
            </b>
            {releaseDate && <Typography variant="body2" ><b>Release Date:  </b>{fDate(releaseDate)} </Typography> }
          </TableCell> }
          {description && <TableCell align='left' sx={{ pb: 1, 
            display: 'flex',
            alignItems: 'center',
            whiteSpace: 'pre-line',
            wordBreak: 'break-word' }}  >{description}</TableCell>}
      </StyledTableRow>
  );
}
