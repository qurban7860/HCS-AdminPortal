import PropTypes from 'prop-types';
// @mui
import {
  TableCell,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';
import { useScreenSize } from '../../hooks/useResponsive';
import { StyledTableRow } from '../../theme/styles/default-styles'
import useLimitString from '../../hooks/useLimitString';

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
    // documentVersions,
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
  const referenceNumberString = useLimitString( referenceNumber )
  const docCategoryNameString = useLimitString( docCategory?.name )
  const docTypeNameString = useLimitString( docType?.name )

  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCell align="left" param={displayName} stringLength={45} onClick={onViewRow} />
      {  smScreen && <TableCell align="left">{ referenceNumberString }</TableCell>}
      {  smScreen && <TableCell align="left">{ docCategoryNameString }</TableCell>}
      {  smScreen && <TableCell align="left">{ docTypeNameString }</TableCell>}
      {/* {  lgScreen && <TableCell align="center">{documentVersions[0]?.versionNo}</TableCell>} */}
      {  smScreen && machineDrawings && <TableCell align="left">{stockNumber}</TableCell>}
      {  smScreen && machineDrawings && <TableCell align="left">{productDrawings?.map((m)=> m?.machine?.serialNo).join(', ')}</TableCell>}
      {  !customerPage && !machinePage && !machineDrawings && lgScreen && 
          <>
            {/* <LinkDialogTableCell onClick={handleCustomerDialog} align='left' param={customer?.name}/>   */}
            <LinkDialogTableCell onClick={handleMachineDialog} align='left' param={machine?.serialNo}/>  
          </>
      }
      <TableCell align="right">{fDate(createdAt)}</TableCell>
    </StyledTableRow>
  );
}
