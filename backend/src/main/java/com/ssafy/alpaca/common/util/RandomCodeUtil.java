package com.ssafy.alpaca.common.util;

import java.security.SecureRandom;
import java.util.Date;

public class RandomCodeUtil {
    private static final char[] charSet = { '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
            'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
            'Y', 'Z' };
    private static final int SET_LENGTH = charSet.length;

    public static String getRandomCode() {
        StringBuffer sb = new StringBuffer();
        SecureRandom sr = new SecureRandom();
        sr.setSeed(new Date().getTime());

        for (int i = 0; i < 24; i++) {
            sb.append(charSet[sr.nextInt(SET_LENGTH)]);
        }

        return sb.toString();
    }
}
