import PropTypes from 'prop-types';
import { useMemo, useState, Suspense, lazy } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
// eslint-disable-next-line import/no-extraneous-dependencies
import download from 'downloadjs';
// @mui
import Image from 'mui-image';
// eslint-disable-next-line import/no-anonymous-default-export
import { Switch, Card, Grid, Stack, Typography, Button ,Box, CardMedia, Dialog, Link, Tooltip} from '@mui/material';
// redux
import { getDocumentDownload } from '../../../redux/slices/document/downloadDocument';
import { setCustomerDocumentEditFormVisibility , deleteCustomerDocument , getCustomerDocuments , getCustomerDocument} from '../../../redux/slices/document/customerDocument';
// paths
import { PATH_DASHBOARD } from '../../../routes/paths';
// components
import LoadingScreen from '../../../components/loading-screen';
import Iconify from '../../../components/iconify';
import { fDate,fDateTime } from '../../../utils/formatTime';
import Cover from '../../components/Cover';
import { useSnackbar } from '../../../components/snackbar';
import ViewFormAudit from '../../components/ViewFormAudit';
import ViewFormField from '../../components/ViewFormField';
import ViewFormSWitch from '../../components/ViewFormSwitch';
import ViewFormEditDeleteButtons from '../../components/ViewFormEditDeleteButtons';

const Loadable = (Component) => (props) =>
  (
    <Suspense fallback={<LoadingScreen />}>
      <Component {...props} />
    </Suspense>
  );
  const DownloadComponent = Loadable(lazy(() => import('../DownloadDocument')));

// ----------------------------------------------------------------------
DocumentViewForm.propTypes = {
  currentCustomerDocument: PropTypes.object,
};

