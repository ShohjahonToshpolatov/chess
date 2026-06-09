import { Component } from '@angular/core';

@Component({
  selector: 'app-move-history',
  standalone: true,
  imports: [],
  templateUrl: './move-history.component.html',
  styleUrl: './move-history.component.scss'
})
export class MoveHistoryComponent {
  // Visual test uchun dastlabki chiroyli yurishlar
  mockMoves = [
    { num: 1, w: 'e4', b: 'e5' },
    { num: 2, w: 'Nf3', b: 'Nc6' },
    { num: 3, w: 'Bb5', b: 'a6' },
    { num: 4, w: 'Ba4', b: '' }
  ];
}