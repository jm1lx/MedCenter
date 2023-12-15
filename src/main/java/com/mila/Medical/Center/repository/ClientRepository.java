package com.mila.Medical.Center.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.mila.Medical.Center.model.Client;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientRepository extends JpaRepository<Client,String> {
    Client findByDni(String dni);
    Client findByMail(String mail);
}
