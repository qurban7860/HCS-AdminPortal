import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import {  resetDrawings, setDrawingEditFormVisibility, setDrawingFormVisibility,setDrawingViewFormVisibility } from '../../../redux/slices/products/drawing';
// components
import DrawingList from './DrawingList'
import DrawingAddForm from './DrawingAddForm'
import DrawingEditForm from './DrawingEditForm'
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm'
import DocumentEditForm from '../../document/documents/DocumentEditForm';


export default function MachineDrawings() {

    const dispatch = useDispatch();
    const { drawingFormVisibility, drawingEditFormVisibility, drawingViewFormVisibility } = useSelector((state) => state.drawing );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setDrawingFormVisibility(false))
        dispatch(setDrawingEditFormVisibility(false));
        dispatch(setDrawingViewFormVisibility(false));
        dispatch(resetDrawings());
    },[dispatch, machine])

  return (<>
    { !drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingList /> }
    { drawingFormVisibility && !drawingEditFormVisibility && !drawingViewFormVisibility && <DrawingAddForm/> }
    { !drawingFormVisibility && drawingEditFormVisibility && !drawingViewFormVisibility && <DocumentEditForm drawingPage/> }
    { !drawingFormVisibility && !drawingEditFormVisibility && drawingViewFormVisibility && <DocumentHistoryViewForm drawingPage /> }
    </>)
}

