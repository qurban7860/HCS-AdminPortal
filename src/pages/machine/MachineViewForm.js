import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Link, Chip, Typography} from '@mui/material';
// routes
import { PATH_CUSTOMER, PATH_MACHINE } from '../../routes/paths';
// slices
import {
  getMachines,
  getMachine,
  deleteMachine,
  setMachineEditFormVisibility,
  setMachineVerification,
  setMachineDialog,
  getMachineForDialog,
  setMachineTransferDialog
} from '../../redux/slices/products/machine';
import { getCustomer, setCustomerDialog } from '../../redux/slices/customer/customer';
import { getSite, resetSite, setSiteDialog } from '../../redux/slices/customer/site';

import { setToolInstalledFormVisibility, setToolInstalledEditFormVisibility } from '../../redux/slices/products/toolInstalled';
// hooks
import useResponsive from '../../hooks/useResponsive';
import { useSnackbar } from '../../components/snackbar';
// components
import ViewFormField from '../../components/ViewForms/ViewFormField';
import ViewFormAudit from '../../components/ViewForms/ViewFormAudit';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import FormLabel from '../../components/DocumentForms/FormLabel';
import NothingProvided from '../../components/Defaults/NothingProvided';
import GoogleMaps from '../../assets/GoogleMaps';
// constants
import { TITLES, FORMLABELS } from '../../constants/default-constants';
import { Snacks } from '../../constants/machine-constants';
// utils
import { fDate } from '../../utils/formatTime';
// dialog
import MachineDialog from '../../components/Dialog/MachineDialog'
import CustomerDialog from '../../components/Dialog/CustomerDialog';
import MachineTransferDialog from '../../components/Dialog/MachineTransferDialog';
import SiteDialog from '../../components/Dialog/SiteDialog';
import OpenInNewPage from '../../components/Icons/OpenInNewPage';
import Iconify from '../../components/iconify';

// ----------------------------------------------------------------------

