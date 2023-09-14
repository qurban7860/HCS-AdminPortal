import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Switch,
  Button,
  TableRow,
  MenuItem,
  TableCell,
} from '@mui/material';
// utils
// import { fData, fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify/Iconify';
import MenuPopover from '../../../components/menu-popover/MenuPopover';
import ConfirmDialog from '../../../components/confirm-dialog';
// import Label from '../../../components/label';
import { fDate } from '../../../utils/formatTime';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
// import { useSelector } from '../../../redux/store';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

ParameterListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function ParameterListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, category, isActive, createdAt } = row;

  const smScreen = useScreenSize('sm')

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
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <LinkTableCell onClick={onViewRow} align="left" param={name} />
        { smScreen && <TableCell>{category?.name || ''}</TableCell>}
        {/* <TableCell>category</TableCell> */}
        <TableCell align="center">
          {' '}
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
