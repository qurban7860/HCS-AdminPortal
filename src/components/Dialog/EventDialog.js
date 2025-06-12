import PropTypes from 'prop-types';
import React, { useEffect, useLayoutEffect, useRef, memo, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { enc, MD5, lib } from 'crypto-js';
// @mui
import { Box, Stack, Button, DialogActions, DialogContent, Grid, Dialog, DialogTitle, Divider, Typography } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingButton } from '@mui/lab';
import { eventSchema } from '../../pages/schemas/calendarSchema';
import { manipulateFiles } from '../../pages/documents/util/Util';
// slices
import { setEventModel, createEvent, updateEvent, deleteEvent, deleteEventFile } from '../../redux/slices/event/event';
import { getActiveCustomerMachines, resetActiveCustomerMachines } from '../../redux/slices/products/machine';
import { getActiveSites, resetActiveSites } from '../../redux/slices/customer/site';
import FormProvider, { RHFDatePicker, RHFTextField, RHFAutocomplete, RHFUpload } from '../hook-form';
import IconTooltip from '../Icons/IconTooltip';
import ConfirmDialog from '../confirm-dialog/ConfirmDialog';
import { fDateTime } from '../../utils/formatTime';
import { time_list } from '../../constants/time-list';
import { useAuthContext } from '../../auth/useAuthContext';
import { useSnackbar } from '../snackbar';
import PriorityIcon from '../../pages/calendar/utils/PriorityIcon';
import { StatusColor } from '../../pages/calendar/utils/StatusColor';
import RenderCustomInput from '../custom-input/RenderCustomInput';
import EventToggleButton from '../custom-input/EventToggleButton';


