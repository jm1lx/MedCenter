package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Client;
import com.mila.Medical.Center.repository.ClientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.List;

@Service
public class ClientServiceImpl implements ClientService{

    @Autowired
    private ClientRepository clientRepository;

    @Override
        public Client saveClient(Client client){
            String encryptedPassword = encryptPassword(client.getPassword());
            client.setPassword(encryptedPassword);
            return clientRepository.save(client);
        }

    @Override
    public List<Client> getAllClients() {
        return clientRepository.findAll();
    }

    @Override
    public Client getClientByDni(String dni) {
        return clientRepository.findByDni(dni);
    }
    @Override
    public Client getClientByMail(String mail) {
        Client client = clientRepository.findByMail(mail);
        if (client != null) {
            // Devuelve el objeto Client con la contraseña encriptada
            return client;
        }
        return null;
    }

    private String encryptPassword(String password) {
        BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
        return encoder.encode(password);
    }

    @Override
    public boolean authenticateClient(String mail, String password) {
        Client client = clientRepository.findByMail(mail);

        if (client != null) {
            BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

            return encoder.matches(password, client.getPassword());
        }

        return false;
    }




}
