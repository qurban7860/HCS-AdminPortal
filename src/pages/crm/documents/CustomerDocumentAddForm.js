import { Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import DocumentAddForm from '../../documents/DocumentAddForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentAddForm() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentAddForm customerPage />
        </Container> );
}
