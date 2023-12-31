package com.mila.Medical.Center.controller;

import com.mila.Medical.Center.model.Citas;
import com.mila.Medical.Center.service.CitasService;
import com.mila.Medical.Center.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/citas")
@CrossOrigin
public class CitasController {
    @Autowired
    private CitasService citasService;

       private ClientService clientService;

    @PostMapping("/add")
    public ResponseEntity<String> add(@RequestBody Citas citas) {
        try {
            System.out.println("Recibiendo cita: " + citas.toString());
            citasService.saveCitas(citas);
            return new ResponseEntity<>("Cita added successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error adding cita: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @GetMapping("/getAll")
    public List<Citas> getAllCitas(){
        return citasService.getAllCitas();
    }

    @GetMapping("/client/{dni}")
    public List<Citas> getCitasByClient(@PathVariable("dni") String dni) {
        return citasService.getCitasByClient(dni);
    }

    @GetMapping("/doctor/{registrationNumber}")
    public List<Citas> getCitasByDoctor(@PathVariable("registrationNumber") String registrationNumber) {
        return citasService.getCitasByDoctor(registrationNumber);
    }

    // En el controlador CitasController
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<String> deleteCita(@PathVariable("id") int id) {
        try {
            citasService.deleteCitaById(id);
            return new ResponseEntity<>("Cita deleted successfully", HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error deleting cita: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping("/update-informe/{id}")
    public ResponseEntity<String> updateInforme(@PathVariable("id") int id, @RequestBody String informe) {
        try {
            citasService.updateInforme(id, informe);
            return new ResponseEntity<>("Informe updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("Error updating informe: " + e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }




}
