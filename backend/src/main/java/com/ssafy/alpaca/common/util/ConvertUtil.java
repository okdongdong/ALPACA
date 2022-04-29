package com.ssafy.alpaca.common.util;

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
        return new String(primitiveBytes);
    }
}
