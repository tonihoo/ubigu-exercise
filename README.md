# Ubigu koodiharjoitustyö

## Sovelluksen osat

Sovellus koostuu kolmesta komponentista: serveri/api-rajapinta (Node.js / Fastify), tietokanta (PostgreSQL / PostGIS) sekä käyttöliittymä (React, MUI, OpenLayers).

## Sovelluksen käynnistäminen

Buildaa sovellus dockerilla (komentoriviltä ajettaessa)

```
docker compose build
```

Käynnistä sovellus:

```
docker compose up -d
```

Näiden jälkeen tulisi olla kullekin sovelluksen komponentille (server, client, db) oma docker-kontti ajossa. Käyttöliittymän voi nyt avata osoitteesta [http://localhost:8080](http://localhost:8080).

Yksittäisen kontin saa käynnistettyä uudelleen komennolla. Esimerkiksi serverin tapauksessa:

```
docker compose restart server
```

Sovelluksen ollessa käynnissä, voidaan tietokantamigraatiot ajaa komennolla:

```
docker compose exec server npm run db-migrate
```

Ajettavat migraatiot löytyvät kansiosta `/server/db_migrations`. Mikäli teet muutoksia tietokantaan, tee se luomalla uusi migraatiotiedosto johon sisällytät SQL-koodit, jonka jälkeen voit ajaa ylläolevan migraatioajon uudelleen.

Konttien logeja voi seurailla ajamalla komennon:

```
docker compose logs -f <kontin nimi>
```

## Uuden riippuvuuden lisääminen

Jos haluat lisätä uuden riippuvuuden, se pitää viedä myös kontin sisälle buildaamalla kontit uudestaan:

```sh
# Asennetaan uusi riippuvuus client/server/shared-kansiossa
npm i <uusi riippuvuus>

# Buildataan kontit uudestaan (muuttumattomat kontit tulevat cachesta)
docker compose build

# Ajetaan sovellus uudestaan ylös, samalla luoden nimeämättömät (node_modules) voluumit uudestaan
docker compose up -d -V
```

## Harjoitustyön tavoite

Tehtävänantona on täydentää jo olemassa olevaa siili-tietomallia kattamaan yksilöivän id:n lisäksi siilin nimi, ikä, sukupuoli sekä sijainti, jossa siili havaittiin.
Sovelluksen käyttämä siili-tyyppi löytyy `/shared/` -kansion alta. Tätä tyyppiä tulee laajentaa käsittämään uudet kentät.

Kun olet laajentanut siilien tietomallia vaadituilta osin, muuta siilien listausta siten, että listalla esitetään siilin nimi, ja nimeä klikkaamalla ko. siilin ID tulee valituksi. Tämä ID tulee välittää täältä komponentista komponentille `<HedgehogInfo>`, jossa valitun siilin tiedot esitetään. Mikäli yksittäisen siilin tiedot on valittuna, näytetään ko. siilin sijainti kartalla.

Toteuta komponetti `<HedgehogForm>`, jossa uusia siilihavaintoja voidaan rekisteröidä. Siilin koordinaatit saadaan välittyvät tälle komponentille karttaa klikatessa.

Toteutettavat varsinaiset toiminnallisuudet on tarkoituksella tehty melko suppeiksi, jotta näihin ei menisi liian paljon aikaa. Toiminnallisuuksien lisäksi toteutus tulisi saa julkistettua siten, että se on julkisessa Internetissä saatavilla. Esimerkiksi isoimmat pilvipalveluiden tarjoajat tarjoavat ilmaisia ajoympäristöjä, joihin sovelluksen voi pystyttää. Tällä mittaammme koodipähkinän suorittajien yleistä devops -osaamista.

Lisäksi mikäli kaikki yllä oleva sujuu joutuisasti, haluaisimme nähdä sovelluksen jollekin osalle kirjoitettavan testejä. Testit voivat olla toteutettuna millä tahansa kirjastolla ja ne voivat liittyä mihin tahansa sovelluksen osaan (esim. E2E-testit, backendin yksikkötestit jne.).

## Testien ajaminen

```sh
# Backend-testit (Jest)
cd server
npm run test

# Frontend-testit (Cypress)
cd client
npx cypress open # -> E2E testing -> Start E2E testing in Chrome -> hedgehog-form
```
