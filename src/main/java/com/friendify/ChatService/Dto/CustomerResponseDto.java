package com.friendify.ChatService.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CustomerResponseDto {

    private String name;

    private int id;

    private String accessToken;

    private List<SimpleGrantedAuthority> role;
}
