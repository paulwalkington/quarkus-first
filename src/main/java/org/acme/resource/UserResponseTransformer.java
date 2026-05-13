package org.acme.resource;

import jakarta.enterprise.context.ApplicationScoped;

import org.acme.domain.User;
import org.acme.resource.response.UserResponse;

@ApplicationScoped
public class UserResponseTransformer {

    public UserResponse toUserResponse(User user) {
        return new UserResponse(user.id(), user.username(), user.role(), user.profilePicture());
    }
}