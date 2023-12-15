package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Citas;
import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.model.Doctor;

import java.time.LocalDate;
import java.util.List;

public interface CitasService {
    public Citas saveCitas(Citas citas);
    public List<Citas> getAllCitas();

    public List<Citas> getCitasByClient(String dni);

    public List<Citas> getCitasByDoctor(String registrationNumber);


    public List<Citas> getCitasByDoctorDniAndFecha(String dni, LocalDate fecha);


}
