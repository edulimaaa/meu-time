import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Response } from 'src/app/Response';
import { Country } from 'src/app/Country';
import { League } from 'src/app/League';
import { Team } from 'src/app/Team';
import { Player } from 'src/app/Player';

@Injectable({
  providedIn: 'root',
})
export class FootballService {
  private rapidApiKey!: string;
  private rapidApiHost = 'api-football-v1.p.rapidapi.com';
  private apiUrlBase = 'https://api-football-v1.p.rapidapi.com/v3/';

  constructor(private http: HttpClient) {}

  setApiKey(apiKey: string): void {
    this.rapidApiKey = apiKey;
  }

  private get headers(): HttpHeaders {
    return new HttpHeaders({
      'X-RapidAPI-Key': this.rapidApiKey,
      'X-RapidAPI-Host': this.rapidApiHost,
    });
  }

  getCountries(): Observable<Response<Country[]>> {
    const url = `${this.apiUrlBase}countries`;
    return this.http.get<Response<Country[]>>(url, { headers: this.headers });
  }

  getSeasons(): Observable<any> {
    const url = `${this.apiUrlBase}leagues/seasons`;
    return this.http.get<any>(url, { headers: this.headers });
  }

  getLeagues(season: string, country: string): Observable<Response<League[]>> {
    const url = `${this.apiUrlBase}leagues`;
    const params = { season: season, country: country };
    return this.http.get<Response<League[]>>(url, {
      headers: this.headers,
      params: params,
    });
  }

  getTeams(
    leagueId: string,
    season: string,
    country: string
  ): Observable<Response<Team[]>> {
    const url = `${this.apiUrlBase}teams`;
    const params = { league: leagueId, season: season, country: country };
    return this.http.get<Response<Team[]>>(url, {
      headers: this.headers,
      params: params,
    });
  }

  getPlayers(
    leagueId: string,
    season: string,
    teamId: string
  ): Observable<Response<Player[]>> {
    const url = `${this.apiUrlBase}players`;
    const params = { league: leagueId, season: season, team: teamId };
    return this.http.get<Response<Player[]>>(url, {
      headers: this.headers,
      params: params,
    });
  }

  getStatistics(
    leagueId: string,
    season: string,
    teamId: string
  ): Observable<any> {
    const url = `${this.apiUrlBase}teams/statistics`;
    const params = { league: leagueId, season: season, team: teamId };
    return this.http.get<any>(url, {
      headers: this.headers,
      params: params,
    });
  }
}
