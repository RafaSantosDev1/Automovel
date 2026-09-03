package com.automovel.automovel.repository;

import com.automovel.automovel.entity.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    List<Appointment> findByVehicleId(Long vehicleId);
}