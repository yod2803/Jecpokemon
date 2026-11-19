import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CaughtPokemon, PokemonBagService } from '../../services/pokemon-bag';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  bag = inject(PokemonBagService);
  private router = inject(Router);

  wildPokemon = signal<CaughtPokemon | null>(null);
  isLoading = signal<boolean>(false);
  isCatching = signal<boolean>(false);
  message = signal<string>('กำลังหาโปเกมอน...');

  ngOnInit(): void {
    this.findPokemon();
  }

  async findPokemon(): Promise<void> {
    if (this.isCatching()) return;

    this.isLoading.set(true);
    this.message.set('กำลังเดินหาโปเกมอน...');

    try {
      const id = Math.floor(Math.random() * 151) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
      const data = await res.json();

      this.wildPokemon.set({
        id: data.id,
        name: data.name,
        sprite:
          data.sprites?.other?.['official-artwork']?.front_default ||
          data.sprites?.front_default,
      });
      this.message.set(`พบ ${data.name.toUpperCase()} แล้ว!`);
    } catch {
      this.message.set('โหลดไม่สำเร็จ ลองกดหาตัวใหม่ดูครับ');
    } finally {
      this.isLoading.set(false);
    }
  }

  catchPokemon(): void {
    const poke = this.wildPokemon();
    if (!poke || this.isCatching() || this.isLoading()) return;

    this.isCatching.set(true);
    this.message.set(`กำลังโยนบอลจับ ${poke.name.toUpperCase()}...`);

    setTimeout(() => {
      const success = Math.random() < 0.65;

      if (success) {
        this.bag.addPokemon(poke);
        this.message.set(`จับ ${poke.name.toUpperCase()} ได้แล้ว!`);
        this.wildPokemon.set(null);
        this.isCatching.set(false);
        setTimeout(() => this.findPokemon(), 1000);
      } else {
        this.message.set(`${poke.name.toUpperCase()} ดิ้นหลุด! ลองกดจับอีกครั้ง`);
        this.isCatching.set(false);
      }
    }, 800);
  }

  // ส่งข้อมูลโปเกมอนที่จับได้ผ่าน Path Parameter ไปหน้า /caught/:data
  goToCaughtPage(): void {
    const list = this.bag.caughtList();
    // ย่อข้อมูลส่งเฉพาะ id และ name เพื่อไม่ให้ URL ยาวเกินไป (แล้วไปดึงรูปจาก ID ได้ทันที)
    const compactData = list.map((p) => ({ id: p.id, name: p.name }));
    const encodedData = encodeURIComponent(JSON.stringify(compactData));

    this.router.navigate(['/caught', encodedData]);
  }
}