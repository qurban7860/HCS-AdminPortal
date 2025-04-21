import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import { useWatch, useFormContext, useFieldArray } from 'react-hook-form';

import Iconify from '../iconify';
import { RHFSelect, RHFTextField } from '../hook-form';
import ToolOperationsSection from './ToolOperationsSection';

const ComponentAccordian = ({
  component,
  index,
  handleAccordionChange,
  expanded,
  handleDuplicateComponent,
  handleDeleteConfirm,
}) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  });

  const currentComponentLabel = useWatch({ control, name: `components.${index}.label` });
  const currentComponentOperations = useWatch({ control, name: `components.${index}.operations` });

  const csvVersion = watch('csvVersion');
  const unitOfLength = watch('unitOfLength');
  const showOptionalFields = csvVersion === '2.0';

  const componentErrors = errors.components?.[index];
  const hasErrors = !!componentErrors;

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

  return (
    <Accordion
      key={component.id}
      expanded={expanded === component.id}
      onChange={handleAccordionChange(component.id)}
      sx={{
        mb: 2,
        '&:before': {
          display: 'none',
        },
        boxShadow: 'none',
        border: '1px solid #e0e0e0',
        borderRadius: '4px !important',
        overflow: 'hidden',
      }}
    >
      <AccordionSummary
        expandIcon={<Iconify icon="mdi:chevron-down" width={25} />}
        sx={{
          bgcolor: '#f5f5f5',
          '&.Mui-expanded': {
            minHeight: 48,
            borderBottom: '1px solid #e0e0e0',
          },
        }}
      >
        <Grid container spacing={2} alignItems="center">
          <Grid item xs>
            <Typography variant="subtitle1">
              {currentComponentLabel}
              {/* {hasErrors && (
              <Typography
                component="span"
                color="error"
                sx={{
                  ml: 1,
                }}
              >
                (Has Errors)
              </Typography>
            )} */}
            </Typography>
          </Grid>
          <Grid item>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDuplicateComponent(index);
              }}
              sx={{
                mr: 1,
              }}
            >
              <Iconify icon="mdi:content-copy" width={15} />
            </IconButton>
            <IconButton
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDeleteConfirm(index);
              }}
            >
              <Iconify icon="mdi:delete" width={15} />
            </IconButton>
          </Grid>
        </Grid>
      </AccordionSummary>
      <AccordionDetails sx={{ p: 3 }}>
        {/* {hasErrors && (
        <Alert
          severity="error"
          sx={{
            mb: 2,
          }}
        >
          Please correct the errors below before saving
        </Alert>
      )} */}
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <RHFTextField
              fullWidth
              required
              label="Label"
              name={`components.${index}.label`}
              // error={!!componentErrors?.label}
              // helperText={componentErrors?.label}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RHFSelect
              select
              fullWidth
              required
              label="Label Direction"
              name={`components.${index}.labelDirection`}
              // error={!!componentErrors.labelDirection}
              // helperText={componentErrors.labelDirection}
            >
              <MenuItem value="LABEL_NRM">LABEL_NRM (Normal)</MenuItem>
              <MenuItem value="LABEL_INV">LABEL_INV (Inverted)</MenuItem>
            </RHFSelect>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RHFTextField
              fullWidth
              required
              type="number"
              label="Length"
              name={`components.${index}.length`}
              // error={!!componentErrors.length}
              // helperText={componentErrors.length}
              InputProps={{
                endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RHFTextField
              fullWidth
              required
              type="number"
              label="Quantity"
              name={`components.${index}.quantity`}
              // error={!!componentErrors.quantity}
              // helperText={componentErrors.quantity}
            />
          </Grid>
          {showOptionalFields && (
            <>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  select
                  fullWidth
                  label="Profile Shape"
                  required
                  name={`components.${index}.profileShape`}
                >
                  <MenuItem value="C">Lipped (C)</MenuItem>
                  <MenuItem value="U">Unlipped (U)</MenuItem>
                  <MenuItem value="R">Ribbed (R)</MenuItem>
                </RHFTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  fullWidth
                  type="number"
                  label="Web Width"
                  required
                  name={`components.${index}.webWidth`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  fullWidth
                  type="number"
                  label="Flange Height"
                  required
                  name={`components.${index}.flangeHeight`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  fullWidth
                  type="number"
                  label="Material Thickness"
                  required
                  name={`components.${index}.materialThickness`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  fullWidth
                  label="Material Grade"
                  name={`components.${index}.materialGrade`}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Dimensions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <RHFTextField
                      fullWidth
                      required
                      type="number"
                      label="Start X"
                      name={`components.${index}.dimensions.startX`}
                      // error={!!componentErrors['dimensions.startX']}
                      // helperText={componentErrors['dimensions.startX']}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <RHFTextField
                      fullWidth
                      required
                      type="number"
                      label="Start Y"
                      name={`components.${index}.dimensions.startY`}
                      // error={!!componentErrors['dimensions.startY']}
                      // helperText={componentErrors['dimensions.startY']}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <RHFTextField
                      fullWidth
                      required
                      type="number"
                      label="End X"
                      name={`components.${index}.dimensions.endX`}
                      // error={!!componentErrors['dimensions.endX']}
                      // helperText={componentErrors['dimensions.endX']}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6} sm={3}>
                    <RHFTextField
                      fullWidth
                      required
                      type="number"
                      label="End Y"
                      name={`components.${index}.dimensions.endY`}
                      // error={!!componentErrors['dimensions.endY']}
                      // helperText={componentErrors['dimensions.endY']}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                        ),
                      }}
                    />
                  </Grid>
                </Grid>
              </Grid>
            </>
          )}
        </Grid>
        <Box sx={{ mt: 4 }}>
          <Divider sx={{ my: 2 }} />
          <ToolOperationsSection
            componentId={component.id}
            operations={currentComponentOperations}
            componentIndex={index}
            // onOperationsChange={(operations) =>
            //   handleComponentChange(component.id, 'operations', operations)
            // }
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
};

ComponentAccordian.propTypes = {
  component: PropTypes.object.isRequired,
  index: PropTypes.number.isRequired,
  handleAccordionChange: PropTypes.func.isRequired,
  expanded: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),
  handleDeleteConfirm: PropTypes.func,
  handleDuplicateComponent: PropTypes.func,
};

export default ComponentAccordian;
