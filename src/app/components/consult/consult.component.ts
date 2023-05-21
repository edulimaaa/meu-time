import { Component, OnInit } from '@angular/core';
import { FootballService } from '../services/football.service';

import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

import { Country } from 'src/app/Country';
import { League } from 'src/app/League';
import { Team } from 'src/app/Team';
import { Player } from 'src/app/Player';
import { Lineup } from 'src/app/Lineup';

@Component({
  selector: 'app-consult',
  templateUrl: './consult.component.html',
  styleUrls: ['./consult.component.css'],
})
export class ConsultComponent implements OnInit {
  countries: Country[] = [];
  seasons: any = [];
  leagues: League[] = [];
  teams: Team[] = [];
  players: Player[] = [];

  lineups: Lineup[] = [];

  playedTotal!: number;
  winsTotal!: number;
  drawsTotal!: number;
  losesTotal!: number;

  goalsMinute: any;

  selectedCountry!: string;
  selectedSeason!: string;
  selectedLeagueId: any;
  selectedTeamId: any;

  selectedFlag!: string;
  selectedLeagueLogo!: string;
  selectedTeamLogo!: string;

  apiKey!: string;
  checkError!: boolean;
  showPopUp!: boolean;
  textPopup: string = '';
  classPopUp!: string;

  constructor(private footballService: FootballService) {}

  ngOnInit(): void {
    console.log(this.goalsMinute);
    this.apiKey = localStorage.getItem('apiKey') || '';
    this.footballService.setApiKey(this.apiKey);

    this.footballService
      .getCountries()
      .pipe(
        tap((result): void => {
          this.countries = result.response;
          this.checkError = false;
          if (this.checkError === false) {
            this.showPopUp = true;
            this.textPopup = 'Login feito com sucesso!';
            this.classPopUp = 'alert alert-success popup';
            setTimeout(() => {
              this.showPopUp = false;
            }, 2500);
          }
        }),
        catchError((_error) => {
          this.checkError = true;
          if (this.checkError === true && this.apiKey.length > 0) {
            this.showPopUp = true;
            this.textPopup = 'Login invalido!';
            this.classPopUp = 'alert alert-danger popup';
            setTimeout(() => {
              this.showPopUp = false;
            }, 2500);
          }

          return of(null); // Retorna um Observable vazio para evitar que o erro se propague
        })
      )
      .subscribe();

    this.footballService.getSeasons().subscribe((result): void => {
      this.seasons = result.response;
    });
  }

  onCountryChange(): void {
    this.selectedSeason = '';
    this.selectedLeagueId = '';
    this.selectedTeamId = '';
    this.selectedLeagueLogo = '';
    this.selectedTeamLogo = '';
  }

  onSelectLeague(): void {
    const season = this.selectedSeason;
    const country = this.selectedCountry;
    this.footballService
      .getLeagues(season, country)
      .subscribe((result): void => {
        this.leagues = result.response.map((item: any) => item['league']);
      });
  }

  onSelectTeam(): void {
    const season = this.selectedSeason;
    const country = this.selectedCountry;
    let leagueId = this.selectedLeagueId;

    this.footballService
      .getTeams(leagueId, season, country)
      .subscribe((result): void => {
        this.teams = result.response.map((item: any) => item['team']);
      });
  }

  onSelectPlayers(): void {
    let leagueId = this.selectedLeagueId;
    const teamId = this.selectedTeamId;
    const season = this.selectedSeason;

    this.footballService
      .getPlayers(leagueId, season, teamId)
      .subscribe((result): void => {
        this.players = result.response.map((item: any) => item['player']);
      });
  }

  onSelectStatistics(): void {
    let leagueId = this.selectedLeagueId;
    const teamId = this.selectedTeamId;
    const season = this.selectedSeason;

    this.footballService
      .getStatistics(leagueId, season, teamId)
      .subscribe((result): void => {
        this.lineups = result.response.lineups;
        this.playedTotal = result.response.fixtures.played.total;
        this.winsTotal = result.response.fixtures.wins.total;
        this.drawsTotal = result.response.fixtures.draws.total;
        this.losesTotal = result.response.fixtures.loses.total;
        this.goalsMinute = result.response.goals.for.minute;
        console.log(this.goalsMinute);
      });
  }

  onSelectedFlag(): void {
    const selectedCountryObj = this.countries.find(
      (country): boolean => country.name == this.selectedCountry
    );
    if (selectedCountryObj) {
      this.selectedFlag = selectedCountryObj.flag;
    }
  }

  onSelectedFlagLeague(): void {
    const selectedLeague = this.leagues.find(
      (league): boolean => league.id == this.selectedLeagueId
    );

    if (selectedLeague) {
      this.selectedLeagueLogo = selectedLeague.logo;
    }
  }

  onSelectedFlagTeams(): void {
    const selectedTeam = this.teams.find(
      (team): boolean => team.id == this.selectedTeamId
    );

    if (selectedTeam) {
      this.selectedTeamLogo = selectedTeam.logo;
    }
  }

  login(): void {
    localStorage.setItem('apiKey', this.apiKey);
    location.reload();
  }
}
