package com.mobileapp.repository;

import com.mobileapp.model.Putovanje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PutovanjeRepository extends JpaRepository<Putovanje, Long> {
    List<Putovanje> findAllByKompanijaId(Long kompanijaId);

    List<Putovanje> findByPolazisteAndOdrediste(String polaziste, String odrediste);
}
