import PropTypes from 'prop-types';
import {
  Button,
  TableContainer,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
} from '@mui/material';
import { useState } from 'react';

import FormLabel from '../DocumentForms/FormLabel';
import { FORM_LABELS } from '../../constants/job-constants';
import Iconify from '../iconify';
import ComponentTableRow from './ComponentTableRow';
import ComponentDialogBox from './ComponentDialogBox';
import ConfirmDialog from '../confirm-dialog';

const defaultComponent = (index = 0) => ({
  id: `${Date.now()}`,
  label: `Component ${index + 1}`,
  labelDirection: 'LABEL_NRM',
  quantity: 1,
  length: 1,
  position: {
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
  },
  operations: [
    {
      id: `${Date.now()}`,
      operationType: '',
      offset: 0,
    },
  ],
  profileShape: '',
  webWidth: null,
  flangeHeight: null,
  materialThickness: null,
  materialGrade: '',
});

const JobComponentsSection = ({
  csvVersion = '1.0',
  unitOfLength = 'MILLIMETRE',
  components = [],
  addComponent = () => {},
  removeComponent = () => {},
}) => {
  const [componentInDialog, setComponentInDialog] = useState(defaultComponent());
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [componentToDelete, setComponentToDelete] = useState(null);

  const [openComponentDialog, setOpenComponentDialog] = useState(false);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(-1);
  const handleClickOpen = () => {
    setOpenComponentDialog(true);
  };

  const handleComponentDialogClose = () => {
    setOpenComponentDialog(false);
  };

  const handleAddComponent = () => {
    setComponentInDialog({ ...defaultComponent(components.length) });
    setCurrentComponentIndex(-1)
    handleClickOpen();
  };

  const handleDuplicateComponent = (index) => {
    const component = components[index];
    addComponent({
      ...component,
      id: `${Date.now()}`,
      label: `${component.label} (Copy)`,
      operations: [...component.operations] || [],
    });
  };

  const handleComponentSave = (data, index) => {
    addComponent(data, index);
  };

  const handleDeleteConfirm = (index) => {
    setComponentToDelete(String(index));
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirmed = () => {
    if (componentToDelete !== null) {
      removeComponent(parseInt(componentToDelete, 10));
      setDeleteDialogOpen(false);
      setComponentToDelete(null);
      handleComponentDialogClose();
    }
  };

  const handleDeleteCancel = () => {
    setComponentToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    // <>
    <Box spacing={2} sx={{ my: 2 }}>
      <FormLabel content={FORM_LABELS.ADD_JOB.COMPONENTS} />
      {components.length > 0 ? (
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
                {components.map((component, index) => (
                  <ComponentTableRow
                    key={component.id}
                    component={component}
                    index={index}
                    unitOfLength={unitOfLength}
                    handleClickOpen={handleClickOpen}
                    setCurrentComponentIndex={setCurrentComponentIndex}
                    setComponentInDialog={setComponentInDialog}
                    handleDeleteConfirm={handleDeleteConfirm}
                    handleDuplicateComponent={handleDuplicateComponent}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      ) : (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100%',
            my: 2,
          }}
        >
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
      <ComponentDialogBox
        open={openComponentDialog}
        handleClose={handleComponentDialogClose}
        componentIndex={currentComponentIndex}
        handleDeleteConfirm={handleDeleteConfirm}
        handleSaveComponent={handleComponentSave}
        csvVersion={csvVersion}
        unitOfLength={unitOfLength}
        componentValues={componentInDialog}
      />
      <ConfirmDialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        title="Delete"
        content="Are you sure you want to Delete the component?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteConfirmed}>
            Delete
          </Button>
        }
      />
    </Box>
    // </>
  );
};

JobComponentsSection.propTypes = {
  csvVersion: PropTypes.string,
  unitOfLength: PropTypes.string,
  components: PropTypes.array,
  addComponent: PropTypes.func,
  removeComponent: PropTypes.func,
  // onChange: PropTypes.func,
  // onDeleteComponent: PropTypes.func,
  // onAddComponent: PropTypes.func,
  // onDuplicateComponent: PropTypes.func,
};

export default JobComponentsSection;
