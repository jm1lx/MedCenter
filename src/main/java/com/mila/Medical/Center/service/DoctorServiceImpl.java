package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.*;
import com.mila.Medical.Center.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Service
public class DoctorServiceImpl implements DoctorService {
    @Autowired
    private DoctorRepository doctorRepository;

    @Autowired
    private CitasRepository citasRepository;

    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Autowired
    private AseguradoraRepository aseguradoraRepository;


    @Override
    public Doctor saveDoctor(Doctor doctor) {

        return doctorRepository.save(doctor);
    }

    @Override
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Override
    public Doctor getDoctorByDni(String dni) {
        return doctorRepository.findByDni(dni);
    }

    @Override
    public Doctor getDoctorByRegistrationNumber(String registrationNumber) {
        Doctor doctor = doctorRepository.findByRegistrationNumber(registrationNumber);
        if (doctor != null) {
            // Devuelve el objeto Client con la contraseña encriptada
            return doctor;
        }
        return null;
    }

    @Override
    public boolean authenticateDoctor(String registrationNumber, String dni) {
        Doctor doctor = doctorRepository.findByRegistrationNumber(registrationNumber);

        if (doctor != null) {
            // Comparación directa sin encriptar
            if (dni.equals(doctor.getDni())) {
                return true;
            }
        }

        return false;
    }
    @Override
    public List<LocalTime> getHorasDisponibles(Doctor doctor, LocalDate fecha) {
        // Obtener todas las citas para el doctor y la fecha específica

        List<Citas> citasDelDia = citasRepository.findByDoctorAndFecha(doctor, fecha);

        // Crear una lista de todas las horas posibles en el día
        List<LocalTime> horasPosibles = generarHorasPosibles();

        // Eliminar las horas ocupadas por citas existentes
        for (Citas cita : citasDelDia) {
            horasPosibles.remove(cita.getHora());
        }

        return horasPosibles;
    }

    // Método para generar una lista de horas posibles en el día
    private List<LocalTime> generarHorasPosibles() {
        LocalTime horaInicio = LocalTime.of(8, 0); // Hora de inicio, ajustar según tus necesidades
        LocalTime horaFin = LocalTime.of(17, 40);   // Hora de fin, ajustar según tus necesidades

        List<LocalTime> horasPosibles = new ArrayList<>();

        LocalTime horaActual = horaInicio;
        while (horaActual.isBefore(horaFin) || horaActual.equals(horaFin)) {
            horasPosibles.add(horaActual);
            horaActual = horaActual.plusMinutes(20); // Ajustar según tus necesidades de intervalo
        }

        return horasPosibles;
    }
    @Override
    public List<Doctor> getDoctorsByEspecialidadAndAseguradora(int especialidad_id, int aseguradora_id) {
        // Utiliza especialidadRepository para obtener la especialidad
        Especialidad especialidad = especialidadRepository.findById(especialidad_id).orElse(null);

        // Utiliza aseguradoraRepository para obtener la aseguradora
        Aseguradora aseguradora = aseguradoraRepository.findById(aseguradora_id).orElse(null);

        // Verifica si especialidad y aseguradora son diferentes de null antes de llamar al método del repositorio
        if (especialidad != null && aseguradora != null) {
            return doctorRepository.findByEspecialidadAndAseguradora(especialidad, aseguradora);
        } else {
            // Manejar el caso en el que no se encuentre la especialidad o la aseguradora
            return Collections.emptyList();
        }
    }



}