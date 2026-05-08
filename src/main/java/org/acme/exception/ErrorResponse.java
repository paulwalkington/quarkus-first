package org.acme.exception;

public record ErrorResponse(
        Integer errorCode,
        String message
) {
}
