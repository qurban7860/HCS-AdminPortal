// @mui
import { Skeleton, Box } from '@mui/material';

export default function SkeletonIcon() {
    return (
        <Box gap={1} display="flex" >
            <Skeleton variant="rounded" width={33} height={33} />
        </Box>
    );
}
