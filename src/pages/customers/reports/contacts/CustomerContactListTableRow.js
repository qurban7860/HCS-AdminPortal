import PropTypes from 'prop-types';
// @mui
import { Switch, TableCell, Chip, Grid } from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTableRow } from '../../../../theme/styles/default-styles';
import LinkTableCellWithIconTargetBlank from '../../../../components/ListTableTools/LinkTableCellWithIconTargetBlank';

// ----------------------------------------------------------------------

CustomerContactListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  openInNewPage: PropTypes.func,
  handleContactView: PropTypes.func,
  handleContactViewInNewPage: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
};

export default function CustomerContactListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  openInNewPage,
  handleContactView,
  handleContactViewInNewPage,
}) {
  const { _id, customer, firstName, lastName, phone, email, address, isActive, createdAt } =
    row;

  return (
    <>
      {/* Render rows with column names in bold for small screens */}
      {!useScreenSize('sm') && (
        <>
          <StyledTableRow hover selected={selected} style={{ display: 'block' }} >
            <LinkTableCellWithIconTargetBlank style={{ width: '100%', display: 'inline-block' }}
              onViewRow={() => handleContactView(customer?._id, _id)}
              onClick={() => handleContactViewInNewPage(customer?._id, _id)}
              param={`${firstName || ''} ${lastName || ''}`}
            />
            {customer?.name && <TableCell style={{ width: '100%', display: 'inline-block' }} >{customer?.name || '' } </TableCell> }
            {phone && <TableCell style={{ width: '100%', display: 'inline-block' }} >{phone}</TableCell> }
            {email && <TableCell style={{ width: '100%', display: 'inline-block' }} >{email}</TableCell> }
          </StyledTableRow>
        </>
      )}

      {useScreenSize('sm') && (
        <StyledTableRow hover selected={selected}>
          <TableCell> {customer?.name}</TableCell>
          <LinkTableCellWithIconTargetBlank
            onViewRow={() => handleContactView(customer?._id, _id)}
            onClick={() => handleContactViewInNewPage(customer?._id, _id)}
            param={<> {`${firstName || ''} ${lastName || ''}`}</>}
          />
          <TableCell>{phone}</TableCell>
          <TableCell>{email}</TableCell>
          <TableCell> {address?.country}</TableCell>
          <TableCell align="center">
            <Switch checked={isActive} disabled size="small" />
          </TableCell>
          <TableCell align="right"> {fDate(createdAt)}</TableCell>
        </StyledTableRow>
      )}
    </>
  );
}
