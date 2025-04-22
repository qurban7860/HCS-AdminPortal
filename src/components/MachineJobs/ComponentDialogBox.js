import {
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Slide,
  Typography,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import ToolOperationsSection from './ToolOperationsSection';
import { RHFNumericField, RHFSelect, RHFTextField } from '../hook-form';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ComponentDialogBox = ({ open, handleClose, componentId, componentIndex }) => {
  const {
    control,
    watch,
    formState: { errors },
  } = useFormContext();

    const { fields, append, remove } = useFieldArray({
      control,
      name: 'components',
    });

  const currentComponentLabel = useWatch({ control, name: `components.${componentIndex}.label` });
  const currentComponentOperations = useWatch({
    control,
    name: `components.${componentIndex}.operations`,
  });

  const csvVersion = watch('csvVersion');
  const unitOfLength = watch('unitOfLength');
  const showOptionalFields = csvVersion === '2.0';

  const componentErrors = errors.components?.[componentIndex];
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
    <Dialog open={open} TransitionComponent={Transition} fullWidth maxWidth='lg' onClose={handleClose}>
      <DialogTitle sx={{pb: 0}}>{`Component: ${currentComponentLabel || fields?.[componentIndex]?.label}`}</DialogTitle>
      <DialogContent sx={{ p: 3 }}>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6} md={4}>
            <RHFTextField
              fullWidth
              required
              label="Label"
              name={`components.${componentIndex}.label`}
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
              name={`components.${componentIndex}.labelDirection`}
              // error={!!componentErrors.labelDirection}
              // helperText={componentErrors.labelDirection}
            >
              <MenuItem value="LABEL_NRM">LABEL_NRM (Normal)</MenuItem>
              <MenuItem value="LABEL_INV">LABEL_INV (Inverted)</MenuItem>
            </RHFSelect>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RHFNumericField
              fullWidth
              required
              label="Length"
              name={`components.${componentIndex}.length`}
              // error={!!componentErrors.length}
              // helperText={componentErrors.length}
              InputProps={{
                endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <RHFNumericField
              fullWidth
              required
              allowDecimals={false}
              label="Quantity"
              name={`components.${componentIndex}.quantity`}
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
                  name={`components.${componentIndex}.profileShape`}
                >
                  <MenuItem value="C">Lipped (C)</MenuItem>
                  <MenuItem value="U">Unlipped (U)</MenuItem>
                  <MenuItem value="R">Ribbed (R)</MenuItem>
                </RHFTextField>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFNumericField
                  fullWidth
                  label="Web Width"
                  required
                  name={`components.${componentIndex}.webWidth`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFNumericField
                  fullWidth
                  label="Flange Height"
                  required
                  name={`components.${componentIndex}.flangeHeight`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFNumericField
                  fullWidth
                  label="Material Thickness"
                  required
                  name={`components.${componentIndex}.materialThickness`}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <RHFTextField
                  fullWidth
                  required
                  label="Material Grade"
                  name={`components.${componentIndex}.materialGrade`}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2" gutterBottom>
                  Dimensions
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={6} sm={3}>
                    <RHFNumericField
                      fullWidth
                      required
                      label="Start X"
                      name={`components.${componentIndex}.dimensions.startX`}
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
                    <RHFNumericField
                      fullWidth
                      required
                      label="Start Y"
                      name={`components.${componentIndex}.dimensions.startY`}
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
                    <RHFNumericField
                      fullWidth
                      required
                      label="End X"
                      name={`components.${componentIndex}.dimensions.endX`}
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
                    <RHFNumericField
                      fullWidth
                      required
                      label="End Y"
                      name={`components.${componentIndex}.dimensions.endY`}
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
            componentId={componentId}
            operations={currentComponentOperations}
            componentIndex={componentIndex}
            // onOperationsChange={(operations) =>
            //   handleComponentChange(component.id, 'operations', operations)
            // }
          />
        </Box>
      </DialogContent>
    </Dialog>
  );
};

ComponentDialogBox.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  componentId: PropTypes.string,
  componentIndex: PropTypes.number,
};

export default ComponentDialogBox;
