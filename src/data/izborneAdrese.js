/**
 * I-mejl adrese na koje ambasade i konzulati primaju zahteve za glasanje u
 * inostranstvu na izborima 25. oktobra 2026.
 *
 * Svaka adresa je prepisana iz obaveštenja o izborima 2026 objavljenog na
 * sajtu samog predstavništva, a ne sa spiska Ministarstva spoljnih poslova:
 * većina predstavništava je za ove izbore objavila posebnu izbornu adresu
 * (izbori.bec@mfa.rs, sarajevo2026@mfa.rs…) koje na tom spisku nema. `izvor`
 * je direktan link na to obaveštenje, da korisnik može da proveri adresu
 * tamo gde je objavljena.
 *
 * Kada dva mejla stoje u `mejlovi`, obaveštenje navodi oba. `ili` je adresa
 * koju obaveštenje navodi kao zamenu („ili …“), ne kao drugu na koju se šalje.
 * Tamo gde obaveštenje ne navodi i-mejl, adresa je sa kontakt stranice
 * predstavništva i nosi `samoKontakt: true`; tamo gde obaveštenje o izborima
 * nije pronađeno uopšte, nosi `bezObavestenja: true`. Ekran označava oba.
 *
 * Dva obaveštenja (Banja Luka/Trebinje i Trst) stoje na stranicama čiji je
 * URL ostao od starijeg teksta (konkurs, razgovor konzula); sadržaj stranice
 * je obaveštenje o izborima, pa link nije greška.
 *
 * Redovi su poređani po zemlji, abecedno po srpskoj latinici (Č posle C,
 * Š posle S), a unutar zemlje ambasada pre konzulata. Komponenta grupiše
 * uzastopne redove iste zemlje, pa novi red ide na svoje mesto, ne na kraj.
 *
 * Provereno 1. 10. 2026. Podaci su statični i deo su bundle-a: nema mrežnog
 * poziva, pa politika iz README-a („No data leaves the browser tab“) ostaje
 * netaknuta. Posle izbora ovaj fajl treba obrisati ili zameniti.
 */
export const IZBORNE_ADRESE_DATUM = "1. 10. 2026.";

