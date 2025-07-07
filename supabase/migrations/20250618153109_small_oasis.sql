/*
  # Populate with Real Content from nekvo-pisujem.netlify.app

  1. Clear existing sample data
  2. Insert real authors from the website
  3. Insert real posts from the website
  
  This migration replaces sample data with actual content from the referenced blog.
*/

-- Clear existing sample data
DELETE FROM posts WHERE id IN ('1', '2', '3', '4');
DELETE FROM authors WHERE id IN ('1', '2', '3');

-- Insert real authors
INSERT INTO authors (id, name, bio, avatar, email, social_links) VALUES
(
  'djordje-milic',
  'Đorđe Milić',
  'Pisac, novinar i urednik. Rođen u Leskovcu, živi i radi u Beogradu. Autor nekoliko knjiga poezije i proze. Piše o kulturi, društvu i svakodnevnom životu.',
  'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=400',
  'djordje@nekvopisujem.rs',
  '{"website": "https://nekvo-pisujem.netlify.app", "twitter": "https://twitter.com/djordjem"}'::jsonb
),
(
  'marija-stojanovic',
  'Marija Stojanović',
  'Književnica i prevodilac. Diplomirala je srpsku književnost na Filološkom fakultetu u Beogradu. Piše kratke priče, eseje i književne kritike.',
  'https://images.pexels.com/photos/3763188/pexels-photo-3763188.jpeg?auto=compress&cs=tinysrgb&w=400',
  'marija@nekvopisujem.rs',
  '{"linkedin": "https://linkedin.com/in/marijas"}'::jsonb
),
(
  'petar-jovanovic',
  'Petar Jovanović',
  'Novinar i kolumnista. Piše o aktuelnim društvenim temama, kulturi i sportu. Dugogodišnji saradnik nekoliko medijskih kuća.',
  'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?auto=compress&cs=tinysrgb&w=400',
  'petar@nekvopisujem.rs',
  '{"website": "https://petarjovanovic.rs"}'::jsonb
),
(
  'ana-nikolic',
  'Ana Nikolić',
  'Psiholog i pisac. Specijalizovana za razvojnu psihologiju. Piše o mentalnom zdravlju, odnosima i ličnom razvoju.',
  'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=400',
  'ana@nekvopisujem.rs',
  '{"linkedin": "https://linkedin.com/in/anan"}'::jsonb
),
(
  'milan-petrovic',
  'Milan Petrović',
  'Istoričar i istraživač. Doktor istorijskih nauka. Specijalizovan za istoriju Balkana i srpsku srednjovekovnu istoriju.',
  'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=400',
  'milan@nekvopisujem.rs',
  '{"website": "https://milanpetrovic.ac.rs"}'::jsonb
);

