import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { Box, Button, Chip, Divider,Grid,Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { addDrawing, setDrawingAddFormVisibility } from '../../redux/slices/products/drawing';
import { setMachineTab } from '../../redux/slices/products/machine';
import MenuPopover from '../menu-popover/MenuPopover';
import ConfirmDialog from '../confirm-dialog';
import { PATH_MACHINE } from '../../routes/paths';

export default function AlreadyExistMenuPopover({ open, onClose, fileFound }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  const { machine } = useSelector((state) => state.machine);
  const [selected, setSelected] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  
  const attachDrawing = async () => {
    
    /* eslint-disable */
    let data = {
        machine: machine?._id,
        documentId: selected?.version?.document?._id,
        isActive:true
    };

    /* eslint-disable */
    if(fileFound?.machine){
      data.machine = fileFound?.machine;
    }

    try {
        await dispatch(addDrawing(data));
        await navigate(PATH_MACHINE.machines.view(data?.machine));
        await dispatch(setDrawingAddFormVisibility(false));
        await dispatch(setMachineTab('drawings'));
        enqueueSnackbar('Document Attached Successfully');
    } catch (error) {
        enqueueSnackbar(error, {variant: 'error'});
        console.error( error);
    };
  }

  return (
    <>
      <MenuPopover open={open} onClose={onClose} arrow="bottom-left" sx={{ p:0, maxWidth: '900px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', p:2 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle2">Documents found against this file</Typography>
            <Divider sx={{ borderStyle: 'solid', my:0.5 }} />
            {fileFound?.documentFiles?.map((file, index) => (
              <Grid display="inline-flex" p={0.1}>
                <Chip
                  key={index}
                  label={file?.version?.document?.displayName || file?.version?.document?.name}
                  size="small"
                  sx={{color: 'primary.main'}}
                  clickable
                  onClick={()=> {
                    setOpenConfirm(true);
                    setSelected(file);
                  }}
                />
              </Grid>
            ))}
          </Box>
        </Box>
      </MenuPopover>

      <ConfirmDialog
        open={openConfirm}
        onClose={()=> setOpenConfirm(false)}
        title={fileFound?.machine || machine?._id?'Are you sure?':'Machine not selected'}
        content={fileFound?.machine || machine?._id?'The selected document will be attached to this machine as a drawing':'Please select machine to perform this action'}
        action={
          <> 
            {(fileFound?.machine || machine?._id) &&
              <Button variant="contained" color="error" onClick={attachDrawing}>Attach</Button>
            }
          </>
        }
        SubButton="Cancel"
      />
    </>
  );
}
AlreadyExistMenuPopover.propTypes = {
  open: PropTypes.object,
  onClose: PropTypes.func,
  fileFound:PropTypes.object
};
