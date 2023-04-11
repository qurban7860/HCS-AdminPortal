import PropTypes from 'prop-types';
import { useState } from 'react';
import { sentenceCase } from 'change-case';
// @mui
import {
  Switch,
  Stack,
  Button,
  TableRow,
  Checkbox,
  MenuItem,
  TableCell,
  IconButton,
  Link,
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../utils/formatTime';
import { fCurrency } from '../../utils/formatNumber';
// components
import Iconify from '../../components/iconify';
import MenuPopover from '../../components/menu-popover';
import ConfirmDialog from '../../components/confirm-dialog';
import Label from '../../components/label';

import { useSelector } from '../../redux/store';


// ----------------------------------------------------------------------

CustomerListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: "white",
  },
  '&:nth-of-type(even)': {
    backgroundColor: "#f4f6f866",
  },
}));

export default function CustomerListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const { name, tradingName, mainSite, isDisabled, type, createdAt } = row;

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
    <>
      <StyledTableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        {/* <Iconify icon="octicon:package-dependents-16" sx={{ color: 'text.disabled' }} /> */}
        <TableCell align="right">{type==='SP' ? <Iconify icon="octicon:star-24" sx={{ color: 'text.disabled' }} />  : ""}</TableCell>
        <TableCell>
          <Stack direction="row" alignItems="center" spacing={2}>
            <Link noWrap color="inherit" variant="subtitle2" onClick={onViewRow} sx={{ cursor: 'pointer' }} > {name}</Link>
          </Stack>
        </TableCell>
        <TableCell>{tradingName}</TableCell>
        <TableCell>{mainSite?.address?.city}{mainSite?.address?.country ? `, ${mainSite?.address?.country}` : ''}</TableCell>
        <TableCell align="left">
          <Label variant="soft" color={(isDisabled === true && 'error') || 'success'} sx={{ textTransform: 'capitalize' }} >
            {isDisabled === false ? 'Yes' : 'No'}
            </Label>
        </TableCell> 
        <TableCell>{fDate(createdAt)}</TableCell>
        {/* <TableCell align="center">
          <IconButton color={openPopover ? 'primary' : 'default'} onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>   */}
      </StyledTableRow> 

      {/* <MenuPopover
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
      </MenuPopover> */}

      {/* <ConfirmDialog
        open={openConfirm}
        onClose={handleCloseConfirm}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={onDeleteRow}>
            Delete
          </Button>
        }
      /> */}
    </>
  );
}
