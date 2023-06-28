import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import download from 'downloadjs';
import { styled, alpha, useTheme } from '@mui/material/styles';
import {
  CardContent,
  IconButton,
  CardMedia,
  Container,
  Grid,
  Card,
  Tooltip,
  Typography,
  Dialog,
  Link,
  Stack,
} from '@mui/material';
import { PATH_DASHBOARD, PATH_MACHINE, PATH_DOCUMENT } from '../../../../routes/paths';
import { Cover } from '../../../components/Cover';
import Iconify from '../../../../components/iconify';
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../components/ViewFormAudit';
import ViewFormField from '../../../components/ViewFormField';
import { getDocumentDownload } from '../../../../redux/slices/document/documentFile';
import {
  getDocument,
  getDocumentHistory,
  getDocuments,
  resetDocument,
  deleteDocument,
  resetActiveDocuments,
} from '../../../../redux/slices/document/document';
import { getCustomer, resetCustomer } from '../../../../redux/slices/customer/customer';
import { getMachine, resetMachine } from '../../../../redux/slices/products/machine';
import CustomAvatar from '../../../../components/custom-avatar/CustomAvatar';
import ImagePreviewDialog from '../../../components/ImagePreviewDialog';

// ----------------------------------------------------------------------

export default function Document() {
  const dispatch = useDispatch();
  // const theme = useTheme();
  const navigate = useNavigate();
  const { id } = useParams();
  const regEx = /^[^2]*/;
  const { enqueueSnackbar } = useSnackbar();

  const { document, documentHistory } = useSelector((state) => state.document);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  // console.log("document : ",document)
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openMachine, setOpenMachine] = useState(false);

  useEffect(() => {
    dispatch(resetActiveDocuments());
    dispatch(resetMachine());
    dispatch(resetCustomer());
    dispatch(getDocumentHistory(id));
  }, [id, dispatch]);

  useEffect(() => {
    if (documentHistory?.machine) {
      dispatch(getMachine(documentHistory.machine._id));
    }
  }, [documentHistory, dispatch]);

  useEffect(() => {
    if (documentHistory?.customer) {
      dispatch(getCustomer(documentHistory.customer._id));
    }
  }, [documentHistory, dispatch]);

  const onDelete = async () => {
    try {
      await dispatch(deleteDocument(id));
      dispatch(getDocuments());
      navigate(PATH_DASHBOARD.document.dashboard);
      enqueueSnackbar('Document deleted Successfully!');
    } catch (err) {
      enqueueSnackbar('Document delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_DASHBOARD.document.edit(id));
  };

  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleViewCustomer = (Id) => {
    navigate(PATH_DASHBOARD.customer.view(Id));
  };
  const handleViewMachine = (Id) => {
    navigate(PATH_MACHINE.machine.view(Id));
  };
  const handleOpenMachine = () => setOpenMachine(true);
  const handleCloseMachine = () => setOpenMachine(false);
  const defaultValues = useMemo(
    () => ({
      displayName: documentHistory?.displayName || '',
      documentName: documentHistory?.documentName?.name || '',
      docCategory: documentHistory?.docCategory?.name || '',
      docType: documentHistory?.docType?.name || '',
      customer: documentHistory?.customer?.name || '',
      site: documentHistory?.site?.name || '',
      contact: documentHistory?.contact?.name || '',
      machine: documentHistory?.machine?.serialNo || '',
      model: documentHistory?.machineModel?.name || '',
      customerAccess: documentHistory?.customerAccess,
      isActiveVersion: documentHistory?.isActiveVersion,
      documentVersion:
        documentHistory?.documentVersions?.length > 0
          ? documentHistory?.documentVersions[0]?.versionNo
          : '',
      versionPrefix: documentHistory?.versionPrefix || '',
      description: documentHistory?.description,
      isActive: documentHistory?.isActive,
      createdAt: documentHistory?.createdAt || '',
      createdByFullName: documentHistory?.createdBy?.name || '',
      createdIP: documentHistory?.createdIP || '',
      updatedAt: documentHistory?.updatedAt || '',
      updatedByFullName: documentHistory?.updatedBy?.name || '',
      updatedIP: documentHistory?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [documentHistory]
  );

  const handleDownload = (documentId, versionId, fileId, fileName, fileExtension) => {
    dispatch(getDocumentDownload(documentId, versionId, fileId))
      .then((res) => {
        // console.log("res : ",res)
        if (regEx.test(res.status)) {
          download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension });
          // downloadBase64File(res.data, `${fileName}.${fileExtension}`);
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

  const [onPreview, setOnPreview] = useState(false);
  const [imageData, setImageData] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageExtension, setImageExtension] = useState('');

  const handleOpenPreview = () => {
    setOnPreview(true);
  };
  const handleClosePreview = () => {
    setOnPreview(false);
  };

  const handleDownloadImage = (fileName, fileExtension) => {
    download(atob(imageData), `${fileName}.${fileExtension}`, { type: fileExtension });
  };

  const handleDownloadAndPreview = (documentId, versionId, fileId, fileName, fileExtension) => {
    setImageName(fileName);
    setImageExtension(fileExtension);
    dispatch(getDocumentDownload(documentId, versionId, fileId))
      .then((res) => {
        if (regEx.test(res.status)) {
          setImageData(res.data);
          handleOpenPreview();
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

  const documentType = {
    icon: {
      pdf: 'bxs:file-pdf',
      doc: 'mdi:file-word',
      docx: 'mdi:file-word',
      xls: 'mdi:file-excel',
      xlsx: 'mdi:file-excel',
      ppt: 'mdi:file-powerpoint',
      pptx: 'mdi:file-powerpoint',
    },
    color: {
      pdf: '#f44336',
      doc: '#448aff',
      docx: '#448aff',
      xls: '#388e3c',
      xlsx: '#388e3c',
      ppt: '#e65100',
      pptx: '#e65100',
    },
  };

  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
        }}
      >
        <Cover name={defaultValues.displayName} icon="material-symbols:list-alt-outline" />
      </Card>
      <Grid container item md={12}>
        <Card sx={{ p: 3 }}>
          {/* <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/> */}
          <Grid display="inline-flex">
            <Tooltip>
              <ViewFormField isActive={defaultValues.isActive} />
            </Tooltip>
            <Tooltip>
              <ViewFormField customerAccess={defaultValues?.customerAccess} />
            </Tooltip>
          </Grid>
          <Grid container>
            <ViewFormField sm={6} heading="Name" param={defaultValues?.displayName} />
            <ViewFormField
              sm={6}
              heading="Active Version"
              objectParam={
                defaultValues.documentVersion ? (
                  <Typography display="flex">
                    {defaultValues.versionPrefix} {defaultValues.documentVersion}
                  </Typography>
                ) : (
                  ''
                )
              }
            />
            <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
            <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
            <ViewFormField
              sm={6}
              heading="Customer"
              objectParam={
                defaultValues.customer ? (
                  <Link onClick={handleOpenCustomer} href="#" underline="none">
                    {defaultValues.customer}
                  </Link>
                ) : (
                  ''
                )
              }
            />
            <ViewFormField
              sm={6}
              heading="Machine"
              objectParam={
                defaultValues.machine ? (
                  <Link onClick={handleOpenMachine} href="#" underline="none">
                    {defaultValues.machine}
                  </Link>
                ) : (
                  ''
                )
              }
            />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            <Grid container sx={{ mt: '1rem', mb: '-1rem' }}>
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
            {documentHistory &&
              documentHistory?.documentVersions?.map((files) => (
                <Grid container>
                  <Grid container sx={{ pt: '2rem' }}>
                    <Grid
                      item
                      xs={12}
                      sm={12}
                      sx={{
                        backgroundImage: (theme) =>
                          `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
                      }}
                    >
                      <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'white' }}>
                        Version No. {files?.versionNo}
                      </Typography>
                    </Grid>
                    <ViewFormField sm={12} heading="Description" param={files?.description} />
                  </Grid>
                  {files?.files?.map((file) => (
                    <Grid item sx={{ display: 'flex-inline' }}>
                      <Grid container justifyContent="flex-start" gap={1}>
                        {file?.fileType.startsWith('image') ? (
                          <Card sx={{ height: '140px', width: '140px', m: 1 }}>
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ bgcolor: 'lightgray', alignContent: 'center', width: '140px' }}
                            >
                              <CardContent
                                component={Stack}
                                display="block"
                                height="110px"
                                sx={{ position: 'relative', zIndex: '1' }}
                              >
                                <Link>
                                  <IconButton
                                    size="small"
                                    onClick={() => {
                                      handleDownloadAndPreview(
                                        documentHistory._id,
                                        files._id,
                                        file._id,
                                        file.name,
                                        file.extension
                                      );
                                    }}
                                    sx={{
                                      top: 4,
                                      left: 76,
                                      zIndex: 9,
                                      height: '60',
                                      position: 'absolute',
                                      color: (theme) => alpha(theme.palette.common.white, 0.8),
                                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                      '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                      },
                                    }}
                                  >
                                    <Iconify icon="icon-park-outline:preview-open" width={18} />
                                  </IconButton>
                                </Link>
                                <ImagePreviewDialog
                                  onPreview={onPreview}
                                  handleClosePreview={handleClosePreview}
                                  handleDownloadImage={handleDownloadImage}
                                  imageName={imageName}
                                  imageExtension={imageExtension}
                                  file={file}
                                  imageData={imageData}
                                />
                                <Link>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDownload(
                                        documentHistory._id,
                                        files._id,
                                        file._id,
                                        file.name,
                                        file.extension
                                      )
                                    }
                                    sx={{
                                      top: 4,
                                      left: 108,
                                      zIndex: 9,
                                      height: '60',
                                      position: 'absolute',
                                      color: (theme) => alpha(theme.palette.common.white, 0.8),
                                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                      '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                      },
                                    }}
                                  >
                                    <Iconify icon="line-md:download-loop" width={18} />
                                  </IconButton>
                                </Link>
                                <CardMedia
                                  component="img"
                                  sx={{
                                    height: '110px',
                                    opacity: '0.6',
                                    display: 'block',
                                    zIndex: '-1',
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    right: '0',
                                    bottom: '0',
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                  image={`data:image/png;base64, ${file?.thumbnail}`}
                                  alt="customer's contact cover photo was here"
                                />
                              </CardContent>
                            </Grid>
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ textAlign: 'center', width: '140px', mt: 0.7 }}
                            >
                              <Tooltip title={file.name} arrow>
                                <Typography variant="body2">
                                  {file?.name?.length > 15
                                    ? file?.name?.substring(0, 15)
                                    : file?.name}{' '}
                                  {file?.name?.length > 15 ? '...' : null}
                                </Typography>
                              </Tooltip>
                            </Grid>
                          </Card>
                        ) : (
                          <Card sx={{ height: '140px', width: '140px', m: 1 }}>
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ bgcolor: 'lightgray', alignContent: 'center', width: '140px' }}
                            >
                              <CardContent
                                component={Stack}
                                display="block"
                                height="110px"
                                sx={{ position: 'relative', zIndex: '1' }}
                              >
                                <Link>
                                  <IconButton
                                    size="small"
                                    onClick={() =>
                                      handleDownload(
                                        documentHistory._id,
                                        files._id,
                                        file._id,
                                        file.name,
                                        file.extension
                                      )
                                    }
                                    sx={{
                                      top: 4,
                                      left: 108,
                                      zIndex: 9,
                                      height: '60',
                                      position: 'absolute',
                                      color: (theme) => alpha(theme.palette.common.white, 0.8),
                                      bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                      '&:hover': {
                                        bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                      },
                                    }}
                                  >
                                    <Iconify icon="line-md:download-loop" width={18} />
                                  </IconButton>
                                </Link>
                                <Iconify
                                  sx={{
                                    height: '90px',
                                    opacity: '0.6',
                                    display: 'block',
                                    zIndex: '-1',
                                    position: 'absolute',
                                    top: '0',
                                    left: '0',
                                    right: '0',
                                    bottom: '0',
                                    width: '100%',
                                    objectFit: 'cover',
                                    objectPosition: 'center',
                                  }}
                                  icon={documentType.icon[file.extension]}
                                  color={documentType.color[file.extension]}
                                />
                              </CardContent>
                            </Grid>
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ textAlign: 'center', width: '140px', mt: 0.7 }}
                            >
                              <Tooltip title={file.name} arrow>
                                <Typography variant="body2">
                                  {file?.name?.length > 15
                                    ? file?.name?.substring(0, 15)
                                    : file?.name}{' '}
                                  {file?.name?.length > 15 ? '...' : null}
                                </Typography>
                              </Tooltip>
                            </Grid>
                          </Card>
                        )}
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ))}
          </Grid>
        </Card>
      </Grid>
      <Dialog
        disableEnforceFocus
        open={openCustomer}
        onClose={handleCloseCustomer}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            Customer{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseCustomer()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid item container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={12} heading="Name" param={customer?.name} />
          <ViewFormField sm={6} heading="Trading Name" param={customer?.tradingName} />
          <ViewFormField sm={6} heading="Phone" param={customer?.mainSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={customer?.mainSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={customer?.mainSite?.email} />
          <ViewFormField sm={6} heading="Site Name" param={customer?.mainSite?.name} />
          <Grid item container sx={{ pt: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'primary.contrastText' }}>
                Address Information
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField sm={6} heading="Street" param={customer?.mainSite?.address?.street} />
          <ViewFormField sm={6} heading="Suburb" param={customer?.mainSite?.address?.suburb} />
          <ViewFormField sm={6} heading="City" param={customer?.mainSite?.address?.city} />
          <ViewFormField sm={6} heading="Region" param={customer?.mainSite?.address?.region} />
          <ViewFormField sm={6} heading="Post Code" param={customer?.mainSite?.address?.postcode} />
          <ViewFormField sm={12} heading="Country" param={customer?.mainSite?.address?.country} />
          <ViewFormField
            sm={6}
            heading="Primary Biling Contact"
            param={
              customer?.primaryBillingContact
                ? `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
                : ''
            }
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact
                ? `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
                : ''
            }
          />
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <Grid item container sx={{ pt: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.main} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'primary.contrastText' }}>
                Howick Resources{' '}
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={customer?.accountManager?.firstName}
            secondParam={customer?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={customer?.projectManager?.firstName}
            secondParam={customer?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={customer?.supportManager?.firstName}
            secondParam={customer?.supportManager?.lastName}
          />
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
          <Link
            onClick={() => handleViewCustomer(customer._id)}
            href="#"
            underline="none"
            sx={{
              ml: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 3,
              pb: 3,
            }}
          >
            {' '}
            <Typography variant="body" sx={{ px: 2 }}>
              Go to customer
            </Typography>
            <Iconify icon="mdi:share" />
          </Link>
        </Grid>
      </Dialog>
      <Dialog
        disableEnforceFocus
        maxWidth="md"
        open={openMachine}
        onClose={handleCloseMachine}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            Machine{' '}
          </Typography>{' '}
          <Link onClick={() => handleCloseMachine()} href="#" underline="none" sx={{ ml: 'auto' }}>
            {' '}
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        <Grid container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={6} heading="Serial No" param={machine?.serialNo} />
          <ViewFormField sm={6} heading="Name" param={machine?.name} />
          <ViewFormField
            sm={6}
            heading="Previous Machine Serial No"
            param={machine?.parentSerialNo}
          />
          <ViewFormField sm={6} heading="Previous Machine" param={machine?.parentMachine?.name} />
          <ViewFormField sm={6} heading="Supplier" param={machine?.supplier?.name} />
          <ViewFormField sm={6} heading="Machine Model" param={machine?.machineModel?.name} />
          {/* <ViewFormField sm={6} heading="Status"                      param={machine?.status?.name} /> */}
          {/* <ViewFormField sm={6} heading="Work Order / Perchase Order" param={machine?.workOrderRef} /> */}
          {/* <ViewFormField sm={12} heading="Customer"                   param={machine?.customer?.name }/> */}
          <ViewFormField
            sm={6}
            heading="Installation Site"
            param={machine?.instalationSite?.name}
          />
          <ViewFormField sm={6} heading="Billing Site" param={machine?.billingSite?.name} />
          <ViewFormField sm={12} heading="Nearby Milestone" param={machine?.siteMilestone} />
          {/* <Grid item xs={12} sm={12} sx={{ px:2,py:1, overflowWrap: "break-word", }}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}> Description </Typography>
            {machine?.description && <Typography variant="body1" component="p" >
                {descriptionExpanded ? machine?.description : `${machine?.description.slice(0, 90)}...`}{machine?.description?.length > 90 && (
                <Button onClick={handleDescriptionExpandedToggle} color="primary">
                  {descriptionExpanded ? 'See Less' : 'See More'}
                </Button>)}
            </Typography>}
          </Grid> */}
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <Grid item container sx={{ py: '2rem' }}>
            <Grid
              item
              xs={12}
              sm={12}
              sx={{
                backgroundImage: (theme) =>
                  `linear-gradient(to right, ${theme.palette.primary.lighter} ,  white)`,
              }}
            >
              <Typography variant="h6" sm={12} sx={{ ml: '1rem', color: 'primary.contrastText' }}>
                Howick Resources{' '}
              </Typography>
            </Grid>
          </Grid>
          <ViewFormField
            sm={6}
            heading="Account Manager"
            param={machine?.accountManager?.firstName}
            secondParam={machine?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Project Manager"
            param={machine?.projectManager?.firstName}
            secondParam={machine?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading="Suppport Manager"
            param={machine?.supportManager?.firstName}
            secondParam={machine?.supportManager?.lastName}
          />
        </Grid>
        <Grid item sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} sm={12}>
          <Link
            onClick={() => handleViewMachine(machine._id)}
            href="#"
            underline="none"
            sx={{
              ml: 'auto',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              px: 3,
              pb: 3,
            }}
          >
            {' '}
            <Typography variant="body" sx={{ px: 2 }}>
              Go to Machine
            </Typography>
            <Iconify icon="mdi:share" />
          </Link>
        </Grid>
      </Dialog>
    </Container>
  );
}
