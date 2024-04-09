package com.friendify.ChatService.Controller;

import com.friendify.ChatService.Dto.CommonResponse;
import com.friendify.ChatService.Dto.UserSignUpRequestDTO;
import com.friendify.ChatService.Service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
@CrossOrigin(origins = "*")
public class UserController {

    @Autowired
    private UserService customerService;

    @PostMapping("/signup")
    public ResponseEntity<CommonResponse> saveUser(@RequestBody UserSignUpRequestDTO customerRequestDto){
        return new ResponseEntity<>(customerService.signup(customerRequestDto), HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<CommonResponse> loginUser(@RequestBody UserSignUpRequestDTO customerSignInRequestDto){
        return  new ResponseEntity<>(customerService.createToken(customerSignInRequestDto),HttpStatus.OK);
    }
}
