import { useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Switch, Card, Grid, Typography, Modal , Fade, Box , Link ,Dialog,  DialogTitle} from '@mui/material';
// routes
import { PATH_MACHINE } from '../../routes/paths';
// slices
import { getMachines, getMachine, deleteMachine, setMachineEditFormVisibility } from '../../redux/slices/products/machine';
import { getCustomer } from '../../redux/slices/customer/customer';
import { getSite } from '../../redux/slices/customer/site';

import ViewFormSubtitle from '../components/ViewFormSubtitle';
import ViewFormField from '../components/ViewFormField';
import ViewFormAudit from '../components/ViewFormAudit';
import ViewFormEditDeleteButtons from '../components/ViewFormEditDeleteButtons';

// ----------------------------------------------------------------------
export default function MachineViewForm() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machine , machineEditFormFlag } = useSelector((state) => state.machine);
  const { customer } = useSelector((state) => state.customer);
  const { site } = useSelector((state) => state.site);

  useLayoutEffect(() => {
    dispatch(setMachineEditFormVisibility(false))
    dispatch(getCustomer(machine?.customer?._id))
  }, [ dispatch ,machine ])
  const handleEdit = () => {
    dispatch(setMachineEditFormVisibility(true));
  }

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

  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // maxwidth: 800,
    bgcolor: 'background.paper',
    border: '1px solid #000',
    boxShadow: 24,
    p: 2,
  };

  return (
    <Card sx={{ p: 3 }}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete} />
      <Grid container>
        <ViewFormField sm={6} heading="Serial No" param={defaultValues.serialNo ? defaultValues.serialNo : ''} />
        <ViewFormField sm={6} heading="Name" param={defaultValues.name} />
        <ViewFormField sm={6} heading="Previous Machine Serial No" param={defaultValues.parentSerialNo? defaultValues.parentSerialNo : ''} />
        <ViewFormField sm={6} heading="Previous Machine" param={defaultValues.parentMachine ? defaultValues.parentMachine : ''} />
        <ViewFormField sm={6} heading="Supplier" param={defaultValues.supplier? defaultValues.supplier : ''} />
        <ViewFormField sm={6} heading="Machine Model" param={defaultValues.machineModel? defaultValues.machineModel : ''} />
        <ViewFormField sm={6} heading="Status" param={defaultValues.status? defaultValues.status : ''} />
        <ViewFormField sm={6} heading="Work Order / Perchase Order" param={defaultValues.workOrderRef? defaultValues.workOrderRef : ''} />
        <ViewFormField sm={12} heading="Customer" param={defaultValues.customer? <Link onClick={handleOpenCustomer} href="#" underline="none" >{defaultValues.customer?.name}</Link> : '' } />
        <ViewFormField sm={6} heading="Installation Site" param={defaultValues.instalationSite? <Link onClick={handleOpenInstallationSite} href="#" underline="none" >{defaultValues.instalationSite?.name}</Link> : ''} />
        <ViewFormField sm={6} heading="Billing Site" param={defaultValues.billingSite? <Link onClick={handleOpenBillingSite} href="#" underline="none" >{ defaultValues.billingSite?.name}</Link> : ''} />
        <ViewFormField sm={12} heading="Nearby Milestone" param={defaultValues.siteMilestone? defaultValues?.siteMilestone : ''} />
        <ViewFormField sm={12} heading="Description" param={defaultValues.description? defaultValues.description: ''} />
        {/* <ViewFormField sm={6} heading="Tags" param={defaultValues.customerTags?  Object.values(defaultValues.customerTags).join(",") : ''} /> */}
      </Grid>
      <Grid container>
        <ViewFormSubtitle sm={12} heading="Howick Resources"/>
        <ViewFormField sm={6} heading="Account Manager"   StasticsParam={defaultValues?.accountManager?.firstName || "" } secondStasticsParam={defaultValues?.accountManager?.lastName || ""}/>
        <ViewFormField sm={6} heading="Project Manager"   StasticsParam={defaultValues?.projectManager?.firstName || "" } secondStasticsParam={defaultValues?.projectManager?.lastName || ""}/>
        <ViewFormField sm={6} heading="Suppport Manager"  StasticsParam={defaultValues?.supportManager?.firstName || "" } secondStasticsParam={defaultValues?.supportManager?.lastName || ""}/> 
      </Grid>
        <Switch sx={{mt:1}} checked = { defaultValues.isActive } disabled  />
      <Grid container>
        <ViewFormAudit defaultValues={defaultValues}/>
      </Grid>

      <Dialog open={openCustomer} onClose={handleCloseCustomer} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description" >
        <Grid container sx={{px:2, pt:2}}>
          <Typography variant="h3" sx={{px:2}}>Customer </Typography>
          <ViewFormField sm={12} heading="Name"                     param={customer?.name?        customer?.name : ''} />
          <ViewFormField sm={6} heading="Trading Name"              param={customer?.tradingName? customer?.tradingName : ''} />
          <ViewFormField sm={6} heading="Phone"                     param={customer?.mainSite?.phone?       customer?.mainSite.phone : ''} />
          <ViewFormField sm={6} heading="Fax"                       param={customer?.mainSite?.fax?         customer?.mainSite.fax : ''} /> 
          <ViewFormField sm={6} heading="Email"                     param={customer?.mainSite?.email?       customer?.mainSite.email : ''} />
          <ViewFormField sm={6} heading="Site Name"                 param={customer?.mainSite?.address? customer?.mainSite?.address?.street : ''} />
          <ViewFormField sm={6} heading="Street"                    param={customer?.mainSite?.address? customer?.mainSite?.address?.street : ''} />
          <ViewFormField sm={6} heading="Suburb"                    param={customer?.mainSite?.address? customer?.mainSite?.address?.suburb : ''} />
          <ViewFormField sm={6} heading="City"                      param={customer?.mainSite?.address? customer?.mainSite?.address?.city : ''} />
          <ViewFormField sm={6} heading="Region"                    param={customer?.mainSite?.address? customer?.mainSite?.address?.region : ''} />
          <ViewFormField sm={6} heading="Post Code"                 param={customer?.mainSite?.address? customer?.mainSite?.address?.postcode : ''} />
          <ViewFormField sm={12} heading="Country"                   param={customer?.mainSite?.address? customer?.mainSite?.address?.country : ''} />
          <ViewFormField sm={6} heading="Primary Biling Contact"    param={customer?.primaryBillingContact?   `${customer?.primaryBillingContact?.firstName } ${customer?.primaryBillingContact?.lastName}` : ''} />
          <ViewFormField sm={6} heading="Primary Technical Contact" param={customer?.primaryTechnicalContact? `${customer?.primaryTechnicalContact?.firstName } ${customer?.primaryTechnicalContact?.lastName}`: ''} />
        </Grid>
          <Typography variant="subtitle2" sx={{px:4}}>Howick Resources </Typography>
        <Grid container sx={{px:2,pb:3}}>
          <ViewFormField sm={6} heading="Account Manager"   param={defaultValues?.accountManager?.firstName || ""}  secondParam={defaultValues?.accountManager?.lastName || ""}/>
          <ViewFormField sm={6} heading="Project Manager"   param={defaultValues?.projectManager?.firstName || "" } secondParam={defaultValues?.projectManager?.lastName || ""}/>
          <ViewFormField sm={6} heading="Suppport Manager"  param={defaultValues?.supportManager?.firstName || "" } secondParam={defaultValues?.supportManager?.lastName || ""}/> 
        </Grid>
      </Dialog>

      <Dialog open={openInstallationSite} onClose={handleCloseInstallationSite} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description" >
        <Grid container sx={{p:2}}>
          <Typography variant="h3" sx={{px:2}}>Installation Site </Typography>
          <ViewFormField sm={12} heading="Name"     param={defaultValues.instalationSite ? defaultValues?.instalationSite?.name : ''} />
          <ViewFormField sm={6} heading="Phone"     param={defaultValues.instalationSite ? defaultValues?.instalationSite?.phone : ''} />
          <ViewFormField sm={6} heading="Fax"       param={defaultValues.instalationSite ? defaultValues?.instalationSite?.fax : ''} /> 
          <ViewFormField sm={6} heading="Email"     param={defaultValues.instalationSite ? defaultValues?.instalationSite?.email : ''} />
          <ViewFormField sm={6} heading="Website"   param={defaultValues.instalationSite ? defaultValues?.instalationSite?.website : ''} />
          <ViewFormField sm={6} heading="Street"    param={defaultValues.instalationSite?.address ? defaultValues?.instalationSite?.address?.street : ''} />
          <ViewFormField sm={6} heading="Suburb"    param={defaultValues.instalationSite?.address ? defaultValues?.instalationSite?.address?.suburb : ''} />
          <ViewFormField sm={6} heading="City"      param={defaultValues.instalationSite?.address ? defaultValues?.instalationSite?.address?.city : ''} />
          <ViewFormField sm={6} heading="Region"    param={defaultValues.instalationSite?.address ? defaultValues?.instalationSite?.address?.region : ''} />
          <ViewFormField sm={6} heading="Post Code" param={defaultValues.instalationSite?.address ? defaultValues?.instalationSite?.address?.postcode : ''} />
          <ViewFormField sm={6} heading="Country"   param={defaultValues.instalationSite?.address ? defaultValues?.instalationSite?.address?.country : ''} />
        </Grid>
      </Dialog>

      <Dialog open={openBilingSite} onClose={handleCloseBillingSite} aria-labelledby="keep-mounted-modal-title" aria-describedby="keep-mounted-modal-description" >
        <Grid container sx={{p:2}}>
          <Typography variant="h3" sx={{px:2}}>Billing Site </Typography>
          <ViewFormField sm={12} heading="Name"     param={defaultValues.billingSite? defaultValues?.billingSite?.name : ''} />
          <ViewFormField sm={6} heading="Phone"     param={defaultValues.billingSite? defaultValues?.billingSite?.phone : ''} />
          <ViewFormField sm={6} heading="Fax"       param={defaultValues.billingSite? defaultValues?.billingSite?.fax : ''} /> 
          <ViewFormField sm={6} heading="Email"     param={defaultValues.billingSite? defaultValues?.billingSite?.email : ''} />
          <ViewFormField sm={6} heading="Website"   param={defaultValues.billingSite? defaultValues?.billingSite?.website : ''} />
          <ViewFormField sm={6} heading="Street"    param={defaultValues.billingSite?.address ? defaultValues.billingSite?.address?.street : ''} />
          <ViewFormField sm={6} heading="Suburb"    param={defaultValues.billingSite?.address ? defaultValues.billingSite?.address?.suburb : ''} />
          <ViewFormField sm={6} heading="City"      param={defaultValues.billingSite?.address ? defaultValues.billingSite?.address?.city : ''} />
          <ViewFormField sm={6} heading="Region"    param={defaultValues.billingSite?.address ? defaultValues.billingSite?.address?.region : ''} />
          <ViewFormField sm={6} heading="Post Code" param={defaultValues.billingSite?.address ? defaultValues.billingSite?.address?.postcode : ''} />
          <ViewFormField sm={6} heading="Country"   param={defaultValues.billingSite?.address ? defaultValues.billingSite?.address?.country : ''} />
        </Grid>
      </Dialog>
    </Card>
  );
}
