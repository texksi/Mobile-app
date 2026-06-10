package com.mobileapp.controller;


import com.mobileapp.dto.request.RezervacijaRequestDTO;
import com.mobileapp.dto.response.KartaResponseDTO;
import com.mobileapp.dto.response.RezervacijaResponseDTO;
import com.mobileapp.service.KartaService;
import com.mobileapp.service.RezervacijaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class RezervacijaController {

    private final RezervacijaService rezervacijaService;
    private final KartaService kartaService;

    @GetMapping("/api/rezervacije")
    public ResponseEntity<List<RezervacijaResponseDTO>> getAllRezervacije() {
        return ResponseEntity.ok(rezervacijaService.getAllRezervacije());
    }

    @GetMapping("/api/rezervacije/{id}")
    public ResponseEntity<RezervacijaResponseDTO> getRezervacijaById(@PathVariable Long id) {
        return ResponseEntity.ok(rezervacijaService.getRezervacijaById(id));
    }

    @GetMapping("/api/rezervacije/{id}/karte")
    public ResponseEntity<List<KartaResponseDTO>> getAllKarteForRezervacija(@PathVariable Long id) {
        return ResponseEntity.ok(kartaService.getAllKarteForRezervacija(id));
    }

    @PostMapping("/api/rezervacije")
    public ResponseEntity<RezervacijaResponseDTO> createRezervacija(@Valid @RequestBody RezervacijaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(rezervacijaService.createRezervacija(dto));
    }

    @PutMapping("/api/rezervacije/{id}")
    public ResponseEntity<RezervacijaResponseDTO> updateRezervacija(@PathVariable Long id,
                                                                    @Valid @RequestBody RezervacijaRequestDTO dto) {
        return ResponseEntity.ok(rezervacijaService.updateRezervacija(id, dto));
    }

    @DeleteMapping("/api/rezervacije/{id}")
    public ResponseEntity<Void> deleteRezervacija(@PathVariable Long id) {
        rezervacijaService.deleteRezervacija(id);
        return ResponseEntity.noContent().build();
    }
}
