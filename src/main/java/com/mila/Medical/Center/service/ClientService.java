package com.mila.Medical.Center.service;

import com.mila.Medical.Center.model.Client;

import java.util.List;

public interface ClientService {
    public Client saveClient(Client client);
    public List<Client> getAllClients();
    public Client getClientByDni(String dni);
    public Client getClientByMail(String mail);


    boolean authenticateClient(String mail, String password);
}
