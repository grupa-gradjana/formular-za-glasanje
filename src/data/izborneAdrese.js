/**
 * I-mejl adrese na koje ambasade i konzulati primaju zahteve za glasanje u
 * inostranstvu na izborima 25. oktobra 2026.
 *
 * Svaka adresa je prepisana iz obaveštenja o izborima 2026 objavljenog na
 * sajtu samog predstavništva (`sajt`), a ne sa spiska Ministarstva spoljnih
 * poslova: većina predstavništava je za ove izbore objavila posebnu izbornu
 * adresu (izbori.bec@mfa.rs, sarajevo2026@mfa.rs…) koje na tom spisku nema.
 * Tamo gde obaveštenje ne navodi i-mejl, adresa je sa kontakt stranice
 * predstavništva i nosi `samoKontakt: true`, pa je ekran tako i označava.
 * Kada dva mejla stoje zajedno, obaveštenje navodi oba.
 *
 * Provereno 30. 9. 2026. Podaci su statični i deo su bundle-a: nema mrežnog
 * poziva, pa politika iz README-a („No data leaves the browser tab“) ostaje
 * netaknuta. Posle izbora ovaj fajl treba obrisati ili zameniti.
 */
export const IZBORNE_ADRESE_DATUM = "30. 9. 2026.";

