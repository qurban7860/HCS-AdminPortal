import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useEffect, useLayoutEffect, useMemo, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Switch, Box, Card, Grid, Stack, Autocomplete, TextField, Dialog } from '@mui/material';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// slice
import {
  addCustomerDocument,
  updateCustomerDocument,
  getCustomerDocuments,
  setCustomerDocumentFormVisibility,
} from '../../../redux/slices/document/customerDocument';
import {
  getActiveDocumentTypesWithCategory,
  resetActiveDocumentTypes,
} from '../../../redux/slices/document/documentType';
import {
  getActiveDocumentCategories,
  resetDocumentCategories,
} from '../../../redux/slices/document/documentCategory';
import {
  updateDocumentVersion,
  addDocumentVersion,
} from '../../../redux/slices/document/documentVersion';
// components
import Iconify from '../../../components/iconify';
import { useSnackbar } from '../../../components/snackbar';
// assets
import { countries } from '../../../assets/data';
import FormProvider, { RHFTextField, RHFUpload } from '../../../components/hook-form';
import BreadcrumbsLink from '../../components/Breadcrumbs/BreadcrumbsLink';
import RadioButtons from '../../components/DocumentForms/RadioButtons';
import FormHeading from '../../components/DocumentForms/FormHeading';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import DialogLabel from '../../components/Dialog/DialogLabel';
import {
  fileTypesArray,
  allowedExtensions,
  fileTypesMessage,
  DocRadioLabel,
  DocRadioValue,
  Snacks,
} from '../../../constants/document-constants';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';

// ----------------------------------------------------------------------

DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
};
export default function DocumentAddForm({ currentDocument }) {
  const { activeDocumentTypes, documentTypeFormVisibility } = useSelector(
    (state) => state.documentType
  );
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { customerDocuments } = useSelector((state) => state.customerDocument);
  const { machines } = useSelector((state) => state.machine);
  const { customer, customers } = useSelector((state) => state.customer);
  const { contacts } = useSelector((state) => state.contact);
  const { sites } = useSelector((state) => state.site);

  const [documentTypeVal, setDocumentTypeVal] = useState('');
  const [documentCategoryVal, setDocumentCategoryVal] = useState('');
  const [documentVal, setDocumentVal] = useState('');
  // console.log("documentVal : ",documentVal)
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

  const [files, setFiles] = useState([]);
  const [machineVal, setMachineVal] = useState('');
  const [customerVal, setCustomerVal] = useState('');
  const [siteVal, setSiteVal] = useState('');
  const [contactVal, setContactVal] = useState('');

  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    setDocumentVal('');
    setSelectedValue('new');
    setSelectedVersionValue('newVersion');
    setNameVal('');
    setDisplayNameVal('');
    setDocumentTypeVal('');
    setDocumentCategoryVal('');
    setCustomerAccessVal(false);
    setReadOnlyVal(false);
    setDescriptionVal('');
    dispatch(resetActiveDocumentTypes());
    dispatch(getActiveDocumentCategories());
    // dispatch(getActiveDocumentTypes())
  }, [dispatch, customer]);

  useEffect(() => {
    if (documentCategoryVal?._id) {
      dispatch(getActiveDocumentTypesWithCategory(documentCategoryVal?._id));
    }
  }, [documentCategoryVal, dispatch]);

  const AddCustomerDocumentSchema = Yup.object().shape({
    displayName: Yup.string().max(40),
    description: Yup.string().max(10000),
    images: Yup.mixed()
      .required('File is required!')
      .test('fileType', fileTypesMessage, (value) => {
        if (value && value?.name) {
          const fileExtension = value?.name?.split('.').pop().toLowerCase();
          return allowedExtensions.includes(fileExtension);
        }
        return false;
      })
      .nullable(true),
    isActive: Yup.boolean(),
  });

  const defaultValues = useMemo(
    () => ({
      displayName: displayNameVal,
      description: descriptionVal,
      images: null,
      isActive: true,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentDocument]
  );
  // const updatedDefaultValues = useMemo(() => {
  //   return {
  //     ...defaultValues, // Spread the existing properties
  //     description: description, // Assign the new value
  //   };
  // }, [description, defaultValues]);

  const methods = useForm({
    resolver: yupResolver(AddCustomerDocumentSchema),
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
      data.customer = customer._id;
      data.displayName = displayNameVal;
      data.name = nameVal;
      // if(nameVal){
      // }
      if (documentCategoryVal) {
        data.documentCategory = documentCategoryVal._id;
      }
      data.isActive = isActive;
      if (customerAccessVal === true || customerAccessVal === 'true') {
        data.customerAccess = true;
      } else {
        data.customerAccess = false;
      }
      if (documentTypeVal) {
        data.documentType = documentTypeVal._id;
      }
      if (descriptionVal) {
        data.description = descriptionVal;
      }
      if (selectedValue === 'new') {
        await dispatch(addCustomerDocument(customer._id, data));
        enqueueSnackbar(Snacks.addedDoc);
      } else if (selectedVersionValue === 'newVersion') {
        await dispatch(addDocumentVersion(documentVal._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
      } else {
        await dispatch(
          updateDocumentVersion(documentVal._id, documentVal?.documentVersions[0]?._id, data)
        );
      }
      dispatch(getCustomerDocuments(customer?._id));
      dispatch(setCustomerDocumentFormVisibility(false));
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
      enqueueSnackbar(Snacks.failedDoc, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    dispatch(setCustomerDocumentFormVisibility(false));
  };
  // const handleDrop = useCallback(
  //   (acceptedFiles) => {
  //     const newFiles = acceptedFiles.map((file) =>
  //       Object.assign(file, {
  //         preview: URL.createObjectURL(file),
  //       })
  //     );

  //     setFiles([...files, ...newFiles]);
  //   },
  //   [files]
  // );

  const handleClosePreview = () => {
    setPreview(false);
  };

  const handleRemoveFile = () => {
    setValue('images', '');
    setNameVal('');
  };

  const handleRemoveAllFiles = () => {
    setFiles([]);
  };

  const previewHandle = () => {
    setPreview(true);
  };

  const handleDrop = useCallback(
    (acceptedFiles) => {
      const file = acceptedFiles[0];
      const fileName = file.name.split('.');

      if (fileTypesArray.includes(fileName[fileName.length - 1])) {
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

  const handleChange = () => {
    setCustomerAccessVal(!customerAccessVal);
  };
  const handleIsActiveChange = () => {
    setIsActive(!isActive);
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
    setValue('images', '');
  };
  const handleVersionRadioChange = (event) => {
    setSelectedVersionValue(event.target.value);
  };
  const handleChangeDescription = (event) => {
    setDescriptionVal(event.target.value);
  };
  const objComparator = function (a, b) {
    if (a.label < b.label) {
      return -1;
    }
    if (a.label > b.label) {
      return 1;
    }
    return 0;
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
        <Grid container>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={3}>
                <Grid container lg={12}>
                  <FormHeading heading="New Document" />
                </Grid>

                <RadioButtons
                  value={selectedValue}
                  radioOnChange={handleRadioChange}
                  newLabel={DocRadioLabel.new}
                  newValue={DocRadioValue.new}
                  secondLabel={DocRadioLabel.existing}
                  secondValue={DocRadioValue.newVersion}
                />

                {selectedValue === 'newVersion' && (
                  <Grid container>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={6}>
                        <Autocomplete
                          // freeSolo
                          // disabled={documentAvailable}
                          value={documentVal || null}
                          options={customerDocuments}
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
                              dispatch(resetActiveDocumentTypes());
                            }
                          }}
                          renderOption={(props, option) => (
                            <li {...props} key={option._id}>{`${
                              option.displayName ? option.displayName : ''
                            }`}</li>
                          )}
                          id="controllable-states-demo"
                          renderInput={(params) => (
                            <TextField {...params} required label="Select Document" />
                          )}
                          ChipProps={{ size: 'small' }}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}

                {(selectedValue === 'new' || documentVal) && (
                  <Grid container>
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
                    radioOnChange={handleVersionRadioChange}
                    newLabel={DocRadioLabel.newVersion}
                    newValue={DocRadioValue.newVersion}
                    secondLabel={DocRadioLabel.currentVersion}
                    secondValue={DocRadioValue.existing}
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
                    handleChange={handleChange}
                    customerAccessVal={customerAccessVal}
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
      <Dialog
        maxWidth="md"
        open={preview}
        onClose={handleClosePreview}
        aria-labelledby="keep-mounted-modal-title"
        aria-describedby="keep-mounted-modal-description"
      >
        <DialogLabel content={nameVal} onClick={() => handleClosePreview()} />
        <Box component="img" alt={defaultValues?.name} src={previewVal} />
      </Dialog>
    </FormProvider>
  );
}
