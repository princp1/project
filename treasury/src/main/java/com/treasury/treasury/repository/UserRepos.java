package com.treasury.treasury.repository;
import com.treasury.treasury.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepos extends JpaRepository<User, Integer> {
    Optional<User> findByLogin(String login);
}

