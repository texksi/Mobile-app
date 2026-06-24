# BusTicket

Mobilna aplikacija za pretragu, rezervaciju i kupovinu autobuskih karata. Projekat je rađen u okviru predmeta [naziv predmeta] kao seminarski/projektni rad.

## Tehnologije

**Backend**
- Java 17, Spring Boot
- Spring Security + JWT (autentikacija)
- Spring Data JPA + Hibernate
- PostgreSQL
- MapStruct (mapiranje DTO <-> entitet)

**Frontend**
- React Native (Expo, Expo Router)
- TypeScript
- AsyncStorage (lokalno čuvanje tokena i korpe)

## Funkcionalnosti

### Korisnik (gost)
- Pregled svih putovanja i pretraga po polazištu/odredištu
- Pregled kompanija

### Korisnik (prijavljen)
- Registracija i prijava
- Dodavanje karte u korpu (izbor tipa karte: standard / business / first)
- Kupovina karata iz korpe (kreira se rezervacija i karte)
- Pregled sopstvenih rezervacija i karata u okviru njih

### Administrator
- CRUD za kompanije
- CRUD za putovanja
- Upravljanje korisnicima (pregled, izmena uloge, brisanje)

## Struktura projekta

```
backend/     -> Spring Boot REST API
mobile/      -> React Native (Expo) aplikacija
```

### Backend - model podataka

- `Korisnik` - korisnik aplikacije (ima ulogu: ADMIN, KORISNIK, GOST)
- `Kompanija` - prevoznik
- `Putovanje` - linija (polazište, odredište, vreme, cena, kompanija)
- `Karta` - kupljena karta (sedište, tip, cena, vezana za putovanje i rezervaciju)
- `Rezervacija` - grupa karata koje je korisnik kupio u jednom trenutku

## Pokretanje

### Backend

1. Kreirati PostgreSQL bazu
2. Podesiti `application.yaml` (url baze, korisničko ime, lozinka)
3. Pokrenuti `Application.java`

Backend radi na `http://localhost:8080`.

### Frontend

```bash
cd mobile
npm install
npx expo start
```

Za testiranje na telefonu (Expo Go) backend mora biti dostupan preko javnog URL-a, npr. pokretanjem `ngrok http 8080` i upisivanjem tog URL-a u `constants/api.ts`.

## Auth

Prijava i registracija vraćaju JWT token koji se čuva u `AsyncStorage`. Token se šalje u `Authorization` headeru za sve zaštićene rute. Uloga korisnika (`ADMIN` / `KORISNIK` / `GOST`) čita se iz tokena i koristi se za prikazivanje odgovarajućih tabova i zaštitu ekrana.