import PropTypes from 'prop-types';
import { useEffect, useLayoutEffect, useState, useCallback, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enc, MD5, lib } from 'crypto-js';
import { pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import { Box, Card, Grid, Stack, Dialog } from '@mui/material';
// PATH
import { PATH_CRM, PATH_MACHINE, PATH_MACHINE_DRAWING } from '../../routes/paths';
// slice
import {
  resetActiveDocuments,
  getDocument,
  resetDocument,
  getCustomerDocuments,
  getMachineDocuments,
  getMachineDrawingsDocuments,
  addDocument,
  checkDocument,
} from '../../redux/slices/document/document';
import { getActiveDocumentCategories, resetActiveDocumentCategories } from '../../redux/slices/document/documentCategory';
import { getActiveDocumentTypesWithCategory, resetActiveDocumentTypes } from '../../redux/slices/document/documentType';
import { addDocumentVersion, updateDocumentVersion, } from '../../redux/slices/document/documentVersion';
import { getActiveCustomers, resetActiveCustomers } from '../../redux/slices/customer/customer';
import { getCustomerMachines, resetCustomerMachines } from '../../redux/slices/products/machine';
// components
import { useSnackbar } from '../../components/snackbar';
import FormProvider, { RHFAutocomplete, RHFTextField, RHFUpload, } from '../../components/hook-form';
// assets
import DialogLabel from '../../components/Dialog/DialogLabel';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import RadioButtons from '../../components/DocumentForms/RadioButtons';
import ToggleButtons from '../../components/DocumentForms/ToggleButtons';
import { DocRadioValue, DocRadioLabel, Snacks, } from '../../constants/document-constants';
import DocumentCover from '../../components/DocumentForms/DocumentCover';
import { FORMLABELS } from '../../constants/default-constants';
import { documentSchema } from '../schemas/document';
import ConfirmDialog from '../../components/confirm-dialog';


// ----------------------------------------------------------------------
DocumentAddForm.propTypes = {
  currentDocument: PropTypes.object,
  customerPage: PropTypes.bool,
  machinePage: PropTypes.bool,
  drawingPage: PropTypes.bool,
  machineDrawings: PropTypes.bool,
  newVersion: PropTypes.bool,
  historyNewVersion: PropTypes.bool,
  addFiles: PropTypes.bool,
  historyAddFiles: PropTypes.bool,
};

function DocumentAddForm({
  currentDocument,
  customerPage,
  machinePage,
  drawingPage,
  machineDrawings,
  newVersion,
  historyNewVersion,
  addFiles,
  historyAddFiles,
}) {

  const navigate = useNavigate();
  const { customerId, machineId, id } = useParams()
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const { activeDocumentTypes } = useSelector((state) => state.documentType);
  const { activeDocumentCategories } = useSelector((state) => state.documentCategory);
  const { machine, customerMachines } = useSelector((state) => state.machine);
  const { document, activeDocuments } = useSelector((state) => state.document);
  const { customer, activeCustomers } = useSelector((state) => state.customer);

  // ------------------ document values states ------------------------------

  const [categoryBy, setCategoryBy] = useState(null);
  const [previewVal, setPreviewVal] = useState('');
  const [preview, setPreview] = useState(false);
  const [readOnlyVal, setReadOnlyVal] = useState(false);
  const [readOnlyDocument, setReadOnlyDocument] = useState(false);
  const [selectedValue, setSelectedValue] = useState('new');
  const [selectedVersionValue, setSelectedVersionValue] = useState('newVersion');
  const [duplicate, setDuplicate] = useState(false);

  const methods = useForm({
    resolver: yupResolver(documentSchema(selectedValue)),
    defaultValues: {
      documentCategory: null,
      documentType: null,
      displayName: '',
      stockNumber: '',
      referenceNumber: '',
      versionNo: null,
      documentVal: null,
      description: '',
      files: null,
      isActive: true,
      customerAccess: false,
      customerVal: null,
      machineVal: null,
    },
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { documentCategory, documentType, displayName, versionNo, documentVal, machineVal, files, isActive, customerAccess } = watch();

  useEffect(() => {
    if ((newVersion || addFiles || historyAddFiles || historyNewVersion) && id) {
      dispatch(getDocument(id))
    }
  }, [dispatch, id, historyAddFiles, historyNewVersion, newVersion, addFiles]);

  useEffect(() => {
    if (document?._id && id) {
      setValue("documentVal", document);
      setValue("documentCategory", document?.docCategory || null);
      setValue("documentType", document?.docType || null);
      setValue("displayName", document?.displayName || "");
      setValue("stockNumber", document?.stockNumber || "");
      setValue("referenceNumber", document?.referenceNumber || "");
      setValue("description", document?.description || "");
      setReadOnlyVal(true);
      setSelectedValue(DocRadioValue.existing)
      if (addFiles) {
        setSelectedVersionValue("existingVersion")
      }
      if (document?.documentVersions && document?.documentVersions?.length > 0) {
        setValue("versionNo", document?.documentVersions[0]?.versionNo || "");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [document?._id,]);

  useLayoutEffect(() => {
    if (!newVersion && !addFiles && !historyNewVersion && !historyAddFiles) {
      // reset();
      setSelectedValue('new');
      setReadOnlyDocument(false);
    }
    if (machineDrawings) {
      dispatch(getActiveCustomers());
    }
    return () => {
      dispatch(resetDocument())
      dispatch(resetActiveDocuments());
      dispatch(resetActiveCustomers());
      dispatch(resetCustomerMachines());
      // dispatch(resetActiveDocumentTypes());
      // dispatch(resetActiveDocumentCategories())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, customer, machine]);

  useLayoutEffect(() => {
    if (customerPage && !categoryBy) {
      setCategoryBy({ customer: true })
      if (customer?._id && selectedValue === 'newVersion') dispatch(getCustomerDocuments(customer?._id));
    } else if (machinePage && !categoryBy) { // machinePage 
      setCategoryBy({ machine: true })
      if (machine?._id && selectedValue === 'newVersion') dispatch(getMachineDocuments(machine?._id));
    } else if (drawingPage && !categoryBy) { //  machineDrawings 
      setCategoryBy({ drawing: true })
    } else if (machineDrawings && !categoryBy) { //  machineDrawings 
      setCategoryBy({ drawing: true })
      if (selectedValue === 'newVersion') dispatch(getMachineDrawingsDocuments());
    }

    if (customerPage && customerId && selectedValue === 'newVersion') {
      dispatch(getCustomerDocuments(customer?._id));
    } else if (machinePage && machineId && selectedValue === 'newVersion') {
      dispatch(getMachineDocuments(machineId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, categoryBy, customerPage, customer, machinePage, machine, machineDrawings, selectedValue]);


  useLayoutEffect(() => {
    // Get Active Document Types And Active Document Categoories
    if (!newVersion && !addFiles && !historyNewVersion && !historyAddFiles) {
      if ((customerPage || machinePage || drawingPage || machineDrawings) && categoryBy) {
        dispatch(getActiveDocumentCategories(categoryBy));
        dispatch(getActiveDocumentTypesWithCategory(null, categoryBy))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, categoryBy])

  useEffect(() => {
    if (Array.isArray(activeDocumentCategories) && activeDocumentCategories?.length > 0 && !documentCategory) {
      let ddc = activeDocumentCategories?.find((el) => el.isDefault);
      if (!ddc)
        ddc = activeDocumentCategories?.find((el) => el?.name?.toLowerCase()?.trim() === 'assembly drawings');
      setValue('documentCategory', ddc);
    }
    if (Array.isArray(activeDocumentTypes) && activeDocumentTypes?.length > 0 && documentCategory) {
      const ddt = activeDocumentTypes?.find((el) => el.isDefault && el?.docCategory?._id === documentCategory?._id)
      setValue('documentType', ddt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeDocumentCategories, activeDocumentTypes]);

  const onSubmit = async (data) => {
    try {
      if (selectedValue === 'new') {
        // NEW DOCUMENT
        if (drawingPage) {
          data.drawingMachine = machineId;
        }
        if (machineDrawings) {
          data.drawingMachine = machineVal?._id;
        }
        await dispatch(addDocument(customerPage ? customerId : null, (drawingPage || machinePage) ? machineId : null, data));
        enqueueSnackbar(drawingPage || machineDrawings ? Snacks.addedDrawing : Snacks.addedDoc);
      } else if (selectedVersionValue === 'newVersion') {
        // NEW VERSION 
        await dispatch(addDocumentVersion(documentVal?._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
      } else {
        // UPDATE VERSION / ADD FILES
        await dispatch(updateDocumentVersion(id, documentVal?.documentVersions[0]?._id, data));
        enqueueSnackbar(Snacks.updatedDoc);
      }

      // Routes Directions
      if (newVersion || addFiles) {
        if (customerPage && customerId) {
          await navigate(PATH_CRM.customers.documents.view.root(customerId, id));
        } else if (drawingPage && machineId) {
          await navigate(PATH_MACHINE.machines.drawings.view.root(machineId, id));
        } else if (machinePage && machineId) {
          await navigate(PATH_MACHINE.machines.documents.view.root(machineId, id));
        }
      } else if (historyNewVersion || historyAddFiles) {
        if (customerPage && customerId) {
          await navigate(PATH_CRM.customers.documents.history.root(customerId, id));
        } else if (machinePage) {
          await navigate(PATH_MACHINE.machines.documents.history.root(machineId, id));
        } else if (machineDrawings) {
          await navigate(PATH_MACHINE_DRAWING.machineDrawings.view.root(id));
        } else if (!customerPage && !drawingPage && !machinePage && !machineDrawings) {
          await navigate(PATH_MACHINE.documents.document.view.root(id));
        }
      } else if (customerPage) {
        navigate(PATH_CRM.customers.documents.root(customerId));
      } else if (machinePage) {
        navigate(PATH_MACHINE.machines.documents.root(machineId));
      } else if (drawingPage) {
        navigate(PATH_MACHINE.machines.drawings.root(machineId));
      } else if (machineDrawings) {
        navigate(PATH_MACHINE_DRAWING.root)
      } else if (!customerPage && !drawingPage && !machinePage && !machineDrawings) {
        navigate(PATH_MACHINE.documents.list)
      }

      setReadOnlyVal(false);
      setPreview(false);
      setPreviewVal('');
      reset();
    } catch (error) {
      enqueueSnackbar(Snacks.failedDoc, { variant: `error` });
      console.error(error);
    }
  };

  const toggleCancel = () => {
    if (newVersion || addFiles) {
      if (customerPage && customerId) {
        navigate(PATH_CRM.customers.documents.view.root(customerId, id));
      } else if (drawingPage && machineId) {
        navigate(PATH_MACHINE.machines.drawings.view.root(machineId, id));
      } else if (machinePage && machineId) {
        navigate(PATH_MACHINE.machines.documents.view.root(machineId, id));
      } else if (machineDrawings) {
        navigate(PATH_MACHINE_DRAWING.machineDrawings.view.root(id));
      } else if (!customerPage && !drawingPage && !machinePage && !machineDrawings) {
        navigate(PATH_MACHINE.documents.document.view.root(id));
      }
    } else if (historyNewVersion || historyAddFiles) {
      if (customerPage && customerId) {
        navigate(PATH_CRM.customers.documents.history.root(customerId, id));
      } else if (machinePage) {
        navigate(PATH_MACHINE.machines.documents.history.root(machineId, id));
      }
    } else if (customerPage) {
      navigate(PATH_CRM.customers.documents.root(customerId));
    } else if (machinePage) {
      navigate(PATH_MACHINE.machines.documents.root(machineId));
    } else if (drawingPage) {
      navigate(PATH_MACHINE.machines.drawings.root(machineId));
    } else if (machineDrawings) {
      navigate(PATH_MACHINE_DRAWING.root)
    } else if (!customerPage && !drawingPage && !machinePage && !machineDrawings) {
      navigate(PATH_MACHINE.documents.list)
    }
  }

  const handleClosePreview = () => setPreview(false);
  const handleChange = () => setValue('customerAccess', !customerAccess);

  const handleRadioChange = (event) => {
    setSelectedValue(event.target.value);
    if (event.target.value === 'new') {
      setReadOnlyVal(false);
      reset();
    }
  };
  const handleVersionRadioChange = (event) => setSelectedVersionValue(event.target.value);
  const handleIsActiveChange = () => setValue('isActive', !isActive);

  const handleDropMultiFile = useCallback(
    async (acceptedFiles) => {
      pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
      const pdfFile = acceptedFiles.find((f) => f.type.indexOf('pdf') > -1);
      if (pdfFile) {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const pdfDocument = await pdfjs.getDocument(arrayBuffer).promise;
        const page = await pdfDocument.getPage(1);
        const textContent = await page.getTextContent();
        try {
          textContent.items.some((item, index) => {
            if (item.str === 'DRAWN BY' && textContent?.items[index + 2]?.str?.length < 15) {
              setValue('stockNumber', textContent.items[index + 2].str);
              return true;
            }

            if (item.str === "STOCK NO." && textContent?.items[index + 2]?.str?.length < 15) {
              setValue('stockNumber', textContent.items[index + 2].str);
              return true;
            }

            if (item.str === 'APPROVED' && textContent?.items[index - 2]?.str?.length < 15) {
              setValue('stockNumber', textContent.items[index - 2].str);
              return true;
            }

            return false; // Continue iterating if condition is not met
          });
        } catch (e) {
          console.log(e)
        }
      }
      const docFiles = files || [];

      let _files = [];

      if (drawingPage || machineDrawings) {
        const _files_MD5 = await hashFilesMD5(acceptedFiles);
        _files = await dispatch(checkDocument(_files_MD5));
      }

      setDuplicate(_files.some((fff => fff.status === 409)));

      const newFiles = acceptedFiles.map((file, index) => {
        if (index === 0 && docFiles.length === 0 && !displayName) {
          setValue('displayName', removeFileExtension(file.name))
          setValue('referenceNumber', getRefferenceNumber(file.name))
          setValue('versionNo', getVersionNumber(file.name))
        }
        return Object.assign(file, {
          preview: URL.createObjectURL(file),
          found: _files[index]?.status === 200 ? null : _files[index],
          machine: machineVal?._id,
          src: URL.createObjectURL(file),
          isLoaded: true
        })
      }
      );
      setValue('files', [...docFiles, ...newFiles], { shouldValidate: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [files, displayName]
  );

  const hashFilesMD5 = async (_files) => {
    const hashPromises = _files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const wordArray = MD5(lib.WordArray.create(arrayBuffer));
        const hashHex = wordArray.toString(enc.Hex);
        resolve(hashHex);
      };
      reader.onerror = () => {
        reject(new Error(`Error reading file: ${file.name}`));
      };
      reader.readAsArrayBuffer(file);
    }));
    try {
      const hashes = await Promise.all(hashPromises);
      return hashes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const removeFileExtension = (filename) => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
  };

  const getRefferenceNumber = (filename) => {
    const words = removeFileExtension(filename).split(/\s+/);
    return words[0] || '';
  };

  const getVersionNumber = (filename) => {
    const lastDotIndex = filename.lastIndexOf('.');
    filename = filename.substring(0, lastDotIndex);
    const words = filename.split(/\s+/);
    let version = words[words.length - 1];
    if (version.toLowerCase().includes('v')) {
      version = version.replace(/[Vv]/g, '');
    } else {
      version = "1";
    }
    return version;
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      {!customerPage && !machinePage && !drawingPage &&
        <DocumentCover content={machineDrawings ? FORMLABELS.COVER.ADD_MACHINE_DRAWINGSS : FORMLABELS.COVER.ADD_DOCUMENTS} backLink={!customerPage && !machinePage && !machineDrawings} machineDrawingsBackLink={machineDrawings} generalSettings />
      }
      <Box column={12} rowGap={2} columnGap={2} gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }} mt={3} >
        <Grid container item xs={12} md={12} lg={12}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                {!drawingPage && !machineDrawings &&
                  <RadioButtons
                    radioDisaled={newVersion || addFiles || historyNewVersion || historyAddFiles}
                    value={selectedValue} radioOnChange={handleRadioChange}
                    newValue={DocRadioValue.new} newLabel={DocRadioLabel.new}
                    secondValue={DocRadioValue.newVersion} secondLabel={DocRadioLabel.existing}
                  />
                }
                {selectedValue === 'newVersion' && (
                  <Grid container item lg={12}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} lg={12}>
                        <RHFAutocomplete
                          label="Select Document*"
                          name="documentVal"
                          disabled={readOnlyDocument}
                          options={activeDocuments}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option?.displayName || ''}`}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              ;
                              setValue('displayName', newValue.displayName);
                              setValue('documentType', newValue.docType);
                              setValue('documentCategory', newValue.docCategory);
                              setValue('customerAccess', newValue.customerAccess);
                              setValue('isActive', newValue.isActive);
                              setValue('documentVal', newValue);
                              setReadOnlyVal(true);
                              setSelectedVersionValue('newVersion');
                            } else {
                              setValue('documentVal', null);
                              setValue('displayName', '');
                              setValue('documentType', null);
                              setValue('documentCategory', null);
                              setValue('customerAccess', false);
                              setReadOnlyVal(false);
                            }
                          }}
                          renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.displayName || ''}`}</li>)}
                        />
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                {/*  New Document */}
                {(selectedValue === 'new' || documentVal) && (
                  <Box rowGap={3} columnGap={2} display="grid"
                    gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    <RHFAutocomplete
                      label="Document Category*"
                      name="documentCategory"
                      disabled={readOnlyVal}
                      options={activeDocumentCategories}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option?.name || ''}`}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setValue('documentCategory', newValue);
                          if (newValue?._id !== documentType?.docCategory?._id) {
                            setValue('documentType', null);
                          }
                        } else {
                          setValue('documentCategory', null);
                          setValue('documentType', null);
                        }
                      }}
                      renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                    />

                    <RHFAutocomplete
                      name="documentType"
                      label="Document Type*"
                      disabled={readOnlyVal}
                      options={activeDocumentTypes?.filter(el => documentCategory ? el?.docCategory?._id === documentCategory?._id : !documentCategory)}
                      isOptionEqualToValue={(option, value) => option._id === value._id}
                      getOptionLabel={(option) => `${option?.name || ''}`}
                      renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.name || ''}`}</li>)}
                      onChange={(event, newValue) => {
                        if (newValue) {
                          setValue('documentType', newValue);
                          if (!documentCategory?._id || newValue?.docCategory?._id !== documentCategory?._id) {
                            setValue('documentCategory', newValue?.docCategory);
                          }
                        } else {
                          setValue('documentType', null);
                        }
                      }}
                    />

                  </Box>)}

                {documentVal && (
                  <RadioButtons value={selectedVersionValue} radioOnChange={handleVersionRadioChange}
                    newValue={DocRadioValue.newVersion} newLabel={DocRadioLabel.newVersion}
                    secondValue={DocRadioValue.existing} secondLabel={DocRadioLabel.currentVersion}
                  />
                )}

                {(selectedValue === 'new' || documentVal) && (
                  <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ sm: '1fr', md: '3fr 1fr' }} >
                    <RHFTextField multiline name="displayName" id="displayName" disabled={readOnlyVal} label="Document Name*" />
                    <RHFTextField name='versionNo' label='Version Number' disabled={readOnlyVal} InputLabelProps={{ shrink: versionNo }} />
                  </Box>
                )}

                {selectedValue === 'new' && !machineDrawings && (
                  <Box rowGap={3} columnGap={2} display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }} >
                    <RHFTextField name='referenceNumber' label='Reference Number' />
                    <RHFTextField name='stockNumber' label='Stock Number' />
                  </Box>)
                }

                {selectedValue === 'new' && machineDrawings && (
                  <>
                    <Box rowGap={0} columnGap={2} display="grid" sx={{ mb: 0 }} gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}>
                      <RHFTextField name='referenceNumber' label='Reference Number' />
                      <RHFTextField name='stockNumber' label='Stock Number' />
                    </Box>

                    {!drawingPage &&
                      <Box rowGap={2} columnGap={2} display="grid" gridTemplateColumns={{ sm: 'repeat(1, 1fr)', md: 'repeat(1, 1fr)' }}>
                        <RHFAutocomplete
                          name="customer"
                          label="Customer"
                          options={activeCustomers}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option?.name || ''}`}
                          renderOption={(props, option) => (<li {...props} key={option?._id}>{option?.name || ''}</li>)}
                          onChange={(event, newValue) => {
                            if (newValue) {
                              setValue('customer', newValue);
                              dispatch(getCustomerMachines(newValue?._id));
                            } else {
                              setValue('customer', null);
                              dispatch(resetCustomerMachines());
                            }
                          }}
                        />
                        <RHFAutocomplete
                          name="machineVal"
                          label="Machine"
                          options={customerMachines}
                          // value={machineVal}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}
                          renderOption={(props, option) => (<li {...props} key={option?._id}>{`${option.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`}</li>)}
                        />
                      </Box>
                    }
                  </>
                )}

                {(selectedValue === 'new' ||
                  (documentVal && selectedVersionValue !== 'existingVersion')) && (
                    <RHFTextField name="description" label="Description" minRows={3} multiline />
                  )}

                {(selectedValue === 'new' || documentVal) && (
                  <Grid item xs={12} md={6} lg={12}>
                    <RHFUpload multiple thumbnail name="files"
                      onDrop={handleDropMultiFile}
                      onRemove={(inputFile) =>
                        files.length > 1 ?
                          setValue(
                            'files',
                            files &&
                            files?.filter((file) => file !== inputFile),
                            { shouldValidate: true }
                          ) : setValue('files', '', { shouldValidate: true })
                      }
                      onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                      machine={machineVal}
                      drawingPage={drawingPage || machineDrawings}
                    />
                  </Grid>
                )}

                {selectedValue === 'new' && (
                  <ToggleButtons
                    isDocument
                    customerAccessVal={customerAccess}
                    handleChange={handleChange}
                    isActive={isActive}
                    handleIsActiveChange={handleIsActiveChange}
                  />
                )}

                <AddFormButtons machinePage={machinePage} customerPage={customerPage} drawingPage={drawingPage} isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
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
        <DialogLabel onClick={() => handleClosePreview()} />
        <Box
          component="img"
          sx={{ minWidth: '400px', minHeight: '400px' }}
          alt={displayName}
          src={previewVal}
        />
      </Dialog>

      <ConfirmDialog
        open={duplicate}
        onClose={() => setDuplicate(false)}
        title='Duplicate Files Detected'
        content='Kindly review the files that already exist.'
        SubButton="Close"
      />
    </FormProvider>
  );
}

export default memo(DocumentAddForm)