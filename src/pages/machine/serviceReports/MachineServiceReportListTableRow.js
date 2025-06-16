import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// @mui
import { TableCell } from '@mui/material';
// utils
import { useScreenSize } from '../../../hooks/useResponsive';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import LinkTableCellWithIconTargetBlank from '../../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import { StyledTableRow, StyledTooltip } from '../../../theme/styles/default-styles';
import Iconify from '../../../components/iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import { getMachineForDialog, setMachineDialog } from '../../../redux/slices/products/machine';
import { getCustomer, setCustomerDialog } from '../../../redux/slices/customer/customer';
import { getDialogSecurityUser, setSecurityUserDialog } from '../../../redux/slices/securityUser/securityUser';

// ----------------------------------------------------------------------

MachineServiceReportListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  reportsPage: PropTypes.bool,
  hiddenColumns: PropTypes.object,
};


export default function MachineServiceReportListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  reportsPage,
  hiddenColumns,
}) {

  const { serviceReportTemplate, serviceReportUID, status, currentApprovalStatus, customer, machine, serviceDate, isActive, createdBy } = row;

  const dispatch = useDispatch();
  const handleCustomerDialog = async (event, customerId) => {
    event.preventDefault();
    await dispatch(getCustomer(customerId));
    await dispatch(setCustomerDialog(true));
  };

  const handleMachineDialog = async (event, MachineID) => {
    event.preventDefault();
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true));
  };

  const handleUserDialog = async (event, UserID) => {
    event.preventDefault();
    await dispatch(getDialogSecurityUser(UserID));
    await dispatch(setSecurityUserDialog(true));
  };

  return (
    <StyledTableRow hover selected={selected} >
      {useScreenSize('lg') && !hiddenColumns?.checkboxes &&
        <TableCell align="left" padding="checkbox"  >
          <StyledTooltip
            placement="top"
            title={isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading}
            disableFocusListener tooltipcolor={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
            color={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
          >
            <Iconify icon={isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon} />
          </StyledTooltip>
        </TableCell>
      }
      {useScreenSize('lg') && !hiddenColumns?.serviceDate &&
        <TableCell>
          {fDate(serviceDate)}
        </TableCell>
      }
      {useScreenSize('lg') && !hiddenColumns?.["serviceReportTemplate.reportType"] &&
        <TableCell>
          {serviceReportTemplate?.reportType || ""}
        </TableCell>
      }
      {useScreenSize('lg') && !hiddenColumns?.serviceReportUID &&
        <LinkTableCellWithIconTargetBlank align="left" onClick={reportsPage ? openInNewPage : undefined} onViewRow={onViewRow} param={serviceReportUID} />
      }
      {useScreenSize('lg') && reportsPage && !hiddenColumns?.["machine.serialNo"] &&
        <LinkTableCell align="left"
          onClick={(event) => handleMachineDialog(event, machine?._id)}
          param={machine?.serialNo || ""}
        />
      }
      {useScreenSize('lg') && !hiddenColumns?.["customer.name"] &&
        <LinkTableCell align="left"
          onClick={(event) => handleCustomerDialog(event, customer?._id)}
          param={customer?.name || ""}
        />
      }
      {useScreenSize('lg') && !hiddenColumns?.["status.name"] &&
        <TableCell align="left">{`${currentApprovalStatus !== "PENDING" ? currentApprovalStatus : status?.name || ''} `}</TableCell>
      }
      {useScreenSize('lg') && !hiddenColumns?.["createdBy.name"] &&
        <LinkTableCell align="left"
          onClick={(event) => handleUserDialog(event, createdBy?._id || '')}
          param={createdBy.name || ""}
        />
      }
    </StyledTableRow>

  );
}
