package com.mobileapp.model;
import jakarta.persistence.*;
import jakarta.validation.constraints.Positive;
import lombok.*;
import jakarta.validation.constraints.NotBlank;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString(exclude = {"putovanja"})
@Table(name = "kompanija")
public class Kompanija {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "naziv", nullable = false)
    @NotBlank
    private String naziv;
    @Column(name = "kontakt", nullable = false)
    @NotBlank
    private String kontakt;
    @OneToMany(fetch = FetchType.LAZY, mappedBy = "kompanija")
    @Builder.Default
    private List<Putovanje> putovanja = new ArrayList<>();


}
