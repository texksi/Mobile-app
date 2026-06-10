package com.mobileapp.service;

import com.mobileapp.dto.request.LoginRequestDTO;
import com.mobileapp.dto.request.RegisterRequestDTO;
import com.mobileapp.dto.response.AuthResponseDTO;
import com.mobileapp.exceptions.EntityAlreadyExistsException;
import com.mobileapp.exceptions.EntityNotFoundException;
import com.mobileapp.model.Korisnik;
import com.mobileapp.model.enums.Role;
import com.mobileapp.repository.KorisnikRepository;
import com.mobileapp.security.JwtService;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class AuthService {

    private final KorisnikRepository korisnikRepository;
    private final JwtService jwtService;
    private final BCryptPasswordEncoder passwordEncoder;

    public AuthResponseDTO register(RegisterRequestDTO dto) {
        if (korisnikRepository.existsByUsername(dto.getUsername())) {
            throw new EntityAlreadyExistsException("Korisnik sa tim username-om vec postoji");
        }
        if (korisnikRepository.existsByEmail(dto.getEmail())) {
            throw new EntityAlreadyExistsException("Korisnik sa tim email-om vec postoji");
        }
        Korisnik korisnik = Korisnik.builder()
                .ime(dto.getIme())
                .prezime(dto.getPrezime())
                .email(dto.getEmail())
                .username(dto.getUsername())
                .password(passwordEncoder.encode(dto.getPassword()))
                .role(Role.KORISNIK)
                .build();
        korisnikRepository.save(korisnik);
        String token = jwtService.generateToken(korisnik.getUsername(), korisnik.getRole());
        return new AuthResponseDTO(token);
    }

    public AuthResponseDTO login(LoginRequestDTO dto) {
        Korisnik korisnik = korisnikRepository.findByUsername(dto.getUsername())
                .orElseThrow(() -> new EntityNotFoundException("Korisnik ne postoji"));

        if (!passwordEncoder.matches(dto.getPassword(), korisnik.getPassword())) {
            throw new RuntimeException("Pogrešna lozinka");
        }

        String token = jwtService.generateToken(korisnik.getUsername(), korisnik.getRole());
        return new AuthResponseDTO(token);
    }
}