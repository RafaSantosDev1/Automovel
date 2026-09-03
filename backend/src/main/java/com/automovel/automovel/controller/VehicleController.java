package com.automovel.automovel.controller;

import com.automovel.automovel.dto.VehicleDTO;
import com.automovel.automovel.dto.VehicleRequest;
import com.automovel.automovel.dto.VehicleUpdateRequest;
import com.automovel.automovel.service.VehicleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vehicles")
public class VehicleController {

    private final VehicleService vehicleService;

    public VehicleController(VehicleService vehicleService) {
        this.vehicleService = vehicleService;
    }

    @PostMapping
    public ResponseEntity<VehicleDTO> registerVehicle(@Valid @RequestBody VehicleRequest request) {
        VehicleDTO vehicle = vehicleService.registerVehicle(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehicle);
    }

    @GetMapping
    public ResponseEntity<List<VehicleDTO>> getAllVehicles() {
        return ResponseEntity.ok(vehicleService.getAllVehicles());
    }

    @GetMapping("/{id}")
    public ResponseEntity<VehicleDTO> getVehicleById(@PathVariable Long id) {
        return ResponseEntity.ok(vehicleService.getVehicleById(id));
    }

    @GetMapping("/customer/{customerId}")
    public ResponseEntity<List<VehicleDTO>> getVehiclesByCustomerId(@PathVariable Long customerId) {
        return ResponseEntity.ok(vehicleService.getVehiclesByCustomerId(customerId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<VehicleDTO> updateVehicle(@PathVariable Long id, @Valid @RequestBody VehicleRequest request) {
        VehicleDTO vehicle = vehicleService.updateVehicle(id, request);
        return ResponseEntity.ok(vehicle);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<VehicleDTO> patchVehicle(@PathVariable Long id, @RequestBody VehicleUpdateRequest request) {
        VehicleDTO vehicle = vehicleService.patchVehicle(id, request);
        return ResponseEntity.ok(vehicle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteVehicle(@PathVariable Long id) {
        vehicleService.deleteVehicle(id);
        return ResponseEntity.noContent().build();
    }
}