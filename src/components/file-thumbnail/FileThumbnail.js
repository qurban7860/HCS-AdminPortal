import PropTypes from 'prop-types';
// @mui
import { Box, Tooltip, Stack } from '@mui/material';
//
import { fileData, fileFormat, fileThumb } from './utils';
import DownloadButton from './DownloadButton';

// ----------------------------------------------------------------------

FileThumbnail.propTypes = {
  sx: PropTypes.object,
  rows: PropTypes.bool,
  imgSx: PropTypes.object,
  tooltip: PropTypes.bool,
  imageView: PropTypes.bool,
  onDownload: PropTypes.func,
  file: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

export default function FileThumbnail({ file, rows, tooltip, imageView, onDownload, sx, imgSx }) {

  const { name = '', path = '', preview = '' } = fileData(file);

  const format = fileFormat(path.toLowerCase() || preview.toLowerCase(), rows )?.toLowerCase();

  const renderContent =
    format === 'images' && imageView ? (
          <Box
        component="img"
        src={preview}
        sx={{
              width: 1,
              height: 1,
              pb:2.5,
              flexShrink: 0,
              objectFit: 'cover',
              ...imgSx,
            }}
      />
    ) : (
      <Box
        component="img"
        src={fileThumb(format.toLowerCase())}
        sx={{
          width: 70,
          height: 70,
          flexShrink: 0,
          ...sx,
        }}
      />
    );

  if (tooltip) {
    return (
      <Tooltip title={name}>
        <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
          {renderContent}
          {onDownload && <DownloadButton onDownload={onDownload} />}
        </Stack>
      </Tooltip>
    );
  }

  return (
    <Stack
          flexShrink={0}
          component="span"
          alignItems="center"
          justifyContent="center"
          sx={{
            width: 'fit-content',
            height: 'inherit',
          }}
        >
      {renderContent}
      {onDownload && <DownloadButton onDownload={onDownload} />}
    </Stack>
  );
}
