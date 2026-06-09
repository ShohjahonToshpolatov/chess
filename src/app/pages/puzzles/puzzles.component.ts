import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChessboardComponent } from '../../shared/components/chessboard/chessboard.component';
import { Subscription } from 'rxjs';

interface ChessPuzzle {
  id: number;
  title: string;
  fen: string;
  solutionFrom: string;
  solutionTo: string;
  rating: number;
  theme: string;
  hint: string;
}

@Component({
  selector: 'app-puzzles',
  standalone: true,
  imports: [ChessboardComponent],
  templateUrl: './puzzles.component.html',
  styleUrl: './puzzles.component.scss'
})
export class PuzzlesComponent implements OnInit, AfterViewInit {
  @ViewChild('puzzleBoard') puzzleBoard!: ChessboardComponent;

  puzzleStatus: 'waiting' | 'correct' | 'wrong' = 'waiting';
  currentIndex = 0;
  private moveSubscription?: Subscription;

  puzzlesDb: ChessPuzzle[] = [
    {
      id: 1,
      title: "Fried Liver Attack",
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 6 5",
      solutionFrom: "c4",
      solutionTo: "f7",
      rating: 1100,
      theme: "Fleshka Zarbasi (Fried Liver)",
      hint: "f7 katagidagi himoyasiz peshkaga oq fil bilan hujum qiling."
    },
    {
      id: 2,
      title: "Back-Rank Mate",
      fen: "6k1/5ppp/8/8/8/8/8/6KR w - - 0 1",
      solutionFrom: "h1",
      solutionTo: "h8",
      rating: 1350,
      theme: "Orqa chiziq moti (Back-rank)",
      hint: "Ruh bilan raqib shohini eng yuqori chiziqda mot qiling."
    }
  ];

  get currentPuzzle(): ChessPuzzle {
    return this.puzzlesDb[this.currentIndex];
  }

  ngOnInit() { }

  ngAfterViewInit() {
    setTimeout(() => this.loadPuzzle(), 150);
  }

  loadPuzzle() {
    this.puzzleStatus = 'waiting';
    if (this.puzzleBoard) {
      this.puzzleBoard.loadPosition(this.currentPuzzle.fen);

      // Eski subscription mavjud bo'lsa, xotirani band qilmaslik uchun tozalaymiz
      if (this.moveSubscription) {
        this.moveSubscription.unsubscribe();
      }

      // Yangi harakatlarni tinglash
      this.moveSubscription = this.puzzleBoard.moveMade.subscribe((event: any) => {
        this.verifyUserMove();
      });
    }
  }

  verifyUserMove() {
    const boardApi = (this.puzzleBoard as any).chess;
    if (!boardApi) return;

    const moveHistory = boardApi.history({ verbose: true });
    const lastMove = moveHistory[moveHistory.length - 1];

    if (lastMove) {
      const userFrom = lastMove.from;
      const userTo = lastMove.to;

      if (userFrom === this.currentPuzzle.solutionFrom && userTo === this.currentPuzzle.solutionTo) {
        this.puzzleStatus = 'correct';
      } else {
        this.puzzleStatus = 'wrong';
        // Xato yurish bo'lsa, 1.2 soniyadan keyin taxtani asliga qaytaradi
        setTimeout(() => {
          this.puzzleBoard.loadPosition(this.currentPuzzle.fen);
          this.puzzleStatus = 'waiting';
        }, 1200);
      }
    }
  }

  getHint() {
    alert(`💡 Shaxmat ustasi maslahati:\n${this.currentPuzzle.hint}`);
  }

  nextPuzzle() {
    this.currentIndex = (this.currentIndex + 1) % this.puzzlesDb.length;
    this.loadPuzzle();
  }
}