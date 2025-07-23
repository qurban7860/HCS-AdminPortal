import PropTypes from 'prop-types';
import { memo, useMemo } from 'react';
import { useSelector } from 'react-redux';
// @mui
import { Stack, Grid, TextField, InputAdornment, Button } from '@mui/material';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { ticketControllerSchema } from '../schemas/ticketSchema';
import FormProvider, { RHFAutocomplete } from '../../components/hook-form';
import RHFSwitchToggleButton from './RHFSwitchToggleButton';
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

    const defaultValues = useMemo(
      () => ({
        issueType: null,
        requestType: null,
        isResolved: false,
        statusType: null,
        status: [],
        priority: null,
      }),
      []
    );

  const methods = useForm({
    resolver: yupResolver(ticketControllerSchema),
    defaultValues,
    mode: 'onChange',
    reValidateMode: 'onChange'
  });

  const { setError, handleSubmit, watch, formState: { isSubmitting } } = methods;
  const { issueType, requestType, isResolved, statusType, status, priority } = watch();
    const onSubmit = async (data) => {
      try {
        await onReload({ 
          issueType: issueType?._id, 
          requestType: requestType?._id, 
          isResolved, 
          statusType: statusType?._id , 
          status: status?.map(s=>s?._id), 
          priority: priority?._id
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

  return (
  <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
    <Stack {...options}>
      <Grid container spacing={1} sx={{ display: 'flex', width: '100%' }} >
    <Grid container spacing={1} sx={{ display: 'flex' }} >
            {/* Open Switch */}
        <RHFSwitchToggleButton
          name="isResolved"
        />
      {/* Issue Type */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <RHFAutocomplete
          name="issueType"
          label="Issue Type"
          size="small"
          options={ticketSettings?.issueTypes || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
        />
      </Grid>

      {/* Request Type */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
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

      {/* Status Type */}
      <Grid item xs={12} sm={6} md={4} lg={2}>
        <RHFAutocomplete
          name="statusType"
          label="Status Type"
          size="small"
          options={ticketSettings?.statusTypes?.filter(st => st?.isResolved === isResolved ) || []}
          isOptionEqualToValue={(option, value) => option?._id === value?._id}
          getOptionLabel={(option) => option?.name}
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
        />
      </Grid>

      {/* Status (Multi) */}
      <Grid item xs={12} sm={6} md={6} lg={3}>
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
          renderOption={(props, option) => (
            <li {...props} key={option?._id}>{option?.name || ''}</li>
          )}
        />
      </Grid>

      {/* Priority */}
      <Grid item xs={12} sm={6} md={4} lg={1.5} >
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
