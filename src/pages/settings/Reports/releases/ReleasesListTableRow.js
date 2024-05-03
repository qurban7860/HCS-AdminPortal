import PropTypes from 'prop-types';
// @mui
import { TableCell, Typography, Link } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import { StyledTableRow, StyledTooltip } from '../../../../theme/styles/default-styles'
import { ICONS } from '../../../../constants/icons/default-icons';
import Iconify from '../../../../components/iconify';

// ----------------------------------------------------------------------

ReleasesListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
  index: PropTypes.number,
  page: PropTypes.number,
};

export default function ReleasesListTableRow({
  row,
  selected,
  onViewRow,
  index,
  page,
}) {

  const { name, releaseDate, released, description  } = row;
  
  return (
      <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
          { released && <TableCell align="left" sx={{ display: { sm: 'block', md: 'flex'}, justifyContent: 'space-between', pt: 1, mb: -1 }} >
            <b>Version: <Link onClick={onViewRow} sx={{ cursor: 'pointer' }} >{`  ${name}`}</Link>
                <StyledTooltip 
                  placement="top" 
                  disableFocusListener  
                  color={ released ? ICONS.RELEASE.color : ICONS.NOTRELEASE.color } 
                  title={ released ? ICONS.RELEASE.heading : ICONS.NOTRELEASE.heading } 
                  tooltipcolor={ released ? ICONS.RELEASE.color : ICONS.NOTRELEASE.color  } 
                > 
                  <Iconify icon={ ( ( index === 0 || index === 1 ) && page === 0 && released ) ? ICONS.RELEASED.icon : ICONS.RELEASE.icon} sx={{ml:1.5, height: 20, width: 20 }}/>
                </StyledTooltip>
            </b>
            {releaseDate && <Typography variant="body2" ><b>Release Date:  </b>{fDate(releaseDate)} </Typography> }
          </TableCell> }
          {description && <TableCell align='left' sx={{ pb: 1 }}  >
                <Typography variant="body2" sx={{ 
                  display: 'flex',
                  alignItems: 'flex-start',
                  whiteSpace: 'pre-line',
                  wordBreak: 'break-word'}}
                  >
                    <StyledTooltip 
                      placement="top" 
                      disableFocusListener  
                      color={ ICONS.NOTE.color } 
                      title={ ICONS.NOTE.heading } 
                      tooltipcolor={ ICONS.NOTE.color } 
                    >
                      <Iconify icon={ICONS.NOTE.icon} sx={{mx: 0.3, flexShrink: 0, width: "20px", height: "20px"}} />
                    </StyledTooltip>
                    {description}
                </Typography>
              </TableCell>}
      </StyledTableRow>
  );
}
