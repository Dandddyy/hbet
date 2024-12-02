package com.hbet.filter;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.auth0.jwt.interfaces.JWTVerifier;

import java.util.Date;

public class JwtUtil {
    private static final Algorithm algorithm = Algorithm.HMAC256("secretu93teagh8pp5ehgoaerh546gma9x0ro654e3guachf");

    public static String generateToken(String email, String role, String name, double money, int id) {
        return JWT.create()
                .withSubject(email)
                .withClaim("name", name)
                .withClaim("role", role)
                .withClaim("money", money)
                .withClaim("id", id)
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 10))
                .sign(algorithm);
    }

    public DecodedJWT verifyToken(String token) {
        JWTVerifier verifier = JWT.require(algorithm).build();
        return verifier.verify(token);
    }

    public String extractEmail(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        return decodedJWT.getSubject();
    }

    public Boolean isTokenExpired(String token) {
        DecodedJWT decodedJWT = verifyToken(token);
        return decodedJWT.getExpiresAt().before(new Date());
    }

    public Boolean validateToken(String token, String username) {
        final String tokenUsername = extractEmail(token);
        return (username.equals(tokenUsername) && !isTokenExpired(token));
    }
}