import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { Box, Card, Grid, Stack, Autocomplete, TextField, Dialog, Container } from '@mui/material';
import ToggleButtons from '../../../components/DocumentForms/ToggleButtons';
// PATH
import { PATH_DASHBOARD, PATH_DOCUMENT } from '../../../../routes/paths';
// slice
import {
  addDocument,
  getCustomerDocuments,
  getMachineDocuments,
  resetActiveDocuments,
  getCustomerSiteDocuments,
} from '../../../../redux/slices/document/document';
import { getActiveDocumentCategories } from '../../../../redux/slices/document/documentCategory';
import {
  resetActiveDocumentTypes,
  getActiveDocumentTypesWithCategory,
} from '../../../../redux/slices/document/documentType';
import {
  addDocumentVersion,
  updateDocumentVersion,
} from '../../../../redux/slices/document/documentVersion';
import {
  resetActiveMachines,
  getActiveModelMachines,
} from '../../../../redux/slices/products/machine';
import { getActiveMachineModels } from '../../../../redux/slices/products/model';
import { getActiveCustomers } from '../../../../redux/slices/customer/customer';
import { getActiveSites, resetActiveSites } from '../../../../redux/slices/customer/site';
// components
import { useSnackbar } from '../../../../components/snackbar';
import FormProvider, { RHFTextField, RHFName, RHFUpload } from '../../../../components/hook-form';
// assets
import DialogLabel from '../../../components/Dialog/DialogLabel';
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../../components/DocumentForms/RadioButtons';
import DocumentMachineAddForm from './DocumentAddForms/DocumentMachineAddForm';
// constants
import {
  allowedExtensions,
  DocRadioValue,
  DocRadioLabel,
  fileTypesMessage,
  Snacks,
} from '../../../../constants/document-constants';
import { FORMLABELS } from '../../../../constants/default-constants';
import DialogPreview from '../../../components/Dialog/Dialogs/DialogPreview';

// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  handleFormVisibility: PropTypes.func,
};

