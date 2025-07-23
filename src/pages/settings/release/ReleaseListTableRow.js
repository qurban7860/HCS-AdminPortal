import PropTypes from 'prop-types';
import { TableCell, Switch } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { releaseStatusOptions } from '../../../utils/constants';

// ----------------------------------------------------------------------

ReleaseListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};

export default function ReleaseListTableRow({ row, selected, onViewRow }) {
  const { name, releaseNo, project, status, releaseDate, createdAt } = row;
  const statusOption = releaseStatusOptions.find((opt) => opt.value === status);
  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" onClick={onViewRow} param={releaseNo} />
      <LinkTableCell align="left" onClick={onViewRow} param={name} />
      <TableCell align="left"> {project?.name} </TableCell>

      <TableCell align="left">
        <StyledTooltip title={status} placement="top" tooltipcolor={statusOption?.color} color={statusOption?.color} disableFocusListener>
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            {statusOption?.icon && <Iconify icon={statusOption.icon} sx={{ color: statusOption.color, mr: 1, verticalAlign: 'middle' }} width={20} />}
          </span>
        </StyledTooltip>
      </TableCell>

      <TableCell align="left"> {fDate(releaseDate)} </TableCell>
      <TableCell align="right"> {fDate(createdAt)} </TableCell>
    </StyledTableRow>
  );
}
