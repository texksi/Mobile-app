package com.mobileapp.repository;

import com.mobileapp.model.Rezervacija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RezervacijaRepository extends JpaRepository<Rezervacija, Long> {
    List<Rezervacija> findAllByKorisnikId(Long korisnikId);
}
