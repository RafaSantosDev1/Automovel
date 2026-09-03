package com.automovel.automovel.repository;

import com.automovel.automovel.entity.Vehicle;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VehicleRepository extends JpaRepository<Vehicle, Long> {
    Optional<Vehicle> findByLicensePlate(String licensePlate);
    List<Vehicle> findByCustomerId(Long customerId);
    boolean existsByLicensePlate(String licensePlate);
}