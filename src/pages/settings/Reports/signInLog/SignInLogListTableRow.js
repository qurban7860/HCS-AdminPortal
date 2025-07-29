import PropTypes from 'prop-types';
import { TableRow, TableCell } from '@mui/material';
import { styled } from '@mui/system';
import { useDispatch } from '../../../../redux/store';
import { fDateTime } from '../../../../utils/formatTime';
import { useScreenSize } from '../../../../hooks/useResponsive';
import { getCustomer, setCustomerDialog } from '../../../../redux/slices/customer/customer';
import { getDialogSecurityUser, setSecurityUserDialog } from '../../../../redux/slices/securityUser/securityUser';
import LinkTableCellWithIconTargetBlank from '../../../../components/ListTableTools/LinkTableCellWithIconTargetBlank';

// ----------------------------------------------------------------------

SignInLogListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  status: PropTypes.object
};

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function SignInLogListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  status
}) {
  const { loginTime, user, loginIP, loginSource, requestedLogin, logoutTime, loggedOutBy, statusCode } = row;

  const dispatch = useDispatch();

  const handleSecurityUserDialog = () => {
    dispatch(getDialogSecurityUser(user?._id))
    dispatch(setSecurityUserDialog(true))
  }

  const handleCustomerDialog = () => {
    dispatch(getCustomer(user?.customer?._id))
    dispatch(setCustomerDialog(true))
  }

  return (
    <StyledTableRow hover selected={selected}>
      {useScreenSize('lg') && <TableCell align="left"> {requestedLogin || ''} </TableCell>}
      {user?._id ?
        <LinkTableCellWithIconTargetBlank
          onViewRow={handleSecurityUserDialog}
          // onClick={ !user?._id ? undefined : () => window.open(PATH_SETTING.security.users.view( user?._id ), '_blank') }
          param={user?.name || ""}
          align='left'
        />
        : <TableCell align="left" />
      }
      {user?.customer?._id ?
        <LinkTableCellWithIconTargetBlank
          onViewRow={handleCustomerDialog}
          // onClick={ !user?.customer?._id ? undefined : () => window.open(PATH_CRM.customers.view( user?.customer?._id ), '_blank') }
          param={user?.customer?.name || ""}
          align='left'
        />
        : <TableCell align="left" />
      }
      {/* { ( user?.customer?._id && user?.contact?._id )?
          <LinkTableCellWithIconTargetBlank
            onViewRow={handleContactDialog}
            // onClick={ !user?.contact?._id ? undefined : () => window.open(PATH_CRM.customers.contacts.view( user?.customer?._id, user?.contact?._id ), '_blank') }
            param={`${user?.contact?.firstName || ''} ${user?.contact?.lastName || ''}`}
            align='left'
          />
        : <TableCell align="left" />
        } */}
      {useScreenSize('lg') && <TableCell align="left"> {loginIP} </TableCell>}
      <TableCell align="left">{loginSource}</TableCell>
      <TableCell align="left"> {fDateTime(loginTime)} </TableCell>
      <TableCell align="left">{fDateTime(logoutTime)}</TableCell>
      <TableCell align="left">{loggedOutBy}</TableCell>
      {useScreenSize('sm') && <TableCell align="left" sx={{ color: statusCode === 200 ? "green" : "red" }}>
        {status?.value || ''}{status?.notes || ''}
      </TableCell>}
    </StyledTableRow>
  );
}
