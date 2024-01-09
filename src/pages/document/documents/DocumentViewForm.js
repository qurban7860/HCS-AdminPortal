import PropTypes from 'prop-types';
import React, { useMemo, memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, Box } from '@mui/material'
import download from 'downloadjs';
import { StyledVersionChip } from '../../../theme/styles/default-styles';
import { PATH_DOCUMENT } from '../../../routes/paths';
import {
  deleteDocument,
  getDocumentHistory,
  resetDocumentHistory,
  getDocument,
  getDocuments,
  setDocumentEditFormVisibility,
  setDocumentViewFormVisibility,
  setDocumentHistoryViewFormVisibility,
  setDocumentFormVisibility,
  setDocumentAddFilesViewFormVisibility,
  setDocumentNewVersionFormVisibility,
  setDocumentHistoryAddFilesViewFormVisibility,
  setDocumentHistoryNewVersionFormVisibility,
} from '../../../redux/slices/document/document';
import { deleteDocumentFile, downloadFile, getDocumentDownload } from '../../../redux/slices/document/documentFile';
// components
import { Thumbnail, ThumbnailDocButton } from '../../components/Thumbnails';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../../components/lightbox/Lightbox';
import FormLabel from '../../components/DocumentForms/FormLabel';

DocumentViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  DocId: PropTypes.string,
};

