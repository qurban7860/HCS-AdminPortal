import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Card, Typography, Stack, Container, TablePagination, Grid } from '@mui/material';
// utils
import { bgBlur } from '../../utils/cssStyles';
// components
import Image from '../../components/image';
import Lightbox from '../../components/lightbox';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { getDocumentGallery } from '../../redux/slices/document/document';
import { downloadFile } from '../../redux/slices/document/documentFile';
import { FORMLABELS } from '../../constants/default-constants';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { Cover } from '../../components/Defaults/Cover';
import { PATH_CRM, PATH_MACHINE } from '../../routes/paths';
import EmptyContent from '../../components/empty-content/EmptyContent';
import { DocumentGalleryItem } from '../../components/gallery/DocumentGalleryItem';

// ----------------------------------------------------------------------

DocumentGallery.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
};

export default function DocumentGallery({ customerPage, machinePage }) {

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const regEx = /^[^2]*/;

  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { document, documentGallery, isLoading } = useSelector((state) => state.document);
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(15);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangePageSize = (event) => {
    setPageSize(parseInt(event.target.value, 10));
    setPage(0);
  };

  useEffect(() => {
    if (customerPage) {
      dispatch(getDocumentGallery(null, customer?._id, null, page, pageSize))
    }

    if (machinePage) {
      dispatch(getDocumentGallery(null, null, machine?._id, page, pageSize))
    }

    if (!machinePage && !customerPage) {
      dispatch(getDocumentGallery(document?._id, null, null, page, pageSize))
    }

  }, [dispatch, document, customer, machine, customerPage, machinePage, page, pageSize])

  useEffect(() => {
    setSlides(documentGallery?.data?.map((img) => ({
      src: `data:image/png;base64, ${img?.thumbnail}`,
      thumbnail: `data:image/png;base64, ${img?.thumbnail}`,
      downloadFilename: `${img?.name}.${img?.extension}`,
      name: img?.name,
      category: img?.docCategory?.name,
      title: <Grid>
        <Typography variant='h4'>{machine?.serialNo} - {machine?.name}</Typography>
        <Typography variant='body2'>{img?.displayName}</Typography>
        <Typography variant='body2'>{img?.docCategory?.name}</Typography>
      </Grid>,
      fileType: img?.fileType,
      extension: img?.extension,
      isLoaded: false,
      id: img?._id,
      width: '100%',
      height: '100%',
      transform: 'scale(10)'
    })));

  }, [documentGallery, machine])

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];
    if (!image?.isLoaded) {
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
              rotate: '90deg'
            },
            ...slides.slice(index + 1), // copies slides after the updated slide
          ];

          // Update the state with the new array
          setSlides(updatedSlides);
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const handleBackLink = () => {
    if (customerPage) {
      navigate(PATH_CRM.customers.documents.root(customer?._id))
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.root(machineId))
    }
  };
  return (
    <Container maxWidth={false} sx={{ padding: `${!customerPage && !machinePage ? "" : "0px !important"}` }} >
      {!customerPage && !machinePage &&
        <StyledCardContainer>
          <Cover name={FORMLABELS.COVER.DOCUMENTS} />
        </StyledCardContainer>
      }

      <Card sx={{ p: 2 }}>
        <ViewFormEditDeleteButtons backLink={handleBackLink} />
        {slides?.length > 0 ? (
          <>
            <Grid container sx={{ borderTop: 'solid 1px rgba(145, 158, 171, 0.24)', borderBottom: 'solid 1px rgba(145, 158, 171, 0.24)' }}>
              <Grid item md={12} lg={6} >
                <Typography variant='h4' sx={{ mt: 2 }}>{`${customerPage ? "Customer" : `${machinePage ? "Machine" : "Document"}`} Gallery`}</Typography>
              </Grid>
              <Grid item md={12} lg={6} >
                <TablePagination component="div" labelRowsPerPage="Images / Page" sx={{ border: 'none' }}
                  rowsPerPageOptions={[15, 30]} showLastButton showFirstButton
                  count={documentGallery?.totalCount} page={page} rowsPerPage={pageSize}
                  onPageChange={handleChangePage} onRowsPerPageChange={handleChangePageSize}
                />
              </Grid>
            </Grid>

            <Box sx={{ mt: 2 }} gap={2} display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(5, 1fr)',
                lg: 'repeat(6, 1fr)',
                xl: 'repeat(8, 1fr)',
              }}
            >
              {slides?.map((slide, index) => (
                <DocumentGalleryItem isLoading={isLoading} key={slide?.id} image={slide} onOpenLightbox={() => handleOpenLightbox(index)} />
              ))}
            </Box>

            <Lightbox index={selectedImage} slides={slides}
              open={selectedImage >= 0} close={handleCloseLightbox}
              onGetCurrentIndex={(index) => handleOpenLightbox(index)}
              disabledSlideshow
            />
          </>
        ) : (<EmptyContent title="Empty" sx={{ color: '#DFDFDF' }} />)}
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
  const { src, name, docCat } = image;
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
        <Typography variant="body2" sx={{ opacity: 0.72, marginTop: '0px' }}>{docCat}</Typography>
        {/* <Typography variant="body2" sx={{ opacity: 0.72, marginTop:'0px'}}>{docType}</Typography> */}
      </Stack>
    </Card>
  );
}
