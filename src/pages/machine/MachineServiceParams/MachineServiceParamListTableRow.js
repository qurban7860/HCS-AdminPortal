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
  Chip
} from '@mui/material';
// utils
import { styled } from '@mui/system';
import { fDate } from '../../../utils/formatTime';
import { fCurrency } from '../../../utils/formatNumber';
// components
import Iconify from '../../../components/iconify';
import MenuPopover from '../../../components/menu-popover';
import ConfirmDialog from '../../../components/confirm-dialog';
import Label from '../../../components/label';

import { useSelector } from '../../../redux/store';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';

// ----------------------------------------------------------------------

MachineServiceParamListTableRow.propTypes = {
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

export default function MachineServiceParamListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
}) {

  const { name, printName, description, helpHint, linkToUserManual, isRequired, inputType, unitType, minValidation, maxValidation, isActive, createdAt } = row;

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

 const smScreen = useScreenSize('sm')

  return (
    <>
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" onClick={onViewRow} param={name} />
        <TableCell align="left">{printName}</TableCell>
        {/* <TableCell align="left">{helpHint}</TableCell> */}
        {/* <TableCell align="left">{linkToUserManual}</TableCell> */}
        {smScreen && <TableCell align="center">
          {' '}
          <Switch checked={isRequired} disabled size="small" />{' '}
        </TableCell>}
        {smScreen && <TableCell align="left">{inputType}</TableCell>}
        {/* <TableCell align="left">{unitType}</TableCell> */}
        {/* <TableCell align="left">{minValidation}</TableCell> */}
        {/* <TableCell align="left">{maxValidation}</TableCell> */}
        <TableCell align="center">
          {' '}
          <Switch checked={isActive} disabled size="small" />{' '}
        </TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
      </StyledTableRow>

    </>
  );
}
