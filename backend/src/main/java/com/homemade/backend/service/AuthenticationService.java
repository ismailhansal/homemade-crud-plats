package com.homemade.backend.service;

import com.homemade.backend.dao.ClientProfileRepository;
import com.homemade.backend.dao.UserRepository;
import com.homemade.backend.dto.RegisterRequest;
import com.homemade.backend.dto.UpdateUserRequest;
import com.homemade.backend.entite.ClientProfile;
import com.homemade.backend.entite.CookProfile;
import com.homemade.backend.entite.User;
import com.homemade.backend.enums.Role;
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

    private static final String SECRET = "P0$Tg1WlP9xZ@c2kY7R#z!qL8uDf6AhTP0$Tg1WlP9xZ@c2kY7R#z14785236951";

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private ClientProfileRepository clientProfileRepository;

    public void registerUser(RegisterRequest request) {
        User user = new User();
        user.setFirstname(request.getFirstName());
        user.setLastname(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getEmail());
        user.getRoles().add(Role.CLIENT);

        if("COOK".equalsIgnoreCase(request.getRole())){
            user.addRole(Role.COOK);
            CookProfile cookProfile = new CookProfile();
            cookProfile.setUser(user);
            cookProfile.setCookAddress("To be Updated");
            cookProfile.setSpecialty(request.getCuisine());
            user.setCookProfile(cookProfile);
        }
        ClientProfile clientProfile = new ClientProfile();
        clientProfile.setUser(user);
        clientProfile.setAdresseClient("To be Updated");
        user.setClientProfile(clientProfile);

        userRepository.save(user);

        //user.setCuisine(request.getCuisine());
        //user.setRole(request.getRole());
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

    public User updateUserInfo(String email, UpdateUserRequest request) {
        User user = getUserByEmail(email);
        if(user == null){
            throw new RuntimeException("User Not Found");
        }

        user.setFirstname(request.getFirstname());
        user.setLastname(request.getLastname());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setEmail(request.getEmail());

        ClientProfile clientProfile = user.getClientProfile();
        if(clientProfile != null){
            clientProfile.setAdresseClient(request.getAddress());
        }

        return userRepository.save(user);
    }


}