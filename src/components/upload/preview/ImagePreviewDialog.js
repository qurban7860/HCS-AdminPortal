import PropTypes from 'prop-types';
// @mui
import { Typography ,Dialog, DialogActions, Grid, Link, CardContent, CardMedia, Stack, Button, Avatar} from '@mui/material';
import Iconify from '../../iconify';
import Image from '../../image';

// ----------------------------------------------------------------------

ImagePreviewDialog.propTypes = {
  file: PropTypes.object,
  preview: PropTypes.bool,
  closePreview: PropTypes.func,

};

export default function ImagePreviewDialog({ file, preview ,closePreview }) {

  return (
    
                  <Dialog
                    maxWidth="md"
                    open={preview}
                    onClose={closePreview}
                    keepMounted
                    aria-describedby="alert-dialog-slide-description"
                    >
                    <Grid
                      container
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        bgcolor: 'primary.main',
                        color: 'primary.contrastText',
                        padding: '5px',
                        height: '50px',
                      }}
                    >
                      <Typography variant="h4" title={file.name} sx={{ px: 2 ,mr:4, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis"}}>
                        {file.name}
                      </Typography>{' '}
                      <DialogActions >
                        <Button onClick={closePreview} 
                          sx={{ 
                             top: 10,
                             right: 2,
                             zIndex: 9,
                             position: 'absolute',
                          }}
                          >
                          <Iconify sx={{color:"white"}} icon="mdi:close-box-outline" />
                        </Button>
                      </DialogActions>
                    </Grid>
                    {/* <CardContent
                      component={Stack}
                      display="block"
                      sx={{ position: 'relative', zIndex: '1' }}
                    >
                      <CardMedia
                        component="img" 
                        // component="video, audio, picture, iframe, or img" 
                        sx={{minWidth:"350px", minHeight:"350px"}} 
                        alt={file?.name}  
                        image={file.preview}
                      />
                      
                    </CardContent> */}
                    <Image
                        alt={file?.name}
                        src={file.preview}
                        sx={{minWidth:"350px", minHeight:"350px"}} 
                        
                      />
                      {/* <Avatar
                        alt={file?.name}
                        src={file.preview}
                        sx={{minWidth:"350px", minHeight:"350px"}} 
                      /> */}
                  </Dialog>
  );
}
