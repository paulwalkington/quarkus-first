package org.acme.exception;

public class FailedToAddToDatabaseException extends RuntimeException {
    public FailedToAddToDatabaseException(String message) {
        super(message);
    }

    public FailedToAddToDatabaseException(String message, Throwable cause) {
        super(message, cause);
    }
}
