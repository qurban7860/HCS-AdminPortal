import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo } from 'react';
import { Box, Dialog, DialogContent, DialogTitle, Divider, DialogActions, Checkbox, Button, Stack } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { addSecurityUser } from '../../redux/slices/securityUser/securityUser';
import { updatePortalRegistration, setAcceptRequestDialog, setRejectRequestDialog, getPortalRegistration } from '../../redux/slices/customer/portalRegistration';
import { getAllActiveCustomers, resetAllActiveCustomers } from '../../redux/slices/customer/customer';
import { getActiveContacts, resetActiveContacts } from '../../redux/slices/customer/contact';
import { getActiveRoles, resetActiveRoles } from '../../redux/slices/securityUser/role';
import FormProvider from '../hook-form/FormProvider';
import { RHFAutocomplete, RHFTextField } from '../hook-form';

function PortalRequestInviteDialog() {

  const dispatch = useDispatch();
  const { customerId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const { portalRegistration, acceptRequestDialog, rejectRequestDialog } = useSelector((state) => state.portalRegistration);
  const { allActiveCustomers, isLoading } = useSelector((state) => state.customer);
  const { activeRoles } = useSelector((state) => state.role);
  const { activeContacts } = useSelector((state) => state.contact);

  useEffect(()=>{
    if( !portalRegistration ){
      dispatch(getPortalRegistration( customerId ))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ dispatch ])

  useEffect(()=>{
    if(acceptRequestDialog){
      dispatch(getAllActiveCustomers());
      dispatch(getActiveRoles());
    }
    return ()=>{
      dispatch(resetAllActiveCustomers());
      dispatch(resetActiveRoles());
      dispatch(resetActiveContacts());
    }
  },[ dispatch, acceptRequestDialog ])

  const inviteSchema = Yup.object().shape({
    internalNote: Yup.string().trim().max(5000).label('Internal Note').when([], {
      is: () => rejectRequestDialog,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
    }),
    customer: Yup.object().label('Customer').nullable().when([], {
      is: () => acceptRequestDialog,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
  }),
    contact: Yup.object().label('Contact').nullable().when([], {
      is: () => acceptRequestDialog,
      then: (schema) => schema.required(),
      otherwise: (schema) => schema.notRequired(),
  }),
    roles: Yup.array().label('Roles').nullable().when([], {
      is: () => acceptRequestDialog,
      then: (schema) => schema.min(1).required(),
      otherwise: (schema) => schema.notRequired(),
  }),
    isInvite: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
        name: portalRegistration?.customerName || "",
        contactPersonName: portalRegistration?.contactPersonName || "",
        email: portalRegistration?.email || "",
        phone: portalRegistration?.phoneNumber || "",
        address: portalRegistration?.address || "",
        customerNote: portalRegistration?.customerNote || "",
        machineSerialNos: Array.isArray(portalRegistration?.machineSerialNos) ? portalRegistration?.machineSerialNos : [],
        status: portalRegistration?.status || null,
        internalNote: portalRegistration?.internalNote || "",
        password: "",
        roles: [],
        customer: null,
        contact: null,
        isInvite: true,
        isActive: false,
        multiFactorAuthentication:	false,
      }
    ),[ portalRegistration ]);

  const methods = useForm({
    resolver: yupResolver(inviteSchema),
    defaultValues,
  }, [ ] );

  const {
    reset,
    handleSubmit,
    setValue,
    watch,
    trigger,
    formState: { isSubmitting }
  } = methods;
  
  const { customer, contact } = watch();

  const handleCloseDialog = async () => {
    await reset();
    if (acceptRequestDialog) {
      dispatch(setAcceptRequestDialog(false));
    } else {
      dispatch(setRejectRequestDialog(false));
    }
  };

  const onSubmit = async (data) => {
    try {
      const rejectData = {
        status: "REJECTED",
        internalNote: data?.internalNote
      }
      data.status = "APPROVED"
      if( data?.customer && data?.customer?.type?.toUpperCase() !== "SP" ){
        data.dataAccessibilityLevel = "RESTRICTED"
      } else if( data?.customer && data?.customer?.type?.toUpperCase() === "SP" ){
        data.dataAccessibilityLevel = "GLOBAL"
      }
      const promises = [ dispatch(updatePortalRegistration(customerId, rejectRequestDialog ? rejectData : { ...data, isActive: true })) ];
      
      if (acceptRequestDialog) {
        promises.push(dispatch(addSecurityUser(data)));
        enqueueSnackbar('Portal request processed successfully!');
      } else if (rejectRequestDialog){
        enqueueSnackbar('Portal request Reject!');
      } else {
        enqueueSnackbar('Portal request updated successfully!');
      }
      
      await Promise.all(promises);  
      await handleCloseDialog()
    } catch (err) {
      if (err?.errors && Array.isArray(err?.errors)) {
        err?.errors?.forEach((error) => {
          if (error?.field && error?.message) {
            enqueueSnackbar( error?.message , { variant: `error` });
          }
        });
      } else {
        enqueueSnackbar(typeof err === 'string' ? err : 'Registration Request Update Failed!' , { variant: `error` });
      }
    }
  };  

  return (
    <Dialog
      maxWidth="sm"
      fullWidth
      open={ acceptRequestDialog || rejectRequestDialog }
      onClose={ handleCloseDialog }
      aria-labelledby="keep-mounted-modal-title"
      aria-describedby="keep-mounted-modal-description"
    >
      <DialogTitle variant='h3' sx={{ my: -2 }}>{`${ acceptRequestDialog ? 'Accept' : 'Reject' } Portal Request`}</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{pt:3}}>
      <Box >
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} >
          <Stack spacing={2} sx={{ pt: 1 }}>
          <Box rowGap={2} columnGap={2} display="grid"
            gridTemplateColumns={{ sm: 'repeat(1, 1fr)' }}
          >
                { rejectRequestDialog && <RHFTextField name="internalNote" label="Internal Note" />}

                { acceptRequestDialog && <>
                    <RHFAutocomplete
                      name='customer'
                      label="Customer*"
                      loading={ isLoading }
                      options={ allActiveCustomers }
                      getOptionLabel={(option) => option?.name || ''}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.name || ''}</li>)}
                      onChange={(event, newValue) =>{
                        if(newValue){
                          dispatch(getActiveContacts(newValue?._id));
                          if(newValue?._id !== contact?.customer?._id ){
                          setValue('contact',null )
                          }
                          if(newValue?.type !== contact?.customer?.type ){
                            setValue('roles',[])
                          }
                          setValue('customer',newValue)
                        } else {
                          setValue('roles',[])
                          setValue('customer',null )
                          setValue('contact',null )
                          dispatch(resetActiveContacts());
                        }
                        trigger('customer')
                      }}
                    />

                    <RHFAutocomplete
                      name='contact'
                      label="Contact*"
                      options={activeContacts}
                      getOptionLabel={(option) => `${option?.firstName || ''} ${option?.lastName || ''}`}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      renderOption={(props, option) => (<li  {...props} key={option?._id}>{option?.firstName || ''}{' '}{option?.lastName || ''}</li>)}
                    />

                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    filterSelectedOptions
                    name="roles"
                    label="Roles*"
                    options={ activeRoles?.filter(role => 
                      ( customer?.type?.toLowerCase() === 'sp' ? 
                      role?.roleType?.toLowerCase() !== 'customer' 
                      : role?.roleType?.toLowerCase() === 'customer' ) 
                    ) }
                    getOptionLabel={(option) => `${option?.name || ''} `}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    renderOption={(props, option, { selected }) => ( <li {...props} key={option?._id} > <Checkbox checked={selected} />{option?.name || ''}</li> )}
                  />
                </>}
            </Box>
            </Stack>
        </FormProvider>
      </Box>
      </DialogContent>
      <DialogActions sx={{ py:-2 }} >
        
        <Button variant="outlined" color="inherit" onClick={ handleCloseDialog }>
          Cancel
        </Button>
        <LoadingButton
          type="submit"
          variant="contained"
          sx={{
                backgroundColor:  acceptRequestDialog ? 'green' : 'red', 
                '&:hover': {
                  backgroundColor:  acceptRequestDialog ? 'darkgreen' : 'darkred', 
                },
              }}
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
        >
          { acceptRequestDialog ? 'Accept' : 'Reject' }
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
}


export default PortalRequestInviteDialog;
