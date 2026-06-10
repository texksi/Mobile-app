package com.mobileapp.service;

import com.mobileapp.dto.request.PutovanjeRequestDTO;
import com.mobileapp.dto.response.PutovanjeResponseDTO;
import com.mobileapp.mapper.PutovanjeMapper;
import com.mobileapp.model.Kompanija;
import com.mobileapp.model.Putovanje;
import com.mobileapp.repository.KompanijaRepository;
import com.mobileapp.repository.PutovanjeRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class PutovanjeService {

    private final PutovanjeRepository putovanjeRepository;
    private final PutovanjeMapper putovanjeMapper;
    private final KompanijaRepository kompanijaRepository;
    private static final String PUTOVANJE_NOT_FOUND = "Putovanje nije pronadjeno";


    public PutovanjeResponseDTO getPutovanjeById(Long id) {
        Putovanje putovanje = putovanjeRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(PUTOVANJE_NOT_FOUND));
        return putovanjeMapper.toResponse(putovanje);
    }


    public List<PutovanjeResponseDTO> getAllPutovanja() {
        List<Putovanje> putovanja = putovanjeRepository.findAll();
        return putovanja.stream().map(putovanjeMapper::toResponse).toList();
    }


    public PutovanjeResponseDTO createPutovanje(PutovanjeRequestDTO newPutovanje) {
        Kompanija kompanija = kompanijaRepository.findById(newPutovanje.getKompanijaId()).orElseThrow(
                () -> new EntityNotFoundException("Kompanija nije pronadjena")
        );
        Putovanje putovanje = putovanjeMapper.toEntity(newPutovanje);
        putovanje.setKompanija(kompanija);
        Putovanje saved = putovanjeRepository.save(putovanje);
        return putovanjeMapper.toResponse(saved);
    }


    public PutovanjeResponseDTO updatePutovanje(Long id, String polaziste, String odrediste, LocalDateTime vremePolaska, LocalDateTime vremeDolaska, double osnovnaCena) {
        Putovanje savedPutovanje = putovanjeRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(PUTOVANJE_NOT_FOUND)
        );
        savedPutovanje.setPolaziste(polaziste);
        savedPutovanje.setOdrediste(odrediste);
        savedPutovanje.setVremePolaska(vremePolaska);
        savedPutovanje.setVremeDolaska(vremeDolaska);
        savedPutovanje.setOsnovnaCena(osnovnaCena);
        Putovanje putovanje = putovanjeRepository.save(savedPutovanje);
        return putovanjeMapper.toResponse(putovanje);
    }


    public void deletePutovanje(Long id) {
        putovanjeRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(PUTOVANJE_NOT_FOUND)
        );
        putovanjeRepository.deleteById(id);
    }


    public List<PutovanjeResponseDTO> getPutovanjaByKompanija(Long kompanijaId) {
        kompanijaRepository.findById(kompanijaId).orElseThrow(
                () -> new EntityNotFoundException("Kompanija nije pronadjena")
        );
        List<Putovanje> putovanja = putovanjeRepository.findAllByKompanijaId(kompanijaId);
        return putovanja.stream().map(putovanjeMapper::toResponse).toList();
    }

}
