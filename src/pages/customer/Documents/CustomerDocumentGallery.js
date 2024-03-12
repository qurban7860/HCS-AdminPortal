import { Container } from '@mui/material';
import CustomerTabContainer from '../util/CustomerTabContainer'
import DocumentGallery from '../../document/documents/DocumentGallery';
// ----------------------------------------------------------------------

export default function CustomerDocumentGallery() {

return (<Container maxWidth={false} >
            <CustomerTabContainer currentTabValue='documents' />
            <DocumentGallery customerPage />
        </Container> );
}
