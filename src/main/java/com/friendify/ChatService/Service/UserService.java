package com.friendify.ChatService.Service;

import com.friendify.ChatService.Dto.CommonResponse;
import com.friendify.ChatService.Dto.CustomerResponseDto;
import com.friendify.ChatService.Dto.UserSignUpRequestDTO;
import com.friendify.ChatService.Entity.User;
import com.friendify.ChatService.Exception.EmailAlreadyExistException;
import com.friendify.ChatService.Exception.InvalidCredentialsException;
import com.friendify.ChatService.Repo.UserRepo;
import com.friendify.ChatService.Util.JwtUtil;
import com.friendify.ChatService.Util.UserCustomDetailService;
import com.friendify.ChatService.Util.UserInfo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;
import java.util.Optional;

@Service
public class UserService {
    @Autowired
    private UserRepo userRepo;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationProvider authManager;

    @Autowired
    private UserInfo customerInfo;
    @Autowired
    private BCryptPasswordEncoder passwordEncoder;


    public CommonResponse<?> signup(@RequestBody UserSignUpRequestDTO customerRequestDto) {

        User isCustomerExist = userRepo.findByEmail(customerRequestDto.getEmail()).orElse(null);
        if (isCustomerExist != null) {
            throw new EmailAlreadyExistException("Email Already Exist");
        }
        User customer = new User();
        customer.setEmail(customerRequestDto.getEmail());
        customer.setName(customerRequestDto.getName());
        customer.setPassword(passwordEncoder.encode(customerRequestDto.getPassword()));
        userRepo.save(customer);
        return new CommonResponse<>("Account created successfully", true, "");
    }

    public CommonResponse<?> createToken(@RequestBody UserSignUpRequestDTO customerSignInRequestDto) {
        UserCustomDetailService userDetails = (UserCustomDetailService) customerInfo
                .loadUserByUsername(customerSignInRequestDto.getEmail());
        String token = null;
        String userName = customerSignInRequestDto.getEmail();
        String password = customerSignInRequestDto.getPassword();
        try {
            Authentication authenticate = authManager.authenticate(new UsernamePasswordAuthenticationToken(userName, password));
            SecurityContextHolder.getContext().setAuthentication(authenticate);
        } catch (Exception e) {
            throw new InvalidCredentialsException("Invalid U/P");
        }
        token = jwtUtil.generateToken(userDetails);
        return new CommonResponse<>("Login success", true, new CustomerResponseDto(userDetails.getName(),
                userDetails.getUserId(), token, (List<SimpleGrantedAuthority>) userDetails.getAuthorities()));
    }
}
