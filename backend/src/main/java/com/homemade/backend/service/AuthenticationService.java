package com.homemade.backend.service;

import com.homemade.backend.dao.UserRepository;
import com.homemade.backend.dto.RegisterRequest;
import com.homemade.backend.entite.User;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Service
public class AuthenticationService {

    private static final String SECRET = "uneCléTrèsLongueTrèsSûreQuiFaitPlusDe64CaractèresPourHS512!!!!1234567890";

    @Autowired
    private UserRepository userRepository;


    @Autowired
    private PasswordEncoder passwordEncoder;

    public void registerUser(RegisterRequest request) {
        User user = new User();
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCuisine(request.getCuisine());
        user.setRole(request.getRole());

        userRepository.save(user);
    }


    public String authenticate(String email, String password) {
        System.out.println("Tentative de login avec email: " + email);
        System.out.println("Mot de passe fourni: " + password);

        User user = userRepository.findByEmail(email);

        if (user == null) {
            System.out.println("Aucun utilisateur trouvé avec cet email.");
            return null;
        }

        System.out.println("Mot de passe en base (hashé): " + user.getPassword());

        boolean passwordMatches = passwordEncoder.matches(password, user.getPassword());
        System.out.println("Mot de passe correspond ? " + passwordMatches);

        if (passwordMatches) {
            System.out.println("Authentification réussie !");
            return generateToken(user);
        } else {
            System.out.println("Mot de passe incorrect.");
            return null;
        }
    }


    // Générer un JWT pour l'utilisateur authentifié
    private String generateToken(User user) {
        SecretKey key = Keys.hmacShaKeyFor(SECRET.getBytes(StandardCharsets.UTF_8));
        return Jwts.builder()
                .setSubject(user.getUsername())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 1 jour
                .signWith(key, SignatureAlgorithm.HS512)
                .compact();
    }

    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }


}