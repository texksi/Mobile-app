package com.mobileapp.mapper;

import com.mobileapp.dto.request.KompanijaRequestDTO;
import com.mobileapp.dto.response.KompanijaResponseDTO;
import com.mobileapp.model.Kompanija;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface KompanijaMapper {

    KompanijaResponseDTO toResponse(Kompanija kompanija);

    Kompanija toEntity(KompanijaRequestDTO requestDTO);
}
