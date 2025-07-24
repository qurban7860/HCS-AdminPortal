import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
// @mui
import { Stack, Grid, TextField, InputAdornment, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ticketControllerSchema } from '../schemas/ticketSchema';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
import { BUTTONS } from '../../constants/default-constants';
import Iconify from '../../components/iconify';
// constants
import { options, StyledTooltipIconButton } from '../../theme/styles/default-styles';

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
  onReload
}) {

    const { ticketSettings } = useSelector((state) => state.tickets);
    const { activeSecurityUsers } = useSelector((state) => state.user);

    const defaultValues = useMemo(
      () => ({
        isResolved: { label: 'Open', value: false },
        statusType: null,
        status: [],
        issueType: null,
        requestType: null,
        priority: null,
        assignees: null,
        faults: null
      }),
      []
    );

  const methods = useForm({
    resolver: yupResolver(ticketControllerSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { setError, setValue, handleSubmit, watch, formState: { isSubmitting } } = methods;
  const { issueType, requestType, isResolved, statusType, status, priority, assignees, faults } = watch();

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

const resolutionStatusOptions = [
  { label: 'Open', value: false },
  { label: 'Resolved', value: true },
];

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
          disableClearable
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
              if (newValue.value !== statusType?.isResolved) {
                setValue('statusType', null);
                setValue('status', []);
              }
            } else {
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
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue('statusType', newValue);
              if (status?.every( s => s?.statusType?._id !== newValue?._id)) {
                setValue('status', []);
              }
            } else {
              setValue('statusType', null);
              setValue('status', []);
            }
          }}
        />
      </Grid>

      {/* Status (Multi) */}
      <Grid item xs={12} sm={4} md={4} lg={2}>
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
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{option?.name || ''}</li> )}
        />
      </Grid>
      {/* Issue Type */}
      <Grid item xs={12} sm={4} md={3} lg={2}>
        <RHFAutocomplete
          name="issueType"
          label="Issue Type"
          size="small"
          options={ticketSettings?.issueTypes || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => ( <li {...props} key={option?._id}>{option?.name || ''}</li> )}
          onChange={(event, newValue) => {
            if (newValue) {
              setValue('issueType', newValue);
              if (newValue?._id !== requestType?.issueType?._id) {
                setValue('requestType', null);
              }
            } else {
              setValue('issueType', null);
              setValue('requestType', null);
            }
          }}
        />
      </Grid>

      {/* Request Type */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <RHFAutocomplete
          name="requestType"
          label="Request Type"
          size="small"
          options={ticketSettings?.requestTypes?.filter(rt => rt?.issueType?._id === issueType?._id ) || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
        />
      </Grid>

      {/* Assignees */}
      <Grid item xs={12} sm={6} md={3} lg={2}>
        <RHFAutocomplete
          name="assignees"
          label="Assignee"
          size="small"
          options={activeSecurityUsers}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option?.name || ''}</li>
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
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
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
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
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
       </Grid>
    </Grid>
  </Stack>
  </FormProvider>
  );
}

export default memo(TicketTableController);
