package com.mobileapp.controller;

import com.mobileapp.dto.request.KorisnikRequestDTO;
import com.mobileapp.dto.response.KorisnikResponseDTO;
import com.mobileapp.dto.response.RezervacijaResponseDTO;
import com.mobileapp.service.KorisnikService;
import com.mobileapp.service.RezervacijaService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
public class KorisnikController {

    private final KorisnikService korisnikService;
    private final RezervacijaService rezervacijaService;

    @GetMapping("/api/korisnici")
    public ResponseEntity<List<KorisnikResponseDTO>> getAllKorisnici() {
        return ResponseEntity.ok(korisnikService.getAllKorisnici());
    }

    @GetMapping("/api/korisnici/{id}")
    public ResponseEntity<KorisnikResponseDTO> getKorisnik(@PathVariable Long id) {
        return ResponseEntity.ok(korisnikService.getKorisnikById(id));
    }

    @GetMapping("/api/korisnici/username")
    public ResponseEntity<KorisnikResponseDTO> getKorisnikByUsername(@RequestParam String username) {
        return ResponseEntity.ok(korisnikService.getKorisnikByUsername(username));
    }

    @GetMapping("/api/korisnici/email")
    public ResponseEntity<KorisnikResponseDTO> getKorisnik(@RequestParam String email) {
        return ResponseEntity.ok(korisnikService.getKorisnikByEmail(email));
    }
    @GetMapping("/api/korisnici/{id}/rezervacije")
    public ResponseEntity<List<RezervacijaResponseDTO>> getAllRezervacijeByKorisnik(@PathVariable Long id) {
        return ResponseEntity.ok(rezervacijaService.getRezervacijeByKorisnik(id));
    }
   
    @PutMapping("/api/korisnici/{id}")
    public ResponseEntity<KorisnikResponseDTO> updateKorisnik(@PathVariable Long id, 
                                                              @Valid @RequestBody KorisnikRequestDTO dto) {
        return ResponseEntity.ok(korisnikService.updateKorisnik(id, dto));
    }

    @DeleteMapping("/api/korisnici/{id}")
    public ResponseEntity<Void> deleteKorisnik(@PathVariable Long id) {
        korisnikService.deleteKorisnik(id);
        return ResponseEntity.noContent().build();
    }
}
