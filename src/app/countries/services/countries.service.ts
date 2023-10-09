import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of } from 'rxjs';

import { Country } from '../interfaces/country';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseApiUrl: string = 'https://restcountries.com/v3.1';

  constructor(private http: HttpClient) { }

  searchByCountryCode(code: string): Observable<Country | null> {
    return this.callApi(`${this.baseApiUrl}/alpha/${code}`)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null))
      );
  }

  searchByCapitalCity(capital: string): Observable<Country[]> {
    return this.callApi(`${this.baseApiUrl}/capital/${capital}`);
  }

  searchByCountryName(name: string): Observable<Country[]> {
    return this.callApi(`${this.baseApiUrl}/name/${name}`);
  }

  searchByRegion(region: string): Observable<Country[]> {
    return this.callApi(`${this.baseApiUrl}/region/${region}`);
  }

  private callApi(apiUrl: string): Observable<Country[]> {
    return this.http.get<Country[]>(apiUrl)
      .pipe(
        catchError(error => of([]))
      );
  }
}
