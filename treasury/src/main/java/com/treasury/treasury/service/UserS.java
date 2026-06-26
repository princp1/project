package com.treasury.treasury.service;

import com.treasury.treasury.entity.User;
import com.treasury.treasury.repository.UserRepos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserS {
    private final UserRepos repository;

    public UserS(UserRepos repository) {
        this.repository = repository;
    }

    public List<User> getAll() {
        return repository.findAll();
    }

    public User getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public User findByLogin(String login) {
        return repository.findByLogin(login).orElse(null);
    }

    public User save(User user) {
        return repository.save(user);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}