function DocumentViewForm({ customerPage, machinePage, DocId }) {
  const { document, isLoading } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
      await dispatch(deleteDocument(document._id));
      if (customerPage || machinePage) {
        if (customer?._id || machine?._id) {
          await dispatch(
            getDocuments(customerPage ? customer?._id : null, machinePage ? machine?._id : null)
          );
        }
      } else {
        await dispatch(getDocuments());
      }
      dispatch(setDocumentViewFormVisibility(false));
      enqueueSnackbar(Snacks.deletedDoc, { variant: `success` });
    } catch (err) {
      console.log(err);
      enqueueSnackbar(Snacks.failedDeleteDoc, { variant: `error` });
    }
  };

  const handleEdit = async () => {
    await dispatch(getDocument(document._id));
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentEditFormVisibility(true));
  };

  const linkDocumentView = async () => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(true));
    dispatch(resetDocumentHistory())
    await dispatch(getDocumentHistory(document?._id));
  };

  const callAfterDelete = async () => {
    await dispatch(getDocument(document._id));
  };

  // useEffect(() => {
  //   dispatch(resetDocument());
  // }, [dispatch]);

  const defaultValues = useMemo(
    () => ({
      displayName: document?.displayName || '',
      documentName: document?.documentName?.name || '',
      docCategory: document?.docCategory?.name || '',
      docType: document?.docType?.name || '',
      referenceNumber: document?.referenceNumber || '',
      stockNumber: document?.stockNumber || '',
      customer: document?.customer?.name || '',
      site: document?.site?.name || '',
      contact: document?.contact?.name || '',
      machine: document?.machine?.serialNo || '',
      model: document?.machineModel?.name || '',
      customerAccess: document?.customerAccess,
      isActiveVersion: document?.isActiveVersion,
      documentVersion:
        document?.documentVersions && document?.documentVersions?.length > 0
          ? document?.documentVersions[0]?.versionNo
          : '',
      documentVersionLength: document?.documentVersions?.length > 1 ,
      versionPrefix: document?.versionPrefix || '',
      description: document?.description,
      isActive: document?.isActive,
      createdAt: document?.createdAt || '',
      createdByFullName: document?.createdBy?.name || '',
      createdIP: document?.createdIP || '',
      updatedAt: document?.updatedAt || '',
      updatedByFullName: document?.updatedBy?.name || '',
      updatedIP: document?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [document]
  );

  const handleNewVersion = async () => {
    if(customerPage || machinePage){
      dispatch(setDocumentHistoryNewVersionFormVisibility(false));
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
      dispatch(setDocumentAddFilesViewFormVisibility(false));
      dispatch(resetDocumentHistory());
      dispatch(setDocumentViewFormVisibility(false));
      dispatch(setDocumentFormVisibility(true));
      dispatch(setDocumentNewVersionFormVisibility(true));
  }else{
    dispatch(setDocumentNewVersionFormVisibility(true));
    navigate(PATH_DOCUMENT.document.new);
  }
  }

  const handleNewFile = async () => {
    if(customerPage || machinePage){
      dispatch(setDocumentHistoryNewVersionFormVisibility(false));
      dispatch(setDocumentHistoryAddFilesViewFormVisibility(false));
      dispatch(setDocumentNewVersionFormVisibility(false));
      dispatch(resetDocumentHistory());
      dispatch(setDocumentViewFormVisibility(false));
      dispatch(setDocumentFormVisibility(true));
      dispatch(setDocumentAddFilesViewFormVisibility(true));
  }else{
    dispatch(setDocumentAddFilesViewFormVisibility(true));
    navigate(PATH_DOCUMENT.document.new);
  }
  }

  const regEx = /^[^2]*/;
  const [selectedImage, setSelectedImage] = useState(-1);
  const [slides, setSlides] = useState([]);

  useEffect(() => {
    // Assuming documentHistory is fetched or updated asynchronously
    if (document?.documentVersions) {
      const newSlides = document?.documentVersions[0].files?.map((file) => {
          if (file?.fileType && file.fileType.startsWith("image")) {
            return{
              thumbnail: `data:image/png;base64, ${file.thumbnail}`,
              src: `data:image/png;base64, ${file.thumbnail}`,
              downloadFilename: `${file?.name}.${file?.extension}`,
              name: file?.name,
              category: file?.docCategory?.name,
              fileType: file?.fileType,
              isLoaded: false,
              id: file?._id,
              width: '100%',
              height: '100%',
            }
          }
          return null;
        }).filter(Boolean) // Remove null entries from the array
  
      setSlides(newSlides);
    }
  }, [document]);


  const handleOpenLightbox = async (index) => {
    setSelectedImage(index);
    const image = slides[index];

    if(!image?.isLoaded && image?.fileType?.startsWith('image')){
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
      await dispatch(getDocument(document._id))
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
    //       // const decodedPDF = atob(res.data);
        
    //       // // Create a Blob from the decoded string
    //       // const blob = new Blob([decodedPDF], { type: 'application/pdf' });
    //       // const url = window.URL.createObjectURL(blob);
    //       // const a = document.createElement('a');
    //       // a.href = url;
    //       // // a.download = filename;
          
    //       // // Open in a new tab
    //       // a.target = '_blank';
          
    //       // a.click();

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
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} 
      customerAccess={defaultValues?.customerAccess} 
      handleEdit={handleEdit}
      onDelete={onDelete}
      disableDeleteButton={machinePage && machine?.status?.slug==="transferred"}
      backLink={(customerPage || machinePage ) ? ()=>{dispatch(setDocumentHistoryViewFormVisibility(false)); dispatch(setDocumentViewFormVisibility(false))}
      : () => navigate(PATH_DOCUMENT.document.list)}
      disableEditButton={machine?.status?.slug==='transferred'}
      />
      <Grid container>
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.displayName} />
        <ViewFormField isLoading={isLoading}
          sm={6}
          heading="Version"
          handleAllVersion={linkDocumentView}
          handleNewVersion={handleNewVersion}
          objectParam={
            <StyledVersionChip
              label={defaultValues.versionPrefix + defaultValues.documentVersion}
              size="small"
              variant="outlined"
            />
          }
          // objectParam={`${defaultValues.versionPrefix} ${defaultValues.documentVersion}`}
          ViewAllVersions
          NewVersion
          isNewVersion
        />
        <ViewFormField isLoading={isLoading} sm={6} heading="Document Category" param={defaultValues?.docCategory} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Document Type" param={defaultValues?.docType} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Reference Number" param={defaultValues?.referenceNumber} />
        <ViewFormField isLoading={isLoading} sm={6} heading="Stock Number" param={defaultValues?.stockNumber} />
        {!customerPage && !machinePage && (
          <>
            <ViewFormField isLoading={isLoading} sm={6} variant='h4' heading="Customer" param={defaultValues?.customer} />
            <ViewFormField isLoading={isLoading} sm={6} variant='h4' heading="Machine" param={defaultValues?.machine} />
          </>
        )}
        <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />

        <Grid container sx={{ mt: 2 }}>
          <ViewFormAudit defaultValues={defaultValues} />
        </Grid>

        <FormLabel content='Documents' />
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

          {slides?.map((file, _index) => (
            <DocumentGalleryItem isLoading={isLoading} key={file?.id} image={file} 
              onOpenLightbox={()=> handleOpenLightbox(_index)}
              onDownloadFile={()=> handleDownloadFile(document._id, document?.documentVersions[0]._id, file._id, file?.name, file?.extension)}
              onDeleteFile={()=> handleDeleteFile(document._id, document?.documentVersions[0]._id, file._id)}
              toolbar
            />
          ))}

          {document?.documentVersions &&
              document?.documentVersions[0]?.files?.map((file, _index) =>  
              {
                if(!file.fileType.startsWith('image')){
                  return <DocumentGalleryItem key={file?._id} image={{
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
                  }} isLoading={isLoading} 
                  // onOpenLightbox={()=> handleOpenLightbox(_index)}
                  onDownloadFile={()=> handleDownloadFile(document._id, document?.documentVersions[0]._id, file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteFile(document._id, document?.documentVersions[0]._id, file._id)}
                  onOpenFile={()=> handleOpenFile(document._id, document?.documentVersions[0]._id, file._id, file)}
                  toolbar
                  />
                }
                return null;
              }
          )}

          <ThumbnailDocButton onClick={handleNewFile}/>
        </Box>
        
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
  );
}

export default memo(DocumentViewForm)