package com.mobileapp.controller;

import com.mobileapp.dto.request.KartaRequestDTO;
import com.mobileapp.dto.response.KartaResponseDTO;
import com.mobileapp.service.KartaService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class KartaController {

    private final KartaService kartaService;

    @GetMapping("/api/karte/{id}")
    public ResponseEntity<KartaResponseDTO> getKartaById(@PathVariable Long id) {
        return ResponseEntity.ok(kartaService.getKartaById(id));
    }

    @GetMapping("/api/karte/putovanje/{id}")
    public ResponseEntity<List<KartaResponseDTO>> getKarteForPutovanje(@PathVariable Long id) {
        return ResponseEntity.ok(kartaService.getAllKarteForPutovanje(id));
    }

    @PostMapping("/api/karte")
    public ResponseEntity<KartaResponseDTO> createKarta(@Valid @RequestBody KartaRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(kartaService.createKarta(dto));
    }

    @PutMapping("/api/karte/{id}")
    public ResponseEntity<KartaResponseDTO> updateKarta(@PathVariable Long id, @Valid @RequestBody KartaRequestDTO dto) {
        return ResponseEntity.ok(kartaService.updateKarta(id, dto));
    }

    @DeleteMapping("/api/karte/{id}")
    public ResponseEntity<Void> deleteKarta(@PathVariable Long id) {
        kartaService.deleteKarta(id);
        return ResponseEntity.noContent().build();
    }
}
