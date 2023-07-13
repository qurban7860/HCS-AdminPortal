import PropTypes from 'prop-types';
import {
  Typography,
  Dialog,
  DialogActions,
  Grid,
  Link,
  IconButton,
  Box,
  CardContent,
  CardMedia,
  Button,
} from '@mui/material';
import { styled, alpha, useTheme } from '@mui/material/styles';
import Iconify from '../../../components/iconify';
import { CloseButton } from '../Defaults/CloseButton';
// import Image from '../../../components/image';

export default function ImagePreviewDialog({
  onPreview,
  handleClosePreview,
  handleDownloadImage,
  imageName,
  imageExtension,
  file,
  imageData,
}) {
  const theme = useTheme();
  return (
    <Dialog
      maxWidth="md"
      open={onPreview}
      onClose={handleClosePreview}
      keepMounted
      aria-describedby="alert-dialog-slide-description"
    >
      <Grid
        container
        item
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          bgcolor: 'primary.main',
          color: 'primary.contrastText',
          height: '50px',
          padding: '5px',
        }}
      >
        <Typography
          variant="h4"
          title={`${imageName}.${imageExtension}`}
          sx={{ px: 1, mr: 5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
        >
          {`${imageName}.${imageExtension}`}
        </Typography>{' '}
        <DialogActions>
          <Button
            onClick={handleClosePreview}
            sx={{
              top: 15,
              right: 0,
              zIndex: 9,
              height: '60',
              position: 'absolute',
            }}
          >
            <CloseButton onClick={handleClosePreview} />
          </Button>
        </DialogActions>
      </Grid>
      <IconButton
        size="small"
        onClick={() => handleDownloadImage(imageName, imageExtension)}
        sx={{
          top: 70,
          right: 15,
          zIndex: 9,
          height: '60',
          position: 'absolute',
          color: alpha(theme.palette.common.white, 0.8),
          bgcolor: alpha(theme.palette.grey[900], 0.72),
          '&:hover': {
            bgcolor: alpha(theme.palette.grey[900], 0.48),
          },
        }}
      >
        <Iconify icon="line-md:download-loop" width={18} />
      </IconButton>
      <CardContent>
        <CardMedia
          component="img"
          sx={{ minWidth: '350px', minHeight: '350px' }}
          alt={file?.name}
          image={`data:image/png;base64, ${imageData}`}
        />
      </CardContent>
      {/* <Box
        component="img"
        sx={{ minWidth: '350px', minHeight: '350px' }}
        alt={file?.name}
        src={`data:image/png;base64, ${imageData}`}
        loading="lazy"
      /> */}
    </Dialog>
  );
}

ImagePreviewDialog.propTypes = {
  onPreview: PropTypes.bool,
  handleClosePreview: PropTypes.func,
  handleDownloadImage: PropTypes.func,
  imageName: PropTypes.string,
  imageExtension: PropTypes.string,
  file: PropTypes.object,
  imageData: PropTypes.string,
};
