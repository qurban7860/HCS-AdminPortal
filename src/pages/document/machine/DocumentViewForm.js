import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, Suspense, lazy  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import download from 'downloadjs';
// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { styled, alpha } from '@mui/material/styles';
import { Switch, Card, Grid, Stack, Typography, Button , Box , Link, IconButton, Tooltip} from '@mui/material';
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
// console.log("currentMachineDocument", currentMachineDocument)
  const navigate = useNavigate();
  const [ preview, setPreview] = useState(false)

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
        docCategory:              currentMachineDocument?.docCategory?.name || "",
        docType:                  currentMachineDocument?.docType?.name || "",
        customer:                 currentMachineDocument?.customer?.name,
        customerAccess:           currentMachineDocument?.customerAccess,
        isActiveVersion:          currentMachineDocument?.isActiveVersion,
        documentVersion:          currentMachineDocument?.documentVersions[0]?.versionNo || "",
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

const handleOpenPreview = () => {setPreview(true)};

const handleDownload = (fileId,fileName ,fileExtension) => {
   dispatch(getDocumentDownload(fileId)).then(res => {
    // console.log("res : ",res)
    if(regEx.test(res.status)){
      download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension});
      // downloadBase64File(res.data, `${fileName}.${fileExtension}`);
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
const document = {
  icon: {
    pdf: "bxs:file-pdf",
    doc: "mdi:file-word",
    docx: "mdi:file-word",
    xls: "mdi:file-excel",
    xlsx: "mdi:file-excel",
    ppt: "mdi:file-powerpoint",
    pptx: "mdi:file-powerpoint"
  },
  color: {
    pdf: "#f44336",
    doc: "#448aff",
    docx: "#448aff",
    xls: "#388e3c",
    xlsx: "#388e3c",
    ppt: "#e65100",
    pptx: "#e65100"
  }
}

  return (
    <Grid sx={{mt:-2}}>
      <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
          <Grid sm={12} display="flex">
              <Tooltip >
                <ViewFormField  isActive={defaultValues.isActive}  />
              </Tooltip>
              <Tooltip>
                <ViewFormField  customerAccess={defaultValues?.customerAccess} />
              </Tooltip>
          </Grid>
        <Grid container >
            <ViewFormField sm={6} heading="Name" param={defaultValues?.displayName} />
            <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} />
            <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
            <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
          <Grid sx={{ mt:2 ,display: "flex", alignItems:"flex-start"}}>
          { currentMachineDocument?.documentVersions[0]?.files?.map((file)=>(
              file?.fileType.startsWith("image") ?
            <Card sx={{m:1, width:"130px", height:"155px",justifyContent:"center" ,alignItems:"center"}}>
              <Link href="#" underline="none"
                component="button"
                title='Download File'
                onClick={() => handleDownload(file._id, file.name, file.extension)}
                >
                  <Box
                    onAbort={handleOpenPreview}
                    component="img"
                    width="80px" height="80px" 
                    sx={{ mx:3, mt:2, objectFit:"cover" }}
                    alt={file.DisplayName}
                    src={`data:image/png;base64, ${file?.thumbnail}`}
                    />
                    <Typography sx={{mt:0.7}}>{file?.name?.length > 10 ? file?.name?.substring(0, 10) : file?.name } {file?.name?.length > 10 ? "..." :null}</Typography>
              </Link> 
            </Card>:
            <Card sx={{m:1, width:"130px", height:"155px"}}>
              <Link href="#" underline="none"
                
                component="button"
                title='Download File'
                onClick={() => handleDownload(file._id)}
              >
                <Iconify sx={{ mx:3, mt:2 }} width="80px" height="113px" icon={document.icon[file.extension]} color={document.color[file.extension]} />
                <Typography sx={{mt:0.5}}>{file?.name?.length > 10 ? file?.name?.substring(0, 10) : file?.name } {file?.name?.length > 10 ? "..." :null}</Typography>
              </Link>
            </Card>
            ))}
            
              {/* <DownloadComponent Document={currentMachineDocument} /> */}
              {/* <Button variant="contained" sx={{color: "Black", backgroundColor: "#00e676", m:2}} startIcon={<Iconify icon="line-md:download-loop" />} onClick={handleDownload}> Download</Button> */}
            </Grid><Link sx={{mt:"auto"}} href="#" underline="none" >see more</Link>
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
