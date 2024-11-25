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
  hiddenColumns: PropTypes.object,
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
  handleCustomerDialog,
  hiddenColumns
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
      {  !hiddenColumns?.displayName && <LinkTableCell align="left" param={displayName} stringLength={45} onClick={onViewRow} />}
      {  !hiddenColumns?.referenceNumber && <TableCell align="left">{ referenceNumberString }</TableCell>}
      {  !hiddenColumns?.['docCategory.name'] && <TableCell align="left">{ docCategoryNameString }</TableCell>}
      {  !hiddenColumns?.['docType.name'] && <TableCell align="left">{ docTypeNameString }</TableCell>}
      {/* {  lgScreen && <TableCell align="center">{documentVersions[0]?.versionNo}</TableCell>} */}
      {  !hiddenColumns?.stockNumber && machineDrawings && <TableCell align="left">{stockNumber}</TableCell>}
      {  !hiddenColumns?.productDrawings && machineDrawings && <TableCell align="left">{productDrawings?.map((m)=> m?.machine?.serialNo).join(', ')}</TableCell>}
      {  !hiddenColumns?.['machine.serialNo'] && !customerPage && !machinePage && !machineDrawings && lgScreen && 
          <>
            {/* <LinkDialogTableCell onClick={handleCustomerDialog} align='left' param={customer?.name}/>   */}
            <LinkDialogTableCell onClick={handleMachineDialog} align='left' param={machine?.serialNo}/>  
          </>
      }
      {!hiddenColumns?.createdAt && <TableCell align="right">{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
