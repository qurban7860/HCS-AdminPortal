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
  const regEx = /^[^2]*/;
  
  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { document, documentGallery, isLoading } = useSelector((state) => state.document);
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);
  
  useEffect(()=>{
    if(customerPage){
      dispatch(getDocumentGallery(null, customer?._id, null))
    }
    
    if(machinePage){
      dispatch(getDocumentGallery(null, null, machine?._id))
    }
    
    if(!machinePage && !customerPage){
      dispatch(getDocumentGallery(document?._id, null, null))
    }
    
  },[dispatch, document, customer, machine, customerPage, machinePage])

  useEffect(()=>{
    setSlides(documentGallery?.map((img) => ({
      src:`data:image/png;base64, ${img?.thumbnail}`,
      downloadFilename:`${img?.name}.${img?.extension}`,
      name:img?.name,
      docCat:img?.docCategory?.name,
      docType:img?.docType?.name,
      machine:img?.machine?.serialNo,
      customer:img?.customer?.name,
      isLoaded:false,
      id:img?._id,
    })));
  },[documentGallery])

  const handleOpenLightbox = (index) => {
    console.log("index:::",index)
    setSelectedImage(index);
    handleViewLightbox(index);
  };

  const handleViewLightbox = async (index) => {
    const image = slides[index];
    if(!image?.isLoaded){
      try {
        const response = await dispatch(downloadFile(image?.id));
        if (regEx.test(response.status)) {
          // Update the image property in the imagesLightbox array
          const updatedSlides = [
            ...slides.slice(0, index), // copies slides before the updated slide
            {
              ...slides[index],
              src: `data:image/png;base64, ${response.data}`,
              isLoaded: true,
            },
            ...slides.slice(index + 1), // copies slides after the updated slide
          ];
  
          // Update the state with the new array
          setSlides(updatedSlides);
          setSelectedImage(index);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    }
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
          {!isLoading ? slides?.map((slide, index) => (
            <GalleryItem
              key={slide?.id}
              image={slide}
              onOpenLightbox={() => handleOpenLightbox(index)}
            />
            )):(<SkeletonGallery  />)
          }
        </Box>

        <Lightbox
          index={selectedImage}
          slides={slides}
          open={selectedImage >= 0}
          close={handleCloseLightbox}
          onGetCurrentIndex={(index) => handleViewLightbox(index)}
        />
      </Card>
    </Container>
  );
}

// ----------------------------------------------------------------------

GalleryItem.propTypes = {
  onOpenLightbox: PropTypes.func,
  image: PropTypes.shape({
    src: PropTypes.string,
    name: PropTypes.string,
    docCat: PropTypes.string,
    docType: PropTypes.string,
    machine: PropTypes.string,
    customer: PropTypes.string,
  }),
};

function GalleryItem({ image, onOpenLightbox }) {
  const theme = useTheme();
  const { src, name, docCat, docType, machine, customer } = image;
  return (
    <Card sx={{ cursor: 'pointer', position: 'relative' }}>
      <Image alt="gallery" ratio="1/1" 
      src={src}
      onClick={onOpenLightbox} />
      <Stack
        padding={2}
        sx={{
          ...bgBlur({
            color: theme.palette.grey[900],
          }),
          width: 1,
          left: 0,
          bottom: 0,
          position: 'absolute',
          color: 'common.white',
        }}
      >
        <Typography variant="subtitle2">{name}</Typography>
        <Typography variant="body2" sx={{ opacity: 0.72, marginTop:'0px'}}>{docCat}</Typography>
        {/* <Typography variant="body2" sx={{ opacity: 0.72, marginTop:'0px'}}>{docType}</Typography> */}
      </Stack>
    </Card>
  );
}
