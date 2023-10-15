import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, map, of, tap } from 'rxjs';

import { CacheStore } from '../interfaces/cache-store.interface';
import { Country } from '../interfaces/country.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root'
})
export class CountriesService {

  private baseApiUrl: string = 'https://restcountries.com/v3.1';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] }
  }

  constructor(private http: HttpClient) {
    this.loadFromLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadFromLocalStorage(): void {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore')!);
  }

  searchByCountryCode(code: string): Observable<Country | null> {
    return this.getCountriesHttpRequest(`${this.baseApiUrl}/alpha/${code}`)
      .pipe(
        map(countries => countries.length > 0 ? countries[0] : null),
        catchError(() => of(null))
      );
  }

  searchByCapitalCity(capital: string): Observable<Country[]> {
    return this.getCountriesHttpRequest(`${this.baseApiUrl}/capital/${capital}`)
      .pipe(
        tap(countries => this.cacheStore.byCapital = { term: capital, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchByCountryName(name: string): Observable<Country[]> {
    return this.getCountriesHttpRequest(`${this.baseApiUrl}/name/${name}`)
      .pipe(
        tap(countries => this.cacheStore.byCountry = { term: name, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  searchByRegion(region: Region): Observable<Country[]> {
    return this.getCountriesHttpRequest(`${this.baseApiUrl}/region/${region}`)
      .pipe(
        tap(countries => this.cacheStore.byRegion = { region, countries }),
        tap(() => this.saveToLocalStorage())
      );
  }

  private getCountriesHttpRequest(apiUrl: string): Observable<Country[]> {
    return this.http.get<Country[]>(apiUrl)
      .pipe(
        catchError(() => of([]))
        // delay(2000)
      );
  }
}
