import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
  IconButton,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
// ----------------------------------------------------------------------

DocumentListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawings: PropTypes.bool
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function DocumentListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  customerPage,
  machinePage,
  machineDrawings
}) {
  const {
    displayName,
    documentVersions,
    docType,
    referenceNumber,
    stockNumber,
    machine,
    customer,
    docCategory,
    customerAccess,
    isActive,
    createdAt,
  } = row;

  const lgScreen = useScreenSize('lg')
  const smScreen = useScreenSize('sm')

  return (
    <StyledTableRow hover selected={selected}>
      {  smScreen && <TableCell align="left">{docCategory?.name}</TableCell>}
      {  smScreen && <TableCell align="left">{docType?.name}</TableCell>}
      {  smScreen && <TableCell align="left">{referenceNumber}</TableCell>}
      <LinkTableCell align="left" param={displayName} onClick={onViewRow} />
      {  lgScreen && <TableCell align="center">{documentVersions[0]?.versionNo}</TableCell>}
      {  !customerPage && !machinePage && !machineDrawings && lgScreen && <TableCell align="left">{customer?.name}</TableCell>}
      {  machineDrawings && smScreen && <TableCell align="left">{stockNumber}</TableCell>}
      {  !customerPage && !machinePage && lgScreen && <TableCell align="left">{machine?.serialNo}</TableCell>}
      {  lgScreen && <TableCell align="center">
        <Switch checked={customerAccess} disabled size="small" />{' '}
      </TableCell>}
      <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>
      <TableCell align="right">{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
