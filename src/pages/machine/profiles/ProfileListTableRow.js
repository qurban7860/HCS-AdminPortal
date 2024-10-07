import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
  Chip,
  Switch,
} from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import { StyledTableRow } from '../../../theme/styles/default-styles'

// ----------------------------------------------------------------------

ProfileListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ProfileListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    defaultName,
    names,
    web,
    flange,
    thicknessStart,
    thicknessEnd,
    type,
    createdAt,
    isActive,
  } = row;

  const smScreen = useScreenSize('sm')

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={defaultName} onClick={onViewRow} />
        { smScreen && 
          <TableCell sx={{maxWidth:"400px"}}>
          {names.map((value, index) =>
            typeof value === 'string'
              ? value.trim() !== '' && <Chip key={index} label={value} sx={{ m: 0.2 }} />
              : ''
          )}
          </TableCell>
        }
        <TableCell align="left">{type==="MANUFACTURER"?<Chip label={type} sx={{m:0.2}} color='secondary' />:<Chip label={type} sx={{m:0.2}}  />}</TableCell>
        <TableCell align="left">{`${web || '___'} x ${flange || '___' } `}</TableCell>
        <TableCell align="left">{`${thicknessStart || '___' }-${thicknessEnd || '___' }`}</TableCell>
        <TableCell align="left"><Switch checked={isActive} disabled size="small"/></TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
  
      </StyledTableRow>
  );
}
