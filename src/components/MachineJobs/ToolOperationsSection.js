import { Box, Button, Divider, Grid, IconButton, InputAdornment } from '@mui/material';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';

import Iconify from '../iconify';
import { RHFAutocomplete, RHFTextField } from '../hook-form';
import ToolPositionsDiagram from './ToolPositionsDiagram';

const ToolOperationsSection = ({ unitOfLength }) => {
  const { activeTools } = useSelector((state) => state.tool);

  const formattedActiveToolsList = useMemo(
    () =>
      activeTools?.map((tool) => ({
        value: tool._id,
        label: tool.name,
      })),
    [activeTools]
  );

  const {
    control,
    trigger,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `operations`,
  });

  const { length, operations } = watch();
  const operationErrors = errors?.operations;

  useEffect(() => {
    if (length) {
      operations?.forEach((_, index) => {
        trigger(`operations.${index}.offset`);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [length, trigger]);

  const getUnitLabel = () => {
    switch (unitOfLength) {
      case 'MILLIMETRE':
        return 'mm';
      case 'INCH':
        return 'in';
      default:
        return 'units';
    }
  };

  const handleAddOperation = () => {
    append({
      id: `${Date.now()}`,
      operationType: '',
      offset: 0,
    });
    setTimeout(() => {
      const dialogContent = document.querySelector('.MuiDialogContent-root');
      if (dialogContent) {
        dialogContent.scrollTo({
          top: dialogContent.scrollHeight,
          behavior: 'smooth',
        });
      }
    }, 100);
  };

  return (
    <Box>
      {fields?.length > 0 && (
        <>
          {/* <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">Tool Operations</Typography>
          </Box> */}
          <Grid container spacing={2}>
            {fields.map((operation, opIndex) => {
              const fieldErrors = operationErrors?.[opIndex];
              return (
                <Grid item xs={12} key={operation.id}>
                  <Grid container spacing={2} alignItems="flex-start">
                    <Grid item xs={12} sm={6}>
                      <RHFAutocomplete
                        name={`operations.${opIndex}.operationType`}
                        label="Tool"
                        helperText={fieldErrors?.operationType?.message || ''}
                        required
                        options={formattedActiveToolsList}
                        valueField="label"
                        isOptionEqualToValue={(option, value) => option.label === value}
                        renderOption={(props, option) => (
                          <li {...props} key={option?.value}>{`${
                            option.label ? option.label : ''
                          }`}</li>
                        )}
                      />
                    </Grid>
                    <Grid item xs={12} sm={5.5}>
                      <RHFTextField
                        fullWidth
                        required
                        label="Offset"
                        name={`operations.${opIndex}.offset`}
                        placeholder="e.g. 0.5, 1.2, 2.1"
                        helperText={
                          fieldErrors?.offset?.message ||
                          'Comma-separated offset values for same tool operation'
                        }
                        sx={{ height: '100%' }}
                        InputProps={{
                          endAdornment: (
                            <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                          ),
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={0.5}>
                      <Box
                        sx={{
                          height: '100%',
                          mt: 0.8,
                        }}
                      >
                        <IconButton color="error" onClick={() => remove(opIndex)}>
                          <Iconify icon="mdi:delete" width={30} />
                        </IconButton>
                      </Box>
                    </Grid>
                  </Grid>
                  {opIndex < fields.length - 1 && <Divider sx={{ my: 1 }} />}
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <ToolPositionsDiagram tools={formattedActiveToolsList} unitOfLength={unitOfLength} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', my: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddOperation}
          startIcon={<Iconify icon="mdi:plus-network-outline" />}
        >
          Add Tool Operation
        </Button>
      </Box>
    </Box>
  );
};

ToolOperationsSection.propTypes = {
  unitOfLength: PropTypes.string,
  // operations: PropTypes.array
};
export default ToolOperationsSection;
