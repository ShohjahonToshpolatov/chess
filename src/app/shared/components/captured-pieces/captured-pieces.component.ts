import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-captured-pieces',
  standalone: true,
  imports: [],
  templateUrl: './captured-pieces.component.html',
  styleUrl: './captured-pieces.component.scss'
})
export class CapturedPiecesComponent {
  @Input({ required: true }) isWhiteSide!: boolean;

  // Visual test uchun dastlabki o'g'irlangan figuralar
  @Input() pieces: string[] = ['♟', '♟', '♝'];
  @Input() scoreDiff: number = 2;
}