export default function MachineViewForm() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machine, machineDialog, machineTransferDialog, isLoading } = useSelector((state) => state.machine);
  const { customerDialog } = useSelector((state) => state.customer);
  const { siteDialog } = useSelector((state) => state.site);
  const [disableTransferButton, setDisableTransferButton] = useState(true);
  const [disableEditButton, setDisableEditButton] = useState(false);
  const [disableDeleteButton, setDisableDeleteButton] = useState(false);
  const [hasValidLatLong, setHasValidLatLong] = useState(false);
  const isMobile = useResponsive('down', 'sm');

  const [siteDialogTitle, setDialogTitle] = useState('');

  const handleInstallationSiteDialog = (event) =>{
      event.preventDefault(); 
      setDialogTitle('Installation Site');
      dispatch(resetSite()); 
      dispatch(getSite(machine?.customer?._id, machine?.instalationSite?._id)); 
      dispatch(setSiteDialog(true))
  }

  const handleBillingSiteDialog = (event) =>{
      event.preventDefault();  
      setDialogTitle('Billing Site');
      dispatch(resetSite()); 
      dispatch(getSite(machine?.customer?._id, machine?.billingSite?._id)); 
      dispatch(setSiteDialog(true))
  }

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
    dispatch(setMachineTransferDialog(false));
    dispatch(setSiteDialog(false))
    dispatch(setCustomerDialog(false));
    dispatch(setMachineDialog(false));
    dispatch(setToolInstalledEditFormVisibility(false));
    dispatch(setToolInstalledFormVisibility(false));
    const isValid = hasValidArray(latLongValues);
    setHasValidLatLong(isValid);
  }, [machine, latLongValues, setHasValidLatLong, dispatch ]);

  useLayoutEffect(() => {
    
    dispatch(setMachineEditFormVisibility(false));
    
    if (machine?.status?.slug === 'transferred') {
      setDisableTransferButton(true);
      setDisableEditButton(true);
      setDisableDeleteButton(true);
    } else {
      setDisableTransferButton(false);
      setDisableEditButton(false);
      setDisableDeleteButton(false);
    }
    
  }, [dispatch, machine]);

  const handleEdit = () => {
    dispatch(setMachineEditFormVisibility(true));
  };

  const onDelete = async () => {
    try {
      await dispatch(deleteMachine(machine._id));
      dispatch(getMachines());
      enqueueSnackbar('Machine Deleted Successfully!');
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
  
  const handleCustomerDialog = (event, customerId) => {
    event.preventDefault(); 
    dispatch(getCustomer(customerId));
    dispatch(setCustomerDialog(true));
  };

  const handleMachineDialog = (MachineID) => {
    dispatch(getMachineForDialog(MachineID));
    dispatch(setMachineDialog(true)); 
  };
  
  const linkedMachines = machine?.machineConnections?.map((machineConnection, index) => (
      <Chip 
        sx={{ml:index===0?0:1}} 
        onClick={() => handleMachineDialog(machineConnection.connectedMachine._id)} 
        deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
        onDelete={()=> {
          window.open(PATH_MACHINE.machines.view(machineConnection.connectedMachine._id), '_blank');
        }}
        label={`${machineConnection?.connectedMachine?.serialNo || ''} ${machineConnection?.connectedMachine?.name ? '-' : '' } ${machineConnection?.connectedMachine?.name || ''} `} 
      />
  ));
  
  const paranetMachines = machine?.parentMachines?.map((parentMachine, index) => (  
    <Chip 
        sx={{ml:index===0?0:1}} 
        onClick={() => handleMachineDialog(parentMachine.machine._id)} 
        deleteIcon={<Iconify icon="fluent:open-12-regular"/>}
        onDelete={()=> {
          window.open(PATH_MACHINE.machines.view(parentMachine.machine._id), '_blank');
        }}  
        label={`${parentMachine?.machine?.serialNo || ''} ${parentMachine?.machine?.name ? '-' : '' } ${parentMachine?.machine?.name || ''} `} 
      />
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
      machineConnections: machine?.machineModel?.category?.connections || false,
      machineProfile: machine?.machineProfile?.defaultName || '',
      machineweb:machine?.machineProfile?.web || '',
      machineflange:machine?.machineProfile?.flange || '',
      status: machine?.status?.name || '',
      transferredMachine: machine?.transferredMachine?.customer || null,
      transferredFrom: machine?.transferredFrom?.customer || null,
      customer: machine?.customer || '',
      financialCompany: machine?.financialCompany || '',
      siteMilestone: machine?.siteMilestone || '',
      instalationSite: machine?.instalationSite || '',
      billingSite: machine?.billingSite || '',
      installationDate: machine?.installationDate || '',
      shippingDate: machine?.shippingDate || '',
      description: machine?.description || '',
      customerTags: machine?.customerTags || '',
      accountManager: machine?.accountManager || [],
      projectManager: machine?.projectManager || [],
      supportManager: machine?.supportManager || [],
      supportExpireDate: machine?.supportExpireDate  || '',
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
      <Grid container direction="row" mt={isMobile && 2}>
        <Card sx={{ width: '100%', p: '1rem', mb:3 }}>
          <ViewFormEditDeleteButtons
              sx={{ pt: 5 }}
              verifiers={machine?.verifications}
              isActive={defaultValues?.isActive}
              handleVerification={machine?.status?.slug !== 'transferred' && handleVerification}
              disableTransferButton={disableTransferButton}
              disableEditButton={disableEditButton}
              disableDeleteButton={disableDeleteButton}
              handleEdit={handleEdit}
              onDelete={onDelete}
              handleTransfer={ () => dispatch(setMachineTransferDialog(true))}
              backLink={() => navigate(PATH_MACHINE.machines.list)}
              machineSupportDate={defaultValues?.supportExpireDate}
            />

            <FormLabel content={FORMLABELS.KEYDETAILS} />
            <Grid container>
              <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Serial No" param={defaultValues?.serialNo} />
              <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Machine Model" param={defaultValues?.machineModel} />
              <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Customer"
                node={
                  defaultValues.customer && (
                    <>
                    <Link onClick={(event)=> handleCustomerDialog(event, defaultValues.customer?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                      {defaultValues.customer?.name}
                    </Link>
                      <OpenInNewPage onClick={()=> window.open( PATH_CUSTOMER.view(defaultValues.customer?._id), '_blank' ) }/>
                    </>
                  )
                }
              />
            </Grid>
        </Card>
              
        <Card sx={{ width: '100%', p: '1rem', mb:3 }}>
          <Grid container>
            <ViewFormField isLoading={isLoading} sm={defaultValues?.parentSerialNo ? 6 : 12 } heading="Name" param={defaultValues?.name} />
            { defaultValues?.parentSerialNo ? <ViewFormField isLoading={isLoading} sm={6} heading="Previous Machine" param={defaultValues?.parentSerialNo} /> : " "}
            <ViewFormField isLoading={isLoading} sm={6} heading="Alias" chips={defaultValues?.alias} />
            <ViewFormField isLoading={isLoading} sm={6} variant='h4' heading="Profile" param={`${defaultValues?.machineProfile} ${(defaultValues?.machineweb && defaultValues?.machineflange)? `(${defaultValues?.machineweb} X ${defaultValues?.machineflange})` :""}`} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Supplier" param={defaultValues?.supplier} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Status"
            node={
            <Grid display="flex">
              <Typography variant='h4' sx={{mr: 1,color: machine?.status?.slug === "transferred" && 'red'  }}>{ defaultValues?.status }</Typography>
              { (defaultValues?.transferredMachine && 
                <Typography variant='body2' sx={{mt: 0.5}} >
                    {` to `}
                    <Link onClick={(event)=> handleCustomerDialog(event, defaultValues?.transferredMachine?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                      <b>{defaultValues?.transferredMachine?.name}</b>
                    </Link>
                      <OpenInNewPage onClick={()=> window.open( PATH_CUSTOMER.view(defaultValues?.transferredMachine?._id), '_blank' ) }/>
                  
                </Typography> ) || 
                ( defaultValues?.transferredFrom && 
                  <Typography variant='body2' sx={{mt: 0.5}} >
                    {` - Transfered from `}
                    <Link onClick={(event)=> handleCustomerDialog(event, defaultValues?.transferredFrom?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                      <b>{defaultValues?.transferredFrom?.name}</b>
                    </Link>
                      <OpenInNewPage onClick={()=> window.open( PATH_CUSTOMER.view(defaultValues?.transferredFrom?._id), '_blank' ) }/>
                  
                </Typography> 
                )
              }
            </Grid>} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Work Order / Purchase Order" param={defaultValues?.workOrderRef}/>

            <ViewFormField isLoading={isLoading} sm={6}
                    heading="Financing Company"
                    node={
                      defaultValues.financialCompany && (
                        <Link onClick={(event)=> handleCustomerDialog(event, defaultValues.financialCompany?._id)} underline="none" sx={{ cursor: 'pointer'}} >
                          {defaultValues.financialCompany?.name}
                        </Link>
                      )
                    }
                  />

            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Billing Site"
              node={
                defaultValues.billingSite && (
                  <Link onClick={ handleBillingSiteDialog } underline="none" sx={{ cursor: 'pointer'}} >
                    {defaultValues.billingSite?.name}
                  </Link>
                )
              }
            />
            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Shipping Date"
              param={fDate(defaultValues?.shippingDate)}
            />
            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Installation Site"
              node={
                defaultValues.instalationSite && (
                  <Link onClick={ handleInstallationSiteDialog } underline="none" sx={{ cursor: 'pointer'}} >
                    {defaultValues.instalationSite?.name}
                  </Link>
                )
              }
            />
            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Installation Date"
              param={fDate(defaultValues?.installationDate)}
            />

            <ViewFormField isLoading={isLoading}
              sm={12}
              heading="Landmark"
              param={defaultValues?.siteMilestone}
            />

            <ViewFormField isLoading={isLoading} sm={12} heading="Connected Machines" chipDialogArrayParam={linkedMachines} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Parent Machines" chipDialogArrayParam={paranetMachines} />
            <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
          </Grid>

          <Grid container>
            <FormLabel content={FORMLABELS.HOWICK} />

            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Account Manager"
              customerContacts={defaultValues?.accountManager}
            />

            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Project Manager"
              customerContacts={defaultValues?.projectManager}
            />
            
            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Suppport Manager"
              customerContacts={defaultValues?.supportManager}
            />

            <ViewFormField isLoading={isLoading}
              sm={6}
              heading="Support Expiry Date"
              param={fDate(defaultValues?.supportExpireDate)}
            />
            
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
      
      { siteDialog && <SiteDialog title={siteDialogTitle}/>}
      { machineDialog  && <MachineDialog />}
      { customerDialog  && <CustomerDialog />}
      { machineTransferDialog && <MachineTransferDialog />}
      
    </>
  );
}
