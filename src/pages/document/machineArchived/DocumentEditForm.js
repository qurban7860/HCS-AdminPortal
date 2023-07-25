import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Switch, Box, Card, Grid, Stack, Typography, Autocomplete, TextField } from '@mui/material';
// schema
import { EditMachineDocumentSchema } from '../../schemas/document';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
// slice
import {
  setMachineDocumentEdit,
  setMachineDocumentEditFormVisibility,
  updateMachineDocument,
} from '../../../redux/slices/document/machineDocument';
import {
  setDocumentCategoryFormVisibility,
  getActiveDocumentCategories,
} from '../../../redux/slices/document/documentCategory';
import {
  setDocumentTypeFormVisibility,
  getActiveDocumentTypes,
  getActiveDocumentTypesWithCategory,
} from '../../../redux/slices/document/documentType';

// ----------------------------------------------------------------------

export default function DocumentEditForm() {
  const { machineDocument } = useSelector((state) => state.machineDocument);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { machine, machines } = useSelector((state) => state.machine);

  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [customerAccessVal, setCustomerAccessVal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [nameVal, setNameVal] = useState('');

  const navigate = useNavigate();

  const dispatch = useDispatch();

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setNameVal(machineDocument?.displayName);
    setCustomerAccessVal(machineDocument?.customerAccess);
    setDocumentCategoryVal(machineDocument?.docCategory);
    setDocumentTypeVal(machineDocument?.docType);
    setIsActive(machineDocument?.isActive);
    // dispatch(getActiveDocumentTypes())
    // dispatch(getActiveDocumentCategories())
  }, [dispatch, machineDocument]);

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: machineDocument?.description || '',
      // image: null,
      isActive: machineDocument?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditMachineDocumentSchema),
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

  const onSubmit = async (data) => {
    try {
      data.customer = machine.customer._id;
      if (nameVal) {
        data.displayName = nameVal;
      }
      if (documentTypeVal) {
        data.documentType = documentTypeVal._id;
      }
      // if(documentCategoryVal){
      //   data.category = documentCategoryVal._id
      // }
      data.customerAccess = customerAccessVal;
      data.isActive = isActive;
      // console.log("data : ",data)
      await dispatch(updateMachineDocument(machineDocument?._id, machine?._id, data));
      reset();
    } catch (err) {
      enqueueSnackbar('Machine document save failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => {
    dispatch(setMachineDocumentEditFormVisibility(false));
  };

  const togleCategoryPage = () => {
    dispatch(setMachineDocumentEdit(true));
    dispatch(setDocumentCategoryFormVisibility(true));
    dispatch(setMachineDocumentEditFormVisibility(false));
  };
  const togleDocumentNamePage = () => {
    dispatch(setMachineDocumentEdit(true));
    dispatch(setDocumentTypeFormVisibility(true));
    dispatch(setMachineDocumentEditFormVisibility(false));
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
    setValue('cover', null);
  };

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };

  const handleIsActiveChange = () => {
    setIsActive(!isActive);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={4}>
        <Grid item xs={18} md={12}>
          <Card sx={{ p: 3 }}>
            <Stack spacing={3}>
              <FormHeading heading="Edit Document" />
              <Box
                rowGap={3}
                columnGap={2}
                display="grid"
                gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
              >
                <Autocomplete
                  // freeSolo
                  disabled
                  value={documentCategoryVal || null}
                  options={activeDocumentCategories}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setDocumentCategoryVal(newValue);
                      // dispatch(getActiveDocumentTypesWithCategory(newValue?._id))
                      // setDocumentTypeVal("");
                    } else {
                      setDocumentCategoryVal('');
                      // setDocumentTypeVal("");
                      // dispatch(getActiveDocumentTypes())
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      {option.name}
                    </li>
                  )}
                  id="controllable-states-demo"
                  renderInput={(params) => (
                    <TextField {...params} required label="Document Category" />
                  )}
                  ChipProps={{ size: 'small' }}
                />
                <Autocomplete
                  // freeSolo
                  disabled
                  value={documentTypeVal || null}
                  options={activeDocumentTypes}
                  isOptionEqualToValue={(option, value) => option.name === value.name}
                  getOptionLabel={(option) => option.name}
                  onChange={(event, newValue) => {
                    if (newValue) {
                      setDocumentTypeVal(newValue);
                      // if(!documentCategoryVal){
                      //   setDocumentCategoryVal(newValue?.docCategory);
                      // }
                    } else {
                      setDocumentTypeVal('');
                    }
                  }}
                  renderOption={(props, option) => (
                    <li {...props} key={option._id}>
                      {option.name}
                    </li>
                  )}
                  id="controllable-states-demo"
                  renderInput={(params) => <TextField {...params} required label="Document Type" />}
                  ChipProps={{ size: 'small' }}
                />
              </Box>

              <RHFTextField
                name="displayName"
                value={nameVal}
                label="Name"
                onChange={(e) => {
                  setNameVal(e.target.value);
                }}
              />

              <RHFTextField name="description" label="Description" minRows={8} multiline />

              <Grid container lg={12}>
                <Grid display="flex" justifyContent="flex-end">
                  <Typography
                    variant="body1"
                    sx={{
                      pt: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    Customer Access
                  </Typography>
                  <Switch sx={{ mt: 1 }} checked={customerAccessVal} onChange={handleChange} />
                </Grid>

                <Grid display="flex" justifyContent="flex-end">
                  <Typography
                    variant="body1"
                    sx={{
                      pt: 1,
                      display: 'flex',
                      justifyContent: 'flex-end',
                      alignItems: 'center',
                    }}
                  >
                    isActive
                  </Typography>
                  <Switch sx={{ mt: 1 }} checked={isActive} onChange={handleIsActiveChange} />
                </Grid>
              </Grid>

              {/* <RHFUpload
                  name="image"
                  maxSize={3145728}
                  onDrop={handleDrop}
                  onRemove={handleDrop}
               /> */}
              {/* <RHFSwitch name="isActive" labelPlacement="start" label={ <Typography variant="subtitle2" sx={{ mx: 0, width: 1, justifyContent: 'space-between', mb: 0.5, color: 'text.secondary' }}> Active</Typography> } /> */}
              <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}
