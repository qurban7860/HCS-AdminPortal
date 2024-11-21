import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
// @mui
import { Switch, Stack, TableRow, TableCell, Chip } from '@mui/material';
// components
import Iconify from '../../../components/iconify';
import { fDate } from '../../../utils/formatTime';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';
import LinkTableCell from '../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import BadgeStatus from '../../../components/badge-status/BadgeStatus';
import { ICONS } from '../../../constants/icons/default-icons';
import IconButtonTooltip from '../../../components/Icons/IconButtonTooltip';
import { StyledTooltip } from '../../../theme/styles/default-styles';
import { getPortalRegistration, setRequestDialog } from '../../../redux/slices/customer/portalRegistration';
// ----------------------------------------------------------------------

SecurityUserTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  onSelectRow: PropTypes.func,
  onViewRow: PropTypes.func,
  hiddenColumns: PropTypes.object,
};

export default function SecurityUserTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
  hiddenColumns
}) {
  const { login, email, name, roles, phone, createdAt, contact, isActive, registrationRequest, isOnline } = row;
  const dispatch = useDispatch();
  const smScreen = useScreenSize('sm')
  const lgScreen = useScreenSize('lg')
  const handleRequestDialog = async ( ) =>{
    await dispatch(getPortalRegistration(registrationRequest?._id));
    await dispatch(setRequestDialog(true));
  }
  return (
      <TableRow hover selected={selected} >
          { !hiddenColumns?.name && <Stack direction="row" alignItems="center">
            <CustomAvatar
              name={name}
              alt={name}
              BadgeProps={{
                badgeContent: <BadgeStatus status={isOnline?"online":"offline"} />,
              }}
              sx={{ ml: 1, my: 0.5, width: '30px', height: '30px' }}
            />
            <LinkTableCell align="left" onClick={onViewRow} param={name} />
          </Stack>}
        { smScreen && !hiddenColumns?.login && <TableCell align="left">
          {login}
          {email?.trim() !== login?.trim() &&
              <StyledTooltip 
                placement="top" 
                disableFocusListener 
                title={ email } 
                tooltipcolor={ ICONS.EMAIL.color } 
                color={ ICONS.EMAIL.color }
              >
                <Iconify sx={{ ml: 0.5, height: 20, width: 20, mb: -0.5 }} icon={ICONS.EMAIL.icon} />
              </StyledTooltip>
          }
          </TableCell>}
        { smScreen && !hiddenColumns?.login && <TableCell align="left">{phone || ''}</TableCell>}
        { lgScreen && !hiddenColumns?.['roles.name.[]'] &&
          <TableCell align="left" sx={{ textTransform: 'capitalize' }}>
            {roles.map((obj, index) => (obj.roleType === 'SuperAdmin' ? <Chip key={index} label={obj.name} sx={{m:0.2}} color='secondary' /> : <Chip  key={index} label={obj.name} sx={{m:0.2}} />))}
          </TableCell>
        }
        { !hiddenColumns?.['contact.firstName'] &&<TableCell align="left">
          {contact?.firstName && <StyledTooltip
            placement="top" 
            title={contact?.formerEmployee ? ICONS.FORMEREMPLOYEE.heading:ICONS.NOTFORMEREMPLOYEE.heading} 
            disableFocusListener tooltipcolor={contact?.formerEmployee ? ICONS.FORMEREMPLOYEE.color:ICONS.NOTFORMEREMPLOYEE.color} 
            color={contact?.formerEmployee ? ICONS.FORMEREMPLOYEE.color:ICONS.NOTFORMEREMPLOYEE.color}
          >
            <Iconify icon={ICONS.FORMEREMPLOYEE.icon} sx={{mr:1, height: 20, width: 20 }}/>
          </StyledTooltip>}
            {`${contact?.firstName || ''} ${contact?.lastName || '' }`}
        </TableCell>}
        { !hiddenColumns?.isActive && <TableCell align="left" sx={{ display: "flex", alignItems: 'center'}}>
          <StyledTooltip
            placement="top" 
            title={ isActive ? ICONS.ACTIVE.heading : ICONS.INACTIVE.heading} 
            disableFocusListener tooltipcolor={isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color} 
            color={ isActive ? ICONS.ACTIVE.color : ICONS.INACTIVE.color}
          >
            <Iconify icon={ isActive ? ICONS.ACTIVE.icon : ICONS.INACTIVE.icon } sx={{mr:1, height: 20, width: 20 }}/>
          </StyledTooltip>
          { registrationRequest && 
            <IconButtonTooltip title='Portal Request' color='#388e3c' icon="mdi:user-details" onClick={handleRequestDialog} /> 
          }
        </TableCell>}
        {!hiddenColumns?.createdAt && <TableCell align="right">{fDate(createdAt)}</TableCell>}
      </TableRow>
  );
}