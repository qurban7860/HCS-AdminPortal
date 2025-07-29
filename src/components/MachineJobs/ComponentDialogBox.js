import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Slide,
  Typography,
  useTheme,
} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

import ToolOperationsSection from './ToolOperationsSection';
import { RHFNumericField, RHFSelect, RHFTextField } from '../hook-form';
import IconTooltip from '../Icons/IconTooltip';
import { jobComponentSchema } from '../../pages/schemas/jobSchema';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const ComponentDialogBox = ({
  open,
  handleClose,
  componentIndex,
  handleDeleteConfirm,
  csvVersion,
  unitOfLength,
  componentValues,
  handleSaveComponent,
}) => {
  const theme = useTheme();

  const methods = useForm({
    resolver: yupResolver(jobComponentSchema),
    context: { csvVersion },
    defaultValues: componentValues,
    values: componentValues,
  });

  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = methods;

  const currentComponentLabel = useWatch({ control, name: 'label' });
  const showOptionalFields = csvVersion === '2.0';

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

  const onSubmit = async (data) => {
    if (csvVersion === '1.0') {
      const {profileShape, webWidth, flangeHeight, materialThickness, materialGrade, position, ...rest}=data;
      handleSaveComponent(rest, componentIndex);
    } else {
      handleSaveComponent(data, componentIndex);
    }
    reset();
    handleClose();
  };

  const handleDialogClose = () => {
    reset();
    handleClose();
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      fullWidth
      maxWidth="lg"
      onClose={handleDialogClose}
    >
      <FormProvider {...methods} onSubmit={handleSubmit(onSubmit)}>
        <DialogTitle sx={{ pb: 1, pt: 2 }}>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6" gutterBottom>
              {`Component: ${currentComponentLabel}`}
            </Typography>
            {componentIndex >= 0 ? (
              <IconTooltip
                icon="mdi:delete"
                title="Delete Component"
                color={theme.palette.error.main}
                onClick={() => handleDeleteConfirm(componentIndex)}
              />
            ) : null}
          </Box>
        </DialogTitle>
        <Divider orientation="horizontal" flexItem />
        <DialogContent sx={{ p: 3, pt: 1 }}>
          <Grid container spacing={2} sx={{ mt: 2 }}>
            <Grid item xs={12} sm={6} md={showOptionalFields ? 9 : 6}>
              <RHFTextField
                fullWidth
                required
                label="Label"
                name="label"
                error={!!errors?.label}
                helperText={
                  errors?.label ||
                  'Unique identifier for this component (convention: [type]-[number], e.g., Sn-8)'
                }
              />
            </Grid>
            <Grid item xs={12} sm={6} md={showOptionalFields ? 3 : 3}>
              <RHFSelect
                select
                fullWidth
                required
                label="Label Direction"
                name="labelDirection"
                error={!!errors.labelDirection}
                helperText={errors?.labelDirection || 'Orientation of printed label'}
              >
                <MenuItem value="LABEL_NRM">LABEL_NRM (Normal)</MenuItem>
                <MenuItem value="LABEL_INV">LABEL_INV (Inverted)</MenuItem>
              </RHFSelect>
            </Grid>
            <Grid item xs={12} sm={6} md={showOptionalFields ? 3 : 1.5}>
              <RHFNumericField
                fullWidth
                required
                label="Length"
                name="length"
                error={!!errors.length}
                helperText={errors?.length || ''}
                InputProps={{
                  endAdornment: <InputAdornment position="end">{getUnitLabel()}</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={showOptionalFields ? 3 : 1.5}>
              <RHFNumericField
                fullWidth
                required
                allowDecimals={false}
                label="Quantity"
                name="quantity"
                error={!!errors.quantity}
                helperText={errors?.quantity || ''}
              />
            </Grid>
            {showOptionalFields && (
              <>
                <Grid item xs={12} sm={6} md={6}>
                  <RHFTextField
                    fullWidth
                    required
                    label="Material Grade"
                    name="materialGrade"
                    error={!!errors.materialGrade}
                    helperText={
                      errors?.materialGrade ||
                      'Material grade specification (e.g., G350, 350mpa, 80ksi)'
                    }
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <RHFTextField
                    select
                    fullWidth
                    label="Profile Shape"
                    required
                    name="profileShape"
                    error={!!errors?.profileShape}
                    helperText={errors?.profileShape || 'Profile section type'}
                  >
                    <MenuItem value="C">Lipped (C)</MenuItem>
                    <MenuItem value="U">Unlipped (U)</MenuItem>
                    <MenuItem value="R">Ribbed (R)</MenuItem>
                  </RHFTextField>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <RHFNumericField
                    fullWidth
                    label="Web Width"
                    required
                    name="webWidth"
                    error={!!errors?.webWidth}
                    helperText={errors?.webWidth || 'Width of the section web'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <RHFNumericField
                    fullWidth
                    label="Flange Height"
                    required
                    name="flangeHeight"
                    helperText={errors?.flangeHeight || 'Height of the section flange'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                  <RHFNumericField
                    fullWidth
                    label="Material Thickness"
                    required
                    name="materialThickness"
                    helperText={errors?.materialThickness || 'Thickness of the material'}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">{getUnitLabel()}</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box sx={{ display: 'flex', alignItems: 'flex-end', mb: 1 }}>
                    <Typography variant="subtitle2" gutterBottom>
                      Dimensions
                    </Typography>
                    <IconTooltip
                      icon="mdi:information-outline"
                      title="Start/End X,Y: Coordinates for drawing component in panel visualization"
                      color={theme.palette.info.light}
                      iconSx={{
                        border: 'none',
                        width: 25,
                        mb: 0.2,
                      }}
                    />
                  </Box>
                  <Grid container spacing={2}>
                    <Grid item xs={6} sm={3}>
                      <RHFNumericField
                        fullWidth
                        required
                        label="Start X"
                        name="position.startX"
                        // error={!!componentErrors['position.startX']}
                        // helperText={componentErrors['position.startX']}
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
                        name="position.startY"
                        // error={!!componentErrors['position.startY']}
                        // helperText={componentErrors['position.startY']}
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
                        name="position.endX"
                        // error={!!componentErrors['position.endX']}
                        // helperText={componentErrors['position.endX']}
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
                        name="position.endY"
                        // error={!!componentErrors['position.endY']}
                        // helperText={componentErrors['position.endY']}
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
            <Divider sx={{ my: 2 }}>
              <Typography variant="subtitle2">Tool Operations</Typography>
            </Divider>
            <ToolOperationsSection unitOfLength={unitOfLength} />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button variant="outlined" onClick={handleDialogClose}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit(onSubmit)} variant="contained">
            {componentIndex >= 0 ? 'Update Component' : 'Add Component'}
          </Button>
        </DialogActions>
      </FormProvider>
    </Dialog>
  );
};

ComponentDialogBox.propTypes = {
  open: PropTypes.bool,
  handleClose: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  handleSaveComponent: PropTypes.func,
  componentIndex: PropTypes.number,
  csvVersion: PropTypes.string,
  unitOfLength: PropTypes.string,
  componentValues: PropTypes.object,
};

export default ComponentDialogBox;
