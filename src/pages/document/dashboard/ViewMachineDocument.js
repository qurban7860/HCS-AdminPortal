import { Helmet } from 'react-helmet-async';
import { useState, useMemo, useEffect, useLayoutEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Grid, Card, Tooltip, Dialog, Link } from '@mui/material';
import { Thumbnail } from '../../components/Thumbnails/Thumbnail';
import FormLabel from '../../components/FormLabel';
import DialogLink from '../../components/Dialog/DialogLink';
import DialogLabel from '../../components/Dialog/DialogLabel';
import { PATH_DASHBOARD, PATH_MACHINE } from '../../../routes/paths';
import { Cover } from '../../components/Cover';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';

// ----------------------------------------------------------------------

export default function Document() {
  const navigate = useNavigate();
  const { machineDocument, machineDocumentHistory } = useSelector((state) => state.machineDocument);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openMachine, setOpenMachine] = useState(false);

  // If not needed, remove this block:
  //   useEffect(() =>{
  //     dispatch(resetMachineDocument())
  //     console.log("getMachineDocument")
  //     dispatch(getMachineDocument(id))
  //     dispatch(resetCustomer())
  //     dispatch(resetMachine())
  //   },[id,dispatch])

  //   useEffect(() =>{
  //     console.log("getMachine")
  //     if(machineDocument?.machine){
  //       dispatch(getMachine(machineDocument.machine._id))
  //     }
  //   },[machineDocument,dispatch])

  //   useEffect(() =>{
  //     console.log("getCustomer")
  // if(machineDocument?.customer){
  //   dispatch(getCustomer(machineDocument.customer._id))
  // }
  //   },[machineDocument,dispatch])

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
            <ViewFormField
              sm={6}
              heading="Machine"
              objectParam={
                defaultValues.machine && (
                  <Link onClick={handleOpenMachine} href="#" underline="none">
                    {defaultValues.machine}
                  </Link>
                )
              }
            />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            <Grid container sx={{ mt: '1rem', mb: '-1rem' }}>
              <ViewFormAudit defaultValues={defaultValues} />
            </Grid>
            {machineDocumentHistory &&
              machineDocumentHistory?.documentVersions?.map((files) => (
                <Grid container>
                  <Grid container sx={{ pt: '2rem' }}>
                    <FormLabel content={`Version No. ${files?.versionNo}`} />

                    {defaultValues.description !== files?.description && <ViewFormField sm={12} heading="Description" param={files?.description} />}
                  </Grid>
                  {files?.files?.map((file) => (
                    <Grid item sx={{ display: 'flex-inline', m:0.5 }}>
                      <Grid container justifyContent="flex-start" gap={1}>
                        <Thumbnail
                          key={file._id}
                          file={file}
                          currentDocument={machineDocumentHistory}
                          customer={customer}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Grid>
              ))}
          </Grid>
        </Card>
      </Grid>
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
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

      {/* dialog for machine */}
      <Dialog
        maxWidth="md"
        open={openMachine}
        onClose={handleCloseMachine}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel onClick={() => handleCloseMachine()} content="Machine" />
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
          <ViewFormField
            sm={6}
            heading="Installation Site"
            param={machine?.instalationSite?.name}
          />
          <ViewFormField sm={6} heading="Billing Site" param={machine?.billingSite?.name} />
          <ViewFormField sm={12} heading="Nearby Milestone" param={machine?.siteMilestone} />
        </Grid>
        <Grid item container sx={{ px: 2, pb: 3 }}>
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
        <DialogLink onClick={() => handleViewMachine(machine._id)} content="Go to Machine" />
      </Dialog>
    </Container>
  );
}
