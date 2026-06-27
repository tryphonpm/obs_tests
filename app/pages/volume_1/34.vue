<template>
  <article class="book-page">
    <blockquote class="title-blockquote">
      Pont que tue le pas
    </blockquote>

    <article class="enriched-text enriched-text--no-indexes" aria-label="Texte enrichi" style="--col-count: 1">
      <div class="enriched-text__columns">
    <div class="enriched-text__column">
    <section class="enriched-text__paragraph" data-paragraph-index="0">
      <div class="enriched-text__lines">
        <div class="enrichment-dropcap" aria-hidden="true">F</div>
        <span class="enriched-text__line" data-line-index="0" style="--indent-level: 0"><em class="enriched-text__italic">orce publique offerte au langage<br>réduisant par le grade des valses à points<br>tout troupeau qui beugle d’amour au coin du champs<br>seul sous l’arbre seul sans nids sans becs<br>la majesté de tous dont je respire le lait<br>appuyé d’un regard qui cueille les quelques verbes croisés<br>voulant penser encore<br>à cette fenêtre proprement débranchée du mur<br>à la poursuite de la respiration de l’avant-dernier souffle<br>à demi libre encor<br>sentir la précision de chaque prière lancée à chaque coup reçu<br>et la boite-là qui vibre de tout son bois<br>dans une terre profonde creusée d’humidité à la pioche<br>les bonds de la pensée aux pas de l’inconnu proche<br>n’abusent jamais de la glissade ponctuante<br>qui tend à sertir de plomb les attaches<br>pose de verrous multiples sur les ports de marins acquis<br>oui une tempête nous abritait jusqu’ici<br>marges et protections invisibles et sanglées<br>qui d’un retour de mots grossiers noient la mer elle-même<br>si le temps jaloux les respecte tant et tant<br>c’est pour qu’anonyme s’achemine<br>l’oubli fermé des ondes<br>bon an mal an claudiquant<br>compagnon d’agonie des nixes amies tricentenaires<br>qui s’affament sans leurs dents<br>La geste s’arme en bonds disciplinés.</em></span>
      </div>
    </section>
    </div>
      </div>
      <div class="enriched-text__footer">
        <a href="/" class="enriched-text__nav-btn" aria-label="Retour à l'accueil"></a>
      </div>
    </article>

    <p class="book-page__number">
      - 34 -
    </p>
  </article>
</template>

<style scoped>
.enriched-text {
  position: relative;
  width: calc(
    var(--col-count) * var(--spacing-enrichment-column-min-width)
    + (var(--col-count) - 1) * var(--spacing-enrichment-column-gap)
  );
  max-width: var(--spacing-book-page-content-max-width);
  min-width: var(--spacing-enrichment-column-min-width);
  color: var(--color-enrichment-text);
  font-family: var(--font-enrichment-body);
  font-size: var(--text-enrichment-body);
  line-height: var(--leading-enrichment-body);
}

.enriched-text__columns {
  display: flex;
  gap: var(--spacing-enrichment-column-gap);
  width: 100%;
}

.enriched-text__column {
  display: flex;
  flex-direction: column;
  flex: 0 0 var(--spacing-enrichment-column-min-width);
  gap: var(--spacing-enrichment-paragraph-gap);
  min-width: var(--spacing-enrichment-column-min-width);
}

.enriched-text__paragraph {
  display: grid;
  grid-template-columns: var(--spacing-enrichment-index-column) minmax(0, 1fr);
  gap: var(--spacing-enrichment-column-gap);
  margin: 0;
}

.enriched-text--no-indexes .enriched-text__paragraph {
  grid-template-columns: minmax(0, 1fr);
}

.enriched-text__paragraph-index {
  align-self: start;
  color: var(--color-enrichment-accent);
  font-family: var(--font-enrichment-meta);
  font-size: var(--text-enrichment-meta);
  letter-spacing: var(--tracking-enrichment-meta);
  opacity: var(--opacity-enrichment-meta);
}

.enriched-text__lines {
  display: block;
  margin: 0;
}

.enriched-text__lines:has(.enrichment-dropcap)::after {
  content: "";
  display: table;
  clear: both;
}

.enrichment-dropcap {
  display: inline-block;
  float: left;
  box-sizing: content-box;
  margin: 0;
  padding-right: 10px;
  color: var(--color-enrichment-text);
  font-family: var(--font-book-dropcap);
  font-size: calc(var(--text-book-dropcap-lines) * var(--leading-book-body) * 1em);
  line-height: 1;
  vertical-align: top;
  transform: translateY(-5px);
  shape-outside: border-box;
}

.enriched-text__line {
  display: block;
  line-height: var(--leading-enrichment-body);
  margin-left: calc(var(--indent-level) * var(--spacing-enrichment-indent-step));
  white-space: nowrap;
}

.enriched-text__italic {
  font-style: italic;
  white-space: pre;
}

.enriched-text__inline-indent {
  display: inline-block;
  margin-left: calc(var(--extra-indent-level) * var(--spacing-enrichment-indent-step));
}

.enriched-text__marked {
  position: relative;
  display: block;
  width: fit-content;
  max-width: 100%;
  margin-left: auto;
  padding: 1rem 1rem 1rem calc(0.9rem + 60px);
  border-radius: 0 var(--radius-sm) var(--radius-sm) 0;
  background-color: color-mix(in srgb, var(--color-book-marked-background) 50%, transparent);
  color: var(--color-book-marked-text);
  font-family: "Libertinus Mono", monospace;
  font-size: 0.75em;
  text-align: right;
  white-space: pre-line;
}

.enriched-text__marked::before {
  content: "";
  position: absolute;
  inset-block: 0;
  inset-inline-start: 0;
  width: 10px;
  background: linear-gradient(
    to bottom,
    color-mix(in srgb, var(--color-book-marked-background) 50%, transparent),
    color-mix(in srgb, #ffffff 10%, transparent)
  );
}

.enriched-text__rule,
.enriched-text__block-rule {
  display: block;
  width: 100%;
  height: 0.7pt;
  margin: var(--spacing-enrichment-paragraph-gap) 0;
  background: var(--color-enrichment-rule);
  border: 0;
}

.enriched-text__espace {
  display: block;
  flex-shrink: 0;
  height: 0;
  margin: 0;
}

.enriched-text__image {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: calc(var(--spacing-enrichment-paragraph-gap) * 0.01) 0;
}

.enriched-text__image-el {
  display: block;
  max-width: 100%;
  height: auto;
}

.enriched-text__footer {
  display: flex;
  justify-content: flex-end;
  width: 100%;
  margin-top: var(--spacing-enrichment-paragraph-gap);
}

.enriched-text__nav-btn {
  display: block;
  width: 14px;
  height: 14px;
  background-color: #333333;
  transition: background-color 0.15s ease, transform 0.1s ease;
}

.enriched-text__nav-btn:hover {
  background-color: #4a4a4a;
}

.enriched-text__nav-btn:active {
  background-color: #222222;
  transform: scale(0.92);
}
</style>
