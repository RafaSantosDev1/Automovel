package com.automovel.automovel.dto;

public record VehicleDTO(Long id, String licensePlate, String brand, String model, Integer year, Integer mileage, Long customerId) {
}