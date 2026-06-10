package com.mobileapp.security;

import com.mobileapp.model.Korisnik;
import org.jspecify.annotations.NonNull;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Collection;
import java.util.List;


public class UserPrincipal implements UserDetails {
    
    private Korisnik korisnik;

    public UserPrincipal(Korisnik korisnik){
        this.korisnik = korisnik;
    }

    @Override
    public @NonNull Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of(new SimpleGrantedAuthority("ROLE_" + korisnik.getRole().name()));
    }

    @Override
    public @NonNull String getPassword() {
        return korisnik.getPassword();
    }

    @Override
    public @NonNull String getUsername() {
        return korisnik.getUsername();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
