package com.mobileapp.service;

import com.mobileapp.exceptions.EntityNotFoundException;
import com.mobileapp.model.Korisnik;
import com.mobileapp.repository.KorisnikRepository;
import com.mobileapp.security.UserPrincipal;
import lombok.AllArgsConstructor;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class MyUserDetailsService implements UserDetailsService {
    
    private final KorisnikRepository korisnikRepository;

    @Override
    public @NonNull UserDetails loadUserByUsername(@NonNull String username) throws UsernameNotFoundException {
        Korisnik korisnik = korisnikRepository.findByUsername(username)
                .orElseThrow(() -> new EntityNotFoundException("Korisnik ne postoji"));
        return new UserPrincipal(korisnik);
    }
}
