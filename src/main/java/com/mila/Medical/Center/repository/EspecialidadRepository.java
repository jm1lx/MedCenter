package com.mila.Medical.Center.repository;


import com.mila.Medical.Center.model.Especialidad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EspecialidadRepository extends JpaRepository<Especialidad,Integer> {

    Especialidad findEspecialidadById(int id);
}
