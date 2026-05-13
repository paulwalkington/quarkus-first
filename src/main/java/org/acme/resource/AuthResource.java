package org.acme.resource;

import at.favre.lib.crypto.bcrypt.BCrypt;
import io.smallrye.jwt.build.Jwt;
import jakarta.annotation.security.PermitAll;
import jakarta.annotation.security.RolesAllowed;
import jakarta.inject.Inject;
import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.PUT;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.Context;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import jakarta.ws.rs.core.SecurityContext;

import jakarta.transaction.Transactional;

import java.time.Duration;
import java.util.Set;

import org.acme.repository.UserEntity;
import org.acme.repository.UserRepository;
import org.acme.resource.request.LoginRequest;
import org.acme.resource.request.UpdateProfilePictureRequest;
import org.acme.resource.response.TokenResponse;
import org.acme.resource.response.UserResponse;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class AuthResource {

    @Inject
    UserRepository userRepository;

    @GET
    @Path("/me")
    @RolesAllowed({"admin", "user"})
    public Response me(@Context SecurityContext securityContext) {
        String username = securityContext.getUserPrincipal().getName();
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(new UserResponse(user.id, user.username, user.role, user.profilePicture)).build();
    }

    @PUT
    @Path("/me/picture")
    @RolesAllowed({"admin", "user"})
    @Consumes(MediaType.APPLICATION_JSON)
    @Transactional
    public Response updatePicture(@Context SecurityContext securityContext, UpdateProfilePictureRequest request) {
        String username = securityContext.getUserPrincipal().getName();
        UserEntity user = userRepository.findByUsername(username);
        if (user == null) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        user.profilePicture = request.profilePicture();
        userRepository.persist(user);
        return Response.ok(new UserResponse(user.id, user.username, user.role, user.profilePicture)).build();
    }

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
