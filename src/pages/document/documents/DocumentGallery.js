import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Card, IconButton, Typography, Stack, Dialog, DialogTitle, Divider, DialogContent, Grid } from '@mui/material';
// utils
import { fDate } from '../../../utils/formatTime';
import { bgBlur } from '../../../utils/cssStyles';
// components
import Image from '../../../components/image';
import Iconify from '../../../components/iconify';
import Lightbox from '../../../components/lightbox';

// redux
import {
  setDocumentGalleryDialog,
} from '../../../redux/slices/document/document';
import DialogLink from '../../components/Dialog/DialogLink';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';

// ----------------------------------------------------------------------

export default function DocumentGallery() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { documentHistory, documentGalleryDialog, isLoading} = useSelector((state) => state.document);
  const handleDialog = ()=>{ dispatch(setDocumentGalleryDialog(false)) }
  
  return (
    <Dialog
        fullWidth
        maxWidth="lg"
        open={documentGalleryDialog}
        onClose={handleDialog}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogTitle variant='h3' sx={{pb:1, pt:2}}>Documents Gallery ({documentHistory?.displayName})</DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent dividers sx={{px:3,py:3, background:theme.palette.grey[100]}}>
            <Grid container columnGap={2} rowGap={2}>
              {documentHistory?.documentVersions?.map((doc) => (
                doc?.files?.map((file)=>(
                  <Grid item key={file?._id} >
                      <Thumbnail file={file} currentDocument={documentHistory} hideDelete />
                  </Grid>
                ))
              ))}
            </Grid>
        </DialogContent>
    <DialogLink onClose={handleDialog}/>
  </Dialog>
  );
}

