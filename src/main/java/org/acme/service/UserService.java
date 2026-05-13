package org.acme.service;

import at.favre.lib.crypto.bcrypt.BCrypt;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.transaction.Transactional;

import org.acme.domain.User;
import org.acme.repository.UserEntity;
import org.acme.repository.UserRepository;
import org.acme.resource.request.CreateUserRequest;
import org.acme.resource.request.UpdatePasswordRequest;
import org.acme.resource.request.UpdateUserRequest;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    public UserRepository userRepository;

    @Transactional
    public User addUser(CreateUserRequest request) {
        UserEntity entity = new UserEntity();
        entity.id = UUID.randomUUID().toString();
        entity.username = request.username();
        entity.password = BCrypt.withDefaults().hashToString(12, request.password().toCharArray());
        entity.role = request.role();
        userRepository.persist(entity);
        return entity.toDomain();
    }

    public List<User> listAllUsers() {
        return userRepository.listAll().stream().map(UserEntity::toDomain).toList();
    }

    public Optional<User> getUserByUsername(String username) {
        return Optional.ofNullable(userRepository.findByUsername(username))
                .map(UserEntity::toDomain);
    }

    public Optional<User> findUser(String username, String password) {
        UserEntity entity = userRepository.findByUsername(username);
        if (entity == null || !BCrypt.verifyer().verify(password.toCharArray(), entity.password).verified) {
            return Optional.empty();
        }
        return Optional.of(entity.toDomain());
    }

    @Transactional
    public Optional<User> updateUser(String id, UpdateUserRequest request) {
        UserEntity entity = userRepository.findById(id);
        if (entity == null) {
            return Optional.empty();
        }
        entity.username = request.username();
        entity.role = request.role();
        if (request.password() != null && !request.password().isBlank()) {
            entity.password = BCrypt.withDefaults().hashToString(12, request.password().toCharArray());
        }
        userRepository.persist(entity);
        return Optional.of(entity.toDomain());
    }

    @Transactional
    public boolean updatePassword(String username, UpdatePasswordRequest request) {
        UserEntity entity = userRepository.findByUsername(username);
        if (entity == null || !BCrypt.verifyer().verify(request.currentPassword().toCharArray(), entity.password).verified) {
            return false;
        }
        entity.password = BCrypt.withDefaults().hashToString(12, request.newPassword().toCharArray());
        userRepository.persist(entity);
        return true;
    }

    @Transactional
    public boolean deleteUser(String id) {
        return userRepository.deleteById(id);
    }

    @Transactional
    public Optional<User> updateProfilePicture(String username, String profilePicture) {
        UserEntity entity = userRepository.findByUsername(username);
        if (entity == null) {
            return Optional.empty();
        }
        entity.profilePicture = profilePicture;
        userRepository.persist(entity);
        return Optional.of(entity.toDomain());
    }
}