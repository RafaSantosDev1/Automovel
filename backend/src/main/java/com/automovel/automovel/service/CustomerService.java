package com.automovel.automovel.service;

import com.automovel.automovel.dto.CustomerDTO;
import com.automovel.automovel.dto.CustomerRequest;
import com.automovel.automovel.dto.CustomerUpdateRequest;
import com.automovel.automovel.entity.Customer;
import com.automovel.automovel.exception.DuplicateResourceException;
import com.automovel.automovel.exception.ResourceNotFoundException;
import com.automovel.automovel.repository.CustomerRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerService {

    private final CustomerRepository customerRepository;

    public CustomerService(CustomerRepository customerRepository) {
        this.customerRepository = customerRepository;
    }

    public CustomerDTO registerCustomer(CustomerRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Cliente já existe com o email: " + request.getEmail());
        }
        if (customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Cliente já existe com o número de telefone: " + request.getPhoneNumber());
        }

        Customer customer = new Customer();
        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());

        Customer saved = customerRepository.save(customer);
        return toDTO(saved);
    }

    public CustomerDTO updateCustomer(Long id, CustomerRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));

        if (!customer.getEmail().equals(request.getEmail())
                && customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("Cliente já existe com o email: " + request.getEmail());
        }
        if (!customer.getPhoneNumber().equals(request.getPhoneNumber())
                && customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
            throw new DuplicateResourceException("Cliente já existe com o número de telefone: " + request.getPhoneNumber());
        }

        customer.setName(request.getName());
        customer.setEmail(request.getEmail());
        customer.setPhoneNumber(request.getPhoneNumber());

        Customer saved = customerRepository.save(customer);
        return toDTO(saved);
    }

    public CustomerDTO patchCustomer(Long id, CustomerUpdateRequest request) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));

        if (request.getName() != null) {
            customer.setName(request.getName());
        }
        if (request.getEmail() != null) {
            if (!customer.getEmail().equals(request.getEmail())
                    && customerRepository.existsByEmail(request.getEmail())) {
                throw new DuplicateResourceException("Cliente já existe com o email: " + request.getEmail());
            }
            customer.setEmail(request.getEmail());
        }
        if (request.getPhoneNumber() != null) {
            if (!customer.getPhoneNumber().equals(request.getPhoneNumber())
                    && customerRepository.existsByPhoneNumber(request.getPhoneNumber())) {
                throw new DuplicateResourceException("Cliente já existe com o número de telefone: " + request.getPhoneNumber());
            }
            customer.setPhoneNumber(request.getPhoneNumber());
        }

        Customer saved = customerRepository.save(customer);
        return toDTO(saved);
    }

    public void deleteCustomer(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        customerRepository.delete(customer);
    }

    public List<CustomerDTO> getAllCustomers() {
        return customerRepository.findAll()
                .stream()
                .map(this::toDTO)
                .toList();
    }

    public CustomerDTO getCustomerById(Long id) {
        Customer customer = customerRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Cliente não encontrado com id: " + id));
        return toDTO(customer);
    }

    private CustomerDTO toDTO(Customer customer) {
        return new CustomerDTO(
                customer.getId(),
                customer.getName(),
                customer.getEmail(),
                customer.getPhoneNumber());
    }
}