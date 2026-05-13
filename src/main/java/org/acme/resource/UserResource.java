package org.acme.resource;

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

import java.time.Duration;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.acme.domain.User;
import org.acme.resource.request.CreateUserRequest;
import org.acme.resource.request.LoginRequest;
import org.acme.resource.request.UpdateProfilePictureRequest;
import org.acme.resource.response.TokenResponse;
import org.acme.resource.response.UserResponse;
import org.acme.service.UserService;

@Path("/auth")
@Produces(MediaType.APPLICATION_JSON)
public class UserResource {

    @Inject
    UserService userService;

    @Inject
    UserResponseTransformer transformer;

    @GET
    @Path("/users")
    @RolesAllowed("admin")
    public Response listUsers() {
        List<UserResponse> users = userService.listAllUsers()
                .stream()
                .map(transformer::toUserResponse)
                .toList();
        return Response.ok(users).build();
    }

    @GET
    @Path("/me")
    @RolesAllowed({"admin", "user"})
    public Response me(@Context SecurityContext securityContext) {
        String username = securityContext.getUserPrincipal().getName();
        Optional<User> user = userService.getUserByUsername(username);
        if (user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(transformer.toUserResponse(user.get())).build();
    }

    @PUT
    @Path("/me/picture")
    @RolesAllowed({"admin", "user"})
    @Consumes(MediaType.APPLICATION_JSON)
    public Response updatePicture(@Context SecurityContext securityContext, UpdateProfilePictureRequest request) {
        String username = securityContext.getUserPrincipal().getName();
        Optional<User> user = userService.updateProfilePicture(username, request.profilePicture());
        if (user.isEmpty()) {
            return Response.status(Response.Status.NOT_FOUND).build();
        }
        return Response.ok(transformer.toUserResponse(user.get())).build();
    }

    @POST
    @Path("/register")
    @RolesAllowed("admin")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response register(CreateUserRequest request) {
        User user = userService.addUser(request);
        return Response.ok(transformer.toUserResponse(user)).build();
    }

    @POST
    @Path("/login")
    @PermitAll
    @Consumes(MediaType.APPLICATION_JSON)
    public Response login(LoginRequest request) {
        Optional<User> user = userService.findUser(request.username(), request.password());
        if (user.isEmpty()) {
            return Response.status(Response.Status.UNAUTHORIZED).build();
        }
        String token = Jwt.issuer("https://quarkus-getting-started.io")
                .upn(user.get().username())
                .subject(user.get().username())
                .groups(Set.of(user.get().role()))
                .expiresIn(Duration.ofHours(24))
                .sign();
        return Response.ok(new TokenResponse(token)).build();
    }

}
