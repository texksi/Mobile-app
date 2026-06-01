package com.mobileapp.mapper;

import com.mobileapp.dto.request.PutovanjeRequestDTO;
import com.mobileapp.dto.response.PutovanjeResponseDTO;
import com.mobileapp.model.Putovanje;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PutovanjeMapper {

    @Mapping(source = "kompanija.id", target = "kompanijaId")
    PutovanjeResponseDTO toResponse(Putovanje putovanje);

    Putovanje toEntity(PutovanjeRequestDTO requestDTO);
}
