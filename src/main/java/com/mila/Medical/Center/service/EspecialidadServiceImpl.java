package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.model.Especialidad;
import com.mila.Medical.Center.repository.EspecialidadRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EspecialidadServiceImpl implements EspecialidadService{
    @Autowired
    private EspecialidadRepository especialidadRepository;

    @Override
    public Especialidad saveEspecialidad(Especialidad especialidad){
        return especialidadRepository.save(especialidad);
    }
    @Override
    public List<Especialidad> getAllEspecialidades() { return especialidadRepository.findAll();}

    @Override
    public Especialidad getEspecialidadById(int id) {
        return especialidadRepository.findEspecialidadById(id);
    }

}
