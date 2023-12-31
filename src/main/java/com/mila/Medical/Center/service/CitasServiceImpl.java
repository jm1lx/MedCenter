package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Citas;
import com.mila.Medical.Center.model.Doctor;
import com.mila.Medical.Center.repository.CitasRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class CitasServiceImpl implements CitasService {
    @Autowired
    private CitasRepository citasRepository;


    @Override
    @Transactional
    public Citas saveCitas(Citas citas) {
        System.out.println("Guardando cita en el servicio: " + citas.toString());
        return citasRepository.save(citas);
    }

    @Override
    public List<Citas> getAllCitas() {
        return citasRepository.findAll();
    }

    @Override
    public List<Citas> getCitasByClient(String dni) {
        return citasRepository.findByClient_Dni(dni);
    }

    public List<Citas> getCitasByDoctor(String registrationNumber) {
        return citasRepository.findByDoctor_RegistrationNumber(registrationNumber);
    }



    @Override
    public List<Citas> getCitasByDoctorDniAndFecha(String dni, LocalDate fecha) {
        return citasRepository.findByDoctor_DniAndFecha(dni, fecha);
    }

    @Override
    public void deleteCitaById(int id) {
        citasRepository.deleteCitaById(id);
    }

    @Override
    @Transactional
    public void updateInforme(int id, String informe) {
        citasRepository.updateInforme(id, informe);
    }
}
