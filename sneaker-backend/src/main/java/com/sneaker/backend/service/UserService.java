package com.sneaker.backend.service;

import com.sneaker.backend.entity.User;

public interface UserService {

    User register(User user);

    User login(String username, String password);
}