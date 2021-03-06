package com.ssafy.alpaca.common.etc;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ssafy.alpaca.db.entity.User;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Collections;


@Getter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CustomUserDetails implements UserDetails {

    private String username;
    private String password;


    public static UserDetails of(User user) {
        return CustomUserDetails.builder()
                .username(user.getUsername())
                .password(user.getPassword())
                .build();
    }

    @Override
    @JsonIgnore
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return Collections.emptySet();
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonExpired() {
        return false;
    }

    @Override
    @JsonIgnore
    public boolean isAccountNonLocked() {
        return false;
    }

    @Override
    @JsonIgnore
    public boolean isCredentialsNonExpired() {
        return false;
    }

    @Override
    @JsonIgnore
    public boolean isEnabled() {
        return false;
    }
}
