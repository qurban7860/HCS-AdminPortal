import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import {
  Link,
  Switch,
  Stack,
  Avatar,
  Button,
  Checkbox,
  TableRow,
  MenuItem,
  TableCell,
  IconButton,
  Typography,
} from '@mui/material';
// components
import Label from '../../components/label';
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------

UserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
};

export default function UserTableRow({ row, selected, onEditRow, onViewRow, onSelectRow, onDeleteRow }) {
  const { email, name, roles, phone, status, image , createdAt ,isActive} = row;
  const names = roles.map((a) => a.name);
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
  const onDelete = () => {
    onDeleteRow()
    setOpenConfirm(false);
  };

  return (
    <>
      <TableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}

        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link noWrap color="inherit" variant="subtitle2" onClick={onViewRow} sx={{ cursor: 'pointer',display:"flex",justifyContent:"center",alignItems:"center" }} >
              <Avatar alt={name} src={image} sx={{mr:1}}/>
              <Typography variant="subtitle2" noWrap>
                {`${name}`}
              </Typography>
            </Link>
          </Stack>  
        </TableCell>

        <TableCell align="left">{email}</TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
          {phone || ""}
        </TableCell>

        <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
        {roles.map((obj) => obj.name).join(', ')}
        {/* { roles ? Object.values(roles?.name)?.join(", ") : ""} */}
        </TableCell>
        <TableCell align="center"> <Switch checked = { isActive } disabled size="small" /> </TableCell> 
        <TableCell align="right" sx={{ textTransform: 'capitalize' }}>
        {fDate(createdAt)}
        </TableCell>

        {/* <TableCell align="center">
          <Iconify
            icon={isVerified ? 'eva:checkmark-circle-fill' : 'eva:clock-outline'}
            sx={{
              width: 20,
              height: 20,
              color: 'success.main',
              ...(!isVerified && { color: 'warning.main' }),
            }}
          />
        </TableCell> */}

         {/* <TableCell align="left">
          <Label
            variant="soft"
            color={(status === 'banned' && 'error') || 'success'}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>  */}

        {/* <TableCell align="right">
          <IconButton color={openPopover ? 'inherit' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell> */}
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
