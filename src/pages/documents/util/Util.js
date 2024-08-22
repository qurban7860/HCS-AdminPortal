import { allowedExtensions, imagesExtensions } from '../../../constants/document-constants';

const maxFiles = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'MAX_UPLOAD_FILES' )

  export const validateFileType = (value, options) => {
    const { path, createError } = options;
    if (value && Array.isArray(value)) {
      if (value.length > 20) {
        return createError({
          message: `Maximum ${ Number(maxFiles?.value) || 20 } files can be uploaded at a time.`,
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

  export const NotRequiredValidateFileType = (value, options) => {
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
    return true;
  };

  export const validateImageFileType = (value, options) => {
    const { path, createError } = options;
  
    if (value && Array.isArray(value)) {
      if (value.length > 20) {
        return createError({
          message: 'Maximum 20 files can be uploaded at a time.',
          path,
          value,
        });
      }
  
      const invalidFiles = value.filter((file) => {
        const fileExtension = file?.name?.split('.').pop().toLowerCase();
        return !imagesExtensions.includes(fileExtension);
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

  export const manipulateFiles =( filesData )=> filesData?.map(file => ({
    uploaded:true,
    key: file?._id,
    _id: file?._id,
    name:`${file?.name}.${file?.extension}`,
    type: file?.fileType,
    fileType: file?.fileType,
    preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
    src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
    path:`${file?.name}.${file?.extension}`,
    downloadFilename:`${file?.name}.${file?.extension}`,
  }))