package com.mobileapp.service;

import com.mobileapp.dto.request.KompanijaRequestDTO;
import com.mobileapp.dto.response.KompanijaResponseDTO;
import com.mobileapp.exceptions.EntityAlreadyExistsException;
import com.mobileapp.exceptions.EntityNotFoundException;
import com.mobileapp.mapper.KompanijaMapper;
import com.mobileapp.model.Kompanija;
import com.mobileapp.model.Putovanje;
import com.mobileapp.repository.KartaRepository;
import com.mobileapp.repository.KompanijaRepository;
import com.mobileapp.repository.PutovanjeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@RequiredArgsConstructor
public class KompanijaService {

    private final KompanijaRepository kompanijaRepository;
    private final KompanijaMapper kompanijaMapper;
    private final PutovanjeRepository putovanjeRepository;
    private final KartaRepository kartaRepository;
    private final String KOMPANIJA_NOT_FOUND = "Kompanije ne postoji u sistemu";

    public KompanijaResponseDTO getKompanijaById(Long id){
        Kompanija kompanija = kompanijaRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(KOMPANIJA_NOT_FOUND)
        );
        return kompanijaMapper.toResponse(kompanija);
    }

    public KompanijaResponseDTO getKompanijaByNaziv(String naziv){
        Kompanija kompanija = kompanijaRepository.findByNaziv(naziv).orElseThrow(
                () -> new EntityNotFoundException(KOMPANIJA_NOT_FOUND)
        );
        return kompanijaMapper.toResponse(kompanija);
    }

    public List<KompanijaResponseDTO> getAllKompanije(){
        List<Kompanija> all = kompanijaRepository.findAll();
        return all.stream().map(kompanijaMapper::toResponse).toList();
    }

    public KompanijaResponseDTO createKompanija(KompanijaRequestDTO newKompanija){
        if(kompanijaRepository.existsByNaziv(newKompanija.getNaziv())){
            throw new EntityAlreadyExistsException("Kompanija sa tim nazivom vec postoji u sistemu");
        }
        Kompanija savedKompania = kompanijaRepository.save(kompanijaMapper.toEntity(newKompanija));
        return kompanijaMapper.toResponse(savedKompania);
    }
    
    public KompanijaResponseDTO updateKompanija(Long id,KompanijaRequestDTO dto){
        Kompanija saved = kompanijaRepository.findById(id).orElseThrow(
                () ->  new EntityNotFoundException(KOMPANIJA_NOT_FOUND)
        );
        if (!saved.getNaziv().equals(dto.getNaziv()) && kompanijaRepository.existsByNaziv(dto.getNaziv())) {
            throw new EntityAlreadyExistsException("Kompanija sa tim nazivom vec postoji u sistemu");
        }
        saved.setNaziv(dto.getNaziv());
        saved.setKontakt(dto.getKontakt());
        Kompanija updated = kompanijaRepository.save(saved);
        return kompanijaMapper.toResponse(updated);
    }

    public void deleteKompanija(Long id){
        if(!kompanijaRepository.existsById(id)){
            throw new EntityAlreadyExistsException(KOMPANIJA_NOT_FOUND);
        }
        List<Putovanje> putovanja = putovanjeRepository.findAllByKompanijaId(id);
        for (Putovanje p : putovanja) {
            if (!kartaRepository.findAllByPutovanjeId(p.getId()).isEmpty()) {
                throw new RuntimeException("Ne mozete obrisati kompaniju koja ima aktivne karte");
            }
        }
        kompanijaRepository.deleteById(id);
    }
}
