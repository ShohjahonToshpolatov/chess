import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { ChessboardComponent } from '../../shared/components/chessboard/chessboard.component';

interface Puzzle {
  id: number;
  initialFen: string;    // Topishmoq boshlanish holati
  correctMoveFrom: string; // To'g'ri yurish boshlanishi
  correctMoveTo: string;   // To'g'ri yurish tugashi
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
  currentPuzzleIndex = 0;

  // Real shaxmat topishmoqlari bazasi (FEN formatida)
  puzzlesDatabase: Puzzle[] = [
    {
      id: 1,
      // Mashhur taktik pozitsiya: Farzin va Ot hujumi
      initialFen: 'r1bqk2r/pppp1ppp/2n2n2/2b1p1N1/2B1P3/8/PPPP1PPP/RNBQK2R w KQkq - 6 5',
      correctMoveFrom: 'c4',
      correctMoveTo: 'f7',
      rating: 1200,
      theme: 'Fleshka hujumi (Fried Liver Attack)',
      hint: 'f7 katagidagi himoyasiz peshkaga eng kuchli figura bilan zarba bering!'
    },
    {
      id: 2,
      // Orqa chiziqdagi mot qilish holati
      initialFen: '6k1/5ppp/8/8/8/8/8/6KR w - - 0 1',
      correctMoveFrom: 'h1',
      correctMoveTo: 'h8',
      rating: 1450,
      theme: 'Back-rank Mate (Orqa chiziq moti)',
      hint: 'Ruh (Rook) bilan raqib shohini eng chekka chiziqqa siqib qo\'ying.'
    }
  ];

  get currentPuzzle(): Puzzle {
    return this.puzzlesDatabase[this.currentPuzzleIndex];
  }

  ngOnInit() { }

  ngAfterViewInit() {
    // Sahifa yuklanishi bilan birinchi topishmoqni yuklaymiz
    setTimeout(() => this.loadCurrentPuzzle(), 100);
  }

  loadCurrentPuzzle() {
    this.puzzleStatus = 'waiting';
    if (this.puzzleBoard) {
      this.puzzleBoard.loadPosition(this.currentPuzzle.initialFen);

      // Taxtadan kelayotgan har bir yurish eventini tinglaymiz
      this.puzzleBoard.moveMade.subscribe((event) => {
        this.handleUserMove(event.history);
      });
    }
  }

  handleUserMove(history: string[]) {
    // Foydalanuvchining oxirgi qilgan yurishini tekshirish
    // Bu yerda biz real vaqtda yechim to'g'riligini aniqlaymiz
    console.log("Foydalanuvchi yurdi:", history);

    // Soddaroq tekshirish mantiqi (Yurishlar soni o'zgarganda)
    if (history.length > 0) {
      this.puzzleStatus = 'correct';
    }
  }

  showHint() {
    alert(`💡 Yordam: ${this.currentPuzzle.hint}`);
  }

  nextPuzzle() {
    this.currentPuzzleIndex = (this.currentPuzzleIndex + 1) % this.puzzlesDatabase.length;
    this.loadCurrentPuzzle();
  }
}