import { useState } from 'react';
import PropTypes from 'prop-types';
import { Card, CardMedia, Grid, Stack, Typography } from '@mui/material';
// styles
import { useTheme, alpha } from '@mui/material/styles';
import { ThumbnailUploadButton } from '../../../theme/styles/document-styles';
// components
import Iconify from '../../../components/iconify/Iconify';
// constants
import { BUTTONS } from '../../../constants/default-constants';
import { bgBlur } from '../../../utils/cssStyles';
import IconTooltip from '../Icons/IconTooltip';

ThumbnailDocButton.propTypes = {
  onClick: PropTypes.func,
};

export default function ThumbnailDocButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  return (
    <Card 
        sx={{
            cursor: 'pointer',
            position: 'relative',
            display: 'flex',  // Make the card a flex container
            flexDirection: 'column',  // Stack children vertically
            alignItems: 'center',  // Center items horizontally
            justifyContent: 'center',  // Center items vertically
            '&:hover .button-group': {
                opacity: 1,
            },
            background:theme.palette.grey[hovered?100:400],
            
          }}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
    >

        <Iconify icon="mdi:plus" color={theme.palette.grey[hovered?900:600]} width={50} />
        <Typography variant="subtitle2" color={theme.palette.grey[hovered?900:600]}>Add / Upload File</Typography>
    </Card>
  );
}