export const IZBORNE_ADRESE = [
    {
        zemlja: "Australija",
        mesto: "Kanbera",
        mejlovi: ["consular.canberra@mfa.rs"],
        izvor: "https://canberra.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Australija",
        mesto: "Sidnej",
        mejlovi: ["srb.cons.sydney@mfa.rs"],
        izvor: "https://sydney.mfa.gov.rs/lat/mediji/aktivnosti/obavestenje-o-prijavi-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Austrija",
        mesto: "Beč",
        mejlovi: ["izbori.bec@mfa.rs"],
        izvor: "https://vienna.mfa.gov.rs/lat/gradjani/najcesca-pitanja",
    },
    {
        zemlja: "Austrija",
        mesto: "Salcburg",
        mejlovi: ["izbori.salzburg2026@mfa.rs"],
        izvor: "https://salzburg.mfa.gov.rs/lat/gradjani/najcesca-pitanja",
    },
    {
        zemlja: "Belgija (i Luksemburg)",
        mesto: "Brisel",
        mejlovi: ["izbori.brisel@mfa.rs"],
        izvor: "https://brussels.mfa.gov.rs/lat/mediji/najave-i-obavestenja/raspisivanje-izbora-za-narodne-poslanike",
    },
    {
        zemlja: "BiH",
        mesto: "Sarajevo",
        mejlovi: ["sarajevo2026@mfa.rs"],
        izvor: "https://sarajevo.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-2026-prijem-zahteva-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "BiH",
        mesto: "Banja Luka",
        mejlovi: ["banjaluka2026@mfa.rs"],
        izvor: "https://banjaluka.mfa.gov.rs/lat/mediji/aktivnosti/konkurs-za-sufinansiranje-projekata-za-oblasti-skole-manifestacije-i-status",
    },
    {
        zemlja: "BiH",
        mesto: "Trebinje (KK pri GK Banja Luka)",
        mejlovi: ["kktrebinje2026@mfa.rs"],
        izvor: "https://banjaluka.mfa.gov.rs/lat/mediji/aktivnosti/konkurs-za-sufinansiranje-projekata-za-oblasti-skole-manifestacije-i-status",
    },
    {
        zemlja: "BiH",
        mesto: "Mostar",
        mejlovi: ["gk.mostar@mfa.rs"],
        izvor: "https://mostar.mfa.gov.rs/lat/mediji/najave-i-obavestenja/odluka-o-raspisivanju-izbora-za-narodne-poslanike",
    },
    {
        zemlja: "Crna Gora",
        mesto: "Podgorica",
        mejlovi: ["podgorica.konzularno@mfa.rs", "embassy.podgorica@mfa.rs"],
        izvor: "https://podgorica.mfa.gov.rs/lat/mediji/aktivnosti/saopstenje-za-javnost-izbori-u-republici-srbiji",
    },
    {
        zemlja: "Crna Gora",
        mesto: "Herceg Novi",
        mejlovi: ["gkh.novi@mfa.rs"],
        izvor: "https://hercegnovi.mfa.gov.rs/lat/konzulat/kontakt",
        samoKontakt: true,
    },
    {
        zemlja: "Češka",
        mesto: "Prag",
        mejlovi: ["konzularno.prag@mfa.rs"],
        izvor: "https://prague.mfa.gov.rs/lat/mediji/najave-i-obavestenja/prijava-za-glasanje-na-parlamentarnim-izborima-koji-ce-biti-odrzani-25-oktobra-2026-godine",
    },
    {
        zemlja: "Danska",
        mesto: "Kopenhagen",
        mejlovi: ["srb.emb.denmark@mfa.rs"],
        izvor: "https://copenhagen.mfa.gov.rs/lat/mediji/aktivnosti/raspisivanje-izbora-za-narodne-poslanike-republike-srbije",
    },
    {
        zemlja: "Finska",
        mesto: "Helsinki",
        mejlovi: ["info@serbianembassy.fi"],
        izvor: "https://helsinki.mfa.gov.rs/lat/mediji/najave-i-obavestenja/vazno-obavestenje-izbori-2026",
    },
    {
        zemlja: "Francuska",
        mesto: "Pariz",
        mejlovi: ["izbori.pariz@mfa.rs"],
        izvor: "https://paris.mfa.gov.rs/mediji/aktivnosti/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Francuska",
        mesto: "Strazbur",
        mejlovi: ["consulate.strasbourg@mfa.rs"],
        izvor: "https://strasbourg.mfa.gov.rs/mediji/najave-i-obavestenja/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Grčka",
        mesto: "Atina",
        mejlovi: ["embassy.athens.consular@mfa.rs"],
        izvor: "https://athens.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-prijava-za-glasanje-na-parlamentarnim-izborima-nedelja-25-10-2026-godine",
    },
    {
        zemlja: "Grčka",
        mesto: "Solun",
        mejlovi: ["srbcons@otenet.gr"],
        izvor: "https://thessaloniki.mfa.gov.rs/lat/mediji/aktivnosti/zbori-prijava-za-glasanje-na-parlamentarnim-izborima-nedelja-25-10-2026-godine",
    },
    {
        zemlja: "Holandija",
        mesto: "Hag",
        mejlovi: ["konzularno.hag@mfa.rs", "srb.emb.netherlands@mfa.rs"],
        izvor: "https://thehague.mfa.gov.rs/lat/mediji/aktivnosti/parlamentarni-izbori-25-10-2026",
    },
    {
        zemlja: "Hrvatska",
        mesto: "Zagreb",
        mejlovi: ["konzularno.zagreb@mfa.rs"],
        izvor: "https://zagreb.mfa.gov.rs/lat/mediji/aktivnosti/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Hrvatska",
        mesto: "Rijeka",
        mejlovi: ["izboririjeka2026@gmail.com"],
        izvor: "https://rijeka.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Hrvatska",
        mesto: "Vukovar",
        mejlovi: ["generalni.konzulat@gk-srbije-vukovar.hr"],
        izvor: "https://vukovar.mfa.gov.rs/lat/konzulat/kontakt",
        samoKontakt: true,
    },
    {
        zemlja: "Italija",
        mesto: "Rim",
        mejlovi: ["izbori.rim@mfa.rs"],
        izvor: "https://roma.mfa.gov.rs/lat/mediji/najave-i-obavestenja/prijavljivanje-za-glasanje-na-izborima-25-oktobra-2026-godine-10-septembar-2026-godine",
    },
    {
        zemlja: "Italija",
        mesto: "Milano",
        mejlovi: ["pi@gkrsmi.it"],
        izvor: "https://milano.mfa.gov.rs/lat/mediji/aktivnosti/prijavljivanje-za-glasanje-na-parlamentarnim-izborima-25-oktobra-2026-godine",
    },
    {
        zemlja: "Italija",
        mesto: "Trst",
        mejlovi: ["izboritrst@gmail.com"],
        izvor: "https://trieste.mfa.gov.rs/lat/mediji/aktivnosti/razgovor-konzula-zerana-paunovica-sa-prefektom-i-kvestorom-udina",
    },
    {
        zemlja: "Kanada",
        mesto: "Otava (i Vankuver/Kalgari)",
        mejlovi: ["consular.ottawa@mfa.rs"],
        izvor: "https://ottawa.mfa.gov.rs/lat/ambasada/kontakt",
        bezObavestenja: true,
    },
    {
        zemlja: "Kanada",
        mesto: "Toronto",
        mejlovi: ["izbori@rogers.com"],
        izvor: "https://toronto.mfa.gov.rs/lat/mediji/aktivnosti/parlamentarni-izbori-25-10-2026",
    },
    {
        zemlja: "Katar",
        mesto: "Doha",
        mejlovi: ["izbori.ambrs.doha@gmail.com"],
        izvor: "https://doha.mfa.gov.rs/lat/mediji/aktivnosti/prijava-za-glasanje-na-parlamentarnim-izborima-koji-ce-biti-odrzani-25-oktobra-2026-godine",
    },
    {
        zemlja: "Kina",
        mesto: "Peking",
        mejlovi: ["srb.emb.china@mfa.rs"],
        izvor: "https://beijing.mfa.gov.rs/lat/mediji/aktivnosti/obavestenje-za-upis-u-biracki-spisak-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Kina",
        mesto: "Šangaj",
        mejlovi: ["srb.cons.shanghai@mfa.rs"],
        izvor: "https://shanghai.mfa.gov.rs/lat/mediji/najave-i-obavestenja/parlamentarni-izbori-2026",
    },
    {
        zemlja: "Kipar",
        mesto: "Nikozija",
        mejlovi: ["izbori.nikozija@mfa.rs"],
        izvor: "https://nicosia.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Mađarska",
        mesto: "Budimpešta",
        mejlovi: ["budapest-consulat@serbiaemb.t-online.hu"],
        izvor: "https://budapest.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-za-narodne-poslanike-2026",
    },
    {
        zemlja: "Malta",
        mesto: "Valeta (kancelarija pri ambasadi u Rimu)",
        mejlovi: ["srb.office.valletta@mfa.rs"],
        izvor: "https://roma.mfa.gov.rs/lat/mediji/najave-i-obavestenja/prijavljivanje-za-glasanje-na-izborima-25-oktobra-2026-godine-10-septembar-2026-godine",
    },
    {
        zemlja: "Nemačka",
        mesto: "Berlin",
        mejlovi: ["izbori@botschaft-serbien.de"],
        izvor: "https://berlin.mfa.gov.rs/lat/mediji/aktivnosti/prijava-za-glasanje-na-parlamentarnim-izborima-nedelja-25-10-2026-godine",
    },
    {
        zemlja: "Nemačka",
        mesto: "Frankfurt",
        mejlovi: ["izbori@gksrbfra.de"],
        izvor: "https://frankfurt.mfa.gov.rs/lat/mediji/najave-i-obavestenja/obavestavaju-se-biraci-koji-imaju-boraviste-u-inostranstvu-o-ostvarivanju-birackog-prava-na-izborima-koji-ce-biti-odrzani-25-oktobra-2026-godine",
    },
    {
        zemlja: "Nemačka",
        mesto: "Minhen",
        mejlovi: ["gk.muenchen@mfa.rs"],
        ili: "info.muenchen@mfa.rs",
        izvor: "https://munich.mfa.gov.rs/lat/mediji/aktivnosti/prijava-za-izbore-25-10-2026",
    },
    {
        zemlja: "Nemačka",
        mesto: "Diseldorf",
        mejlovi: ["izbori.diseldorf@mfa.rs"],
        izvor: "https://duesseldorf.mfa.gov.rs/lat/mediji/aktivnosti/izbori-za-narodne-poslanike-prijem-zahteva-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Nemačka",
        mesto: "Hamburg",
        mejlovi: ["izbori@gkrshamburg.de"],
        izvor: "https://hamburg.mfa.gov.rs/lat/mediji/aktivnosti/prijava-za-glasanje-na-parlamentarnim-izborima-nedelja-25-10-2026-godine",
    },
    {
        zemlja: "Nemačka",
        mesto: "Štutgart",
        mejlovi: ["izbori.stuttgart@mfa.rs"],
        izvor: "https://stuttgart.mfa.gov.rs/lat/mediji/aktivnosti/raspisivanje-izbora-za-narodne-poslanike",
    },
    {
        zemlja: "Norveška",
        mesto: "Oslo",
        mejlovi: ["izbori.oslo2026@mfa.rs"],
        izvor: "https://oslo.mfa.gov.rs/lat/mediji/aktivnosti/izbori-za-narodne-poslanike-narodne-skupstine-republike-srbije-2026-prijem-zahteva-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Novi Zeland",
        mesto: "Kanbera (u formularu navesti da želite glasati u Oklandu)",
        mejlovi: ["consular.canberra@mfa.rs"],
        izvor: "https://canberra.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Poljska",
        mesto: "Varšava",
        mejlovi: ["consular.warsaw@mfa.rs"],
        izvor: "https://warsaw.mfa.gov.rs/lat/mediji/aktivnosti/prijava-za-glasanje-na-parlamentarnim-izborima-koji-ce-biti-odrzani-25-oktobra-2026-godine",
    },
    {
        zemlja: "Portugal",
        mesto: "Lisabon",
        mejlovi: ["srb.emb.portugal@mfa.rs"],
        izvor: "https://lisbon.mfa.gov.rs/lat/mediji/aktivnosti/obavestenje-o-prijavi-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Rusija",
        mesto: "Moskva",
        mejlovi: ["konzularno.moskva@mfa.rs"],
        izvor: "https://moskva.mfa.gov.rs/mediji/aktivnosti/parlamentarni-izbori-u-republici-srbiji-25-oktobar-2026-godine",
    },
    {
        zemlja: "SAD",
        mesto: "Vašington (i Majami)",
        mejlovi: ["izbori@serbiaembusa.org"],
        izvor: "https://washington.mfa.gov.rs/lat/mediji/najave-i-obavestenja/obavestenje-o-prijavi-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "SAD",
        mesto: "Njujork",
        mejlovi: ["izbori.njujork@mfa.rs"],
        izvor: "https://newyork.mfa.gov.rs/lat/mediji/najave-i-obavestenja/obavestenje-o-prijavi-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "SAD",
        mesto: "Čikago (i Hjuston/LA/SF/San Dijego)",
        mejlovi: ["izbori.cikago2026@mfa.rs"],
        izvor: "https://chicago.mfa.gov.rs/lat/mediji/aktivnosti/obavestenje-o-prijavi-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Severna Makedonija",
        mesto: "Skoplje",
        mejlovi: ["consulate.skopje@mfa.rs"],
        izvor: "https://skopje.mfa.gov.rs/lat/mediji/aktivnosti/parlamentarni-izbori-2026",
    },
    {
        zemlja: "Slovačka",
        mesto: "Bratislava",
        mejlovi: ["consular.bratislava@mfa.rs"],
        izvor: "https://bratislava.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Slovenija",
        mesto: "Ljubljana",
        mejlovi: ["konzularno.ljubljana@mfa.rs", "embassy.ljubljana@mfa.rs"],
        izvor: "https://ljubljana.mfa.gov.rs/lat/mediji/najave-i-obavestenja/izbori-za-narodne-poslanike-25-10-2026-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Španija",
        mesto: "Madrid",
        mejlovi: ["konz.madrid@mfa.rs"],
        izvor: "https://madrid.mfa.gov.rs/lat/mediji/aktivnosti/parlamentarni-izbori-2026-obavestenje-za-birace-koji-imaju-boraviste-u-k-spaniji-o-ostvarivanju-birackog-prava-na-izborima-za-narodne-poslanike",
    },
    {
        zemlja: "Švajcarska",
        mesto: "Bern",
        mejlovi: ["konzul@ambasadasrbije.ch"],
        izvor: "https://berne.mfa.gov.rs/lat/mediji/aktivnosti/obavestenje-o-prijavi-za-glasanje-u-inostranstvu-0",
    },
    {
        zemlja: "Švajcarska",
        mesto: "Cirih",
        mejlovi: ["srb.cons.zurich@mfa.rs"],
        izvor: "https://zurich.mfa.gov.rs/lat/mediji/aktivnosti/izbori-prijavljivanje-za-glasanje-u-inostranstvu",
    },
    {
        zemlja: "Švedska",
        mesto: "Stokholm",
        mejlovi: ["izbori.se@mfa.rs"],
        izvor: "https://stockholm.mfa.gov.rs/lat/mediji/najave-i-obavestenja/raspisivanje-izbora-za-narodne-poslanike-republike-srbije",
    },
    {
        zemlja: "Turska",
        mesto: "Ankara",
        mejlovi: ["consular.srb.ankara@gmail.com"],
        izvor: "https://ankara.mfa.gov.rs/lat/ambasada/kontakt",
        samoKontakt: true,
    },
    {
        zemlja: "Turska",
        mesto: "Istanbul",
        mejlovi: ["konzulat.istanbul@mfa.rs"],
        izvor: "https://istanbul.mfa.gov.rs/lat/konzulat/kontakt",
        samoKontakt: true,
    },
    {
        zemlja: "UAE",
        mesto: "Abu Dabi",
        mejlovi: ["izbori.abudhabi@mfa.rs"],
        izvor: "https://abudhabi.mfa.gov.rs/lat/mediji/aktivnosti/izbori-2026-obavestenje-za-birace",
    },
    {
        zemlja: "Velika Britanija i Irska",
        mesto: "London",
        mejlovi: ["izbori.london@mfa.rs"],
        izvor: "https://london.mfa.gov.rs/lat/mediji/najave-i-obavestenja/prijavljivanje-za-glasanje-na-izborima-25-oktobra-2026-godine",
    },
];
