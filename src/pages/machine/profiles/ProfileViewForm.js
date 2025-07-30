import { useLayoutEffect, useEffect, useMemo, useState } from 'react';
// @mui
import { Container, Card, Grid, Box, Dialog, DialogTitle, Button, Divider } from '@mui/material';
// hooks
import { useDispatch, useSelector } from 'react-redux';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import download from 'downloadjs';
import b64toBlob from 'b64-to-blob';
import { PATH_MACHINE } from '../../../routes/paths';
// components
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { getProfile, getFile, deleteFile, deleteProfile, resetProfile } from '../../../redux/slices/products/profile';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import MachineTabContainer from '../util/MachineTabContainer';
import { Upload } from '../../../components/upload';
import { handleError } from '../../../utils/errorHandler';
import Lightbox from '../../../components/lightbox/Lightbox';
import SkeletonPDF from '../../../components/skeleton/SkeletonPDF';
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import DialogProfileAddFile from '../../../components/Dialog/ProfileAddFileDialog';

export default function ProfileViewForm() {
  const { profile, isLoading } = useSelector((state) => state.profile);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { machineId, id } = useParams();
  const dispatch = useDispatch();

  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [fileDialog, setFileDialog] = useState(false);
  const [slides, setSlides] = useState([]);

  useLayoutEffect(() => {
    if (machineId && id) {
      dispatch(getProfile(machineId, id))
    }
    // return () => {
    //   dispatch(resetProfile())
    // }
  }, [dispatch, machineId, id])

  const onDelete = async () => {
    try {
      await dispatch(deleteProfile(machineId, id));
      enqueueSnackbar("Profile Archived successfully");
      navigate(PATH_MACHINE.machines.profiles.root(machineId))
    } catch (err) {
      enqueueSnackbar("Failed to Archive profile", { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = () => navigate(PATH_MACHINE.machines.profiles.edit(machineId, id));

  const defaultValues = useMemo(
    () => ({
      defaultName: profile?.defaultName || '',
      names: profile?.names || [],
      web: profile?.web || '',
      flange: profile?.flange || '',
      thicknessStart: profile?.thicknessStart || '',
      thicknessEnd: profile?.thicknessEnd || '',
      type: profile?.type || '',
      files: profile?.files || [],
      isActive: profile?.isActive,
      createdByFullName: profile?.createdBy?.name || '',
      createdAt: profile?.createdAt || '',
      createdIP: profile?.createdIP || '',
      updatedByFullName: profile?.updatedBy?.name || '',
      updatedAt: profile?.updatedAt || '',
      updatedIP: profile?.updatedIP || '',
    }),
    [profile]
  );

  useEffect(() => {
    const newSlides = profile?.files?.map((file) => {
      if (file?.fileType && file.fileType.startsWith("image")) {
        return {
          thumbnail: `data:image/png;base64, ${file.thumbnail}`,
          src: `data:image/png;base64, ${file.thumbnail}`,
          downloadFilename: `${file?.name}.${file?.extension}`,
          name: file?.name,
          extension: file?.extension,
          fileType: file?.fileType,
          isLoaded: false,
          _id: file?._id,
          width: '100%',
          height: '100%',
        }
      }
      return null;
    })?.filter(Boolean)
    setSlides(newSlides || []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.files?.length]);

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];
    if (!image?.isLoaded && image?.fileType?.startsWith('image')) {
      try {
        const response = await dispatch(getFile(machineId, id, image?._id));
        if (regEx.test(response.status)) {
          const updatedSlides = [...slides.slice(0, index),
          {
            ...slides[index],
            src: `data:image/png;base64, ${response.data}`,
            isLoaded: true,
          }, ...slides.slice(index + 1),
          ];
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

  const handleDeleteFile = async (fileId) => {
    try {
      await dispatch(deleteFile(machineId, id, fileId));
      enqueueSnackbar('File archived successfully');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File archive failed!', { variant: `error` });
    }
  };

  const handleDownloadFile = (fileId, fileName, fileExtension) => {
    dispatch(getFile(machineId, id, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: `error` });
        }
      })
      .catch((err) => {
        enqueueSnackbar(handleError(err), { variant: `error` });
      });
  };

  const [pdf, setPDF] = useState(null);
  const [PDFName, setPDFName] = useState('');
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (fileId, fileName, fileExtension) => {
    setPDFName(`${fileName}.${fileExtension}`);
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(getFile(machineId, id, fileId));
      if (regEx.test(response.status)) {
        const blob = b64toBlob(encodeURI(response.data), 'application/pdf')
        const url = URL.createObjectURL(blob);
        setPDF(url);
      } else {
        enqueueSnackbar(response.statusText, { variant: 'error' });
      }
    } catch (error) {
      if (error.message) {
        enqueueSnackbar(error.message, { variant: 'error' });
      } else {
        enqueueSnackbar('Something went wrong!', { variant: 'error' });
      }
    }
  };

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='profile' />
      <Grid item md={12} mt={2}>
        <Card sx={{ p: 2 }}>
          <ViewFormEditDeleteButtons isActive={defaultValues.isActive}
            disableEditButton={machine?.status?.slug === 'transferred' || machine?.isArchived}
            disableDeleteButton={machine?.status?.slug === 'transferred' || machine?.isArchived}
            handleEdit={!machine?.isArchived && handleEdit}
            onDelete={!machine?.isArchived && onDelete}
            backLink={() => navigate(PATH_MACHINE.machines.profiles.root(machineId))}
          />
          <Grid container sx={{ mt: 2 }}>
            <ViewFormField isLoading={isLoading} sm={6} heading="Default Name" param={defaultValues.defaultName} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Type" param={defaultValues?.type} />
            <ViewFormField isLoading={isLoading} heading="Other Names" chips={defaultValues.names} />
            <ViewFormField isLoading={isLoading} sm={2} heading="Web" param={`${defaultValues?.web || ''}`} />
            <ViewFormField isLoading={isLoading} sm={2} heading="Flange" param={`${defaultValues?.flange || ''}`} />
            <ViewFormField isLoading={isLoading} sm={2} heading="Min. Thickness" param={`${defaultValues?.thicknessStart || ''} `} />
            <ViewFormField isLoading={isLoading} sm={2} heading="Max. Thickness" param={`${defaultValues?.thicknessEnd || ''} `} />

            <Grid container sx={{ mt: 4 }}>
              <FormLabel content='Documents' />
            </Grid>
            <Box
              sx={{ mt: 2, width: '100%' }}
              gap={1}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(3, 1fr)',
                md: 'repeat(5, 1fr)',
                lg: 'repeat(6, 1fr)',
                xl: 'repeat(8, 1fr)',
              }}
            >

              {slides?.map((file, _index) => (
                <DocumentGalleryItem
                  isLoading={isLoading}
                  key={file?._id}
                  image={file}
                  onOpenLightbox={() => handleOpenLightbox(_index)}
                  onDownloadFile={() => handleDownloadFile(file?._id, file?.name, file?.extension)}
                  onDeleteFile={() => handleDeleteFile(file?._id)}
                  toolbar
                  size={150}
                />
              ))}

              {profile?.files?.map((file, _index) => {
                if (!file.fileType.startsWith('image')) {
                  return <DocumentGalleryItem key={file?._id}
                    image={{
                      thumbnail: `data:image/png;base64, ${file.thumbnail}`,
                      src: `data:image/png;base64, ${file.thumbnail}`,
                      downloadFilename: `${file?.name}.${file?.extension}`,
                      name: file?.name,
                      fileType: file?.fileType,
                      extension: file?.extension,
                      isLoaded: false,
                      id: file?._id,
                      width: '100%',
                      height: '100%',
                    }}
                    isLoading={isLoading}
                    onDownloadFile={() => handleDownloadFile(file?._id, file?.name, file?.extension)}
                    onDeleteFile={() => handleDeleteFile(file?._id)}
                    onOpenFile={() => handleOpenFile(file?._id, file?.name, file?.extension)}
                    toolbar
                  />
                }
                return null;
              }
              )}
              <ThumbnailDocButton onClick={() => setFileDialog(true)} />
            </Box>

            <Lightbox
              index={selectedImage}
              slides={slides}
              open={selectedImage >= 0}
              close={handleCloseLightbox}
              onGetCurrentIndex={(index) => handleOpenLightbox(index)}
              disabledSlideshow
            />

            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
      </Grid>
      {fileDialog && <DialogProfileAddFile open={fileDialog} handleClose={() => setFileDialog(false)} />}
      {PDFViewerDialog && (
        <Dialog fullScreen open={PDFViewerDialog} onClose={() => setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{ pb: 1, pt: 2, display: 'flex', justifyContent: 'space-between' }}>
            PDF View
            <Button variant='outlined' onClick={() => setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
          {pdf ? (
            <iframe title={PDFName} src={pdf} style={{ paddingBottom: 10 }} width='100%' height='842px' />
          ) : (
            <SkeletonPDF />
          )}
        </Dialog>
      )}
    </Container>
  );
}
