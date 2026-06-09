import { Component } from '@angular/core';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  saveProfileSettings() {
    alert('💾 O\'zgarishlar muvaffaqiyatli saqlandi!');
  }
}