import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getDrawings, resetDrawings, setDrawingFormVisibility, setDrawingEditFormVisibility, setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';
// components
import DrawingList from './DrawingList'
import DrawingAddForm from './DrawingAddForm'
import DrawingEditForm from './DrawingEditForm'
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm'


export default function MachineDrawings() {

    const dispatch = useDispatch();
    const { drawingFormVisibility, drawingEditFormVisibility, drawingViewFormVisibility } = useSelector((state) => state.drawing );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setDrawingFormVisibility(false))
        // dispatch(setDrawingEditFormVisibility(false));
        dispatch(setDrawingViewFormVisibility(false));
        dispatch(resetDrawings());
        // dispatch(getDrawings(machine?._id));
    },[dispatch, machine])

  return (<>
    { !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingList /> }
    { drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingAddForm/> }
    { !drawingFormVisibility && drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingEditForm/> }
    { !drawingFormVisibility && !drawingEditFormVisibility && drawingViewFormVisibility && <DocumentHistoryViewForm drawingPage /> }
    </>)
}

