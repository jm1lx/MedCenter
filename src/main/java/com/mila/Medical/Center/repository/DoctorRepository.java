package com.mila.Medical.Center.repository;

import com.mila.Medical.Center.model.Aseguradora;
import com.mila.Medical.Center.model.Doctor;
import com.mila.Medical.Center.model.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor,String> {

    Doctor findByDni(String dni);
    Doctor findByRegistrationNumber(String registrationNumber);

    List<Doctor> findByEspecialidadAndAseguradora(Especialidad especialidad, Aseguradora aseguradora);


}
