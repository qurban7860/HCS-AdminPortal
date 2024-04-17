import { Container } from '@mui/material';
import CustomerTabContainer from '../customers/util/CustomerTabContainer'
import DocumentAddForm from '../../documents/DocumentAddForm';
// ----------------------------------------------------------------------

export default function CustomerDocumentNewVersion() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentAddForm customerPage newVersion />
        </Container> );
}
