import { useEffect } from 'react'
import { useDispatch } from 'react-redux';
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm'
import MachineTabContainer from '../util/MachineTabContainer';

export default function DrawingView() {

  return (
    <>
      <MachineTabContainer currentTabValue='drawings' />
      <DocumentHistoryViewForm drawingPage />
    </>
    )
}

