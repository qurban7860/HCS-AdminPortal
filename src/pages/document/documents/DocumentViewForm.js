import PropTypes from 'prop-types';
import React, { useMemo, memo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Document, Page, pdfjs } from 'react-pdf';
import { Grid, Card, Box, Dialog, DialogTitle, Button, DialogContent, Divider, Typography } from '@mui/material'
import download from 'downloadjs';
import { StyledVersionChip } from '../../../theme/styles/default-styles';
import { PATH_CRM, PATH_DOCUMENT } from '../../../routes/paths';
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
import { ThumbnailDocButton } from '../../../components/Thumbnails';
import { useSnackbar } from '../../../components/snackbar';
import { Snacks } from '../../../constants/document-constants';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../../components/ViewForms/ViewFormEditDeleteButtons';
import { DocumentGalleryItem } from '../../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../../components/lightbox/Lightbox';
import FormLabel from '../../../components/DocumentForms/FormLabel';

DocumentViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  DocId: PropTypes.string,
};

function DocumentViewForm({ customerPage, machinePage, drawingPage, DocId }) {
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
          await dispatch( getDocuments(customerPage ? customer?._id : null, machinePage ? machine?._id : null) );
        }
        if(customerPage && !machinePage ) {
          navigate(PATH_CRM.customers.documents.root( customer?._id ));
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
    dispatch(getDocument(document?._id));
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentEditFormVisibility(true));
    if( customerPage && !machinePage ){
      navigate(PATH_CRM.customers.documents.edit( customer?._id, document?._id ));
    }
  };

  const linkDocumentView = async () => {
    dispatch(setDocumentViewFormVisibility(false));
    dispatch(setDocumentHistoryViewFormVisibility(true));
    dispatch(resetDocumentHistory())
    dispatch(getDocumentHistory(document?._id));
    if( customerPage && !machinePage ){
      navigate(PATH_CRM.customers.documents.viewHistory( customer?._id, document?._id ));
    }
  };

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
      if( customerPage && !machinePage ){
        navigate(PATH_CRM.customers.documents.new( customer?._id ));
      }
  }else{
    dispatch(setDocumentNewVersionFormVisibility(true));
    navigate(PATH_DOCUMENT.document.new);
  }
  }

  const handleNewFile = async () => {
    if(customerPage || machinePage){
      if( customerPage && !machinePage ){
        dispatch(setDocumentAddFilesViewFormVisibility(true));
        navigate(PATH_CRM.customers.documents.new( customer?._id ));
      }
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
      const newSlides = document?.documentVersions[0]?.files?.map((file) => {
          if (file?.fileType && file.fileType.startsWith("image")) {
            return{
              thumbnail: `data:image/png;base64, ${file.thumbnail}`,
              src: `data:image/png;base64, ${file.thumbnail}`,
              downloadFilename: `${file?.name}.${file?.extension}`,
              name: file?.name,
              title:<Grid>
                <Typography variant='h4'>{document?.machine?.serialNo} - {document?.machine?.name}</Typography>
                <Typography variant='body2'>{document?.displayName}</Typography>
                <Typography variant='body2'>{document?.docCategory?.name}</Typography>
              </Grid>,
              extension: file?.extension,
              category: file?.docCategory?.name,
              fileType: file?.fileType,
              isLoaded: false,
              _id: file?._id,
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

  const [pdf, setPDF] = useState(null);
  const [pages, setPages] = useState(null);
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;

  const handleOpenFile = async (documentId, versionId, fileId, fileName, fileExtension) => {
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(getDocumentDownload(documentId, versionId, fileId));

      if (regEx.test(response.status)) {
        const pdfData = `data:application/pdf;base64,${encodeURI(response.data)}`;
        setPDF(pdfData);
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

  const onDocumentLoadSuccess = ({ numPages }) => {
    setPages(numPages);
  };

  const handleBackLink = () => {
    if(customerPage || machinePage ) {
      dispatch(setDocumentHistoryViewFormVisibility(false)); 
      dispatch(setDocumentViewFormVisibility(false))
      if(customerPage && !machinePage ) {
        navigate(PATH_CRM.customers.documents.root( customer?._id ));
      }
    } else {
      navigate(PATH_DOCUMENT.document.list)
    } 
  }

  return (
    <Card sx={{ p: 2 }}>
      <ViewFormEditDeleteButtons isActive={defaultValues.isActive} 
      customerAccess={defaultValues?.customerAccess} 
      handleEdit={handleEdit}
      onDelete={onDelete}
      disableDeleteButton={machinePage && machine?.status?.slug==="transferred"}
      backLink={ handleBackLink} 
      disableEditButton={machine?.status?.slug==='transferred'}
      // drawingPage={ !customerPage || !machinePage }
      customerPage={customerPage} machinePage={machinePage} drawingPage={drawingPage}
      />
      <Grid container>
      {PDFViewerDialog && (
        <Dialog fullWidth maxWidth='md' open={PDFViewerDialog} style={{marginBottom:10}} onClose={()=> setPDFViewerDialog(false)}>
          <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
              PDF View
              <Button variant='outlined' onClick={()=> setPDFViewerDialog(false)}>Close</Button>
          </DialogTitle>
          <Divider variant='fullWidth' />
          <DialogContent dividers sx={{height:'-webkit-fill-available'}}>
            {pdf?(
              <Document file={pdf} onLoadSuccess={onDocumentLoadSuccess}>
                {Array.from(new Array(pages), (el, index) => (
                  <Page width={840} key={`page_${index + 1}`} renderTextLayer={false} pageNumber={index + 1} />
                ))}
              </Document>
            ):(<Typography variant='body1' sx={{mt:2}}>Loading PDF....</Typography>)}
          </DialogContent>
        </Dialog>
      )}
        <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.displayName} />
        <ViewFormField isLoading={isLoading}
          sm={6}
          heading="Version"
          handleAllVersion={linkDocumentView}
          handleNewVersion={handleNewVersion}
          param={
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
                  onDownloadFile={()=> handleDownloadFile(document._id, document?.documentVersions[0]._id, file._id, file?.name, file?.extension)}
                  onDeleteFile={()=> handleDeleteFile(document._id, document?.documentVersions[0]._id, file._id)}
                  onOpenFile={()=> handleOpenFile(document._id, document?.documentVersions[0]._id, file._id, file?.name, file?.extension)}
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