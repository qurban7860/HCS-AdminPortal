import * as Yup from 'yup';
import PropTypes from 'prop-types';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Autocomplete, TextField } from '@mui/material';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

// slice
import {
  setDocumentFormVisibility,
  setDocumentEdit,
  setDocumentEditFormVisibility,
  getDocument,
  getDocuments,
  updateDocument,
} from '../../../redux/slices/document/document';

import {
  setDocumentCategoryFormVisibility,
  getActiveDocumentCategories,
} from '../../../redux/slices/document/documentCategory';
import { setDocumentTypeFormVisibility } from '../../../redux/slices/document/documentType';
import { Snacks } from '../../../constants/document-constants';

// ----------------------------------------------------------------------
DocumentEditForm.propTypes = {
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
};
export default function DocumentEditForm({ customerPage, machinePage }) {
  const { document } = useSelector((state) => state.document);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { customer } = useSelector((state) => state.customer);
  const { machine } = useSelector((state) => state.machine);
  const { enqueueSnackbar } = useSnackbar();
  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [descriptionVal, setDescriptionVal] = useState('');
  const [customerAccessVal, setCustomerAccessVal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [nameVal, setNameVal] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setNameVal(document?.displayName);
    setCustomerAccessVal(document?.customerAccess);
    setIsActive(document?.isActive);
    setDocumentCategoryVal(document?.docCategory);
    setDocumentTypeVal(document?.docType);
    setDescriptionVal(document?.description);
    // dispatch(getActiveDocumentCategories())
    // dispatch(getActiveDocumentTypes())
  }, [dispatch, document]);

  const EditDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(40),
    description: Yup.string().max(10000),
    // image: Yup.mixed().required("Image Field is required!"),
    referenceNumber: Yup.string().max(15),
    versionNo: Yup.string().max(10),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: document?.description || '',
      // image: null,
      referenceNumber: document?.referenceNumber || '',
      versionNo: document?.versionNo || '',
      isActive: document?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditDocumentSchema),
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
      if (nameVal) {
        data.displayName = nameVal;
      }
      if (documentTypeVal) {
        data.documentType = documentTypeVal._id;
      }
      // if(fileCategoryVal){
      //   data.category = fileCategoryVal._id
      // }
      if (descriptionVal) {
        data.description = descriptionVal;
      }
      data.customerAccess = customerAccessVal;
      data.isActive = isActive;
      await dispatch(
        updateDocument(
          document?._id,
          data,
          customerPage ? customer?._id : null,
          machinePage ? machine?._id : null
        )
      );
      await dispatch(getDocument(document?._id));
      enqueueSnackbar(Snacks.updatedDoc, { variant: `success` });

      setDescriptionVal('');
      setNameVal('');
      setDocumentCategoryVal('');
      setDocumentTypeVal('');
      reset();
    } catch (err) {
      enqueueSnackbar(Snacks.failedUpdateDoc, { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => {
    dispatch(setDocumentEditFormVisibility(false));
  };

  // if not used, remove the unused vars
  // const togleCategoryPage = () => {
  //   dispatch(setCustomerDocumentEdit(true));
  //   dispatch(setDocumentCategoryFormVisibility(true));
  //   dispatch(setCustomerDocumentEditFormVisibility(false));
  // };
  // const togleDocumentNamePage = () => {
  //   dispatch(setCustomerDocumentEdit(true));
  //   dispatch(setDocumentTypeFormVisibility(true));
  //   dispatch(setCustomerDocumentEditFormVisibility(false));
  // };

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

  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        column={12}
        rowGap={3}
        columnGap={2}
        // display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
      >
        <Grid container xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
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
                    renderInput={(params) => (
                      <TextField {...params} required label="Document Type" />
                    )}
                    ChipProps={{ size: 'small' }}
                  />
                </Box>
                <RHFTextField
                  name="displayName"
                  value={nameVal}
                  label="Document Name*"
                  onChange={(e) => {
                    setNameVal(e.target.value);
                  }}
                />
                <Box
                  rowGap={3}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                >
                  <RHFTextField name='referenceNumber' label='Reference Number' />
                </Box>
                <RHFTextField
                  value={descriptionVal}
                  name="description"
                  label="Description"
                  onChange={handleChangeDescription}
                  minRows={3}
                  multiline
                />
                  <ToggleButtons
                    isDocument
                    customerAccessVal={customerAccessVal}
                    handleChange={handleChange}
                    isActive={isActive}
                    handleIsActiveChange={handleIsActiveChange}
                  />

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
      </Box>
    </FormProvider>
  );
}
