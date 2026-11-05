import { emptyRegistration } from '../../src/services/registrationValidation'

export const registrationFixture = {
  ...emptyRegistration, rutNumero: '11111111', digitoVerificador: '1', nombre: 'María', apellidos: 'Pérez Soto', correo: 'maria@duoc.cl',
  region: 'Biobío', comuna: 'Concepción', calle: 'Avenida Los Carrera', numeroDomicilio: '1234', tipoDomicilio: 'Casa', codigoPostal: '4030000',
  contrasena: 'Cumbre026#', confirmarContrasena: 'Cumbre026#',
}
