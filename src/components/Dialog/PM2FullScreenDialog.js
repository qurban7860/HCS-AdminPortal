import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog, Button, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import { TableSkeleton } from '../table';
import { setPM2FullScreenDialog } from '../../redux/slices/logs/pm2Logs';
import JsonEditor from '../CodeMirror/JsonEditor';
import SkeletonLine from '../skeleton/SkeletonLine';


function PM2FullScreenDialog() {
  const dispatch = useDispatch();
  const { pm2Logs, pM2FullScreenDialog, isLoading } = useSelector((state) => state.pm2Logs);
  const handleCloseDialog = ()=> dispatch(setPM2FullScreenDialog(false));
  
  return (
    <Dialog fullScreen open={pM2FullScreenDialog} onClose={handleCloseDialog}>
      <DialogTitle variant='h3' sx={{pb:1, pt:2, display:'flex', justifyContent:'space-between'}}>
          PM2 Logs
          <Button variant='outlined' onClick={handleCloseDialog}>Close</Button>
      </DialogTitle>
      <DialogContent sx={{p:0}}>
        {(isLoading?
        ( Array.from({ length: 25 }).map((_, index) => (
          <SkeletonLine key={index} />
          ))
        ): <JsonEditor value={pm2Logs?.data} readOnly autoHeight />)}
      </DialogContent>
    </Dialog>
  );
}

export default PM2FullScreenDialog;
