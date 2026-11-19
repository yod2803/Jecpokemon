import { Injectable, effect, signal } from '@angular/core';

export interface CaughtPokemon {
  id: number;
  name: string;
  sprite: string;
}

@Injectable({
  providedIn: 'root',
})
export class PokemonBagService {
  private readonly STORAGE_KEY = 'caught_pokemon_list';

  caughtList = signal<CaughtPokemon[]>(this.loadInitial());

  constructor() {
    effect(() => {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.caughtList()));
      } catch {
        // กรณีเบราว์เซอร์จำกัดการเข้าถึง localStorage
      }
    });
  }

  private loadInitial(): CaughtPokemon[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  addPokemon(pokemon: CaughtPokemon): void {
    this.caughtList.update((list) => [pokemon, ...list]);
  }

  releasePokemon(index: number): void {
    this.caughtList.update((list) => list.filter((_, i) => i !== index));
  }

  clearAll(): void {
    this.caughtList.set([]);
  }
}