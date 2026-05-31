package com.mobileapp.mapper;

import com.mobileapp.dto.request.KorisnikRequestDTO;
import com.mobileapp.dto.response.KorisnikResponseDTO;
import com.mobileapp.model.Korisnik;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface KorisnikMapper {

    KorisnikResponseDTO toResponse(Korisnik korisnik);

    Korisnik toEntity(KorisnikRequestDTO requestDTO);
}
