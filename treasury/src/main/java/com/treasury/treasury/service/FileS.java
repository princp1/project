package com.treasury.treasury.service;

import com.treasury.treasury.entity.File;
import com.treasury.treasury.repository.FileRepos;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class FileS {
    private final FileRepos repository;

    public FileS(FileRepos repository) {
        this.repository = repository;
    }

    public List<File> getAll() {
        return repository.findAll();
    }

    public File getById(Integer id) {
        return repository.findById(id).orElse(null);
    }

    public List<File> getByClaim(Integer claimId) {
        return repository.findByClaimId(claimId);
    }

    public File save(File file) {
        return repository.save(file);
    }

    public void delete(Integer id) {
        repository.deleteById(id);
    }
}