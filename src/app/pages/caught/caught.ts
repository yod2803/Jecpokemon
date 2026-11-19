import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CaughtPokemon, PokemonBagService } from '../../services/pokemon-bag';

@Component({
  selector: 'app-caught',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './caught.html',
  styleUrl: './caught.css',
})
export class Caught implements OnInit {
  private route = inject(ActivatedRoute);
  bag = inject(PokemonBagService);

  pokemonList = signal<CaughtPokemon[]>([]);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const rawParam = params.get('data');

      if (rawParam) {
        try {
          const parsed: { id: number; name: string }[] = JSON.parse(decodeURIComponent(rawParam));
          const mapped: CaughtPokemon[] = parsed.map((item) => ({
            id: item.id,
            name: item.name,
            sprite: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${item.id}.png`,
          }));
          this.pokemonList.set(mapped);
          return;
        } catch {
          // หากถอดรหัสไม่สำเร็จ ให้ใช้ข้อมูลสำรองจาก Service
        }
      }

      this.pokemonList.set(this.bag.caughtList());
    });
  }

  releasePokemon(index: number): void {
    this.pokemonList.update((list) => list.filter((_, i) => i !== index));
    this.bag.releasePokemon(index);
  }

  clearAll(): void {
    this.pokemonList.set([]);
    this.bag.clearAll();
  }
}