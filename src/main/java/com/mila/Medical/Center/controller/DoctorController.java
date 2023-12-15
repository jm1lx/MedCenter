package com.mila.Medical.Center.controller;

import com.mila.Medical.Center.model.*;
import com.mila.Medical.Center.service.CitasService;
import com.mila.Medical.Center.service.ClientService;
import com.mila.Medical.Center.service.DoctorService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.time.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/doctor")
@CrossOrigin
public class DoctorController {
    @Autowired
    private DoctorService doctorService;

    @Autowired
    private CitasService citasService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;  // Asegúrate de tener una clase que maneje la generación de tokens

    @PostMapping("/add")
    public String add(@RequestBody Doctor doctor) {
        doctorService.saveDoctor(doctor);
        return "New Doctor Added";
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<Doctor> getDoctorByDni(@PathVariable("dni") String dni) {
        Doctor doctor = doctorService.getDoctorByDni(dni);

        if (doctor != null) {
            return new ResponseEntity<>(doctor, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/regNumber/{registrationNumber}")
    public ResponseEntity<Doctor> getDoctorByRegNumber(@PathVariable("registrationNumber") String registrationNumber) {
        Doctor doctor = doctorService.getDoctorByRegistrationNumber(registrationNumber);

        if (doctor != null) {
            return new ResponseEntity<>(doctor, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/byEspecialidadAndAseguradora/{especialidad_id}/{aseguradora_id}")
    public ResponseEntity<List<Doctor>> getDoctorsByEspecialidadAndAseguradora(
            @PathVariable("especialidad_id") int especialidad_id,
            @PathVariable("aseguradora_id") int aseguradora_id) {
        List<Doctor> doctors = doctorService.getDoctorsByEspecialidadAndAseguradora(especialidad_id, aseguradora_id);

        if (!doctors.isEmpty()) {
            return new ResponseEntity<>(doctors, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }
    @GetMapping("/horasDisponibles/{doctordni}/{fecha}")
    public List<LocalTime> getHorasDisponibles(@PathVariable("doctordni") String dni, @PathVariable("fecha") String fecha) {
        // Aquí puedes llamar a tu servicio de doctores para obtener las horas disponibles
        // y también tu servicio de citas para obtener las citas existentes para ese día

        ZonedDateTime currentDateTime = ZonedDateTime.now(ZoneId.of("Europe/Madrid"));
        LocalDate currentDate = currentDateTime.toLocalDate();

        Doctor doctor = doctorService.getDoctorByDni(dni);
        List<LocalTime> horasDisponibles = doctorService.getHorasDisponibles(doctor, currentDate);

        return horasDisponibles;

    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody DoctorLoginRequest loginRequest) {
        try {
            // Resto del código...
            Doctor doctor = doctorService.getDoctorByRegistrationNumber(loginRequest.getRegistrationNumber());

            if (doctor != null) {
                if (loginRequest.getDni().equals(doctor.getDni())) {
                    // DNI correcto, doctor autenticado.
                    String token = jwtTokenUtil.generateDoctorToken(doctor);
                    return ResponseEntity.ok(Map.of("token", token));
                }
            }

            // Doctor no autenticado o datos incorrectos.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Error de autenticación"));
        } catch (Exception e) {
            // Manejar la excepción
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }


    }
}
