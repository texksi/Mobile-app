package com.mobileapp.repository;

import com.mobileapp.model.Putovanje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PutovanjeRepository extends JpaRepository<Putovanje, Long> {
    List<Putovanje> findAllByKompanijaId(Long kompanijaId);
}
