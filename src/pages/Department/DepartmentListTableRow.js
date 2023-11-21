import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Switch, Button, TableRow, MenuItem, TableCell } from '@mui/material';
// components
import LinkTableCell from '../components/ListTableTools/LinkTableCell';
import MenuPopover from '../../components/menu-popover/MenuPopover';
import ConfirmDialog from '../../components/confirm-dialog';
// utils
import Iconify from '../../components/iconify/Iconify';
import { fDate } from '../../utils/formatTime';
// import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

DepartmentListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function DepartmentListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { departmentName, isActive, createdAt } = row;
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={departmentName} />
        <TableCell align="center">
          <Switch checked={isActive} disabled sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>


      <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      />

    </>
  );
}
