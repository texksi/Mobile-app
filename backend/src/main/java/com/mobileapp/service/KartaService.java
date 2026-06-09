package com.mobileapp.service;

import com.mobileapp.dto.request.KartaRequestDTO;
import com.mobileapp.dto.response.KartaResponseDTO;
import com.mobileapp.mapper.KartaMapper;
import com.mobileapp.model.Karta;
import com.mobileapp.model.Putovanje;
import com.mobileapp.model.Rezervacija;
import com.mobileapp.repository.KartaRepository;
import com.mobileapp.repository.PutovanjeRepository;
import com.mobileapp.repository.RezervacijaRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class KartaService {

    private final KartaRepository kartaRepository;
    private final KartaMapper kartaMapper;
    private final RezervacijaRepository rezervacijaRepository;
    private final PutovanjeRepository putovanjeRepository;

    private static final String KARTA_NOT_FOUND = "Karta nije pronadjena";

    public KartaResponseDTO getKartaById(Long id) {
        Karta karta = kartaRepository.findById(id).orElseThrow(() -> new EntityNotFoundException(KARTA_NOT_FOUND));
        return kartaMapper.toResponse(karta);
    }


    public List<KartaResponseDTO> getAllKarte() {
        List<Karta> karte = kartaRepository.findAll();
        return karte.stream().map(kartaMapper::toResponse).toList();
    }

    public KartaResponseDTO createKarta(KartaRequestDTO newKarta) {
        Karta karta = kartaMapper.toEntity(newKarta);
        Rezervacija rezervacija = rezervacijaRepository.findById(newKarta.getRezervacijaId()).orElseThrow(
                () -> new EntityNotFoundException("Rezervacija nije pronadjena")
        );
        karta.setRezervacija(rezervacija);
        Putovanje putovanje = putovanjeRepository.findById(newKarta.getPutovanjeId()).orElseThrow(
                () -> new EntityNotFoundException("Putovanje nije pronadjeno")
        );
        karta.setPutovanje(putovanje);
        Karta saved = kartaRepository.save(karta);
        return kartaMapper.toResponse(saved);
    }


    public KartaResponseDTO updateKarta(Long id, String brojSedista, String tip) {
        Karta savedKarta = kartaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(KARTA_NOT_FOUND));
        savedKarta.setBrojSedista(brojSedista);
        savedKarta.setTip(tip);
        Karta karta = kartaRepository.save(savedKarta);
        return kartaMapper.toResponse(karta);
    }


    public void deleteKarta(Long id) {
        kartaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(KARTA_NOT_FOUND)
        );
        kartaRepository.deleteById(id);
    }


    public List<KartaResponseDTO> getAllKarteForPutovanje(Long id) {
        putovanjeRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Putovanje nije pronadjeno")
        );
        List<Karta> karte = kartaRepository.findAllByPutovanjeId(id);
        return karte.stream().map(kartaMapper::toResponse).toList();
    }


    public List<KartaResponseDTO> getAllKarteForRezervacija(Long id) {
        rezervacijaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException("Rezervacija nije pronadjena")
        );
        List<Karta> karte = kartaRepository.findAllByRezervacijaId(id);
        return karte.stream().map(kartaMapper::toResponse).toList();

    }
}
