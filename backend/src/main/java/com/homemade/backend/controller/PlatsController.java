package com.homemade.backend.controller;

import com.homemade.backend.dao.PlatsRepository;
import com.homemade.backend.dto.PlatsDto;
import com.homemade.backend.entite.CookProfile;
import com.homemade.backend.entite.Plats;
import com.homemade.backend.entite.User;
import com.homemade.backend.service.PlatsService;
import com.homemade.backend.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/plats")
@CrossOrigin(origins = "http://localhost:3001")  // Autorise uniquement l'origine spécifiée


public class PlatsController {

private final PlatsService platsService;
private final UserService userService;
private final PlatsRepository platsRepository;


@Autowired
public PlatsController(PlatsService platsService, UserService userService, PlatsRepository platsRepository) {

    this.platsService = platsService;
    this.userService = userService;
    this.platsRepository = platsRepository;
}



    // Endpoint pour récupérer tous les plats
    @GetMapping
    public ResponseEntity<List<PlatsDto>> getAllPlats() {
        List<PlatsDto> plats = platsService.getAllPlatsDto();
        return ResponseEntity.ok(plats);
    }

    // Endpoint pour récupérer un plat par son ID
    @GetMapping("/{id}")
    public ResponseEntity<PlatsDto> getPlatById(@PathVariable Long id) {
        PlatsDto plat = platsService.getPlatDtoById(id);
        if (plat != null) {
            return ResponseEntity.ok(plat);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    // Endpoint pour créer un nouveau plat
    @PostMapping("/save")
    public ResponseEntity<PlatsDto> createPlat(@Valid @RequestBody PlatsDto platDto, Principal principal) {
            PlatsDto createdPlat = platsService.createPlat(platDto, principal);
            return new ResponseEntity<>(createdPlat, HttpStatus.CREATED);

    }

    // Endpoint pour modifier un plat
    @PutMapping("/{id}")
    public ResponseEntity<PlatsDto> updatePlat(@PathVariable Long id, @Valid @RequestBody PlatsDto platDto) {
        PlatsDto updatedPlat = platsService.modifierPlat(platDto, id);
        return ResponseEntity.ok(updatedPlat);
    }

    // Endpoint pour supprimer un plat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlat(@PathVariable Long id) {
        platsService.supprimerPlat(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-dishes")
    public ResponseEntity<List<PlatsDto>> getDishesByCook(Principal principal) {
        User user = userService.getUserByUsername(principal.getName());
        if (user == null || user.getCookProfile() == null) {
            return ResponseEntity.ok(Collections.emptyList());
        }

        List<Plats> plats = platsRepository.findByCook(user.getCookProfile());
        List<PlatsDto> dtos = plats.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());

        return ResponseEntity.ok(dtos);
    }

    private PlatsDto convertToDto(Plats plat) {
        return new PlatsDto(
                plat.getId(),
                plat.getNom(),
                plat.getDescription(),
                plat.getPrix(),
                plat.getImage(),
                plat.getNote(),
                plat.getTemps_preparation(),
                plat.getType_cuisine(),
                plat.getNombre_personnes(),
                plat.getIngredients(),
                plat.getAllergies(),
                plat.getCook() != null ? plat.getCook().getUser().getFullName() : null
        );
    }








}
