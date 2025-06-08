import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import * as unzipper from 'unzipper';
import * as fs from 'fs';
import * as path from 'path';
import { InjectRepository } from '@nestjs/typeorm';
import { Raster } from './entities/raster.entity';
import { Repository } from 'typeorm';
import * as WKT from 'terraformer-wkt-parser';
import * as gdal from 'gdal-async';


import * as WKT from 'terraformer-wkt-parser';
import * as gdal from 'gdal-async';



@Injectable()
export class RasterService {
  constructor(
    @InjectRepository(Raster)
    private readonly rasterRepo: Repository<Raster>,
  ) { }

  async saveRaster(file: Express.Multer.File): Promise<Raster> {
    const uploadDir = 'uploads/rasters';

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const zipFilePath = path.join(uploadDir, file.originalname);
    fs.writeFileSync(zipFilePath, file.buffer);

    const extractDir = path.join(uploadDir, path.parse(file.originalname).name);
    if (!fs.existsSync(extractDir)) {
      fs.mkdirSync(extractDir, { recursive: true });
    }

    await new Promise<void>((resolve, reject) => {
      fs.createReadStream(zipFilePath)
        .pipe(unzipper.Extract({ path: extractDir }))
        .on('close', resolve)
        .on('error', reject);
    });

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

    const rasterFilePath = findRasterFile(extractDir);
    if (!rasterFilePath) {
      throw new Error('No se encontró archivo raster válido dentro del ZIP.');
    }

    const { exists } = await this.rasterExistsByName(path.basename(rasterFilePath));
    if (exists) {
      throw new ConflictException(`El archivo ${file.originalname} ya existe.`);
    }

    // Extraer bbox y crs
    const { geometry: bboxGeoJSON, crs } = await this.getBoundingBox(rasterFilePath);
    // Extraer bbox y crs
    const { geometry: bboxGeoJSON, crs } = await this.getBoundingBox(rasterFilePath);

    if (!bboxGeoJSON || typeof bboxGeoJSON !== 'object' || !bboxGeoJSON.type) {
      throw new InternalServerErrorException('BBox GeoJSON inválido o no contiene la propiedad "type"');
    }

    // Convertir GeoJSON a WKT
    let bboxWKT: string;
    try {
      bboxWKT = WKT.convert(bboxGeoJSON);
    } catch (error) {
      throw new InternalServerErrorException('Error convirtiendo bbox GeoJSON a WKT: ' + error.message);
    }

    if (!bboxGeoJSON || typeof bboxGeoJSON !== 'object' || !bboxGeoJSON.type) {
      throw new InternalServerErrorException('BBox GeoJSON inválido o no contiene la propiedad "type"');
    }

    // Convertir GeoJSON a WKT
    let bboxWKT: string;
    try {
      bboxWKT = WKT.convert(bboxGeoJSON);
    } catch (error) {
      throw new InternalServerErrorException('Error convirtiendo bbox GeoJSON a WKT: ' + error.message);
    }

    const raster = this.rasterRepo.create({
      filename: path.basename(rasterFilePath),
      path: rasterFilePath,
      bbox: bboxWKT,
      crs,
      bbox: bboxWKT,
      crs,
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
  async rasterExistsByName(filename: string): Promise<{ exists: boolean }> {
    const count = await this.rasterRepo.count({ where: { filename } });
    return { exists: count > 0 };
  async rasterExistsByName(filename: string): Promise<{ exists: boolean }> {
    const count = await this.rasterRepo.count({ where: { filename } });
    return { exists: count > 0 };
  }

  async getBoundingBox(filePath: string): Promise<{ geometry: any; crs: string }> {
    const dataset = gdal.open(filePath);

    const geoTransform = dataset.geoTransform;
    if (!geoTransform) {
      throw new Error('El archivo no tiene información de georreferenciación (GeoTransform).');
    }

    const xMin = geoTransform[0];
    const yMax = geoTransform[3];
    const pixelWidth = geoTransform[1];
    const pixelHeight = geoTransform[5];

    const xMax = xMin + (dataset.rasterSize.x * pixelWidth);
    const yMin = yMax + (dataset.rasterSize.y * pixelHeight);

    // Crear polígono del bbox
    const ring = new gdal.LinearRing();
    ring.points.add(new gdal.Point(xMin, yMin));
    ring.points.add(new gdal.Point(xMin, yMax));
    ring.points.add(new gdal.Point(xMax, yMax));
    ring.points.add(new gdal.Point(xMax, yMin));
    ring.points.add(new gdal.Point(xMin, yMin)); // Cierra el polígono

    const polygon = new gdal.Polygon();
    polygon.rings.add(ring);

    const geometry = polygon.toObject(); // GeoJSON
    const crs = dataset.srs?.toWKT() || 'EPSG:4326'; // Intenta obtener CRS, o por defecto EPSG:4326

    return { geometry, crs };
  }
}
