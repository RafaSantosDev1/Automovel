package com.automovel.automovel.dto;

import com.automovel.automovel.entity.AppointmentStatus;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class AppointmentRequest {

    @NotNull(message = "ID do veículo é obrigatório")
    private Long vehicleId;

    @NotNull(message = "Data e hora da marcação são obrigatórias")
    private LocalDateTime appointmentDate;

    private String description;

    @NotNull(message = "Estado da marcação é obrigatório")
    private AppointmentStatus status;

    public AppointmentRequest() {
    }

    public AppointmentRequest(Long vehicleId, LocalDateTime appointmentDate, String description, AppointmentStatus status) {
        this.vehicleId = vehicleId;
        this.appointmentDate = appointmentDate;
        this.description = description;
        this.status = status;
    }

    public Long getVehicleId() {
        return vehicleId;
    }

    public LocalDateTime getAppointmentDate() {
        return appointmentDate;
    }

    public String getDescription() {
        return description;
    }

    public AppointmentStatus getStatus() {
        return status;
    }
}