export default function DocumentViewForm({ currentCustomerDocument = null }) {


  const regEx = /^[^2]*/;
  const { customerDocument } = useSelector((state) => state.customerDocument);
  // console.log("currentCustomerDocument : ",currentCustomerDocument)
  const { customer, customers } = useSelector((state) => state.customer);
  const { enqueueSnackbar } = useSnackbar();
  const [ preview, setPreview] = useState(false)

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const onDelete = async () => {
    try {
    await dispatch(deleteCustomerDocument(currentCustomerDocument._id));
    enqueueSnackbar('Document deleted successfully!');
    dispatch(getCustomerDocuments(customer._id))
    } catch (err) {
      console.log(err);
      enqueueSnackbar('Document delete failed!', { variant: `error` });
    }
  };

  const  handleEdit = async () => {
    await dispatch(getCustomerDocument(currentCustomerDocument._id));
          dispatch(setCustomerDocumentEditFormVisibility(true));
  };

  const defaultValues = useMemo(
    () => (
      {
        displayName :             currentCustomerDocument?.displayName || "",
        documentName:             currentCustomerDocument?.documentName?.name || "",
        docCategory:              currentCustomerDocument?.docCategory?.name || "",
        docType:                  currentCustomerDocument?.docType?.name || "",
        customer:                 currentCustomerDocument?.customer?.name || "",
        customerAccess:           currentCustomerDocument?.customerAccess,
        isActiveVersion:          currentCustomerDocument?.isActiveVersion,
        documentVersion:          currentCustomerDocument?.documentVersions[0]?.versionNo || "",
        description:              currentCustomerDocument?.description,
        isActive:                 currentCustomerDocument?.isActive,
        createdAt:                currentCustomerDocument?.createdAt || "",
        createdByFullName:        currentCustomerDocument?.createdBy?.name || "",
        createdIP:                currentCustomerDocument?.createdIP || "",
        updatedAt:                currentCustomerDocument?.updatedAt || "",
        updatedByFullName:        currentCustomerDocument?.updatedBy?.name || "",
        updatedIP:                currentCustomerDocument?.updatedIP || "",
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [currentCustomerDocument, customerDocument]
  );

  const handleClosePreview = () => { setPreview(false) };

  const handleOpenPreview = () => {setPreview(true)};

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

    const handleDownload = (Id,extension) => {
       dispatch(getDocumentDownload(Id)).then(res => {
        if(regEx.test(res.status)){
          // download(atob(res.data), `${currentCustomerDocument?.displayName}.${currentCustomerDocument?.extension}`, { type: currentCustomerDocument?.type});
          downloadBase64File(res.data, `${currentCustomerDocument?.displayName}.${extension}`);
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

      <Grid >
        <ViewFormEditDeleteButtons handleEdit={handleEdit}  onDelete={onDelete}/>
        <Grid  display="inline-flex">
              <Tooltip >
                <ViewFormField  isActive={defaultValues.isActive}  />
              </Tooltip>
              <Tooltip>
                <ViewFormField  customerAccess={defaultValues?.customerAccess} />
              </Tooltip>
            </Grid>
        <Grid container>
            
            {/* <Tooltip title="Customer Access">
              <ViewFormField isActive={defaultValues.isActive} />
            </Tooltip> */}
            <ViewFormField sm={6} heading="Name" param={defaultValues?.displayName} />
            <ViewFormField sm={6} heading="Version" numberParam={defaultValues?.documentVersion} />
            <ViewFormField sm={6} heading="Document Type" param={defaultValues?.docType} />
            <ViewFormField sm={6} heading="Document Category" param={defaultValues?.docCategory} />
            {/* <ViewFormField sm={6} heading="Customer" param={defaultValues?.customer} /> */}
            {/* <Grid item xs={12} sm={12}  sx={{px:2,py:1, overflowWrap: "break-word",display:"flex"}}>
              <Grid>
                <Typography  variant="overline" sx={{ color: 'text.disabled' }}>
                Customer Access
                </Typography>
                <Typography>
                  <Switch  checked={defaultValues?.customerAccess}  disabled/>
                </Typography>
              </Grid>
            </Grid> */}
            {/* <ViewFormField sm={6} heading="Customer Access" param={defaultValues?.customerAccess === true ? "Yes" : "No"} /> */}
            <ViewFormField sm={12} heading="Description" param={defaultValues?.description} />

            <Grid item xs={12} sm={6} sx={{mt:2 ,display: "flex", alignItems:"flex-start"}}>
            { currentCustomerDocument?.documentVersions[0]?.files?.map((file)=>(
              file?.fileType.startsWith("image") ?
            <Card sx={{m:1, width:"130px", height:"155px",justifyContent:"center" ,alignItems:"center"}}>
              <Link href="#" underline="none"
                component="button"
                title='Download File'
                // sx={{display:"flex",flexDirection:"column",justifyContent:"center" ,alignItems:"center"}}
                onClick={() => handleDownload(file._id, file.extension)}
                >
                  <Box
                    onAbort={handleOpenPreview}
                    component="img"
                    sx={{ mx:3, mt:2 }}
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
                <Iconify sx={{ mx:3, mt:2 }} width="80px" height="113px" icon={document.icon[file.extension]} color={document.color[file.extension]}  />
                <Typography sx={{mt:0.5}}>{file?.name?.length > 10 ? file?.name?.substring(0, 10) : file?.name } {file?.name?.length > 10 ? "..." :null}</Typography>
              </Link>
            </Card>
            ))}
            </Grid>
            {/* { currentCustomerDocument?.documentVersions[0]?.files?.map((file)=>(
              file?.fileType.startsWith("image") &&
              <Link href="#" underline="none"
              component="button"
              title='Download File'
              onClick={() => handleDownload(file._id)}
              >
              <Typography>name</Typography>
            </Link>
            ))} */}

            {/* <Grid item sx={{ display: 'inline-block' }}>
                    <Card sx={{ display: 'flex', height: '300px', width: '200px' }}>
                      <Link
                        component="button"
                        title='Download File'
                        onClick={() => handleDownload(file._id)}
                        underline="none"
                      >
                        <CardActionArea>
                          <Grid
                            container
                            justifyContent="center"
                            alignContent="center"
                            sx={{ display: 'block' }}
                          >
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ bgcolor: 'blue', alignContent: 'center' }}
                            >
                              <CardContent
                                component={Stack}
                                display="block"
                                height="170px"
                                sx={{ position: 'relative', zIndex: '1' }}
                              >
                                <CustomAvatar
                                  sx={{
                                    width: '100px',
                                    height: '100px',
                                    display: 'flex',
                                    marginTop: '60px',
                                    marginRight: 'auto',
                                    marginLeft: 'auto',
                                    marginBottom: '0px',
                                    boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.3)',
                                    fontSize: '40px',
                                    zIndex: '2',
                                  }}
                                  name={file.name}
                                  alt={file.name}
                                />
                                {file?.fileType.startsWith("image") &&
                                <CardMedia
                                  component="img"
                                  sx={{
                                    height: '170px',
                                    opacity: '0.5',
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
                                  alt={file.name}
                                  image={`data:image/png;base64, ${file?.thumbnail}`}
                                />
                                }
                              </CardContent>
                            </Grid>
                            <Grid
                              item
                              justifyContent="center"
                              sx={{ display: 'block', textAlign: 'center', width: '200px' }}
                            >
                              <CardContent
                                component={Stack}
                                display="block"
                                justifyContent="center"
                                height="130px"
                              >
                                <Typography variant="body1" sx={{ fontWeight: 'bold', p: 1 }}>
                                  {fullName[index] ? fullName[index] : <br />}
                                </Typography>
                              </CardContent>
                            </Grid>
                          </Grid>
                        </CardActionArea>
                      </Link>
                    </Card>
                </Grid> */}

              {/* <DownloadComponent Document={currentCustomerDocument} /> */}
              {/* <Button variant="contained" sx={{color: "Black", backgroundColor: "#00e676", m:2}} startIcon={<Iconify icon="line-md:download-loop" />} onClick={handleDownload}> Download</Button> */}
            {/* { currentCustomerDocument?.type.startsWith("image")  && (currentCustomerDocument?.customerAccess === true || currentCustomerDocument?.customerAccess === "true") ?
            <Image alt={defaultValues.name} src={currentCustomerDocument?.path} width="300px" height="300px"  sx={{mt:2, }}/> : null} */}
            {/* <ViewFormSWitch isActive={defaultValues.isActive}/> */}
          <Grid container sx={{ mt: 2 }}>
                <ViewFormAudit  defaultValues={defaultValues}/>
          </Grid>
        </Grid>
      </Grid>
  );
}
