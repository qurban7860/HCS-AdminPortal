import PropTypes from 'prop-types';
import {
  Typography,
  Dialog,
  DialogActions,
  Grid,
  IconButton,
  CardContent,
  CardMedia,
  Button,
  DialogTitle,
  Divider,
  DialogContent,
} from '@mui/material';
import {alpha, useTheme } from '@mui/material/styles';
import Iconify from '../iconify';
import { CloseButton } from '../Defaults/CloseButton';
import DialogLink from '../Dialog/DialogLink';
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
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogTitle variant='h3' sx={{pb:1, pt:2}}>{`${imageName}.${imageExtension}`}</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent dividers sx={{padding:0}}>
          <CardMedia component="img" alt={file?.name} image={`data:image/png;base64, ${imageData}`}/>
        </DialogContent>
      <DialogLink icon='mdi:download' content="Download" onClick={() => handleDownloadImage(imageName, imageExtension)} onClose={handleClosePreview}/>
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
