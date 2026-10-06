export default class Empleado {
  nombre;
  sueldoBase;

  constructor(nombre, sueldoBase) {
    this.nombre = nombre;
    this.sueldoBase = sueldoBase;
  }

  calcularSueldo() {
    return this.sueldoBase;
  }
}

export class EmpleadoTiempoCompleto extends Empleado {
  bono = 50000;

  constructor(nombre, sueldoBase) {
    super(nombre, sueldoBase);
  }

  calcularSueldo() {
    return super.calcularSueldo() + this.bono;
  }
}

export class EmpleadoFreelance extends Empleado {
  horasTrabajadas;
  valorHora;

  constructor(nombre, horasTrabajadas, valorHora) {
    super(nombre, 0);
    this.horasTrabajadas = horasTrabajadas;
    this.valorHora = valorHora;
  }

  calcularSueldo() {
    return this.horasTrabajadas * this.valorHora;
  }
}

const empleados = [
  new Empleado("Carlos López", 300000),
  new EmpleadoTiempoCompleto("Ana Gómez", 400000),
  new EmpleadoFreelance("Juan Pérez", 80, 5000),
  new EmpleadoTiempoCompleto("María Rodríguez", 450000),
  new EmpleadoFreelance("Laura Martínez", 120, 6000),
];

console.log("==========================================");
console.log("NÓMINA DE EMPLEADOS (RECORRIDO POLIMÓRFICO)");
console.log("==========================================");

empleados.forEach((empleado) => {
  console.log(
    `Empleado: ${empleado.nombre} - Sueldo: $${empleado.calcularSueldo()}`,
  );
});
