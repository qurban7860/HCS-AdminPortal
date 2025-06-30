import PropTypes from 'prop-types';
import { useMemo, useEffect, memo, useState } from 'react';
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
  Container,
  Dialog,
  DialogTitle,
  Typography,
  Divider
} from '@mui/material';
import b64toBlob from 'b64-to-blob';
import { ThumbnailDocButton } from '../../components/Thumbnails'
import { StyledVersionChip } from '../../theme/styles/default-styles';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';

import {
  getDocumentHistory,
  resetDocumentHistory,
  deleteDocument,
  setDocumentVersionEditDialogVisibility,
} from '../../redux/slices/document/document';
import { deleteDrawing, getDrawings, getDrawing, resetDrawings } from '../../redux/slices/products/drawing';

import { deleteDocumentFile, downloadFile, getDocumentDownload } from '../../redux/slices/document/documentFile';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { getMachineForDialog, setMachineDialog } from '../../redux/slices/products/machine';
import FormLabel from '../../components/DocumentForms/FormLabel';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import { PATH_CRM, PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import { Snacks } from '../../constants/document-constants';
import UpdateDocumentVersionDialog from '../../components/Dialog/UpdateDocumentVersionDialog';
import { DocumentGalleryItem } from '../../components/gallery/DocumentGalleryItem';
import Lightbox from '../../components/lightbox/Lightbox';
import SkeletonPDF from '../../components/skeleton/SkeletonPDF';

// ----------------------------------------------------------------------

DocumentHistoryViewForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  machineDrawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
  allowActions: PropTypes.bool,
};

