package com.mobileapp.model;

import com.mobileapp.model.enums.NacinPlacanja;
import com.mobileapp.model.enums.StatusRezervacije;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString(exclude = {"korisnik","karte"})
@Table(name = "rezervacija")
public class Rezervacija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "datum_kreiranja", nullable = false)
    @Builder.Default
    private LocalDateTime datumKreiranja = LocalDateTime.now();
    @Column(name = "ukupan_iznos", nullable = false)
    @Positive
    private double ukupanIznos;
    @Enumerated(EnumType.STRING)
    @Column(name = "nacin_placanja", nullable = false)
    @NotNull
    private NacinPlacanja nacinPlacanja;
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    @NotNull
    private StatusRezervacije status;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "korisnik_id")
    private Korisnik korisnik;
    @OneToMany(mappedBy = "rezervacija", fetch = FetchType.LAZY)
    @Builder.Default
    private List<Karta> karte = new ArrayList<>();

}