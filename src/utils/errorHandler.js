
export const handleError = ( errorResponse ) => {

    if (typeof errorResponse === 'string') {
      return errorResponse;
    }

    if ( errorResponse?.Message ) {
        return errorResponse.Message;
    }

    if (errorResponse?.message) {
      return errorResponse.message;
    }

    if (errorResponse?.response?.data?.message) {
      return errorResponse.response.data.message;
    }

    if (Array.isArray( errorResponse?.errors ) && errorResponse?.errors?.every( ere => typeof ere === 'string') ) {
      return errorResponse.errors.join(', ');
    }

    if (Array.isArray( errorResponse?.errors ) && errorResponse?.errors?.every( ere => typeof ere?.message === 'string') ) {
        return errorResponse.errors?.map( ere => ere?.message )?.join(', ');
    }

    return '';
}