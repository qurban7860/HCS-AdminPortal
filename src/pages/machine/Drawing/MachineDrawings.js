import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { 
  resetDrawings, 
  setDrawingEditFormVisibility, 
  setDrawingFormVisibility,
  setDrawingViewFormVisibility,
  setDrawingAddFormVisibility,
} from '../../../redux/slices/products/drawing';
// components
import DrawingList from './DrawingList'
import DrawingAddForm from './DrawingAddForm'
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm'
import DocumentEditForm from '../../document/documents/DocumentEditForm';
import DocumentAddForm from '../../document/documents/DocumentAddForm';


export default function MachineDrawings() {

    const dispatch = useDispatch();
    const { drawingFormVisibility, 
            drawingAddFormVisibility, 
            drawingEditFormVisibility, 
            drawingViewFormVisibility } = useSelector((state) => state.drawing );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setDrawingFormVisibility(false)) // for attach drawing
        dispatch(setDrawingEditFormVisibility(false));
        dispatch(setDrawingViewFormVisibility(false));
        dispatch(setDrawingAddFormVisibility(false)); // for add new drawing
        dispatch(resetDrawings());
    },[dispatch, machine])

  return (<>
    { !drawingAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingList /> }
    { drawingAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DocumentAddForm drawingPage machineDrawings /> }
    { !drawingAddFormVisibility && drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingAddForm/> }
    { !drawingAddFormVisibility && !drawingFormVisibility && drawingEditFormVisibility && !drawingViewFormVisibility && <DocumentEditForm drawingPage/> }
    { !drawingAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && drawingViewFormVisibility && <DocumentHistoryViewForm drawingPage /> }
    </>)
}

