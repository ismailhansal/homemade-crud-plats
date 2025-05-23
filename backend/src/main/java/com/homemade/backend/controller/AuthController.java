package com.homemade.backend.controller;

import com.homemade.backend.dto.AuthResponse;
import com.homemade.backend.dto.LoginRequest;
import com.homemade.backend.dto.RegisterRequest;
import com.homemade.backend.dto.UpdateUserRequest;
import com.homemade.backend.entite.User;
import com.homemade.backend.enums.Role;
import com.homemade.backend.service.AuthenticationService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3001") // ← ICI

public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;



    // Endpoint pour l'authentification de l'utilisateur
    @PostMapping("/login/client")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        // Authentifier l'utilisateur avec les informations de connexion
        String token = authenticationService.authenticate(loginRequest.getEmail(), loginRequest.getPassword());

        if (token != null) {
            // Retourner le token JWT en réponse
            return ResponseEntity.ok(new AuthResponse(token));
        } else {
            // Retourner un message d'erreur si l'authentification échoue
            return ResponseEntity.status(401).body(new AuthResponse("Invalid credentials"));
        }



    }

    @PostMapping("/signup/client")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request) {
        try {
            authenticationService.registerUser(request);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/me")
    public ResponseEntity<Map<String,Object>> getCurrentUser(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build(); // pas authentifié
        }

        String email = userDetails.getUsername();
        User user = authenticationService.getUserByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        Map<String, Object> response = new HashMap<>();
        response.put("id", user.getId());
        response.put("firstname", user.getFirstname());
        response.put("lastname", user.getLastname());
        response.put("email", user.getEmail());
        response.put("phoneNumber", user.getPhoneNumber());
        response.put("roles", user.getRoles().stream().map(Role::name).collect(Collectors.toList()));

        if (user.getClientProfile() != null) {
            response.put("address", user.getClientProfile().getAdresseClient());
        } else if (user.getCookProfile() != null) {
            response.put("address", user.getCookProfile().getCookAddress());
        }

        return ResponseEntity.ok(response);
    }

    @PutMapping("/me")
    public ResponseEntity<User> updateUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid  @RequestBody UpdateUserRequest request) {

        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        String email = userDetails.getUsername();
        try {
            User updatedUser = authenticationService.updateUserInfo(email, request);
            return ResponseEntity.ok(updatedUser);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }



}


