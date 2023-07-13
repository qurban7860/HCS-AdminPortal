import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import { Switch, TableRow, TableCell } from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../components/ListTableTools/LinkTableCellWithIcon';

// ----------------------------------------------------------------------

MachineListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function MachineListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    verifications,
    serialNo,
    name,
    parentMachine,
    machineModel,
    customer,
    instalationSite,
    status,
    isActive,
    createdAt,
  } = row;
  const userId = localStorage.getItem('userId');

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleOpenPopover = (event) => {
    setOpenPopover(event.currentTarget);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <TableRow hover selected={selected}>
      <LinkTableCellWithIcon
        align="left"
        onClick={onViewRow}
        param={serialNo}
        isVerified={verifications?.length > 0}
      />
      <TableCell>{name || ''}</TableCell>
      <TableCell>{machineModel?.name || ''}</TableCell>
      <TableCell sx={{ color: status?.slug === 'transferred' ? 'red' : 'inherit' }}>
        {status?.name || ''}
      </TableCell>
      <TableCell>{customer?.name || ''}</TableCell>
      <TableCell>{instalationSite?.name || ''}</TableCell>
      <TableCell align="center">
        <Switch checked={isActive} disabled size="small" />
      </TableCell>
      <TableCell>{fDate(createdAt)}</TableCell>
    </TableRow>
  );
}
