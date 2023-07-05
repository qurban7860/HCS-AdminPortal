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
import {
  Box,
  Button,
  Card,
  Grid,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Container,
} from '@mui/material';
// ROUTES
import { PATH_MACHINE, PATH_DASHBOARD, PATH_DOCUMENT, PATH_SETTING } from '../../../routes/paths';
// slice
import {
  addDocumentCategory,
  setDocumentCategoryFormVisibility,
} from '../../../redux/slices/document/documentCategory';
import {
  setMachineDocumentFormVisibility,
  setMachineDocumentEditFormVisibility,
} from '../../../redux/slices/document/machineDocument';
import {
  setCustomerDocumentFormVisibility,
  setCustomerDocumentEditFormVisibility,
} from '../../../redux/slices/document/customerDocument';

// components
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import FormHeading from '../../components/DocumentForms/FormHeading';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { Cover } from '../../components/Defaults/Cover';

// ----------------------------------------------------------------------
DocumentCategoryAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentCategoryAddForm({ currentDocument }) {
  const { documentCategory, documentCategories } = useSelector((state) => state.documentCategory);
  const { customerDocumentEdit } = useSelector((state) => state.customerDocument);
  const { machineDocumentEdit } = useSelector((state) => state.machineDocument);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  // a note can be archived.
  const AddDocumentCategorySchema = Yup.object().shape({
    name: Yup.string().min(2).max(40).required('Name Field is required!'),
    description: Yup.string().max(10000),
    isActive: Yup.boolean(),
    customerAccess: Yup.boolean(),
  });
  const defaultValues = useMemo(
    () => ({
      name: '',
      description: '',
      isActive: true,
      customerAccess: false,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentCategorySchema),
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
    reset(defaultValues);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = async (data) => {
    // console.log("Document Category : ", data);
    try {
      const response = await dispatch(addDocumentCategory(data));
      console.log('response : ', response);
      reset();
      enqueueSnackbar('Document Save Successfully!');
      navigate(PATH_SETTING.documentCategory.list);
    } catch (error) {
      enqueueSnackbar('Document Save failed!', { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_SETTING.documentCategory.list);
  };
  return (
    <Container maxWidth={false}>
      <Card
        sx={{
          mb: 3,
          height: 160,
          position: 'relative',
          // mt: '24px',
        }}
      >
        <Cover
          name="New Document Category"
          generalSettings
          backLink={PATH_SETTING.documentCategory.list}
        />
      </Card>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <RHFTextField name="name" label="Name" />
                <RHFTextField name="description" label="Description" minRows={8} multiline />
                <Grid display="flex">
                  <RHFSwitch
                    name="customerAccess"
                    labelPlacement="start"
                    label={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mx: 0,
                          width: 1,
                          justifyContent: 'space-between',
                          mb: 0.5,
                          color: 'text.secondary',
                        }}
                      >
                        {' '}
                        Customer Access
                      </Typography>
                    }
                  />

                  <RHFSwitch
                    name="isActive"
                    labelPlacement="start"
                    label={
                      <Typography
                        variant="subtitle2"
                        sx={{
                          mx: 0,
                          width: 1,
                          justifyContent: 'space-between',
                          mb: 0.5,
                          color: 'text.secondary',
                        }}
                      >
                        {' '}
                        Active
                      </Typography>
                    }
                  />
                </Grid>
              </Stack>
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
