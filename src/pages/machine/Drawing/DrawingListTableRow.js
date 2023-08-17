import PropTypes from 'prop-types';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
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
import { styled, alpha, useTheme } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import Label from '../../../components/label';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { setCustomerDocumentViewFormVisibility } from '../../../redux/slices/document/customerDocument';
import { setMachineDocumentFormVisibility } from '../../../redux/slices/document/machineDocument';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

DrawingListTableRow.propTypes = {
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
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function DrawingListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {
  const {
    document,
    documentType,
    documentCategory,
    isActive,
    createdAt,
  } = row;
  const dispatch = useDispatch();

  const smScreen = useScreenSize('sm')

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

  const handleViewCustomerFormVisibility = () => {
    dispatch(setCustomerDocumentViewFormVisibility(false));
  };
  const handleViewMachineFormVisibility = () => {
    dispatch(setCustomerDocumentViewFormVisibility(false));
  };

  return (
    <>
      <StyledTableRow hover selected={selected}>
        {/* <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell> */}
        <LinkTableCell align="left" param={document?.displayName} onClick={onViewRow} />
        { smScreen && <TableCell align="left">{documentCategory?.name}</TableCell>}
        { smScreen && <TableCell align="left">{documentType?.name}</TableCell>}
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
  
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
