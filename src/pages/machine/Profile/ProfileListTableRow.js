import PropTypes from 'prop-types';
// @mui
import {
  TableRow,
  TableCell,
  Chip,
} from '@mui/material';
// utils
import { styled } from '@mui/material/styles';
import { fDate } from '../../../utils/formatTime';
// components
import LinkTableCell from '../../components/ListTableTools/LinkTableCell';
import { useScreenSize } from '../../../hooks/useResponsive';
import ViewFormField from '../../components/ViewForms/ViewFormField';

// ----------------------------------------------------------------------

ProfileListTableRow.propTypes = {
  row: PropTypes.object,
  selected: PropTypes.bool,
  onViewRow: PropTypes.func,
};
const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: 'white',
  },
  '&:nth-of-type(even)': {
    backgroundColor: '#f4f6f866',
  },
}));

export default function ProfileListTableRow({
  row,
  selected,
  onViewRow,
}) {
  const {
    defaultName,
    names,
    height,
    width,
    type,
    createdAt,
  } = row;

  const profilesString = names.join(', ');
  const smScreen = useScreenSize('sm')

  return (
      <StyledTableRow hover selected={selected}>
        <LinkTableCell align="left" param={defaultName} onClick={onViewRow} />
        { smScreen && 
          <TableCell sx={{maxWidth:"400px"}}>
          {names.map((value, index) =>
            typeof value === 'string'
              ? value.trim() !== '' && <Chip key={index} label={value} sx={{ m: 0.2 }} />
              : ''
          )}
          </TableCell>
        }
        { smScreen && <TableCell align="left">{type==="MANUFACTURER"?<Chip label={type} sx={{m:0.2}} color='secondary' />:<Chip label={type} sx={{m:0.2}}  />}</TableCell>}
        <TableCell align="left">{height}{height&&width?"X":""}{width}</TableCell>
        <TableCell align="right">{fDate(createdAt)}</TableCell>
  
      </StyledTableRow>

  );
}
