import PropTypes from 'prop-types';
import { useState } from 'react';
// @mui
import { useTheme } from '@mui/material/styles';
import { Card, Typography, Stack, CardMedia, ButtonGroup, Button } from '@mui/material';
// utils
import { bgBlur } from '../../utils/cssStyles';
// components
import Image from '../image';
import Iconify from '../iconify';
import { SkeletonGallery } from '../skeleton';
import { fileThumb } from '../file-thumbnail';
import ConfirmDialog from '../confirm-dialog';


DocumentGalleryItem.propTypes = {
    image: PropTypes.shape({
        src: PropTypes.string,
        thumbnail: PropTypes.string,
        name: PropTypes.string,
        category: PropTypes.string,
        fileType: PropTypes.string,
        extension: PropTypes.string,
        postAt: PropTypes.instanceOf(Date)
    }),
    isLoading: PropTypes.bool,
    onOpenLightbox: PropTypes.func,
    onOpenFile: PropTypes.func,
    onDownloadFile: PropTypes.func,
    onDeleteFile: PropTypes.func,
    toolbar: PropTypes.bool,
    isArchived: PropTypes.bool,
    size: PropTypes.number,
};

export function DocumentGalleryItem({ image, isLoading, onOpenLightbox, onOpenFile, onDownloadFile, onDeleteFile, toolbar, isArchived, size = 150 }) {

    const [deleteConfirm, seDeleteConfirm] = useState(false);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const theme = useTheme();
    const { src, extension, name, fileType } = image;

    return (
        <>
            {!isLoading ? (
                <Card
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    sx={{
                        cursor: 'pointer',
                        position: 'relative',
                        display: 'flex',  // Make the card a flex container
                        flexDirection: 'column',  // Stack children vertically
                        alignItems: 'center',  // Center items horizontally
                        justifyContent: 'center',  // Center items vertically
                        '&:hover .button-group': {
                            opacity: 1,
                        },
                        width: '100%',
                        height: size,
                        borderRadius: '10px'
                    }}
                >

                    {fileType?.startsWith('image') ? (
                        <Image alt="gallery" sx={{ height: '100%' }} ratio="1/1" src={src} onClick={onOpenLightbox} />
                    ) : (
                        <CardMedia sx={{ height: '90%', width: '100%', backgroundSize: '40%', backgroundPosition: 'center 35%' }} image={fileThumb(extension?.toLowerCase())} onClick={() => fileType?.startsWith('application/pdf') && onOpenFile ? onOpenFile() : null} />
                    )}

                    {toolbar &&
                        <ButtonGroup
                            className="button-group"
                            variant="contained"
                            aria-label="outlined primary button group"
                            sx={{
                                position: 'absolute',
                                top: 0,
                                opacity: isHovered ? 1 : 0,
                                transition: 'opacity 0.3s ease-in-out',
                                width: '100%',
                                // justifyContent:'space-evenly'
                            }}
                        >
                            <Button sx={{ width: onDeleteFile && !isArchived ? '33%' : '50%', borderRadius: 0 }} disabled={!(fileType?.startsWith('image') || !fileType?.startsWith('video') || fileType?.startsWith('application/pdf'))} onClick={(fileType?.startsWith('image') || fileType?.startsWith('video')) ? onOpenLightbox : onOpenFile}><Iconify icon="carbon:view" /></Button>
                            {onDownloadFile && <Button sx={{ width: onDeleteFile && !isArchived ? '33%' : '50%', borderRadius: 0 }}><Iconify icon="solar:download-square-linear" onClick={onDownloadFile} /></Button>}
                            {onDeleteFile && !isArchived && <Button sx={{ width: '34%', borderRadius: 0 }} color='error' onClick={() => seDeleteConfirm(true)}><Iconify icon="radix-icons:cross-circled" /></Button>}
                        </ButtonGroup>
                    }

                    <Stack
                        padding={1}
                        sx={{
                            ...bgBlur({
                                color: theme.palette.grey[900],
                            }),
                            width: 1,
                            left: 0,
                            bottom: 0,
                            position: 'absolute',
                            color: 'common.white',
                            textAlign: 'center'
                        }}
                    >
                        <Typography variant="body2">
                            {name?.length > 14 ? name?.substring(0, 14) : name}
                            {name?.length > 14 ? '...' : null}
                        </Typography>
                    </Stack>
                </Card>

            ) : (<SkeletonGallery />)
            }

            <ConfirmDialog
                open={deleteConfirm}
                onClose={() => seDeleteConfirm(false)}
                title='Delete'
                content='Are you sure you want to delete?'
                action={
                    <Button variant='contained' onClick={() => {
                        onDeleteFile()
                        seDeleteConfirm(false);
                    }} color='error'>Delete</Button>
                }
                SubButton="Cancel"
            />

        </>
    );
}