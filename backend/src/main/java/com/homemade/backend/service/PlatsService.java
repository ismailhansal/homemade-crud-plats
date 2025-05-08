package com.homemade.backend.service;

import com.homemade.backend.entite.Plats;

import java.util.List;

public interface PlatsService {
    public List<Plats> getAllPlats();
    public Plats createPlat(Plats p);
    public Plats modifierPlat(Plats p) ;
    public Plats getPlatById(Long  id);
    public void supprimerPlat(Plats p);


}