function getTimeObjectFromISOString(dateString) {
  const date = new Date(dateString);
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const formattedValueTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const ampm = hours >= 12 ? 'PM' : 'AM';
  const formattedHours = hours % 12 || 12;
  const formattedTime = `${formattedHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  const timeObject = {
    value: formattedValueTime,
    label: `${formattedTime} ${ampm}`
  };
  return timeObject;
}


const getInitialValues = (selectedEvent, range, contacts) => {
  const initialEvent = {
    _id: selectedEvent ? selectedEvent?._id : null,
    isCustomerEvent: (selectedEvent?.isCustomerEvent || selectedEvent?.isCustomerEvent === undefined) && true || false,
    eventType: selectedEvent && (selectedEvent?.isCustomerEvent ? "customerVisit" : "InternalTask") || "customerVisit",
    date: selectedEvent ? selectedEvent?.start : (range?.start || new Date()),
    end_date: selectedEvent ? selectedEvent?.end : (range?.end || new Date()),
    start: selectedEvent ? getTimeObjectFromISOString(selectedEvent?.start) : { value: '07:30', label: '7:30 AM' },
    end: selectedEvent ? getTimeObjectFromISOString(selectedEvent?.end) : { value: '18:00', label: '6:00 PM' },
    customer: selectedEvent ? selectedEvent?.customer : null,
    priority: selectedEvent?.priority?.trim() ? selectedEvent?.priority : null,
    status: selectedEvent?.status?.trim() ? selectedEvent?.status : null,
    machines: selectedEvent ? selectedEvent?.machines : [],
    site: selectedEvent ? selectedEvent?.site : null,
    jiraTicket: selectedEvent ? selectedEvent?.jiraTicket : '',
    primaryTechnician: selectedEvent ? selectedEvent?.primaryTechnician : null,
    supportingTechnicians: selectedEvent ? selectedEvent?.supportingTechnicians : [],
    notifyContacts: selectedEvent ? selectedEvent?.notifyContacts : contacts,
    description: selectedEvent ? selectedEvent?.description : '',
    files: selectedEvent ? manipulateFiles(selectedEvent?.files) : [],
    createdAt: selectedEvent?.createdAt || '',
    createdByFullName: selectedEvent?.createdBy?.name || '',
    createdIP: selectedEvent?.createdIP || '',
    updatedAt: selectedEvent?.updatedAt || '',
    updatedByFullName: selectedEvent?.updatedBy?.name || '',
    updatedIP: selectedEvent?.updatedIP || '',
  };

  return initialEvent;
};

EventDialog.propTypes = {
  range: PropTypes.object,
  contacts: PropTypes.array
};

function EventDialog({
  range,
  contacts,
}) {

  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const { selectedEvent, eventModel, isLoading } = useSelector((state) => state.event);
  const { activeCustomers } = useSelector((state) => state.customer);
  const { activeSpContacts } = useSelector((state) => state.contact);
  const { activeSites } = useSelector((state) => state.site);
  const { activeCustomerMachines } = useSelector((state) => state.machine);
  const [openConfirm, setOpenConfirm] = useState(false);
  const dialogRef = useRef(null);
  const defaultValues = getInitialValues(selectedEvent?.extendedProps, range, contacts);
  const methods = useForm({
    resolver: yupResolver(eventSchema(() => methods.clearErrors())),
    defaultValues
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting, errors },
  } = methods;

  useEffect(() => {
    if (Object.keys(errors).length !== 0 && errors.constructor === Object) {
      if (dialogRef.current) {
        dialogRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [errors]);

  const { customer, machines, date, isCustomerEvent, files, priority, status, eventType } = watch();

  useEffect(() => {
    if (Array.isArray(machines) && machines?.length > 0 && machines?.length < 2) {
      setValue("site", machines[0]?.instalationSite)
    } else if (machines?.length < 1) {
      setValue("site", null)
    }
  }, [machines, setValue])

  useEffect(() => {
    const { end_date } = watch()
    if (date && end_date) {
      const startDate = new Date(date);
      const endDate = new Date(end_date);
      if (startDate > endDate) {
        setValue('end_date', startDate);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date])

  useLayoutEffect(() => {
    dispatch(getActiveCustomerMachines(selectedEvent?.extendedProps?.customer?._id));
    reset(getInitialValues(selectedEvent?.extendedProps, range, contacts));
  }, [dispatch, reset, range, selectedEvent, contacts]);

  const priorityOptions = [
    'High',
    'Medium',
    'Low',
  ];

  const onSubmit = async (data) => {
    try {
      data.priority = priority || '';
      data.status = status || '';
      const start_date = new Date(data?.date);
      const end_date = new Date(data?.end_date);
      const [start_hours, start_minutes] = data.start.value.split(':').map(Number);
      const [end_hours, end_minutes] = data.end.value.split(':').map(Number);
      start_date.setHours(start_hours, start_minutes);
      data.start_date = new Date(start_date);
      end_date.setHours(end_hours, end_minutes);
      data.end_date = new Date(end_date);
      if (data?._id) {
        await dispatch(updateEvent(data?._id, data));
        enqueueSnackbar('Event Updated Successfully!');
      } else {
        await dispatch(createEvent(data));
        enqueueSnackbar('Event Created Successfully!');
      }
      await setValue("isCustomerEvent", true);
      await reset();
      await dispatch(setEventModel(false));
    } catch (e) {
      if (typeof e === 'string') {
        enqueueSnackbar(e, { variant: 'error' });
      }
    }

  };

  const handleCloseModel = () => {
    dispatch(setEventModel(false))
    dispatch(resetActiveCustomerMachines())
    dispatch(resetActiveSites())
    setValue("isCustomerEvent", true);
    setValue("eventType", "customerVisit");
    reset()
  };

  const handleCustomerEvent = (event, val) => {
    if (val && val !== eventType && !selectedEvent) {
      setValue("jiraTicket", "");
      setValue("customer", null);
      setValue("priority", "");
      setValue("status", "");
      setValue("primaryTechnician", null);
      setValue("machines", []);
      setValue("site", null);
      setValue("supportingTechnicians", []);
      setValue("notifyContacts", []);
      setValue("description", "");
      setValue("files", []);
      setValue("eventType", val);
      setValue("isCustomerEvent", val === "customerVisit");
    };
  }

  useEffect(() => {
    if (!isCustomerEvent) {
      if (Array.isArray(activeCustomers) && activeCustomers?.length > 0) {
        setValue('customer', activeCustomers.find((cus) => cus?._id === user?.customer));
      }
      if (!selectedEvent && Array.isArray(activeSpContacts) && activeSpContacts?.length > 0) {
        setValue('primaryTechnician', activeSpContacts?.find((con) => con?._id === user?.contact));
      }
    }
  }, [isCustomerEvent, setValue, activeSpContacts, activeCustomers, user, selectedEvent]);

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
        dispatch(deleteEventFile(inputFile?.event, inputFile?._id))
      }
    } catch (e) {
      console.error(e)
    }
  }, [dispatch, setValue, files]);

  const handleDeleteEvent = async (inputFile) => {
    try {
      if (selectedEvent && selectedEvent?.extendedProps?._id) {
        await dispatch(deleteEvent(selectedEvent?.extendedProps?._id));
        await setOpenConfirm(false);
        await dispatch(setEventModel(false));
      }
      enqueueSnackbar('Event Deleted Successfully!');
    } catch (error) {
      enqueueSnackbar('Event Delete Failed!', { variant: 'error' });
    }
  };

  const handleChangeCustomer = (option, newValue) => {
    if (newValue) {
      if (newValue?._id !== customer?._id) {
        setValue("site", null)
        setValue("machines", [])
        dispatch(resetActiveCustomerMachines())
      }
      setValue("customer", newValue)
      dispatch(getActiveCustomerMachines(newValue?._id))
      dispatch(getActiveSites(newValue?._id))
    } else {
      setValue("customer", null)
      setValue("site", null)
      setValue("machines", [])
      dispatch(resetActiveCustomerMachines())
      dispatch(resetActiveSites())
    }
  }

  return (
    <>
      <Dialog
        sx={{
          '& .MuiDialog-container': {
            alignItems: 'flex-start',
          },
          '& .MuiPaper-root': {
            marginTop: 4,
            marginBottom: 4,
          },
        }}
        fullWidth
        disableEnforceFocus
        maxWidth="lg"
        open={eventModel}
        onClose={handleCloseModel}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle
          display="flex"
          justifyContent="center"
          variant="h3"
          sx={{ my: -1, mx: 3, position: 'relative' }}
        >
          <span style={{ position: 'absolute', left: 0 }}>
            {selectedEvent ? 'Update Event' : 'New Event'}
          </span>
          <EventToggleButton value={eventType} handleChange={handleCustomerEvent} />
        </DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent dividers>
          <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Grid container ref={dialogRef}>
              <Stack spacing={2} sx={{ pt: 2 }}>
                <Box
                  rowGap={2}
                  columnGap={2}
                  display="grid"
                  gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(4, 1fr)' }}
                >
                  <RHFDatePicker label="Event Date*" name="date" />
                  <RHFAutocomplete
                    label="Start Time*"
                    name="start"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  <RHFDatePicker label="End Date*" name="end_date" />
                  <RHFAutocomplete
                    // disabled={allDay}
                    label="End Time*"
                    name="end"
                    options={time_list}
                    isOptionEqualToValue={(option, value) => option?.value === value?.value}
                    getOptionLabel={(option) => `${option?.label || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option?.label || ''}`}</li>
                    )}
                  />
                  {/* <Button sx={{height:'58px'}} variant={allDay?'contained':'outlined'} onClick={()=> handleAllDayChange(!allDay)} 
                  startIcon={<Iconify icon={allDay?'gravity-ui:circle-check':'gravity-ui:circle'}/>}>All Day</Button> */}
                </Box>

                <RHFTextField name="jiraTicket" label={isCustomerEvent ? 'Jira Ticket' : 'Title'} />

                {isCustomerEvent && (
                  <RHFAutocomplete
                    label="Customer*"
                    name="customer"
                    options={activeCustomers}
                    isOptionEqualToValue={(option, value) => option?._id === value?._id}
                    getOptionLabel={(option) => `${option.name || ''}`}
                    renderOption={(props, option) => (
                      <li {...props} key={option?._id}>{`${option.name || ''}`}</li>
                    )}
                    onChange={handleChangeCustomer}
                  />
                )}

                {isCustomerEvent && (
                  <>
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Machines"
                      name="machines"
                      options={activeCustomerMachines}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>
                        `${option?.serialNo || ''} ${option?.name ? '-' : ''} ${option?.name || ''}`
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.serialNo || ''} ${option?.name ? '-' : ''
                          } ${option?.name || ''}`}</li>
                      )}
                    />
                    <RHFAutocomplete
                      label="Site"
                      name="site"
                      options={activeSites}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) => `${option.name || ''}`}
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option.name || ''}`}</li>
                      )}
                    />
                  </>
                )}
                <RHFAutocomplete
                  label={isCustomerEvent ? 'Primary Technician*' : 'Assignee*'}
                  name="primaryTechnician"
                  options={activeSpContacts}
                  isOptionEqualToValue={(option, value) => option?._id === value?._id}
                  getOptionLabel={(option) =>
                    `${option?.firstName || ''} ${option?.lastName || ''}`
                  }
                  renderOption={(props, option) => (
                    <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''
                      }`}</li>
                  )}
                />
                {isCustomerEvent && (
                  <>
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Supporting Technicians"
                      name="supportingTechnicians"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>
                        `${option.firstName || ''} ${option.lastName || ''}`
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''
                          }`}</li>
                      )}
                    />
                    <RHFAutocomplete
                      multiple
                      disableCloseOnSelect
                      filterSelectedOptions
                      label="Notify Contacts"
                      name="notifyContacts"
                      options={activeSpContacts}
                      isOptionEqualToValue={(option, value) => option?._id === value?._id}
                      getOptionLabel={(option) =>
                        `${option.firstName || ''} ${option.lastName || ''}`
                      }
                      renderOption={(props, option) => (
                        <li {...props} key={option?._id}>{`${option?.firstName || ''} ${option?.lastName || ''
                          }`}</li>
                      )}
                    />
                  </>
                )}

                <RHFTextField name="description" label="Description" multiline rows={3} />
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
                    width: '100%',
                  }}
                >
                  <RHFAutocomplete
                    label="Priority"
                    name="priority"
                    options={priorityOptions}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => <RenderCustomInput label="Priority" params={params} />}
                    renderOption={(props, option) => (
                      <li {...props} key={option}>
                        <PriorityIcon priority={option} />
                        <span style={{ marginLeft: 8 }}>{option}</span>
                      </li>
                    )}
                  />
                  <RHFAutocomplete
                    name="status"
                    options={['To Do', 'In Progress', 'Done', 'Cancelled']}
                    isOptionEqualToValue={(option, value) => option === value}
                    renderInput={(params) => (
                      <RenderCustomInput
                        label="Status*"
                        params={{
                          ...params, error: !!errors?.status, helperText: errors?.status?.message,
                          InputProps: {
                            ...params.InputProps,
                            style: {
                              ...params.InputProps.style,
                              color: StatusColor(params.InputProps.value)
                            }
                          },
                        }}
                      />
                    )}
                    renderOption={(props, option) => (
                      <li {...props} key={option} style={{ fontWeight: 'bold', color: StatusColor(option) }}>
                        {option}
                      </li>
                    )}
                    rules={{ required: 'Status is required' }}
                  />
                </Box>

                <RHFUpload
                  dropZone={false}
                  multiple
                  thumbnail
                  name="files"
                  imagesOnly
                  onDrop={handleDropMultiFile}
                  onRemove={handleFileRemove}
                // onRemoveAll={() => setValue('files', '', { shouldValidate: true })}
                />

                {selectedEvent && (
                  <Box
                    rowGap={2}
                    columnGap={2}
                    display="grid"
                    gridTemplateColumns={{ xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' }}
                  >
                    <Typography variant="body2" color="#919EAB">
                      <b>created by:</b> {`${defaultValues?.createdByFullName || ''}`} <br />{' '}
                      {`${fDateTime(defaultValues.createdAt)} / ${defaultValues.createdIP}`}
                    </Typography>
                    <Typography variant="body2" color="#919EAB">
                      <b>updated by:</b> {`${defaultValues?.updatedByFullName || ''}`} <br />{' '}
                      {`${fDateTime(defaultValues.updatedAt)} / ${defaultValues.updatedIP}`}
                    </Typography>
                  </Box>
                )}
              </Stack>
            </Grid>
          </FormProvider>
        </DialogContent>
        <DialogActions sx={{ py: -2 }}>
          {selectedEvent && (
            <IconTooltip
              color="#FF0000"
              title="Delete Event"
              icon="eva:trash-2-outline"
              onClick={() => setOpenConfirm(true)}
            />
          )}
          <Box sx={{ flexGrow: 1 }} />
          <Button variant="outlined" color="inherit" onClick={handleCloseModel}>
            Cancel
          </Button>
          <LoadingButton
            type="submit"
            variant="contained"
            onClick={handleSubmit(onSubmit)}
            loading={isSubmitting}
          >
            {selectedEvent ? 'Update' : 'Add'}
          </LoadingButton>
        </DialogActions>
      </Dialog>
      <ConfirmDialog
        open={openConfirm}
        onClose={() => setOpenConfirm(false)}
        title="Delete"
        content="Are you sure you want to Delete?"
        action={
          <LoadingButton
            variant="contained"
            color="error"
            onClick={handleDeleteEvent}
            loading={isLoading || isSubmitting}
          >
            Delete
          </LoadingButton>
        }
      />
    </>
  );
}

export default memo(EventDialog);

