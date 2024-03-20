import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { 
  resetDrawings, 
  setDrawingEditFormVisibility, 
  setDrawingFormVisibility,
  setDrawingViewFormVisibility,
  setDrawingAddFormVisibility,
  setDrawingListAddFormVisibility,
} from '../../../redux/slices/products/drawing';
// components
import DrawingList from './DrawingList'
import DrawingAddForm from './DrawingAddForm'
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm'
import DocumentEditForm from '../../document/documents/DocumentEditForm';
import DocumentAddForm from '../../document/documents/DocumentAddForm';
import DocumentListAddForm from '../../document/documents/DocumentListAddForm';


export default function MachineDrawings() {

    const dispatch = useDispatch();
    const { drawingFormVisibility, 
            drawingAddFormVisibility, 
            drawingEditFormVisibility, 
            drawingViewFormVisibility,
            drawingListAddFormVisibility,
            } = useSelector((state) => state.drawing );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setDrawingFormVisibility(false));
        dispatch(setDrawingEditFormVisibility(false));
        dispatch(setDrawingViewFormVisibility(false));
        dispatch(setDrawingAddFormVisibility(false));
        dispatch(setDrawingListAddFormVisibility(false))
        dispatch(resetDrawings());
    },[dispatch, machine])

  return (<>
    { !drawingAddFormVisibility && !drawingListAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingList /> }
    { drawingAddFormVisibility && !drawingListAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DocumentAddForm drawingPage machineDrawings /> }
    { !drawingAddFormVisibility && drawingListAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DocumentListAddForm /> }
    { !drawingAddFormVisibility && !drawingListAddFormVisibility && drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingAddForm/> }
    { !drawingAddFormVisibility && !drawingListAddFormVisibility && !drawingFormVisibility && drawingEditFormVisibility && !drawingViewFormVisibility && <DocumentEditForm drawingPage/> }
    { !drawingAddFormVisibility && !drawingListAddFormVisibility && !drawingFormVisibility && !drawingEditFormVisibility && drawingViewFormVisibility && <DocumentHistoryViewForm drawingPage /> }
    </>)
}

