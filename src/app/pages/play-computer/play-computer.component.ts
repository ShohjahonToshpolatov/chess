import { Component } from '@angular/core';
import { ChessboardComponent } from '../../shared/components/chessboard/chessboard.component';
import { CapturedPiecesComponent } from '../../shared/components/captured-pieces/captured-pieces.component';
import { GameSidebarComponent } from '../../shared/components/game-sidebar/game-sidebar.component';

@Component({
  selector: 'app-play-computer',
  standalone: true,
  imports: [ChessboardComponent, CapturedPiecesComponent, GameSidebarComponent],
  templateUrl: './play-computer.component.html',
  styleUrl: './play-computer.component.scss'
})
export class PlayComputerComponent {
  gameHistory: string[] = [];
  currentBotElo: number = 1200;

  onMoveMade(event: { san: string; history: string[] }) {
    this.gameHistory = event.history;
  }

  onEloSelected(elo: number) {
    this.currentBotElo = elo;
    // Bu yerda tanlangan ELO qiymatiga ko'ra Stockfish web-worker chuqurligini o'zgartiramiz
  }
}