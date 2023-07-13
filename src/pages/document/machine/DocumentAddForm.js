import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Box,
  Card,
  Grid,
  Stack,
  Typography,
  Autocomplete,
  TextField,
  Link,
  Dialog,
} from '@mui/material';
// slice
import {
  addMachineDocument,
  setMachineDocumentFormVisibility,
  getMachineDocuments,
} from '../../../redux/slices/document/machineDocument';
import {
  setDocumentCategoryFormVisibility,
  getActiveDocumentCategories,
} from '../../../redux/slices/document/documentCategory';
import {
  setDocumentTypeFormVisibility,
  resetActiveDocumentTypes,
  getActiveDocumentTypesWithCategory,
} from '../../../redux/slices/document/documentType';
import {
  addDocumentVersion,
  updateDocumentVersion,
} from '../../../redux/slices/document/documentVersion';
// schema
import { AddMachineDocumentSchema } from '../../schemas/machine';
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
import FormProvider, { RHFTextField, RHFUpload } from '../../../components/hook-form';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../components/DocumentForms/RadioButtons';
// assets
import { countries } from '../../../assets/data';
// constants
import {
  Snacks,
  FORMLABELS,
  fileTypesMessage,
  DocRadioNewVersion,
  DocRadioNewDocument,
  DocRadioExistingDocument,
} from '../../../constants/document-constants';

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({ currentDocument }) {
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { machine } = useSelector((state) => state.machine);
  const { machineDocuments } = useSelector((state) => state.machineDocument);
  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [documentVal, setDocumentVal] = useState('');
  const [selectedValue, setSelectedValue] = useState('new');
  const [selectedVersionValue, setSelectedVersionValue] = useState('newVersion');
  const [descriptionVal, setDescriptionVal] = useState('');
  const [readOnlyVal, setReadOnlyVal] = useState(false);
  const [customerAccessVal, setCustomerAccessVal] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [nameVal, setNameVal] = useState('');
  const [displayNameVal, setDisplayNameVal] = useState('');
  const [previewVal, setPreviewVal] = useState('');
  const [preview, setPreview] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setDocumentVal('');
    setSelectedValue('new');
    setSelectedVersionValue('newVersion');
    setNameVal('');
    setDocumentTypeVal('');
    setDocumentCategoryVal('');
    setCustomerAccessVal(false);
    setReadOnlyVal(false);
    setDescriptionVal('');
    dispatch(resetActiveDocumentTypes());
    // dispatch(getActiveDocumentTypes());
    dispatch(getActiveDocumentCategories());
  }, [dispatch, machine._id]);

  useEffect(() => {
    if (documentCategoryVal?._id) {
      console.log('getActiveDocumentCategories');
      dispatch(getActiveDocumentTypesWithCategory(documentCategoryVal?._id));
    }
  }, [documentCategoryVal, dispatch]);

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: '',
      images: null,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddMachineDocumentSchema),
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
    try {
      data.name = nameVal;
      data.displayName = displayNameVal;
      data.isActive = isActive;
      data.machine = machine._id;
      if (documentCategoryVal) {
        data.documentCategory = documentCategoryVal?._id;
      }
      if (customerAccessVal === true || customerAccessVal === 'true') {
        data.customerAccess = true;
      } else {
        data.customerAccess = false;
      }
      if (documentTypeVal) {
        data.documentType = documentTypeVal?._id;
      }
      if (descriptionVal) {
        data.description = descriptionVal;
      }
      if (selectedValue === 'new') {
        await dispatch(addMachineDocument(machine?.customer?._id, machine._id, data));
        enqueueSnackbar(Snacks.addedMachineDoc);
      } else if (selectedVersionValue === DocRadioNewVersion.value) {
        await dispatch(addDocumentVersion(documentVal._id, data));
        enqueueSnackbar(Snacks.updatedVersionMachineDoc);
      } else {
        await dispatch(
          updateDocumentVersion(documentVal._id, documentVal?.documentVersions[0]?._id, data)
        );
        enqueueSnackbar(Snacks.updatedMachineDoc);
      }
      dispatch(getMachineDocuments(machine._id));
      dispatch(setMachineDocumentFormVisibility(false));
      setDocumentCategoryVal('');
      setDocumentTypeVal('');
      setCustomerAccessVal('');
      setNameVal('');
      setDisplayNameVal('');
      setReadOnlyVal(false);
      setDocumentVal('');
      setSelectedValue('new');
      setSelectedVersionValue('newVersion');
      setReadOnlyVal(false);
      setPreview(false);
      setPreviewVal('');
      setDescriptionVal('');
      reset();
    } catch (error) {
      enqueueSnackbar(Snacks.failedSaveDoc, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    dispatch(setMachineDocumentFormVisibility(false));
  };

  const togleCategoryPage = () => {
    dispatch(setDocumentCategoryFormVisibility(true));
    dispatch(setMachineDocumentFormVisibility(false));
  };
  const togleDocumentNamePage = () => {
    dispatch(setDocumentTypeFormVisibility(true));
    dispatch(setMachineDocumentFormVisibility(false));
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileName = file.name.split('.');
      if (fileTypesMessage.includes(fileName[fileName.length - 1])) {
        setNameVal(fileName[0]);
      }
      const newFile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setPreviewVal(file.preview);
        setValue('images', newFile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const previewHandle = () => {
    setPreview(true);
  };

  const handleClosePreview = () => {
    setPreview(false);
  };

  const handleRemoveFile = () => {
    setValue('images', '', { shouldValidate: true });
    setNameVal('');
  };

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.value === 'new') {
      setReadOnlyVal(false);
      setDocumentVal('');
      setNameVal('');
      setDisplayNameVal('');
      setDocumentTypeVal('');
      setDocumentCategoryVal('');
      setDescriptionVal('');
      setCustomerAccessVal(false);
      setReadOnlyVal(false);
    }
  };

  const handleVersionRadioChange = (event) => {
    setSelectedVersionValue(event.target.value);
  };

  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };

  const handleIsActiveChange = () => {
    setIsActive(!isActive);
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
                <Grid container lg={12}>
                  <FormHeading heading="New Document" />
                </Grid>
                <RadioButtons
                  value={selectedValue}
                  handleRadioChange={handleRadioChange}
                  newValue={DocRadioNewDocument.value}
                  newLabel={DocRadioNewDocument.label}
                  secondValue={DocRadioNewVersion.value}
                  secondLabel={DocRadioNewVersion.label}
                />

                {selectedValue === DocRadioNewVersion.value && (
                  <Grid container lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <Autocomplete
                          // freeSolo
                          // disabled={documentAvailable}
                          value={documentVal || null}
                          options={machineDocuments}
                          // isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) =>
                            `${option.displayName ? option.displayName : ''}`
                          }
                          onChange={(event, newValue) => {
                            if (newValue) {
                              const { _id, displayName } = newValue;
                              setDocumentVal(newValue);
                              setDisplayNameVal(newValue.displayName);
                              setDocumentTypeVal(newValue.docType);
                              setDocumentCategoryVal(newValue.docCategory);
                              setCustomerAccessVal(newValue.customerAccess);
                              // setDescriptionVal(newValue.description);
                              setReadOnlyVal(true);
                            } else {
                              setDocumentVal('');
                              setDisplayNameVal('');
                              setDocumentTypeVal('');
                              setDocumentCategoryVal('');
                              setDescriptionVal('');
                              setCustomerAccessVal(false);
                              setReadOnlyVal(false);
                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>{`${
                              option.displayName ? option.displayName : ''
                            }`}</li>
                          )}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField {...params} required label="Documents" />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {(selectedValue === DocRadioNewDocument.value || documentVal) && (
                  <Grid container lg={12}>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>
                        <Autocomplete
                          // freeSolo
                          disabled={readOnlyVal}
                          // readOnly={readOnlyVal}
                          value={documentCategoryVal || null}
                          options={activeDocumentCategories}
                          isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setDocumentCategoryVal(newValue);
                            } else {
                              setDocumentCategoryVal('');
                              dispatch(resetActiveDocumentTypes());
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
                            <TextField {...params} required label="Document Category" />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <Autocomplete
                          // freeSolo
                          disabled={readOnlyVal}
                          // readOnly={readOnlyVal}
                          value={documentTypeVal || null}
                          options={activeDocumentTypes}
                          // isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setDocumentTypeVal(newValue);
                            } else {
                              setDocumentTypeVal('');
                            }
                          }}
                          // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField {...params} required label="Document Type" />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {documentVal && (
                  <RadioButtons
                    value={selectedVersionValue}
                    handleRadioChange={handleVersionRadioChange}
                    newValue={DocRadioNewVersion.value}
                    newLabel={DocRadioNewVersion.label}
                    secondValue={DocRadioExistingDocument.value}
                    secondLabel={DocRadioExistingDocument.currLabel}
                  />
                )}

                {selectedValue === 'new' && (
                  <RHFTextField
                    required
                    disabled={readOnlyVal}
                    name="name"
                    value={displayNameVal}
                    label="Name"
                    onChange={(e) => {
                      setDisplayNameVal(e.target.value);
                    }}
                  />
                )}

                {(selectedValue === 'new' ||
                  (documentVal && selectedVersionValue !== 'existingVersion')) && (
                  <RHFTextField
                    value={descriptionVal}
                    name="description"
                    onChange={handleChangeDescription}
                    label="Description"
                    minRows={3}
                    multiline
                  />
                )}

                {(selectedValue === 'new' || documentVal) && (
                  <Grid item xs={12} md={6} lg={12}>
                    <RHFUpload
                      required
                      // multiple
                      // thumbnail
                      onPreview={previewHandle}
                      name="images"
                      maxSize={30145728}
                      onDelete={handleRemoveFile}
                      onDrop={handleDrop}
                      onRemove={handleDrop}
                      // onRemoveAll={handleRemoveAllFiles}
                      // onUpload={() => console.log('ON UPLOAD')}
                      // onDelete={handleRemoveFile}
                      // onUpload={() => console.log('ON UPLOAD')}
                    />
                  </Grid>
                )}
                {selectedValue === 'new' && (
                  <ToggleButtons
                    customerAccessVal={customerAccessVal}
                    handleChange={handleChange}
                    isActive={isActive}
                    handleIsActiveChange={handleIsActiveChange}
                  />
                )}

                {/* <Upload multiple files={files} name="image"  onDrop={handleDrop} onDelete={handleRemoveFile} />
                {!!files.length && (
          <Button variant="outlined" color="inherit" onClick={handleRemoveAllFiles}>
            Remove all
          </Button>
        )} */}
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </Box>
      <Dialog
        maxWidth="md"
        open={preview}
        onClose={handleClosePreview}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <Grid
          container
          item
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            padding: '10px',
          }}
        >
          <Typography variant="h4" sx={{ px: 2 }}>
            {nameVal}
          </Typography>
          <Link onClick={() => handleClosePreview()} href="#" underline="none" sx={{ ml: 'auto' }}>
            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
          </Link>
        </Grid>
        {/* <Grid  > */}
        <Box
          component="img"
          sx={{ minWidth: '400px', minHeight: '400px' }}
          alt={defaultValues?.name}
          src={previewVal}
        />
        {/* </Grid> */}
      </Dialog>
    </FormProvider>
  );
}
