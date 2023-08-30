import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Link, Tooltip, Breadcrumbs, Chip } from '@mui/material';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// slices
import {
  getConnntedMachine,
  getMachines,
  getMachine,
  deleteMachine,
  setMachineEditFormVisibility,
  transferMachine,
  setMachineVerification,
} from '../../redux/slices/products/machine';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { getSite, resetSite, setSiteDialog } from '../../redux/slices/customer/site';

import { setToolInstalledFormVisibility, setToolInstalledEditFormVisibility } from '../../redux/slices/products/toolInstalled';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
// components
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../components/DocumentForms/FormLabel';
import NothingProvided from '../components/Defaults/NothingProvided';
import GoogleMaps from '../../assets/GoogleMaps';
// constants
import { BREADCRUMBS, TITLES, FORMLABELS } from '../../constants/default-constants';
import { Snacks } from '../../constants/machine-constants';
// utils
import { fDate } from '../../utils/formatTime';
// dialog
import MachineDialog from '../components/Dialog/MachineDialog'
import CustomerDialog from '../components/Dialog/CustomerDialog';
import SiteDialog from '../components/Dialog/SiteDialog';

// ----------------------------------------------------------------------

export default function MachineViewForm() {
  const userId = localStorage.getItem('userId');
  const userRolesString = localStorage.getItem('userRoles');
  const userRoles = JSON.parse(userRolesString);
  const isSuperAdmin = userRoles?.some((role) => role.roleType === 'SuperAdmin');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machine, transferMachineFlag } = useSelector((state) => state.machine);
  const [disableTransferButton, setDisableTransferButton] = useState(true);
  const [disableEditButton, setDisableEditButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [hasValidLatLong, setHasValidLatLong] = useState(false);
  const isMobile = useResponsive('down', 'sm');
  const handleInstallationSiteDialog = () =>{ dispatch(resetSite()); dispatch(getSite(machine?.customer?._id, machine?.instalationSite?._id)); dispatch(setSiteDialog(true))}
  const handleBillingSiteDialog = () =>{ dispatch(resetSite()); dispatch(getSite(machine?.customer?._id, machine?.billingSite?._id)); dispatch(setSiteDialog(true))}

  const hasValidArray = (array) =>
    array.some((obj) => {
      const lat = obj?.lat;
      const long = obj?.long;
      return lat !== undefined && long !== undefined && lat !== '' && long !== '';
    });

  const latLongValues = useMemo(
    () => [
      {
        lat: machine?.instalationSite?.lat || '',
        long: machine?.instalationSite?.long || '',
      },
      {
        lat: machine?.billingSite?.lat || '',
        long: machine?.billingSite?.long || '',
      },
    ],
    [machine]
  );

  useEffect(() => {
    dispatch(setSiteDialog(false))
    dispatch(setCustomerDialog(false));
    setOpenMachineConnection(false);
    dispatch(setToolInstalledEditFormVisibility(false));
    dispatch(setToolInstalledFormVisibility(false));
    const isValid = hasValidArray(latLongValues);
    setHasValidLatLong(isValid);
  }, [machine, latLongValues, setHasValidLatLong, dispatch ]);

  useLayoutEffect(() => {
    dispatch(setMachineEditFormVisibility(false));
    if (machine.transferredMachine || !machine.isActive || !isSuperAdmin) {
      setDisableTransferButton(true);
    } else {
      setDisableTransferButton(false);
    }
    if (machine.transferredMachine) {
      setDisableEditButton(true);
      setDisableDeleteButton(true);
    } else {
      setDisableEditButton(false);
      setDisableDeleteButton(false);
    }
    if (machine?.customer) {
      dispatch(getCustomer(machine?.customer?._id));
    }
  }, [dispatch, machine, transferMachineFlag, userId, isSuperAdmin]);

  const handleEdit = () => {
    dispatch(setMachineEditFormVisibility(true));
  };

  const handleTransfer = async () => {
    try {
      const response = await dispatch(transferMachine(machine));
      const machineId = response.data.Machine._id;
      navigate(PATH_MACHINE.machines.view(machineId));
      enqueueSnackbar(Snacks.machineTransferSuccess);
    } catch (error) {
      if (error?.Message) {
        enqueueSnackbar(error?.Message, { variant: `error` });
      } else if (error?.message) {
        enqueueSnackbar(error?.message, { variant: `error` });
      } else {
        enqueueSnackbar(Snacks.machineFailedTransfer, { variant: `error` });
      }
      console.error(error);
    }
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteMachine(machine._id));
      dispatch(getMachines());
      navigate(PATH_MACHINE.machines.list);
    } catch (err) {
      enqueueSnackbar(Snacks.machineFailedDelete, { variant: `error` });
      console.log('Error:', err);
    }
  };
  const handleVerification = async () => {
    try {
      await dispatch(setMachineVerification(machine._id, machine?.isVerified));
      dispatch(getMachine(machine._id));
      enqueueSnackbar(Snacks.machineVerifiedSuccess);
    } catch (error) {
      console.log(error);
      enqueueSnackbar(Snacks.machineFailedVerification, { variant: 'error' });
    }
  };
  const [openMachineConnection, setOpenMachineConnection] = useState(false);


  const handleCustomerDialog = () => dispatch(setCustomerDialog(true));
  const handleOpenMachineConnection = async (id) => {
    try {
      await dispatch(getConnntedMachine(id));
      setOpenMachineConnection(true);
    } catch (error) {
      console.log(error);
    }
  }
  const handleCloseMachineConnection = () => setOpenMachineConnection(false);

  const linkedMachines = machine?.machineConnections?.map((machineConnection, index) => (
    <Chip sx={{m:0.2}} onClick={() => handleOpenMachineConnection(machineConnection.connectedMachine._id)} label={machineConnection.connectedMachine.serialNo ? machineConnection.connectedMachine.serialNo : 'NA'} />
  ));

  const defaultValues = useMemo(
    () => ({
      id: machine?._id || '',
      name: machine?.name || '',
      serialNo: machine?.serialNo || '',
      parentMachine: machine?.parentMachine?.name || '',
      alias: machine?.alias || '',
      parentSerialNo: machine?.parentMachine?.serialNo || '',
      supplier: machine?.supplier?.name || '',
      workOrderRef: machine?.workOrderRef || '',
      machineModel: machine?.machineModel?.name || '',
      status: machine?.status?.name || '',
      customer: machine?.customer || '',
      siteMilestone: machine?.siteMilestone || '',
      instalationSite: machine?.instalationSite || '',
      billingSite: machine?.billingSite || '',
      installationDate: machine?.installationDate || '',
      shippingDate: machine?.shippingDate || '',
      description: machine?.description || '',
      customerTags: machine?.customerTags || '',
      accountManager: machine?.accountManager || '',
      projectManager: machine?.projectManager || '',
      supportManager: machine?.supportManager || '',
      isActive: machine?.isActive,
      createdByFullName: machine?.createdBy?.name,
      createdAt: machine?.createdAt,
      createdIP: machine?.createdIP,
      updatedByFullName: machine?.updatedBy?.name,
      updatedAt: machine?.updatedAt,
      updatedIP: machine?.updatedIP,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machine]
  );

  return (
    <>
      <Grid container direction="row" justifyContent="space-between" alignItems="center">
        <Grid item xs={12} md={6}>
          <Breadcrumbs
            aria-label="breadcrumb"
            separator="›"
            sx={{ fontSize: '12px', color: 'text.disabled' }}
          >
            <BreadcrumbsLink to={PATH_MACHINE.machines.list} name={BREADCRUMBS.MACHINES} />
            <BreadcrumbsLink to={PATH_MACHINE.machines.view(machine._id)} name={machine.serialNo} />
          </Breadcrumbs>
        </Grid>
        {!isMobile && <AddButtonAboveAccordion isCustomer />}
      </Grid>
      <Grid container direction="row" mt={isMobile && 2}>
        <Card sx={{ p: 3 }}>
          <ViewFormEditDeleteButtons
            sx={{ pt: 5 }}
            verificationCount={machine?.verifications?.length}
            isVerified={machine?.verifications?.some((verified) => verified.verifiedBy?._id === userId)}
            handleVerification={handleVerification}
            disableTransferButton={disableTransferButton}
            disableEditButton={disableEditButton}
            disableDeleteButton={disableDeleteButton }
            handleEdit={handleEdit}
            onDelete={onDelete}
            handleTransfer={handleTransfer}
          />

          <Grid display="inline-flex">
            <Tooltip title="Active">
              <ViewFormField sm={12} isActive={defaultValues.isActive} />
            </Tooltip>
            <Tooltip title="Verified By">
              <ViewFormField
                sm={12}
                machineVerificationCount={machine?.verifications?.length}
                verified
                machineVerifiedBy={machine?.verifications}
              />
            </Tooltip>
          </Grid>

          <Grid container>
            <FormLabel content={FORMLABELS.KEYDETAILS} />
            <Grid container>
              <Card sx={{ width: '100%', p: '1rem' }}>
                <Grid container>
                  <ViewFormField sm={4} heading="Serial No" param={defaultValues?.serialNo} />
                  <ViewFormField
                    sm={4}
                    heading="Machine Model"
                    param={defaultValues?.machineModel}
                  />
                  <ViewFormField
                    sm={4}
                    heading="Customer"
                    node={
                      defaultValues.customer && (
                        <Link onClick={handleCustomerDialog} href="#" underline="none">
                          {defaultValues.customer?.name}
                        </Link>
                      )
                    }
                  />
                </Grid>
              </Card>
            </Grid>

            <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
            { defaultValues?.parentSerialNo ? <ViewFormField sm={6} heading="Previous Machine" param={defaultValues?.parentSerialNo} /> : ''}
            <ViewFormField sm={12} heading="Alias" chips={defaultValues?.alias} />
            <ViewFormField sm={6} heading="Supplier" param={defaultValues?.supplier} />
            <ViewFormField sm={6} heading="Status" param={defaultValues?.status} />
            <ViewFormField sm={12} heading="Connected Machiness" chipDialogArrayParam={linkedMachines} />

            <ViewFormField
              sm={12}
              heading="Work Order / Purchase Order"
              param={defaultValues?.workOrderRef}
            />
            <ViewFormField
              sm={6}
              heading="Installation Site"
              node={
                defaultValues.instalationSite && (
                  <Link onClick={ handleInstallationSiteDialog } href="#" underline="none">
                    {defaultValues.instalationSite?.name}
                  </Link>
                )
              }
            />
            <ViewFormField
              sm={6}
              heading="Billing Site"
              node={
                defaultValues.billingSite && (
                  <Link onClick={ handleBillingSiteDialog } href="#" underline="none">
                    {defaultValues.billingSite?.name}
                  </Link>
                )
              }
            />
            <ViewFormField
              sm={6}
              heading="Installation Date"
              param={fDate(defaultValues?.installationDate)}
            />
            <ViewFormField
              sm={6}
              heading="Shipping Date"
              param={fDate(defaultValues?.shippingDate)}
            />
            <ViewFormField
              sm={12}
              heading="Nearby Milestone"
              param={defaultValues?.siteMilestone}
            />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
            {/* <ViewFormField sm={6} heading="Tags" param={defaultValues?.customerTags?  Object.values(defaultValues.customerTags).join(",") : ''} /> */}
          </Grid>

          <Grid container>
            <FormLabel content={FORMLABELS.HOWICK} />
            <ViewFormField
              sm={6}
              heading="Account Manager"
              param={defaultValues?.accountManager?.firstName}
              secondParam={defaultValues?.accountManager?.lastName}
            />
            <ViewFormField
              sm={6}
              heading="Project Manager"
              param={defaultValues?.projectManager?.firstName}
              secondParam={defaultValues?.projectManager?.lastName}
            />
            <ViewFormField
              sm={6}
              heading="Suppport Manager"
              param={defaultValues?.supportManager?.firstName}
              secondParam={defaultValues?.supportManager?.lastName}
            />
            <ViewFormField />
          </Grid>

          <Grid container>
            <FormLabel content={FORMLABELS.SITELOC} />
            {hasValidLatLong ? (
              <GoogleMaps machineView latlongArr={latLongValues} mapHeight="500px" />
            ) : (
              <NothingProvided content={TITLES.NO_SITELOC} />
            )}
          </Grid>

          <Grid container sx={{ mt: 2 }}>
            <ViewFormAudit defaultValues={defaultValues} />
          </Grid>
        </Card>
      </Grid>

      {/* connected machine dialog */}      
      <MachineDialog 
        openMachine={openMachineConnection}
        handleCloseMachine={handleCloseMachineConnection}
        handleConnectedMachine={openMachineConnection}
      />

      <CustomerDialog />

      <SiteDialog
        site={defaultValues?.instalationSite}
        title="Installation Site"
      />

      <SiteDialog
        site={defaultValues?.billingSite}
        title="Billing Site"
      />
    </>
  );
}
