package com.automovel.automovel.dto;

public class CustomerUpdateRequest {

    private String name;
    private String email;
    private String phoneNumber;

    public CustomerUpdateRequest() {
    }

    public CustomerUpdateRequest(String name, String email, String phoneNumber) {
        this.name = name;
        this.email = email;
        this.phoneNumber = phoneNumber;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPhoneNumber() {
        return phoneNumber;
    }
}