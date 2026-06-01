package com.mobileapp.mapper;

import com.mobileapp.dto.request.KartaRequestDTO;
import com.mobileapp.dto.response.KartaResponseDTO;
import com.mobileapp.model.Karta;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface KartaMapper {

    @Mapping(source = "rezervacija.id", target = "rezervacijaId")
    @Mapping(source = "putovanje.id", target = "putovanjeId")
    KartaResponseDTO toResponse(Karta karta);

    Karta toEntity(KartaRequestDTO requestDTO);
}
