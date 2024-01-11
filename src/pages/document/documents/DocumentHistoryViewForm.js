import PropTypes from 'prop-types';
import {  useMemo, useEffect, memo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import download from 'downloadjs';
import {
  Grid,
  Card,
  Link,
  Chip,
  Box,
  Button,
  Container
} from '@mui/material';
import { ThumbnailDocButton } from '../../components/Thumbnails'
import { StyledVersionChip } from '../../../theme/styles/default-styles';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

import {
  getDocumentHistory,
  resetDocument,
  setDocumentFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  getDocument,
  deleteDocument,
  setDocumentHistoryViewFormVisibility,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentVersionEditDialogVisibility,
  setDocumentGalleryVisibility,
} from '../../../redux/slices/document/document';
import { deleteDrawing, getDrawings, resetDrawings,
  setDrawingEditFormVisibility, setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';

import { deleteDocumentFile, downloadFile, getDocumentDownload } from '../../../redux/slices/document/documentFile';
import { getCustomer, resetCustomer, setCustomerDialog} from '../../../redux/slices/customer/customer';
import { getMachineForDialog, resetMachine, setMachineDialog } from '../../../redux/slices/products/machine';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import CustomerDialog from '../../components/Dialog/CustomerDialog';
import MachineDialog from '../../components/Dialog/MachineDialog';
import { PATH_DOCUMENT } from '../../../routes/paths';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import UpdateDocumentVersionDialog from '../../components/Dialog/UpdateDocumentVersionDialog';
import DocumentGallery from './DocumentGallery';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../../components/lightbox/Lightbox';
import { fileThumb } from '../../../components/file-thumbnail';
import StyledLightbox from '../../../components/lightbox/styles';

// ----------------------------------------------------------------------

DocumentHistoryViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
};
function DocumentHistoryViewForm({ customerPage, machinePage, drawingPage, machineDrawings }) {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { documentHistory, isLoading } = useSelector((state) => state.document);
  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { drawing } = useSelector((state) => state.drawing);

  useEffect(() => {
    if(!machinePage && !drawingPage){
      dispatch(resetMachine());
    }
    if(!customerPage && !drawingPage){
      dispatch(resetCustomer());
    }
    if(!machinePage && !customerPage && !drawingPage && id){
      dispatch(getDocumentHistory(id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

// get machine data for machine portal
  useEffect(() => {
    if (documentHistory?.machine && !machinePage && !drawingPage) {
      dispatch(setMachineDialog(false));
    }
  }, [documentHistory, machinePage, drawingPage, dispatch]);

// get customer data for customer portal
  useEffect(() => {
    if (documentHistory?.customer && !customerPage) {
      dispatch(setCustomerDialog(false));
      // dispatch(getCustomer(documentHistory.customer._id));
    }
  }, [documentHistory, customerPage, dispatch]);

  const defaultValues = useMemo(
    () => ({
      displayName: documentHistory?.displayName || '',
      documentName: documentHistory?.documentName?.name || '',
      docCategory: documentHistory?.docCategory?.name || '',
      docType: documentHistory?.docType?.name || '',
      referenceNumber: documentHistory?.referenceNumber || '',
      stockNumber: documentHistory?.stockNumber || '',
      customer: documentHistory?.customer?.name || '',
      site: documentHistory?.site?.name || '',
      contact: documentHistory?.contact?.name || '',
      machine: documentHistory?.machine?.serialNo || '',
      model: documentHistory?.machineModel?.name || '',
      customerAccess: documentHistory?.customerAccess,
      isActiveVersion: documentHistory?.isActiveVersion,
      documentVersion: documentHistory?.documentVersions?.length > 0
                        ? documentHistory?.documentVersions[0]?.versionNo : '',
      versionPrefix: documentHistory?.versionPrefix || '',
      description: documentHistory?.description,
      isArchived: documentHistory?.isArchived,
      isActive: documentHistory?.isActive,
      createdAt: documentHistory?.createdAt || '',
      createdByFullName: documentHistory?.createdBy?.name || '',
      createdIP: documentHistory?.createdIP || '',
      updatedAt: documentHistory?.updatedAt || '',
      updatedByFullName: documentHistory?.updatedBy?.name || '',
      updatedIP: documentHistory?.updatedIP || '',
      machines: documentHistory?.productDrawings || [],
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentHistory]
  );

  const linkedDrawingMachines = documentHistory?.productDrawings?.map((pdrawing, index) => pdrawing?.machine._id !== machine?._id && (
    <Chip sx={{ml:index===0?0:1}} onClick={() => handleMachineDialog(pdrawing?.machine?._id)} label={`${pdrawing?.machine?.serialNo || ''} ${pdrawing?.machine?.name ? ` - ${pdrawing?.machine?.name}` : '' } `} />
  ));

  // refresh the document when file deleted
const callAfterDelete = () => {dispatch(getDocumentHistory(documentHistory._id))};

const handleNewVersion = async () => {
  if(customerPage || machinePage){
    dispatch(setDocumentHistoryViewFormVisibility(false));
    dispatch(setDocumentFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(true));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(resetDocument());
  }else if(!customerPage && !machinePage && !machineDrawings){
    dispatch(setDocumentHistoryNewVersionFormVisibility(true));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    navigate(PATH_DOCUMENT.document.new,"drawingPage");
    dispatch(resetDocument());
  }else if(machineDrawings){
    dispatch(setDocumentHistoryNewVersionFormVisibility(true));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    navigate(PATH_DOCUMENT.document.machineDrawings.new);
    dispatch(resetDocument());
  }
}

const handleUpdateVersion = async () => {
  dispatch(setDocumentVersionEditDialogVisibility(true));
}

const handleNewFile = async () => {
  if(customerPage || machinePage){
    dispatch(setDocumentHistoryViewFormVisibility(false));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(false));
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentFormVisibility(true));
    dispatch(resetDocument());
  }else if(!customerPage && !machinePage && !machineDrawings){
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(false));
    dispatch(resetDocument());
    navigate(PATH_DOCUMENT.document.new);
  }
  else if(machineDrawings){
    dispatch(setDocumentAddFilesViewFormVisibility(false));
    dispatch(setDocumentNewVersionFormVisibility(false));
    dispatch(setDocumentHistoryAddFilesViewFormVisibility(true));
    dispatch(setDocumentHistoryNewVersionFormVisibility(false));
    navigate(PATH_DOCUMENT.document.machineDrawings.new);
    dispatch(resetDocument());
  }
}
  const handleCustomerDialog = () =>{
    if (documentHistory?.customer && !customerPage) {
      dispatch(setCustomerDialog(true));
      dispatch(getCustomer(documentHistory.customer._id));
    }
  }
  const handleMachineDialog = (machineId) =>{
    // if (documentHistory?.machine && !machinePage && !drawingPage) {
      dispatch(setMachineDialog(true));
      dispatch(getMachineForDialog(machineId));
    // }
  }

  const handleEditDrawing = async () => {
    await dispatch(getDocument(documentHistory._id));
    dispatch(setDrawingViewFormVisibility(false));
    dispatch(setDrawingEditFormVisibility(true));
  };

  const handleDelete = async () => {
    try {
      await dispatch(deleteDocument(documentHistory?._id));
      navigate(PATH_DOCUMENT.document.machineDrawings.list);
      enqueueSnackbar("Document Deleted Successfully!", { variant: `success` });
    }catch(error) {
      enqueueSnackbar(error, { variant: `error` });
    }
  }

  const handleDeleteDrawing = async () => {
    try {
      await dispatch(deleteDrawing(drawing?._id));
      await dispatch(resetDrawings());
      await dispatch(getDrawings(machine?._id));
      dispatch(setDrawingViewFormVisibility(false))
      enqueueSnackbar(Snacks.deletedDrawing, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(Snacks.failedDeleteDrawing, { variant: `error` });
    }
  };

  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    // Assuming documentHistory is fetched or updated asynchronously
    if (documentHistory) {
      const newSlides = documentHistory?.documentVersions?.flatMap((files, index) =>
        files?.files?.map((file, _index) => {
          if (file?.fileType && file.fileType.startsWith("image")) {
            return{
              thumbnail: `data:image/png;base64, ${file.thumbnail}`,
              src: `data:image/png;base64, ${file.thumbnail}`,
              downloadFilename: `${file?.name}.${file?.extension}`,
              name: file?.name,
              extension: file?.extension,
              category: file?.docCategory?.name,
              fileType: file?.fileType,
              isLoaded: false,
              _id: file?._id,
              version:files?.versionNo,
              width: '100%',
              height: '100%',
            }
          }
          return null;
        }).filter(Boolean) // Remove null entries from the array
      );
  
      setSlides(newSlides);
    }
  }, [documentHistory]);

  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];

    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
      try {
        const response = await dispatch(downloadFile(image?._id));
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
        }
      } catch (error) {
        console.error('Error loading full file:', error);
      }
    }
  };

  const handleCloseLightbox = () => {
    setSelectedImage(-1);
  };

  const handleDeleteFile = async (documentId, versionId, fileId) => {
    try {
      await dispatch(deleteDocumentFile(documentId, versionId, fileId, customer?._id));
      await dispatch(getDocumentHistory(documentHistory._id))
      enqueueSnackbar('File Deleted successfully');
    } catch (err) {
      console.log(err);
      enqueueSnackbar('File Deletion failed!', { variant: `error` });
    }
  };

  const handleDownloadFile = (documentId, versionId, fileId, fileName, fileExtension) => {
    dispatch(getDocumentDownload(documentId, versionId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
          enqueueSnackbar(res.statusText);
        } else {
          enqueueSnackbar(res.statusText, { variant: `error` });
        }
      })
      .catch((err) => {
        if (err.Message) {
          enqueueSnackbar(err.Message, { variant: `error` });
        } else if (err.message) {
          enqueueSnackbar(err.message, { variant: `error` });
        } else {
          enqueueSnackbar('Something went wrong!', { variant: `error` });
        }
      });
  };

  const handleOpenFile = (documentId, versionId, fileId, file) => {
    // dispatch(getDocumentDownload(documentId, versionId, fileId))
    //   .then((res) => {
    //     if (regEx.test(res.status)) {

    //       // const byteCharacters = atob(res.data);
    //       // const byteNumbers = new Array(byteCharacters.length);
    //       // for (let i = 0; i < byteCharacters.length; i++) {
    //       //   byteNumbers[i] = byteCharacters.charCodeAt(i);
    //       // }
    //       // const byteArray = new Uint8Array(byteNumbers);
    //       const decodedPDF = atob(res.data);
        
    //       // Create a Blob from the decoded string
    //       const blob = new Blob([decodedPDF], { type: 'application/pdf' });
    //       const url = window.URL.createObjectURL(blob);
    //       const a = document.createElement('a');
    //       a.href = url;
    //       // a.download = filename;
          
    //       // Open in a new tab
    //       a.target = '_blank';
          
    //       a.click();

    //       // // Create a data URL from the Blob
    //       // const dataUrl = URL.createObjectURL(blob);

    //       // // Open a new tab with the data URL
    //       // const newTab = window.open(dataUrl, '_blank');

    //       // // Set a timeout to release the object URL after opening the tab
    //       // setTimeout(() => {
    //       //   URL.revokeObjectURL(dataUrl);
    //       // }, 5000); // Adjust the timeout duration as needed
        
    //       // // Cleanup
    //       // window.URL.revokeObjectURL(url);
    //       enqueueSnackbar(res.statusText);
    //     } else {
    //       enqueueSnackbar(res.statusText, { variant: `error` });
    //     }
    //   })
    //   .catch((err) => {
    //     if (err.Message) {
    //       enqueueSnackbar(err.Message, { variant: `error` });
    //     } else if (err.message) {
    //       enqueueSnackbar(err.message, { variant: `error` });
    //     } else {
    //       enqueueSnackbar('Something went wrong!', { variant: `error` });
    //     }
    //   });
  };

  return (
    <Container maxWidth={false} sx={{padding:machineDrawings || customerPage || machinePage ?'0 !important':''}}>
      {!customerPage && !machinePage && !drawingPage &&
        <DocumentCover content={defaultValues?.displayName} generalSettings />
      }

        <Grid item md={12} mt={2}>
          <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons
          customerAccess={defaultValues?.customerAccess}
          isActive={defaultValues.isActive}
          handleEdit={drawingPage && handleEditDrawing}
          onDelete={drawingPage?handleDeleteDrawing : handleDelete }
          disableDeleteButton={drawingPage && machine?.status?.slug==="transferred"}
          disableEditButton={drawingPage && machine?.status?.slug==="transferred"}
          backLink={(customerPage || machinePage || drawingPage ) ? ()=>{dispatch(setDocumentHistoryViewFormVisibility(false)); dispatch(setDrawingViewFormVisibility(false));}
          : () =>  machineDrawings ? navigate(PATH_DOCUMENT.document.machineDrawings.list) : navigate(PATH_DOCUMENT.document.list)}

      />
            <Grid container sx={{mt:2}}>
              <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.displayName} />
              <ViewFormField isLoading={isLoading}
                sm={6}
                NewVersion={!defaultValues.isArchived}
                handleNewVersion={handleNewVersion}
                handleUpdateVersion={handleUpdateVersion}
                heading="Active Version"
                objectParam={
                  defaultValues.documentVersion && (
                    <StyledVersionChip label={defaultValues.versionPrefix + defaultValues.documentVersion}
                      size="small" variant="outlined"
                    />
                  )
                }
              />

              <ViewFormField isLoading={isLoading}
                sm={6}
                heading="Document Category"
                param={defaultValues?.docCategory}
              />
              <ViewFormField isLoading={isLoading} sm={6} heading="Document Type" param={defaultValues?.docType} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />
              <ViewFormField isLoading={isLoading} sm={6} heading="Stock Number" param={defaultValues?.stockNumber} />

              {!customerPage && !machineDrawings && !drawingPage && defaultValues.customer && (
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  variant='h4'
                  heading="Customer"
                  objectParam={
                    defaultValues.customer && (
                      <Link onClick={handleCustomerDialog} href="#" underline="none">
                        {defaultValues.customer}
                      </Link>
                    )
                  }
                />
              )}

              {!machinePage && !machineDrawings && !drawingPage &&  defaultValues?.machine && (
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  heading="Machine"
                  variant='h4'
                  objectParam={
                    defaultValues.machine && (
                      <Link onClick={()=> handleMachineDialog(documentHistory?.machine?._id)} href="#" underline="none">
                        {defaultValues.machine}
                      </Link>
                    )
                  }
                />
              )}

              <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
              {((drawingPage && documentHistory?.productDrawings?.length > 1) || machineDrawings) &&
                <ViewFormField isLoading={isLoading} sm={12} heading="Attached with Machines" chipDialogArrayParam={linkedDrawingMachines} />
              }
              <Grid container sx={{ mt: '1rem', mb: '-1rem' }}>
                <ViewFormAudit defaultValues={defaultValues} />
              </Grid>
              {documentHistory &&
                documentHistory?.documentVersions?.map((version, index) => {
                  const fileValues = {
                      createdAt: version?.createdAt || '',
                      createdByFullName: version?.createdBy?.name || '',
                      createdIP: version?.createdIP || '',
                      updatedAt: version?.updatedAt || '',
                      updatedByFullName: version?.updatedBy?.name || '',
                      updatedIP: version?.updatedIP || '',
                    }

                 return (
                  <Grid container key={index}>
                    <Grid container sx={{ pt: '2rem' }} mb={1}>
                      <FormLabel content={`Version No. ${version?.versionNo}`} />
                      {defaultValues.description !== version?.description && (
                        <ViewFormField sm={12} heading="Description" param={version?.description} />
                      )}
                    </Grid>
                    <Box
                      sx={{mt:2, width:'100%'}}
                      gap={2}
                      display="grid"
                      gridTemplateColumns={{
                        xs: 'repeat(1, 1fr)',
                        sm: 'repeat(3, 1fr)',
                        md: 'repeat(5, 1fr)',
                        lg: 'repeat(6, 1fr)',
                        xl: 'repeat(8, 1fr)',
                      }}
                    >
                      {slides?.map((file, _index) =>{
                        if(file?.version===version?.versionNo){
                          return(
                            <DocumentGalleryItem isLoading={isLoading} key={file?.id} image={file} 
                              onOpenLightbox={()=> handleOpenLightbox(_index)}
                              onDownloadFile={()=> handleDownloadFile(documentHistory._id, version._id, file._id, file?.name, file?.extension)}
                              onDeleteFile={()=> handleDeleteFile(documentHistory._id, version._id, file._id)}
                              toolbar
                            />
                          )
                        }

                        return null;
                      } 
                      )}

                      {version?.files?.map((file, _index) =>{
                        if (!file.fileType.startsWith('image')) {
                          return (
                            <DocumentGalleryItem
                              key={file?._id}
                              image={{
                                thumbnail: `data:image/png;base64, ${file.thumbnail}`,
                                src: `data:image/png;base64, ${file.thumbnail}`,
                                downloadFilename: `${file?.name}.${file?.extension}`,
                                name: file?.name,
                                category: file?.docCategory?.name,
                                fileType: file?.fileType,
                                extension: file?.extension,
                                isLoaded: false,
                                id: file?._id,
                                width: '100%',
                                height: '100%',
                              }}
                              isLoading={isLoading} 
                              // onOpenLightbox={() => handleOpenLightbox(index)}
                              onDownloadFile={() => handleDownloadFile(documentHistory._id, version._id, file._id, file?.name, file?.extension)}
                              onDeleteFile={() => handleDeleteFile(documentHistory._id, version._id, file._id)}
                              onOpenFile={() => handleOpenFile(documentHistory._id, version._id, file._id, file)}
                              toolbar
                            />
                          );
                        }
                        return null;
                      })}

                      {index === 0 && !defaultValues.isArchived && (<ThumbnailDocButton onClick={handleNewFile}/>)}
                    </Box>
                    <ViewFormAudit key={`${index}-files`} defaultValues={fileValues} />
                  </Grid>
                )})}

                <Lightbox
                  index={selectedImage}
                  slides={slides}
                  open={selectedImage >= 0}
                  close={handleCloseLightbox}
                  onGetCurrentIndex={(index) => handleOpenLightbox(index)}
                  disabledSlideshow
                />


            </Grid>
          </Card>
        </Grid>
      <CustomerDialog />
      <MachineDialog />
      {/* <DocumentGallery /> */}
      <UpdateDocumentVersionDialog versionNo={defaultValues?.documentVersion} />
    </Container>
     
  );
}

export default memo(DocumentHistoryViewForm)