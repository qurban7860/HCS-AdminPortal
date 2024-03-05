import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIconTargetBlank from '../../components/ListTableTools/LinkTableCellWithIconTargetBlank';
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
  const { _id, customer, name, email, phoneNumbers, address, lat, long,
    primaryBillingContact, primaryTechnicalContact, isActive, createdAt } = row;
  const phone = phoneNumbers[0];
  const fax = phoneNumbers[0];
  
  return (
    <>
      {useScreenSize('lg') && (
        <StyledTableRow hover selected={selected}>
          <TableCell>{customer?.name}</TableCell>
          <LinkTableCellWithIconTargetBlank
            onViewRow={() => handleSiteView(customer?._id, _id)}
            onClick={() => handleSiteViewInNewPage(customer?._id, _id)}
            param={name || ''}
          />
          <TableCell>
            {address?.street ? `${address?.street}` : ''}
            {address?.suburb ? `, ${address?.suburb}` : ''}
            {address?.city ? `, ${address?.city}` : ''}
            {address?.country ? ` ${address?.country}` : ''}
  
            {lat && long && (
              <StyledTooltip
                title={`${lat}, ${long}`}
                placement="top"
                disableFocusListener
                tooltipcolor="#103996"
                color="#103996"
                sx={{ maxWidth: '170px' }}
              >
                <Iconify icon="heroicons:map-pin" sx={{ position: 'relative', bottom: '-5px', cursor: 'pointer' }} />
              </StyledTooltip>
            )}
          </TableCell>
          <TableCell>{phone?.countryCode ? `+${phone?.countryCode} ` : ''}{phone?.contactNumber}</TableCell>
          <TableCell>{email}</TableCell>
          <TableCell>{primaryTechnicalContact?.firstName || ''} {primaryTechnicalContact?.lastName || ''}</TableCell>
          <TableCell>{primaryBillingContact?.firstName || ''} {primaryBillingContact?.lastName || ''}</TableCell>
          <TableCell align='center'><Switch checked={isActive} disabled size="small" /></TableCell>
          <TableCell align='right'>{fDate(createdAt)}</TableCell>
        </StyledTableRow>
      )}
  
      {!useScreenSize('lg') && (
        <>
          <StyledTableRow hover selected={selected}>
            <TableCell><strong>Customer Name:</strong> {customer?.name}</TableCell>
          </StyledTableRow>
          
          <StyledTableRow hover selected={selected}>
            <LinkTableCellWithIconTargetBlank
              onViewRow={() => handleSiteView(customer?._id, _id)}
              onClick={() => handleSiteViewInNewPage(customer?._id, _id)}
              param={<><strong>Site Name:</strong> {name || ''}</>}
            />
          </StyledTableRow>
          <StyledTableRow hover selected={selected}>
            <TableCell>
              <strong>Address:</strong>
              {address?.street ? ` ${address?.street}` : ''}
              {address?.suburb ? `, ${address?.suburb}` : ''}
              {address?.city ? `, ${address?.city}` : ''}
              {address?.country ? `, ${address?.country}` : ''}
  
              {lat && long && (
                <StyledTooltip
                  title={`${lat}, ${long}`}
                  placement="top"
                  disableFocusListener
                  tooltipcolor="#103996"
                  color="#103996"
                  sx={{ maxWidth: '170px' }}
                >
                  <Iconify icon="heroicons:map-pin" sx={{ position: 'relative', bottom: '-5px', cursor: 'pointer' }} />
                </StyledTooltip>)}
              
            </TableCell>
          </StyledTableRow>
          <StyledTableRow hover selected={selected}>
            <TableCell><strong>Phone:</strong> {phone?.countryCode ? `+${phone?.countryCode} ` : ''}{phone?.contactNumber}</TableCell>
          </StyledTableRow>
          <StyledTableRow hover selected={selected}>
            <TableCell><strong>Email:</strong> {email}</TableCell>
          </StyledTableRow>
        </>
      )}
    </>
  );
  
  
}
