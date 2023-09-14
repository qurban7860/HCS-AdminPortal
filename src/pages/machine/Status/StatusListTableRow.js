import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { Switch, Button, TableRow, MenuItem, TableCell } from '@mui/material';
// components
import Iconify from '../../../components/iconify/Iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import ConfirmDialog from '../../../components/confirm-dialog';
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

StatusListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function StatusListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const smScreen = useScreenSize('sm')

  const { name, slug, isActive, createdAt } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // const handleOpenPopover = (event) => {
  //   setOpenPopover(event.currentTarget);
  // };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <LinkTableCell onClick={onViewRow} align="left" param={name} />
        { smScreen &&<TableCell align="left" >
          {slug}
        </TableCell>}
        <TableCell align="center">
          <Switch checked={isActive} disabled size="small" sx={{ my: -1 }} />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </TableRow>
      <MenuPopover
        open={openPopover}
        onClose={handleClosePopover}
        arrow="right-top"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleOpenConfirm();
            handleClosePopover();
          }}
          sx={{ color: 'error.main' }}
        >
          <Iconify icon="eva:trash-2-outline" />
          Delete
        </MenuItem>

        <MenuItem
          onClick={() => {
            onEditRow();
            handleClosePopover();
          }}
        >
          <Iconify icon="eva:edit-fill" />
          Edit
        </MenuItem>
      </MenuPopover>

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
