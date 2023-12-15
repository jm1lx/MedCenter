package com.mila.Medical.Center.controller;

import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.service.ClientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.mila.Medical.Center.model.ClientLoginRequest;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import com.mila.Medical.Center.model.JwtTokenUtil;



import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/client")
@CrossOrigin
public class ClientController {
    @Autowired
    private ClientService clientService;



    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;  // Asegúrate de tener una clase que maneje la generación de tokens




    @PostMapping("/register")
    public ResponseEntity<String> add(@RequestBody Client client){
        clientService.saveClient(client);
        return new ResponseEntity<>("Client successfully registered", HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> login(@RequestBody ClientLoginRequest loginRequest) {
        try {
            // Resto del código...
            Client client = clientService.getClientByMail(loginRequest.getMail());

            if (client != null) {
                if (bCryptPasswordEncoder.matches(loginRequest.getPassword(), client.getPassword())) {
                    // Contraseña correcta, usuario autenticado.
                    String token = jwtTokenUtil.generateClientToken(client);
                    return ResponseEntity.ok(Map.of("token", token));
                }
            }

            // Usuario no autenticado o datos incorrectos.
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Error de autenticación"));
        } catch (Exception e) {
            // Manejar la excepción
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Error interno del servidor"));
        }
    }

    @GetMapping("/getAll")
    public List<Client> getAllClients(){
        return clientService.getAllClients();
    }

    @GetMapping("/dni/{dni}")
    public ResponseEntity<Client> getClientByDni(@PathVariable("dni") String dni) {
        Client client = clientService.getClientByDni(dni);

        if (client != null) {
            return new ResponseEntity<>(client, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/mail/{mail}")
    public ResponseEntity<Client> getClientByMail(@PathVariable("mail") String mail) {
        Client client = clientService.getClientByMail(mail);

        if (client != null) {
            return new ResponseEntity<>(client, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }






}




