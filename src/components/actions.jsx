import axios from 'axios';

export const POST_CONTENT_REQUEST = "POST_CONTENT_REQUEST";
export const POST_CONTENT_SUCCESS = "POST_CONTENT_SUCCESS";
export const POST_CONTENT_FAILURE = "POST_CONTENT_FAILURE";

export const postContent = (content, file) => {
  return async (dispatch) => {
    dispatch({ type: POST_CONTENT_REQUEST });
    try {
      const formData = new FormData();
      formData.append('content', content);
      if (file) formData.append('file', file);

      // Utilisation d'Axios pour envoyer la requête POST
      const response = await axios.post('', formData, {
        headers: {
          'Content-Type': 'multipart/form-data', // Spécifier le type de contenu
        },
      });

      dispatch({ type: POST_CONTENT_SUCCESS, payload: response.data });
    } catch (error) {
      // Si Axios renvoie une erreur, on peut obtenir le message d'erreur comme suit
      dispatch({ type: POST_CONTENT_FAILURE, payload: error.response ? error.response.data.message : error.message });
    }
  };
};
