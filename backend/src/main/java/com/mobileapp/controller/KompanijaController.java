package com.mobileapp.controller;

import com.mobileapp.dto.request.KompanijaRequestDTO;
import com.mobileapp.dto.response.KompanijaResponseDTO;
import com.mobileapp.service.KompanijaService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class KompanijaController {
    
    private final KompanijaService kompanijaService;

    @GetMapping("api/kompanija/{id}")
    public ResponseEntity<KompanijaResponseDTO> getKompanijaById(@PathVariable Long id){
        return ResponseEntity.ok(kompanijaService.getKompanijaById(id));
    }

    @GetMapping("api/kompanije")
    public ResponseEntity<List<KompanijaResponseDTO>> getAll(){
        return ResponseEntity.ok(kompanijaService.getAllKompanije());
    }
    
    @GetMapping("api/kompanija/naziv")
    public ResponseEntity<KompanijaResponseDTO> getKompanijaByNaziv(@RequestParam String naziv){
        return ResponseEntity.ok(kompanijaService.getKompanijaByNaziv(naziv));
    }
    
    @PostMapping("api/kompanija")
    public ResponseEntity<KompanijaResponseDTO> createKompanija(@Valid @RequestBody KompanijaRequestDTO dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(kompanijaService.createKompanija(dto));

    }

    @PutMapping("api/kompanija/{id}")
    public ResponseEntity<KompanijaResponseDTO> updateKompanija(@PathVariable Long id,
                                                                @Valid @RequestBody KompanijaRequestDTO dto){
        return ResponseEntity.ok(kompanijaService.updateKompanija(id,dto));
    }
    
    @DeleteMapping("api/kompanija/{id}")
    public ResponseEntity<Void> deleteKompanija(@PathVariable Long id){
        kompanijaService.deleteKompanija(id);
        return ResponseEntity.noContent().build();
    }

}
