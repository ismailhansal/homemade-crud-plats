package com.homemade.backend.controller;

import com.homemade.backend.dto.AuthResponse;
import com.homemade.backend.dto.LoginRequest;
import com.homemade.backend.dto.RegisterRequest;
import com.homemade.backend.entite.User;
import com.homemade.backend.service.AuthenticationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
@CrossOrigin(origins = "http://localhost:3001") // ← ICI

public class AuthController {

    @Autowired
    private AuthenticationService authenticationService;



    // Endpoint pour l'authentification de l'utilisateur
    @PostMapping("/login/client")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest loginRequest) {
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
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        try {
            authenticationService.registerUser(request);
            return ResponseEntity.ok("User registered successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}


