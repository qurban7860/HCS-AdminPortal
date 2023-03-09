import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useLayoutEffect, useMemo, useCallback  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment } from '@mui/material';
// slice
import { getSPContacts } from '../../redux/slices/customer/contact';
import { saveMachine } from '../../redux/slices/products/machine';
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, {
  RHFSelect,
  RHFAutocomplete,
  RHFTextField,
  RHFMultiSelect,
  RHFEditor,
  RHFUpload,
} from '../../components/hook-form';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// asset
import { countries } from '../../assets/data';
// util
import MachineDashboardNavbar from './util/MachineDashboardNavbar';


// ----------------------------------------------------------------------

CustomerAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentCustomer: PropTypes.object,
};

const CONTACT_TYPES = [
  { value: 'technical', label: 'Technical' },
  { value: 'financial', label: 'Financial' },
  { value: 'support', label: 'Support' },
];

export default function CustomerAddForm({ isEdit, readOnly, currentCustomer }) {

  const MACHINE_TOOLS = [
    { value: 'technical', label: 'Technical' },
    { value: 'financial', label: 'Financial' },
    { value: 'support', label: 'Support' },
  ];

  const { userId, user } = useAuthContext();

  const { spContacts } = useSelector((state) => state.contact);

  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

  const AddMachineSchema = Yup.object().shape({
    name: Yup.string().min(5).max(40).required('Name is required')  ,
    desc: Yup.string(),
    serialNo: Yup.string(),
    parentMachine: Yup.string(),
    pseriolNo: Yup.string(),
    status: Yup.string(),
    supplier: Yup.string(),
    model: Yup.string(),
    workOrder: Yup.string(),
    instalationSite: Yup.string(),
    billingSite: Yup.string(),
    operators: Yup.string(),
    accountManager: Yup.string(),
    projectManager: Yup.string(),
    supportManager: Yup.string(),
    license: Yup.string(),
    image: Yup.mixed().nullable(true),
    tools: Yup.array(),
    itags: Yup.string(),
    ctags: Yup.string(),

  });

  const defaultValues = useMemo(
    () => ({
      name: ''  ,
    desc: '',
    serialNo: '',
    parentMachine: '',
    pseriolNo: '',
    status: '',
    supplier: '',
    model: '',
    workOrder: '',
    instalationSite: '',
    billingSite: '',
    operators: '',
    accountManager: '',
    projectManager: '',
    supportManager: '',
    license: '',
    image: null,
    tools: [],
    itags: '',
    ctags: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  useLayoutEffect(() => {
    dispatch(getSPContacts());
  }, [dispatch]);


  const onSubmit = async (data) => {
    console.log(data);
      try{
        await dispatch(saveMachine(data));
        reset();
        enqueueSnackbar('Create success!');
        navigate(PATH_DASHBOARD.customer.view(null));
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];

      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });

      if (file) {
        setValue('image', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );
  const handleRemoveFile = () => {
    setValue('image', null);
  };


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
      <MachineDashboardNavbar/>

        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={6}>
            <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFTextField name="name" label="Machine" required/>

              <RHFEditor name="desc" label="Description" />

             </Box>
             <Box
             rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFTextField name="serialNo" label="Serial No." />

              <RHFSelect native name="parentMachine" label="Parent Machine">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              <RHFTextField name="pseriolNo" label="Parent Serial No." />

              <RHFSelect native name="status" label="Status">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="supplier" label="Supplier">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="model" label="Model">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFTextField name="workOrder" label="Work Order/ Purchase Order" />
              <RHFSelect native name="accountManager" label="Customer">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="instalationSite" label="Instalation Site">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="billingSite" label="Billing Site">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="operators" label="Operators">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="accountManager" label="Account Manager">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="projectManager" label="Project Manager">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="supportManager" label="Support Manager">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native name="license" label="License">
                    <option value="" selected/>
                    { 
                    spContacts.length > 0 && spContacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>
              </Box>
              <Box
              rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(1, 1fr)',
                sm: 'repeat(1, 1fr)',
              }}
            >
              <RHFUpload
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onDelete={handleRemoveFile}
                  // onUpload={() => console.log('ON UPLOAD')}
                />
                </Box>
                <Box
                rowGap={3}
              columnGap={2}
              display="grid"
              gridTemplateColumns={{
                xs: 'repeat(2, 1fr)',
                sm: 'repeat(2, 1fr)',
              }}
            >
              <RHFMultiSelect
                chip
                checkbox
                name="tools"
                label="Tools"
                options={MACHINE_TOOLS}
              />
              <RHFTextField name="itags" label="Internal tags" />
              <RHFTextField name="ctags" label="Customer tags" />
              </Box>
             
              </Stack>

            <Stack alignItems="flex-start" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                Save Machine
              </LoadingButton>
            </Stack>
                        
            </Card>
          
          </Grid>
        </Grid>
    </FormProvider>
  );
}
