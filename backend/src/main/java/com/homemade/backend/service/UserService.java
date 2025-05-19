package com.homemade.backend.service;

import com.homemade.backend.entite.User;

public interface UserService {
    User getUserByUsername(String username);
}
