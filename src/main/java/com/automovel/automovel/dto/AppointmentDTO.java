package com.automovel.automovel.dto;

import com.automovel.automovel.entity.AppointmentStatus;
import java.time.LocalDateTime;

public record AppointmentDTO(Long id, Long vehicleId, LocalDateTime appointmentDate, String description, AppointmentStatus status) {
}