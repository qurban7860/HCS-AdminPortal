import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Container } from '@mui/material';
// utils
import { bgBlur } from '../../../utils/cssStyles';
// components
import Image from '../../../components/image';
import Lightbox from '../../../components/lightbox';
import FormLabel from '../../components/DocumentForms/FormLabel';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { getDocumentGallery, setDocumentGalleryVisibility } from '../../../redux/slices/document/document';
import { downloadFile } from '../../../redux/slices/document/documentFile';
import { useSnackbar } from '../../../components/snackbar';
import { FORMLABELS } from '../../../constants/default-constants';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
import { Cover } from '../../components/Defaults/Cover';
import { PATH_DOCUMENT } from '../../../routes/paths';
import { SkeletonGallery } from '../../../components/skeleton';

// ----------------------------------------------------------------------

DocumentGallery.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
};

export default function DocumentGallery({customerPage, machinePage}) {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  
  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { document, documentGallery, isLoading } = useSelector((state) => state.document);
  const [selectedImage, setSelectedImage] = useState(-1);
  

  useEffect(()=>{
    dispatch(getDocumentGallery(document?._id, customer?._id, machine?._id))
  },[dispatch, document, customer, machine])

  const imagesLightbox = documentGallery?.map((img) => ({
    src:`data:image/png;base64, ${img?.thumbnail}`,
    id:img?._id,
    downloadFilename:`${img?.name}.${img?.extension}`
  }));

  const handleOpenLightbox = (image) => {
    const imageIndex = imagesLightbox.findIndex((img) => img.id === image?._id);
    setSelectedImage(imageIndex);
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  return (
    <Container maxWidth={false} sx={{padding:`${!customerPage && !machinePage?"":"0px !important"}`}} >
      {!customerPage && !machinePage &&
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.DOCUMENTS} />
        </StyledCardContainer>
      }

      <Card sx={{p:2}}>
        <ViewFormEditDeleteButtons
            backLink={(customerPage || machinePage ) ? 
              ()=>{dispatch(setDocumentGalleryVisibility(false))}
            : () =>  navigate(PATH_DOCUMENT.document.list)}
        />
        <FormLabel content={`${customerPage? "Customer":`${machinePage?"Machine":"Document"}`} Gallery`} />
        <Box
          sx={{mt:2}}
          gap={2}
          display="grid"
          gridTemplateColumns={{
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(5, 1fr)',
          }}
        >
          {!isLoading ? documentGallery?.map((image) => (
            <GalleryItem
              key={image?._id}
              image={image}
              onOpenLightbox={() => handleOpenLightbox(image)}
            />
            )):(<SkeletonGallery  />)
          }
        </Box>

        <Lightbox
          index={selectedImage}
          slides={imagesLightbox}
          open={selectedImage >= 0}
          close={handleCloseLightbox}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

GalleryItem.propTypes = {
  onOpenLightbox: PropTypes.func,
  image: PropTypes.shape({
    displayName: PropTypes.string,
    thumbnail: PropTypes.string,
    path: PropTypes.string,
    docType: PropTypes.object,
    docCategory: PropTypes.object,
    machine: PropTypes.object,
    createdBy: PropTypes.object,
    updatedBy: PropTypes.object
  }),
};

function GalleryItem({ image, onOpenLightbox }) {
  const theme = useTheme();
  const { displayName, thumbnail, path, docType, docCategory, machine, createdBy, updatedBy } = image;

  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery" ratio="1/1" 
      src={`data:image/png;base64, ${thumbnail}`}
      onClick={onOpenLightbox} />

      <Stack
        spacing={2}
        direction="row"
        alignItems="center"
        sx={{
          ...bgBlur({
            color: theme.palette.grey[900],
          }),
          width: 1,
          left: 0,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
          p: theme.spacing(3, 1, 3, 3),
        }}
      >
        <Stack flexGrow={1} spacing={1}>
          <Typography variant="subtitle1">{displayName}</Typography>
          <Typography variant="body2" sx={{ opacity: 0.72 }}>{docType?.name}</Typography>
        </Stack>

        {/* <IconButton color="inherit">
          <Iconify icon="eva:more-vertical-fill" />
        </IconButton> */}
      </Stack>
    </Card>
  );
}
