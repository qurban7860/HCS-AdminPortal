import { useMemo, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Container ,Card, Grid, Stack, Button, FormHelperText, Checkbox, Typography } from '@mui/material';
// routes
import { useNavigate, useParams } from 'react-router-dom';
import { PATH_MACHINE } from '../../../routes/paths';
// slice
import AddFormButtons from '../../../components/DocumentForms/AddFormButtons';
import { addMachineErpLogRecord } from '../../../redux/slices/products/machineErpLogs';
// components
import { useSnackbar } from '../../../components/snackbar';
  import FormProvider from '../../../components/hook-form';
// constants
import CodeMirror from '../../../components/CodeMirror/JsonEditor';
import Iconify from '../../../components/iconify/Iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import { HeaderArr, unitHeaders } from './Index';
import MachineTabContainer from '../util/MachineTabContainer';
import { isValidDate } from '../../../utils/formatTime';


// ----------------------------------------------------------------------

export default function MachineLogsAddForm() {

  const { machine } = useSelector((state) => state.machine);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { machineId } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const [ error, setError ] = useState(false);

  const [selectedCheckbox, setSelectedCheckbox] = useState(null);

  const handleCheckboxChange = (index) => {
    setSelectedCheckbox(index === selectedCheckbox ? null : index);
  };

  const checkboxes = [
    { label: 'Skip', value: 'skip' },
    { label: 'Update', value: 'update' },
  ];

  const defaultValues = useMemo(
    () => ({
      erpLog: '',
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const methods = useForm({
    // resolver: yupResolver(AddInniSchema),
    defaultValues,
  });

  const {
    reset,
    watch,
    setValue,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const { erpLog } = watch();

  useEffect(() => {
    if(error) setError(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[ erpLog ]);

  const onSubmit = async (data) => {
    try{
      
        const csvData = JSON.parse(data.erpLog)
          try {
            if(Array.isArray(csvData) && csvData?.length > 5000 ){
              setError(true)
            } else if( Array.isArray(csvData) &&  !csvData?.some(item => item && ( item?.date ))){
              enqueueSnackbar("date is Missing!", { variant: `error` });
            } else if( Array.isArray(csvData) && csvData?.some(item => !isValidDate( item?.date ))){
              enqueueSnackbar("Invalid Date Format!", { variant: `error` });
            } else if( !Array.isArray(csvData) && typeof csvData === 'object' && !('date' in csvData )){
                enqueueSnackbar("date is Missing!", { variant: `error` });
            } else if( !Array.isArray(csvData) && typeof csvData === 'object' && !isValidDate( csvData.date )){
                enqueueSnackbar("Invalid Date Format!", { variant: `error` });
            } else {
              setError(false);
              // ADD Log
              const action = {}
              if( selectedCheckbox === 0 ){
                action.skipExistingRecords = true;
              } else if( selectedCheckbox){
                action.updateExistingRecords = true;
              }
              await dispatch(addMachineErpLogRecord(machineId, machine?.customer?._id, csvData, action));
              await enqueueSnackbar(`Log's uploaded successfully!`);
              await navigate(PATH_MACHINE.machines.logs.root(machineId))
              await reset();
            }
          } catch (err) {
            enqueueSnackbar(err, { variant: `error` });
            console.error(err);
          }
    }catch(err){
      enqueueSnackbar('JSON validation Failed!',{ variant: `error` });
    }
  };

  const txtToJson = async (data) => {
    const csvData = [];
    try {
      if (typeof data === 'string' && data.trim() !== '') {
        const rows = data.split("\n");
        rows?.map((row ) => {
          const columns = row.split(",");
          if (Array.isArray(columns) && columns.length > 12) {
            const Obj = {};
            HeaderArr.map((header, index) => {
              if (unitHeaders.includes(header)) {
                const newArr = columns[index].split(' ');
                Obj[[header]] = newArr[0];
                // Obj[[header, 'Unit']] = newArr[1];
              } else {
                Obj[[header]] = columns[index];
              }
              return null;
            });
            csvData.push(Obj);
          }
          return null;
        });
      }
    } catch (e) {
      enqueueSnackbar( "Found error While Converting text to json!",{ variant: `error` } )
    }
    return csvData;
  };  

  // TEXT FILE READER
const readFile = (selectedFile) => 
  new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
          const content = e.target.result;
          resolve(content);
      };
      reader.onerror = (err) => {
          console.log(err);
        enqueueSnackbar( "Found error while Reading File!",{ variant: `error` } )
      };
      reader.readAsText(selectedFile);
    });
    // STRINGIFY JSON FORMATED FILE

  // FILE HANDLER FUNCTION
  const handleFileChange = async (event) => {
    let selectedFile 
    if (event.target.files.length === 1) {
      selectedFile = await readFile(event.target.files[0]);
      txtToJson(selectedFile).then(result => {
        if(result.length > 0) {
        const stringifyJSON = JSON.stringify(result, null, 2)
          setValue('erpLog', stringifyJSON )
        } else{
          enqueueSnackbar( "No Data Found to Import!",{ variant: `error` } )
          setValue('erpLog', '' )
        }
      }).catch(err => {
        enqueueSnackbar( "Found error While Converting text to json!",{ variant: `error` } )
      });
    } else if (event.target.files.length > 1) {
      selectedFile = await Promise.all(Array.from(event.target.files).map(file => readFile(file)));
        const multipleSelectedFiles = [];
        await Promise.all(Array.from(selectedFile.map((file) =>{
          txtToJson(file).then(result => {
            multipleSelectedFiles.push(...result)
            }).catch(err => {
              enqueueSnackbar( "Found error While Converting text to json!",{ variant: `error` } )
            });
            return null;
        })))
        const stringifyJSON = JSON.stringify(multipleSelectedFiles, null, 2)
        setValue('erpLog', stringifyJSON )
    }
    return null
  };

const HandleChangeIniJson = async (e) => { setValue('erpLog', e) }

const toggleCancel = () => navigate(PATH_MACHINE.machines.logs.root(machineId));

  return (
    <Container maxWidth={false} >
      <MachineTabContainer currentTabValue='logs' />
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Grid >
                  <Grid item md={12} sx={{ display: 'flex', justifyContent: 'flex-end' }} >
                      <Button variant="contained" component="label" startIcon={<Iconify icon={ICONS.UPLOAD_FILE.icon} />} sx={{ mb:1 }} > Import Files  
                        <input type="file" accept='.txt' multiple hidden onChange={handleFileChange} /> 
                      </Button>
                  </Grid>
                  <CodeMirror value={erpLog} HandleChangeIniJson={HandleChangeIniJson}/>     
                  <Grid sx={{ display: 'flex', alignItems: 'center' }} >
                      <Typography variant="subtitle2" >Action to perform on existing records?  </Typography>
                        {checkboxes.map((checkbox, index) => (
                          <Typography variant="subtitle2" sx={{ml: 2}} >{checkbox.label}
                            <Checkbox
                              key={index}
                              checked={index === selectedCheckbox}
                              onChange={() => handleCheckboxChange(index)}
                              label={checkbox.label}
                            />
                          </Typography>
                        ))}
                  </Grid>           
                </Grid>
                { error && <FormHelperText error >Json Size should not be greater than 5000 Objects.</FormHelperText> }
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
    </Container>
  );
}
