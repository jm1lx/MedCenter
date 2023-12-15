package com.mila.Medical.Center.controller;

import com.mila.Medical.Center.model.Aseguradora;
import com.mila.Medical.Center.model.Especialidad;
import com.mila.Medical.Center.service.AseguradoraService;
import com.mila.Medical.Center.service.EspecialidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/aseguradora")
@CrossOrigin
public class AseguradoraController {

    @Autowired
    private AseguradoraService aseguradoraService;

    @PostMapping("/add")
    public String add(@RequestBody Aseguradora aseguradora){
        aseguradoraService.saveAseguradora(aseguradora);
        return "New Aseguradora Added";
    }
    @GetMapping("/getAll")
    public List<Aseguradora> getAllAseguradoras(){
        return aseguradoraService.getAllAseguradoras();
    }

}
