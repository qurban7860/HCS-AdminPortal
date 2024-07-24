import PropTypes from 'prop-types';
import { useState, memo, useLayoutEffect, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { useTheme } from '@mui/material/styles';
import { Button, ButtonGroup, Card, CardMedia, IconButton, Stack, Typography, TextField, Box, Autocomplete, Grid } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import { bgBlur } from '../../../utils/cssStyles';
//
import Iconify from '../../iconify';
import { varFade } from '../../animate';
import FileThumbnail, { fileData } from '../../file-thumbnail';
import Lightbox from '../../lightbox/Lightbox';
import AlreadyExistMenuPopover from '../AlreadyExistMenuPopover';

// ----------------------------------------------------------------------

MultiFilePreview.propTypes = {
  sx: PropTypes.object,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onPreview: PropTypes.func,
  thumbnail: PropTypes.bool,
  rows: PropTypes.bool,
  machine:PropTypes.string,
  drawingPage: PropTypes.bool,
  onChangeDocType: PropTypes.func,
  onChangeDocCategory: PropTypes.func,
  onChangeVersionNo: PropTypes.func,
  onChangeDisplayName: PropTypes.func,
  onChangeReferenceNumber: PropTypes.func,
  onChangeStockNumber: PropTypes.func,
  onLoadImage: PropTypes.func,
};

function MultiFilePreview({ 
  thumbnail, 
  rows,
  onChangeDocType,
  onChangeDocCategory,
  onChangeVersionNo,
  onChangeDisplayName,
  onChangeReferenceNumber,
  onChangeStockNumber,
  onLoadImage,
  files, 
  onRemove, 
  sx, 
  machine, 
  drawingPage 
}) {
  
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const dispatch = useDispatch()
  const theme = useTheme();
  const [slides, setSlides] = useState([]);
  const [selectedImage, setSelectedImage] = useState(-1);
  const [fileFound, setFileFound] = useState(null);
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);

  useEffect(() => {
    setSlides(files);
  }, [files]);

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
    if(!image.isLoaded && onLoadImage){
      await onLoadImage(image?._id, index)
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const FORMAT_IMG_VISIBBLE = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp', 'ico', 'jpe',];
        
  return (
    <AnimatePresence initial={false}>
      {files.map(( file , index ) => {
        if(file){
        const { key, name = '', size = 0, displayName, referenceNumber, versionNo, stockNumber, docCategory, docType } = fileData(file);
        const fileType = file?.type?.split('/').pop().toLowerCase();
        const isNotFormatFile = typeof file === 'string';
        
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
                      height:180,
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
                          {FORMAT_IMG_VISIBBLE.some(format => fileType?.match(format))  && <Button sx={{width:'50%', borderRadius:0}} onClick={()=>handleOpenLightbox(index)}><Iconify icon="carbon:view" /></Button>}
                          <Button sx={{width:FORMAT_IMG_VISIBBLE.some(format => fileType?.match(format))?'50%':'100%', borderRadius:0}} color='error' onClick={() => onRemove(file)}><Iconify icon="radix-icons:cross-circled" /></Button>
                      </ButtonGroup>
                      
                      <Stack
                        padding={1}
                        sx={{
                        ...bgBlur({
                            color: theme.palette.grey[900],
                            // opacity:1
                        }),
                        // background:theme.palette.error,
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
                        
                            {/* {file?.found && drawingPage &&
                              <Iconify
                                onClick={(event)=> handleExtensionsPopoverOpen(event,file)}
                                icon="iconamoon:question-mark-circle-bold"
                                sx={{ cursor: 'pointer', verticalAlign:'bottom', float:'right' }}
                              />
                            } */}
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
        if(rows)
        {
          return (
          <Stack
            key={key || index}
            component={m.div}
            {...varFade().inUp}
            spacing={2}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              my: 1.5,
              px: 1.5,
              py: 1.25,
              borderRadius: 0.75,
              border:`solid 1px ${ ( docType && displayName?.trim() ) ? theme.palette.divider : theme.palette.error.main}`,
              ...sx,
            }}
          >

          <Stack direction="row" sx={{ width:"100%" }} >
            <FileThumbnail file={file} rows />
            <Stack spacing={1} sx={{ml:3, width:"100%" }} >

              {/* {onChangeDocCategory && <Autocomplete 
                size='small' 
                value={ docCategory || null} 
                options={ activeDocumentCategories }
                isOptionEqualToValue={( option, value ) => option?._id === value?._id }
                getOptionLabel={(option) => `${option?.name || ''}`}
                onChange={(event, newValue) => onChangeDocCategory( index, event, newValue)}
                renderInput={(params) => <TextField {...params} label="Category" size='small' />}
              />} */}

              <Stack direction={{ sm: 'block', md: 'row' }} spacing={1} >
                <Grid item md={4} sm={12} >
                  {onChangeDocType && <Autocomplete 
                    size='small' 
                    value={ docType || null } 
                    options={ activeDocumentTypes.filter( dT =>  docCategory ? dT.docCategory?._id === docCategory?._id : dT )  }
                    isOptionEqualToValue={( option, value ) => option?._id === value?._id }
                    getOptionLabel={(option) => `${option?.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                    onChange={(event, newValue) => onChangeDocType( index, event, newValue)}
                    renderInput={(params) => <TextField {...params} label="Type*" size='small' error={!docType }  helperText={!docType  && 'Document Type is required!'} />}
                  />}
                </Grid>

                <Grid item md={8} sm={12} >
                  {onChangeDisplayName && <TextField 
                    fullWidth 
                    label="Document Name*" 
                    size='small' 
                    value={ displayName } sx={{mt: { md:0, sm: 1} }} 
                    InputProps={{
                      inputProps: {
                          maxLength: 500
                        },
                    }}
                    onChange={(e)=> onChangeDisplayName( index, e.target.value)} 
                    error={!displayName?.trim()} 
                    helperText={!displayName?.trim() && 'Document Name is required!'} 
                  />}
                </Grid>

              </Stack>
              <Box rowGap={1} columnGap={1} display="grid" 
                gridTemplateColumns={{
                  sm: 'repeat(1, 1fr)',
                  md: 'repeat(3, 1fr)',
                }} 
              >

              {onChangeReferenceNumber && <TextField 
                label="Reference No." 
                size='small' 
                value={ referenceNumber } 
                InputProps={{
                  inputProps: {
                      maxLength: 20
                    },
                }}
                onChange={(e)=> onChangeReferenceNumber( index, e.target.value)} 
              />}

              {onChangeStockNumber && <TextField 
                label="Stock No." 
                size='small' 
                value={ stockNumber } 
                InputProps={{
                  inputProps: {
                      maxLength: 20
                    },
                }}
                onChange={(e)=> onChangeStockNumber( index, e.target.value)}  
              />}

              {onChangeVersionNo && <TextField 
                label="Version No." 
                size='small' 
                value={ versionNo } 
                InputProps={{
                  inputProps: {
                      maxLength: 8
                    },
                }}
                // error={ versionNo > 1000 }
                // helperText={ versionNo > 1000 && 'Version Number Version number must be less than or equal to 1000'}
                onChange={(e)=> onChangeVersionNo( index, e.target.value)}  
              />}

              </Box>
            </Stack>
          </Stack>
            {onRemove && (
              <IconButton edge="end" size="small" onClick={() => onRemove(file)} sx={{ ml: 5 }}> 
                <Iconify icon="eva:close-fill" />
              </IconButton>
            )}
          </Stack>
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
    </AnimatePresence>
  );
}
export default memo(MultiFilePreview)