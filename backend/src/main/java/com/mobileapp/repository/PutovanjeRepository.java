package com.mobileapp.repository;

import com.mobileapp.model.Putovanje;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PutovanjeRepository extends JpaRepository<Putovanje, Long> {
}
