package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Aseguradora;

import java.util.List;

public interface AseguradoraService {

    public Aseguradora saveAseguradora(Aseguradora aseguradora);
    public List<Aseguradora> getAllAseguradoras();
}
