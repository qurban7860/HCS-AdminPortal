import PropTypes from 'prop-types';
import { useMemo, useState, useEffect, Suspense, lazy  } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import download from 'downloadjs';
// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { styled, alpha } from '@mui/material/styles';
import { Switch, Card, Grid, Stack, Typography, Button , Box , Link, IconButton, Tooltip,CardActionArea,
  CardContent,
  Dialog,
  CardMedia,} from '@mui/material';
// redux
import { setMachineDocumentEditFormVisibility , deleteMachineDocument , getMachineDocuments , getMachineDocument, updateMachineDocument,resetMachineDocument} from '../../../redux/slices/document/machineDocument';
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
import { getCustomer, resetCustomer } from '../../../redux/slices/customer/customer';
import { getMachine, resetMachine } from '../../../redux/slices/products/machine';
import { useSnackbar } from '../../../components/snackbar';
import LoadingScreen from '../../../components/loading-screen';
import CustomAvatar from '../../../components/custom-avatar/CustomAvatar';

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
  const linkMachineDocumentView = async () => { 
     navigate(PATH_DASHBOARD.document.machine(currentMachineDocument._id)); 
     dispatch(resetMachineDocument())
     dispatch(resetCustomer())
    //  dispatch(resetMachine())
     await dispatch(getMachineDocument(currentMachineDocument._id))
    //  await dispatch(getMachine(currentMachineDocument.machine._id))
     await dispatch(getCustomer(currentMachineDocument.customer._id))
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


const handleDownload = (fileId,fileName ,fileExtension) => {
   dispatch(getDocumentDownload(fileId)).then(res => {
    if(regEx.test(res.status)){
      download(atob(res.data), `${fileName}.${fileExtension}`, { type: fileExtension});
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

const [ onPreview, setOnPreview] = useState(false)
const [ imageData, setImageData] = useState(false)
const [ imageName, setImageName] = useState("")
const [ imageExtension, setImageExtension] = useState("")

const handleOpenPreview = () => {setOnPreview(true)};
const handleClosePreview = () => {setOnPreview(false)};

const handleDownloadImage = (fileName,fileExtension)=>{
     download(atob(imageData), `${fileName}.${fileExtension}`, { type: fileExtension});
}

const handleDownloadAndPreview = (fileId,fileName,fileExtension) => {
  setImageName(fileName);
  setImageExtension(fileExtension);
  dispatch(getDocumentDownload(fileId)).then(res => {
   if(regEx.test(res.status)){
    setImageData(res.data)
    handleOpenPreview()
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
            {/* <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} /> */}
            <ViewFormField sm={6} heading="Version" objectParam={
                                    defaultValues.documentVersion ? (
                                      <Typography display="flex">
                                        {defaultValues.documentVersion}
                                        {currentMachineDocument?.documentVersions && currentMachineDocument?.documentVersions?.length > 1 && <Link onClick={linkMachineDocumentView} href='#' underline='none' ><Typography variant='body2' sx={{mt:0.45,ml:1}} >   More version  </Typography></Link>}
                                      </Typography>
                                      
                                    ) : (
                                      ''
                                    )
                                  } 
            />
            <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
            <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />
          <Grid sx={{ mt:2 ,display: "flex", alignItems:"flex-start"}}>
          { currentMachineDocument?.documentVersions[0]?.files?.map((file)=>(
              file?.fileType.startsWith("image") ?
           
                <Card sx={{  height: '160px', width: '140px',m:1 }}>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ bgcolor:"lightgray",alignContent: 'center', width:"140px" }}
                    >
                    <CardContent
                      component={Stack}
                      display="block"
                      height="110px"
                      sx={{ position: 'relative', zIndex: '1' }}
                      >
                      <Link>
                        <IconButton
                          size="small"
                          onClick={
                            () => {
                              handleDownloadAndPreview(file._id,file.name,file.extension);
                            }
                          }
                          sx={{
                            top: 7,
                            left: 70,
                            zIndex: 9,
                            height: "60",
                            position: 'absolute',
                            color: (theme) => alpha(theme.palette.common.white, 0.8),
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon="icon-park-outline:preview-open" width={18} />
                        </IconButton>
                      </Link>
                      <Dialog
                        maxWidth="md"
                        open={onPreview}
                        onClose={handleClosePreview}
                        aria-labelledby="keep-mounted-modal-title"
                        aria-describedby="keep-mounted-modal-description"
                        >
                        <Grid
                          container
                          item
                          sx={{
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            bgcolor: 'primary.main',
                            color: 'primary.contrastText',
                            padding: '10px',
                          }}
                        >
                          <Typography variant="h4" sx={{ px: 2 }}>
                            {`${imageName}.${imageExtension}`}
                          </Typography>{' '}
                          <Link onClick={handleClosePreview} href="#" underline="none" sx={{ ml: 'auto' }}>
                            {' '}
                            <Iconify sx={{ color: 'white' }} icon="mdi:close-box-outline" />
                          </Link>
                        </Grid>
                        <Link>
                            <IconButton
                              size="small"
                              onClick={() => handleDownloadImage(imageName ,imageExtension)}
                              sx={{
                                top: 70,
                                right: 15,
                                zIndex: 9,
                                height: "60",
                                position: 'absolute',
                                color: (theme) => alpha(theme.palette.common.white, 0.8),
                                bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                                '&:hover': {
                                  bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                                },
                              }}
                            >
                              <Iconify icon="line-md:download-loop" width={18} />
                            </IconButton>
                          </Link>
                        <Box component="img" sx={{minWidth:"350px", minHeight:"350px"}} alt={file?.name}  src={`data:image/png;base64, ${imageData}`}/>
                      </Dialog>
                      <Link>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file._id,file.name ,file.extension)}
                          sx={{
                            top: 7,
                            left: 105,
                            zIndex: 9,
                            height: "60",
                            position: 'absolute',
                            color: (theme) => alpha(theme.palette.common.white, 0.8),
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon="line-md:download-loop" width={18} />
                        </IconButton>
                      </Link>
                      <CustomAvatar
                        sx={{
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          marginTop: '55px',
                          marginRight: 'auto',
                          marginLeft: 'auto',
                          marginBottom: '0px',
                          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                          fontSize: '25px',
                          zIndex: '2',
                        }}
                        extension={file.extension}
                        alt={file.extension}
                      />
                      <CardMedia
                        component="img"
                        sx={{
                          height: '110px',
                          opacity: '0.6',
                          display: 'block',
                          zIndex: '-1',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }}
                        image={`data:image/png;base64, ${file?.thumbnail}`}
                        alt="customer's contact cover photo was here"
                      />
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ textAlign: 'center', width: '140px', mt:2 }}
                    >
                      <Typography variant="body1" >
                      {file?.name?.length > 6 ? file?.name?.substring(0, 6) : file?.name } {file?.name?.length > 6 ? "..." :null}
                      </Typography>
                  </Grid>
                </Card>
            :
            <Card sx={{  height: '160px', width: '140px',m:1 }}>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ bgcolor:"lightgray",alignContent: 'center', width:"140px" }}
                    >
                    <CardContent
                      component={Stack}
                      display="block"
                      height="110px"
                      sx={{ position: 'relative', zIndex: '1' }}
                      >
                      <Link>
                        <IconButton
                          size="small"
                          onClick={() => handleDownload(file._id,file.name ,file.extension)}
                          sx={{
                            top: 7,
                            left: 105,
                            zIndex: 9,
                            height: "60",
                            position: 'absolute',
                            color: (theme) => alpha(theme.palette.common.white, 0.8),
                            bgcolor: (theme) => alpha(theme.palette.grey[900], 0.72),
                            '&:hover': {
                              bgcolor: (theme) => alpha(theme.palette.grey[900], 0.48),
                            },
                          }}
                        >
                          <Iconify icon="line-md:download-loop" width={18} />
                        </IconButton>
                      </Link>
                      <CustomAvatar
                        sx={{
                          width: '50px',
                          height: '50px',
                          display: 'flex',
                          marginTop: '55px',
                          marginRight: 'auto',
                          marginLeft: 'auto',
                          marginBottom: '0px',
                          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                          fontSize: '25px',
                          zIndex: '2',
                        }}
                        // name={file.extension}
                        extension={file.extension}
                        alt={file.extension}
                      />
                      <Iconify sx={{ 
                          height: '90px',
                          opacity: '0.6',
                          display: 'block',
                          zIndex: '-1',
                          position: 'absolute',
                          top: '0',
                          left: '0',
                          right: '0',
                          bottom: '0',
                          width: '100%',
                          objectFit: 'cover',
                          objectPosition: 'center',
                        }} 
                        icon={document.icon[file.extension]} 
                        color={document.color[file.extension]} />
                    </CardContent>
                  </Grid>
                  <Grid
                    item
                    justifyContent="center"
                    sx={{ textAlign: 'center', width: '140px', mt:2 }}
                    >
                      <Typography variant="body1" >
                      {file?.name?.length > 6 ? file?.name?.substring(0, 6) : file?.name } {file?.name?.length > 6 ? "..." :null}
                      </Typography>
                  </Grid>
                </Card>
            ))}
            </Grid>
          <Grid container sx={{ mt: '1rem' }}>
              <ViewFormAudit defaultValues={defaultValues}/>
          </Grid>
        </Grid>
        
    </Grid>
  );
}
