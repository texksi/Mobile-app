package com.mobileapp.repository;

import com.mobileapp.model.Kompanija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KompanijaRepository extends JpaRepository<Kompanija, Long> {

    Optional<Kompanija> findByNaziv(String naziv);

    boolean existsByNaziv(String naziv);
}
