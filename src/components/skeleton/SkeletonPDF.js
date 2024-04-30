// @mui
import { useEffect, useState } from 'react';
import { Stack, Skeleton } from '@mui/material';
import Iconify from '../iconify';

// ----------------------------------------------------------------------

export default function SkeletonPDF() {

     // State to manage the opacity of the text
  const [opacity, setOpacity] = useState(0.3);

  // Effect to update the opacity at regular intervals
  useEffect(() => {
    const interval = setInterval(() => {
      // Toggle between 0 and 1 opacity
      setOpacity(opacity === 0.3 ? 0 : 0.3);
    }, 500); // Change opacity every 1 second

    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(interval);
  }, [opacity]); // Dependency array ensures the effect runs when opacity changes

    
  return (
      <Stack spacing={2} height="842px" sx={{margin:'0 auto', paddingTop:20}}>
        <Iconify icon="fluent:document-pdf-20-regular" sx={{transition:'opacity 1s ease', width: 300, height: 300, opacity }} />
      </Stack>
  );
}
