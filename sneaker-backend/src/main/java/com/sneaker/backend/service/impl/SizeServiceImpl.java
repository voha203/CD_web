package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.size.SizeDTO;
import com.sneaker.backend.entity.Size;
import com.sneaker.backend.repository.SizeRepository;
import com.sneaker.backend.service.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SizeServiceImpl implements SizeService {

    @Autowired
    private SizeRepository repository;

    private SizeDTO toDTO(Size s) {

        SizeDTO dto = new SizeDTO();

        dto.setId(s.getId());
        dto.setValue(s.getValue());

        return dto;
    }

    @Override
    public List<SizeDTO> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }
}