import { Container } from '@mui/material';
import CustomerTabContainer from '../CustomerTabContainer'
import DocumentHistoryViewForm from '../../document/documents/DocumentHistoryViewForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentHistoryViewForm() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentHistoryViewForm customerPage />
        </Container> );
}
