import { ConflictException, Injectable } from '@nestjs/common';
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { InjectRepository } from '@nestjs/typeorm';
import { Raster } from './entities/raster.entity';
import { Repository } from 'typeorm';

@Injectable()
export class RasterService {
  constructor(
    @InjectRepository(Raster)
    private readonly rasterRepo: Repository<Raster>,
  ) { }

  async saveRaster(file: Express.Multer.File): Promise<Raster> {
    const uploadDir = 'uploads/rasters';

    // Crear carpeta si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Guardar el archivo ZIP en disco
    const zipFilePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(zipFilePath, file.buffer);

    // Carpeta temporal para extraer el ZIP (puede ser con un nombre basado en el archivo)
    const extractDir = path.join(uploadDir, path.parse(file.originalname).name);

    // Crear carpeta para extraer ZIP
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }

    // Extraer ZIP
    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', resolve)
        .on('error', reject);
    });

    // Función para buscar recursivamente el archivo raster
    function findRasterFile(dir: string): string | null {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          const result = findRasterFile(fullPath);
          if (result) return result;
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (['.tif', '.tiff', '.img', '.bil'].includes(ext)) {
            return fullPath;
          }
        }
      }
      return null;
    }

    // Buscar archivo raster válido en la carpeta extraída
    const rasterFilePath = findRasterFile(extractDir);
    if (!rasterFilePath) {
      throw new Error('No se encontró archivo raster válido dentro del ZIP.');
    }

    const { exists } = await this.rasterExistsByName(path.basename(rasterFilePath));
    if (exists) {
      throw new ConflictException(`El archivo ${file.originalname} ya existe.`);
    }

    // Extraer bbox con gdalinfo
    const bbox = await this.getBoundingBox(rasterFilePath);

    // Guardar en la base de datos (asumiendo que tienes un repositorio rasterRepo)
    const raster = this.rasterRepo.create({
      filename: path.basename(rasterFilePath),
      path: rasterFilePath,
      bbox,
      crs: 'EPSG:4326',
    });

    return this.rasterRepo.save(raster);
  }

  async getAllRasters(): Promise<any> {
    const rasters = await this.rasterRepo.find();

    // Mapear a GeoJSON FeatureCollection para el bbox
    const featureCollection = {
      type: 'FeatureCollection',
      features: rasters.map(raster => ({
        type: 'Feature',
        geometry: raster.bbox,
        properties: {
          id: raster.id,
          filename: raster.filename,
          path: raster.path,
          crs: raster.crs,
          // podrías agregar url pública para cargar el archivo, p.ej.:
          url: `http://tu-servidor.com/rasters/${raster.filename}`,
        },
      })),
    };

    return featureCollection;
  }
  async rasterExistsByName(nombre: string): Promise<{ exists: boolean }> {
    const raster = await this.rasterRepo.findOne({
      where: { filename: nombre },
    });

    return { exists: !!raster };
  }

  private getBoundingBox(filepath: string): Promise<any> {
    return new Promise((resolve, reject) => {
      exec(`gdalinfo -json "${filepath}"`, (error, stdout) => {
        if (error) return reject(error);

        const info = JSON.parse(stdout);
        const [xmin, ymax] = info.cornerCoordinates.upperLeft;
        const [xmax, ymin] = info.cornerCoordinates.lowerRight;

        const polygonGeoJSON = {
          type: "Polygon",
          coordinates: [[
            [xmin, ymin],
            [xmin, ymax],
            [xmax, ymax],
            [xmax, ymin],
            [xmin, ymin]
          ]]
        };

        resolve(polygonGeoJSON);
      });
    });
  }
}
