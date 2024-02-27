import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
  Chip,
} from '@mui/material';
// utils
import { fDate } from '../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../../components/ListTableTools/LinkTableCellWithIcon';
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../hooks/useResponsive';
import { StyledTableRow } from '../../theme/styles/default-styles'

// ----------------------------------------------------------------------

CustomerSiteListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
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
}) {
  const { name, email, website, phoneNumbers, address, isActive, createdAt } = row;
  const {street, suburb, city, region, postcode } = address;
  const phone = phoneNumbers[0];
  const fax = phoneNumbers[0];
  const smScreen = useScreenSize('sm')
  const mdScreen = useScreenSize('md')
  
  return (
    <StyledTableRow hover selected={selected}>
      <TableCell>{name}</TableCell>
      {smScreen && <TableCell>{email}</TableCell>}
      {smScreen && <TableCell>{website}</TableCell>}
      {smScreen && <TableCell>{phone?.countryCode?`+${phone?.countryCode} `:''}{phone?.number}</TableCell>}
      {smScreen && mdScreen &&
        <TableCell>
            {street?`${street}, `:''}
            {suburb?`${suburb}, `:''}
            {city?`${city}, `:''}
            {region?`${region}, `:''}
        </TableCell>
      }
      <TableCell align='center'><Switch checked={isActive} disabled size="small" /></TableCell>
      {mdScreen && <TableCell align='right'>{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
