package com.homemade.backend.service;

import com.homemade.backend.dao.PlatsRepository;
import com.homemade.backend.entite.Plats;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PlatsServiceImpl implements PlatsService{

    private final PlatsRepository platsRepository;


    @Autowired
    public PlatsServiceImpl(PlatsRepository platsrepository) {
            this.platsRepository = platsrepository;
    }

    // Récupérer tous les clients
    public List<Plats> getAllPlats() {
        return (List<Plats>) platsRepository.findAll();
    }


    // Créer un nouveau client
    public Plats createPlat(Plats p) {
        return platsRepository.save(p);
    }


    //recuperer un client pour le modifier
    @Override
    public Plats getPlatById(Long id) {
        return platsRepository.findById(id).orElse(null);
    }

    //modifier un client
    @Override
    public Plats modifierPlat(Plats p) {
        // On récupère l'ancien plat dans la base de données
        Plats oldPlat = platsRepository.findById(p.getId())
                .orElseThrow(() -> new RuntimeException("Plat non trouvé avec l'ID : " + p.getId()));

        // Ici, on met à jour oldPlat avec les nouvelles valeurs venant de p
        oldPlat.setNom(p.getNom());
        oldPlat.setDescription(p.getDescription());
        oldPlat.setPrix(p.getPrix());
        oldPlat.setImage(p.getImage());
        oldPlat.setNote(p.getNote());
        oldPlat.setTemps_preparation(p.getTemps_preparation());
        oldPlat.setType_cuisine(p.getType_cuisine());
        oldPlat.setNombre_personnes(p.getNombre_personnes());
        oldPlat.setIngredients(p.getIngredients());
        oldPlat.setAllergies(p.getAllergies());

        // On retourne oldPlat qui sera mis à jour dans la base de données
        return platsRepository.save(oldPlat);  // Ce n'est pas p, c'est oldPlat ici, car c'est l'entité modifiée
    }

    // Supprimer un client

    @Override
    public void supprimerPlat(Plats p) {
        platsRepository.delete(p);
    }




}
