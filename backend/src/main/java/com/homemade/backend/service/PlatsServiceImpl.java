package com.homemade.backend.service;

import com.homemade.backend.dao.PlatsRepository;
import com.homemade.backend.dao.UserRepository;
import com.homemade.backend.dto.PlatsDto;
import com.homemade.backend.entite.CookProfile;
import com.homemade.backend.entite.Plats;
import com.homemade.backend.entite.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.security.Principal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class PlatsServiceImpl implements PlatsService{

    private final PlatsRepository platsRepository;
    private final UserRepository userRepository;


    @Autowired
    public PlatsServiceImpl(PlatsRepository platsrepository, UserRepository userRepository) {

        this.platsRepository = platsrepository;
        this.userRepository = userRepository;
    }

    @Override
    public List<PlatsDto> getAllPlatsDto() {
        List<Plats> plats = (List<Plats>) platsRepository.findAll();
        return plats.stream().map(this::convertToDto).collect(Collectors.toList());
    }

    @Override
    public PlatsDto createPlat(PlatsDto platsDto, Principal principal) {
        String username = principal.getName();
        CookProfile cookProfile = getCookProfileByUsername(username);
        if(cookProfile == null) {
            throw new RuntimeException("User not found");
        }
        Plats plat = convertToEntity(platsDto);
        plat.setCook(cookProfile);
        Plats savedPlat = platsRepository.save(plat);
        return convertToDto(savedPlat);
    }



    @Override
    public PlatsDto getPlatDtoById(Long id) {
        Plats plat = platsRepository.findById(id).orElse(null);
        return plat != null ? convertToDto(plat) : null;
    }

    //modifier un client
    @Override
    public PlatsDto modifierPlat(PlatsDto platDto, Long id) {
        // On récupère l'ancien plat dans la base de données
        Plats existingPlat = platsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plat not found with id: " + id));

        // Update fields from DTO
        existingPlat.setNom(platDto.getNom());
        existingPlat.setDescription(platDto.getDescription());
        existingPlat.setPrix(platDto.getPrix());
        existingPlat.setImage(platDto.getImage());
        existingPlat.setNote(platDto.getNote());
        existingPlat.setTemps_preparation(platDto.getTemps_preparation());
        existingPlat.setType_cuisine(platDto.getType_cuisine());
        existingPlat.setNombre_personnes(platDto.getNombre_personnes());
        existingPlat.setIngredients(platDto.getIngredients());
        existingPlat.setAllergies(platDto.getAllergies());

        Plats updatedPlat = platsRepository.save(existingPlat);
        return convertToDto(updatedPlat);
    }


    @Override
    public void supprimerPlat(Long id) {
        platsRepository.deleteById(id);
    }

    @Override
    public CookProfile getCookProfileByUsername(String username){
        User user = userRepository.findByEmail(username);
        return user != null ? user.getCookProfile() : null;
    };

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

    private Plats convertToEntity(PlatsDto platDto) {
        Plats plat = new Plats();
        plat.setId(platDto.getId());
        plat.setNom(platDto.getNom());
        plat.setDescription(platDto.getDescription());
        plat.setPrix(platDto.getPrix());
        plat.setImage(platDto.getImage());
        plat.setNote(platDto.getNote());
        plat.setTemps_preparation(platDto.getTemps_preparation());
        plat.setType_cuisine(platDto.getType_cuisine());
        plat.setNombre_personnes(platDto.getNombre_personnes());
        plat.setIngredients(platDto.getIngredients());
        plat.setAllergies(platDto.getAllergies());
        return plat;
    }




}
