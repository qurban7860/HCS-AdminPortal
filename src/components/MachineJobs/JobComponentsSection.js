import PropTypes from 'prop-types';
import {
  Button,
  Grid,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';

import FormLabel from '../DocumentForms/FormLabel';
import { FORM_LABELS } from '../../constants/job-constants';
import Iconify from '../iconify';
import IconTooltip from '../Icons/IconTooltip';
import ComponentAccordian from './ComponentAccordian';
import ComponentTableRow from './ComponentTableRow';
import ComponentDialogBox from './ComponentDialogBox';

const JobComponentsSection = () => {
  const [expanded, setExpanded] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);

  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  const [currentComponentInfo, setCurrentComponentInfo] = useState({ index: null, id: null });
  const handleClickOpen = () => {
    setOpenComponentDialog(true);
  };

  const handleComponentDialogClose = () => {
    setOpenComponentDialog(false);
  };

  const { control } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'components',
  });

  const handleAddComponent = () => {
    const newComponentId = `${Date.now()}`;
    append({
      id: newComponentId,
      label: `Component ${fields.length + 1}`,
      labelDirection: 'LABEL_NRM',
      quantity: 1,
      length: 100,
      dimensions: {
        startX: 0,
        startY: 0,
        endX: 0,
        endY: 0,
      },
      operations: [],
      profileShape: '',
      webWidth: null,
      flangeHeight: null,
      materialThickness: null,
      materialGrade: '',
    });
    setCurrentComponentInfo({ index: fields.length, id: newComponentId });
    handleClickOpen();
  };

  const handleDuplicateComponent = (index) => {
    const component = fields[index];
    append({
      ...component,
      id: `${Date.now()}`,
      label: `${component.label} (Copy)`,
      operations: component.operations || [],
    });
  };

  const handleDeleteConfirm = (index) => {
    setComponentToDelete(String(index));
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (componentToDelete !== null) {
      remove(parseInt(componentToDelete, 10));
      setDeleteDialogOpen(false);
      setComponentToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setComponentToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
  };

  return (
    // <>
    <Box spacing={2} sx={{ my: 2 }}>
      <FormLabel content={FORM_LABELS.ADD_JOB.COMPONENTS} />
      {fields.length > 0 ? (
        <Box sx={{ mb: 2 }}>
          {/* <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
          Components
        </Typography> */}
          <TableContainer component={Paper} sx={{ maxHeight: 440, overflow: 'auto' }}>
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Label</TableCell>
                  <TableCell>Direction</TableCell>
                  <TableCell>Length / Quantity</TableCell>
                  <TableCell>Operations</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.map((component, index) => (
                  <ComponentTableRow
                    key={component.id}
                    component={component}
                    index={index}
                    setExpanded={setExpanded}
                    handleClickOpen={handleClickOpen}
                    setCurrentComponentInfo={setCurrentComponentInfo}
                    handleDeleteConfirm={handleDeleteConfirm}
                    handleDuplicateComponent={handleDuplicateComponent}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', my: 2 }}>
          <Typography variant="body2" color="text.secondary">
            No components added yet.
          </Typography>
        </Box>
      )}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mb: 2, mt: 1 }}>
        <Button
          variant="contained"
          size="small"
          onClick={handleAddComponent}
          startIcon={<Iconify icon="mdi:plus-circle-outline" />}
        >
          Add New Component
        </Button>
      </Box>
      {/* <Box sx={{ pt: 2, mb: 10 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, mt: 2 }}>
          Components Details
        </Typography>
        {fields.map((component, index) => (
          <ComponentAccordian
            key={component.id}
            component={component}
            index={index}
            handleAccordionChange={handleAccordionChange}
            expanded={expanded}
            handleDuplicateComponent={handleDuplicateComponent}
            handleDeleteConfirm={handleDeleteConfirm}
          />
        ))}
      </Box> */}
      <ComponentDialogBox
        open={openComponentDialog}
        handleClose={handleComponentDialogClose}
        componentId={currentComponentInfo.id}
        componentIndex={currentComponentInfo.index}
      />
      <Dialog open={deleteDialogOpen} onClose={handleDeleteCancel}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this component? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteCancel}>Cancel</Button>
          <Button onClick={handleDeleteConfirmed} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
    // </>
  );
};

JobComponentsSection.propTypes = {
  // onChange: PropTypes.func,
  // onDeleteComponent: PropTypes.func,
  // onAddComponent: PropTypes.func,
  // onDuplicateComponent: PropTypes.func,
};

export default JobComponentsSection;
