import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, Suspense, lazy  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { Switch, Card, Grid, Stack, Typography, Button , Box , Link} from '@mui/material';
// redux
import { setMachineDocumentEditFormVisibility , deleteMachineDocument , getMachineDocuments , getMachineDocument, updateMachineDocument} from '../../../redux/slices/document/machineDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import { fDate,fDateTime } from '../../../utils/formatTime';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';
import Iconify from '../../../components/iconify';
import { getDocumentDownload } from '../../../redux/slices/document/downloadDocument';
import { useSnackbar } from '../../../components/snackbar';
import LoadingScreen from '../../../components/loading-screen';

  const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
  const DownloadComponent = Loadable(lazy(() => import('../DownloadDocument')));

// ----------------------------------------------------------------------
DocumentViewForm.propTypes = {
  currentMachineDocument: PropTypes.object,
};

export default function DocumentViewForm({ currentMachineDocument = null }) {

  const regEx = /^[^2]*/;
  const { machineDocument } = useSelector((state) => state.machineDocument);
  const { machine , machines } = useSelector((state) => state.machine);
const { enqueueSnackbar } = useSnackbar();
// console.log(machineDocument)
console.log("currentMachineDocument", currentMachineDocument)
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const onDelete = async () => {
    await dispatch(deleteMachineDocument(currentMachineDocument._id));
    await dispatch(getMachineDocuments(machine._id));
  };

  const  handleEdit = async () => {
    await dispatch(getMachineDocument(currentMachineDocument._id));
    // console.log("machineDocument : ",machineDocument)
    dispatch(setMachineDocumentEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => (
      {
        displayName:              currentMachineDocument?.displayName || "",
        documentName:             currentMachineDocument?.documentName?.name || "",
        category:                 currentMachineDocument?.category?.name || "",
        customer:                 currentMachineDocument?.customer?.name,
        customerAccess:           currentMachineDocument?.customerAccess,
        isActiveVersion:          currentMachineDocument?.isActiveVersion,
        documentVersion:          currentMachineDocument?.documentVersion,
        description:              currentMachineDocument?.description,
        isActive:                 currentMachineDocument?.isActive,
        createdAt:                currentMachineDocument?.createdAt || "",
        createdByFullName:        currentMachineDocument?.createdBy?.name || "",
        createdIP:                currentMachineDocument?.createdIP || "",
        updatedAt:                currentMachineDocument?.updatedAt || "",
        updatedByFullName:        currentMachineDocument?.updatedBy?.name || "",
        updatedIP:                currentMachineDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentMachineDocument]
  );
  const downloadBase64File = (base64Data, fileName) => {
    // Decode the Base64 file
const decodedString = atob(base64Data);
// Convert the decoded string to a Uint8Array
const byteNumbers = new Array(decodedString.length);
for (let i = 0; i < decodedString.length; i +=1) {
  byteNumbers[i] = decodedString.charCodeAt(i);
}
const byteArray = new Uint8Array(byteNumbers);
// Create a Blob object from the Uint8Array
const blob = new Blob([byteArray]);
const link = document.createElement('a');
link.href = window.URL.createObjectURL(blob);
link.download = fileName;
link.target = '_blank';
link.click();
}

// const handleDownloadFile = (base64,) => {
//   const base64Data = base64;
//   const fileName = 'your_file_name.ext';
//   downloadBase64File(base64Data, fileName);
// };

const handleDownload = () => {
   dispatch(getDocumentDownload(currentMachineDocument._id)).then(res => {
    console.log("res : ",res)
    if(regEx.test(res.status)){
      // download(atob(res.data), `${currentMachineDocument?.displayName}.${currentMachineDocument?.extension}`, { type: currentMachineDocument?.type});
      downloadBase64File(res.data, `${currentMachineDocument?.displayName}.${currentMachineDocument?.extension}`);
      enqueueSnackbar(res.statusText);
    }else{
      enqueueSnackbar(res.statusText,{ variant: `error` })
    }
  }).catch(err => {
    if(err.Message){
      enqueueSnackbar(err.Message,{ variant: `error` })
    }else if(err.message){
      enqueueSnackbar(err.message,{ variant: `error` })
    }else{
      enqueueSnackbar("Something went wrong!",{ variant: `error` })
    }
  });
};

  return (
    <Grid sx={{mt:-2}}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid container >
          <ViewFormField sm={12} heading="Name" param={defaultValues?.displayName} />
          <ViewFormField sm={6} heading="Document Type" param={defaultValues?.documentName} />
          <ViewFormField sm={6} heading="Document Category" param={defaultValues?.category} />
          {/* <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} /> */}
          <Grid item xs={12} sm={12} sx={{px:2,py:1, overflowWrap: "break-word",}}>
            <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
            Customer Access
            </Typography>
            <Typography>
              <Switch  checked={defaultValues?.customerAccess}  disabled/>
            </Typography>
          </Grid>
          <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} />

          <Grid item xs={12} sm={6} sx={{px:2,py:1, overflowWrap: "break-word",}}>
              <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
              Version Status
              </Typography>
              <Typography>
                <Switch  checked={defaultValues?.isActiveVersion}  disabled/>
              </Typography>
            </Grid>
          {/* <ViewFormField sm={6} heading="Customer Access" param={defaultValues?.customerAccess === true ? "Yes" : "No"} /> */}
          <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
          <Grid item xs={12} sm={6} sx={{display: "flex",flexDirection:"column", alignItems:"flex-start"}}>
            { currentMachineDocument?.type.startsWith("image") ?
            <Link href="#" underline="none"
              component="button"
              title='Download File'
              onClick={handleDownload}
            >
              <Box
                component="img"
                sx={{ m:2 }}
                alt={defaultValues.displayName}
                src={`data:image/png;base64, ${currentMachineDocument?.content}`}
                />
            </Link>: <Link href="#" underline="none"
              sx={{ m:2 }}
              component="button"
              title='Download File'
              onClick={handleDownload}
            >
              <Iconify width="50px" icon="ph:files-fill" />
            </Link>}
              {/* <DownloadComponent Document={currentMachineDocument} /> */}
              {/* <Button variant="contained" sx={{color: "Black", backgroundColor: "#00e676", m:2}} startIcon={<Iconify icon="line-md:download-loop" />} onClick={handleDownload}> Download</Button> */}
            </Grid>
          {/* {currentMachineDocument?.type.startsWith("image") ?
          <Image alt={defaultValues.name} src={currentMachineDocument?.path} width="300px" height="300px" sx={{mt:2, }} /> : null} */}
          {/* <ViewFormSWitch isActive={defaultValues.isActive}/> */}
          <Grid container sx={{ mt: '1rem' }}>
              <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        </Grid>
    </Grid>
  );
}
