import { memo, useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types';
import { Box, Card, Grid, Stack, Typography, Container, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';

import { getActiveMachineServiceParams } from '../../../redux/slices/products/machineServiceParams';
import FormProvider, { RHFTextField, RHFSwitch, RHFAutocomplete} from '../../../components/hook-form';
import useResponsive from '../../../hooks/useResponsive';
import { useSnackbar } from '../../../components/snackbar';
import { CheckParamSchema } from '../../schemas/machine';
import ViewFormEditDeleteButtons from '../../components/ViewForms/ViewFormEditDeleteButtons';
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import CollapsibleCheckedItemRow from './CollapsibleCheckedItemRow'

const CheckItemTable = ({ checkParams, setCheckParams, onSubmitTable }) => {

    const isMobile = useResponsive('down', 'sm');
    const dispatch = useDispatch();
    const { enqueueSnackbar } = useSnackbar();

    const { activeMachineServiceParams } = useSelector((state) => state.machineServiceParam);
    const [checkParamNumber, setCheckParamNumber]= useState(0);
    const [checkParam, setCheckParam] = useState({});

    useEffect(() => {
        dispatch(getActiveMachineServiceParams());
      }, [dispatch]);

      const defaultValues = useMemo(
        () => ({

          // Check Params
          paramListTitle: '',
          paramList : [],

        }),
        // eslint-disable-next-line react-hooks/exhaustive-deps
        []
      );

      const methods = useForm({
        resolver: yupResolver(CheckParamSchema),
        defaultValues,
      });

      const {
        reset,
        watch,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
      } = methods;

      const { paramListTitle } = watch();


      const handleInputChange = (event) => {
        const { name, value } = event.target;
        const updatedCheckParam = {
          ...checkParam,
          [name]: value,
        };
        setCheckParam(updatedCheckParam);
      };


  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };


  const handleListDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = [...checkParams];
    const [draggedRow] = updatedCheckParam.splice(draggedIndex, 1);
    updatedCheckParam.splice(index, 0, draggedRow);
    setCheckParams(updatedCheckParam); 
    if(draggedIndex > checkParamNumber && index <= checkParamNumber ){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)
    }else if(draggedIndex < checkParamNumber && index >= checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber - 1)
    }else if(Number(draggedIndex) === checkParamNumber && index > checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber + 1)
    }else if(Number(draggedIndex) === checkParamNumber && index < checkParamNumber){
      setCheckParamNumber(prevCheckParamNumber => prevCheckParamNumber - 1)
    }
  };

  const handleListDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };

  const handleDrop = (e, index) => {
    const draggedIndex = e.dataTransfer.getData('index');
    const updatedCheckParam = {...checkParam};
    const [draggedRow] = updatedCheckParam.paramList.splice(draggedIndex, 1);
    updatedCheckParam.paramList.splice(index, 0, draggedRow);
    setCheckParam(updatedCheckParam); 
  };

  const handleRowDelete = (index) => {
    try {
      setCheckParam((prevCheckParam) => {
        const updatedRow = {...prevCheckParam};
        updatedRow.paramList.splice(index, 1);
        enqueueSnackbar('Deleted success!');
        return updatedRow;
      });
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: 'error' });
      console.error(err.message);
    }
  };

  const toggleEdit = (index) => {setCheckParam(checkParams[index]); setCheckParamNumber(index); setValue('paramListTitle',checkParams[index]?.paramListTitle) };

  const deleteIndex = (indexToRemove) => {
    try {
      const newArray =  checkParams.filter((_, index) => index !== indexToRemove);
      setCheckParams(newArray);
      enqueueSnackbar('Deleted success!');
    } catch (err) {
      enqueueSnackbar('Delete failed!', { variant: `error` });
      console.error(err.message);
    }
  };

  const saveCheckParam = (prevCheckParamNumber) =>{

    try {
      checkParam.paramListTitle = paramListTitle
      setValue('paramListTitle','')
      const updatedCheckParam = [...checkParams]; 
      if(prevCheckParamNumber > checkParams.length-1) {
        updatedCheckParam.splice(prevCheckParamNumber, 0, checkParam);
        setCheckParams(updatedCheckParam);
        setCheckParamNumber(() => prevCheckParamNumber + 1) 
      enqueueSnackbar('Saved success!');
      }else if(prevCheckParamNumber < checkParams.length-1){
        updatedCheckParam[prevCheckParamNumber]= checkParam;
        setCheckParams(updatedCheckParam);
        setCheckParamNumber(checkParams.length) 
        enqueueSnackbar('Updated success!');
      }
      else if(prevCheckParamNumber === checkParams.length-1){
        updatedCheckParam[prevCheckParamNumber]= checkParam;
        setCheckParams(updatedCheckParam);
        setCheckParamNumber(checkParams.length) 
        enqueueSnackbar('Updated success!');
      }
      setCheckParam({})
    } catch (err) {
      enqueueSnackbar('Save failed!', { variant: `error` });
      console.error(err.message);
    }
  }

  return (
      <Card sx={{ p: 3 }}>
                    <Stack spacing={2}>
                    <Typography variant="overline" fontSize="1rem" sx={{ color: 'text.secondary' }}>
                      Check Items
                    </Typography>
                {/* <FormProvider methods={methods} onSubmit={handleSubmit(onSubmitTable)}> */}
                <form onSubmit={handleSubmit(onSubmitTable)}>
                    <RHFTextField name="paramListTitle" label="Item List Title*" />
                      <RHFAutocomplete
                        multiple
                        name="paramList"
                        label="Select Items"
                        value={checkParam?.paramList || []}
                        options={activeMachineServiceParams}
                        isOptionEqualToValue={(option, value) => option._id === value._id}
                        getOptionLabel={(option) => `${option.name ? option.name : ''}`}
                        renderOption={(props, option) => (
                          <li {...props} key={option._id}>{`${option.name ? option.name : ''}`}</li>
                        )}
                        onChange={(event, newValue) => {
                          const updatedEvent = { target: { name: "paramList", value: newValue }};
                          handleInputChange(updatedEvent, checkParamNumber);
                          event.preventDefault();
                        }}
                        renderTags={(value, getTagProps) => ''}
                      /> 
                      <Grid item md={12} >
                      <Card sx={{ minWidth: 250, width: '100%', minHeight:75 , my:3, border:'1px solid'}}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell size='small' align='left'>Checked Items</TableCell>
                              <TableCell size='small' align='right'>{`  `}</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {checkParam?.paramList?.length > 0 && (checkParam?.paramList?.map((row, index) => (
                              <TableRow
                                key={row.id}
                                draggable
                                onDragStart={(e) => handleDragStart(e, index)}
                                onDragOver={(e) => e.preventDefault()}
                                onDrop={(e) => handleDrop(e, index)}
                              >
                                <TableCell size='small' align='left' ><b>{`${index+1}). `}</b>{`${row.name}`}</TableCell>
                                <TableCell size='small' align='right'>
                                <ViewFormEditDeleteButtons onDelete={() => handleRowDelete(index)} sm/>
                                </TableCell>
                              </TableRow>
                            ))) }
                          </TableBody>
                        </Table>
                        <Grid item md={12} display='flex' justifyContent='center' >
                            {checkParam?.paramList?.length === 0 && (<Typography variant="subtitle2" sx={{ mt:0.7}}>No Checked Items selected</Typography>)}
                          </Grid>
                      </Card>
                      {/* <Grid item md={12} display="flex" justifyContent="flex-end" > */}
                            <AddFormButtons isSubmitting={isSubmitting} />
                        {/* <Button
                          disabled={(!checkParam?.paramList?.length ?? 0) || (!paramListTitle ?? '') }
                          onClick={()=>saveCheckParam(checkParamNumber)}
                          fullWidth={ isMobile }
                          variant="contained" color='primary' sx={{ ...(isMobile && { width: '100%' })}}
                        >Save</Button> */}
                      </Grid>
</form>

                    {/* </Grid> */}
      {/* </FormProvider> */}
                    <Stack sx={{ minWidth: 250,  minHeight:75 }}>
                    <TableContainer >
                      <Table>
                        <TableBody>
                          {checkParams.map((value, index) =>( typeof value?.paramList?.length === 'number' &&
                          <CollapsibleCheckedItemRow value={value} index={index} toggleEdit={toggleEdit} deleteIndex={deleteIndex} handleListDragStart={handleListDragStart} handleListDrop={handleListDrop} />
                          ))}
                      </TableBody>
                      </Table>
                      </TableContainer>
                      </Stack>
                    </Stack>
                  </Card>
  )
}

export default memo(CheckItemTable)

CheckItemTable.propTypes = {
    checkParams: PropTypes.array.isRequired,
    setCheckParams: PropTypes.func.isRequired,
    onSubmitTable: PropTypes.func.isRequired,
};