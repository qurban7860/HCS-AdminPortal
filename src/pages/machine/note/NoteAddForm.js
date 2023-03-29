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
import { saveNote, setNoteFormVisibility } from '../../../redux/slices/products/machineNote';
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

  // const { sites } = useSelector((state) => state.site);

  // const { contacts } = useSelector((state) => state.contact);

  const { machine } = useSelector((state) => state.machine);


  const dispatch = useDispatch();
  
  const navigate = useNavigate();

  const { enqueueSnackbar } = useSnackbar();

 // a note can be archived. An archived 

  const AddNoteSchema = Yup.object().shape({
    note: Yup.string().max(10000).required("Note Field is required!"),
    
  });

  const defaultValues = useMemo(
    () => ({
      note: '',
      // machine: machine._id,
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

  useEffect(() => {
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[]);


  const onSubmit = async (data) => {
      try{
        await dispatch(saveNote(machine._id,data));
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
             
              <RHFTextField name="note" label="Note*" minRows={8} multiline />

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
