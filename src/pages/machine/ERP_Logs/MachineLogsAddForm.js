import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
// form
import { useForm } from 'react-hook-form';
// @mui
import { Card, Grid, Stack, Button } from '@mui/material';
// slice
import AddFormButtons from '../../components/DocumentForms/AddFormButtons';
import { setAllVisibilityFalse, getMachineErpLogRecords, addMachineErpLogRecord } from '../../../redux/slices/products/machineErpLogs';
// components
import { useSnackbar } from '../../../components/snackbar';
import FormProvider from '../../../components/hook-form';
// constants
import CodeMirror from '../../components/CodeMirror/JsonEditor';
import Iconify from '../../../components/iconify/Iconify';
import { ICONS } from '../../../constants/icons/default-icons';
import { HeaderArr, unitHeaders } from './Index';

// ----------------------------------------------------------------------

export default function MachineLogsAddForm() {

  const { machine } = useSelector((state) => state.machine);
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

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

  const toggleCancel = () => { dispatch(setAllVisibilityFalse()) };
  const onSubmit = async (data) => {
    try{
        const csvData = JSON.parse(data.erpLog)
        try {
          await dispatch(addMachineErpLogRecord(machine?._id, machine?.customer?._id, csvData));
          reset();
          enqueueSnackbar(`Log's uploaded successfully!`);
          dispatch(setAllVisibilityFalse())
          dispatch(getMachineErpLogRecords(machine?._id))
        } catch (error) {
          enqueueSnackbar(error, { variant: `error` });
          console.error(error);
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
      reader.onerror = (error) => {
          console.log(error);
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
        console.log("result : ",result)
        if(result.length > 0) {
        const stringifyJSON = JSON.stringify(result, null, 2)
          setValue('erpLog', stringifyJSON )
        } else{
          enqueueSnackbar( "No Data Found to Import!",{ variant: `error` } )
          setValue('erpLog', '' )
        }
      }).catch(error => {
        enqueueSnackbar( "Found error While Converting text to json!",{ variant: `error` } )
      });
    } else if (event.target.files.length > 1) {
      selectedFile = await Promise.all(Array.from(event.target.files).map(file => readFile(file)));
        console.log("multiple selected Files : ",selectedFile)
        const multipleSelectedFiles = [];
        await Promise.all(Array.from(selectedFile.map((file) =>{
          txtToJson(file).then(result => {
            console.log("multiple Selected Files result : ",result)
            multipleSelectedFiles.push(...result)
            }).catch(error => {
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

  return (
      <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
        <Grid container>
          <Grid item xs={18} md={12} >
            <Card sx={{ p: 3 }}>
              <Stack spacing={2}>
                <Grid >
                  <Grid display="flex" justifyContent="flex-end" >
                    <Button variant="contained" component="label" startIcon={<Iconify icon={ICONS.UPLOAD_FILE.icon} />} > Upload File  
                      <input type="file" accept='.txt' multiple hidden onChange={handleFileChange} /> 
                    </Button>
                  </Grid>
                  <CodeMirror value={erpLog} HandleChangeIniJson={HandleChangeIniJson}/>                
                </Grid>
                <AddFormButtons isSubmitting={isSubmitting} toggleCancel={toggleCancel} />
              </Stack>
            </Card>
          </Grid>
        </Grid>
      </FormProvider>
  );
}
