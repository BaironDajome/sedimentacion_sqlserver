import * as fs from 'fs';
import * as path from 'path';
import * as unzipper from 'unzipper';
import * as shapefile from 'shapefile';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Shapefile } from './entities/shapefile.entity';

@Injectable()
export class ShapefileService {
  constructor(
    @InjectRepository(Shapefile)
    private shapefileRepo: Repository<Shapefile>,
  ) { }

async saveShapefile(file: Express.Multer.File): Promise<{ message: string; count: number }> {
  const baseName = path.parse(file.originalname).name;
  const uploadDir = path.join(__dirname, '../../uploads/shapefiles', baseName);

  // Verificar si ya existe en la base de datos
  const { exists } = await this.shapeFileExistsByName(baseName);
  if (exists) {
    throw new ConflictException('El archivo ya está cargado.');
  }

  // Crear carpeta de destino
  fs.mkdirSync(uploadDir, { recursive: true });

  // Guardar el ZIP
  const zipPath = path.join(uploadDir, file.originalname);
  fs.writeFileSync(zipPath, file.buffer);

  // Descomprimir
  await fs
    .createReadStream(zipPath)
    .pipe(unzipper.Extract({ path: uploadDir }))
    .promise();

  // Buscar archivos .shp y .dbf
  const files = fs.readdirSync(uploadDir);
  const shpFile = files.find((f) => f.endsWith('.shp'));
  const dbfFile = files.find((f) => f.endsWith('.dbf'));

  if (!shpFile || !dbfFile) {
    throw new InternalServerErrorException('Faltan archivos SHP o DBF en el ZIP');
  }

  const shpPath = path.join(uploadDir, shpFile);
  const dbfPath = path.join(uploadDir, dbfFile);

  const source = await shapefile.open(shpPath, dbfPath);
  const saved: Shapefile[] = [];

  let result;
  while (!(result = await source.read()).done) {
    const { geometry, properties } = result.value;

    const savedItem = await this.shapefileRepo.save({
      geometry,
      properties,
      filename: baseName,
    });

    saved.push(savedItem);
  }

  return {
    message: 'Shapefile guardado correctamente',
    count: saved.length,
  };
}

  async readShapefileFromZip(zipPath: string): Promise<any[]> {
    const extractPath = zipPath.replace(/\.zip$/, '');

    // 1. Crear carpeta de extracción
    if (!fs.existsSync(extractPath)) {
      fs.mkdirSync(extractPath);
    }

    // 2. Descomprimir
    await fs.createReadStream(zipPath)
      .pipe(unzipper.Extract({ path: extractPath }))
      .promise();

    // 3. Buscar archivos .shp, .shx, .dbf
    const files = fs.readdirSync(extractPath);
    const baseName = files.find(f => f.endsWith('.shp'))?.replace('.shp', '');

    if (!baseName) {
      throw new Error('No se encontró archivo .shp en el ZIP');
    }

    const shpPath = path.join(extractPath, `${baseName}.shp`);
    const dbfPath = path.join(extractPath, `${baseName}.dbf`);

    // 4. Leer archivo shapefile
    const source = await shapefile.open(shpPath, dbfPath);

    const features: any[] = [];
    let result;

    while (!(result = await source.read()).done) {
      features.push(result.value);
    }

    return features;
  }

  async findByFilename(filename: string): Promise<Shapefile[]> {
    return this.shapefileRepo.find({
      where: { filename },
    });
  }

  async findAll(): Promise<Shapefile[]> {
    return this.shapefileRepo.find({ cache: true });
  }


  async shapeFileExistsByName(filename: string): Promise<{ exists: boolean }> {
    const shapefile = await this.shapefileRepo.findOne({
      where: { filename },
    });
    return { exists: !!shapefile };
  }

}
