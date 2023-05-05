
const regEx = /^[2][0-9][0-9]$/


export const dispatchReqAddAndView = (dispatch, dispatchAction,  reset, navigate, navigatePath, viewObject, enqueueSnackbar) =>{
    dispatch(dispatchAction).then(res => {
      console.log("res : ", res);
        if(regEx.test(res.status)){ 
          enqueueSnackbar(res.statusText)
          if(reset){
            reset()
          }
          if(navigatePath){
            navigate(navigatePath.view(res.data[viewObject]._id));
          }
        }else{
          enqueueSnackbar(res.statusText,{ variant: `error` })
        }
      }).catch(err => {
        if(err.Message){
          enqueueSnackbar(err.Message,{ variant: `error` })
        }else if(err.message){
          enqueueSnackbar(err.message,{ variant: `error` })
        }else{
          enqueueSnackbar("Something went wrong!",{ variant: `error` })
        }
      });
}

export const dispatchReqEditAndView = (dispatch, dispatchAction,  reset, navigate, navigatePath, id, enqueueSnackbar) =>{
  dispatch(dispatchAction).then(res => {
    console.log("res : ", res);
      if(regEx.test(res.status)){ 
        enqueueSnackbar(res.statusText)
        if(reset){
          reset()
        }
        if(navigatePath){
          navigate(navigatePath.view(id));
        }
      }else{
        enqueueSnackbar(res.statusText,{ variant: `error` })
      }
    }).catch(err => {
      if(err.Message){
        enqueueSnackbar(err.Message,{ variant: `error` })
      }else if(err.message){
        enqueueSnackbar(err.message,{ variant: `error` })
      }else{
        enqueueSnackbar("Something went wrong!",{ variant: `error` })
      }
    });
}

export const dispatchReqNavToList = (dispatch, dispatchAction, dispachReset , reset, navigate, navigatePath, enqueueSnackbar) =>{
  dispatch(dispatchAction).then(res => {
    console.log("res : ",res)
      if(regEx.test(res.status)){ 
      //   enqueueSnackbar(res.statusText)
        if(dispachReset){
          dispatch(dispachReset)
        }
        if(reset){
          reset()
        }
        if(navigatePath){
          navigate(navigatePath);
        }
      }else{
        enqueueSnackbar(res.statusText,{ variant: `error` })
      }
    }).catch(err => {
      if(err.Message){
        enqueueSnackbar(err.Message,{ variant: `error` })
      }else if(err.message){
        enqueueSnackbar(err.message,{ variant: `error` })
      }else{
        enqueueSnackbar("Something went wrong!",{ variant: `error` })
      }
    });
}

export const dispatchReq = (dispatch, dispatchAction, enqueueSnackbar) =>{
  dispatch(dispatchAction).then(res => {
      if(regEx.test(res.status)){ 
        enqueueSnackbar(res.statusText)
      }else{
        enqueueSnackbar(res.statusText,{ variant: `error` })
      }
    }).catch(err => {
      if(err.Message){
        enqueueSnackbar(err.Message,{ variant: `error` })
      }else if(err.message){
        enqueueSnackbar(err.message,{ variant: `error` })
      }else{
        enqueueSnackbar("Something went wrong!",{ variant: `error` })
      }
    });
}