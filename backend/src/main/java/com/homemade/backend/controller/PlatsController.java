package com.homemade.backend.controller;

import com.homemade.backend.entite.Plats;
import com.homemade.backend.service.PlatsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/plats")
@CrossOrigin(origins = "http://localhost:3001")  // Autorise uniquement l'origine spécifiée


public class PlatsController {

private final PlatsService platsService;

@Autowired
public PlatsController(PlatsService platsService) {
    this.platsService = platsService;
}



    // Endpoint pour récupérer tous les plats
    @GetMapping
    public List<Plats> getAllPlats() {
        return platsService.getAllPlats();
    }

    // Endpoint pour récupérer un plat par son ID
    @GetMapping("/{id}")
    public ResponseEntity<Plats> getPlatById(@PathVariable Long id) {
        Plats plat = platsService.getPlatById(id);
        if (plat != null) {
            return new ResponseEntity<>(plat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint pour créer un nouveau plat
    @PostMapping("/save")
    public ResponseEntity<Plats> createPlat(@RequestBody Plats plat) {
        Plats createdPlat = platsService.createPlat(plat);
        return new ResponseEntity<>(createdPlat, HttpStatus.CREATED);
    }

    // Endpoint pour modifier un plat
    @PutMapping("/{id}")
    public ResponseEntity<Plats> updatePlat(@PathVariable Long id, @RequestBody Plats plat) {
        plat.setId(id);  // On s'assure que l'ID du plat à modifier est celui dans l'URL
        Plats updatedPlat = platsService.modifierPlat(plat);
        if (updatedPlat != null) {
            return new ResponseEntity<>(updatedPlat, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // Endpoint pour supprimer un plat
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlat(@PathVariable Long id) {
        Plats plat = platsService.getPlatById(id);
        if (plat != null) {
            platsService.supprimerPlat(plat);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);  // Suppression réussie
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);  // Plat non trouvé
        }
    }









}
