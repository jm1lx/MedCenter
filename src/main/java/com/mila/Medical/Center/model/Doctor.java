package com.mila.Medical.Center.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;

import java.util.List;

@Entity
public class Doctor {
    @Id
    @Column(unique = true)
    private String registrationNumber;
    private String name;
    private String surname;


    @Column(unique = true)
    private String dni;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "aseguradora_id",referencedColumnName = "id")
    private Aseguradora aseguradora;


    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "especialidad_id",referencedColumnName = "id")
    private Especialidad especialidad;


    public Doctor() {
    }

    public String getDni() {
        return dni;
    }

    public void setDni(String dni) {
        this.dni = dni;
    }

    public String getRegistrationNumber() {
        return registrationNumber;
    }

    public void setRegistrationNumber(String registrationNumber) {
        this.registrationNumber = registrationNumber;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public Aseguradora getAseguradora() {
        return aseguradora;
    }

    public void setAseguradora(Aseguradora aseguradora) {
        this.aseguradora = aseguradora;
    }

    public Especialidad getEspecialidad() {
        return especialidad;
    }

    public void setEspecialidad(Especialidad especialidad) {
        this.especialidad = especialidad;
    }


}
