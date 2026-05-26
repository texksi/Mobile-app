package com.mobileapp.model;


import jakarta.persistence.*;
import lombok.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Builder
@ToString(exclude = {"ocene"})
@Table(name = "korisnik")
public class Korisnik {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "ime", nullable = false)
    @NotBlank
    private String ime;
    @Column(name = "prezime", nullable = false)
    @NotBlank
    private String prezime;
    @Column(name = "email", nullable = false, unique = true)
    @NotBlank
    private String email;
    @Column(name = "username", nullable = false, unique = true)
    @NotBlank
    private String username;
    @Column(name = "password", nullable = false)
    @NotBlank
    private String password;
    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    @NotNull
    private Role role;

}
