import axios from 'axios';

const getToken = (mySessionId: string) => {
  return createSession(mySessionId).then((sessionId) => createToken(String(sessionId)));
};

const createSession = (sessionId: string) => {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify({ customSessionId: sessionId });
    axios
      .post(`${import.meta.env.VITE_OPENVIDU_BASE_URL}/openvidu/api/sessions`, data, {
        headers: {
          Authorization: 'Basic ' + btoa(`OPENVIDUAPP:${import.meta.env.VITE_OPENVIDU_SECRET}`),
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log('CREATE SESION', response);
        resolve(response.data.id);
      })
      .catch((response) => {
        let error = Object.assign({}, response);
        if (error.response && error.response.status === 409) {
          resolve(sessionId);
        } else {
          console.log(error);
          console.warn(
            `No connection to OpenVidu Server. This may be a certificate error at 
              ${import.meta.env.VITE_OPENVIDU_BASE_URL}`,
          );
          if (
            window.confirm(
              `No connection to OpenVidu Server. This may be a certificate error at 
                "${import.meta.env.VITE_OPENVIDU_BASE_URL}"\n\nClick OK to navigate and accept it. 
                If no certificate warning is shown, then check that your OpenVidu Server is up and running at 
                "${import.meta.env.VITE_OPENVIDU_BASE_URL}"`,
            )
          ) {
            window.location.assign(`${import.meta.env.VITE_OPENVIDU_BASE_URL}/accept-certificate`);
          }
        }
      });
  });
};

const createToken = (sessionId: string) => {
  return new Promise((resolve, reject) => {
    let data = JSON.stringify({});
    axios
      .post(
        `${import.meta.env.VITE_OPENVIDU_BASE_URL}/openvidu/api/sessions/${sessionId}/connection`,
        data,
        {
          headers: {
            Authorization: 'Basic ' + btoa(`OPENVIDUAPP:${import.meta.env.VITE_OPENVIDU_SECRET}`),
            'Content-Type': 'application/json',
          },
        },
      )
      .then((response) => {
        console.log('TOKEN', response);
        resolve(response.data.token);
      })
      .catch((error) => reject(error));
  });
};

export { getToken, createToken, createSession };
