package com.mobileapp.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString(exclude = {"karte","kompanija"})
@Table(name = "putovanje")
public class Putovanje {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "polaziste", nullable = false)
    @NotBlank
    private String polaziste;
    @Column(name = "odrediste", nullable = false)
    @NotBlank
    private String odrediste;
    @Column(name = "vreme_polaska", nullable = false)
    @Builder.Default
    private LocalDateTime vremePolaska = LocalDateTime.now();
    @Column(name = "vreme_dolaska", nullable = false)
    @Builder.Default
    private LocalDateTime vremeDolaska = LocalDateTime.now();
    @Column(name = "osnovna_cena", nullable = false)
    @Positive
    private double osnovnaCena;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "putovanje")
    @Builder.Default
    private List<Karta> karte = new ArrayList<>();
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "kompanija_id")
    private Kompanija kompanija;


}
