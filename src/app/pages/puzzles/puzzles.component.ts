import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChessboardComponent } from '../../shared/components/chessboard/chessboard.component';

interface ChessPuzzle {
  id: number;
  title: string;
  fen: string;           // Vaziyat boshlanishi
  solutionFrom: string;  // To'g'ri yurish boshlang'ich katagi
  solutionTo: string;    // To'g'ri yurish yakuniy katagi
  rating: number;
  description: string;
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

  // Real Shaxmat Taktikalari Bazasi
  puzzlesDb: ChessPuzzle[] = [
    {
      id: 1,
      title: "Fried Liver Attack (Fleshka Zarbasi)",
      fen: "r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 6 5",
      solutionFrom: "c4",
      solutionTo: "f7",
      rating: 1100,
      description: "Oqlar bilan o'ynaysiz. Raqibning f7 peshkasiga hal qiluvchi zarba bering!",
      hint: "Oq fillar (Bishop) f7 dagi zaif peshkaga qarab turibdi."
    },
    {
      id: 2,
      title: "Back-Rank Mate (Orqa chiziq moti)",
      fen: "6k1/5ppp/8/8/8/8/8/6KR w - - 0 1",
      solutionFrom: "h1",
      solutionTo: "h8",
      rating: 1350,
      description: "Raqib shohi qamalib qolgan. Birgina yurishda mot qiling!",
      hint: "Ruhingizni (Rook) oxirgi gorizontal liniyaga olib o'ting."
    }
  ];

  get currentPuzzle(): ChessPuzzle {
    return this.puzzlesDb[this.currentIndex];
  }

  ngOnInit() { }

  ngAfterViewInit() {
    // Komponent yuklangandan keyin biroz kutib pozitsiyani yuklaymiz
    setTimeout(() => this.loadPuzzle(), 150);
  }

  loadPuzzle() {
    this.puzzleStatus = 'waiting';
    if (this.puzzleBoard) {
      // Taxtaga yangi pozitsiyani FEN orqali yuklaymiz
      this.puzzleBoard.loadPosition(this.currentPuzzle.fen);

      // Taxtadan kelayotgan har bir yurish eventini tinglash
      this.puzzleBoard.moveMade.unsubscribe(); // Oldingi subscriberlarni tozalash
      this.puzzleBoard.moveMade.subscribe((event: any) => {
        this.verifyUserMove(event.history);
      });
    }
  }

  // Foydalanuvchi yurishini real vaqtda tekshirish algoritmi
  verifyUserMove(history: string[]) {
    if (!history || history.length === 0) return;

    // Chessboard komponentidagi ichki chess.js obyektidan oxirgi yurish tafsilotlarini olish
    // Bizga foydalanuvchi qaysi katakdan qaysi katakka yurgani kerak
    const boardApi = (this.puzzleBoard as any).chess;
    const moveHistory = boardApi.history({ verbose: true });
    const lastMove = moveHistory[moveHistory.length - 1];

    if (lastMove) {
      const userFrom = lastMove.from;
      const userTo = lastMove.to;

      // Biz kutgan to'g'ri yechim bilan solishtiramiz
      if (userFrom === this.currentPuzzle.solutionFrom && userTo === this.currentPuzzle.solutionTo) {
        this.puzzleStatus = 'correct';
        console.log("To'g'ri yechim topildi!");
      } else {
        this.puzzleStatus = 'wrong';
        console.log("Xato yurish qildingiz.");
        // Agar xato bo'lsa, taxtani srazi eski holatiga qaytarib qo'yamiz
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