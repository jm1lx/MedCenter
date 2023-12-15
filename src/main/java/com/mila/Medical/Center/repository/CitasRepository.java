package com.mila.Medical.Center.repository;

import com.mila.Medical.Center.model.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.mila.Medical.Center.model.Citas;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface CitasRepository extends JpaRepository<Citas,Long>{
    List<Citas> findByClient_Dni(String dni);

    List<Citas> findByDoctor_RegistrationNumber(String registrationNumber);

    List<Citas> findByDoctorAndFecha(Doctor doctor, LocalDate fecha);

    List<Citas> findByDoctor_DniAndFecha(String dni, LocalDate fecha);
}
