package com.mila.Medical.Center.repository;

import com.mila.Medical.Center.model.Aseguradora;
import com.mila.Medical.Center.model.Especialidad;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.JpaRepository;

@Repository
public interface AseguradoraRepository extends JpaRepository<Aseguradora,Integer> {

    Aseguradora findAseguradoraById(int id);


}
