import PropTypes from 'prop-types';
// @mui
import {
  Switch,
  TableCell,
  Chip,
} from '@mui/material';
// utils
import { fDate } from '../../../../utils/formatTime';
// components
import LinkTableCellWithIcon from '../../../../components/ListTableTools/LinkTableCellWithIcon';
import LinkTableCell from '../../../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../../hooks/useResponsive';
import { StyledTableRow } from '../../../../theme/styles/default-styles'


// ----------------------------------------------------------------------

CustomerListTableRow.propTypes = {
  row: PropTypes.object,
  style: PropTypes.object,
  selected: PropTypes.bool,
  onEditRow: PropTypes.func,
  onViewRow: PropTypes.func,
  onViewGroupCustomer: PropTypes.func,
  onSelectRow: PropTypes.func,
  onDeleteRow: PropTypes.func,
  isArchived: PropTypes.bool,
  hiddenColumns: PropTypes.object,
};


export default function CustomerListTableRow({
  row,
  style,
  selected,
  onSelectRow,
  onDeleteRow,
  onEditRow,
  onViewRow,
  onViewGroupCustomer,
  isArchived,
  hiddenColumns
}) {
  const { clientCode, name, tradingName, groupCustomer, mainSite, isActive, createdAt, verifications, type } = row;
  const address = [];
  
  if (mainSite?.address?.city) {
    address.push(mainSite?.address?.city);
  }
  
  if (mainSite?.address?.country) {
    address.push(mainSite?.address?.country);
  }

  const smScreen = useScreenSize('sm')

  return (
    <StyledTableRow hover selected={selected}>
      <LinkTableCellWithIcon align="left" onClick={ onViewRow } 
        param={name} isVerified={verifications?.length > 0} main={type?.toLowerCase() === 'sp'}
      />
      {!hiddenColumns?.clientCode && <LinkTableCell align="left" onClick={onViewRow} param={clientCode} />}
      { smScreen && !hiddenColumns?.tradingName && <TableCell sx={{maxWidth:"400px"}}>
        {tradingName.map((value, index) =>
          typeof value === 'string'
            ? value.trim() !== '' && <Chip key={index} label={value} sx={{ m: 0.2 }} />
            : ''
        )}
      </TableCell>}
      
      {!hiddenColumns?.['groupCustomer.name'] && <LinkTableCell align="left" onClick={onViewGroupCustomer} param={groupCustomer?.name} />}
      {/* {!hiddenColumns?.customerGroup && <TableCell align="center">{groupCustomer?.name || ''}</TableCell>} */}
      { smScreen && !hiddenColumns?.address && <TableCell>
        {Object.values(address ?? {}).reverse()
          .map((value) => (typeof value === 'string' ? value.trim() : ''))
          .filter((value) => value !== '')
          .join(', ')}
      </TableCell>}
      {!hiddenColumns?.isActive && <TableCell align="center"><Switch checked={isActive} disabled size="small" /></TableCell>}
      {!hiddenColumns?.createdAt && <TableCell>{fDate(createdAt)}</TableCell>}
    </StyledTableRow>
  );
}
