package org.acme.resource.request;

public record UpdateUserRequest(String username, String role, String password) {
}
