import { PDFViewer } from '@react-pdf/renderer';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button, DialogTitle } from '@mui/material';
import SkeletonPDF from '../skeleton/SkeletonPDF';
import { 
  setPDFViewerDialog,
    getMachineServiceReport, 
    getMachineServiceReportCheckItems,
    resetMachineServiceReport,
    resetCheckItemValues } from '../../redux/slices/products/machineServiceReport';
import { MachineServiceReportPDF } from '../../pages/machine/serviceReports/MachineServiceReportPDF';


function PDFViewerDialog() {
  const dispatch = useDispatch();
  const { machineId, id } = useParams();
  const { machineServiceReport, machineServiceReportCheckItems, pdfViewerDialog, isLoadingCheckItems, isLoading  } = useSelector((state) => state.machineServiceReport);

  useEffect(()=>{
      if( machineId && id ){
          dispatch(getMachineServiceReport(machineId, id, true ));
          dispatch(getMachineServiceReportCheckItems( machineId, id, true ))
      }
  },[ dispatch, machineId, id ])

  const handleCloseDialog = ()=> dispatch(setPDFViewerDialog(false));
  
  return (
    <Dialog fullScreen open={pdfViewerDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
          PDF View
          <Button variant='outlined' onClick={handleCloseDialog}>Close</Button>
      </DialogTitle>
      { ( isLoading || isLoadingCheckItems ) ? <SkeletonPDF /> :
      <PDFViewer style={{height:'842px', width:'100%', paddingBottom:10}}>
        <MachineServiceReportPDF machineServiceReport={machineServiceReport} machineServiceReportCheckItems={machineServiceReportCheckItems} />
      </PDFViewer>
      }
      {/* <DialogActions style={{paddingTop:10, paddingBottom:10}}>
        <Button size='small' variant='outlined' onClick={handleCloseDialog}>Close</Button>
      </DialogActions> */}
    </Dialog>
  );
}

export default PDFViewerDialog;
