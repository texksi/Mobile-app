package com.mobileapp.mapper;

import com.mobileapp.dto.request.RezervacijaRequestDTO;
import com.mobileapp.dto.response.RezervacijaResponseDTO;
import com.mobileapp.model.Rezervacija;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface RezervacijaMapper {

    @Mapping(source = "korisnik.id", target = "korisnikId")
    RezervacijaResponseDTO toResponse(Rezervacija rezervacija);

    Rezervacija toEntity(RezervacijaRequestDTO requestDTO);
}
