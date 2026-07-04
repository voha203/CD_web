package com.sneaker.backend.controller;

import com.sneaker.backend.dto.size.SizeResponse;
import com.sneaker.backend.service.SizeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/sizes")
@CrossOrigin("*")
public class SizeController {

    @Autowired
    private SizeService sizeService;

    @GetMapping
    public List<SizeResponse> getAll() {
        return sizeService.getAll();
    }
}