import { enc, MD5, lib } from 'crypto-js';
import { allowedExtensions, imagesExtensions } from '../../../constants/document-constants';

  export const maxFiles = JSON.parse( localStorage.getItem('configurations'))?.find( ( c )=> c?.name === 'MAX_UPLOAD_FILES' )

  export const hashFilesMD5 = async (_files) => {
    const hashPromises = _files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const wordArray = MD5(lib.WordArray.create(arrayBuffer));
        const hashHex = wordArray.toString(enc.Hex);
        resolve(hashHex);
      };
      reader.onerror = () => {
        reject(new Error(`Error reading file: ${file?.name || '' }`));
      };
      reader.readAsArrayBuffer(file);
    }));
    try {
      const hashes = await Promise.all(hashPromises);
      return hashes;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  export const removeFileExtension = (filename) => {
    const lastDotIndex = filename.lastIndexOf('.');
    return lastDotIndex !== -1 ? filename.substring(0, lastDotIndex) : filename;
  };

  export const getRefferenceNumber = (filename) => {
    const words = removeFileExtension(filename).split(/\s+/);
    return words[0] || '';
  };

  export const getVersionNumber = (filename) => {
    const lastDotIndex = filename.lastIndexOf('.');
    filename = filename.substring(0, lastDotIndex);
    const words = filename.split(/\s+/);
    let version = words[words.length - 1];
      if (version.toLowerCase().includes('v')) {
        version = version.replace(/[Vv]/g, '');
      }else{
        version = "1";
      }
    return version;
  };

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
      if (value?.filter((v) => ( !v?._id || !v?.uploaded ) )?.length > ( Number(maxFiles?.value) || 20 ) ) {
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
    return true;
  };

  export const validateImageFileType = (value, options) => {
    const { path, createError } = options;
  
    if (value && Array.isArray(value)) {
      if (value?.filter((v)=> !v?._id)?.length > 20) {
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
    event: file?.event,
    name:`${file?.name}.${file?.extension}`,
    fileName: file?.name,
    fileExtension: file?.extension,
    type: file?.fileType,
    fileType: file?.fileType,
    preview: `data:${file?.fileType};base64, ${file?.thumbnail}`,
    src: `data:${file?.fileType};base64, ${file?.thumbnail}`,
    path:`${file?.name}.${file?.extension}`,
    downloadFilename:`${file?.name}.${file?.extension}`,
  }))