package com.mila.Medical.Center.controller;

import com.mila.Medical.Center.model.Especialidad;
import com.mila.Medical.Center.service.EspecialidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/especialidad")
@CrossOrigin
public class EspecialidadController {


        @Autowired
        private EspecialidadService especialidadService;

        @PostMapping("/add")
        public String add(@RequestBody Especialidad especialidad){
            especialidadService.saveEspecialidad(especialidad);
            return "New Especialidad Added";
        }
        @GetMapping("/getAll")
        public List<Especialidad> getAllEspecialidades(){
            return especialidadService.getAllEspecialidades();
        }
}
