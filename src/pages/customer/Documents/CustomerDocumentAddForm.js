import { Container } from '@mui/material';
import CustomerTabContainer from '../CustomerTabContainer'
import DocumentAddForm from '../../document/documents/DocumentAddForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentAddForm() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentAddForm customerPage />
        </Container> );
}
