import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useState } from 'react';
import { Grid, Dialog, DialogContent, DialogTitle, Divider, DialogActions, Button, TableContainer, TableBody, TableRow, TableCell, Table, IconButton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { Box } from '@mui/system';
import { setConnectedMachineAddDialog, setNewConnectedMachines } from '../../redux/slices/products/machine';
import { PATH_CRM } from '../../routes/paths';
import DialogLink from './DialogLink';
import FormLabel from '../DocumentForms/FormLabel';
import ViewFormField from '../ViewForms/ViewFormField';
import ViewPhoneComponent from '../ViewForms/ViewPhoneComponent';
import FormProvider from '../hook-form/FormProvider';
import { RHFAutocomplete, RHFTextField } from '../hook-form';
import TableCard from '../ListTableTools/TableCard';
import { TableHeadCustom } from '../table';
import IconTooltip from '../Icons/IconTooltip';
import Iconify from '../iconify';
import IconButtonTooltip from '../Icons/IconButtonTooltip';
import uuidv4 from '../../utils/uuidv4';

function ConnectedMachineAddDialog({activeCategories, activeMachineModels}) {

  const TABLE_HEAD = [
    { id: 'SerialNo', label: 'Serial Number', align: 'left' },
    { id: 'Name', label: 'Name', align: 'left' },
    { id: 'Category', label: 'Category', align: 'left' },
    { id: 'Model', label: 'Model', align: 'left' },
    { id: 'Action', label: '', align: 'left' },
  ];

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();
  const [newMachines, setNewMachines] = useState([]);
  const [serialNoError, setSerialNoError] = useState('');

  const { connectedMachineAddDialog, isLoading } = useSelector((state) => state.machine);
  
  const handleConnectedMachineAddDialog = () => {
    dispatch(setConnectedMachineAddDialog(false));
  }
  
  const connectedMachineSchema = Yup.object().shape({
    serialNo: Yup.string().max(6).required().label('Serial Number'),
    name: Yup.string().max(250),
    machineModel: Yup.object().shape({name: Yup.string()}).nullable(),
  });

  const methods = useForm({
    resolver: yupResolver(connectedMachineSchema),
    defaultValues: {
      serialNo: '',
      name: '',
      category: null,
      machineModel: null
    },
  });

  const {
    reset,
    handleSubmit,
    watch,
    setValue,
    formState: { isSubmitting, errors},
  } = methods;
  
  const {
    category,
    machineModel,
  } = watch();

  
  useEffect(() => {
    reset();
  }, [reset, newMachines]);
  
  const handleAdd = async (data) => {
     const isMachineExists = newMachines.some(
      (machine) => machine.serialNo === data.serialNo
    );

    if (!isMachineExists) {
      const newMachineWithId = { ...data, _id: uuidv4() };
      setNewMachines((prevMachines) => [newMachineWithId, ...prevMachines]);
      setSerialNoError(''); // Reset serial number error
    } else {
      setSerialNoError('Duplicate Serial number !'); // Set serial number error
    }
  };

  const handleRemove = (index) => {
    setNewMachines(prevMachines => {
      const updatedMachines = [...prevMachines];
      updatedMachines.splice(index, 1);
      return updatedMachines;
    });
  };

  const handleSave = async () => {
    dispatch(setNewConnectedMachines(newMachines));
    handleConnectedMachineAddDialog();
    reset();
  }

  return (
    <Dialog
      maxWidth="lg"
      open={connectedMachineAddDialog}
      onClose={handleConnectedMachineAddDialog}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle variant='h3' sx={{pb:1, pt:2}}>New Connection Machine</DialogTitle>
      <Divider orientation="horizontal" flexItem />
      <DialogContent dividers sx={{pt:3}}>
        <FormProvider methods={methods} onSubmit={handleSubmit(handleAdd)} mb={5}>
          <Box rowGap={2} columnGap={2} display="grid"
            gridTemplateColumns={{ xs: 'repeat(1, 1fr)', sm: 'repeat(1, 2fr 6fr)', md: 'repeat(1, 1fr 5fr)' }}
          >
            <RHFTextField name="serialNo" label="Serial No.*"
              onChange={(e) => {
                setValue('serialNo', e.target.value); // Update form control value
                setSerialNoError(''); // Clear error on change
              }}
              error={errors.serialNo || !!serialNoError} helperText={errors.serialNo?.message || serialNoError} />
            {/* <RHFTextField name="serialNo" label="Serial No.*"  /> */}
            <RHFTextField name="name" label="Name" />
          </Box>
          <Box rowGap={2} columnGap={2} sx={{mt:2}} display="grid" gridTemplateColumns={{ xs: 'repeat(2, 1fr)', sm: 'repeat(2, 1fr)' }} >
              <RHFAutocomplete 
                name="category"
                label="Machine Category"
                options={activeCategories}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option.name || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                onChange={(event, newValue) =>{
                    if(newValue){
                      setValue('category',newValue)
                      if(newValue?._id !== machineModel?.category?._id){
                        setValue('machineModel',null)
                      }
                    } else {
                      setValue('machineModel',null )
                      setValue('category',null )
                    }
                  }
                }
              />

              <RHFAutocomplete 
                name="machineModel"
                label="Machine Model"
                options={activeMachineModels.filter(el => (el.category && category) ? el.category._id === category._id : !category)}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                getOptionLabel={(option) => `${option.name || ''}`}
                renderOption={(props, option) => ( <li {...props} key={option?._id}>{`${option.name || ''}`}</li> )}
                onChange={(event, newValue) =>{
                  if(newValue){
                    setValue('machineModel',newValue)
                    if(!category ){
                      setValue('category',newValue?.category)
                    }
                  } else {
                    setValue('machineModel',null )
                  }
                }
              }
            />
            
          </Box>
          <Grid item display='flex' justifyContent='flex-end' columnGap={2} sx={{mt:2.5}}>
            <Button variant='contained' type='submit'>Add</Button>
          </Grid>
          {newMachines?.length > 0 &&
            // <TableCard>
              <TableContainer sx={{border:'1px solid #dce0e4', borderRadius:'10px', mt:2}}>
              <Table size="small">
                <TableHeadCustom headLabel={TABLE_HEAD} />
                <TableBody>
                  {newMachines.map((row, index) => (
                    row ? (
                      <TableRow key={index}>
                        <TableCell>{row?.serialNo}</TableCell>
                        <TableCell>{row?.name}</TableCell>
                        <TableCell>{row?.category?.name}</TableCell>
                        <TableCell>{row?.machineModel?.name}</TableCell>
                        <TableCell sx={{width:2}}>
                          <IconButtonTooltip 
                            onClick={()=>  handleRemove(index)}  
                            color='#ed0707' 
                            icon='lets-icons:dell' 
                            title='Remove' 
                            sx={{p:0, minWidth:'30px', border:'none'}} 
                            placement='left'
                            />
                        </TableCell>
                      </TableRow>
                    ) : null
                  ))}
                </TableBody>
              </Table>
              </TableContainer>
            // </TableCard>
          }
        </FormProvider>
      </DialogContent>
      <DialogActions>
        <Button variant='outlined' onClick={handleConnectedMachineAddDialog}>Cancel</Button>
        <Button variant='contained' onClick={handleSave}>Save</Button>
      </DialogActions>
    </Dialog>
  );
}

ConnectedMachineAddDialog.propTypes = {
  activeCategories: PropTypes.array,
  activeMachineModels: PropTypes.array,
};


export default ConnectedMachineAddDialog;
