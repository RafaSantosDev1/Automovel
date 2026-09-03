package com.automovel.automovel.service;

import com.automovel.automovel.dto.VehicleDTO;
import com.automovel.automovel.dto.VehicleRequest;
import com.automovel.automovel.dto.VehicleUpdateRequest;
import com.automovel.automovel.entity.Customer;
import com.automovel.automovel.entity.Vehicle;
import com.automovel.automovel.exception.DuplicateResourceException;
import com.automovel.automovel.exception.ResourceNotFoundException;
import com.automovel.automovel.repository.CustomerRepository;
import com.automovel.automovel.repository.VehicleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehicleService {

    private final VehicleRepository vehicleRepository;
    private final CustomerRepository customerRepository;

    public VehicleService(VehicleRepository vehicleRepository, CustomerRepository customerRepository) {
        this.vehicleRepository = vehicleRepository;
        this.customerRepository = customerRepository;
    }

    public VehicleDTO registerVehicle(VehicleRequest request) {
        if (vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new DuplicateResourceException("Veículo já existe com a matrícula: " + request.getLicensePlate());
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + request.getCustomerId()));

        Vehicle vehicle = new Vehicle();
        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setMileage(request.getMileage());
        vehicle.setCustomer(customer);

        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }

    public VehicleDTO updateVehicle(Long id, VehicleRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com id: " + id));

        if (!vehicle.getLicensePlate().equals(request.getLicensePlate())
                && vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
            throw new DuplicateResourceException("Veículo já existe com a matrícula: " + request.getLicensePlate());
        }

        Customer customer = customerRepository.findById(request.getCustomerId())
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + request.getCustomerId()));

        vehicle.setLicensePlate(request.getLicensePlate());
        vehicle.setBrand(request.getBrand());
        vehicle.setModel(request.getModel());
        vehicle.setYear(request.getYear());
        vehicle.setMileage(request.getMileage());
        vehicle.setCustomer(customer);

        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }

    public VehicleDTO patchVehicle(Long id, VehicleUpdateRequest request) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com id: " + id));

        if (request.getLicensePlate() != null) {
            if (!vehicle.getLicensePlate().equals(request.getLicensePlate())
                    && vehicleRepository.existsByLicensePlate(request.getLicensePlate())) {
                throw new DuplicateResourceException("Veículo já existe com a matrícula: " + request.getLicensePlate());
            }
            vehicle.setLicensePlate(request.getLicensePlate());
        }
        if (request.getBrand() != null) {
            vehicle.setBrand(request.getBrand());
        }
        if (request.getModel() != null) {
            vehicle.setModel(request.getModel());
        }
        if (request.getYear() != null) {
            vehicle.setYear(request.getYear());
        }
        if (request.getMileage() != null) {
            vehicle.setMileage(request.getMileage());
        }
        if (request.getCustomerId() != null) {
            Customer customer = customerRepository.findById(request.getCustomerId())
                    .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + request.getCustomerId()));
            vehicle.setCustomer(customer);
        }

        Vehicle saved = vehicleRepository.save(vehicle);
        return toDTO(saved);
    }

    public void deleteVehicle(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com id: " + id));
        vehicleRepository.delete(vehicle);
    }

    public List<VehicleDTO> getAllVehicles() {
        return vehicleRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public VehicleDTO getVehicleById(Long id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Veículo não encontrado com id: " + id));
        return toDTO(vehicle);
    }

    public List<VehicleDTO> getVehiclesByCustomerId(Long customerId) {
        return vehicleRepository.findByCustomerId(customerId)
                .stream()
                .map(this::toDTO)
                .toList();
    }

    private VehicleDTO toDTO(Vehicle vehicle) {
        return new VehicleDTO(
                vehicle.getId(),
                vehicle.getLicensePlate(),
                vehicle.getBrand(),
                vehicle.getModel(),
                vehicle.getYear(),
                vehicle.getMileage(),
                vehicle.getCustomer().getId()
        );
    }
}