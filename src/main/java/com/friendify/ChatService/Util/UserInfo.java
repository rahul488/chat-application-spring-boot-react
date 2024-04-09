package com.friendify.ChatService.Util;

import com.friendify.ChatService.Entity.User;
import com.friendify.ChatService.Repo.UserRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Component;

import java.util.Optional;

@Component
public class UserInfo implements UserDetailsService {
    @Autowired
    private UserRepo userRepo;
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> userInfo = userRepo.findByEmail(username);
        userInfo.orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + username));
        return userInfo.map(UserCustomDetailService::new).get();
    }
}
