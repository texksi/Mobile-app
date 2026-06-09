package com.mobileapp.service;

import com.mobileapp.dto.request.KorisnikRequestDTO;
import com.mobileapp.dto.response.KorisnikResponseDTO;
import com.mobileapp.exceptions.EntityAlreadyExistsException;
import com.mobileapp.exceptions.EntityNotFoundException;
import com.mobileapp.mapper.KorisnikMapper;
import com.mobileapp.model.Korisnik;
import com.mobileapp.repository.KorisnikRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KorisnikService {
    
    private final KorisnikRepository korisnikRepository;
    private final KorisnikMapper korisnikMapper;
    private final String KORISNIK_NOT_FOUND = "Korisnik ne postoji u sistemu";

    public KorisnikResponseDTO getKorisnikById(long id){
        Korisnik korisnik = korisnikRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(KORISNIK_NOT_FOUND)
        );
        return korisnikMapper.toResponse(korisnik);
    }

    public List<KorisnikResponseDTO> getAllKorisnici(){
        List<Korisnik> all = korisnikRepository.findAll();
        return all.stream().map(korisnikMapper::toResponse).toList();
    }
    
    public KorisnikResponseDTO getKorisnikByUsername(String username){
        Korisnik korisnik = korisnikRepository.findByUsername(username).orElseThrow(
                () -> new EntityNotFoundException(KORISNIK_NOT_FOUND)
        );
        return korisnikMapper.toResponse(korisnik);
    }

    public KorisnikResponseDTO getKorisnikByEmail(String email){
        Korisnik korisnik = korisnikRepository.findByEmail(email).orElseThrow(
                () -> new EntityNotFoundException(KORISNIK_NOT_FOUND)
        );
        return korisnikMapper.toResponse(korisnik);
    }

    public KorisnikResponseDTO createKorisnik(KorisnikRequestDTO newKorisnik){
        if (korisnikRepository.existsByEmail(newKorisnik.getEmail()) || 
                korisnikRepository.existsByUsername(newKorisnik.getUsername())) {
            throw new EntityAlreadyExistsException("Korisnik sa tim email-om ili username-om već postoji");
        }
        Korisnik korisnik = korisnikRepository.save(korisnikMapper.toEntity(newKorisnik));
        return korisnikMapper.toResponse(korisnik);
    }

    public KorisnikResponseDTO updateKorisnik(Long id, KorisnikRequestDTO dto){
        Korisnik savedKorisnik = korisnikRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(KORISNIK_NOT_FOUND)
        );
        if (!savedKorisnik.getUsername().equals(dto.getUsername()) && korisnikRepository.existsByUsername(dto.getUsername())) {
            throw new EntityAlreadyExistsException("Korisnik sa tim username-om već postoji");
        }
        if (!savedKorisnik.getEmail().equals(dto.getEmail()) && korisnikRepository.existsByEmail(dto.getEmail())) {
            throw new EntityAlreadyExistsException("Korisnik sa tim email-om već postoji");
        }
        savedKorisnik.setIme(dto.getIme());
        savedKorisnik.setPrezime(dto.getPrezime());
        savedKorisnik.setEmail(dto.getEmail());
        savedKorisnik.setUsername(dto.getUsername());
        Korisnik updatedKorisnik = korisnikRepository.save(savedKorisnik);
        return korisnikMapper.toResponse(updatedKorisnik);
    }

    public void deleteKorisnik(long id){
        if (!korisnikRepository.existsById(id)) {
            throw new RuntimeException("Korisnik ne postoji u sistemu");
        }
        korisnikRepository.deleteById(id);
    }
}
