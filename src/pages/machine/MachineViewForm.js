import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Link, Dialog, Tooltip, Breadcrumbs } from '@mui/material';
// routes
import { PATH_MACHINE, PATH_CUSTOMER } from '../../routes/paths';
// slices
import {
  getMachines,
  getMachine,
  deleteMachine,
  setMachineEditFormVisibility,
  transferMachine,
  setMachineVerification,
} from '../../redux/slices/products/machine';
import { getCustomer } from '../../redux/slices/customer/customer';
import { getLoggedInSecurityUser } from '../../redux/slices/securityUser/securityUser';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
// components
import BreadcrumbsLink from '../components/Breadcrumbs/BreadcrumbsLink';
import AddButtonAboveAccordion from '../components/Defaults/AddButtonAboveAcoordion';
import ViewFormField from '../components/ViewForms/ViewFormField';
import ViewFormAudit from '../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewForms/ViewFormEditDeleteButtons';
import DialogLabel from '../components/Dialog/DialogLabel';
import DialogLink from '../components/Dialog/DialogLink';
import CommaJoinField from '../components/Defaults/CommaJoinField';
import FormLabel from '../components/DocumentForms/FormLabel';
import NothingProvided from '../components/Defaults/NothingProvided';
import GoogleMaps from '../../assets/GoogleMaps';
// constants
import { DIALOGS, BREADCRUMBS, TITLES, FORMLABELS } from '../../constants/default-constants';
import { Snacks } from '../../constants/machine-constants';
// utils
import { fDate } from '../../utils/formatTime';

