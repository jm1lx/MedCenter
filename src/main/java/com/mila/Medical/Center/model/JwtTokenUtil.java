package com.mila.Medical.Center.model;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.context.annotation.Bean;
import org.springframework.stereotype.Component;


import java.security.Key;
import java.util.Date;
@Component
public class JwtTokenUtil {
    private static final Key SECRET_KEY = Keys.secretKeyFor(SignatureAlgorithm.HS512);  // Cambia esto a una clave segura

    public String generateClientToken(Client client) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + 864000000); // 10 días de duración, ajusta según sea necesario

        return Jwts.builder()
                .setSubject(client.getMail())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }

    public String generateDoctorToken(Doctor doctor) {
        Date now = new Date();
        Date expirationDate = new Date(now.getTime() + 864000000); // 10 días de duración, ajusta según sea necesario

        return Jwts.builder()
                .setSubject(doctor.getRegistrationNumber())
                .setIssuedAt(now)
                .setExpiration(expirationDate)
                .signWith(SignatureAlgorithm.HS512, SECRET_KEY)
                .compact();
    }


}
