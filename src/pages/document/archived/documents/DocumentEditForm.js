import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState, useLayoutEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Card, Grid, Stack, Autocomplete, TextField, Container } from '@mui/material';
// global
// redux
import { updateDocument } from '../../../../redux/slices/document/document';
// hooks
import { useSnackbar } from '../../../../components/snackbar';
// routes
import { PATH_DASHBOARD } from '../../../../routes/paths';
// components
import FormProvider, { RHFTextField } from '../../../../components/hook-form';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
import FormHeading from '../../../components/DocumentForms/FormHeading';
import DocumentCover from '../../../components/DocumentForms/DocumentCover';
// schema
import { EditCustomerDocumentSchema } from '../../../schemas/customer';
// constants
import { Snacks } from '../../../../constants/document-constants';
import { FORMLABELS } from '../../../../constants/default-constants';

// ----------------------------------------------------------------------

export default function DocumentEditForm() {
  const { document, documentHistory } = useSelector((state) => state.document);
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { customer } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact);
  const { sites } = useSelector((state) => state.site);

  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [descriptionVal, setDescriptionVal] = useState('');
  const [customerAccessVal, setCustomerAccessVal] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [nameVal, setNameVal] = useState('');

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setNameVal(documentHistory?.displayName);
    setCustomerAccessVal(documentHistory?.customerAccess);
    setIsActive(documentHistory?.isActive);
    setDocumentCategoryVal(documentHistory?.docCategory);
    setDocumentTypeVal(documentHistory?.docType);
    setDescriptionVal(documentHistory?.description);
  }, [dispatch, documentHistory]);

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: documentHistory?.description || '',
      // image: null,
      isActive: documentHistory?.isActive,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    resolver: yupResolver(EditCustomerDocumentSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const onSubmit = async (data) => {
    try {
      data.customer = customer._id;
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
      await dispatch(updateDocument(documentHistory?._id, data, customer._id));
      enqueueSnackbar('Document saved successfully!');
      navigate(PATH_DASHBOARD.document.view(documentHistory._id));
      setDescriptionVal('');
      setNameVal('');
      setDocumentCategoryVal('');
      setDocumentTypeVal('');
      reset();
    } catch (err) {
      enqueueSnackbar(Snacks.failedSaveDoc, { variant: `error` });
      console.error(err.message);
    }
  };

  const toggleCancel = () => {
    navigate(PATH_DASHBOARD.document.dashboard);
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

  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };

  return (
    <Container maxWidth={false}>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <DocumentCover content={documentHistory?.displayName} />
        <Grid container spacing={4}>
          <Grid item xs={18} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <FormHeading heading={FORMLABELS.EDIT_DOCUMENT} />
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
                  label="Name"
                  onChange={(e) => {
                    setNameVal(e.target.value);
                  }}
                />
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
                  handleChange={handleChange}
                  customerAccessVal={customerAccessVal}
                  checked={isActive}
                  handleIsActiveChange={handleIsActiveChange}
                />
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
