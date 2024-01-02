
## Aplicacions necessaries per executar el projecte

Tenir instal·lat un IDE, preferiblament Intellij Idea Community Edition per executar l'aplicació.
Tenir instal·lat Node.js per reconeixer el frontend
Tenir instal·lat VisualStudioCode per aixecar el frontend.
Tenir instal·lat XAMPP per tal de poder aixecar l'aplicació.

##Procediment per a executar l'aplicació:

  XAMPP
  1. Obrir XAMPP
  2. Aixecar serveis APACHE y MySQL
  3. Crear una taula a la base de dades amb el nom medcenter_final

  INTELLIJ
  1. Obrir projecte amb intellij
  2. Tenir instal·lat a intellij un SDK, preferiblement el 21 per tal de reconeixer correctament el projecte
  3. Al fitxer pom.xml, descarregar de nou totes les dependecies mitjançant -> Click dret -> Maven -> Reload Project
  4. Executar l'aplicació al fitxer MedicalCenterApplication a la ruta /src/main/java/com.mila.MedicalCenter/MedicalCenterApplication

  Visual Studio Code
  1. Obrir el projecte
  2. Obrir un nou Terminal
  3. Anar a la carpeta frontend
  4. Executar la comanda npm install
  5. Executar la comanda npm start

Ja es podria visualitzar l'aplicació.
