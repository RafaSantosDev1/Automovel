package com.automovel.automovel.service;

import com.automovel.automovel.dto.AppointmentDTO;
import com.automovel.automovel.dto.AppointmentRequest;
import com.automovel.automovel.entity.Appointment;
import com.automovel.automovel.entity.Vehicle;
import com.automovel.automovel.exception.ResourceNotFoundException;
import com.automovel.automovel.repository.AppointmentRepository;
import com.automovel.automovel.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final VehicleRepository vehicleRepository;

    public AppointmentService(AppointmentRepository appointmentRepository, VehicleRepository vehicleRepository) {
        this.appointmentRepository = appointmentRepository;
        this.vehicleRepository = vehicleRepository;
    }

    public AppointmentDTO createAppointment(AppointmentRequest request) {
        Vehicle vehicle = vehicleRepository.findById(request.getVehicleId())
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com id: " + request.getVehicleId()));

        Appointment appointment = new Appointment();
        appointment.setVehicle(vehicle);
        appointment.setAppointmentDate(request.getAppointmentDate());
        appointment.setDescription(request.getDescription());
        appointment.setStatus(request.getStatus());

        Appointment saved = appointmentRepository.save(appointment);
        return toDTO(saved);
    }

    public List<AppointmentDTO> getAllAppointments() {
        return appointmentRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public AppointmentDTO getAppointmentById(Long id) {
        Appointment appointment = appointmentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Marcação não encontrada com id: " + id));
        return toDTO(appointment);
    }

    private AppointmentDTO toDTO(Appointment appointment) {
        return new AppointmentDTO(
                appointment.getId(),
                appointment.getVehicle().getId(),
                appointment.getAppointmentDate(),
                appointment.getDescription(),
                appointment.getStatus()
        );
    }
}