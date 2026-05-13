package org.acme.resource.request;

public record CreateUserRequest(String username, String password, String role) {
}