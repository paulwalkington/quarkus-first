package org.acme.exception;

import org.jboss.resteasy.reactive.RestResponse;
import org.jboss.resteasy.reactive.server.ServerExceptionMapper;

import jakarta.ws.rs.core.Response;

class ExceptionHandler {

    @ServerExceptionMapper
    public RestResponse<Object> failedToAddToDatabaseExceptionHandler(FailedToAddToDatabaseException x) {

        ErrorResponse errorResponse = new ErrorResponse(101, x.getMessage());

        return RestResponse.status(Response.Status.INTERNAL_SERVER_ERROR, errorResponse);
    }
}