import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
// slice
import { getNotes, resetNotes, setNoteFormVisibility, 
          setNoteEditFormVisibility, setNoteViewFormVisibility 
        } from '../../../redux/slices/customer/customerNote';
// components
import NoteList from './NoteList'
import NoteAddForm from './NoteAddForm'
import NoteEditForm from './NoteEditForm'
import NoteViewForm from './NoteViewForm';
import { getActiveContacts } from '../../../redux/slices/customer/contact';
import { getActiveSites } from '../../../redux/slices/customer/site';

export default function CustomerNotes() {

    const dispatch = useDispatch();
    const { noteFormVisibility, noteEditFormVisibility, noteViewFormVisibility } = useSelector((state) => state.customerNote );
    const { customer } = useSelector((state) => state.customer);
    useEffect(()=>{
        dispatch(setNoteFormVisibility(false))
        dispatch(setNoteEditFormVisibility(false));
        dispatch(setNoteViewFormVisibility(false));

        dispatch(resetNotes());
        dispatch(getNotes(customer._id));
        dispatch(getActiveContacts(customer._id));
        dispatch(getActiveSites(customer._id));

    },[dispatch, customer])
  return (<>
    { !noteFormVisibility && !noteEditFormVisibility && !noteViewFormVisibility && <NoteList /> }
    { noteFormVisibility && !noteEditFormVisibility && !noteViewFormVisibility && <NoteAddForm/> }
    { !noteFormVisibility && noteEditFormVisibility && !noteViewFormVisibility && <NoteEditForm/> }
    { !noteFormVisibility && !noteEditFormVisibility && noteViewFormVisibility && <NoteViewForm /> }
    </>)
}

