import { Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import DocumentViewForm from '../../document/documents/DocumentViewForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentViewForm() {

    return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentViewForm customerPage />
        </Container> );
}
