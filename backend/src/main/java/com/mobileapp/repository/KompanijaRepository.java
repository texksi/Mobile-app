package com.mobileapp.repository;

import com.mobileapp.model.Kompanija;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KompanijaRepository extends JpaRepository<Kompanija, Long> {
}
