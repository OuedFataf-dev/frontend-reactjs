import {
    POST_CONTENT_REQUEST,
    POST_CONTENT_SUCCESS,
    POST_CONTENT_FAILURE,
  } from './actions';
  
  const initialState = {
    loading: false,
    data: null,
    error: null,
  };
  
  const rootReducer = (state = initialState, action) => {
    switch (action.type) {
      case POST_CONTENT_REQUEST:
        return { ...state, loading: true };
      case POST_CONTENT_SUCCESS:
        return { loading: false, data: action.payload, error: null };
      case POST_CONTENT_FAILURE:
        return { loading: false, error: action.payload };
      default:
        return state;
    }
  };
  
  export default rootReducer;
  