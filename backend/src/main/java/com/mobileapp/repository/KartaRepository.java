package com.mobileapp.repository;

import com.mobileapp.model.Karta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface KartaRepository extends JpaRepository<Karta, Long> {
    List<Karta> findAllByPutovanjeId(Long putovanjeId);
    List<Karta> findAllByRezervacijaId(Long rezervacijaId);
}
