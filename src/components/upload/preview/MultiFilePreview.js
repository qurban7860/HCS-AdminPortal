import PropTypes from 'prop-types';
import { useState, memo } from 'react';
import { useSelector } from 'react-redux';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { useTheme } from '@mui/material/styles';
import { Button, ButtonGroup, Card, CardMedia, IconButton, Stack, Typography, TextField, Box, Autocomplete } from '@mui/material';
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
  files, 
  onRemove, 
  sx, 
  machine, 
  drawingPage 
}) {
  
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);

  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState([]);
  
  const [fileFound, setFileFound] = useState(null);
  const [verifiedAnchorEl, setVerifiedAnchorEl] = useState(null);

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

  const previewHandle = (file) => {
    const img = [{
          src:file?.preview,
          isLoaded:true
      }]

    setSelectedFile(img);
  };
  
  const FORMAT_IMG_VISIBBLE = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp', 'ico', 'jpe',];
        
  return (
    <AnimatePresence initial={false}>
      {files.map(( file , index ) => {
        if(file){
        const { key, name = '', size = 0, displayName, referenceNumber, versionNo, stockNumber, docCategory, docType } = fileData(file);
        const fileType = file?.type?.split('/').pop();
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
                  <CardMedia onClick={()=> FORMAT_IMG_VISIBBLE.some(format => fileType.match(format)) && previewHandle(file)}>
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
                          {FORMAT_IMG_VISIBBLE.some(format => fileType.match(format))  && <Button sx={{width:'50%', borderRadius:0}} onClick={()=>previewHandle(file)}><Iconify icon="carbon:view" /></Button>}
                          <Button sx={{width:FORMAT_IMG_VISIBBLE.some(format => fileType.match(format))?'50%':'100%', borderRadius:0}} color='error' onClick={() => onRemove(file)}><Iconify icon="radix-icons:cross-circled" /></Button>
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
              border:`solid 1px ${theme.palette.divider}`,
              ...sx,
            }}
          >

          <Stack direction="row" sx={{ width:"100%" }} >
            <FileThumbnail file={file} />
            <Box rowGap={1} columnGap={1} display="grid" sx={{ml:3, width:"100%" }}
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(3, 1fr)',
                xl: 'repeat(3, 1fr)',
              }} 
            >

              <Autocomplete 
                size='small' 
                value={ docCategory || null} 
                options={ activeDocumentCategories }
                isOptionEqualToValue={( option, value ) => option?._id === value?._id }
                getOptionLabel={(option) => `${option?.name || ''}`}
                onChange={(event, newValue) => onChangeDocCategory( index, event, newValue)}
                renderInput={(params) => <TextField {...params} label="Category" size='small' />}
              />

              <Autocomplete 
                size='small' 
                value={ docType || null } 
                options={ activeDocumentTypes.filter( dT =>  docCategory ? dT.docCategory?._id === docCategory?._id : dT )  }
                isOptionEqualToValue={( option, value ) => option?._id === value?._id }
                getOptionLabel={(option) => `${option?.name || ''}`}
                renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                onChange={(event, newValue) => onChangeDocType( index, event, newValue)}
                renderInput={(params) => <TextField {...params} label="Type" size='small' />}
              />

              <TextField label="Version No."   size='small' value={ versionNo }        onChange={(e)=> onChangeVersionNo( index, e.target.value)}        />
              <TextField label="Name"          size='small' value={ displayName } onChange={(e)=> onChangeDisplayName( index, e.target.value)}      />
              <TextField label="Reference No." size='small' value={ referenceNumber }  onChange={(e)=> onChangeReferenceNumber( index, e.target.value)}  />
              <TextField label="Stock No."     size='small' value={ stockNumber }      onChange={(e)=> onChangeStockNumber( index, e.target.value)}      />
            </Box>
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
          index={0}
          slides={selectedFile}
          open={selectedFile?.length>0}
          close={() => setSelectedFile(null)}
          disabledTotal
          disabledDownload
          disabledSlideshow
        />
    </AnimatePresence>
  );
}
export default memo(MultiFilePreview)