function DocumentHistoryViewForm({ customerPage, machinePage, machineDrawingPage, machineDrawings, allowActions }) {

  const dispatch = useDispatch();
  const { customerId, machineId, id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { documentHistory, documentVersionEditDialogVisibility, isLoading } = useSelector((state) => state.document);
  const { machine } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { drawing } = useSelector((state) => state.drawing);

  useEffect(() => {
    if (id) {
      dispatch(getDocumentHistory(id));
    }
    return () => {
      dispatch(resetDocumentHistory());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, id]);

  // get machine data for machine portal
  useEffect(() => {
    if (documentHistory?.machine && !machinePage && !machineDrawingPage) {
      dispatch(setMachineDialog(false));
    }
  }, [documentHistory, machinePage, machineDrawingPage, dispatch]);

  // get customer data for customer portal
  useEffect(() => {
    if (documentHistory?.customer && !customerPage) {
      dispatch(setCustomerDialog(false));
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

  const linkedDrawingMachines = documentHistory?.productDrawings?.map((pdrawing, index) =>
    <Chip sx={{ m: 0.3 }} onClick={() => handleMachineDialog(pdrawing?.machine?._id)} label={`${pdrawing?.machine?.serialNo || ''} ${pdrawing?.machine?.name ? '-' : ''} ${pdrawing?.machine?.name || ''} `} />
  );

  const handleNewVersion = async () => {
    if (customerPage) {
      navigate(PATH_CRM.customers.documents.history.newVersion(customerId, id));
    } else if (machineDrawingPage) {
      navigate(PATH_MACHINE.machines.drawings.view.newVersion(machineId, id));
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.history.newVersion(machineId, id));
    } else if (!customerPage && !machineDrawingPage && !machinePage && !machineDrawings) {
      navigate(PATH_MACHINE.documents.document.view.newVersion(id));
    } else if (machineDrawings) {
      navigate(PATH_MACHINE_DRAWING.machineDrawings.view.newVersion(id));
    }
  }

  const handleUpdateVersion = async () => {
    dispatch(setDocumentVersionEditDialogVisibility(true));
  }

  const handleNewFile = async () => {
    if (customerPage) {
      navigate(PATH_CRM.customers.documents.history.addFile(customerId, id));
    } else if (machineDrawingPage) {
      navigate(PATH_MACHINE.machines.drawings.view.addFile(machineId, id));
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.history.addFile(machineId, id));
    } else if (!customerPage && !machineDrawingPage && !machinePage && !machineDrawings) {
      navigate(PATH_MACHINE.documents.document.view.addFile(id));
    } else if (machineDrawings) {
      navigate(PATH_MACHINE_DRAWING.machineDrawings.view.addFile(id));
    }
  }

  const handleCustomerDialog = async () => {
    if (documentHistory?.customer && !customerPage) {
      await dispatch(getCustomer(documentHistory.customer._id));
      await dispatch(setCustomerDialog(true));
    }
  }

  const handleMachineDialog = async (Id) => {
    await dispatch(getMachineForDialog(Id));
    await dispatch(setMachineDialog(true));
  }

  const handleEditDrawing = async () => {
    if (machineDrawingPage) {
      navigate(PATH_MACHINE.machines.drawings.edit(machineId, id));
    } else if (machineDrawings) {
      navigate(PATH_MACHINE_DRAWING.machineDrawings.edit(id));
    }
  }

  const handleDelete = async () => {
    try {
      await dispatch(deleteDocument(id));
      if (customerPage) {
        navigate(PATH_CRM.customers.documents.root(customer?._id));
      } else if (machinePage) {
        navigate(PATH_MACHINE.machines.documents.root(machineId));;
      } else if (machineDrawingPage) {
        navigate(PATH_MACHINE.machines.drawings.root(machineId));
      } else if (!customerPage && !machineDrawingPage && !machinePage && !machineDrawings) {
        navigate(PATH_MACHINE.documents.list);
      } else if (machineDrawings) {
        navigate(PATH_MACHINE_DRAWING.root);
      }
      enqueueSnackbar("Document Archived Successfully!", { variant: `success` });
    } catch (error) {
      enqueueSnackbar(error, { variant: `error` });
    }
  }

  const handleDeleteDrawing = async () => {
    try {
      await dispatch(deleteDrawing(drawing?._id));
      enqueueSnackbar(Snacks.deletedDrawing, { variant: `success` });
      if (customerPage) {
        navigate(PATH_CRM.customers.documents.root(customer?._id));
      } else if (machinePage) {
        navigate(PATH_MACHINE.machines.documents.root(machineId));;
      } else if (machineDrawingPage) {
        navigate(PATH_MACHINE.machines.drawings.root(machineId));
      } else if (!customerPage && !machineDrawingPage && !machinePage && !machineDrawings) {
        navigate(PATH_MACHINE.documents.list);
      } else if (machineDrawings) {
        navigate(PATH_MACHINE_DRAWING.root);
      }
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
            return {
              thumbnail: `data:image/png;base64, ${file.thumbnail}`,
              src: `data:image/png;base64, ${file.thumbnail}`,
              downloadFilename: `${file?.name}.${file?.extension}`,
              name: file?.name,
              title: <Grid>
                <Typography variant='h4'>{documentHistory?.machine?.serialNo} - {documentHistory?.machine?.name}</Typography>
                <Typography variant='body2'>{documentHistory?.displayName}</Typography>
                <Typography variant='body2'>{documentHistory?.docCategory?.name}</Typography>
              </Grid>,
              extension: file?.extension,
              category: file?.docCategory?.name,
              fileType: file?.fileType,
              isLoaded: false,
              _id: file?._id,
              version: files?.versionNo,
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

    if (!image?.isLoaded && image?.fileType?.startsWith('image')) {
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
      enqueueSnackbar('File Archived successfully');
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
  const [PDFName, setPDFName] = useState('');
  // const [pages, setPages] = useState(null);
  const [PDFViewerDialog, setPDFViewerDialog] = useState(false);

  const handleOpenFile = async (documentId, versionId, fileId, fileName, fileExtension) => {
    setPDFName(`${fileName}.${fileExtension}`);
    setPDFViewerDialog(true);
    setPDF(null);
    try {
      const response = await dispatch(getDocumentDownload(documentId, versionId, fileId));
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


  // const onDocumentLoadSuccess = ({ numPages }) => {
  //   setPages(numPages);
  // };

  const handleBackLink = () => {
    if (customerPage) {
      navigate(PATH_CRM.customers.documents.view.root(customerId, documentHistory?._id));
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.view.root(machineId, documentHistory?._id))
    } else if (machineDrawingPage) {
      navigate(PATH_MACHINE.machines.drawings.root(machineId))
    } else if (machineDrawings) {
      navigate(PATH_MACHINE_DRAWING.root)
    } else {
      navigate(PATH_MACHINE.documents.list)
    }
  }

  return (
    <>
      <Container maxWidth={false} sx={{ padding: (machineDrawings || customerPage || machinePage || machineDrawingPage) ? '0 !important' : '' }}>
        {!customerPage && !machinePage && !machineDrawingPage &&
          <DocumentCover content={defaultValues?.displayName} generalSettings />
        }

        <Grid item md={12} mt={2}>
          <Card sx={{ p: 3 }}>
            <ViewFormEditDeleteButtons
              customerPage={customerPage}
              machinePage={machinePage}
              drawingPage={machineDrawingPage}
              customerAccess={defaultValues?.customerAccess || documentHistory?.docType?.customerAccess || documentHistory?.docCategory?.customerAccess || false}
              customerAccessLabel={
                [
                  documentHistory?.customerAccess && ((machineDrawingPage || machineDrawings) ? 'Drawings' : 'Document'),
                  documentHistory?.docType?.customerAccess && 'Type',
                  documentHistory?.documentType?.customerAccess && 'Type',
                  documentHistory?.docCategory?.customerAccess && 'Category',
                  documentHistory?.documentCategory?.customerAccess && 'Category',
                ]
                  .filter(Boolean)
                  .join(', ')
                  .trim()
                  ? `Customer allowed from ${[
                    documentHistory?.customerAccess && 'Document',
                    documentHistory?.docType?.customerAccess && 'Type',
                    documentHistory?.documentType?.customerAccess && 'Type',
                    documentHistory?.docCategory?.customerAccess && 'Category',
                    documentHistory?.documentCategory?.customerAccess && 'Category',
                  ]
                    .filter(Boolean)
                    .join(', ')}`
                  : ''
              }
              isActive={defaultValues.isActive}
              handleEdit={(machineDrawingPage || (machineDrawings && !documentHistory?.machine && documentHistory?.productDrawings?.length === 0)) && !allowActions && handleEditDrawing}
              onDelete={machineDrawingPage ? !allowActions && handleDeleteDrawing : !((!machinePage && documentHistory?.machine?._id) || (!customerPage && documentHistory?.customer?._id) || (machineDrawings && documentHistory?.productDrawings?.length > 0)) && !allowActions && handleDelete || undefined}
              disableDeleteButton={machineDrawingPage && machine?.status?.slug === "transferred"}
              disableEditButton={machineDrawingPage && machine?.status?.slug === "transferred"}
              backLink={handleBackLink}
            />
            <Grid container sx={{ mt: 2 }}>
              <ViewFormField isLoading={isLoading} sm={6} heading="Name" param={defaultValues?.displayName} />
              <ViewFormField isLoading={isLoading}
                sm={6}
                NewVersion={!defaultValues.isArchived}
                handleNewVersion={!((!machinePage && documentHistory?.machine?._id) || (!customerPage && documentHistory?.customer?._id) || (machineDrawings && documentHistory?.productDrawings?.length > 0)) && !allowActions && handleNewVersion || undefined}
                handleUpdateVersion={!((!machinePage && documentHistory?.machine?._id) || (!customerPage && documentHistory?.customer?._id) || (machineDrawings && documentHistory?.productDrawings?.length > 0)) && !allowActions && handleUpdateVersion || undefined}
                heading="Active Version"
                node={
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

              {!customerPage && !machineDrawings && !machineDrawingPage && defaultValues.customer && (
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  variant='h4'
                  heading="Customer"
                  node={
                    defaultValues.customer && (
                      <Link onClick={handleCustomerDialog} href="#" underline="none">
                        {defaultValues.customer}
                      </Link>
                    )
                  }
                />
              )}

              {!machinePage && !machineDrawings && !machineDrawingPage && defaultValues?.machine && (
                <ViewFormField isLoading={isLoading}
                  sm={6}
                  heading="Machine"
                  variant='h4'
                  node={
                    defaultValues.machine && (
                      <Link onClick={() => handleMachineDialog(documentHistory?.machine?._id)} href="#" underline="none">
                        {defaultValues.machine}
                      </Link>
                    )
                  }
                />
              )}

              <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
              {((machineDrawingPage && documentHistory?.productDrawings?.length > 1) || machineDrawings) &&
                <ViewFormField isLoading={isLoading} sm={12} heading="Attached with Machines" node={<Grid container>{linkedDrawingMachines}</Grid>} />
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
                        sx={{ mt: 2, width: '100%' }}
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
                        {slides?.map((file, _index) => {
                          if (file?.version === version?.versionNo) {
                            return (
                              <DocumentGalleryItem isLoading={isLoading} key={file?.id} image={file}
                                onOpenLightbox={() => handleOpenLightbox(_index)}
                                onDownloadFile={() => handleDownloadFile(documentHistory._id, version._id, file._id, file?.name, file?.extension)}
                                onDeleteFile={!((!machinePage && documentHistory?.machine?._id) || (!customerPage && documentHistory?.customer?._id) || (machineDrawings && documentHistory?.productDrawings?.length > 0)) && (() => handleDeleteFile(documentHistory._id, version._id, file._id)) || undefined}
                                isArchived={customer?.isArchived || machine?.isArchived}
                                toolbar
                              />
                            )
                          }

                          return null;
                        }
                        )}

                        {version?.files?.map((file, _index) => {
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
                                onDeleteFile={!((!machinePage && documentHistory?.machine?._id) || (!customerPage && documentHistory?.customer?._id) || (machineDrawings && documentHistory?.productDrawings?.length > 0)) && (() => handleDeleteFile(documentHistory._id, version._id, file._id)) || undefined}
                                onOpenFile={() => handleOpenFile(documentHistory._id, version._id, file._id, file)}
                                isArchived={customer?.isArchived || machine?.isArchived}
                                toolbar
                              />
                            );
                          }
                          return null;
                        })}

                        {index === 0 && !defaultValues.isArchived && !((!machinePage && documentHistory?.machine?._id) || (!customerPage && documentHistory?.customer?._id) || (machineDrawings && documentHistory?.productDrawings?.length > 0)) && (<ThumbnailDocButton onClick={handleNewFile} />)}
                      </Box>
                      <ViewFormAudit key={`${index}-files`} defaultValues={fileValues} />
                    </Grid>
                  )
                })}

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
        {documentVersionEditDialogVisibility && <UpdateDocumentVersionDialog />}
      </Container>
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
    </>
  );
}

export default memo(DocumentHistoryViewForm)