import { Component, Input, Output, EventEmitter } from '@angular/core';

interface BotLevel {
  elo: number;
  title: string;
  depth: number; // Stockfish hisoblash chuqurligi
}

@Component({
  selector: 'app-game-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './game-sidebar.component.html',
  styleUrl: './game-sidebar.component.scss'
})
export class GameSidebarComponent {
  @Output() restartGame = new EventEmitter<void>();
  @Output() eloChanged = new EventEmitter<number>();

  botLevels: BotLevel[] = [
    { elo: 800, title: 'Yangi boshlovchi', depth: 1 },
    { elo: 1200, title: 'O\'rtacha (Siz aytgan)', depth: 3 },
    { elo: 1600, title: 'Usta', depth: 7 },
    { elo: 2200, title: 'Grossmeyster', depth: 12 }
  ];

  selectedElo = 1200; // Standart holatda 1200 ELO
  formattedMoves: { num: number; w: string; b: string }[] = [];

  // Taxtadagi yurishlar tarixini qabul qilib jadvalga moslash
  @Input() set rawHistory(history: string[]) {
    this.formattedMoves = [];
    for (let i = 0; i < history.length; i += 2) {
      this.formattedMoves.push({
        num: Math.floor(i / 2) + 1,
        w: history[i],
        b: history[i + 1] || ''
      });
    }
  }

  selectDifficulty(elo: number) {
    this.selectedElo = elo;
    this.eloChanged.emit(elo);
    console.log(`Bot qiyinligi o'zgartirildi: ${elo} ELO`);
  }

  onRestartClick() {
    this.restartGame.emit();
  }
}