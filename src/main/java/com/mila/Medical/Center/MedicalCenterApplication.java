package com.mila.Medical.Center;

import com.github.javafaker.Faker;
import com.mila.Medical.Center.model.Aseguradora;
import com.mila.Medical.Center.model.Doctor;
import com.mila.Medical.Center.model.Especialidad;
import com.mila.Medical.Center.repository.AseguradoraRepository;
import com.mila.Medical.Center.repository.DoctorRepository;
import com.mila.Medical.Center.service.AseguradoraService;
import com.mila.Medical.Center.service.DoctorService;
import com.mila.Medical.Center.service.EspecialidadService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class MedicalCenterApplication  implements CommandLineRunner {

	@Autowired
	private AseguradoraService aseguradoraService;

	@Autowired
	private EspecialidadService especialidadService;

	@Autowired
	private DoctorService doctorService;

	@Autowired
	private DoctorRepository doctorRepository;

	@Autowired
	private AseguradoraRepository aseguradoraRepository;


	private final Faker faker = new Faker();

	//Primera ejecucion lo ponemos en false, la siguiente cambiamos a true
	private boolean datosInicialesInsertados = false;

	public static void main(String[] args) {
		SpringApplication.run(MedicalCenterApplication.class, args);
	}

	@Override
	public void run(String... args) throws Exception {
		if (!datosInicialesInsertados) {
			if (aseguradoraRepository.count() == 0) {
				insertarDatosIniciales();
				datosInicialesInsertados = true;
			} else {
				// La tabla aseguradoras tiene al menos un registro, no es necesario insertar datos iniciales.
				datosInicialesInsertados = false;
			}
		}
	}

	private void insertarDatosIniciales() {
		// Nombres de las aseguradoras
		List<String> nombresAseguradoras = Arrays.asList(
				"Adeslas","Allianz","Assistencia Sanitaria", "MAPFRE", "FIATC", "Sanitas"
		);
		List<Aseguradora> aseguradoras = guardarAseguradoras(nombresAseguradoras);

		// Nombres de las aseguradoras
		List<String> nombresEspecialidades = Arrays.asList(
				"Aparell Digestiu", "Cardiologia", "Clínica Dental",
				"Dermatologia", "Dietetica i Nutrició", "Fisioteràpia", "Logopedia",
				"Medicina General", "Otorrino", "Pediatria", "Podologia", "Urologia"
		);

		List<Especialidad> especialidades = guardarEspecialidades(nombresEspecialidades);


		int idDoctor = 1;
		for (int especialidad_id=1; especialidad_id<=12 ; especialidad_id++) {
			for (int i = 0; i < 2; i++) {
				for (int aseguradora_id=1; aseguradora_id <= 6; aseguradora_id++) {
					Doctor doctor = new Doctor();
					doctor.setRegistrationNumber(generarRegistroUnico(idDoctor));
					doctor.setDni(generarDniUnico(faker));
					doctor.setName(faker.name().firstName());
					doctor.setSurname(faker.name().lastName());
					Especialidad especialidad = especialidadService.getEspecialidadById(especialidad_id);
					Aseguradora aseguradora = aseguradoraService.getAseguradoraById(aseguradora_id);
					doctor.setEspecialidad(especialidad);
					doctor.setAseguradora(aseguradora);

					doctorService.saveDoctor(doctor);
					idDoctor++;
				}
			}
		}
	}

	private String generarRegistroUnico(int idDoctor) {
		// Formatear el número de registro con el formato "RG0001", "RG0002", etc.
		return String.format("RN%04d", idDoctor);
	}

	private String generarDniUnico(Faker faker) {
		String dni;
		do {
			dni = faker.number().digits(8) + faker.regexify("[A-Z]");
		} while (!dniUnico(dni));
		return dni;
	}

	private boolean dniUnico(String dni) {
		// Lógica para verificar que el DNI sea único
		// Puedes implementar la lógica de verificación según tu requerimiento
		Doctor existingDoctor = doctorRepository.findByDni(dni);

		// Si existingDoctor no es nulo, significa que ya existe un doctor con ese DNI
		// Generar un nuevo DNI y volver a verificar
		if (existingDoctor != null) {
			return false;
		}else{
			return true;
		}
	}

	private List<Aseguradora> guardarAseguradoras(List<String> nombresAseguradoras) {
		// Crear y guardar aseguradoras
		List<Aseguradora> aseguradoras = new ArrayList<>();
		for (String nombreAseguradora : nombresAseguradoras) {
			Aseguradora aseguradora = new Aseguradora();
			aseguradora.setAseguradora(nombreAseguradora);
			aseguradoraService.saveAseguradora(aseguradora);
			aseguradoras.add(aseguradora);
		}
		return aseguradoras;
	}

	private List<Especialidad> guardarEspecialidades(List<String> nombresEspecialidades) {
		// Crear y guardar aseguradoras
		List<Especialidad> especialidades = new ArrayList<>();
		for (String nombreEspecialidad : nombresEspecialidades) {
			Especialidad especialidad = new Especialidad();
			especialidad.setEspecialidad(nombreEspecialidad);
			especialidadService.saveEspecialidad(especialidad);
			especialidades.add(especialidad);
		}
		return especialidades;
	}
}
