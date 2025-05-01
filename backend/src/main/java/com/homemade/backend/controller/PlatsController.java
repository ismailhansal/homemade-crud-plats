package com.homemade.backend.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Arrays;
import java.util.List;
import java.util.Random;

@RestController
@RequestMapping("/api/plats")

public class PlatsController {

    private List<String> plats = List.of("Couscous", "Tajine", "Briouate", "Rfissa");

    @GetMapping("/random")
    public String getRandomPlat() {
        int index = new Random().nextInt(plats.size());
        return plats.get(index);
    }
}
