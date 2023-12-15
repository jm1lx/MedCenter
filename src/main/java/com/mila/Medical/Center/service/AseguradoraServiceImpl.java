package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Aseguradora;
import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.repository.AseguradoraRepository;
import com.mila.Medical.Center.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AseguradoraServiceImpl implements AseguradoraService{

    @Autowired
    private AseguradoraRepository aseguradoraRepository;


    @Override
    public Aseguradora saveAseguradora(Aseguradora aseguradora){
        return aseguradoraRepository.save(aseguradora);
    }

    @Override
    public List<Aseguradora> getAllAseguradoras() {
        return aseguradoraRepository.findAll();
    }
}
