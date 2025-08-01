import PropTypes from 'prop-types';
import { memo, useMemo, useCallback, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
// routes
import { useNavigate } from 'react-router-dom';
// @mui
import { Stack, Grid, TextField, InputAdornment, Button, IconButton } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import { PATH_SUPPORT } from '../../routes/paths';
import { ticketControllerSchema } from '../schemas/ticketSchema';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
// constants
import { options, StyledTooltipIconButton, StyledTooltip } from '../../theme/styles/default-styles';
import { getTickets, getTicketSettings, setTicketController } from '../../redux/slices/ticket/tickets';

import { useAuthContext } from '../../auth/useAuthContext';
import { getActiveSecurityUsers } from '../../redux/slices/securityUser/securityUser';
// ----------------------------------------------------------------------

TicketTableController.propTypes = {
  isFiltered: PropTypes.bool,
  filterName: PropTypes.string,
  onFilterName: PropTypes.func,
  onResetFilter: PropTypes.func,
  onReload: PropTypes.func,
};

function TicketTableController({
  isFiltered,
  filterName,
  onFilterName,
  onResetFilter,
}) {
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { ticketSettings, page, rowsPerPage, ticketController } = useSelector((state) => state.tickets);
  const { activeSecurityUsers } = useSelector((state) => state.user);
  const configurations = useMemo(() => JSON.parse(localStorage.getItem('configurations')) || [] , []);

  const defaultValues = useMemo(
    () => ({
      isResolved: ticketController?.isResolved ?? { label: 'Open', value: false },
      statusType: ticketController?.statusType || null,
      status: ticketController?.status || [],
      issueType: ticketController?.issueType || null,
      requestType: ticketController?.requestType || null,
      priority: ticketController?.priority || null,
      assignees: ticketController?.assignees || null,
      faults: ticketController?.faults || null,
      assignedToMe: ticketController?.assignedToMe || false,
    }),
    [ ticketController ]
  );

  const methods = useForm({
    resolver: yupResolver(ticketControllerSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { setError, setValue, handleSubmit, watch, formState: { isSubmitting } } = methods;
  const { issueType, requestType, isResolved, statusType, status, assignees, assignedToMe, priority, faults } = watch();
  const onSubmit = async (data) => {
    try {
      await dispatch(getTickets({ page: 0, pageSize: rowsPerPage, ...data }))
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

  const handleChange = (checked) => {
    setValue('assignedToMe', checked, { shouldDirty: true });
    dispatch(setTicketController({ ...ticketController, assignedToMe: checked }));

    if (checked) {
      const val = activeSecurityUsers.find( (u) => u?.contact?._id?.toString() === user?.contact?.toString() );
      setValue('assignees', val || null, { shouldDirty: true });
    } else {
      setValue('assignees', null, { shouldDirty: true });
    }

    handleSubmit(onSubmit)();
  };

  const isCurrentUserAssignable = useMemo(() => activeSecurityUsers?.some(
      (u) => u?.contact?._id?.toString() === user?.contact?.toString()
    ), [activeSecurityUsers, user]);

  useEffect(() => {
    dispatch(getTickets({
      page,
      pageSize: rowsPerPage,
      issueType,
      requestType,
      isResolved,
      statusType,
      status,
      assignees,
      assignedToMe,
      priority,
      faults
    }));

    dispatch(getTicketSettings());
    const assigneeRoleType = configurations?.find((c) => c?.name?.trim() === 'SupportTicketAssigneeRoleType')?.value?.trim();

    dispatch(getActiveSecurityUsers({ type: 'SP', roleType: assigneeRoleType }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ dispatch, page, rowsPerPage ]);

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
          renderOption={(props, option) => (<li {...props} key={option.value}> {option.label} </li> )}
          onChange={(event, newValue) => {
            setValue('isResolved', newValue);
            setValue('statusType', null);
            setValue('status', []);
            dispatch(setTicketController({ ...ticketController, isResolved: newValue, statusType: null, status: [] }));
          }}
        />
      </Grid>

      {/* Status Type */}
      {isResolved?.value !== undefined && (
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
            setValue('statusType', newValue);
            setValue('status', []);
            dispatch(setTicketController({ ...ticketController, statusType: newValue, status: [] }));
          }}
        />
      </Grid>)}

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
            dispatch(setTicketController({ ...ticketController, status: newValue || null }));
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
            setValue('issueType', newValue);
            setValue('requestType', null);
            dispatch(setTicketController({...ticketController, issueType: newValue, requestType: null})) 
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
            dispatch(setTicketController({ ...ticketController, requestType: newValue || null }));
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
          onChange={(event, newValue) => {
            if (newValue) {
              if(newValue?._id !== assignees?._id ){
              setValue('assignedToMe', false);
              }
              setValue('assignees', newValue);
              dispatch(setTicketController({ ...ticketController, assignees: newValue }));
            } else {
              setValue('assignees', null);
              setValue('assignedToMe', false);
              dispatch(setTicketController({ ...ticketController, assignees: null, assignedToMe: false }));
            }
          }}
          renderInput={(params) => (
            <TextField {...params} size="small" label="Assignee"
              InputProps={{ ...params.InputProps,
                endAdornment: (
                <>
                {params.InputProps.endAdornment}
                {isCurrentUserAssignable && !assignedToMe && (
                <InputAdornment position="end">
                  <StyledTooltip title={assignedToMe ? 'All Tickets' : 'My Tickets'} placement="top" >
                    <IconButton onClick={() => handleChange( !assignedToMe ) }
                      sx={{ height: 35, width: 35 }}>
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
            dispatch(setTicketController({ ...ticketController, priority: newValue || null }));
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
            dispatch(setTicketController({ ...ticketController, faults: newValue || null }));
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
              )),
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
