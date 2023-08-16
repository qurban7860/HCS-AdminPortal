import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
// @mui
import {
  Switch,
  TableRow,
  TableCell,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useWidth } from '../../../hooks/useResponsive';

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
    machine,
    customer,
    docCategory,
    customerAccess,
    isActive,
    createdAt,
  } = row;

  const width = useWidth();

  return (
    <StyledTableRow hover selected={selected}>
      
      <LinkTableCell align="left" param={displayName} onClick={onViewRow} />
      { !customerPage && !machinePage && !machineDrawings &&  (<>
      { ( width === 'lg' || width === 'xl' ) && <TableCell align="left">{customer?.name}</TableCell>}
      { ( width === 'lg' || width === 'xl' ) && <TableCell align="left">{machine?.serialNo}</TableCell>}
      </>)}
      { ( width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell align="left">{docCategory?.name}</TableCell>}
      { ( width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell align="left">{docType?.name}</TableCell>}
      { ( width === 'sm' || width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell align="center">{documentVersions[0]?.versionNo}</TableCell>}
      { ( width === 'sm' || width === 'md' || width === 'lg' || width === 'xl' ) && <TableCell align="center">
        {' '}
        <Switch checked={customerAccess} disabled size="small" />{' '}
      </TableCell>}
      <TableCell align="center">
        {' '}
        <Switch checked={isActive} disabled size="small" />{' '}
      </TableCell>
      <TableCell align="right">{fDate(createdAt)}</TableCell>
     
    </StyledTableRow>
  );
}
