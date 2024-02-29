import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
  Chip,
  Link,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../hooks/useResponsive';
import { StyledTableRow, StyledTooltip } from '../../theme/styles/default-styles'
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

CustomerSiteListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage:PropTypes.func,
  handleSiteView: PropTypes.func,
  handleSiteViewInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CustomerSiteListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleSiteView,
  handleSiteViewInNewPage,
}) {
  const { _id, customer, name, email, website, phoneNumbers, address, lat, long,
    primaryBillingContact, primaryTechnicalContact, isActive, createdAt } = row;
  const phone = phoneNumbers[0];
  const fax = phoneNumbers[0];
  const smScreen = useScreenSize('sm')
  const mdScreen = useScreenSize('md')
  
  return (
    <StyledTableRow hover selected={selected}>
      {/* <LinkTableCell param={customer?.name || ''} onClick={onViewRow} /> */}
      {smScreen && <TableCell>{customer?.name?`${customer?.name} `:''}{customer?.name}</TableCell>}
      <LinkTableCellWithIconTargetBlank onViewRow={()=> handleSiteView( customer?._id, _id ) } onClick={()=> handleSiteViewInNewPage( customer?._id, _id ) } param={name || ''} />
      {smScreen && mdScreen &&
        <TableCell>
            {address?.street?`${address?.street}, `:''}
            {address?.suburb?`${address?.suburb}, `:''}
            {address?.city?`${address?.city}, `:''}
            {address?.region?`${address?.region}, `:''}

            {lat && long && 
              <StyledTooltip
                title={`${lat}, ${long}`}
                placement="top"
                disableFocusListener
                tooltipcolor="#103996" 
                color="#103996"
                sx={{maxWidth:'170px'}}
              >
                  <Iconify icon="heroicons:map-pin" sx={{position:'relative', bottom:'-5px', cursor:'pointer'}} />
              </StyledTooltip>
            }
        </TableCell>
      }
      {smScreen && <TableCell>{phone?.countryCode?`+${phone?.countryCode} `:''}{phone?.number}</TableCell>}
      {smScreen && <TableCell>{email}</TableCell>}
      {smScreen && <TableCell>{primaryTechnicalContact?.firstName || ''} {primaryTechnicalContact?.lastName || ''}</TableCell>}
      {smScreen && <TableCell>{primaryBillingContact?.firstName || ''} {primaryBillingContact?.lastName || ''}</TableCell>}
      <TableCell align='center'><Switch checked={isActive} disabled size="small" /></TableCell>
      {mdScreen && <TableCell align='right'>{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
