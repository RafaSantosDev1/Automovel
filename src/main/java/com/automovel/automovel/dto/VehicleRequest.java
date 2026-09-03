package com.automovel.automovel.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class VehicleRequest {

    @NotBlank(message = "Matrícula é obrigatória")
    private String licensePlate;

    @NotBlank(message = "Marca é obrigatória")
    private String brand;

    @NotBlank(message = "Modelo é obrigatório")
    private String model;

    @NotNull(message = "Ano é obrigatório")
    private Integer year;

    @NotNull(message = "Quilometragem é obrigatória")
    private Integer mileage;

    @NotNull(message = "ID do cliente é obrigatório")
    private Long customerId;

    public VehicleRequest() {
    }

    public VehicleRequest(String licensePlate, String brand, String model, Integer year, Integer mileage, Long customerId) {
        this.licensePlate = licensePlate;
        this.brand = brand;
        this.model = model;
        this.year = year;
        this.mileage = mileage;
        this.customerId = customerId;
    }

    public String getLicensePlate() {
        return licensePlate;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public Integer getYear() {
        return year;
    }

    public Integer getMileage() {
        return mileage;
    }

    public Long getCustomerId() {
        return customerId;
    }
}