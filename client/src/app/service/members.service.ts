import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animal } from 'src/models/animal';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  dataUrl = 'http://localhost:8082/api'

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  }

  constructor(private http: HttpClient) { }


  getAllAnimals(): Observable<Animal[]> {
    const results: Observable<Animal[]> = this.http.get<Animal[]>(this.dataUrl+`/animals`);
    return results;
  }

  getAllAnimalsByAnimalType(animalTypeId: number): Observable<Animal[]> {
    const results: Observable<Animal[]> = this.http.get<Animal[]>(this.dataUrl+`/animals/byanimaltype/${animalTypeId}`);
    return results;
  }

  addNewAnimal(animal: Animal, animalTypeId: number): Observable<Animal> {
    const results: Observable<Animal> = this.http.post<Animal>(
      this.dataUrl+`/animaltypes/${animalTypeId}/animals`,
      animal,
      this.jsonContentTypeHeaders
    );
    console.log(`addAnimalType(${animal}) returned ${results}`);
    return results;
  }

  deleteAnimalById(animalId: number, animalTypeId: number): Observable<Animal> {
    const results: Observable<Animal> = this.http.delete<Animal>(this.dataUrl+`/animaltypes/${animalTypeId}/animals/${animalId}`);
    return results;
  }

  updateAnimal(animalType: Animal): Observable<Animal> {
    const results: Observable<Animal> = this.http.put<Animal>(
      this.dataUrl+"/animals",
      animalType,
      this.jsonContentTypeHeaders
    );
    console.log(`updateAnimalType(${animalType}) returned ${results}`);
    return results;
  }

  getAnimalById(animalId: number): Observable<Animal> {
    const results: Observable<Animal> = this.http.get<Animal>(this.dataUrl+`/animals/${animalId}`);
    return results;
  }
}
