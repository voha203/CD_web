package com.sneaker.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableAsync
@EnableScheduling
public class SneakerBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(SneakerBackendApplication.class, args);
    }

}
