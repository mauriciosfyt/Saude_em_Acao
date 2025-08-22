package br.com.saudeemacao.api.model;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Exercicio {
    private String nome;
    private int series;
    private int repeticoes;
    private double carga;
    private String imagemUrl;
    private String tipoDeSerie;
}