export default function DocumentAddForm({
  currentDocument,
  customerPage,
  machinePage,
  handleFormVisibility,
}) {
  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { activeMachines, machine } = useSelector((state) => state.machine);
  const { activeMachineModels } = useSelector((state) => state.machinemodel);
  const { activeDocuments } = useSelector((state) => state.document);
  // console.log("activeMachineModels : ",activeMachineModels)
  const { activeCustomers, customer } = useSelector((state) => state.customer);
  const { activeContacts } = useSelector((state) => state.contact);
  const { activeSites } = useSelector((state) => state.site);
  // ------------------ document values states ------------------------------
  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [documentVal, setDocumentVal] = useState('');
  const [selectedValue, setSelectedValue] = useState('new');
  const [selectedVersionValue, setSelectedVersionValue] = useState('newVersion');
  const [descriptionVal, setDescriptionVal] = useState('');
  const [readOnlyVal, setReadOnlyVal] = useState(false);
  const [siteDisabled, setSiteDisabled] = useState(false);
  const [contactDisabled, setContactDisabled] = useState(false);

  const [customerAccessVal, setCustomerAccessVal] = useState(false);
  const [documentDependency, setDocumentDependency] = useState('customer');

  // ------------------ customer values states ------------------------------
  const [customerVal, setCustomerVal] = useState('');
  const [customerSiteVal, setCustomerSiteVal] = useState('');
  // ------------------ machine values states ------------------------------
  const [machineVal, setMachineVal] = useState('');
  const [machineModelVal, setMachineModelVal] = useState('');
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
    setDocumentVal('');
    setCustomerAccessVal(false);
    setCustomerSiteVal('');
    setCustomerVal('');
    setReadOnlyVal(false);
    setDescriptionVal('');
    setMachineVal('');
    setMachineModelVal('');
    dispatch(resetActiveDocuments());
    dispatch(resetActiveMachines);
    dispatch(resetActiveSites);
    dispatch(resetActiveDocumentTypes());
    // dispatch(getActiveDocumentTypes());
    dispatch(getActiveDocumentCategories());
    // dispatch(getActiveCustomers());
    // dispatch(getActiveMachines());
    // dispatch(getActiveMachineModels());
    if (customerPage) {
      setCustomerVal(customer);
    }
    if (machinePage) {
      setMachineVal(machine);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  useEffect(() => {
    if (documentCategoryVal?._id) {
      dispatch(getActiveDocumentTypesWithCategory(documentCategoryVal?._id));
    }
  }, [documentCategoryVal, dispatch]);

  useEffect(() => {
    if (documentDependency === 'machine') {
      // dispatch(getActiveMachines());
      dispatch(getActiveMachineModels());
    }
    if (documentDependency === 'customer' && !(customerPage || machinePage)) {
      dispatch(getActiveCustomers());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, documentDependency]);

  useEffect(() => {
    if (documentDependency === 'machine' && machineModelVal) {
      dispatch(getActiveModelMachines(machineModelVal._id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, machineModelVal]);

  useEffect(() => {
    if (customerVal?._id) {
      dispatch(getActiveSites(customerVal._id));
    }
  }, [dispatch, customerVal]);
  // ------------------------- customer documents ---------------------------------------
  useEffect(() => {
    if (!customerSiteVal && customerVal?._id && selectedValue === 'newVersion') {
      dispatch(getCustomerDocuments(customerVal._id));
    }
  }, [dispatch, customerVal, customerSiteVal, selectedValue]);

  // ------------------------- customer Site documents ---------------------------------------
  useEffect(() => {
    if (customerSiteVal?._id && selectedValue === 'newVersion') {
      dispatch(getCustomerSiteDocuments(customerSiteVal._id));
      console.log('customerSiteVal._id : ', customerSiteVal._id);
    }
  }, [dispatch, customerSiteVal, selectedValue]);

  // ------------------------- machine documents ---------------------------------------
  useEffect(() => {
    if (machineVal?._id && selectedValue === 'newVersion') {
      dispatch(getMachineDocuments(machineVal._id, machineModelVal._id));
    }
    if (machineModelVal._id && !machineVal && selectedValue === 'newVersion') {
      dispatch(getMachineDocuments(null, machineModelVal._id));
    }
  }, [dispatch, machineVal, machineModelVal, selectedValue]);

  const validateFileType = (value, options) => {
    const { path, createError } = options;
    if (value && Array.isArray(value)) {
      if (value.length > 10) {
        return createError({
          message: Snacks.fileMaxCount,
          path,
          value,
        });
      }
      const invalidFiles = value.filter((file) => {
        const fileExtension = file?.name?.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(fileExtension);
      });
      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
        return createError({
          message: `Invalid file(s) detected: ${invalidFileNames}`,
          path,
          value,
        });
      }
      return true;
    }
    return createError({
      message: Snacks.fileRequired,
      path,
      value,
    });
  };

  const AddDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(40, 'Document Name must not exceed 40 characters'),
    // .test('length', 'Document Name must not exceed 40 characters', (value)=>  console.log("value : ",value)),
    description: Yup.string().max(10000),
    multiUpload: Yup.mixed()
      .required('File is required!')
      .test('fileType', fileTypesMessage, validateFileType)
      .nullable(true),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: nameVal,
      description: '',
      imultiUpload: null,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );

  const methods = useForm({
    resolver: yupResolver(AddDocumentSchema),
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
  const values = watch();

  const onSubmit = async (data) => {
    try {
      data.name = nameVal;
      data.displayName = displayNameVal;
      data.isActive = isActive;
      data.customerAccess = customerAccessVal;

      if (customerVal) {
        data.customer = customerVal._id;
      }
      if (customerSiteVal) {
        data.site = customerSiteVal._id;
      }
      if (machineModelVal && !machineVal) {
        data.machineModel = machineModelVal._id;
      }
      if (machineVal) {
        data.machine = machineVal._id;
      }
      if (documentCategoryVal) {
        data.documentCategory = documentCategoryVal?._id;
      }
      if (documentTypeVal) {
        data.documentType = documentTypeVal?._id;
      }
      if (descriptionVal) {
        data.description = descriptionVal;
      }
      console.log('Data : ', data);
      if (selectedValue === 'new') {
        await dispatch(addDocument(customerVal?._id, machineVal._id, data));
        enqueueSnackbar(Snacks.docSaved);
        navigate(PATH_DASHBOARD.document.dashboard);
      } else if (selectedVersionValue === 'newVersion') {
        await dispatch(addDocumentVersion(documentVal._id, data));
        enqueueSnackbar(Snacks.docVersionUpdated);
        navigate(PATH_DASHBOARD.document.dashboard);
      } else {
        await dispatch(
          updateDocumentVersion(documentVal._id, documentVal?.documentVersions[0]?._id, data)
        );
        enqueueSnackbar(Snacks.docUpdated);
        navigate(PATH_DASHBOARD.document.dashboard);
      }
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
      setMachineVal('');
      setMachineModelVal('');
      setCustomerVal('');
      setCustomerSiteVal('');
      reset();
    } catch (error) {
      enqueueSnackbar(Snacks.failedSaveDoc, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    if (!customerPage && !machinePage) {
      navigate(PATH_DOCUMENT.document.list);
    } else {
      handleFormVisibility();
    }
  };

  const previewHandle = () => {
    setPreview(true);
  };

  const handleClosePreview = () => {
    setPreview(false);
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

  const handleDependencyChange = (event) => {
    setDocumentDependency(event.target.value);

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
    // if(event.target.value === "newVersion"){
    setDocumentVal('');
    setCustomerVal('');
    setCustomerSiteVal('');
    setMachineModelVal('');
    setMachineVal('');
    dispatch(resetActiveSites());
    dispatch(resetActiveMachines());
    dispatch(resetActiveDocuments());
    // }
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

  const handleDropMultiFile = useCallback(
    (acceptedFiles) => {
      const files = values.multiUpload || [];
      console.log('files: ', files);
      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        })
      );
      console.log('newFiles: ', newFiles);
      setValue('multiUpload', [...files, ...newFiles], { shouldValidate: true });
    },
    [setValue, values.multiUpload]
  );

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Box
        column={12}
        rowGap={3}
        columnGap={2}
        // display="grid"
        gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
        mt={3}
      >
        <Grid container xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                {!(customerPage || machinePage) && (
                  <RadioButtons
                    value={documentDependency}
                    radioOnChange={handleDependencyChange}
                    newLabel={DocRadioLabel.customer}
                    newValue={DocRadioValue.customer}
                    secondLabel={DocRadioLabel.machine}
                    secondValue={DocRadioValue.machine}
                  />
                )}

                {documentDependency === 'customer' && !(customerPage || machinePage) && (
                  <Grid container lg={12}>
                    <Grid container spacing={2}>
                      <Grid item lg={6}>
                        <Autocomplete
                          // freeSolo
                          value={customerVal || null}
                          options={activeCustomers}
                          // isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setCustomerVal(newValue);
                              setContactDisabled(false);
                              setSiteDisabled(false);
                              setCustomerSiteVal('');
                              setMachineVal('');
                              setMachineModelVal('');
                              dispatch(resetActiveSites());
                              setDocumentVal('');
                              dispatch(resetActiveDocuments());
                            } else {
                              setCustomerVal('');
                              setContactDisabled(false);
                              setSiteDisabled(false);
                              setCustomerSiteVal('');
                              dispatch(resetActiveSites());
                              setDocumentVal('');
                              dispatch(resetActiveDocuments());
                            }
                          }}
                          // renderOption={(props, option) => (<li  {...props} key={option._id}>{option.name}</li>)}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField {...params} required label={FORMLABELS.SELECT_CUSTOMER} />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                      <Grid item lg={6}>
                        <Autocomplete
                          // freeSolo
                          disabled={siteDisabled}
                          value={customerSiteVal || null}
                          options={activeSites}
                          isOptionEqualToValue={(option, value) => option.name === value.name}
                          getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setCustomerSiteVal(newValue);
                              // setContactDisabled(true);
                            } else {
                              setCustomerSiteVal('');
                              // setContactDisabled(false);
                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>
                              {option.name}
                            </li>
                          )}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField {...params} label={FORMLABELS.SELECT_SITE} />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/* Machine */}
                {/* will write a better way */}
                {documentDependency === 'machine' && !(customerPage || machinePage) && (
                  <DocumentMachineAddForm
                    disabled={readOnlyVal}
                    value={machineModelVal || null}
                    options={activeMachineModels}
                    onChange={(event, newValue) => {
                      if (newValue) {
                        setMachineModelVal(newValue);
                        setMachineVal('');
                        setCustomerVal('');
                        setCustomerSiteVal('');
                        dispatch(resetActiveMachines());
                        setDocumentVal('');
                        dispatch(resetActiveDocuments());
                      } else {
                        setMachineModelVal('');
                        setMachineVal('');
                        dispatch(resetActiveMachines());
                        setDocumentVal('');
                        dispatch(resetActiveDocuments());
                      }
                    }}
                    renderInput={(params) => (
                      <TextField {...params} required label={FORMLABELS.SELECT_MODEL} />
                    )}
                    SubValue={machineVal || null}
                    SubOptions={activeMachines}
                    SubOnChange={(event, newValue) => {
                      if (newValue) {
                        setMachineVal(newValue);
                      } else {
                        setMachineVal('');
                        setDocumentVal('');
                        dispatch(resetActiveDocuments());
                      }
                    }}
                    SubRenderInput={(params) => (
                      <TextField {...params} label={FORMLABELS.SELECT_MACHINE} />
                    )}
                  />
                )}

                <RadioButtons
                  value={selectedValue}
                  radioOnChange={handleRadioChange}
                  newValue={DocRadioValue.new}
                  newLabel={DocRadioLabel.new}
                  secondValue={DocRadioValue.newVersion}
                  secondLabel={DocRadioLabel.existing}
                />

                {/* New Version */}
                {selectedValue === 'newVersion' && (
                  <Grid container lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <Autocomplete
                          // freeSolo
                          // disabled={documentAvailable}
                          value={documentVal || null}
                          options={activeDocuments}
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
                            <TextField {...params} required label={FORMLABELS.SELECT_DOCUMENT} />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {/*  New Document */}
                {(selectedValue === 'new' || documentVal) && (
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
                            <TextField {...params} required label={FORMLABELS.SELECT_MACHINE} />
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
                            <TextField
                              {...params}
                              required
                              label={FORMLABELS.SELECT_DOCUMENT_TYPE}
                            />
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
                    radioOnChange={handleVersionRadioChange}
                    newValue={DocRadioValue.newVersion}
                    newLabel={DocRadioLabel.newVersion}
                    secondValue={DocRadioValue.existing}
                    secondLabel={DocRadioLabel.currentVersion}
                  />
                )}

                {selectedValue === 'new' && (
                  <RHFName
                    required
                    disabled={readOnlyVal}
                    name="displayName"
                    value={displayNameVal}
                    label="Document Name"
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
                      multiple
                      thumbnail
                      name="multiUpload"
                      // maxSize={3145728}
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        setValue(
                          'multiUpload',
                          values.multiUpload &&
                            values.multiUpload?.filter((file) => file !== inputFile),
                          { shouldValidate: true }
                        )
                      }
                      onRemoveAll={() => setValue('multiUpload', '', { shouldValidate: true })}
                    />
                  </Grid>
                )}

                {/* cleanup */}
                {selectedValue === 'new' && (
                  <ToggleButtons
                    customerAccessVal={customerAccessVal}
                    handleChange={handleChange}
                    isActive={isActive}
                    handleIsActiveChange={handleIsActiveChange}
                    isDocument
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

      {/* dialog preview */}
      <DialogPreview
        open={preview}
        onClose={handleClosePreview}
        content={nameVal}
        src={previewVal}
      />
    </FormProvider>
  );
}
