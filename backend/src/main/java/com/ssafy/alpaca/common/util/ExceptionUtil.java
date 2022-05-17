package com.ssafy.alpaca.common.util;

public class ExceptionUtil {
    private ExceptionUtil() {
        throw new IllegalStateException(UTILITY_CLASS);
    }
    /* 400 BAD_REQUEST : 잘못된 요청 */
    public static final String NOT_VALID_VALUE = "존재하지 않거나, 유효하지 않는 요청 값이 있습니다."; // NoSOANR
    public static final String ROOMMAKER_CANNOT_RESIGN = "스터디에서 방장을 맡고 있으면 탈퇴할 수 없습니다.";
    public static final String INVALID_DATE_VALUE = "종료시간이 더 빠를 수 없습니다.";
    public static final String TOO_MANY_MEMBERS = "스터디 멤버는 12명을 초과할 수 없습니다.";
    public static final String TOO_MANY_STUDIES = "스터디는 100개를 초과할 수 없습니다.";
    public static final String INVITE_CODE_NOT_EXISTS = "초대코드가 존재하지 않습니다.";
    public static final String FILE_NOT_CONVERT = "파일을 변환할 수 없습니다.";

    /* 401 UNAUTHORIZED : 인증되지 않은 사용자 */
    public static final String NOT_MYSELF = "본인이 아닙니다.";
    public static final String USER_PW_INVALID = "비밀번호가 일치하지 않습니다.";
    public static final String INVALID_AUTH_TOKEN = "토큰이 만료되었습니다.";
    public static final String INVALID_REFRESH_TOKEN = "리프레시 토큰이 유효하지 않습니다";
    public static final String MISMATCH_REFRESH_TOKEN = "리프레시 토큰의 사용자 정보가 일치하지 않습니다";
    public static final String UNAUTHORIZED_USER = "권한이 없는 사용자 입니다";
    public static final String INVITE_CODE_INVALID = "초대코드가 일치하지 않습니다.";

    /* 404 NOT_FOUND : Resource를 찾을 수 없음 */
    public static final String USER_NOT_FOUND = "존재하지 않는 사용자입니다.";
    public static final String STUDY_NOT_FOUND = "존재하지 않는 스터디입니다.";
    public static final String SCHEDULE_NOT_FOUND = "존재하지 않는 일정입니다.";
    public static final String PROBLEM_NOT_FOUND = "존재하지 않는 문제 번호입니다.";
    public static final String LANGUAGE_NOT_FOUND = "지원하지 않는 언어입니다.";
    public static final String USER_NOT_FOUND_IN_STUDY = "함께 스터디하는 사용자가 아닙니다.";

    /* 409 CONFLICT : Resource의 현재 상태와 충돌. 보통 중복된 데이터 존재 */
    public static final String USER_NICKNAME_DUPLICATE = "중복된 사용자 닉네임입니다.";
    public static final String USER_ID_DUPLICATE = "중복된 사용자 ID입니다.";
    public static final String USER_STUDY_DUPLICATE = "이미 해당 스터디에 가입된 사용자입니다.";
    public static final String STUDY_DATE_DUPLICATE = "해당 일자에 이미 스터디가 예정되어있습니다.";

    /* 500 */
    public static final String UTILITY_CLASS = "유틸리티 클래스입니다.";
    public static final String SERVER_ERROR_WAIT = "잠시 후 다시 시도해주세요.";

}
