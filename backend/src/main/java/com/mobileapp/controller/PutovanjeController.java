package com.mobileapp.controller;

import com.mobileapp.dto.request.PutovanjeRequestDTO;
import com.mobileapp.dto.response.PutovanjeResponseDTO;
import com.mobileapp.service.PutovanjeService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class PutovanjeController {

    private final PutovanjeService putovanjeService;

    @GetMapping("/api/putovanja")
    public ResponseEntity<List<PutovanjeResponseDTO>> getAllPutovanja() {
        return ResponseEntity.ok(putovanjeService.getAllPutovanja());
    }

    @GetMapping("/api/putovanja/{id}")
    public ResponseEntity<PutovanjeResponseDTO> getPutovanje(@PathVariable Long id) {
        return ResponseEntity.ok(putovanjeService.getPutovanjeById(id));
    }

    @PostMapping("/api/putovanja")
    public ResponseEntity<PutovanjeResponseDTO> createPutovanje(@Valid @RequestBody PutovanjeRequestDTO dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(putovanjeService.createPutovanje(dto));
    }

    @PutMapping("/api/putovanja/{id}")
    public ResponseEntity<PutovanjeResponseDTO> updatePutovanje(@PathVariable Long id,
                                                                @Valid @RequestBody PutovanjeRequestDTO dto) {
        return ResponseEntity.ok(putovanjeService.updatePutovanje(id, dto));
    }

    @DeleteMapping("/api/putovanja/{id}")
    public ResponseEntity<Void> deletePutovanje(@PathVariable Long id) {
        putovanjeService.deletePutovanje(id);
        return ResponseEntity.noContent().build();
    }
}
