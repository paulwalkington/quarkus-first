package org.acme.resource;

import at.favre.lib.crypto.bcrypt.BCrypt;
import io.smallrye.jwt.build.Jwt;
import jakarta.annotation.security.PermitAll;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;

import java.time.Duration;
import java.util.Set;

import org.acme.repository.UserEntity;
import org.acme.repository.UserRepository;
import org.acme.resource.request.LoginRequest;
import org.acme.resource.response.TokenResponse;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserRepository userRepository;

    @POST
    @Path("/login")
    @PermitAll
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {
        UserEntity user = userRepository.findByUsername(request.username());
        if (user == null || !BCrypt.verifyer().verify(request.password().toCharArray(), user.password).verified) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        String token = Jwt.issuer("https://quarkus-getting-started.io")
                .upn(user.username)
                .subject(user.username)
                .groups(Set.of(user.role))
                .expiresIn(Duration.ofHours(24))
                .sign();
        return Response.ok(new TokenResponse(token)).build();
    }
}
