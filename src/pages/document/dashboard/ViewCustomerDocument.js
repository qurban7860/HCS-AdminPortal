import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Card, Tooltip, Typography, Dialog, Link } from '@mui/material';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
// route
import { PATH_CUSTOMER } from '../../../routes/paths';
// components
import DialogCustomer from '../../components/Dialog/Dialogs/DialogCustomer';
import { Cover } from '../../components/Defaults/Cover';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { getCustomerDocumentHistory } from '../../../redux/slices/document/customerDocument';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/document-constants';
import { FORMLABELS as formLABEL } from '../../../constants/default-constants';

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
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={defaultValues.displayName} />
      </StyledCardContainer>
      {/* view form */}
      <Grid container>
        <Card sx={{ p: 3 }}>
          {/* necessary. dont delete */}
          {/* <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/> */}
          <Grid display="inline-flex">
            <ViewFormField isActive={defaultValues.isActive} />
            <ViewFormField customerAccess={defaultValues?.customerAccess} />
          </Grid>
          <Grid container>
            <ViewFormField
              sm={6}
              heading={FORMLABELS.CUSTOMER.NAME}
              param={defaultValues?.displayName}
            />
            <ViewFormField
              sm={6}
              heading={FORMLABELS.ACTIVE_VERSION}
              numberParam={defaultValues?.documentVersion}
            />
            <ViewFormField
              sm={6}
              heading={FORMLABELS.DOCUMENT_TYPE}
              param={defaultValues?.docType}
            />
            <ViewFormField
              sm={6}
              heading={FORMLABELS.DOCUMENT_CATEGORY}
              param={defaultValues?.docCategory}
            />
            <ViewFormField
              sm={6}
              heading={formLABEL._def.CUSTOMER}
              objectParam={
                defaultValues.customer && (
                  <Link onClick={handleOpenCustomer} href="#" underline="none">
                    {defaultValues.customer}
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
            {customerDocumentHistory &&
              customerDocumentHistory?.documentVersions?.map((files) => (
                <Grid container>
                  <FormLabel content={`Version No. ${files?.versionNo}`} />
                  <Grid container>
                    {defaultValues.description !== files?.description && (
                      <ViewFormField sm={12} heading="Description" param={files?.description} />
                    )}
                  </Grid>
                  {files?.files?.map((file) => (
                    <Grid sx={{ display: 'flex-inline', m: 0.5 }}>
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
      <DialogCustomer
        open={openCustomer}
        onClose={handleCloseCustomer}
        customer={customer}
        onClick={() => handleViewCustomer(customer._id)}
      />
    </Container>
  );
}
