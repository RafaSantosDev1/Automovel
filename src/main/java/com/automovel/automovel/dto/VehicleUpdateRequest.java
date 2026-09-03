package com.automovel.automovel.dto;

public class VehicleUpdateRequest {

    private String licensePlate;
    private String brand;
    private String model;
    private Integer year;
    private Integer mileage;
    private Long customerId;

    public VehicleUpdateRequest() {
    }

    public VehicleUpdateRequest(String licensePlate, String brand, String model, Integer year, Integer mileage, Long customerId) {
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