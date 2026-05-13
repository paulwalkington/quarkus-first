package org.acme.repository;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import org.acme.domain.User;

@Entity
@Table(name = "users")
public class UserEntity extends PanacheEntityBase {

    @Id
    public String id;

    @Column(unique = true, nullable = false)
    public String username;

    @Column(nullable = false)
    public String password;

    @Column(nullable = false)
    public String role;

    @Column(name = "profile_picture", columnDefinition = "TEXT")
    public String profilePicture;

    public User toDomain() {
        return new User(id, username, role, profilePicture);
    }
}
