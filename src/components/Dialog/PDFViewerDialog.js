import { PDFViewer } from '@react-pdf/renderer';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button, DialogTitle } from '@mui/material';
import {  
  setPDFViewerDialog,
} from '../../redux/slices/products/machineServiceRecord';
import { MachineServiceRecordPDF } from '../../pages/machine/serviceRecords/MachineServiceRecordPDF';


function PDFViewerDialog() {
  const dispatch = useDispatch();
  const { machineServiceRecord, pdfViewerDialog } = useSelector((state) => state.machineServiceRecord);
  const handleCloseDialog = ()=> dispatch(setPDFViewerDialog(false));
  
  return (
    <Dialog fullScreen open={pdfViewerDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
          PDF View
          <Button variant='outlined' onClick={handleCloseDialog}>Close</Button>
      </DialogTitle>
      <PDFViewer style={{height:'842px', width:'100%', paddingBottom:10}}>
        <MachineServiceRecordPDF machineServiceRecord={machineServiceRecord} />
      </PDFViewer>
      {/* <DialogActions style={{paddingTop:10, paddingBottom:10}}>
        <Button size='small' variant='outlined' onClick={handleCloseDialog}>Close</Button>
      </DialogActions> */}
    </Dialog>
  );
}

export default PDFViewerDialog;
