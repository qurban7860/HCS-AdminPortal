import PropTypes from 'prop-types';
// import { useState, useEffect } from 'react';
// @mui
import {
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import LinkDialogTableCell from '../../../components/ListTableTools/LinkDialogTableCell';
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
  machineDrawings: PropTypes.bool,
  handleMachineDialog: PropTypes.func,
  handleCustomerDialog: PropTypes.func,
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
  machineDrawings,
  handleMachineDialog,
  handleCustomerDialog
}) {
  const {
    displayName,
    documentVersions,
    docType,
    referenceNumber,
    stockNumber,
    machine,
    productDrawings,
    customer,
    docCategory,
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
      {  smScreen && machineDrawings && <TableCell align="left">{stockNumber}</TableCell>}
      {  smScreen && machineDrawings && <TableCell align="left">{productDrawings?.map((m)=> m?.machine?.serialNo).join(', ')}</TableCell>}
      {  !customerPage && !machinePage && !machineDrawings && lgScreen && 
          <>
            <LinkDialogTableCell onClick={handleCustomerDialog} align='left' param={customer?.name}/>  
            <LinkDialogTableCell onClick={handleMachineDialog} align='left' param={machine?.serialNo}/>  
          </>
      }
      <TableCell align="right">{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
