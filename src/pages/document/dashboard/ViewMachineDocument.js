import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Container, Grid, Card, Link } from '@mui/material';
// slices
import { getMachineDocumentHistory } from '../../../redux/slices/document/machineDocument';
// route
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
// components
import DialogCustomer from '../../components/Dialog/Dialogs/DialogCustomer';
import DialogMachine from '../../components/Dialog/Dialogs/DialogMachine';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { Cover } from '../../components/Defaults/Cover';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormField from '../../components/ViewForms/ViewFormField';
import { StyledCardContainer } from '../../../theme/styles/default-styles';
// constants
import { FORMLABELS } from '../../../constants/document-constants';
import { FORMLABELS as formLABEL } from '../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function Document() {
  const navigate = useNavigate();
  const { machineDocumentHistory } = useSelector((state) => state.machineDocument);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openMachine, setOpenMachine] = useState(false);
  const dispatch = useDispatch();

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
      displayName: machineDocumentHistory?.displayName || '',
      documentName: machineDocumentHistory?.documentName?.name || '',
      docCategory: machineDocumentHistory?.docCategory?.name || '',
      docType: machineDocumentHistory?.docType?.name || '',
      customer: machineDocumentHistory?.customer?.name || '',
      machine: machineDocumentHistory?.machine?.name || '',
      customerAccess: machineDocumentHistory?.customerAccess,
      isActiveVersion: machineDocumentHistory?.isActiveVersion,
      documentVersion:
        machineDocumentHistory?.documentVersions?.length > 0
          ? machineDocumentHistory?.documentVersions[0]?.versionNo
          : '',
      description: machineDocumentHistory?.description,
      isActive: machineDocumentHistory?.isActive,
      createdAt: machineDocumentHistory?.createdAt || '',
      createdByFullName: machineDocumentHistory?.createdBy?.name || '',
      createdIP: machineDocumentHistory?.createdIP || '',
      updatedAt: machineDocumentHistory?.updatedAt || '',
      updatedByFullName: machineDocumentHistory?.updatedBy?.name || '',
      updatedIP: machineDocumentHistory?.updatedIP || '',
    }),
    [machineDocumentHistory]
  );
  const callAfterDelete = () => {
    dispatch(getMachineDocumentHistory(machineDocumentHistory._id));
  };
  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={defaultValues.displayName} />
      </StyledCardContainer>
      <Grid container>
        <Card sx={{ p: 3 }}>
          {/* necessary. don't delete */}
          {/* <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/> */}
          <Grid display="inline-flex">
            <ViewFormField isActive={defaultValues.isActive} />
            <ViewFormField customerAccess={defaultValues?.customerAccess} />
          </Grid>
          <Grid container>
            <ViewFormField
              sm={6}
              heading={FORMLABELS.MACHINE.NAME}
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
              sm={6}
              heading={formLABEL._def.MACHINE}
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
            {machineDocumentHistory &&
              machineDocumentHistory?.documentVersions?.map((files) => (
                <Grid container>
                  <Grid container sx={{ pt: '2rem' }}>
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
                    <Grid item sx={{ display: 'flex-inline', m: 0.5 }}>
                      <Grid container justifyContent="flex-start" gap={1}>
                        <Thumbnail
                          key={file._id}
                          file={file}
                          currentDocument={machineDocumentHistory}
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

      {/* dialog for machine */}
      <DialogMachine
        open={openMachine}
        onClose={handleCloseMachine}
        machine={machine}
        onClick={() => handleViewMachine(machine._id)}
      />
    </Container>
  );
}
