import PropTypes from 'prop-types';
import { memo, useMemo, useCallback, useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
// routes
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Grid, TextField, InputAdornment, Button, IconButton } from '@mui/material';
import { useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { PATH_SUPPORT } from '../../routes/paths';
import { ticketControllerSchema } from '../schemas/ticketSchema';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
// constants
import { options, StyledTooltipIconButton, StyledTooltip } from '../../theme/styles/default-styles';
import { setFilterPriority, setFilterIssueType, setFilterRequestType, setFilterStatusType, setFilterStatus, setFilterResolvedStatus, setFilterAssignee, setFilterFault } from '../../redux/slices/ticket/tickets';

// ----------------------------------------------------------------------

TicketTableController.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onReload: PropTypes.func,
  currentUser: PropTypes.object, 
  filterPriority: PropTypes.object,
  filterIssueType: PropTypes.object,
  filterRequestType: PropTypes.object,
  filterStatusType: PropTypes.object,
  filterStatus: PropTypes.array,
  filterResolvedStatus: PropTypes.object,
  filterAssignee: PropTypes.object,
  filterFault: PropTypes.object,
};

function TicketTableController({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
  onReload,
  currentUser,
  filterPriority, filterIssueType, filterRequestType, filterStatusType, filterStatus, filterResolvedStatus, filterAssignee, filterFault
}) {

    const { ticketSettings } = useSelector((state) => state.tickets);
    const { activeSecurityUsers } = useSelector((state) => state.user);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const defaultValues = useMemo(
      () => ({
        isResolved: filterResolvedStatus || { label: 'Open', value: false },
        statusType: filterStatusType || null,
        status: filterStatus || [],
        issueType: filterIssueType || null,
        requestType: filterRequestType || null,
        priority: filterPriority || null,
        assignees: filterAssignee || null,
        faults: filterFault || null,
        assignedToMe: false
      }),
      [filterPriority, filterIssueType, filterRequestType, filterStatusType, filterStatus, filterResolvedStatus, filterAssignee, filterFault]
    );

  const methods = useForm({
    resolver: yupResolver(ticketControllerSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { setError, setValue, handleSubmit, watch, formState: { isSubmitting } } = methods;
  const { issueType, requestType, isResolved, statusType, status, priority, assignees, faults, assignedToMe } = watch();

    const onSubmit = async (data) => {
      try {
        await onReload({ 
          issueType: issueType?._id, 
          requestType: requestType?._id, 
          isResolved: isResolved?.value, 
          statusType: statusType?._id , 
          status: status?.map(s=>s?._id), 
          priority: priority?._id,
          faults: faults?._id && [faults?._id],
          assignees: assignees?._id && [assignees?._id]
        })
        dispatch(setFilterIssueType(issueType || null));
        dispatch(setFilterRequestType(requestType || null));
        dispatch(setFilterResolvedStatus(isResolved || null));
        dispatch(setFilterStatusType(statusType || null));
        dispatch(setFilterStatus(status || []));
        dispatch(setFilterAssignee(assignees || null));
        dispatch(setFilterPriority(priority || null));
        dispatch(setFilterFault(faults || null));
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
        }
      }
    };

    const handleChange = (event) => {
      const {checked} = event.target;
      setValue('assignedToMe', checked, { shouldDirty: true });

      if (checked) {
        const val = activeSecurityUsers.find(
          (user) => user?.contact?._id?.toString() === currentUser?.contact?.toString()
        );
        setValue('assignees', val || null, { shouldDirty: true });
      } else {
        setValue('assignees', null, { shouldDirty: true });
      }
    };

    useEffect(() => {
      if (assignedToMe !== undefined) {
        handleSubmit(onSubmit)();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [assignedToMe]); 

    const isCurrentUserAssignable = useMemo(() => activeSecurityUsers?.some(
      (user) => user?.contact?._id?.toString() === currentUser?.contact?.toString()
    ), [activeSecurityUsers, currentUser]);

  const resolutionStatusOptions = [
    { label: 'Open', value: false },
    { label: 'Resolved', value: true },
  ];
  
  const toggleAdd = useCallback(() => navigate(PATH_SUPPORT.supportTickets.new), [navigate]);

  return (
  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Stack {...options}>
      <Grid container spacing={1} sx={{ display: 'flex', width: '100%' }} >
    <Grid container spacing={1} sx={{ display: 'flex' }} >
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <RHFAutocomplete
          name="isResolved"
          label="Resolution"
          size="small"
          options={resolutionStatusOptions}
          isOptionEqualToValue={(option, value) => option?.value === value?.value}
          getOptionLabel={(option) => option?.label || ''}
          renderOption={(props, option) => (
            <li {...props} key={option.value}>
              {option.label}
            </li>
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue('isResolved', newValue);
              dispatch(setFilterResolvedStatus(newValue));
              if (newValue.value !== statusType?.isResolved) {
                setValue('statusType', null);
                setValue('status', []);
                dispatch(setFilterStatusType(null));
                dispatch(setFilterStatus([]));
              }
            } else {
              dispatch(setFilterStatusType(null));
              dispatch(setFilterStatus([]));
              dispatch(setFilterResolvedStatus(null));
              setValue('isResolved', null);
              setValue('statusType', null);
              setValue('status', []);
            }
          }}
        />
      </Grid>

      {/* Status Type */}
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <RHFAutocomplete
          name="statusType"
          label="Status Type"
          size="small"
          options={ticketSettings?.statusTypes?.filter(st => st?.isResolved === isResolved?.value ) || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
           <li {...props} key={option?._id}> <Iconify icon={option?.icon} sx={{ color: option?.color, mr: 1 }} /> {option?.name} </li>
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue('statusType', newValue);
              dispatch(setFilterStatusType(newValue));
              if (status?.every( s => s?.statusType?._id !== newValue?._id)) {
                setValue('status', []);
                dispatch(setFilterStatus([]));
              }
            } else {
              setValue('statusType', null);
              dispatch(setFilterStatusType(null));
              setValue('status', []);
              dispatch(setFilterStatus([]));
            }
          }}
        />
      </Grid>

      {/* Status (Multi) */}
      { statusType?._id && <Grid item xs={12} sm={4} md={4} lg={2}>
        <RHFAutocomplete
          name="status"
          label="Status"
          size="small"
          options={ticketSettings?.statuses?.filter(s=>s?.statusType?._id === statusType?._id) || []}
          multiple
          disableCloseOnSelect
          filterSelectedOptions
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => ( <li {...props} key={option?._id}> <Iconify icon={option?.icon} sx={{ color: option?.color, mr: 1 }} /> {option?.name || ''}</li> )}
          onChange={(event, newValue) => {
            setValue('status', newValue);
            dispatch(setFilterStatus(newValue));
          }}
        />
      </Grid>}
      {/* Issue Type */}
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <RHFAutocomplete
          name="issueType"
          label="Issue Type"
          size="small"
          options={ticketSettings?.issueTypes || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => ( <li {...props} key={option?._id}> <Iconify icon={option?.icon} sx={{ color: option?.color, mr: 1 }} /> {option?.name || ''}</li> )}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue('issueType', newValue);
              dispatch(setFilterIssueType(newValue));
              if (newValue?._id !== requestType?.issueType?._id) {
                setValue('requestType', null);
                dispatch(setFilterRequestType(null));
              }
            } else {
              setValue('issueType', null);
              dispatch(setFilterIssueType(null));
              setValue('requestType', null);
              dispatch(setFilterRequestType(null));
            }
          }}
        />
      </Grid>

      {/* Request Type */}
      {issueType?._id && <Grid item xs={12} sm={6} md={3} lg={2}>
        <RHFAutocomplete
          name="requestType"
          label="Request Type"
          size="small"
          options={ticketSettings?.requestTypes?.filter(rt => rt?.issueType?._id === issueType?._id ) || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}> <Iconify icon={option?.icon} sx={{ color: option?.color, mr: 1 }} /> {option?.name || ''}</li>
          )}
          onChange={(event, newValue) => {
            setValue('requestType', newValue);
            dispatch(setFilterRequestType(newValue));
          }}
        />
      </Grid>}

      {/* Assignees */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <RHFAutocomplete
          name="assignees"
          label="Assignee"
          size="small"
          options={activeSecurityUsers || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name || ''}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
          onChange={(event, val) => {
            if (!assignedToMe) {
              setValue('assignees', val);
              dispatch(setFilterAssignee(val));
            }
          }}
          disabled={assignedToMe}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Assignee"
              InputProps={{ ...params.InputProps,
                endAdornment: (
                <>
                {params.InputProps.endAdornment}
                {isCurrentUserAssignable && (
                <InputAdornment position="end">
                  <StyledTooltip title={assignedToMe ? 'All Tickets' : 'My Tickets'} placement="top" tooltipcolor="#2e7d32" color="#2e7d32">
                    <IconButton onClick={() => handleChange({ target: { checked: !assignedToMe } }) }
                      sx={{ height: 35, width: 35, color: assignedToMe ? '#2e7d32' : 'text.secondary' }}>
                      <Iconify icon="mdi:ticket-account" width={20} height={20} />
                    </IconButton>
                  </StyledTooltip>
                </InputAdornment> )}
                </> ),
              }}
            />
          )}
        />
      </Grid>
      {/* Priority */}
      <Grid item xs={12} sm={4} md={3} lg={2} >
        <RHFAutocomplete
          name="priority"
          label="Priority"
          size="small"
          options={ticketSettings?.priorities || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}> <Iconify icon={option?.icon} sx={{ color: option?.color, mr: 1 }} /> {option?.name || ''}</li>
          )}
          onChange={(event, newValue) => {
            setValue('priority', newValue);
            dispatch(setFilterPriority(newValue));
          }}
        />
      </Grid>

            {/* Faults */}
      <Grid item xs={12} sm={4} md={3} lg={2} >
        <RHFAutocomplete
          name="faults"
          label="Fault"
          size="small"
          options={ticketSettings?.faults || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}> <Iconify icon={option?.icon} sx={{ color: option?.color, mr: 1 }} /> {option?.name || ''}</li>
          )}
          onChange={(event, newValue) => {
            setValue('faults', newValue);
            dispatch(setFilterFault(newValue));
          }}
        />
      </Grid>

      {/* Search Bar */}
        <Grid item xs={12} sm={6} md={6} lg={6} >
                  <TextField
                    fullWidth
                    value={filterName}
                    onChange={onFilterName}
                    size="small"
                    placeholder="Search..."
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Iconify icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                        </InputAdornment>
                      ),
                      endAdornment: (isFiltered && (
                        <InputAdornment position="end">
                          <Button fullWidth onClick={onResetFilter} color='error' size='small' startIcon={<Iconify icon='eva:trash-2-outline' />}>
                            {BUTTONS.CLEAR}
                          </Button>
                        </InputAdornment>
                      )
                      ),
                    }}
                  />
        </Grid>
        <Grid item xs="auto" sx={{  ml: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <StyledTooltipIconButton 
          placement="top"
          tooltip="Reload"
          tooltipcolor="#103996"
          icon="mdi:reload"
          color="#103996"
          onClick={handleSubmit(onSubmit)}
          loading={isSubmitting}
          disabled={isSubmitting}
        />
      </Grid>
      <Grid item>
        <StyledTooltip title={BUTTONS.ADDTICKET} placement="top" disableFocusListener tooltipcolor="#103996" color="#fff">
          <IconButton color="#fff" onClick={toggleAdd}
            sx={{ background: '#2065D1', borderRadius: 1, height: '1.7em', p: '8.5px 14px',
              '&:hover': {
                background: '#103996',
                color: '#fff',
              },
            }}
          >
            <Iconify color="#fff" sx={{ height: '24px', width: '24px' }} icon="eva:plus-fill" />
          </IconButton>
        </StyledTooltip>
      </Grid> 
       </Grid>
    </Grid>
  </Stack>
  </FormProvider>
  );
}

export default memo(TicketTableController);
