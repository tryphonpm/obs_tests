<script setup lang="ts">
type PageLink = {
  to: string
  label: string
}

const pageLinks: PageLink[] = [
  {
    "to": "/volume_1/volume_1/9",
    "label": "p.9 - L’excuse de la girafe"
  },
  {
    "to": "/volume_1/10",
    "label": "p.10 - Sept lieues"
  },
  {
    "to": "/volume_1/12",
    "label": "p.12 - Monsieur Atroce et la main courante"
  },
  {
    "to": "/volume_1/14",
    "label": "p.14 - Daimons de la rose"
  },
  {
    "to": "/volume_1/16",
    "label": "p.16 - Le che rugit et se tait [sic]."
  },
  {
    "to": "/volume_1/17",
    "label": "p.17 - Grossièrement contre le vrai"
  },
  {
    "to": "/volume_1/20",
    "label": "p.20 - La forêt qui boite et l’arbre qui ne dit mot"
  },
  {
    "to": "/volume_1/22",
    "label": "p.22 - L’imparfait, le don et son poison"
  },
  {
    "to": "/volume_1/24",
    "label": "p.24 - De guerre lasse bien dégueulasse"
  },
  {
    "to": "/volume_1/25",
    "label": "p.25 - Un matin anonyme face aux fidèles assoiffés"
  },
  {
    "to": "/volume_1/26",
    "label": "p.26 - La justice comique des puits"
  },
  {
    "to": "/volume_1/28",
    "label": "p.28 - Le piano à poings et la violence rémunérée"
  },
  {
    "to": "/volume_1/29",
    "label": "p.29 - Comment va ton corps ?"
  },
  {
    "to": "/volume_1/30",
    "label": "p.30 - L’apocalypse, mais de justesse"
  },
  {
    "to": "/volume_1/31",
    "label": "p.31 - Round and round"
  },
  {
    "to": "/volume_1/33",
    "label": "p.33 - Non, je suis ton père"
  },
  {
    "to": "/volume_1/34",
    "label": "p.34 - Pont que tue le pas"
  },
  {
    "to": "/volume_1/35",
    "label": "p.35 - Le rôdeur signe à l’hôtel de son contrat"
  },
  {
    "to": "/volume_1/36",
    "label": "p.36 - La galaxie, le châtiment et le Kavalier"
  },
  {
    "to": "/volume_1/37",
    "label": "p.37 - La variation du corps fêlé"
  },
  {
    "to": "/volume_1/38",
    "label": "p.38 - Les deux chiens du cercle"
  },
  {
    "to": "/volume_1/39",
    "label": "p.39 - Troyes à la suite, Champagne !"
  },
  {
    "to": "/volume_1/40",
    "label": "p.40 - La tour à Boli"
  },
  {
    "to": "/volume_1/42",
    "label": "p.42 - Un décroisé à l’asile"
  },
  {
    "to": "/volume_1/44",
    "label": "p.44 - Le plateau bioluminescent des abysses"
  },
  {
    "to": "/volume_1/45",
    "label": "p.45 - Le coq et la pendule, en triste"
  },
  {
    "to": "/volume_1/46",
    "label": "p.46 - Art, billes, corps"
  },
  {
    "to": "/volume_1/47",
    "label": "p.47 - Vantanoir"
  },
  {
    "to": "/volume_1/48",
    "label": "p.48 - Les godasses du pharaon"
  },
  {
    "to": "/volume_1/50",
    "label": "p.50 - Sur la route désaccordée d’un couack"
  },
  {
    "to": "/volume_1/52",
    "label": "p.52 - La machette à couper les nombrils"
  },
  {
    "to": "/volume_1/54",
    "label": "p.54 - La détresse du drone et de sa proie médicale"
  },
  {
    "to": "/volume_1/55",
    "label": "p.55 - Citoyens, toutes nos épées sont pleines de sang."
  },
  {
    "to": "/volume_1/56",
    "label": "p.56 - L’Enigma impérial de Christopher"
  },
  {
    "to": "/volume_1/58",
    "label": "p.58 - Le rien sous les coquillages"
  },
  {
    "to": "/volume_1/59",
    "label": "p.59 - Olympie, à l’épreuve, déballe"
  },
  {
    "to": "/volume_1/60",
    "label": "p.60 - Chrisme"
  },
  {
    "to": "/volume_1/61",
    "label": "p.61 - Ba*(lzac == ch)"
  },
  {
    "to": "/volume_1/62",
    "label": "p.62 - Les couleurs révisées de Stockholm"
  },
  {
    "to": "/volume_1/63",
    "label": "p.63 - Franchir la grille du parc d’attraction au travail"
  },
  {
    "to": "/volume_1/64",
    "label": "p.64 - Orgue bar pour sans paradis fixe"
  },
  {
    "to": "/volume_1/65",
    "label": "p.65 - Suites et fins de l’accoutumance."
  },
  {
    "to": "/volume_1/66",
    "label": "p.66 - À l’article de la solitude"
  },
  {
    "to": "/volume_1/68",
    "label": "p.68 - La boutanche du Prest agitateur"
  },
  {
    "to": "/volume_1/69",
    "label": "p.69 - Fin de nuit, le bilan"
  },
  {
    "to": "/volume_1/70",
    "label": "p.70 - Aucun partage n’est prévu"
  },
  {
    "to": "/volume_1/71",
    "label": "p.71 - Le fâcheux de Pignerol"
  },
  {
    "to": "/volume_1/72",
    "label": "p.72 - Prénommons-nous dans les bois"
  },
  {
    "to": "/volume_1/73",
    "label": "p.73 - En cinq minutes, ouverts comme des livres."
  },
  {
    "to": "/volume_1/74",
    "label": "p.74 - Dieu dans les détails"
  },
  {
    "to": "/volume_1/75",
    "label": "p.75 - Le picard et le baldaquin"
  },
  {
    "to": "/volume_1/76",
    "label": "p.76 - L’ère qui mène aux tocs"
  },
  {
    "to": "/volume_1/77",
    "label": "p.77 - Schwingung menthe"
  },
  {
    "to": "/volume_1/78",
    "label": "p.78 - Au tableau, pour l’explosion"
  },
  {
    "to": "/volume_1/79",
    "label": "p.79 - Sosie font, font, font"
  },
  {
    "to": "/volume_1/80",
    "label": "p.80 - Numericain dans la descente aux loups"
  },
  {
    "to": "/volume_1/82",
    "label": "p.82 - Définitoire si tôt"
  },
  {
    "to": "/volume_1/83",
    "label": "p.83 - A.... S... P.. M. || p"
  },
  {
    "to": "/volume_1/84",
    "label": "p.84 - Vraiment, dès Sisyphe"
  },
  {
    "to": "/volume_1/85",
    "label": "p.85 - Musique des musiques"
  },
  {
    "to": "/volume_1/86",
    "label": "p.86 - Le premier chien bien coiffé"
  },
  {
    "to": "/volume_1/87",
    "label": "p.87 - Le voyage de la lettre ‘ n ’"
  },
  {
    "to": "/volume_1/88",
    "label": "p.88 - La porte du procès confiée au Serrurier-des-Songes"
  },
  {
    "to": "/volume_1/90",
    "label": "p.90 - Le guide des mots passants"
  },
  {
    "to": "/volume_1/91",
    "label": "p.91 - Timber calculemus !!!"
  },
  {
    "to": "/volume_1/93",
    "label": "p.93 - La cage ouverte"
  }
]
</script>

<template>
  <div class="mt-20">
    <h2 class="title-blockquote text-xl">
      Bac à Fables
    </h2>
    <div class="index-page__links mt-20">
      <p
        v-for="page in pageLinks"
        :key="page.to"
        class="index-page__link-item"
      >
        <NuxtLink :to="page.to">
          {{ page.label }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>

<style scoped>

.index-page__links {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.5rem 1.5rem;
  font-family: "Aquiline Two", serif;
  font-size: 150%;
}

.index-page__link-item {
  margin: 0;
}
</style>
