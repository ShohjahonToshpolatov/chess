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
  // Sahifa to'liq visual qismlarni birlashtiradi
}