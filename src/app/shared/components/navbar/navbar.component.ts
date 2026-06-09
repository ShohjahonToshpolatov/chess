import { Component, HostListener } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface NotificationItem {
  id: number;
  text: string;
  time: string;
  isRead: boolean;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  isNotificationOpen = false;
  isProfileOpen = false;

  notifications: NotificationItem[] = [
    { id: 1, text: 'Stockfish AI sizni o\'yinga chaqirmoqda!', time: '2 daq oldin', isRead: false },
    { id: 2, text: 'Yangi Puzzles paketi yuklandi.', time: '1 soat oldin', isRead: false },
    { id: 3, text: 'Taktik tahlil yakunlandi.', time: 'Kecha', isRead: true }
  ];

  get unreadCount() {
    return this.notifications.filter(n => !n.isRead).length;
  }

  toggleNotifications() {
    this.isNotificationOpen = !this.isNotificationOpen;
    this.isProfileOpen = false;
  }

  toggleProfile() {
    this.isProfileOpen = !this.isProfileOpen;
    this.isNotificationOpen = false;
  }

  markAllAsRead() {
    this.notifications.forEach(n => n.isRead = true);
  }

  readNotification(id: number) {
    const notif = this.notifications.find(n => n.id === id);
    if (notif) notif.isRead = true;
  }

  logout() {
    console.log('Tizimdan chiqildi');
  }

  // Ekrandan tashqariga bosilganda oyna yopiladi
  @HostListener('document:click')
  closeDropdowns() {
    this.isNotificationOpen = false;
    this.isProfileOpen = false;
  }
}