// ----------------------------------------------------------------------
export default function MachineViewForm() {
  const userId = localStorage.getItem('userId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machine, machineEditFormFlag, transferMachineFlag } = useSelector(
    (state) => state.machine
  );
  const { customer } = useSelector((state) => state.customer);
  const { site } = useSelector((state) => state.site);
  const { loggedInUser } = useSelector((state) => state.user);
  const [disableTransferButton, setDisableTransferButton] = useState(true);
  const [disableEditButton, setDisableEditButton] = useState(false);
  const [hasValidLatLong, setHasValidLatLong] = useState(false);
  const isSuperAdmin = loggedInUser?.roles?.some((role) => role.roleType === 'SuperAdmin');
  const isMobile = useResponsive('down', 'sm');

  // function to check whether the lat long params exist or not
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
    const isValid = hasValidArray(latLongValues);
    setHasValidLatLong(isValid);
  }, [machine, latLongValues, setHasValidLatLong]);

  useLayoutEffect(() => {
    dispatch(setMachineEditFormVisibility(false));
    if (machine.transferredMachine || !machine.isActive || !isSuperAdmin) {
      setDisableTransferButton(true);
    } else {
      setDisableTransferButton(false);
    }
    if (machine.transferredMachine) {
      setDisableEditButton(true);
    } else {
      setDisableEditButton(false);
    }
    if (userId) {
      dispatch(getLoggedInSecurityUser(userId));
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
      // window.open(`${baseUrl}/products/machines/${machineId}/view`);
      navigate(PATH_MACHINE.view(machineId));
      enqueueSnackbar(Snacks.machineTransferSuccess);
    } catch (error) {
      if (error.Message) {
        enqueueSnackbar(error.Message, { variant: `error` });
      } else if (error.message) {
        enqueueSnackbar(error.message, { variant: `error` });
      } else {
        enqueueSnackbar(Snacks.machineFailedTransfer, { variant: `error` });
      }
      console.log('Error:', error);
    }
  };

  const handleViewCustomer = (id) => {
    navigate(PATH_CUSTOMER.view(id));
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
  const [openCustomer, setOpenCustomer] = useState(false);
  const [openInstallationSite, setOpenInstallationSite] = useState(false);
  const [openBilingSite, setOpenBilingSite] = useState(false);

  const handleOpenCustomer = () => setOpenCustomer(true);
  const handleCloseCustomer = () => setOpenCustomer(false);
  const handleOpenInstallationSite = () => setOpenInstallationSite(true);
  const handleCloseInstallationSite = () => setOpenInstallationSite(false);
  const handleOpenBillingSite = () => setOpenBilingSite(true);
  const handleCloseBillingSite = () => setOpenBilingSite(false);

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
            isVerified={machine?.verifications?.find(
              (verified) => verified.verifiedBy?._id === userId
            )}
            handleVerification={handleVerification}
            disableTransferButton={disableTransferButton}
            disableEditButton={disableEditButton}
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
                    objectParam={
                      defaultValues.customer && (
                        <Link onClick={handleOpenCustomer} href="#" underline="none">
                          {defaultValues.customer?.name}
                        </Link>
                      )
                    }
                  />
                </Grid>
              </Card>
            </Grid>

            <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
            <ViewFormField sm={6} heading="Previous Machine" param={defaultValues?.parentMachine} />
            <ViewFormField sm={6} heading="Alias" chips={defaultValues?.alias} />
            <ViewFormField sm={6} heading="Supplier" param={defaultValues?.supplier} />
            <ViewFormField sm={6} heading="Status" param={defaultValues?.status} />
            <CommaJoinField
              sm={6}
              arrayParam={machine.machineConnections}
              heading="Connected Machines"
            />
            <ViewFormField
              sm={12}
              heading="Work Order / Purchase Order"
              param={defaultValues?.workOrderRef}
            />
            <ViewFormField
              sm={6}
              heading="Installation Site"
              objectParam={
                defaultValues.instalationSite && (
                  <Link onClick={handleOpenInstallationSite} href="#" underline="none">
                    {defaultValues.instalationSite?.name}
                  </Link>
                )
              }
            />
            <ViewFormField
              sm={6}
              heading="Billing Site"
              objectParam={
                defaultValues.billingSite && (
                  <Link onClick={handleOpenBillingSite} href="#" underline="none">
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

      {/* // primary billing dialog */}
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Customer" onClick={() => handleCloseCustomer()} />
        <Grid item container sx={{ px: 2, pt: 2 }}>
          <ViewFormField sm={12} heading="Name" param={customer?.name} />
          <ViewFormField sm={6} heading="Trading Name" chips={customer?.tradingName} />
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
        <DialogLink content={DIALOGS.CUSTOMER} onClick={() => handleViewCustomer(customer._id)} />
      </Dialog>

      {/* installation site dialog */}
      <Dialog
        open={openInstallationSite}
        onClose={handleCloseInstallationSite}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Installation Site" onClick={() => handleCloseInstallationSite()} />
        <Grid item container sx={{ p: 2 }}>
          <ViewFormField sm={12} heading="Name" param={defaultValues?.instalationSite?.name} />
          <ViewFormField sm={6} heading="Phone" param={defaultValues?.instalationSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={defaultValues?.instalationSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={defaultValues?.instalationSite?.email} />
          <ViewFormField sm={6} heading="Website" param={defaultValues?.instalationSite?.website} />
          <ViewFormField
            sm={6}
            heading="Street"
            param={defaultValues?.instalationSite?.address?.street}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={defaultValues?.instalationSite?.address?.suburb}
          />
          <ViewFormField
            sm={6}
            heading="City"
            param={defaultValues?.instalationSite?.address?.city}
          />
          <ViewFormField
            sm={6}
            heading="Region"
            param={defaultValues?.instalationSite?.address?.region}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={defaultValues?.instalationSite?.address?.postcode}
          />
          <ViewFormField
            sm={6}
            heading="Country"
            param={defaultValues.instalationSite?.address?.country}
          />
        </Grid>
      </Dialog>

      {/* Billing site dialog */}
      <Dialog
        open={openBilingSite}
        onClose={handleCloseBillingSite}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content="Billing Site" onClick={() => handleCloseBillingSite()} />
        <Grid item container sx={{ p: 2 }}>
          <ViewFormField sm={12} heading="Name" param={defaultValues?.billingSite?.name} />
          <ViewFormField sm={6} heading="Phone" param={defaultValues?.billingSite?.phone} />
          <ViewFormField sm={6} heading="Fax" param={defaultValues?.billingSite?.fax} />
          <ViewFormField sm={6} heading="Email" param={defaultValues?.billingSite?.email} />
          <ViewFormField sm={6} heading="Website" param={defaultValues?.billingSite?.website} />
          <ViewFormField
            sm={6}
            heading="Street"
            param={defaultValues.billingSite?.address?.street}
          />
          <ViewFormField
            sm={6}
            heading="Suburb"
            param={defaultValues.billingSite?.address?.suburb}
          />
          <ViewFormField sm={6} heading="City" param={defaultValues?.billingSite?.address?.city} />
          <ViewFormField
            sm={6}
            heading="Region"
            param={defaultValues?.billingSite?.address?.region}
          />
          <ViewFormField
            sm={6}
            heading="Post Code"
            param={defaultValues?.billingSite?.address?.postcode}
          />
          <ViewFormField
            sm={6}
            heading="Country"
            param={defaultValues?.billingSite?.address?.country}
          />
        </Grid>
      </Dialog>
    </>
  );
}