export const IZBORNE_ADRESE = [
    { zemlja: "BiH", mesto: "Sarajevo", mejlovi: ["sarajevo2026@mfa.rs"], sajt: "https://sarajevo.mfa.gov.rs" },
    { zemlja: "BiH", mesto: "Banja Luka", mejlovi: ["banjaluka2026@mfa.rs"], sajt: "https://banjaluka.mfa.gov.rs" },
    { zemlja: "BiH", mesto: "Trebinje (KK pri GK Banja Luka)", mejlovi: ["kktrebinje2026@mfa.rs"], sajt: "https://banjaluka.mfa.gov.rs" },
    { zemlja: "BiH", mesto: "Mostar", mejlovi: ["gk.mostar@mfa.rs"], sajt: "https://mostar.mfa.gov.rs" },
    { zemlja: "Nemačka", mesto: "Berlin", mejlovi: ["izbori@botschaft-serbien.de"], sajt: "https://berlin.mfa.gov.rs" },
    { zemlja: "Nemačka", mesto: "Frankfurt", mejlovi: ["izbori@gksrbfra.de"], sajt: "https://frankfurt.mfa.gov.rs" },
    { zemlja: "Nemačka", mesto: "Minhen", mejlovi: ["gk.muenchen@mfa.rs"], sajt: "https://munich.mfa.gov.rs" },
    { zemlja: "Nemačka", mesto: "Diseldorf", mejlovi: ["izbori.diseldorf@mfa.rs"], sajt: "https://duesseldorf.mfa.gov.rs" },
    { zemlja: "Nemačka", mesto: "Hamburg", mejlovi: ["izbori@gkrshamburg.de"], sajt: "https://hamburg.mfa.gov.rs" },
    { zemlja: "Nemačka", mesto: "Štutgart", mejlovi: ["izbori.stuttgart@mfa.rs"], sajt: "https://stuttgart.mfa.gov.rs" },
    { zemlja: "Austrija", mesto: "Beč", mejlovi: ["izbori.bec@mfa.rs"], sajt: "https://vienna.mfa.gov.rs" },
    { zemlja: "Austrija", mesto: "Salcburg", mejlovi: ["izbori.salzburg2026@mfa.rs"], sajt: "https://salzburg.mfa.gov.rs" },
    { zemlja: "SAD", mesto: "Vašington (i Majami)", mejlovi: ["izbori@serbiaembusa.org"], sajt: "https://washington.mfa.gov.rs" },
    { zemlja: "SAD", mesto: "Njujork", mejlovi: ["izbori.njujork@mfa.rs"], sajt: "https://newyork.mfa.gov.rs" },
    { zemlja: "SAD", mesto: "Čikago (i Hjuston/LA/SF/San Dijego)", mejlovi: ["izbori.cikago2026@mfa.rs"], sajt: "https://chicago.mfa.gov.rs" },
    { zemlja: "Italija", mesto: "Rim", mejlovi: ["izbori.rim@mfa.rs"], sajt: "https://roma.mfa.gov.rs" },
    { zemlja: "Italija", mesto: "Milano", mejlovi: ["pi@gkrsmi.it"], sajt: "https://milano.mfa.gov.rs" },
    { zemlja: "Italija", mesto: "Trst", mejlovi: ["izboritrst@gmail.com"], sajt: "https://trieste.mfa.gov.rs" },
    { zemlja: "Malta", mesto: "Valeta (kancelarija pri ambasadi u Rimu)", mejlovi: ["srb.office.valletta@mfa.rs"], sajt: "https://roma.mfa.gov.rs" },
    { zemlja: "Švajcarska", mesto: "Bern", mejlovi: ["konzul@ambasadasrbije.ch"], sajt: "https://berne.mfa.gov.rs" },
    { zemlja: "Švajcarska", mesto: "Cirih", mejlovi: ["srb.cons.zurich@mfa.rs"], sajt: "https://zurich.mfa.gov.rs" },
    { zemlja: "Kanada", mesto: "Otava (i Vankuver/Kalgari)", mejlovi: ["consular.ottawa@mfa.rs"], sajt: "https://ottawa.mfa.gov.rs" },
    { zemlja: "Kanada", mesto: "Toronto", mejlovi: ["izbori@rogers.com"], sajt: "https://toronto.mfa.gov.rs" },
    { zemlja: "Crna Gora", mesto: "Podgorica", mejlovi: ["podgorica.konzularno@mfa.rs", "embassy.podgorica@mfa.rs"], sajt: "https://podgorica.mfa.gov.rs" },
    { zemlja: "Crna Gora", mesto: "Herceg Novi", mejlovi: ["gkh.novi@mfa.rs"], sajt: "https://hercegnovi.mfa.gov.rs", samoKontakt: true },
    { zemlja: "Velika Britanija i Irska", mesto: "London", mejlovi: ["izbori.london@mfa.rs"], sajt: "https://london.mfa.gov.rs" },
    { zemlja: "Slovenija", mesto: "Ljubljana", mejlovi: ["konzularno.ljubljana@mfa.rs", "embassy.ljubljana@mfa.rs"], sajt: "https://ljubljana.mfa.gov.rs" },
    { zemlja: "Francuska", mesto: "Pariz", mejlovi: ["izbori.pariz@mfa.rs"], sajt: "https://paris.mfa.gov.rs" },
    { zemlja: "Francuska", mesto: "Strazbur", mejlovi: ["consulate.strasbourg@mfa.rs"], sajt: "https://strasbourg.mfa.gov.rs" },
    { zemlja: "Švedska", mesto: "Stokholm", mejlovi: ["izbori.se@mfa.rs"], sajt: "https://stockholm.mfa.gov.rs" },
    { zemlja: "Španija", mesto: "Madrid", mejlovi: ["konz.madrid@mfa.rs"], sajt: "https://madrid.mfa.gov.rs" },
    { zemlja: "Holandija", mesto: "Hag", mejlovi: ["konzularno.hag@mfa.rs", "srb.emb.netherlands@mfa.rs"], sajt: "https://thehague.mfa.gov.rs" },
    { zemlja: "Norveška", mesto: "Oslo", mejlovi: ["izbori.oslo2026@mfa.rs"], sajt: "https://oslo.mfa.gov.rs" },
    { zemlja: "Hrvatska", mesto: "Zagreb", mejlovi: ["konzularno.zagreb@mfa.rs"], sajt: "https://zagreb.mfa.gov.rs" },
    { zemlja: "Hrvatska", mesto: "Rijeka", mejlovi: ["izboririjeka2026@gmail.com"], sajt: "https://rijeka.mfa.gov.rs" },
    { zemlja: "Hrvatska", mesto: "Vukovar", mejlovi: ["generalni.konzulat@gk-srbije-vukovar.hr"], sajt: "https://vukovar.mfa.gov.rs", samoKontakt: true },
    { zemlja: "Mađarska", mesto: "Budimpešta", mejlovi: ["budapest-consulat@serbiaemb.t-online.hu"], sajt: "https://budapest.mfa.gov.rs" },
    { zemlja: "Belgija (i Luksemburg)", mesto: "Brisel", mejlovi: ["izbori.brisel@mfa.rs"], sajt: "https://brussels.mfa.gov.rs" },
    { zemlja: "Danska", mesto: "Kopenhagen", mejlovi: ["srb.emb.denmark@mfa.rs"], sajt: "https://copenhagen.mfa.gov.rs" },
    { zemlja: "Grčka", mesto: "Atina", mejlovi: ["embassy.athens.consular@mfa.rs"], sajt: "https://athens.mfa.gov.rs" },
    { zemlja: "Grčka", mesto: "Solun", mejlovi: ["srbcons@otenet.gr"], sajt: "https://thessaloniki.mfa.gov.rs" },
    { zemlja: "Rusija", mesto: "Moskva", mejlovi: ["konzularno.moskva@mfa.rs"], sajt: "https://moskva.mfa.gov.rs" },
    { zemlja: "UAE", mesto: "Abu Dabi", mejlovi: ["izbori.abudhabi@mfa.rs"], sajt: "https://abudhabi.mfa.gov.rs" },
    { zemlja: "Australija", mesto: "Kanbera", mejlovi: ["consular.canberra@mfa.rs"], sajt: "https://canberra.mfa.gov.rs" },
    { zemlja: "Australija", mesto: "Sidnej", mejlovi: ["srb.cons.sydney@mfa.rs"], sajt: "https://sydney.mfa.gov.rs" },
    { zemlja: "Češka", mesto: "Prag", mejlovi: ["konzularno.prag@mfa.rs"], sajt: "https://prague.mfa.gov.rs" },
    { zemlja: "Kipar", mesto: "Nikozija", mejlovi: ["izbori.nikozija@mfa.rs"], sajt: "https://nicosia.mfa.gov.rs" },
    { zemlja: "Severna Makedonija", mesto: "Skoplje", mejlovi: ["consulate.skopje@mfa.rs"], sajt: "https://skopje.mfa.gov.rs" },
    { zemlja: "Turska", mesto: "Ankara", mejlovi: ["consular.srb.ankara@gmail.com"], sajt: "https://ankara.mfa.gov.rs", samoKontakt: true },
    { zemlja: "Turska", mesto: "Istanbul", mejlovi: ["konzulat.istanbul@mfa.rs"], sajt: "https://istanbul.mfa.gov.rs", samoKontakt: true },
    { zemlja: "Poljska", mesto: "Varšava", mejlovi: ["consular.warsaw@mfa.rs"], sajt: "https://warsaw.mfa.gov.rs" },
    { zemlja: "Portugal", mesto: "Lisabon", mejlovi: ["srb.emb.portugal@mfa.rs"], sajt: "https://lisbon.mfa.gov.rs" },
    { zemlja: "Finska", mesto: "Helsinki", mejlovi: ["info@serbianembassy.fi"], sajt: "https://helsinki.mfa.gov.rs" },
    { zemlja: "Slovačka", mesto: "Bratislava", mejlovi: ["consular.bratislava@mfa.rs"], sajt: "https://bratislava.mfa.gov.rs" },
    { zemlja: "Kina", mesto: "Peking", mejlovi: ["srb.emb.china@mfa.rs"], sajt: "https://beijing.mfa.gov.rs" },
    { zemlja: "Kina", mesto: "Šangaj", mejlovi: ["srb.cons.shanghai@mfa.rs"], sajt: "https://shanghai.mfa.gov.rs" },
    { zemlja: "Katar", mesto: "Doha", mejlovi: ["izbori.ambrs.doha@gmail.com"], sajt: "https://doha.mfa.gov.rs" },
];
