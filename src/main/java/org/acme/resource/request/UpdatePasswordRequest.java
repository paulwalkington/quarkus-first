package org.acme.resource.request;

public record UpdatePasswordRequest(String currentPassword, String newPassword) {
}
