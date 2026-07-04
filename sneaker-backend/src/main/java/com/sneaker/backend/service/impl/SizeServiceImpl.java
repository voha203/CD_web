package com.sneaker.backend.service.impl;

import com.sneaker.backend.dto.size.SizeResponse;
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

    private SizeResponse toDTO(Size s) {

        SizeResponse dto = new SizeResponse();

        dto.setId(s.getId());
        dto.setValue(s.getValue());

        return dto;
    }

    @Override
    public List<SizeResponse> getAll() {
        return repository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }
}