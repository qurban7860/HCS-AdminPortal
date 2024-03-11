import { Container } from '@mui/material';
import CustomerTabContainer from '../CustomerTabContainer'
import DocumentList from '../../document/documents/DocumentList';
// ----------------------------------------------------------------------

export default function CustomerDocumentList() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentList customerPage />
        </Container> );
}
