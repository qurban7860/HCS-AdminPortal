import PropTypes from 'prop-types';
// form
import { useFormContext, Controller } from 'react-hook-form';
// @mui
import { FormHelperText } from '@mui/material';
//
import { UploadAvatar, Upload, UploadBox } from '../upload';

// ----------------------------------------------------------------------

RHFUploadAvatar.propTypes = {
  name: PropTypes.string,
};

// ----------------------------------------------------------------------

export function RHFUploadAvatar({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <div>
          <UploadAvatar
            error={!!error}
            file={field.value}
            {...other}
          />

          {!!error && (
            <FormHelperText error sx={{ px: 2, textAlign: 'center' }}>
              {error.message}
            </FormHelperText>
          )}
        </div>
      )}
    />
  );
}

// ----------------------------------------------------------------------

RHFUploadBox.propTypes = {
  name: PropTypes.string,
};

export function RHFUploadBox({ name, ...other }) {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <UploadBox files={field.value} error={!!error} {...other} />
      )}
    />
  );
}

// ----------------------------------------------------------------------

RHFUpload.propTypes = {
  name: PropTypes.string,
  multiple: PropTypes.bool,
  rows: PropTypes.bool,
  helperText: PropTypes.node,
  machine:PropTypes.string,
  onChangeDocType: PropTypes.func,
  onChangeDocCategory: PropTypes.func,
  onChangeVersionNo: PropTypes.func,
  onChangeDisplayName: PropTypes.func,
  onChangeReferenceNumber: PropTypes.func,
  onChangeStockNumber: PropTypes.func,
  drawingPage:PropTypes.bool,
  imagesOnly:PropTypes.bool,
  dropZone:PropTypes.bool,
  onLoadImage: PropTypes.func,
  onDownload: PropTypes.func,
};

export function RHFUpload({ name, multiple, rows, helperText, machine,
  onChangeDocType,
  onChangeDocCategory,
  onChangeVersionNo,
  onChangeDisplayName,
  onChangeReferenceNumber,
  onChangeStockNumber,
  onLoadImage,
  onDownload,
  drawingPage, dropZone=true, imagesOnly, ...other }) {

  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) =>
        multiple ? (
          <Upload
            dropZone={dropZone}
            multiple
            imagesOnly={imagesOnly}
            onChangeDocType={onChangeDocType}
            onChangeDocCategory={onChangeDocCategory}
            onChangeVersionNo={onChangeVersionNo}
            onChangeDisplayName={onChangeDisplayName}
            onChangeReferenceNumber={onChangeReferenceNumber}
            onChangeStockNumber={onChangeStockNumber}
            onLoadImage={ onLoadImage }
            onDownload={ onDownload }
            rows={rows}
            drawingPage
            machine={machine}
            files={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )
            }
            {...other}
          />
        ) : (
          <Upload
            dropZone={dropZone}
            imagesOnly={imagesOnly}
            machine={machine}
            file={field.value}
            error={!!error}
            helperText={
              (!!error || helperText) && (
                <FormHelperText error={!!error} sx={{ px: 2 }}>
                  {error ? error?.message : helperText}
                </FormHelperText>
              )}
            {...other}
          />
        )
      }
    />
  );
}
