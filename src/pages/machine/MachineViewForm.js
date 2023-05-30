import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Divider, Switch, Card, Grid, Typography, Link ,Dialog } from '@mui/material';
// routes
import { PATH_MACHINE , PATH_DASHBOARD } from '../../routes/paths';
// slices
import { getMachines, getMachine, deleteMachine, setMachineEditFormVisibility, setTransferMachineFlag } from '../../redux/slices/products/machine';
import { getCustomer } from '../../redux/slices/customer/customer';
import { getSite } from '../../redux/slices/customer/site';
import Iconify from '../../components/iconify';
import ViewFormSubtitle from '../components/ViewFormSubtitle';
import ViewFormField from '../components/ViewFormField';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormSwitch from '../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';
import CommaJoinField from '../components/CommaJoinField';


// ----------------------------------------------------------------------
export default function MachineViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machine , machineEditFormFlag } = useSelector((state) => state.machine);
  console.log("machines", machine)
  const { customer } = useSelector((state) => state.customer);
  const { site } = useSelector((state) => state.site);
  useLayoutEffect(() => {
    dispatch(setMachineEditFormVisibility(false))
    if(machine?.customer){
      dispatch(getCustomer(machine?.customer?._id))
    }
  }, [ dispatch ,machine ])
  const handleEdit = () => {
    dispatch(setMachineEditFormVisibility(true));
  }
  const handleTransfer = () => {
    dispatch(setTransferMachineFlag(true));
    dispatch(setMachineEditFormVisibility(true));
  }
  const handleViewCustomer = (id) => {
    navigate(PATH_DASHBOARD.customer.view(id));
  };
  const onDelete = async () => {
    await dispatch(deleteMachine(machine._id));
    dispatch(getMachines());
    navigate(PATH_MACHINE.machine.list)
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
      id:                       machine?._id || "",
      name:                     machine?.name || "",
      serialNo:                 machine?.serialNo || "",
      parentMachine:            machine?.parentMachine?.name || "",
      parentSerialNo:           machine?.parentMachine?.serialNo || "",
      supplier:                 machine?.supplier?.name || "",
      workOrderRef:             machine?.workOrderRef || "",
      machineModel:             machine?.machineModel?.name || "",
      status:                   machine?.status?.name || "",
      customer:                 machine?.customer || "",
      instalationSite:          machine?.instalationSite || "",
      siteMilestone:            machine?.siteMilestone || "",
      billingSite:              machine?.billingSite|| "",
      description:              machine?.description || "",
      customerTags:             machine?.customerTags || "",
      accountManager:           machine?.accountManager || "",
      projectManager:           machine?.projectManager || "",
      supportManager:           machine?.supportManager || "",
      isActive:                 machine?.isActive,
      createdByFullName:        machine?.createdBy?.name ,
      createdAt:                machine?.createdAt ,
      createdIP:                machine?.createdIP ,
      updatedByFullName:        machine?.updatedBy?.name ,
      updatedAt:                machine?.updatedAt ,
      updatedIP:                machine?.updatedIP ,
    }
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [machine]
  );

  return (
    <Card sx={{ p: 3 }}>
      <Grid container justifyContent="flex-end" alignContent="flex-end">
        <ViewFormEditDeleteButtons sx={{ pt: 5 }} handleTransfer={handleTransfer} handleEdit={handleEdit} onDelete={onDelete} />
        <ViewFormField sm={12} isActive={defaultValues.isActive} />
      </Grid>
      <Grid container>
        <Grid item container sx={{ py: '1rem' }}>
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
              Key Details
            </Typography>
          </Grid>
        </Grid>
        <Grid container>
          <Card sx={{ width: '100%', p: '1rem' }}>
            <Grid container>
              <ViewFormField sm={4} heading="Serial No" param={defaultValues?.serialNo} />
              <ViewFormField sm={4} heading="Machine Model" param={defaultValues?.machineModel} />
              <ViewFormField
                sm={4}
                heading="Customer"
                objectParam={
                  defaultValues.customer ? (
                    <Link onClick={handleOpenCustomer} href="#" underline="none">
                      {defaultValues.customer?.name}
                    </Link>
                  ) : (
                    ''
                  )
                }
              />
            </Grid>
          </Card>
        </Grid>
        <ViewFormField sm={6} heading="Name" param={defaultValues?.name} />
        <ViewFormField sm={6} heading="Previous Machine" param={defaultValues?.parentMachine} />
        <ViewFormField sm={6} heading="Supplier" param={defaultValues?.supplier} />
        <ViewFormField sm={6} heading="Status" param={defaultValues?.status} />
        <CommaJoinField sm={6} arrayParam={machine.machineConnections} heading='Connected Machines'/>
        <ViewFormField
          sm={6}
          heading="Installation Site"
          objectParam={
            defaultValues.instalationSite ? (
              <Link onClick={handleOpenInstallationSite} href="#" underline="none">
                {defaultValues.instalationSite?.name}
              </Link>
            ) : (
              ''
            )
          }
        />
        <ViewFormField
          sm={6}
          heading="Billing Site"
          objectParam={
            defaultValues.billingSite ? (
              <Link onClick={handleOpenBillingSite} href="#" underline="none">
                {defaultValues.billingSite?.name}
              </Link>
            ) : (
              ''
            )
          }
        />
        <ViewFormField
          sm={6}
          heading="Work Order / Perchase Order"
          param={defaultValues?.workOrderRef}
        />

        <ViewFormField sm={12} heading="Nearby Milestone" param={defaultValues?.siteMilestone} />
        <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
        {/* <ViewFormField sm={6} heading="Tags" param={defaultValues?.customerTags?  Object.values(defaultValues.customerTags).join(",") : ''} /> */}
      </Grid>
      <Grid container>
        <Grid item container sx={{ pt: '2rem' }}>
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
              Howick Resources
            </Typography>
          </Grid>
        </Grid>

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
        {/* <ViewFormSwitch isActive={defaultValues.isActive} /> */}
      </Grid>
      <Grid container sx={{ mt: 2 }}>
        <ViewFormAudit defaultValues={defaultValues} />
      </Grid>

      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
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
                  `linear-gradient(to right, ${theme.palette.primary.lighter} ,  white)`,
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
        open={openInstallationSite}
        onClose={handleCloseInstallationSite}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Grid
          item
          container
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
            Installation Site{' '}
          </Typography>{' '}
          <Link
            onClick={() => handleCloseInstallationSite()}
            href="#"
            underline="none"
            sx={{ ml: 'auto' }}
          >
            {' '}
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
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

      <Dialog
        open={openBilingSite}
        onClose={handleCloseBillingSite}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Grid
          container
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
            Billing Site{' '}
          </Typography>{' '}
          <Link
            onClick={() => handleCloseBillingSite()}
            href="#"
            underline="none"
            sx={{ ml: 'auto' }}
          >
            {' '}
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
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
    </Card>
  );
}
