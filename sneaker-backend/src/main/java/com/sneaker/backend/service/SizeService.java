package com.sneaker.backend.service;

import com.sneaker.backend.dto.size.SizeResponse;

import java.util.List;

public interface SizeService {
    List<SizeResponse> getAll();
}