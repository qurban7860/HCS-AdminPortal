import { Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import DocumentList from '../../documents/DocumentList';
// ----------------------------------------------------------------------

export default function CustomerDocumentList() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentList customerPage />
        </Container> );
}
