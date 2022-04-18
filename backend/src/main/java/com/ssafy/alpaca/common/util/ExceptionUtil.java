package com.ssafy.alpaca.common.util;

public class ExceptionUtil {
    private ExceptionUtil() {
        throw new IllegalStateException(UTILITY_CLASS);
    }
    /* 400 BAD_REQUEST : 잘못된 요청 */
    public static final String CANNOT_FOLLOW_MYSELF = "자기자신은 초대 할 수 없습니다.";
    public static final String USER_PW_INVALID = "비밀번호가 일치하지 않습니다."; //NOSONAR
    public static final String NOT_MYSELF = "본인이 아닙니다.";
    public static final String NOT_VALID_VALUE = "존재하지 않거나, 유효하지 않는 요청 값이 있습니다.";

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    public static final String INVALID_REFRESH_TOKEN = "리프레시 토큰이 유효하지 않습니다";
    public static final String MISMATCH_REFRESH_TOKEN = "리프레시 토큰의 유저 정보가 일치하지 않습니다";
    public static final String INVALID_AUTH_TOKEN = "권한이 없는 토큰 정보입니다";
    public static final String UNAUTHORIZED_USER = "권한이 없는 사용자 입니다";

    /* 404 NOT_FOUND : Resource를 찾을 수 없음 */
    public static final String USER_NOT_FOUND = "회원이 없습니다.";

    /* 409 CONFLICT : Resource의 현재 상태와 충돌. 보통 중복된 데이터 존재 */
    public static final String USER_NICKNAME_DUPLICATE = "중복된 사용자 닉네임입니다.";
    public static final String USER_ID_DUPLICATE = "중복된 사용자 ID입니다.";

    /* 500 */
    public static final String UTILITY_CLASS = "유틸리티 클래스입니다.";

}
