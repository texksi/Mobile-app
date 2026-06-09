package com.mobileapp.service;

import com.mobileapp.dto.request.RezervacijaRequestDTO;
import com.mobileapp.dto.response.RezervacijaResponseDTO;
import com.mobileapp.exceptions.EntityNotFoundException;
import com.mobileapp.mapper.RezervacijaMapper;
import com.mobileapp.model.Korisnik;
import com.mobileapp.model.Rezervacija;
import com.mobileapp.repository.KorisnikRepository;
import com.mobileapp.repository.RezervacijaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RezervacijaService {

    private final RezervacijaRepository rezervacijaRepository;
    private final RezervacijaMapper rezervacijaMapper;
    private final KorisnikRepository korisnikRepository;
    private static final String REZERVACIJA_NOT_FOUND = "Rezervacija nije pronadjena";


    public RezervacijaResponseDTO getRezervacijaById(Long id){
        Rezervacija rezervacija = rezervacijaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(REZERVACIJA_NOT_FOUND));
        return rezervacijaMapper.toResponse(rezervacija);
    }


    public List<RezervacijaResponseDTO> getAllRezervacije(){
        List<Rezervacija> rezervacije = rezervacijaRepository.findAll();
        return rezervacije.stream().map(rezervacijaMapper::toResponse).toList();
    }


    public RezervacijaResponseDTO createRezervacija(RezervacijaRequestDTO newRezervacija){
        Korisnik korisnik = korisnikRepository.findById(newRezervacija.getKorisnikId())
                .orElseThrow(() -> new EntityNotFoundException("Korisnik ne postoji"));
        Rezervacija rezervacija = rezervacijaMapper.toEntity(newRezervacija);
        rezervacija.setKorisnik(korisnik);
        return rezervacijaMapper.toResponse(rezervacijaRepository.save(rezervacija));
    }


    public RezervacijaResponseDTO updateRezervacija(Long id, RezervacijaRequestDTO requestDTO){
        Rezervacija savedRezervacija = rezervacijaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(REZERVACIJA_NOT_FOUND));
        savedRezervacija.setStatus(requestDTO.getStatus());
        savedRezervacija.setNacinPlacanja(requestDTO.getNacinPlacanja());
        savedRezervacija.setUkupanIznos(requestDTO.getUkupanIznos());
        Rezervacija rezervacija = rezervacijaRepository.save(savedRezervacija);
        return rezervacijaMapper.toResponse(rezervacija);
    }


    public void deleteRezervacija(Long id){
        rezervacijaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(REZERVACIJA_NOT_FOUND)
        );
        rezervacijaRepository.deleteById(id);
    }


    public List<RezervacijaResponseDTO> getRezervacijeByKorisnik(Long korisnikId){
        korisnikRepository.findById(korisnikId).orElseThrow(
                () -> new EntityNotFoundException("Korisnik ne postoji")
        );
        List<Rezervacija> rezervacije = rezervacijaRepository.findAllByKorisnikId(korisnikId);
        return rezervacije.stream().map(rezervacijaMapper::toResponse).toList();
    }
}
