import { useCallback, useMemo, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { enc, MD5, lib } from 'crypto-js';
// routes
import { useNavigate, useParams } from 'react-router-dom';
// form
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Container, Card, Grid, Stack, CircularProgress } from '@mui/material';
// components
import { Cover } from '../../components/Defaults/Cover';
import { StyledCardContainer } from '../../theme/styles/default-styles';
import { PATH_SUPPORT } from '../../routes/paths';
import { useSnackbar } from '../../components/snackbar';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { ticketSchema } from '../schemas/ticketSchema';
import FormProvider, { RHFTextField, RHFUpload, RHFAutocomplete, RHFDatePicker, RHFTimePicker, RHFSwitch, RHFEditor } from '../../components/hook-form';
import { getTicket, postTicket, patchTicket, resetTicket, deleteFile, getTicketSettings, resetTicketSettings, getSoftwareVersion, resetSoftwareVersion } from '../../redux/slices/ticket/tickets';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveCustomers, resetActiveCustomers } from '../../redux/slices/customer/customer';
import FormLabel from '../../components/DocumentForms/FormLabel';
import { FORMLABELS } from '../../constants/default-constants';
import { manipulateFiles } from '../documents/util/Util';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';


export default function TicketForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { ticket, ticketSettings, softwareVersion, isLoadingSoftwareVersion } = useSelector((state) => state.tickets);
  const [filteredRequestTypes, setFilteredRequestTypes] = useState([]);

  useEffect(() => {
    if (id)
      dispatch(getTicket(id));
    dispatch(resetActiveCustomers());
    dispatch(getActiveCustomers());
    dispatch(getTicketSettings());
    return () => {
      dispatch(resetTicketSettings());
      dispatch(resetActiveCustomerMachines());
      dispatch(resetActiveCustomers());
    }
  }, [dispatch, id]);

  const defaultValues = useMemo(
    () => ({
      customer: id && ticket?.customer || null,
      machine: id && ticket?.machine || null,
      issueType: id && ticket?.issueType || null,
      faults: (id && Array.isArray(ticket?.faults) ? ticket?.faults : []) || [],
      requestType: id && ticket?.requestType || null,
      summary: id && ticket?.summary || '',
      description: id && ticket?.description || '',
      priority: id && ticket?.priority || null,
      status: id && ticket?.status || null,
      impact: id && ticket?.impact || null,
      files: id && ticket ? manipulateFiles(ticket?.files) : [],
      changeType: id && ticket?.changeType || null,
      changeReason: id && ticket?.changeReason || null,
      implementationPlan: id && ticket?.implementationPlan || '',
      backoutPlan: id && ticket?.backoutPlan || '',
      testPlan: id && ticket?.testPlan || '',
      investigationReason: id && ticket?.investigationReason || null,
      rootCause: id && ticket?.rootCause || '',
      workaround: id && ticket?.workaround || '',
      shareWith: id && ticket?.shareWith || false,
      isActive: id && ticket?.isActive || true,
      plannedStartDate: id && ticket?.plannedStartDate || null,
      plannedEndDate: id && ticket?.plannedEndDate || null,
      startTime: id && ticket?.startTime || null,
      endTime: id && ticket?.endTime || null,
      hlc: softwareVersion?.hlc || '',
      plc: softwareVersion?.plc || '',
    }),
    [id, ticket, softwareVersion]
  );

  const methods = useForm({
    resolver: yupResolver(ticketSchema(!id && 'new' || '')),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { reset, setError, handleSubmit, watch, setValue, trigger, formState: { isSubmitting, errors } } = methods;
  const { issueType, customer, machine, files, plannedStartDate, plannedEndDate, description } = watch();

  useEffect(() => {
    trigger(["plannedStartDate", "plannedEndDate"]);
  }, [trigger, plannedStartDate, plannedEndDate])

  useEffect(() => {
    if (machine?._id) {
      dispatch(getSoftwareVersion(machine._id));
    }
    return () => {
      dispatch(resetSoftwareVersion());
    }
  }, [dispatch, machine]);

  useEffect(() => {
    if (ticketSettings?.requestTypes && issueType) {
      const filtered = ticketSettings.requestTypes.filter(
        (requestType) => requestType.issueType._id === issueType._id
      );
      setFilteredRequestTypes(filtered);
    } else {
      setFilteredRequestTypes([]);
      setValue('requestType', null);
    }
  }, [ticketSettings?.requestTypes, issueType, setValue]);

  useEffect(() => {
    if (ticketSettings) {
      setValue('priority', id && ticket?.priority || (ticketSettings?.priorities?.find(p => p?.isDefault) || null));
      setValue('status', id && ticket?.status || (ticketSettings?.statuses?.find(s => s?.isDefault) || null));
      setValue('impact', id && ticket?.impact || (ticketSettings?.impacts?.find(i => i?.isDefault) || null));
      setValue('changeType', id && ticket?.changeType || (ticketSettings?.changeTypes?.find(t => t?.isDefault) || null));
      setValue('changeReason', id && ticket?.changeReason || (ticketSettings?.changeReasons?.find(r => r?.isDefault) || null));
      setValue('investigationReason', id && ticket?.investigationReason || (ticketSettings?.investigationReasons?.find(i => i?.isDefault) || null));
    }
  }, [ticketSettings, setValue, id, ticket]);

  useEffect(() => {
    if (softwareVersion) {
      setValue('hlc', softwareVersion?.hlc || '');
      setValue('plc', softwareVersion?.plc || '');
    }
  }, [softwareVersion, setValue]);

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
        reject(new Error(`Error reading file: ${file?.name || ''}`));
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

  const handleDropMultiFile = useCallback(async (acceptedFiles) => {
    console.log("acceptedFiles:::", acceptedFiles)
    const hashes = await hashFilesMD5(acceptedFiles);
    const newFiles = (Array.isArray(files) && files?.length > 0) ? [...files] : [];
    acceptedFiles.forEach((file, index) => {
      const eTag = hashes[index];
      if (!newFiles?.some((el) => el?.eTag === eTag)) {
        const newFile = Object.assign(file, {
          preview: URL.createObjectURL(file),
          src: URL.createObjectURL(file),
          isLoaded: true,
          eTag,
        });
        newFiles.push(newFile);
      }
    });
    setValue('files', newFiles, { shouldValidate: true });
  }, [setValue, files]);

  const handleFileRemove = useCallback(async (inputFile) => {
    try {
      setValue('files', files?.filter((el) => (inputFile?._id ? el?._id !== inputFile?._id : el !== inputFile)), { shouldValidate: true })
      if (inputFile?._id) {
        dispatch(deleteFile(inputFile?.ticket, inputFile?._id))
      }
    } catch (e) {
      console.error(e)
    }
  }, [setValue, files, dispatch]);

  const onSubmit = async (data) => {
    try {
      let ticketData;
      if (id) {
        await dispatch(patchTicket(id, data));
        enqueueSnackbar('Ticket Updated Successfully!', { variant: 'success' });
      } else {
        ticketData = await dispatch(postTicket(data));
        enqueueSnackbar('Ticket Added Successfully!', { variant: 'success' });
      }
      reset();
      navigate(PATH_SUPPORT.supportTickets.view(id && id || ticketData?.data?._id));
    } catch (err) {
      if (err?.errors && Array.isArray(err?.errors)) {
        err?.errors?.forEach((error) => {
          if (error?.field && error?.message) {
            setError(error?.field, {
              type: 'manual',
              message: error?.message
            });
          }
        });
      } else {
        enqueueSnackbar(typeof err === 'string' ? err : 'Ticket Update Failed!', { variant: `error` });
      }
    }
  };

  const toggleCancel = () => {
    dispatch(resetTicket())
    navigate(PATH_SUPPORT.supportTickets.root);
  }

  return (
    <Container maxWidth={false}>
      <StyledCardContainer>
        <Cover name={ticket?.customer?.name || 'New Support Ticket'} />
      </StyledCardContainer>
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ p: 3, pt: 2 }}>
              <ViewFormEditDeleteButtons
                backLink={() => {
                  dispatch(resetTicket())
                  navigate(PATH_SUPPORT.supportTickets.root)
                }
                }
              />
              <Stack spacing={id ? 1 : 3} sx={{ mt: id ? 0 : 1 }}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                >
                  {!id && (
                    <>
                      <RHFAutocomplete
                        name="customer"
                        label="Customer*"
                        options={activeCustomers || []}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option?.name || ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option?._id}>
                            {' '}
                            {option?.name || ''}{' '}
                          </li>
                        )}
                        onChange={(event, newValue) => {
                          if (newValue && newValue?._id !== customer?._id) {
                            setValue('customer', newValue)
                            setValue('machine', null)
                            setValue('machineModel', "")
                            setValue('hlc', "")
                            setValue('plc', "")
                            dispatch(getActiveCustomerMachines(newValue?._id))
                          } else {
                            setValue('customer', null)
                            setValue('machine', null)
                            setValue('machineModel', "")
                            setValue('hlc', "")
                            setValue('plc', "")
                            dispatch(resetActiveCustomerMachines())
                          }
                        }
                        }
                      />
                      <RHFAutocomplete
                        name="machine"
                        label="Machine*"
                        options={activeCustomerMachines || []}
                        isOptionEqualToValue={(option, value) => option?._id === value?._id}
                        getOptionLabel={(option) =>
                          `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`
                        }
                        renderOption={(props, option) => (
                          <li {...props} key={option?._id} >
                            {`${option?.serialNo || ''} ${option?.name && '-'} ${option?.name || ''}`}
                          </li>
                        )}
                      />
                    </>
                  )}
                </Box>
                {machine && (
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                  >
                    <RHFTextField name="machineModel" label="Machine Model" value={machine?.machineModel?.name || ''} InputProps={{ readOnly: true }} />
                    <RHFTextField name="hlc" label="HLC"
                      InputProps={{
                        endAdornment: isLoadingSoftwareVersion ? <CircularProgress size={20} /> : null
                      }}
                    />
                    <RHFTextField name="plc" label="PLC"
                      InputProps={{
                        endAdornment: isLoadingSoftwareVersion ? <CircularProgress size={20} /> : null
                      }}
                    />
                  </Box>
                )}
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(3, 1fr)' }}
                >
                  <RHFAutocomplete
                    name="issueType"
                    label="Issue Type*"
                    options={ticketSettings?.issueTypes || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name || ''} </li>)}
                    onChange={(event, newValue) => {
                      setValue('issueType', newValue);
                      setValue('requestType', null);
                    }}
                  />
                  <RHFAutocomplete
                    name="requestType"
                    label="Request Type*"
                    options={filteredRequestTypes || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name || ''} </li>)}
                  />
                  <RHFAutocomplete
                    multiple
                    disableCloseOnSelect
                    name="faults"
                    label="Fault"
                    options={ticketSettings?.faults || []}
                    isOptionEqualToValue={(option, value) => option._id === value._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (<li {...props} key={option?._id || option?.name}> {option.name || ''} </li>)}
                  />
                </Box>
              </Stack>
            </Card>
          </Grid>
        </Grid>
        {issueType && (
          <Grid container spacing={3} sx={{ mt: 1 }}>
            <Grid item xs={12} md={12}>
              <Card sx={{ p: 3 }}>
                <Stack spacing={3}>
                  <RHFTextField name="summary" label="Summary*" minRows={1} />
                  <RHFEditor name="description" label="Description" minRows={3} multiline />
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 3,
                      gridTemplateColumns: { xs: '1fr', sm: 'repeat(1, 1fr)' },
                      alignItems: 'center',
                      width: '100%',
                    }}
                  >
                    <FormLabel content={FORMLABELS.COVER.TICKET_ATTACHMENTS} />
                    <Box sx={{ mt: 0 }}>
                      <RHFUpload
                        dropZone={false}
                        multiple
                        thumbnail
                        name="files"
                        onDrop={handleDropMultiFile}
                        onRemove={handleFileRemove}
                        onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                      />
                    </Box>
                    <Box
                      rowGap={2}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                    >
                      <RHFAutocomplete
                        name="priority"
                        label="Priority"
                        options={ticketSettings?.priorities || []}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name || ''}`}
                        renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                      />
                      {id && (
                        <RHFAutocomplete
                          name="status"
                          label="Status"
                          options={ticketSettings?.statuses || []}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name || ''}`}
                          renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                        />)}
                      <RHFAutocomplete
                        name="impact"
                        label="Impact"
                        options={ticketSettings?.impacts || []}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name || ''}`}
                        renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                      />
                    </Box>
                    {issueType?.name?.trim()?.toLowerCase() === 'change request' && (
                      <>
                        <Box
                          rowGap={2}
                          columnGap={2}
                          display="grid"
                          gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' }}
                        >
                          <RHFAutocomplete
                            name="changeType"
                            label="Change Type"
                            options={ticketSettings?.changeTypes || []}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            getOptionLabel={(option) => `${option.name || ''}`}
                            renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                          />
                          <RHFAutocomplete
                            name="changeReason"
                            label="Change Reason"
                            options={ticketSettings?.changeReasons || []}
                            isOptionEqualToValue={(option, value) => option._id === value._id}
                            getOptionLabel={(option) => `${option.name || ''}`}
                            renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                          />
                        </Box>
                        <RHFEditor name="implementationPlan" label="Implementation Plan" minRows={4} multiline />
                        <RHFEditor name="backoutPlan" label="Backout Plan" minRows={4} multiline />
                        <RHFEditor name="testPlan" label="Test Plan" minRows={4} multiline />
                      </>
                    )}
                    {['change_request', 'system_problem']?.includes(issueType?.slug?.trim()?.toLowerCase()) && (
                      <>
                        <RHFAutocomplete
                          name="investigationReason"
                          label="Investigation Reason"
                          options={ticketSettings?.investigationReasons || []}
                          isOptionEqualToValue={(option, value) => option._id === value._id}
                          getOptionLabel={(option) => `${option.name || ''}`}
                          renderOption={(props, option) => (<li {...props} key={option?._id}> {option.name && option.name} </li>)}
                        />
                        <RHFEditor name="rootCause" label="Root Cause" minRows={4} multiline />
                        <RHFEditor name="workaround" label="Workaround" minRows={4} multiline />
                      </>
                    )}
                  </Box>
                  {issueType?.name?.trim()?.toLowerCase() === 'change request' && (
                    <Box
                      rowGap={2}
                      columnGap={2}
                      display="grid"
                      gridTemplateColumns={{ sm: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' }}
                    >
                      <RHFDatePicker
                        label="Planned Start Date"
                        name="plannedStartDate"
                      />

                      <RHFTimePicker
                        label="Start Time"
                        name="startTime"
                      />

                      <RHFDatePicker
                        label="Planned End Date"
                        name="plannedEndDate"
                      />

                      <RHFTimePicker
                        label="End Time"
                        name="endTime"
                      />
                    </Box>
                  )}
                  <Grid display="flex" alignItems="end">
                    <RHFSwitch name="shareWith" label="Shared With Organization" />
                    {id && (
                      <RHFSwitch name="isActive" label="Active" />
                    )}
                  </Grid>
                  <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
                </Stack>
              </Card>
            </Grid>
          </Grid>
        )}
      </FormProvider>
    </Container>
  );
}