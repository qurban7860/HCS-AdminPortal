import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Button, Card, Grid, Stack, Typography, Autocomplete, TextField , Container} from '@mui/material';
// ROUTES
import { PATH_MACHINE , PATH_DASHBOARD, PATH_DOCUMENT, PATH_SETTING } from '../../../routes/paths';
// slice
import { addDocumentType, setDocumentTypeFormVisibility } from '../../../redux/slices/document/documentType';
import { setMachineDocumentFormVisibility, setMachineDocumentEditFormVisibility  } from '../../../redux/slices/document/machineDocument';
import { setCustomerDocumentFormVisibility, setCustomerDocumentEditFormVisibility } from '../../../redux/slices/document/customerDocument';
import { getActiveDocumentCategories } from '../../../redux/slices/document/documentCategory';

// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, {RHFTextField,RHFSwitch} from '../../../components/hook-form';
import FormHeading from '../../components/FormHeading';
import AddFormButtons from '../../components/AddFormButtons';
import { Cover } from '../../components/Cover';

// ----------------------------------------------------------------------
DocumentTypeAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentTypeAddForm({currentDocument}) {
  const { documentType, documentTypes } = useSelector((state) => state.documentType);
  const { customerDocumentEdit } = useSelector((state) => state.customerDocument);
  const { machineDocumentEdit } = useSelector((state) => state.machineDocument);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);

  const [ documentCategoryVal, setDocumentCategoryVal] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
 // a note can be archived.
  const AddDocumentTypeSchema = Yup.object().shape({
    // category: Yup.string().min(2).required("Category is required!"),
    name: Yup.string().min(2).max(40).required("Name is required!"),
    description: Yup.string().max(10000),
    isActive : Yup.boolean(),
    customerAccess: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      category:'',
      name: '',
      description: '',
      isActive: true,
      customerAccess: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentTypeSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
      dispatch(getActiveDocumentCategories())
      reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[dispatch]);

  const onSubmit = async (data) => {
      try{
        if(documentCategoryVal){
          data.docCategory= documentCategoryVal._id 
        }
        const response = await dispatch(addDocumentType(data));
        reset();
        enqueueSnackbar('Document Save Successfully!');
        navigate(PATH_SETTING.documentType.list)
      } catch(error){
        enqueueSnackbar('Document Save failed!', { variant: `error` });
        console.error(error);
      }
  };

  const toggleCancel = () =>
  {
    navigate(PATH_SETTING.documentType.list);
    dispatch(setDocumentTypeFormVisibility(false))
    dispatch(setMachineDocumentFormVisibility(true))
    dispatch(setCustomerDocumentFormVisibility(true))
  };
  return (
    <Container maxWidth={false }>
        <Card
          sx={{
            mb: 3,
            height: 160,
            position: 'relative',
            // mt: '24px',
          }}
        >
          <Cover name="New Document Type"  generalSettings backLink={PATH_SETTING.documentType.list} /> 
        </Card>
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }} >
            <Stack spacing={2}>
            {/* <Grid item lg={6}> */}
                      <Autocomplete
                        // freeSolo
                        value={documentCategoryVal || null}
                        options={activeDocumentCategories}
                        isOptionEqualToValue={(option, value) => option.name === value.name}
                        getOptionLabel={(option) => `${option.name ? option.name : ""}`}
                        onChange={(event, newValue) => {
                          if (newValue) {
                            setDocumentCategoryVal(newValue);
                          } else {
                            setDocumentCategoryVal('');
                          }
                        }}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>
                            {option.name}
                          </li>
                        )}
                        id="controllable-states-demo"
                        renderInput={(params) => <TextField {...params} required label="Document Category" />}
                        ChipProps={{ size: 'small' }}
                      />
                    {/* </Grid> */}
              <RHFTextField name="name" label="Type Name" required/>
              <RHFTextField name="description" label="Description" minRows={8} multiline />
              <Grid display="flex">
              <RHFSwitch name="customerAccess" labelPlacement="start" label={
                <Typography
                                    variant="subtitle2"
                                    sx={{
                                          mx: 0,
                                          width: 1,
                                          justifyContent: 'space-between',
                                          mb: 0.5,
                                          color: 'text.secondary'
                                        }}> Customer Access
                                        </Typography>
                                        } />

              <RHFSwitch name="isActive" labelPlacement="start" label={
                              <Typography
                                    variant="subtitle2"
                                    sx={{
                                          mx: 0,
                                          width: 1,
                                          justifyContent: 'space-between',
                                          mb: 0.5,
                                          color: 'text.secondary'
                                        }}> Active
                                        </Typography>
                                        } />
              
              </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel}/>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
    </Container>
  );
}
