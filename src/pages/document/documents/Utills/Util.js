import { allowedExtensions } from '../../../../constants/document-constants';

export const validateFileType = (value, options) => {
    const { path, createError } = options;
    if (value && Array.isArray(value)) {
      if (value.length > 10) {
        return createError({
          message: 'Maximum 10 files can be uploaded at a time.',
          path,
          value,
        });
      }
      const invalidFiles = value.filter((file) => {
        const fileExtension = file?.name?.split('.').pop().toLowerCase();
        return !allowedExtensions.includes(fileExtension);
      });
      if (invalidFiles.length > 0) {
        const invalidFileNames = invalidFiles.map((file) => file.name).join(', ');
        return createError({
          message: `Invalid file(s) detected: ${invalidFileNames}`,
          path,
          value,
        });
      }
      return true;
    }
    return createError({
      message: 'File is required!',
      path,
      value,
    });
  };