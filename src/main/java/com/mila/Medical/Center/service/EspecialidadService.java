package com.mila.Medical.Center.service;


import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.model.Especialidad;

import java.util.List;

public interface EspecialidadService {
    public Especialidad saveEspecialidad(Especialidad especialidad);
    public List<Especialidad> getAllEspecialidades();
}
