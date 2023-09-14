import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  // Link,
  Switch,
  Stack,
  // Avatar,
  Button,
  // Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  // IconButton,
  // Typography,
  Chip
} from '@mui/material';
// components
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { fDate } from '../../utils/formatTime';
import CustomAvatar from '../../components/custom-avatar/CustomAvatar';
import LinkTableCell from '../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../hooks/useResponsive';

// ----------------------------------------------------------------------

RegionTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function RegionTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}) {
  const { name, countries, createdAt, isActive } = row;

  const [openConfirm, setOpenConfirm] = useState(false);

  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenConfirm = () => {
    setOpenConfirm(true);
  };

  const handleCloseConfirm = () => {
    setOpenConfirm(false);
  };

  // const handleOpenPopover = (event) => {
  // setOpenPopover(event.currentTarget);
  // };

  const handleClosePopover = () => {
    setOpenPopover(null);
  };
  const onDelete = () => {
    onDeleteRow();
    setOpenConfirm(false);
  };
  const smScreen = useScreenSize('sm')
  return (
    <>
      <TableRow hover selected={selected}>
        <Stack direction="row" alignItems="center">
          <CustomAvatar
            name={name}
            alt={name}
            sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }}
          />
          <LinkTableCell align="left" onClick={onViewRow} param={name} />
        </Stack>

       { smScreen && <TableCell align="left" sx={{ textTransform: 'capitalize', maxWidth:"500px" }} >
          {countries.map((obj, index) => <Chip key={index} label={obj.country_name} sx={{m:0.3}} />)}
        </TableCell> }
       
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
       
        <TableCell align="right" sx={{ textTransform: 'capitalize' }}>
          {fDate(createdAt)}
        </TableCell>
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
          <Button variant="contained" color="error" onClick={onDelete}>
            Delete
          </Button>
        }
      />
    </>
  );
}
