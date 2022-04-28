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
}
