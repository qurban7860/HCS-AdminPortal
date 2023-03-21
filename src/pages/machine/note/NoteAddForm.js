import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useLayoutEffect, useMemo ,useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, DialogTitle, Dialog, InputAdornment,TextField } from '@mui/material';
// slice
// import { getUsers } from '../../../redux/slices/user';
// import { getSites } from '../../../redux/slices/site';
// import { getContacts } from '../../../redux/slices/contact';
// import { getCustomers } from '../../../redux/slices/customer';
import { saveNote, setNoteFormVisibility } from '../../../redux/slices/customer/note';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { useSnackbar } from '../../../components/snackbar';

import { useAuthContext } from '../../../auth/useAuthContext';


import FormProvider, {
  RHFSelect,
  RHFEditor,
  RHFTextField,
  RHFSwitch
} from '../../../components/hook-form';

// ----------------------------------------------------------------------

NoteAddForm.propTypes = {
  isEdit: PropTypes.bool,
  readOnly: PropTypes.bool,
  currentNote: PropTypes.object,
};

export default function NoteAddForm({ isEdit, readOnly, currentNote }) {

  // const { users } = useSelector((state) => state.user);

  const { sites } = useSelector((state) => state.site);

  const { contacts } = useSelector((state) => state.contact);

  const { customer } = useSelector((state) => state.customer);


  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

 // a note can be archived. An archived 

  const AddNoteSchema = Yup.object().shape({
    note: Yup.string().required("Note Field is required!"),
    // customer: Yup.string().nullable(),
    site: Yup.string().nullable(),
    // user: Yup.string(),
    contact: Yup.string().nullable(),
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
      site: null,
      contact: null,
      machine: customer._id,
      // user: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentNote]
  );

  const methods = useForm({
    resolver: yupResolver(AddNoteSchema),
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

  // useLayoutEffect(() => {
  //   // dispatch(getUsers(customer._id));
  //   dispatch(getSites(customer._id));
  //   dispatch(getContacts(customer._id));

  // }, [dispatch,customer]);

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
    console.log("Form Submited",data);
      try{
        await dispatch(saveNote(customer._id,data));
        reset();
      } catch(error){
        enqueueSnackbar('Saving failed!');
        console.error(error);
      }
      
  };

  const toggleCancel = () => 
  {
    dispatch(setNoteFormVisibility(false));
  };

  // const [visibilityAgainst, setVisibilityAgainst]= useState(0);
  // const handleChange = event => {
  //   const { value } = event.target
  //   console.log(value)
  //   event.stopPropagation()
  //   // document.querySelectorAll([".visible"])
  //   // document.getElementsByClassName('visible')
  //   setVisibilityAgainst(value)
  // }
  // const visibilitydocument = document.getElementsByName('site').value
  // const visibilitydocument2 = document.getElementsByName('contact').value

  // console.log(visibilitydocument,visibilitydocument2)


  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }} >
            <Stack spacing={3}>
              <Stack spacing={1}>
                <Typography variant="h3" sx={{ color: 'text.secondary' }}>
                Create a new Note
                </Typography>

              </Stack>
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(2, 1fr)',
                }}
              >
              {/* <RHFSelect native name="against" id="against" label="Please select Notes Against" onChange={handleChange} >
                    <option value="" defaultValue="Please select Notes Against"/>

                    <option key={1} value='site'>Site</option>
                    <option key={2} value='contact'>Contact</option>

              </RHFSelect> */}

              {/* <RHFSelect native name="customer" label="Customer">
                    <option value="" defaultValue="please select option" />
                    { 
                    customers.length > 0 && customers.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect> */}
              <RHFSelect native name="site" label="Select Site" className="visible" >
                    <option defaultValue value="null" selected >No Site Selected</option>
                    { 
                    sites.length > 0 && sites.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.name}
                    </option>
                  ))}
              </RHFSelect>
              <RHFSelect native  name="contact" label="Select Contact" className="visible" >
                    <option defaultValue value="null" selected >No Contact Selected</option>
                    { 
                    contacts.length > 0 && contacts.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect>

              {/* <RHFSelect native name="user" label="User" >
                    <option value="" defaultValue="please select option"/>
                    { 
                    users.length > 0 && users.map((option) => (
                    <option key={option._id} value={option._id}>
                      {option.firstName} {option.lastName}
                    </option>
                  ))}
              </RHFSelect> */}

              </Box>
              {/* <RHFEditor simple name="note"  /> */}
              <RHFTextField name="note" label="Note*" minRows={8} multiline />
              {/* <TextField name="note" label="Note*" minRows={8} multiline /> */}

              {/* <RHFSwitch
              name="isArchived"
              labelPlacement="start"
              label={
                <>
                  <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                    isArchived
                  </Typography>
                </>
              }
              sx={{ mx: 0, width: 1, justifyContent: 'space-between' }}
              /> */}

            <Box
                rowGap={5}
                columnGap={4}
                display="grid"
                gridTemplateColumns={{
                  xs: 'repeat(1, 1fr)',
                  sm: 'repeat(4, 1fr)',
                }}
              > 
              
                <LoadingButton type="submit" variant="contained" size="large" loading={isSubmitting}>
                  Save Note
                </LoadingButton>
              
                <Button 
                  onClick={toggleCancel}
                  variant="outlined" 
                  size="large">
                    Cancel
                </Button>


            </Box>

            </Stack>  

            
          </Card>
          
        </Grid>
      </Grid>
    </FormProvider>
  );
}
