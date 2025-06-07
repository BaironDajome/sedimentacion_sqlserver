import { DateTime } from 'luxon';
import { plainToInstance } from "class-transformer";
import { ComponenteEnum } from "src/enums/tipo-componente.enum";
import * as XLSX from 'xlsx';
import { EpocaEnum } from 'src/enums/tipo-epoca.enum';

// export function toTimestamp(value: string): Date | null {
//   if (!value) return null;

//   const dt = DateTime.fromFormat(value.trim(), 'dd-MM-yyyy HH:mm:ss');
//   return dt.isValid ? dt.toJSDate() : null;
// }
export function parseEpoca(value?: string): EpocaEnum {
  if (!value) return EpocaEnum.HUMEDA; // valor por defecto

  switch (value.trim().toLowerCase()) {
    case 'h':
      return EpocaEnum.HUMEDA;
    case 'sh':
      return EpocaEnum.SEMIHUMEDA;
    default:
      return EpocaEnum.HUMEDA; // valor por defecto si no coincide
  }
}
export function limpiarString(str?: any): string {
  if (typeof str !== 'string') return '';
  return str.trim();
}

export function toTimestamp(value: any): Date {
  if (typeof value === 'number') {
    // Excel base date: 1899-12-30 (por el bug del 1900 en Excel)
    const excelBaseDate = new Date(Date.UTC(1899, 11, 30));
    const msPerDay = 86400000;
    return new Date(excelBaseDate.getTime() + value * msPerDay);
  }

  if (typeof value === 'string') {
    const num = parseFloat(value);
    if (!isNaN(num)) {
      return toTimestamp(num); // Si es un string numérico
    }
    return new Date(value.trim());
  }

  if (value instanceof Date) {
    return value;
  }

  throw new Error(`Valor inválido para convertir a timestamp: ${value}`);
}

export function cargaExcel<T>(file: Express.Multer.File, dto: new () => T): T[] {
  const workbook = XLSX.read(file.buffer, {
    type: 'buffer',
    cellText: false,
    cellDates: true,
  });

  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  const rawData = XLSX.utils.sheet_to_json(worksheet, {
    defval: '',          // Evita valores undefined
    raw: false,          // Convierte fórmulas y números a texto
    blankrows: false,    // Ignora filas en blanco
  });
  const dtos = plainToInstance(dto, rawData);
  return dtos;
}

// Método privado para convertir las claves de un objeto a minúsculas
export function convertKeysToLowerCase(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(item => convertKeysToLowerCase(item));
  } else if (obj !== null && typeof obj === 'object') {
    return Object.keys(obj).reduce((acc, key) => {
      const normalizedKey = key.trim().toLowerCase();

      // // Excluir claves específicas
      // if (['estacion'].includes(normalizedKey)) {
      //   acc[key] = convertKeysToLowerCase(obj[key]);
      //   return acc;
      // }

      acc[normalizedKey] = convertKeysToLowerCase(obj[key]);
      return acc;
    }, {});
  }
  return obj;
}

// Método para validar los componentes de un archivo Excel
export function validarComponente(componentes: any): ComponenteEnum[] {
  const posibles = Object.values(ComponenteEnum);

  if (typeof componentes !== 'string' || !componentes.trim()) {
    return [];
  }

  return componentes
    .split(',')
    .map(c => (c ?? '').trim()) // Asegurarse de que cada componente sea una cadena
    .filter(c => posibles.includes(c as ComponenteEnum)) as ComponenteEnum[];
}

// Método para validar fechas en el formato de Excel o como string
export function validarFecha(fechaRaw: any): Date {
  let fecha: Date | null = null;

  // Si la fecha está en formato string
  if (typeof fechaRaw === 'string' && fechaRaw.includes('/')) {
    const [dia, mes, anio] = fechaRaw.split('/');
    fecha = new Date(Number(anio), Number(mes) - 1, Number(dia));
  } else if (typeof fechaRaw === 'number') {
    // Si la fecha es un número, se interpreta como fecha de Excel
    const excelEpoch = new Date(1899, 11, 30);
    fecha = new Date(excelEpoch.getTime() + fechaRaw * 86400000);
  }

  // Si la fecha no es válida, lanza un error
  if (!fecha || isNaN(fecha.getTime())) {
    throw new Error(`Fecha inválida detectada: "${fechaRaw}"`);
  }

  return fecha;
}

// Método para validar el componente y asegurarse de que sea válido
export function validaComponente(componenteRaw: string): ComponenteEnum {
  const componenteNormalizado = this.capitalizarPrimeraLetra(componenteRaw.trim());

  // Si el componente no es válido, lanza un error
  if (!Object.values(ComponenteEnum).includes(componenteNormalizado as ComponenteEnum)) {
    const valoresValidos = Object.values(ComponenteEnum).join(', ');
    throw new Error(`Componente "${componenteRaw}" no soportado. Valores válidos: ${valoresValidos}`);
  }

  return componenteNormalizado as ComponenteEnum;
}

export function isUUID(valor: string): boolean {
  const regexUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regexUUID.test(valor);
}

export function parsearFecha(fechaInput: string | Date): Date | null {
  const fecha = typeof fechaInput === 'string' ? new Date(fechaInput) : fechaInput;
  if (fecha instanceof Date && !isNaN(fecha.getTime())) return fecha;
  return null;
}


// export function convertirFechaExcelANormal(excelDate: number | string): string {
//   const numero = typeof excelDate === 'string' ? Number(excelDate) : excelDate;

//   if (isNaN(numero) || numero < 0) {
//     throw new Error('La fecha no es un número válido.');
//   }

//   // Fecha base Excel: 30 dic 1899
//   const excelEpoch = new Date(1899, 11, 30);

//   // Sumar días (excelDate * milisegundos en un día)
//   const fechaConvertida = new Date(excelEpoch.getTime() + numero * 86400000);

//   // Formatear a yyyy-mm-dd
//   const yyyy = fechaConvertida.getFullYear();
//   const mm = String(fechaConvertida.getMonth() + 1).padStart(2, '0');
//   const dd = String(fechaConvertida.getDate()).padStart(2, '0');

//   return `${yyyy}-${mm}-${dd}`;
// }

export function convertirStringFechaADate(fechaStr: string): Date {
  // Asumiendo formato dd/mm/yy
  const [d, m, y] = fechaStr.split('/').map(Number);
  const year = y < 100 ? 2000 + y : y; // Ajusta años tipo 24 => 2024
  return new Date(year, m - 1, d);
}


export function toNumber(value: any): number {
  if (value === undefined || value === null) return NaN;
  // Convertir a string y cambiar coma por punto
  const str = value.toString().replace(',', '.');
  return Number(str);
}

export function calcularChunkSize(cantidadCampos: number): number {
  const MAX_PARAMS = 2100;

  // CHUNK_SIZE=4/2100=525
  // Resumen:
  // Campos por registro	CHUNK_SIZE máximo (registros por bloque)
  //   5	                              400
  //   4	                              525
  //   3	                              700
  //   2	                              1050

  // Si quieres ser conservador como con el caso de 5 campos = 400:
  if (cantidadCampos === 5) return 400;
  return Math.floor(MAX_PARAMS / cantidadCampos);
}









// console.log(JSON.stringify(object, null, 2));