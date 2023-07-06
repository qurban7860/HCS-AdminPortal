import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Card, Tooltip, Typography, Dialog, Link } from '@mui/material';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { PATH_CUSTOMER } from '../../../routes/paths';
import { Cover } from '../../components/Defaults/Cover';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import DialogLabel from '../../components/Dialog/DialogLabel';
import DialogLink from '../../components/Dialog/DialogLink';
import { getCustomerDocumentHistory } from '../../../redux/slices/document/customerDocument'
// ----------------------------------------------------------------------

export default function Document() {
  const navigate = useNavigate();
  const { customerDocument, customerDocumentHistory } = useSelector(
    (state) => state.customerDocument
  );
  const { customer } = useSelector((state) => state.customer);
  const [openCustomer, setOpenCustomer] = useState(false);
  const dispatch = useDispatch();
  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleViewCustomer = (Id) => {
    navigate(PATH_CUSTOMER.view(Id));
  };
  const defaultValues = useMemo(
    () => ({
      displayName: customerDocumentHistory?.displayName || '',
      documentName: customerDocumentHistory?.documentName?.name || '',
      docCategory: customerDocumentHistory?.docCategory?.name || '',
      docType: customerDocumentHistory?.docType?.name || '',
      customer: customerDocumentHistory?.customer?.name || '',
      customerAccess: customerDocumentHistory?.customerAccess,
      isActiveVersion: customerDocumentHistory?.isActiveVersion,
      documentVersion:
        customerDocumentHistory?.documentVersions?.length > 0
          ? customerDocumentHistory?.documentVersions[0]?.versionNo
          : '',
      description: customerDocumentHistory?.description,
      isActive: customerDocumentHistory?.isActive,
      createdAt: customerDocumentHistory?.createdAt || '',
      createdByFullName: customerDocumentHistory?.createdBy?.name || '',
      createdIP: customerDocumentHistory?.createdIP || '',
      updatedAt: customerDocumentHistory?.updatedAt || '',
      updatedByFullName: customerDocumentHistory?.updatedBy?.name || '',
      updatedIP: customerDocumentHistory?.updatedIP || '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [customerDocumentHistory]
  );
  const callAfterDelete = () => {
    dispatch(getCustomerDocumentHistory(customerDocumentHistory._id));
  }
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
      <Grid container>
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
              numberParam={defaultValues?.documentVersion}
            />
            <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
            <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
            <ViewFormField
              sm={6}
              heading="Customer"
              objectParam={
                defaultValues.customer && (
                  <Link onClick={handleOpenCustomer} href="#" underline="none">
                    {defaultValues.customer}
                  </Link>
                )
              }
            />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            <Grid container sx={{ mt: '1rem', mb: '-1rem' }}>
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
            {customerDocumentHistory &&
              customerDocumentHistory?.documentVersions?.map((files) => (
                <Grid container>
                  <FormLabel content={`Version No. ${files?.versionNo}`} />
                  <Grid container >
                    {defaultValues.description !== files?.description && <ViewFormField sm={12} heading="Description" param={files?.description} />}
                  </Grid>
                  {files?.files?.map((file) => (
                    <Grid  sx={{ display: 'flex-inline', m:0.5 }}>
                      <Grid container justifyContent="flex-start" gap={1}>
                        <Thumbnail
                          key={file?._id}
                          file={file}
                          currentDocument={customerDocumentHistory}
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

      {/* dialog for customer */}
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        keepMounted
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogLabel onClick={() => handleCloseCustomer()} content="Customer" />

        <Grid item container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={12} heading="Name" param={customer?.name} />
          <ViewFormField sm={6} heading="Trading Name" param={customer?.tradingName} />
          <ViewFormField sm={6} heading="Phone" param={customer?.mainSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={customer?.mainSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={customer?.mainSite?.email} />
          <ViewFormField sm={6} heading="Site Name" param={customer?.mainSite?.name} />
          <FormLabel content="Address Information" />
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
              customer?.primaryBillingContact &&
              `${customer?.primaryBillingContact?.firstName} ${customer?.primaryBillingContact?.lastName}`
            }
          />
          <ViewFormField
            sm={6}
            heading="Primary Technical Contact"
            param={
              customer?.primaryTechnicalContact &&
              `${customer?.primaryTechnicalContact?.firstName} ${customer?.primaryTechnicalContact?.lastName}`
            }
          />
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
          <FormLabel content="Howick Resources" />
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
        <DialogLink onClick={() => handleViewCustomer(customer._id)} content="Go to customer" />
      </Dialog>
    </Container>
  );
}
