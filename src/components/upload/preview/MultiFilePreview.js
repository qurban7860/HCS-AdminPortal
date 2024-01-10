import PropTypes from 'prop-types';
import { useState, memo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
// @mui
import { useTheme, alpha } from '@mui/material/styles';
import { Button, ButtonGroup, Card, CardMedia, IconButton, Stack, Typography } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
import { bgBlur } from '../../../utils/cssStyles';
//
import Iconify from '../../iconify';
import { varFade } from '../../animate';
import FileThumbnail, { fileData } from '../../file-thumbnail';
import ImagePreviewDialog from './ImagePreviewDialog'
import Image from '../../image';
import Lightbox from '../../lightbox/Lightbox';

// ----------------------------------------------------------------------

MultiFilePreview.propTypes = {
  sx: PropTypes.object,
  files: PropTypes.array,
  onRemove: PropTypes.func,
  onPreview: PropTypes.func,
  thumbnail: PropTypes.bool,
};

function MultiFilePreview({ thumbnail, files, onRemove, sx }) {
  
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState([]);

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
  
  const FORMAT_IMG_VISIBBLE = ['jpg', 'jpeg', 'gif', 'bmp', 'png', 'svg', 'webp', 'ico', 'jpe'];

  return (
    <AnimatePresence initial={false}>
      {files.map((file) => {
        const { key, name = '', size = 0 } = fileData(file);
        const fileType = file?.type?.split('/').pop();
        const isNotFormatFile = typeof file === 'string';

        if (thumbnail) {
          return (
            <Card key={key} sx={{
                    cursor: 'pointer',
                    position: 'relative',
                    display: 'flex',  // Make the card a flex container
                    flexDirection: 'column',  // Stack children vertically
                    alignItems: 'center',  // Center items horizontally
                    justifyContent: 'center',  // Center items vertically
                    '&:hover .button-group': {
                        opacity: 1,
                    },
                    minHeight:190,
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
                  </Stack>
            </Card>
          );
        }

        return (
          <Stack
            key={key}
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