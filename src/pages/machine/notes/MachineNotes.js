import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getNotes, resetNotes, setNoteFormVisibility, 
          setNoteEditFormVisibility, setNoteViewFormVisibility 
        } from '../../../redux/slices/products/machineNote';
// components
import NoteList from './NoteList'
import NoteAddForm from './NoteAddForm'
import NoteEditForm from './NoteEditForm'
import NoteViewForm from './NoteViewForm';

export default function MachineNotes() {

    const dispatch = useDispatch();
    const { noteFormVisibility, noteEditFormVisibility, noteViewFormVisibility } = useSelector((state) => state.machineNote );
    const { machine } = useSelector((state) => state.machine);

    useEffect(()=>{
        dispatch(setNoteFormVisibility(false))
        dispatch(setNoteEditFormVisibility(false));
        dispatch(setNoteViewFormVisibility(false));
        dispatch(resetNotes());
        dispatch(getNotes(machine?._id));
    },[dispatch, machine])
  return (<>
    { !noteFormVisibility && !noteEditFormVisibility && !noteViewFormVisibility && <NoteList /> }
    { noteFormVisibility && !noteEditFormVisibility && !noteViewFormVisibility && <NoteAddForm/> }
    { !noteFormVisibility && noteEditFormVisibility && !noteViewFormVisibility && <NoteEditForm/> }
    { !noteFormVisibility && !noteEditFormVisibility && noteViewFormVisibility && <NoteViewForm /> }
    </>)
}

