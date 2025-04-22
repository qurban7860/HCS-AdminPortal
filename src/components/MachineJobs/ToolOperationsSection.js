import {
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useFieldArray, useFormContext } from 'react-hook-form';

import Iconify from '../iconify';
import { RHFSelect, RHFNumericField } from '../hook-form';
import ToolPositionsDiagram from './ToolPositionsDiagram';

const tools = [
  {
    value: 'SERVICE_HOLE',
    label: 'Service Hole',
  },
  {
    value: 'SWAGE',
    label: 'Swage',
  },
  {
    value: 'DIMPLE',
    label: 'Dimple',
  },
  {
    value: 'WEB',
    label: 'Web',
  },
  {
    value: 'NOTCH',
    label: 'Notch',
  },
  {
    value: 'COPE',
    label: 'Cope',
  },
  {
    value: 'LIP_CUT',
    label: 'Lip Cut',
  },
  {
    value: 'END_CUT',
    label: 'End Cut',
  },
];

const ToolOperationsSection = ({ operations, componentIndex }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: `components.${componentIndex}.operations`,
  });

  const operationErrors = errors.components?.[componentIndex]?.operations;

  const unitOfLength = watch('unitOfLength');
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
      tool: '',
      offset: 0,
    });
  };

  return (
    <Box>
      {fields?.length > 0 && (
        <>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              mb: 2,
            }}
          >
            <Typography variant="subtitle2">Tool Operations</Typography>
          </Box>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            {fields.map((operation, opIndex) => {
              const fieldErrors = operationErrors?.[opIndex];
              return (
                <Grid item xs={12} key={operation.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Grid container spacing={2} alignItems="flex-start">
                        <Grid item xs={12} sm={5}>
                          <RHFSelect
                            name={`components.${componentIndex}.operations.${opIndex}.tool`}
                            label="Tool"
                            helperText={fieldErrors?.tool?.message || ''}
                            required
                            sx={{ height: '100%' }}
                          >
                            {tools.map((tool) => (
                              <MenuItem key={tool.value} value={tool.value}>
                                {tool.label}
                              </MenuItem>
                            ))}
                          </RHFSelect>
                        </Grid>
                        <Grid item xs={12} sm={5}>
                          <RHFNumericField
                            fullWidth
                            required
                            label="Offset"
                            name={`components.${componentIndex}.operations.${opIndex}.offset`}
                            sx={{ height: '100%' }}
                            InputProps={{
                              endAdornment: (
                                <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid item xs={12} sm={2}>
                          <Box
                            sx={{
                              height: '100%',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'flex-end',
                              mt: 1.2,
                            }}
                          >
                            <IconButton color="error" onClick={() => remove(opIndex)}>
                              <Iconify icon="mdi:delete" width={30} />
                            </IconButton>
                          </Box>
                        </Grid>
                      </Grid>{' '}
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </>
      )}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          size="small"
          onClick={handleAddOperation}
          startIcon={<Iconify icon="mdi:plus-network-outline" />}
        >
          Add Tool Operation
        </Button>
      </Box>
      <ToolPositionsDiagram componentIndex={componentIndex} tools={tools} />
    </Box>
  );
};

ToolOperationsSection.propTypes = {
  operations: PropTypes.array,
  componentIndex: PropTypes.number,
};
export default ToolOperationsSection;
