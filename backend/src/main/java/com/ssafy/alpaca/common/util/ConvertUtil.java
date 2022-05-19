package com.ssafy.alpaca.common.util;

import org.apache.tomcat.util.codec.binary.Base64;
import org.apache.tomcat.util.codec.binary.StringUtils;
import org.springframework.stereotype.Component;

@Component
public class ConvertUtil {
    public String convertByteArrayToString(Byte[] bytes) {
        if (bytes==null){
            return null;
        }
        byte [] primitiveBytes = new byte[bytes.length];
        int j = 0;
        for (Byte b: bytes) {
            primitiveBytes[j++] = b;
        }
        return "data:image/png;base64," + StringUtils.newStringUtf8(Base64.encodeBase64(primitiveBytes, false));
    }

    private String convertTimeToString(int number) {
        return String.format("%02d", number);
    }

    public String getTime(Integer offset) {
        if (offset == 0) {
            return "Z";
        } else {
            StringBuilder ret = new StringBuilder(0 < offset ? "-" : "+");
            int hour = Math.abs(offset/60);
            int minute = Math.abs(offset%60);

            ret.append(convertTimeToString(hour));
            ret.append(":");
            ret.append(convertTimeToString(minute));
            return ret.toString();
        }
    }

}
