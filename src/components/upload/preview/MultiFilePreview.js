import PropTypes from 'prop-types';
import { useState, memo, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { useTheme } from '@mui/material/styles';
import { Button, ButtonGroup, Card, CardMedia, IconButton, Stack, Typography, Dialog, DialogTitle, Divider } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import { bgBlur } from '../../../utils/cssStyles';
//
import Iconify from '../../iconify';
import { varFade } from '../../animate';
import FileThumbnail, { fileData } from '../../file-thumbnail';
import Lightbox from '../../lightbox/Lightbox';
import AlreadyExistMenuPopover from '../AlreadyExistMenuPopover';
import SkeletonPDF from '../../skeleton/SkeletonPDF';

// ----------------------------------------------------------------------

MultiFilePreview.propTypes = {
  sx: PropTypes.object,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onPreview: PropTypes.func,
  thumbnail: PropTypes.bool,
  machine:PropTypes.string,
  drawingPage: PropTypes.bool,
  onLoadImage: PropTypes.func,
  onLoadPDF: PropTypes.func,
  onDownload: PropTypes.func,
};

function MultiFilePreview({ 
  thumbnail,
  onLoadImage,
  onLoadPDF,
  onDownload,
  files, 
  onRemove, 
  sx, 
  machine, 
  drawingPage 
}) {

  const theme = useTheme();
  const [slides, setSlides] = useState([]);
  const [selectedImage, setSelectedImage] = useState(-1);
  const [fileFound, setFileFound] = useState(null);
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);
  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  useEffect(() => {      
    const Images = files?.filter( ( file => ( file?.type || file?.fileType ) && ( file.type?.startsWith( "image" ) || file.fileType?.startsWith( "image" ) ) ) )
    setSlides( Images );
  }, [ files ]);

  const handleExtensionsPopoverOpen = (event, file) => {
      setVerifiedAnchorEl(event.currentTarget);
      const data = file?.found;
      data.machine = machine?._id || null;
      setFileFound(data);
  };

  const handleExtensionsPopoverClose = () => {
    setVerifiedAnchorEl(null);
    setFileFound(null);
  };

  if (!files?.length) {
    return null;
  }
  
  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];
    if(!image?.isLoaded && image?._id  && onLoadImage){
      await onLoadImage(image?._id, index)
    }
  };

  const handleOpenPDF = async (pdfFile,fileName) => {
    if(pdfFile?._id){
      onLoadPDF(pdfFile,fileName)
    } else {
      setPDFName(pdfFile?.name || fileName );
      setPDFViewerDialog(true);
      setPDF(pdfFile?.src);
    }
  };
  
  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const FORMAT_IMG_VISIBBLE = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp', 'ico', 'jpe','pdf'];
        
  return (
    <AnimatePresence initial={false}>
      {files?.map(( file , index ) => {
        if(file){
        const { key, name = '', size = 0 } = fileData(file);
        const fileType = file?.type?.split('/').pop().toLowerCase();
        const isNotFormatFile = typeof file === 'string';
        const fileName = name ;
        if (thumbnail) {
          return (
              <Card key={key || index} sx={{
                      cursor: 'pointer',
                      position: 'relative',
                      display: 'flex',  // Make the card a flex container
                      flexDirection: 'column',  // Stack children vertically
                      alignItems: 'center',  // Center items horizontally
                      justifyContent: 'center',  // Center items vertically
                      '&:hover .button-group': {
                          opacity: 1,
                      },
                      width:'100%',
                      height:150,
                      borderRadius:'10px',
                      my:'0px !important',
                    }}
                >
                  <CardMedia onClick={()=> FORMAT_IMG_VISIBBLE.some(format => fileType?.match(format?.toLowerCase())) && handleOpenLightbox(index)}>
                    <FileThumbnail imageView file={file} sx={{ position: 'absolute' }} imgSx={{ position: 'absolute' }}/>
                  </CardMedia>
                  <ButtonGroup
                          className="button-group"
                          variant="contained"
                          aria-label="outlined primary button group"
                          sx={{
                              position: 'absolute',
                              top:0,
                              opacity: 0,
                              transition: 'opacity 0.3s ease-in-out',
                              width:'100%'
                          }}
                      >       
                          {FORMAT_IMG_VISIBBLE.some(format => fileType?.match(format))  && <Button sx={{width:'50%', borderRadius:0}} onClick={()=> fileType==='pdf' ? handleOpenPDF( file,fileName ) :handleOpenLightbox(index)}><Iconify sx={{ width: '25px'}} icon="carbon:view" /></Button>}
                          { file?.uploaded && onDownload && <Button sx={{width:'50%', borderRadius:0}} onClick={ ()=>onDownload( file ) }><Iconify sx={{ width: '25px'}} icon="solar:download-square-linear" /></Button>}
                          <Button sx={{width: FORMAT_IMG_VISIBBLE.some(format => fileType?.match(format)) || ( file?.uploaded && onDownload ) ? '50%' : '100%', borderRadius:0}} color='error' onClick={() => onRemove(file)}><Iconify sx={{ width: '25px'}} icon="radix-icons:cross-circled" /></Button>
                      </ButtonGroup>
                      
                      <Stack
                        padding={1}
                        sx={{
                        ...bgBlur({
                            color: theme.palette.grey[900],
                        }),
                        width: 1,
                        left: 0,
                        bottom: 0,
                        position: 'absolute',
                        color: 'common.white',
                        textAlign:'center'
                        }}
                    >
                        <Typography variant="body2">
                            {name.length > 14 ? name?.substring(0, 14) : name}
                            {name?.length > 14 ? '...' : null}
                      </Typography>
                      {file?.found && drawingPage &&
                        <AlreadyExistMenuPopover
                          key={file?.found}
                          open={verifiedAnchorEl}
                          onClose={handleExtensionsPopoverClose}
                          fileFound={fileFound}
                        />
                      }
                    </Stack>
                    {file?.found && drawingPage &&
                      <Button
                      onClick={(event)=> handleExtensionsPopoverOpen(event,file)}
                      variant='contained' size='small' color='error' 
                      endIcon={<Iconify icon="solar:question-circle-outline"/>}
                      >Already Exists</Button>
                    }
              </Card>
          );
        }
        return (
          <Stack
            key={key || index}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            alignItems="center"
            sx={{
              my: 1,
              px: 1,
              py: 0.75,
              borderRadius: 0.75,
              border:`solid 1px ${theme.palette.divider}`,
              ...sx,
            }}
          >
            <FileThumbnail file={file} />

            <Stack flexGrow={1} sx={{ minWidth: 0 }}>
              <Typography variant="subtitle2" noWrap>
                {isNotFormatFile ? file : name}
              </Typography>

              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                {isNotFormatFile ? '' : fData(size)}
              </Typography>
            </Stack>

            {onRemove && (
              <IconButton edge="end" size="small" onClick={() => onRemove(file)}>
                <Iconify icon="eva:close-fill" />
              </IconButton>
            )}
          </Stack>
        );
      }
      return null;
      })}
      <Lightbox
          index={selectedImage}
          slides={slides}
          open={selectedImage>=0}
          close={handleCloseLightbox}
          onGetCurrentIndex={(index) => handleOpenLightbox(index)}
          disabledTotal
          disabledDownload
          disabledSlideshow
      />
      {PDFViewerDialog && (
        <Dialog fullScreen open={PDFViewerDialog} onClose={()=> setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
              PDF View
                <Button variant='outlined' onClick={()=> setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
            {pdf?(
                <iframe title={PDFName} src={pdf} style={{paddingBottom:10}} width='100%' height='842px'/>
              ):(
                <SkeletonPDF />
              )}
        </Dialog>
      )}
    </AnimatePresence>
  );
}
export default memo(MultiFilePreview)