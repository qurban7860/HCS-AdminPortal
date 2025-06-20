import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// @mui
import { Card, Grid, Link, Chip, Typography } from '@mui/material';
// routes
import { PATH_CRM, PATH_MACHINE } from '../../routes/paths';
// slices
import {
  getMachine,
  updateMachine,
  deleteMachine,
  setMachineEditFormVisibility,
  setMachineVerification,
  setMachineDialog,
  getMachineForDialog,
  setMachineTransferDialog,
  setMachineStatusChangeDialog
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
import MachineTransferDialog from '../../components/Dialog/MachineTransferDialog';
import SiteDialog from '../../components/Dialog/SiteDialog';
import OpenInNewPage from '../../components/Icons/OpenInNewPage';
import Iconify from '../../components/iconify';
import IconButtonTooltip from '../../components/Icons/IconButtonTooltip';
import MachineStatusChangeDialog from '../../components/Dialog/MachineStatusChangeDialog';
import MachineAddForm from './MachineAddForm';

// ----------------------------------------------------------------------

export default function MachineViewForm() {
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();
  const { machine, machineTransferDialog, machineStatusChangeDialog, isLoading } = useSelector((state) => state.machine);
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
    dispatch(setMachineStatusChangeDialog(false));
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
    } else {
      setDisableTransferButton(false);
      setDisableEditButton(false);
      setDisableDeleteButton(false);
    }
    
  }, [dispatch, machine]);

  const handleEdit = () => {
    if(machine._id){
      navigate(PATH_MACHINE.machines.edit(machine._id));
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
  
  const handleCustomerDialog = async (event, customerId) => {
    event.preventDefault(); 
    await dispatch(getCustomer(customerId));
    await dispatch(setCustomerDialog(true));
  };

  const handleMachineDialog = async ( MachineID ) => {
    await dispatch(getMachineForDialog(MachineID));
    await dispatch(setMachineDialog(true)); 
  };

  const handleStatusChangeDialog = () => {
    dispatch(setMachineStatusChangeDialog(true));
  };
  
  const linkedMachines = machine?.machineConnections?.map((machineConnection, index) => (
      <Chip 
        sx={{ml:index===0?0:1, my:0.2}} 
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
        sx={{ml:index===0?0:1, my:0.2}} 
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
      generation: machine?.generation || '',
      efficiency: machine?.efficiency || '',
      serialNo: machine?.serialNo || '',
      parentMachine: machine?.parentMachine?.name || '',
      alias: machine?.alias || '',
      parentSerialNo: machine?.parentMachine?.serialNo || '',
      supplier: machine?.supplier?.name || '',
      workOrderRef: machine?.workOrderRef || '',
      purchaseDate: machine?.purchaseDate || null,
      machineModel: machine?.machineModel?.name || '',
      manufactureDate: machine?.manufactureDate || '',
      machineConnections: machine?.machineModel?.category?.connections || false,
      machineProfiles: machine?.machineProfiles || [],
      machineweb:machine?.machineProfile?.web || '',
      machineflange:machine?.machineProfile?.flange || '',
      status: machine?.status?.name || '',
      transferredToMachine: machine?.transferredToMachine || null,
      transferredFromMachine: machine?.transferredFromMachine || null,
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
      supportExpireDate: machine?.supportExpireDate  || null,
      decommissionedDate: machine?.decommissionedDate  || null,
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
  

  const onArchive = async () => {
    try {
      const data = {
        ...machine,
        isActive: true,
        isArchived: true,
      }
      await dispatch(updateMachine(machine._id, data ));
      enqueueSnackbar('Machine Archived Successfully!');
      navigate(PATH_MACHINE.machines.root);
    } catch (err) {
      enqueueSnackbar( typeof err === 'string' ? err : Snacks.machineFailedArchive, { variant: `error` });
      console.log('Error:', err);
    }
  };

  const onRestore = async () => {
    try {
      const data = {
        ...machine,
        isActive: true,
        isArchived: false,
      }
      await dispatch(updateMachine(machine._id, data ));
      enqueueSnackbar('Machine Restored Successfully!');
      dispatch(getMachine(machine._id));
    } catch (err) {
      enqueueSnackbar( typeof err === 'string' ? err : Snacks.machineFailedRestore, { variant: `error` });
    }
  };
  
  const onDelete = async () => {
    try {
      await dispatch(deleteMachine(machine._id));
      enqueueSnackbar('Machine Deleted Successfully!');
      navigate(PATH_MACHINE.archived.root);
    } catch (err) {
      enqueueSnackbar( typeof err === 'string' ? err : Snacks.machineFailedDelete, { variant: `error` });
      console.log('Error:', err);
    }
  };

  return (
    <>
      <Grid container direction="row" mt={isMobile && 2}>
        <Card sx={{ width: '100%', p: '1rem', mb:3 }}>
            <ViewFormEditDeleteButtons
              sx={{ pt: 5 }}
              verifiers={ machine?.isArchived ? undefined : machine?.verifications}
              isActive={  machine?.isArchived ? undefined : defaultValues?.isActive}
              handleVerification={ ( machine?.status?.slug === 'transferred' || machine?.isArchived ) ? undefined : handleVerification}
              disableTransferButton={disableTransferButton}
              disableEditButton={disableEditButton}
              disableDeleteButton={disableDeleteButton}
              handleEdit={ machine?.isArchived ? undefined : handleEdit}
              // handleJiraNaviagte={handleJiraNaviagte}
              onArchive={ machine?.isArchived ? undefined : onArchive }
              onRestore={ machine?.isArchived ? onRestore : undefined }
              onDelete={ machine?.isArchived ? onDelete : undefined }
              handleTransfer={ machine?.isArchived ? undefined : () => navigate(PATH_MACHINE.machines.transfer(machine?._id))}
              backLink={() => navigate( machine?.isArchived ? PATH_MACHINE.archived.root : PATH_MACHINE.machines.root)}
              machineSupportDate={ machine?.isArchived ? undefined : defaultValues?.supportExpireDate}
              transferredHistory={ machine?.isArchived && MachineAddForm ? undefined : machine?.transferredHistory || []}
            />
            <FormLabel content={FORMLABELS.KEYDETAILS} />
            <Grid container>
              <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Serial No" param={defaultValues?.serialNo} />
              <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Machine Model" param={defaultValues?.machineModel} />
              <ViewFormField isLoading={isLoading} sm={4} variant='h4' heading="Customer"
                node={
                  defaultValues.customer && (
                    <>
                    <Link variant='h4' onClick={(event)=> handleCustomerDialog(event, defaultValues.customer?._id)} underline="none" sx={{ cursor: 'pointer'}}>
                      {defaultValues.customer?.name}
                    </Link>
                      <OpenInNewPage onClick={()=> window.open( PATH_CRM.customers.view(defaultValues.customer?._id), '_blank' ) }/>
                    </>
                  )
                }
              />
            </Grid>
        </Card>
              
        <Card sx={{ width: '100%', p: '1rem'}}>
          <Grid container>
                       {/* 1 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={12} heading="Name" param={defaultValues?.name} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Generation" param={defaultValues?.generation} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Efficiency" param={`${defaultValues?.efficiency} m/hr`} />
                       {/* 2 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={defaultValues?.decommissionedDate ? 6 : 12} heading="Status" 
                  node={ 
                    <>
                      <Typography variant='h4' sx={{mr: 1,color: machine?.status?.slug === "transferred" && 'red'  }}>{ defaultValues?.status }</Typography> 
                      { machine?.status?.slug!=='transferred' && !machine?.isArchived && <IconButtonTooltip title='Change Status' icon="grommet-icons:sync" onClick={handleStatusChangeDialog} />}
                    </>
                    } />
            {defaultValues?.decommissionedDate ? (
              <ViewFormField isLoading={isLoading} sm={6} heading="De-Commissioned Date" param={fDate(defaultValues?.decommissionedDate)} />
            ) : null}
            
            { ( machine?.status?.slug==='transferred' || defaultValues?.transferredFromMachine || defaultValues?.transferredToMachine ) && 

              <ViewFormField isLoading={isLoading} sm={6} heading="Transfer Detail"
                node={
                  <Grid display="flex" alignItems="center">
                      { defaultValues?.transferredFromMachine && 
                        <Typography variant='body2' sx={{mt: 0.5}} >
                          {` from > `}
                            <Link onClick={(event)=> handleCustomerDialog(event, defaultValues?.transferredFromMachine?.customer?._id)} underline="none" sx={{ cursor: 'pointer', ml:1}}>
                              <b>{defaultValues?.transferredFromMachine?.customer?.name}</b>
                            </Link>
                            <OpenInNewPage onClick={()=> window.open( PATH_CRM.customers.view(defaultValues?.transferredFromMachine?.customer?._id), '_blank' ) }/>
                        </Typography>
                      }

                      { defaultValues?.transferredFromMachine 
                        && defaultValues?.transferredToMachine 
                        && <Typography variant='body2'>,</Typography> 
                      }

                      { defaultValues?.transferredToMachine && 
                        <Typography variant='body2' sx={{mt: 0.5, ml:1 }} >
                            {` to >  `}
                            <Link onClick={(event)=> handleCustomerDialog(event, defaultValues?.transferredToMachine?.customer?._id)} underline="none" sx={{ cursor: 'pointer', ml:1}}>
                              <b>{defaultValues?.transferredToMachine?.customer?.name}</b>
                            </Link>
                              <OpenInNewPage onClick={()=> window.open( PATH_CRM.customers.view(defaultValues?.transferredToMachine?.customer?._id), '_blank' ) }/>
                        </Typography> 
                      }
                  </Grid>
                }
              />
            }
            
            <ViewFormField isLoading={isLoading} sm={12} variant='h4' heading="Profiles" param={ Array.isArray(defaultValues?.machineProfiles) && defaultValues?.machineProfiles?.map( el => `${el?.defaultName} ${(el?.web && el?.flange)? `(${el?.web} X ${el?.flange})` :""}`)?.join(', ') || ''} />
                       {/* 4 FULL ROW */}
            {defaultValues?.alias?.length > 0 && <ViewFormField isLoading={isLoading} sm={12} heading="Alias" chips={defaultValues?.alias} />}
                       {/* 5 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={6} heading="Manufacture Date" param={fDate(defaultValues?.manufactureDate)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Supplier" param={defaultValues?.supplier} />
                       {/* 6 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={6} heading="Purchase Date" param={fDate(defaultValues?.purchaseDate)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Work Order / Purchase Order" param={defaultValues?.workOrderRef}/>
                       {/* 7 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={6} heading="Billing Site"
                node={ defaultValues.billingSite && (
                  <Link onClick={ handleBillingSiteDialog } underline="none" sx={{ cursor: 'pointer'}} >
                    {defaultValues.billingSite?.name}
                  </Link> )} />
                       {/* 8 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={6} heading="Financing Company"
                node={ defaultValues.financialCompany && (
                    <Link onClick={(event)=> handleCustomerDialog(event, defaultValues.financialCompany?._id)} underline="none" sx={{ cursor: 'pointer'}} >
                      {defaultValues.financialCompany?.name}
                    </Link> )} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Installation Site"
              node={ defaultValues.instalationSite && (
                  <Link onClick={ handleInstallationSiteDialog } underline="none" sx={{ cursor: 'pointer'}} >
                    {defaultValues.instalationSite?.name}
                  </Link> )} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Landmark for Installation site" param={defaultValues?.siteMilestone} />
                       {/* 9 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={6} heading="Shipping Date" param={fDate(defaultValues?.shippingDate)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Installation Date" param={fDate(defaultValues?.installationDate)} />
                       {/* 10 FULL ROW */}
            { defaultValues?.parentSerialNo ? <ViewFormField isLoading={isLoading} sm={6} heading="Previous Machine" param={defaultValues?.parentSerialNo} /> : " "}
                       {/* 11 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={12} heading="Connected Machines" node={<Grid container>{linkedMachines}</Grid>} />
                       {/* 12 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={12} heading="Parent Machines" node={<Grid container>{paranetMachines}</Grid>} />
                       {/* 13 FULL ROW */}
            <ViewFormField isLoading={isLoading} sm={12} heading="Description" param={defaultValues?.description} />
          </Grid>
                       {/* HOWICK RESOURCES */}
          <Grid container>
            <FormLabel content={FORMLABELS.HOWICK} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Account Manager" chips={defaultValues?.accountManager?.map(el=>`${el?.firstName} ${el?.lastName}`)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Project Manager" chips={defaultValues?.projectManager?.map(el=>`${el?.firstName} ${el?.lastName}`)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Suppport Manager" chips={defaultValues?.supportManager?.map(el=>`${el?.firstName} ${el?.lastName}`)} />
            <ViewFormField isLoading={isLoading} sm={6} heading="Support Expiry Date" param={fDate(defaultValues?.supportExpireDate)} />
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
      { machineTransferDialog && <MachineTransferDialog />}
      { machineStatusChangeDialog && <MachineStatusChangeDialog />}
      
    </>
  );
}
