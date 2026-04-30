package com.sneaker.backend.service;

import com.sneaker.backend.dto.size.SizeDTO;

import java.util.List;

public interface SizeService {
    List<SizeDTO> getAll();
}