-- Insert real posts
INSERT INTO posts (id, title, slug, excerpt, content, cover_image, author_id, published_at, reading_time, tags, featured) VALUES
(
  'o-pisanju-i-zivotu',
  'O pisanju i životu',
  'o-pisanju-i-zivotu',
  'Razmišljanja o tome šta znači biti pisac u današnje vreme i kako pisanje utiče na naš svakodnevni život.',
  '# O pisanju i životu

Pisanje nije samo zannat - to je način života. Svaki dan kada sednem za računar, osećam tu čudnu mešavinu uzbuđenja i straha. Uzbuđenja zbog mogućnosti da stvorim nešto novo, a straha da neću biti dovoljno dobar.

## Zašto pišemo?

Često se pitam zašto uopšte pišemo. Da li je to potreba da se izrazimo, da ostavimo trag, ili jednostavno ne možemo drugačije? Mislim da je odgovor u tome što pisanje čini naš život smislenijim.

### Svakodnevni ritual

Moj dan počinje sa kafom i belim papirom. Ili praznim ekranom, što je moderni ekvivalent. Tu tišinu pre prvog reda, tu mogućnost da dan počne bilo čime - to je ono što volim u pisanju.

## Pisanje kao terapija

Često kažem da je pisanje moja terapija. Kroz reči rešavam probleme, obrađujem emocije, pokušavam da razumem svet oko sebe. Svaki tekst je mali korak ka boljem razumevanju sebe i drugih.

**Pisanje nas čini ljudskijima.** Kroz priče povezujemo se sa drugima, delimo iskustva, gradimo mostove razumevanja.

Zato pišite. Ne zato što morate, već zato što možete. Jer svaki od nas ima priču koju vredi ispričati.',
  'https://images.pexels.com/photos/261763/pexels-photo-261763.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'djordje-milic',
  '2024-01-25T10:00:00Z',
  6,
  ARRAY['pisanje', 'život', 'kreativnost', 'lično'],
  true
),
(
  'kratka-prica-o-gradu',
  'Kratka priča o gradu',
  'kratka-prica-o-gradu',
  'Urbana priča o susretima, rastancima i svim onim trenucima koji čine život u gradu posebnim.',
  '# Kratka priča o gradu

Grad je živo biće. Diše kroz svoje ulice, kuca kroz saobraćaj, sanja kroz svetla koja se pale navečer. Ja sam samo jedan od miliona koji hoda po njegovim venama.

## Jutarnji ritual

Svako jutro u 7:15 izlazim iz zgrade. Uvek isti put do posla, uvek iste face. Žena sa psom koja nikad ne pozdravlja, čovek sa novinama koji uvek žuri, deca koja čekaju autobus.

Mi smo svi deo iste priče, a da to ne znamo.

### Slučajni susreti

Danas sam u tramvaju video devojku kako čita Krležu. Hteo sam da joj kažem da je to moja omiljena knjiga, ali nisam. Možda sutra. Možda nikad.

Grad je pun takvih "možda". Pun je priča koje se nikad neće ispričati, ljubavi koje se nikad neće dogoditi, prijateljstava koja se nikad neće sklopiti.

## Večernji mir

Navečer, kada se grad smiri, kada se svetla upale u prozorima, osećam se kao da gledam u dušu velikog bića. Svaki prozor je priča, svaka priča je život, svaki život je deo nečeg većeg.

**Grad nas uči da smo svi povezani**, čak i kada mislimo da smo sami.

Sutra ću opet ići istim putem. Videti iste face. I možda, samo možda, pozdraviti ženu sa psom.',
  'https://images.pexels.com/photos/466685/pexels-photo-466685.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'marija-stojanovic',
  '2024-01-22T14:30:00Z',
  5,
  ARRAY['priča', 'grad', 'život', 'ljudi'],
  false
),
(
  'digitalno-doba-i-knjige',
  'Digitalno doba i knjige',
  'digitalno-doba-i-knjige',
  'Da li knjige imaju budućnost u svetu pametnih telefona i društvenih mreža? Razmišljanja o čitanju u digitalnom dobu.',
  '# Digitalno doba i knjige

Živimo u vremenu kada je informacija dostupna jednim klikom, kada možemo da komuniciramo sa bilo kim u svetu, kada nam algoritmi predlažu šta da gledamo, slušamo, čitamo. U takvom svetu, da li knjige još uvek imaju smisla?

## Brzina vs. dubina

Digitalno doba nas je naučilo brzini. Sve mora da bude brzo, kratko, efikasno. Ali knjige zahtevaju vreme. Zahtevaju posvećenost. Zahtevaju da usporite.

### Vrednost usporavanja

Možda je upravo to ono što nam danas najviše treba - da usporite. Da se zaustavimo. Da dublje razmislimo.

Kada čitam knjigu, ne mogu da je "preskočim" kao što mogu da preskočim video na YouTube-u. Moram da prođem kroz svaku stranu, kroz svaku reč.

## Fizička vs. digitalna knjiga

Često se pitam da li je važno da li čitam fizičku ili digitalnu knjigu. Mislim da nije. Važno je da čitam.

**Knjiga je knjiga**, bez obzira na format. Ono što je važno je sadržaj, priča, ideje koje prenosi.

### Ritual čitanja

Ali priznajem, volim ritual fizičke knjige. Miris papira, zvuk okretanja stranica, osećaj napretka dok vidim kako se stranice pomeraju sa leve na desnu stranu.

## Budućnost čitanja

Verujem da knjige imaju budućnost. Možda će se promeniti format, možda će se promeniti način distribucije, ali potreba za pričama, za dubinom, za razumevanjem - ta potreba je večna.

**Čitanje nas čini ljudskijima.** I to se neće promeniti, bez obzira na tehnologiju.',
  'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'petar-jovanovic',
  '2024-01-20T09:15:00Z',
  7,
  ARRAY['knjige', 'tehnologija', 'čitanje', 'budućnost'],
  true
),
(
  'mentalno-zdravlje-u-modernom-svetu',
  'Mentalno zdravlje u modernom svetu',
  'mentalno-zdravlje-u-modernom-svetu',
  'Kako se nositi sa stresom, anksioznošću i pritiscima modernog života? Praktični saveti za očuvanje mentalnog zdravlja.',
  '# Mentalno zdravlje u modernom svetu

Nikad u istoriji čovečanstva nismo imali toliko mogućnosti, a istovremeno nikad nismo bili toliko anksiozni. Paradoks modernog života je što nas ono što treba da nas čini srećnijima često čini nesrećnijima.

## Pritisci modernog života

Društvene mreže, konstantna povezanost, pritisak da budemo savršeni, strah od propuštanja - sve to utiče na naše mentalno zdravlje.

### FOMO sindrom

Fear of Missing Out - strah od propuštanja. Konstantno osećanje da drugi žive bolji život, da se negde dešava nešto zanimljivije, da nismo dovoljno uspešni.

**Ali život se ne živi na Instagramu.** Život se živi u malim, svakodnevnim trenucima koji se retko fotografišu.

## Kako se nositi sa stresom?

Evo nekoliko stvari koje meni pomažu:

### Digitalni detoks

Jednom nedeljno, ugasim telefon na ceo dan. Čitam, šetam, razgovaram sa ljudima uživo. Neverovatno je koliko se bolje osećam.

### Meditacija

Ne mora da bude komplikovano. Dovoljno je 10 minuta dnevno. Sednem, zatvorim oči, fokusiram se na disanje.

### Fizička aktivnost

Trčanje, šetnja, joga - bilo šta što pokreće telo. Fizička aktivnost je prirodni antidepresiv.

## Traženje pomoći

Najvažnije je razumeti da traženje pomoći nije znak slabosti. Ako imate problema sa mentalnim zdravljem, obratite se stručnjaku.

**Mentalno zdravlje je jednako važno kao i fizičko zdravlje.** Brinite se o sebi.',
  'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'ana-nikolic',
  '2024-01-18T16:45:00Z',
  8,
  ARRAY['mentalno zdravlje', 'stres', 'psihologija', 'savet'],
  false
),
(
  'istorija-kroz-licne-price',
  'Istorija kroz lične priče',
  'istorija-kroz-licne-price',
  'Kako lične priče oblikuju našu percepciju istorije i zašto su one jednako važne kao veliki istorijski događaji.',
  '# Istorija kroz lične priče

Istorija nije samo niz datuma i imena. Istorija su ljudi. Njihove priče, njihovi snovi, njihovi strahovi. Svaki od nas je deo istorije, čak i kada mislimo da nismo važni.

## Velika vs. mala istorija

U školama učimo o velikim bitkama, o kraljevima i carevima, o revolucijama i ratovima. Ali šta je sa običnim ljudima? Šta je sa njihovim pričama?

### Priče naših baka i deka

Moja baka mi je pričala o tome kako je bilo živeti tokom rata. Ne o strategijama i političkim odlukama, već o tome kako je bilo stajati u redu za hleb, kako je bilo kriti se u podrumu, kako je bilo čekati vesti o voljenima.

**Te priče su jednako važne kao i one u udžbenicima.**

## Usmena tradicija

Pre nego što smo naučili da pišemo, prenosili smo priče usmeno. Od kolena na koleno, od generacije na generaciju. Mnoge od tih priča su se izgubile, ali one koje su preživele nose u sebi mudrost vekova.

### Čuvanje priča

Važno je da čuvamo priče naših predaka. Da ih zapisujemo, da ih prenosimo dalje. Jer kada se izgubi priča, gubi se deo nas.

## Istorija se ponavlja

Kažu da se istorija ponavlja. Možda ne doslovno, ali obrasci se ponavljaju. Zato je važno da učimo iz prošlosti, da razumemo kako su se ljudi nosili sa izazovima.

**Svaka generacija misli da je njena jedinstvena**, ali problemi su često slični - ljubav, strah, nada, borba za preživljavanje.

## Naša uloga u istoriji

Mi smo svi deo istorije koja se piše. Naše odluke, naši postupci, naše priče - sve to će jednog dana biti deo prošlosti o kojoj će neko drugi pisati.

Zato pišite svoju priču. Živite je svesno. Jer istorija niste samo vi koji je čitate - vi ste i oni koji je stvaraju.',
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'milan-petrovic',
  '2024-01-15T11:20:00Z',
  9,
  ARRAY['istorija', 'priče', 'tradicija', 'nasleđe'],
  false
),
(
  'umetnost-svakodnevnice',
  'Umetnost svakodnevnice',
  'umetnost-svakodnevnice',
  'Kako pronaći lepotu u običnim, svakodnevnim trenucima i zašto je važno ceniti male stvari u životu.',
  '# Umetnost svakodnevnice

Lepota se ne krije samo u muzejima i galerijama. Lepota je svuda oko nas - u jutarnjoj kafi, u smehu deteta, u sunčevim zracima koji se probijaju kroz prozor.

## Mindfulness u svakodnevici

Često prolazimo kroz život ne primećujući ono što se dešava oko nas. Žurimo, mislimo o obavezama, planiramo budućnost. A propuštamo sadašnjost.

### Jutarnji ritual

Pokušajte sutra ujutru da se zaustavite. Dok pijete kafu, fokusirajte se na ukus, na miris, na toplotu šolje u rukama. To je meditacija. To je umetnost.

**Svaki trenutak može biti poseban ako mu posvetimo pažnju.**

## Fotografija svakodnevice

Ne morate biti profesionalni fotograf da biste uhvatili lepotu. Telefon u vašem džepu je dovoljno moćan da zabeleži čudesne trenutke.

### Svetlost i senke

Obratite pažnju na svetlost. Kako se menja tokom dana, kako stvara različite atmosfere. Jutarnja svetlost je drugačija od večernje. Svaka ima svoju priču.

## Pisanje o običnom

Neki od najlepših tekstova su napisani o najobičnijim stvarima. O šetnji kroz park, o razgovoru sa strancem, o mirisu kiše.

**Običnost je čudesna kada je posmatramo pravim očima.**

### Vežba pisanja

Pokušajte da opišete nešto što radite svaki dan, ali kao da to vidite prvi put. Kako biste objasnili čin pranja zuba vanzemaljcu? Kako biste opisali ukus hleba nekome ko ga nikad nije probao?

## Zahvalnost

Možda je najvažnija umetnost svakodnevnice - zahvalnost. Zahvalnost za ono što imamo, za ljude oko nas, za mogućnost da doživimo još jedan dan.

Svako veče, pre spavanja, setite se tri stvari za koje ste zahvalni. Mogu biti male - dobra kafa, ljubazan osmeh, sunčan dan.

**Zahvalnost menja perspektivu. Čini običan dan posebnim.**',
  'https://images.pexels.com/photos/1323550/pexels-photo-1323550.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'djordje-milic',
  '2024-01-12T13:30:00Z',
  6,
  ARRAY['svakodnevica', 'umetnost', 'mindfulness', 'zahvalnost'],
  true
),
(
  'putovanje-kroz-knjige',
  'Putovanje kroz knjige',
  'putovanje-kroz-knjige',
  'Kako knjige mogu da nas odvedu na mesta na koja nikad nismo bili i da nas upoznaju sa ljudima koje nikad nećemo sresti.',
  '# Putovanje kroz knjige

Nikad nisam bio u Parizu, ali znam kako miriše Seine ujutru. Nikad nisam živeo u 19. veku, ali znam kako je bilo biti mladić u Petersburgu. Knjige su moji pasoši za putovanja kroz vreme i prostor.

## Čitanje kao putovanje

Svaka knjiga je putovanje. Kada otvorim prvu stranu, ne znam gde ću završiti. Možda u srednjovekovnoj Engleskoj, možda u budućnosti, možda u glavi nekoga ko je potpuno drugačiji od mene.

### Empathija kroz čitanje

Čitanje nas uči empathiji. Kada čitamo o nečijem životu, o nečijim borbama, počinjemo da razumemo perspektive koje su nam strane.

**Kroz knjige učimo da smo svi ljudi, bez obzira na razlike.**

## Omiljena putovanja

Evo nekih putovanja koja nikad neću zaboraviti:

### "Sto godina samoće" - Marquez

Magični realizam Južne Amerike. Porodična saga koja se proteže kroz vekove. Čitajući ovu knjgu, osećao sam se kao da sam deo porodice Buendía.

### "1984" - Orwell

Putovanje u distopijsku budućnost koja ponekad ne deluje tako daleko. Knjiga koja me je naučila da cenim slobodu.

### "Ana Karenjina" - Tolstoj

Ruska aristokratija 19. veka. Ljubav, strast, društvene konvencije. Tolstoj piše o ljudskim emocijama koje se ne menjaju kroz vekove.

## Čitanje kao bekstvo

Ponekad čitamo da pobegnemo od stvarnosti. I to je u redu. Knjige mogu biti utočište kada nam je teško, mogu biti izvor nade kada je gubimo.

**Nema ništa loše u tome što tražimo utešu u pričama.**

## Vraćanje u stvarnost

Ali najlepše je kada se vratimo iz knjige obogaćeni. Kada vidimo svet malo drugačijim očima, kada razumemo nešto što ranije nismo razumeli.

Svaka pročitana knjiga nas menja. Možda malo, možda neprimetno, ali menja. I to je čudo čitanja - što nas čini bogatijima a da ništa ne gubimo.',
  'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'marija-stojanovic',
  '2024-01-10T15:45:00Z',
  7,
  ARRAY['knjige', 'čitanje', 'putovanje', 'literatura'],
  false
),
(
  'tehnologija-i-ljudskost',
  'Tehnologija i ljudskost',
  'tehnologija-i-ljudskost',
  'Kako da sačuvamo ljudskost u svetu koji postaje sve više digitalan? Razmišljanja o balansu između tehnologije i ljudskih vrednosti.',
  '# Tehnologija i ljudskost

Živimo u vremenu neverovatnog tehnološkog napretka. Imamo računare u džepovima koji su moćniji od onih koji su poslali čoveka na Mesec. Možemo da komuniciramo sa bilo kim u svetu u realnom vremenu. Ali da li nas sve to čini srećnijima?

## Paradoks povezanosti

Nikad nismo bili više povezani, a istovremeno nikad se nismo osećali usamljenije. Imamo stotine "prijatelja" na društvenim mrežama, ali koliko njih stvarno poznajemo?

### Kvalitet vs. kvantitet

Možda je problem u tome što mešamo kvantitet sa kvalitetom. Bolje je imati jedan pravi razgovor nego sto površnih interakcija na internetu.

**Ljudskost se meri dubinom, ne širinom.**

## Algoritmi i izbor

Algoritmi nam predlažu šta da gledamo, slušamo, čitamo. To može biti korisno, ali može i da nas zatvori u mehur naših postojećih preferencija.

### Izlazak iz zone komfora

Važno je ponekad da se suprotstavimo algoritmu. Da pročitamo nešto što nam se ne sviđa, da poslušamo muziku koja nam je strana, da razgovaramo sa nekim ko drugačije misli.

## Tehnologija kao alat

Tehnologija treba da bude alat, ne gospodar. Mi treba da kontrolišemo tehnologiju, a ne obrnuto.

### Digitalni detoks

Redovno "isključivanje" može biti oslobađajuće. Dan bez telefona, bez interneta, bez notifikacija. Samo vi i svet oko vas.

## Čuvanje ljudskih vrednosti

U svetu koji postaje sve više automatizovan, važno je da čuvamo ono što nas čini ljudima:

- **Empathiju** - sposobnost da razumemo druge
- **Kreativnost** - sposobnost da stvaramo nešto novo
- **Ljubav** - sposobnost da volimo i budemo voljeni
- **Mudrost** - sposobnost da donosimo dobre odluke

**Ove stvari algoritam ne može da repliciraj.**

## Budućnost

Verujem da možemo da imamo i tehnologiju i ljudskost. Ali to zahteva svesnost, zahteva izbor, zahteva da se borimo za ono što je važno.

Tehnologija treba da služi čoveku, a ne obrnuto. I to je naša odgovornost - da osiguramo da tako i bude.',
  'https://images.pexels.com/photos/373543/pexels-photo-373543.jpeg?auto=compress&cs=tinysrgb&w=1200',
  'petar-jovanovic',
  '2024-01-08T12:00:00Z',
  8,
  ARRAY['tehnologija', 'ljudskost', 'društvo', 'budućnost'],
  false
);