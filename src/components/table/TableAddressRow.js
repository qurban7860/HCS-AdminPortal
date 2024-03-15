import PropTypes from 'prop-types';
// @mui
import { TableRow, TableCell } from '@mui/material';
import Iconify from '../iconify';
import { StyledTooltip } from '../../theme/styles/default-styles'

// ----------------------------------------------------------------------

TableAddressRow.propTypes = {
    address: PropTypes.object,
    lat: PropTypes.string,
    long: PropTypes.string,
};

export default function TableAddressRow({ address, lat, long, ...other }) {
<a href="https://www.google.com/maps?q=<LATITUDE>,<LONGITUDE>" target="_blank" rel="noopener noreferrer">Open in Google Maps</a>

const openInNewPage = (id) => {
    const url = `https://www.google.com/maps?q=${lat},${long}`
    window.open(url, '_blank');
};

return (
    <TableCell {...other}>
        { address?.street?.trim() ? `${address?.street || '' }` : '' }
        { address?.street?.trim() && address?.suburb?.trim() ? `, ${address?.suburb || '' }` : ` ${address?.suburb || '' }` }
        { ( address?.street?.trim() || address?.suburb?.trim() ) && address?.city?.trim() ? `, ${address?.city || '' }` : ` ${address?.city || '' }`  }
        { ( address?.street?.trim() || address?.suburb?.trim() || address?.city?.trim() ) && address?.country?.trim() ? `, ${address?.country || '' }` :  ` ${address?.country || '' }` }
        {lat && long && (
            <StyledTooltip
                title={`${lat || '' }, ${long || '' }`}
                placement="top"
                disableFocusListener
                tooltipcolor="#103996"
                color="#103996"
                sx={{ maxWidth: '170px' }}
            >
                <Iconify onClick={ openInNewPage } icon="heroicons:map-pin" sx={{ position: 'relative', bottom: '-5px', cursor: 'pointer' }} />
            </StyledTooltip>
        )}
    </TableCell>
);
}