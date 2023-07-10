import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import download from 'downloadjs';
import {
  Container,
  Grid,
  Card,
  Tooltip,
  Typography,
  Dialog,
  Link,
  DialogContent,
} from '@mui/material';
import { PATH_CUSTOMER, PATH_MACHINE, PATH_DOCUMENT } from '../../../../routes/paths';
import { useSnackbar } from '../../../../components/snackbar';
import ViewFormAudit from '../../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../../components/ViewForms/ViewFormField';
import { getDocumentDownload } from '../../../../redux/slices/document/documentFile';
import {
  getDocumentHistory,
  getDocuments,
  deleteDocument,
  resetActiveDocuments,
} from '../../../../redux/slices/document/document';
import { getCustomer, resetCustomer } from '../../../../redux/slices/customer/customer';
import { getMachine, resetMachine } from '../../../../redux/slices/products/machine';
import { Thumbnail } from '../../../components/Thumbnails/Thumbnail';
import FormLabel from '../../../components/DocumentForms/FormLabel';
import DialogLink from '../../../components/Dialog/DialogLink';
import DialogLabel from '../../../components/Dialog/DialogLabel';
// constants
import { document as documentType, FORMLABELS } from '../../../../constants/document-constants';
import { FORMLABELS as DIALOGLABELS } from '../../../../constants/default-constants';
import DocumentCover from '../../../components/DocumentForms/DocumentCover';

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
  const [onPreview, setOnPreview] = useState(false);
  const [imageData, setImageData] = useState(false);
  const [imageName, setImageName] = useState('');
  const [imageExtension, setImageExtension] = useState('');

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
      navigate(PATH_DOCUMENT.document.list);
      enqueueSnackbar('Document deleted Successfully!');
    } catch (err) {
      enqueueSnackbar('Document delete failed!', { variant: `error` });
      console.log('Error:', err);
    }
  };

  const handleEdit = async () => {
    navigate(PATH_DOCUMENT.document.edit(id));
  };

  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleViewCustomer = (Id) => {
    navigate(PATH_CUSTOMER.view(Id));
  };
  const handleViewMachine = (Id) => {
    navigate(PATH_MACHINE.machines.view(Id));
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

  const callAfterDelete = () => {
    dispatch(getDocumentHistory(id));
  };

  return (
    <>
      <Container maxWidth={false}>
        <DocumentCover content={defaultValues?.displayName} />
        <Grid container>
          <Grid item md={12} mt={2}>
            <Card sx={{ p: 3 }}>
              <Grid display="inline-flex">
                <ViewFormField isActive={defaultValues.isActive} />
                <ViewFormField customerAccess={defaultValues?.customerAccess} />
              </Grid>
              <Grid container>
                <ViewFormField
                  sm={6}
                  heading={FORMLABELS.DOCUMENT_NAME}
                  param={defaultValues?.displayName}
                />
                <ViewFormField
                  sm={6}
                  heading={FORMLABELS.ACTIVE_VERSION}
                  objectParam={
                    defaultValues.documentVersion && (
                      <Typography display="flex">
                        {defaultValues.versionPrefix} {defaultValues.documentVersion}
                      </Typography>
                    )
                  }
                />
                <ViewFormField
                  sm={6}
                  heading={FORMLABELS.DOCUMENT_TYPE}
                  param={defaultValues?.docType}
                />
                <ViewFormField
                  sm={6}
                  heading={FORMLABELS.DOCUMENT_CUSTOMER}
                  objectParam={
                    defaultValues.customer && (
                      <Link onClick={handleOpenCustomer} href="#" underline="none">
                        {defaultValues.customer}
                      </Link>
                    )
                  }
                />
                <ViewFormField
                  sm={6}
                  heading={FORMLABELS.DOCUMENT_MACHINE}
                  objectParam={
                    defaultValues.machine && (
                      <Link onClick={handleOpenMachine} href="#" underline="none">
                        {defaultValues.machine}
                      </Link>
                    )
                  }
                />
                <ViewFormField
                  sm={12}
                  heading={FORMLABELS.DOCUMENT_DESC}
                  param={defaultValues?.description}
                />
                <Grid container sx={{ mt: '1rem', mb: '-1rem' }}>
                  <ViewFormAudit defaultValues={defaultValues} />
                </Grid>
                {documentHistory &&
                  documentHistory?.documentVersions?.map((files) => (
                    <Grid container>
                      <Grid container sx={{ pt: '2rem' }} mb={1}>
                        <FormLabel content={`Version No. ${files?.versionNo}`} />
                        {defaultValues.description !== files?.description && (
                          <ViewFormField
                            sm={12}
                            heading={FORMLABELS.DOCUMENT_DESC}
                            param={files?.description}
                          />
                        )}
                      </Grid>
                      {files?.files?.map((file) => (
                        <Grid sx={{ display: 'flex-inline', m: 0.5 }}>
                          <Grid container justifyContent="flex-start" gap={1}>
                            <Thumbnail
                              // sx={{m:2}}
                              key={file?._id}
                              file={file}
                              currentDocument={documentHistory}
                              customer={customer}
                              getCallAfterDelete={callAfterDelete}
                            />
                          </Grid>
                        </Grid>
                      ))}
                    </Grid>
                  ))}
              </Grid>
            </Card>
          </Grid>
        </Grid>
      </Container>

      {/* dialog for customer */}
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogLabel onClick={handleCloseCustomer} content={DIALOGLABELS._def.CUSTOMER} />
        <Grid item container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={12} heading={FORMLABELS.CUSTOMER.NAME} param={customer?.name} />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.TRADING_NAME}
            param={customer?.tradingName}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.PHONE}
            param={customer?.mainSite?.phone}
          />
          <ViewFormField sm={6} heading={FORMLABELS.CUSTOMER.FAX} param={customer?.mainSite?.fax} />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.EMAIL}
            param={customer?.mainSite?.email}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.SITE_NAME}
            param={customer?.mainSite?.name}
          />
          <FormLabel content={DIALOGLABELS.ADDRESS} />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.ADDRESS.STREET}
            param={customer?.mainSite?.address?.street}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.ADDRESS.SUBURB}
            param={customer?.mainSite?.address?.suburb}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.ADDRESS.CITY}
            param={customer?.mainSite?.address?.city}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.ADDRESS.REGION}
            param={customer?.mainSite?.address?.region}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.ADDRESS.POSTCODE}
            param={customer?.mainSite?.address?.postcode}
          />
          <ViewFormField
            sm={12}
            heading={FORMLABELS.CUSTOMER.ADDRESS.COUNTRY}
            param={customer?.mainSite?.address?.country}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.BILLING}
            param={
              customer?.primaryBillingContact &&
              `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
            }
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.TECHNICAL}
            param={
              customer?.primaryTechnicalContact &&
              `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
            }
          />
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <FormLabel content={DIALOGLABELS.HOWICK} />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.ACCOUNT}
            param={customer?.accountManager?.firstName}
            secondParam={customer?.accountManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.PROJECT}
            param={customer?.projectManager?.firstName}
            secondParam={customer?.projectManager?.lastName}
          />
          <ViewFormField
            sm={6}
            heading={FORMLABELS.CUSTOMER.SUPPORT}
            param={customer?.supportManager?.firstName}
            secondParam={customer?.supportManager?.lastName}
          />
        </Grid>
        <DialogLink onClick={() => handleViewCustomer(customer._id)} content="Go to customer" />
      </Dialog>

      {/* dialog for machine */}
      <Dialog
        disableEnforceFocus
        maxWidth="md"
        open={openMachine}
        onClose={handleCloseMachine}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogLabel onClick={() => handleCloseMachine()} content="Machine" />
        <DialogContent dividers>
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
          <Grid item sx={{ px: 2, pb: 3 }}>
            <FormLabel content="Howick Resources" />
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
        </DialogContent>
        <DialogLink onClick={() => handleViewMachine(machine._id)} content="Go to machine" />
      </Dialog>
    </>
  );
}
