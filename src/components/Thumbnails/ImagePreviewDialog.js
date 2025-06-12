import PropTypes from 'prop-types';
import {
  Dialog,
  CardMedia,
  DialogTitle,
  Divider,
  DialogContent,
} from '@mui/material';
import DialogLink from '../Dialog/DialogLink';

export default function ImagePreviewDialog({
  onPreview,
  handleClosePreview,
  handleDownloadImage,
  imageName,
  imageExtension,
  file,
  imageData,
}) {
  return (
    <Dialog
      maxWidth="md"
      open={onPreview}
      onClose={handleClosePreview}
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <DialogTitle variant='h3' sx={{ pb: 1, pt: 2 }}>{`${imageName}.${imageExtension}`}</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{ padding: 0 }}>
        <CardMedia component="img" alt={file?.name} image={`data:image/png;base64, ${imageData}`} />
      </DialogContent>
      <DialogLink icon='mdi:download' content="Download" onClick={() => handleDownloadImage(imageName, imageExtension)} onClose={handleClosePreview} />
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
