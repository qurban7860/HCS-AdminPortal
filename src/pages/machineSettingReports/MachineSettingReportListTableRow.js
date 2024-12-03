import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// @mui
import { TableRow, TableCell } from '@mui/material';
import { green } from '@mui/material/colors';
import { createTheme } from '@mui/material/styles';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
// import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { useScreenSize } from '../../hooks/useResponsive';
import LinkDialogTableCell from '../../components/ListTableTools/LinkDialogTableCell';

// ----------------------------------------------------------------------

MachineSettingReportListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  handleCustomerDialog:PropTypes.func,
  isArchived: PropTypes.bool,
  hiddenColumns: PropTypes.object,
};

export default function MachineSettingReportListTableRow({
  row,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleCustomerDialog,
  isArchived,
  hiddenColumns
}) {

  const {
    serialNo,
    machineModel,
    customer,
    techParamas,
  } = row;

  const theme = createTheme({
    palette: {
      success: green,
    },
  });
  const dispatch = useDispatch();

  const handleMachineDialog = async ( event, MachineID ) => {
    event.preventDefault(); 
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true)); 
  };

  return (
    <TableRow hover selected={selected}>
     {/* <LinkTableCellWithIconTargetBlank align="left" isVerified={verifications?.length > 0} /> */}
        <LinkTableCell align="left" onClick={(event) => handleMachineDialog(event, row.machineId)} param={serialNo || ''}> {serialNo || ''} </LinkTableCell>
      {/* { useScreenSize('lg') && !hiddenColumns?.name && <TableCell>{name || ''}</TableCell>} */}
      {  useScreenSize('sm') && !hiddenColumns['machineModel.name'] && <TableCell>{ machineModel?.name || ''}</TableCell>}
      {  useScreenSize('sm') && !hiddenColumns['customer.name'] &&
        <LinkDialogTableCell onClick={handleCustomerDialog} align='center' param={customer?.name}/>  
      }
       {useScreenSize('lg') && !hiddenColumns.HLCSoftwareVersion && (
        <TableCell align="left">
          {techParamas?.HLCSoftwareVersion || ''}
        </TableCell>
      )}
      {useScreenSize('lg') && !hiddenColumns.PLCSoftwareVersion && (
        <TableCell align="left">
           {techParamas?.PLCSWVersion || ''}
        </TableCell>
      )}
    </TableRow>
  );
} 

