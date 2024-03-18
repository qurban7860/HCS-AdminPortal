import { Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import DocumentEditForm from '../../document/documents/DocumentEditForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentEditForm() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentEditForm customerPage />
        </Container> );
}
