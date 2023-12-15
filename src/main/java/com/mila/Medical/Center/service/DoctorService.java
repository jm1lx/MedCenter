package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Citas;
import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.model.Doctor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface DoctorService {

    public Doctor saveDoctor(Doctor doctor);
    public List<Doctor> getAllDoctors();

    public Doctor getDoctorByDni(String dni);

    public Doctor getDoctorByRegistrationNumber(String registrationNumber);

    boolean authenticateDoctor(String mail, String password);

    List<LocalTime> getHorasDisponibles(Doctor doctor, LocalDate fecha);

    List<Doctor> getDoctorsByEspecialidadAndAseguradora(int especialidad_id, int aseguradora_id);



}
