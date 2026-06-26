<script setup lang="ts">
type PageLink = {
  to: string
  label: string
}

const pageLinks: PageLink[] = [
  {
    "to": "/9",
    "label": "p.9 - L’excuse de la girafe"
  },
  {
    "to": "/10",
    "label": "p.10 - Sept lieues"
  },
  {
    "to": "/12",
    "label": "p.12 - Monsieur Atroce et la main courante"
  },
  {
    "to": "/14",
    "label": "p.14 - Daimons de la rose"
  },
  {
    "to": "/16",
    "label": "p.16 - Le che rugit et se tait [sic]."
  },
  {
    "to": "/17",
    "label": "p.17 - Grossièrement contre le vrai"
  },
  {
    "to": "/20",
    "label": "p.20 - La forêt qui boite et l’arbre qui ne dit mot"
  },
  {
    "to": "/22",
    "label": "p.22 - L’imparfait, le don et son poison"
  },
  {
    "to": "/24",
    "label": "p.24 - De guerre lasse bien dégueulasse"
  },
  {
    "to": "/25",
    "label": "p.25 - Un matin anonyme face aux fidèles assoiffés"
  },
  {
    "to": "/26",
    "label": "p.26 - La justice comique des puits"
  },
  {
    "to": "/28",
    "label": "p.28 - Le piano à poings et la violence rémunérée"
  },
  {
    "to": "/29",
    "label": "p.29 - Comment va ton corps ?"
  },
  {
    "to": "/30",
    "label": "p.30 - L’apocalypse, mais de justesse"
  },
  {
    "to": "/31",
    "label": "p.31 - Round and round"
  },
  {
    "to": "/33",
    "label": "p.33 - Non, je suis ton père"
  },
  {
    "to": "/34",
    "label": "p.34 - Pont que tue le pas"
  },
  {
    "to": "/35",
    "label": "p.35 - Le rôdeur signe à l’hôtel de son contrat"
  },
  {
    "to": "/36",
    "label": "p.36 - La galaxie, le châtiment et le Kavalier"
  },
  {
    "to": "/37",
    "label": "p.37 - La variation du corps fêlé"
  },
  {
    "to": "/38",
    "label": "p.38 - Les deux chiens du cercle"
  },
  {
    "to": "/39",
    "label": "p.39 - Troyes à la suite, Champagne !"
  },
  {
    "to": "/40",
    "label": "p.40 - La tour à Boli"
  },
  {
    "to": "/42",
    "label": "p.42 - Un décroisé à l’asile"
  },
  {
    "to": "/44",
    "label": "p.44 - Le plateau bioluminescent des abysses"
  },
  {
    "to": "/45",
    "label": "p.45 - Le coq et la pendule, en triste"
  },
  {
    "to": "/46",
    "label": "p.46 - Art, billes, corps"
  },
  {
    "to": "/47",
    "label": "p.47 - Vantanoir"
  },
  {
    "to": "/48",
    "label": "p.48 - Les godasses du pharaon"
  },
  {
    "to": "/50",
    "label": "p.50 - Sur la route désaccordée d’un couack"
  },
  {
    "to": "/52",
    "label": "p.52 - La machette à couper les nombrils"
  },
  {
    "to": "/54",
    "label": "p.54 - La détresse du drone et de sa proie médicale"
  },
  {
    "to": "/55",
    "label": "p.55 - Citoyens, toutes nos épées sont pleines de sang."
  },
  {
    "to": "/56",
    "label": "p.56 - L’Enigma impérial de Christopher"
  },
  {
    "to": "/58",
    "label": "p.58 - Le rien sous les coquillages"
  },
  {
    "to": "/59",
    "label": "p.59 - Olympie, à l’épreuve, déballe"
  },
  {
    "to": "/60",
    "label": "p.60 - Chrisme"
  },
  {
    "to": "/61",
    "label": "p.61 - Ba*(lzac == ch)"
  },
  {
    "to": "/62",
    "label": "p.62 - Les couleurs révisées de Stockholm"
  },
  {
    "to": "/63",
    "label": "p.63 - Franchir la grille du parc d’attraction au travail"
  },
  {
    "to": "/64",
    "label": "p.64 - Orgue bar pour sans paradis fixe"
  },
  {
    "to": "/65",
    "label": "p.65 - Suites et fins de l’accoutumance."
  },
  {
    "to": "/66",
    "label": "p.66 - À l’article de la solitude"
  },
  {
    "to": "/68",
    "label": "p.68 - La boutanche du Prest agitateur"
  },
  {
    "to": "/69",
    "label": "p.69 - Fin de nuit, le bilan"
  },
  {
    "to": "/70",
    "label": "p.70 - Aucun partage n’est prévu"
  },
  {
    "to": "/71",
    "label": "p.71 - Le fâcheux de Pignerol"
  },
  {
    "to": "/72",
    "label": "p.72 - Prénommons-nous dans les bois"
  },
  {
    "to": "/73",
    "label": "p.73 - En cinq minutes, ouverts comme des livres."
  },
  {
    "to": "/74",
    "label": "p.74 - Dieu dans les détails"
  },
  {
    "to": "/75",
    "label": "p.75 - Le picard et le baldaquin"
  },
  {
    "to": "/76",
    "label": "p.76 - L’ère qui mène aux tocs"
  },
  {
    "to": "/77",
    "label": "p.77 - Schwingung menthe"
  },
  {
    "to": "/78",
    "label": "p.78 - Au tableau, pour l’explosion"
  },
  {
    "to": "/79",
    "label": "p.79 - Sosie font, font, font"
  },
  {
    "to": "/80",
    "label": "p.80 - Numericain dans la descente aux loups"
  },
  {
    "to": "/82",
    "label": "p.82 - Définitoire si tôt"
  },
  {
    "to": "/83",
    "label": "p.83 - A.... S... P.. M. || p"
  },
  {
    "to": "/84",
    "label": "p.84 - Vraiment, dès Sisyphe"
  },
  {
    "to": "/85",
    "label": "p.85 - Musique des musiques"
  },
  {
    "to": "/86",
    "label": "p.86 - Le premier chien bien coiffé"
  },
  {
    "to": "/87",
    "label": "p.87 - Le voyage de la lettre ‘ n ’"
  },
  {
    "to": "/88",
    "label": "p.88 - La porte du procès confiée au Serrurier-des-Songes"
  },
  {
    "to": "/90",
    "label": "p.90 - Le guide des mots passants"
  },
  {
    "to": "/91",
    "label": "p.91 - Timber calculemus !!!"
  },
  {
    "to": "/93",
    "label": "p.93 - La cage ouverte"
  }
]
</script>

<template>
  <div>
    <div class="mt-100">
      <p v-for="page in pageLinks" :key="page.to">
        <NuxtLink :to="page.to">
          {{ page.label }}
        </NuxtLink>
      </p>
    </div>
  </div>
</template>
