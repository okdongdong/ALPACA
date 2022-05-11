import axios, { AxiosInstance } from 'axios';

export const customAxios: AxiosInstance = axios.create({
  // baseURL이 작성되어있으므로 뒷부분만 작성해서 사용하면 됨
  baseURL: `${process.env.REACT_APP_BASE_URL}/api/v1`,
});

export const solvedAcAxios: AxiosInstance = axios.create({
  // baseURL이 작성되어있으므로 뒷부분만 작성해서 사용하면 됨
  baseURL: `${process.env.REACT_APP_SOLVED_AC_BASE_URL}/api/v3`,
});

// 요청 보내기 전 실행할 함수
const successRequest = async (config: any) => {
  // header의 type에러 방지 위해 null일 경우 빈 문자열 할당
  const token = localStorage.getItem('accessToken') || '';
  config.headers.Authorization = token;
  if (config.url === '/auth/reissue') {
    const refreshToken = localStorage.getItem('refreshToken') || '';
    config.headers.RefreshToken = refreshToken;
  }
  return config;
};

// 요청 실패시 실행할 함수
const failureRequest = async (error: any) => {
  return Promise.reject(error);
};

// 응답 성공시 실행할 함수
const successResponse = async (response: any) => {
  return response;
};

// 응답 실패시(에러발생) 실행할 함수
const failureResponse = async (error: any) => {
  const originalRequest = error.config;

  if (originalRequest.url === '/auth/reissue') {
    // 401에러가 발생하는 요청이 토큰갱신요청이면 무한재귀
    return Promise.reject(error);
  }

  if (
    error.response.status === 500 &&
    // error.response.data.message === '토큰이 만료되었습니다.' &&
    !originalRequest._retry
  ) {
    console.log('-----------Reissue');

    originalRequest._retry = true;
    return unauthorizedError(error);
  }
  return Promise.reject(error);
};

// 401에러 발생시 실행할 함수
const unauthorizedError = async (error: any) => {
  // 저장된 토큰을 다시 불러옴
  const refreshToken = localStorage.getItem('refreshToken') || '';
  const token = localStorage.getItem('accessToken') || '';

  // 토큰 refresh요청

  try {
    const res = await customAxios({
      method: 'post',
      url: `/auth/reissue`,
      headers: {
        Authorization: token,
        RefreshToken: refreshToken,
      },
    });

    // localStorage 초기화
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');

    // 토큰 재설정
    const grantType = res.data.grantType;
    const newAccessToken = grantType + res.data.accessToken;
    const newRefreshToken = grantType + res.data.refreshToken;

    // localStorage 설정
    localStorage.setItem('accessToken', newAccessToken);
    localStorage.setItem('refreshToken', newRefreshToken);

    // 새로받아온 토큰으로 axios요청 header재설정
    const originalRequest = error.config;
    customAxios.defaults.headers.common.Authorization = newAccessToken;
    originalRequest.headers.Authorization = newAccessToken;

    //실패했던 요청 재요청
    return customAxios(originalRequest);
  } catch (e) {}
  return Promise.reject(error);
};

// 요청(request)) interceptor
customAxios.interceptors.request.use(
  (config) => successRequest(config), // 정상적인 응답을 반환한 경우
  (error) => failureRequest(error), // 에러가 발생한 경우
);

// 응답(response) interceptor
customAxios.interceptors.response.use(
  (response) => successResponse(response), // 정상적인 응답을 반환한 경우
  (error) => failureResponse(error), // 에러가 발생한 경우
);
