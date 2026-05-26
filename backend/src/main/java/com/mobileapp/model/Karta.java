package com.mobileapp.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString(exclude = {"rezervacija","putovanje"})
@Table(name = "karta")
public class Karta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "broj_sedista", nullable = false)
    @NotBlank
    private String brojSedista;
    @Column(name = "osnovna_cena", nullable = false)
    @Positive
    private double osnovnaCena;
    @Column(name = "datum_izdavanja", nullable = false)
    @Builder.Default
    private LocalDateTime datumIzdavanja = LocalDateTime.now();
    @Column(name = "tip", nullable = false)
    @NotBlank
    private String tip;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rezervacija_id")
    private Rezervacija rezervacija;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "putovanje_id")
    private Putovanje putovanje;

}
