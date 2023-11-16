import { useState } from 'react';
import PropTypes from 'prop-types';
import { Grid, Typography } from '@mui/material';
// styles
import { useTheme, alpha } from '@mui/material/styles';
import { ThumbnailUploadButton } from '../../../theme/styles/document-styles';
// components
import Iconify from '../../../components/iconify/Iconify';
// constants
import { BUTTONS } from '../../../constants/default-constants';

ThumbnailDocButton.propTypes = {
  onClick: PropTypes.func,
};

export default function ThumbnailDocButton({ onClick }) {
  const [hovered, setHovered] = useState(false);
  const theme = useTheme();
  return (
    <ThumbnailUploadButton
      variant="contained"
      color="inherit"
      onClick={onClick}
      onMouseEnter={(e) => {
        e.target.style.backgroundColor = alpha(theme.palette.grey[900], 0.04);
        setHovered(true);
      }}
      onMouseLeave={(e) => {
        e.target.style.backgroundColor = alpha(theme.palette.grey[600], 0.2);
        setHovered(false);
      }}
    >
      <Grid item sx={{ display: 'block' }}>
        {hovered && (
          <Typography variant="overline" color={theme.palette.grey[600]} sx={{ fontSize: 12 }}>
            {BUTTONS.THUMBNAIL_UPLOAD}
          </Typography>
        )}
      </Grid>
      <Grid item sx={{ display: 'flex' }}>
        <Iconify icon="mdi:plus" width={48} color={theme.palette.grey[600]} />
        &nbsp;
      </Grid>
    </ThumbnailUploadButton>
  );
}
