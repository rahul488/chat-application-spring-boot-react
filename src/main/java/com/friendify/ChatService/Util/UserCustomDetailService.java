package com.friendify.ChatService.Util;

import com.friendify.ChatService.Entity.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
public class UserCustomDetailService implements UserDetails {

    private String email;
    private String password;
    private List<GrantedAuthority> authorities;

    private String name;

    private int id;

    public UserCustomDetailService(User userInfo) {
        email=userInfo.getEmail();
        password=userInfo.getPassword();
        authorities= Arrays.stream(userInfo.getRole().split(","))
                .map(SimpleGrantedAuthority::new)
                .collect(Collectors.toList());
        name = userInfo.getName();
        id = userInfo.getId();
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return email;
    }

    public String getName(){
        return name;
    }

    public int getUserId() {return  id;}

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }

}
