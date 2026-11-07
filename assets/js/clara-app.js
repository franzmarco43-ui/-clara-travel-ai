// Store the key on window: no top-level lexical binding can enter a temporal dead zone.
window.CLARA_CONFIG_KEY = 'clara.travel.supabase.public.v1';
// Initialize the auth user state before any early chat/memory callbacks can read it.
let claraUser = null;
const CLARA_DEFAULT_SUPABASE_URL = 'https://ufsglnhebhbmadwzftau.supabase.co';
const CLARA_DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5B9FYMgDQ0SJjCYEeJgPgA_4DD4o3rN'; // Public publishable key only; RLS remains the authorization boundary.


const places=[
{name:'Passau',country:'Deutschland',emoji:'⛪',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Panorama%20Dom%20Passau.jpg',tag:'Drei-Flüsse-Stadt',desc:'Historische Altstadt am Zusammenfluss von Donau, Inn und Ilz.',lat:48.574,lon:13.461,routeType:'river'},
{name:'Linz',country:'Österreich',emoji:'🎨',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Linz_Ars_Electronica_center-5529.jpg',tag:'Kunst & Donauufer',desc:'Kultur, moderne Kunst und Spaziergänge an der Donau.',lat:48.307,lon:14.286,routeType:'river'},
{name:'Melk',country:'Österreich',emoji:'🏰',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Melk_Abbey.jpg',tag:'Stift & Wachau',desc:'Barockes Stift und die bezaubernde Wachau entdecken.',lat:48.228,lon:15.332,routeType:'river'},
{name:'Weißenkirchen',country:'Österreich',emoji:'🍇',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Wei%C3%9Fenkirchen_in_der_Wachau%2C_20210728_1212_0700.jpg',tag:'Wachau & Wein',desc:'Weinorte, Marillen und Spaziergänge durch die Wachauer Landschaft.',lat:48.397,lon:15.469,routeType:'river'},
{name:'Wien',country:'Österreich',emoji:'🎻',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Wien%20Schoenbrunn.jpg',tag:'Kaiserliche Kultur',desc:'Kaffeehauskultur, Museen und imperiale Geschichte.',lat:48.208,lon:16.374,routeType:'river'},
{name:'Bratislava',country:'Slowakei',emoji:'🏛️',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Bratislava_Castle.jpg',tag:'Altstadt & Burg',desc:'Gassen der Altstadt und Ausblicke von der Burg.',lat:48.149,lon:17.108,routeType:'river'},
{name:'Esztergom',country:'Ungarn',emoji:'⛪',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Basilica_in_Esztergom%2C_Hungary_01.jpg/960px-Basilica_in_Esztergom%2C_Hungary_01.jpg',tag:'Basilika & Donauknie',desc:'Monumentale Basilika, Burgviertel und Ausblicke am ungarischen Donauknie.<br><small>Foto: <a href="https://commons.wikimedia.org/wiki/File:Basilica_in_Esztergom,_Hungary_01.jpg" target="_blank" rel="noopener">Pudelek · Wikimedia Commons (CC BY-SA 4.0)</a></small>',lat:47.785,lon:18.741,routeType:'river'},
{name:'Budapest',country:'Ungarn',emoji:'🌉',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Hungarian_Parliament_Budapest.jpg',tag:'Thermen & Kulinarik',desc:'Donaupanorama, Thermalbäder und ungarische Küche.',lat:47.498,lon:19.040,routeType:'river'},{name:'Puszta',country:'Ungarn',emoji:'🐎',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Hortobagy%20puszta.jpg',tag:'Natur & Tradition · Landausflug',desc:'Weite Landschaften und die Kultur der ungarischen Tiefebene – als separater Ausflug ab Budapest.',lat:47.583,lon:21.150,routeType:'excursion'},
{name:'Novi Sad',country:'Serbien',emoji:'🎨',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Most%20slobode%20preko%20Dunava%2C%20Novi%20Sad.jpg',tag:'Kultur an der Donau',desc:'Lebendige Plätze und die Festung Petrovaradin.',lat:45.267,lon:19.833,routeType:'river'},
{name:'Belgrad',country:'Serbien',emoji:'🌆',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Church%20of%20Saint%20Sava%20%2813807900093%29.jpg',tag:'Stadt am Zusammenfluss',desc:'Kalemegdan, Flussblicke und serbische Spezialitäten.',lat:44.787,lon:20.449,routeType:'river'},
{name:'Russe',country:'Bulgarien',emoji:'🏛️',image:'https://obshtinaruse.bg/upload/images/articles/31425f2a57683a29e74d639b526cd46d.JPG',tag:'Kleines Wien an der Donau',desc:'Architektur, Donauufer und die römische Festung Sexaginta Prista.',lat:43.852656,lon:25.949764,routeType:'river'},
{name:'Donaudelta',country:'Rumänien',emoji:'🛶',image:'https://commons.wikimedia.org/wiki/Special:FilePath/White_pelicans_(Pelecanus_onocrotalus)_Danube_delta.jpg',tag:'Wildnis & Wasserwege',desc:'Kanäle, Vogelwelt und besondere Naturerlebnisse.',lat:45.180,lon:28.800,routeType:'river'},

];
const CLARA_CARD_TEXT={
 de:{date:'📅 Datum & Ortszeit',weather:'🌤 Aktuelles Wetter',level:'🌊 Donaupegel',loading:'Wird geladen …',levelInfo:'Noch keine verifizierte Messstelle zugeordnet',levelNotApplicable:'Kein Donaupegel – separater Landausflug',fetching:'Wetterdaten werden abgerufen …',discover:'Mit Clara entdecken →',view:'Ansicht von'},
 en:{date:'📅 Local date & time',weather:'🌤 Current weather',level:'🌊 Danube water level',loading:'Loading …',levelInfo:'No verified gauging station assigned yet',levelNotApplicable:'No Danube gauge – separate inland excursion',fetching:'Retrieving weather data …',discover:'Explore with Clara →',view:'View of'},
 nl:{date:'📅 Lokale datum & tijd',weather:'🌤 Actueel weer',level:'🌊 Donauwaterstand',loading:'Laden …',levelInfo:'Nog geen geverifieerd meetstation toegewezen',levelNotApplicable:'Geen Donaupeil – aparte excursie landinwaarts',fetching:'Weergegevens worden opgehaald …',discover:'Ontdek met Clara →',view:'Uitzicht op'},
 fr:{date:'📅 Date et heure locales',weather:'🌤 Météo actuelle',level:'🌊 Niveau du Danube',loading:'Chargement …',levelInfo:'Aucune station de mesure vérifiée attribuée',levelNotApplicable:'Pas de niveau du Danube – excursion terrestre séparée',fetching:'Récupération des données météo …',discover:'Découvrir avec Clara →',view:'Vue de'},
 ro:{date:'📅 Data și ora locală',weather:'🌤 Vremea actuală',level:'🌊 Nivelul Dunării',loading:'Se încarcă …',levelInfo:'Nu este atribuită încă nicio stație verificată',levelNotApplicable:'Fără nivel al Dunării – excursie separată pe uscat',fetching:'Se preiau datele meteo …',discover:'Descoperă cu Clara →',view:'Vedere spre'}
};
const CLARA_PLACE_TEXT={
 en:{Passau:['Germany','City of Three Rivers','Historic old town at the confluence of the Danube, Inn and Ilz.'],Linz:['Austria','Art & Danube waterfront','Culture, modern art and walks along the Danube.'],Melk:['Austria','Abbey & Wachau','Discover the Baroque abbey and beautiful Wachau Valley.'],Weißenkirchen:['Austria','Wachau & wine','Wine villages, apricots and walks through the Wachau landscape.'],Wien:['Austria','Imperial culture','Coffee-house culture, museums and imperial history.'],Bratislava:['Slovakia','Old Town & castle','Old Town lanes and views from the castle.'],Esztergom:['Hungary','Basilica & Danube Bend','Monumental basilica, castle quarter and views over the Danube Bend.'],Budapest:['Hungary','Thermal baths & cuisine','Danube panoramas, thermal baths and Hungarian cuisine.'],Puszta:['Hungary','Nature & tradition · excursion','Wide landscapes and Hungarian plains culture – a separate trip from Budapest.'],'Novi Sad':['Serbia','Danube culture','Lively squares and Petrovaradin Fortress.'],Belgrad:['Serbia','City at the confluence','Kalemegdan, river views and Serbian specialities.'],Russe:['Bulgaria','Little Vienna on the Danube','Architecture, riverfront and Roman fortress of Sexaginta Prista.'],Donaudelta:['Romania','Wilderness & waterways','Channels, birdlife and remarkable nature experiences.']},
 nl:{Passau:['Duitsland','Stad van drie rivieren','Historische binnenstad waar Donau, Inn en Ilz samenkomen.'],Linz:['Oostenrijk','Kunst & Donau-oever','Cultuur, moderne kunst en wandelingen langs de Donau.'],Melk:['Oostenrijk','Abdij & Wachau','Ontdek de barokke abdij en het betoverende Wachaugebied.'],Weißenkirchen:['Oostenrijk','Wachau & wijn','Wijndorpen, abrikozen en wandelingen door de Wachau.'],Wien:['Oostenrijk','Keizerlijke cultuur','Weense koffiehuizen, musea en keizerlijke geschiedenis.'],Bratislava:['Slowakije','Oude stad & kasteel','Steegjes in de oude stad en uitzicht vanaf het kasteel.'],Esztergom:['Hongarije','Basiliek & Donauknie','Monumentale basiliek, burchtwijk en uitzicht op de Donauknie.'],Budapest:['Hongarije','Thermen & gastronomie','Donaupanorama, thermale baden en Hongaarse keuken.'],Puszta:['Hongarije','Natuur & traditie · excursie','Uitgestrekte landschappen en de cultuur van de Hongaarse laagvlakte.'],'Novi Sad':['Servië','Cultuur aan de Donau','Levendige pleinen en fort Petrovaradin.'],Belgrad:['Servië','Stad aan de samenvloeiing','Kalemegdan, rivieruitzichten en Servische specialiteiten.'],Russe:['Bulgarije','Klein Wenen aan de Donau','Architectuur, Donau-oever en Romeins fort Sexaginta Prista.'],Donaudelta:['Roemenië','Wildernis & waterwegen','Kanalen, vogels en bijzondere natuurervaringen.']},
 fr:{Passau:['Allemagne','Ville aux trois rivières','Vieille ville historique au confluent du Danube, de l’Inn et de l’Ilz.'],Linz:['Autriche','Art & berges du Danube','Culture, art moderne et promenades au bord du Danube.'],Melk:['Autriche','Abbaye & Wachau','Découvrez l’abbaye baroque et la vallée de la Wachau.'],Weißenkirchen:['Autriche','Wachau & vignobles','Villages viticoles, abricots et promenades dans la Wachau.'],Wien:['Autriche','Culture impériale','Cafés viennois, musées et histoire impériale.'],Bratislava:['Slovaquie','Vieille ville & château','Ruelles de la vieille ville et vues depuis le château.'],Esztergom:['Hongrie','Basilique & coude du Danube','Basilique monumentale, quartier du château et panoramas sur le Danube.'],Budapest:['Hongrie','Thermes & gastronomie','Panoramas sur le Danube, bains thermaux et cuisine hongroise.'],Puszta:['Hongrie','Nature & traditions · excursion','Grands espaces et culture de la plaine hongroise.'],'Novi Sad':['Serbie','Culture au bord du Danube','Places animées et forteresse de Petrovaradin.'],Belgrad:['Serbie','Ville au confluent','Kalemegdan, vues sur les fleuves et spécialités serbes.'],Russe:['Bulgarie','Petite Vienne du Danube','Architecture, rives du Danube et forteresse romaine.'],Donaudelta:['Roumanie','Nature sauvage & canaux','Canaux, oiseaux et expériences naturelles remarquables.']},
 ro:{Passau:['Germania','Orașul celor trei râuri','Centrul istoric de la confluența Dunării cu Inn și Ilz.'],Linz:['Austria','Artă & promenada Dunării','Cultură, artă modernă și plimbări pe malul Dunării.'],Melk:['Austria','Abație & Valea Wachau','Descoperă abația barocă și Valea Wachau.'],Weißenkirchen:['Austria','Wachau & vin','Sate viticole, caise și plimbări prin peisajele Wachau.'],Wien:['Austria','Cultură imperială','Cafenele vieneze, muzee și istorie imperială.'],Bratislava:['Slovacia','Centrul vechi & castel','Străduțele centrului vechi și priveliștile de la castel.'],Esztergom:['Ungaria','Basilică & Cotul Dunării','Basilică monumentală, cartierul castelului și priveliști asupra Dunării.'],Budapest:['Ungaria','Băi termale & gastronomie','Panorame asupra Dunării, băi termale și bucătărie maghiară.'],Puszta:['Ungaria','Natură & tradiție · excursie','Peisaje întinse și cultura câmpiei maghiare.'],'Novi Sad':['Serbia','Cultură pe Dunăre','Piețe animate și fortăreața Petrovaradin.'],Belgrad:['Serbia','Oraș la confluență','Kalemegdan, priveliști spre râuri și specialități sârbești.'],Russe:['Bulgaria','Mica Vienă de pe Dunăre','Arhitectură, faleza Dunării și fortăreața romană Sexaginta Prista.'],Donaudelta:['România','Sălbăticie & canale','Canale, păsări și experiențe deosebite în natură.']}
};
function claraLang(){
 let lang='de';
 try{
  // One-time migration: old preview sessions that remained stuck in French
  // return to German once; later explicit language choices remain persistent.
  const defaultLanguageMigration='clara.language-default-de-v2';
  if(localStorage.getItem(defaultLanguageMigration)!=='1'){
    if(localStorage.getItem('clara.language')==='fr')localStorage.setItem('clara.language','de');
    localStorage.setItem(defaultLanguageMigration,'1');
  }
  const saved=localStorage.getItem('clara.language');
  if(saved&&['de','en','nl','fr','ro'].includes(saved))lang=saved;
 }catch(_){}
 // Keep the visible selectors and the rendered destination cards on one source of truth.
 if(typeof document!=='undefined'){
  document.querySelectorAll('.language-switch select').forEach(el=>{if(el.value!==lang)el.value=lang;});
  if(document.documentElement&&document.documentElement.lang!==lang)document.documentElement.lang=lang;
 }
 return lang;
}
function claraCardText(key){const lang=claraLang();return (CLARA_CARD_TEXT[lang]||CLARA_CARD_TEXT.en)[key]||CLARA_CARD_TEXT.en[key];}
function claraPlace(p){const lang=claraLang(),v=(CLARA_PLACE_TEXT[lang]||{})[p.name];return v?{country:v[0],tag:v[1],desc:v[2]}:p;}


function renderFeaturedDestinations(){
 const container=document.getElementById('featured-grid');
 if(!container)return;
 // Show all 12 Danube stations plus the separate Puszta excursion in route order.
 container.innerHTML=places.map(placeCard).join('');
}
function renderLandingDanubeMap(){
 const host=document.getElementById('landingDanubeMap');
 if(!host)return;
 const routeNames=['Passau','Linz','Melk','Weißenkirchen','Wien','Bratislava','Esztergom','Budapest','Novi Sad','Belgrad','Russe','Donaudelta'];
 const ys=[62,34,62,34,62,34,62,34,62,34,62,34];
 const stops=routeNames.map((name,index)=>({name,x:4+index*(92/(routeNames.length-1)),y:ys[index]}));
 const path=stops.map(stop=>`${stop.x*10},${stop.y*3}`).join(' ');
 const budapest=stops.find(stop=>stop.name==='Budapest');
 const puszta=places.find(item=>item.name==='Puszta');
 host.innerHTML=`<div class="landing-route">
  <svg class="landing-route-line" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
   <polyline points="${path}" fill="none" stroke="#79aeb0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
   <polyline points="${path}" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 13" stroke-linecap="round"/>
   <path d="M ${budapest.x*10} ${budapest.y*3} Q ${budapest.x*10+20} 10 ${budapest.x*10+65} 20" fill="none" stroke="#4c8c79" stroke-width="3" stroke-dasharray="5 7"/>
  </svg>
  ${stops.map(stop=>{
   const place=places.find(item=>item.name===stop.name);
   if(!place)return '';
   return `<button type="button" class="landing-route-stop" style="--stop-x:${stop.x}%;--stop-y:${stop.y}%" onclick="openDestination('${stop.name}')" aria-label="${stop.name} entdecken">
    <span class="route-thumb" style="background-image:url('${place.image}')"></span>
    <span class="route-name">${stop.name}</span>
   </button>`;
  }).join('')}
  ${puszta?`<button type="button" class="landing-route-stop landing-route-excursion" style="--stop-x:${Math.min(94,budapest.x+7)}%;--stop-y:7%" onclick="openDestination('Puszta')" aria-label="Puszta – Landausflug ab Budapest">
   <span class="route-thumb" style="background-image:url('${puszta.image}')"></span><span class="route-name">Puszta · Ausflug</span>
  </button>`:''}
 </div>`;
}
renderFeaturedDestinations();
renderLandingDanubeMap();
window.addEventListener('resize',updateFeaturedCarousel);
const cityTimeZones={'Passau':'Europe/Berlin','Linz':'Europe/Vienna','Melk':'Europe/Vienna','Weißenkirchen':'Europe/Vienna','Wien':'Europe/Vienna','Bratislava':'Europe/Bratislava','Esztergom':'Europe/Budapest','Budapest':'Europe/Budapest','Puszta':'Europe/Budapest','Novi Sad':'Europe/Belgrade','Belgrad':'Europe/Belgrade','Russe':'Europe/Sofia','Donaudelta':'Europe/Bucharest'};
const weatherLabels={
 de:{0:'Klar',1:'Überwiegend klar',2:'Teilweise bewölkt',3:'Bewölkt',45:'Nebel',48:'Nebel mit Reif',51:'Leichter Nieselregen',53:'Nieselregen',55:'Starker Nieselregen',56:'Leichter gefrierender Nieselregen',57:'Starker gefrierender Nieselregen',61:'Leichter Regen',63:'Regen',65:'Starker Regen',66:'Leichter gefrierender Regen',67:'Starker gefrierender Regen',71:'Leichter Schnee',73:'Schneefall',75:'Starker Schneefall',77:'Schneegriesel',80:'Regenschauer',81:'Regenschauer',82:'Starke Regenschauer',85:'Leichte Schneeschauer',86:'Starke Schneeschauer',95:'Gewitter',96:'Gewitter mit Hagel',99:'Starkes Gewitter'},
 en:{0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Depositing rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',56:'Light freezing drizzle',57:'Dense freezing drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',66:'Light freezing rain',67:'Heavy freezing rain',71:'Light snow',73:'Snowfall',75:'Heavy snow',77:'Snow grains',80:'Rain showers',81:'Rain showers',82:'Heavy rain showers',85:'Slight snow showers',86:'Heavy snow showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Severe thunderstorm'},
 nl:{0:'Helder',1:'Overwegend helder',2:'Half bewolkt',3:'Bewolkt',45:'Mist',48:'Rijpmist',51:'Lichte motregen',53:'Motregen',55:'Zware motregen',56:'Lichte aanvriezende motregen',57:'Dichte aanvriezende motregen',61:'Lichte regen',63:'Regen',65:'Zware regen',66:'Lichte ijzel',67:'Zware ijzel',71:'Lichte sneeuw',73:'Sneeuwval',75:'Zware sneeuwval',77:'Sneeuwkorrels',80:'Regenbuien',81:'Regenbuien',82:'Zware regenbuien',85:'Lichte sneeuwbuien',86:'Zware sneeuwbuien',95:'Onweer',96:'Onweer met hagel',99:'Zwaar onweer'},
 fr:{0:'Dégagé',1:'Principalement dégagé',2:'Partiellement nuageux',3:'Couvert',45:'Brouillard',48:'Brouillard givrant',51:'Bruine légère',53:'Bruine',55:'Bruine forte',56:'Bruine verglaçante légère',57:'Bruine verglaçante dense',61:'Pluie légère',63:'Pluie',65:'Forte pluie',66:'Pluie verglaçante légère',67:'Forte pluie verglaçante',71:'Neige légère',73:'Chutes de neige',75:'Fortes chutes de neige',77:'Grains de neige',80:'Averses',81:'Averses',82:'Fortes averses',85:'Faibles averses de neige',86:'Fortes averses de neige',95:'Orage',96:'Orage avec grêle',99:'Orage violent'},
 ro:{0:'Senin',1:'Mai mult senin',2:'Parțial noros',3:'Noros',45:'Ceață',48:'Ceață cu chiciură',51:'Burniță ușoară',53:'Burniță',55:'Burniță puternică',56:'Burniță înghețată ușoară',57:'Burniță înghețată densă',61:'Ploaie ușoară',63:'Ploaie',65:'Ploaie abundentă',66:'Ploaie înghețată ușoară',67:'Ploaie înghețată puternică',71:'Ninsoare ușoară',73:'Ninsoare',75:'Ninsoare abundentă',77:'Grăunțe de zăpadă',80:'Averse',81:'Averse',82:'Averse puternice',85:'Averse slabe de ninsoare',86:'Averse puternice de ninsoare',95:'Furtună',96:'Furtună cu grindină',99:'Furtună severă'}
};
const liveLabels={
 de:{time:'Datum & Ortszeit',weather:'Wetterstand',weatherUnavailable:'Aktuell nicht verfügbar',weatherError:'Wetterdaten konnten nicht geladen werden.',clock:'Uhr',retrieved:'Abruf'},
 en:{time:'Local date & time',weather:'Weather updated',weatherUnavailable:'Currently unavailable',weatherError:'Weather data could not be loaded.',clock:'',retrieved:'Fetched'},
 nl:{time:'Lokale datum & tijd',weather:'Weer bijgewerkt',weatherUnavailable:'Momenteel niet beschikbaar',weatherError:'Weergegevens konden niet worden geladen.',clock:'uur',retrieved:'Opgehaald'},
 fr:{time:'Date et heure locales',weather:'Météo mise à jour',weatherUnavailable:'Indisponible actuellement',weatherError:'Impossible de charger les données météo.',clock:'',retrieved:'Relevé'},
 ro:{time:'Data și ora locală',weather:'Actualizare meteo',weatherUnavailable:'Indisponibil momentan',weatherError:'Datele meteo nu au putut fi încărcate.',clock:'ora',retrieved:'Preluat'}
};

function currentClaraLocale(){const lang=claraLang();return {de:'de-DE',en:'en-GB',nl:'nl-NL',fr:'fr-FR',ro:'ro-RO'}[lang]||'de-DE';}
function updateCityClocks(){const lang=claraLang();const labels=liveLabels[lang]||liveLabels.de;document.querySelectorAll('[data-city-live]').forEach(card=>{const zone=cityTimeZones[card.dataset.cityLive];if(!zone)return;const now=new Date();const date=new Intl.DateTimeFormat(currentClaraLocale(),{timeZone:zone,day:'2-digit',month:'2-digit',year:'numeric'}).format(now);const time=new Intl.DateTimeFormat(currentClaraLocale(),{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);const el=card.querySelector('[data-live-time]');if(el)el.textContent=date+' · '+time+(labels.clock?' '+labels.clock:'');});}
async function loadCityWeather(){const cards=[...document.querySelectorAll('[data-city-live]')].filter(card=>card.getClientRects().length>0);await Promise.all(cards.map(async card=>{const p=places.find(x=>x.name===card.dataset.cityLive);const el=card.querySelector('[data-live-weather]');if(!p||!el)return;const lang=claraLang();const labels=liveLabels[lang]||liveLabels.de;try{const url='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(p.lat)+'&longitude='+encodeURIComponent(p.lon)+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone='+encodeURIComponent(cityTimeZones[p.name]||'auto');const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error('Weather provider unavailable');const data=await response.json(),c=data.current;if(!c||typeof c.temperature_2m!=='number')throw new Error('No current weather values');const weatherLabel=(weatherLabels[lang]||weatherLabels.de)[c.weather_code]||labels.weatherUnavailable;el.textContent=weatherLabel+' · '+Math.round(c.temperature_2m)+' °C';const stamp=card.querySelector('[data-live-updated]');const localWeatherTime=String(c.time||'').match(/T(\d{2}:\d{2})/)?.[1];if(stamp){const retrievedAt=new Intl.DateTimeFormat(currentClaraLocale(),{timeZone:cityTimeZones[p.name]||'auto',hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(new Date());stamp.textContent=labels.weather+': '+(localWeatherTime||labels.weatherUnavailable)+(labels.clock?' '+labels.clock:'')+' · '+labels.retrieved+' '+retrievedAt+' · Open-Meteo';}}catch(error){el.textContent=labels.weatherUnavailable;const stamp=card.querySelector('[data-live-updated]');if(stamp)stamp.textContent=labels.weatherError;}}));}
function placeCard(p){const t=claraPlace(p);return `<article class="featured-card"><div class="dest-img" style="background-image:linear-gradient(180deg,#102f2820,#102f2866),url('${p.image}');background-size:cover;background-position:center" role="img" aria-label="${claraCardText('view')} ${p.name}"><span>${t.country}</span></div><div class="dest-info"><h3>${p.name}</h3><p>${t.desc}</p><div class="city-live" data-city-live="${p.name}"><div class="city-live-row"><b>${claraCardText('date')}</b><span data-live-time>${claraCardText('loading')}</span></div><div class="city-live-row"><b>${claraCardText('weather')}</b><span data-live-weather>${claraCardText('loading')}</span></div><div class="city-live-row"><b>${claraCardText('level')}</b><span data-live-level>${claraCardText(p.routeType==='excursion'?'levelNotApplicable':'levelInfo')}</span></div><small data-live-updated>${claraCardText('fetching')}</small></div><button onclick="selectDestination('${p.name}')">${claraCardText('discover')}</button></div></article>`}
const featuredPlaceNames=places.map(place=>place.name); // Show live weather for all 13 destinations, including the separate Puszta excursion.
document.getElementById('destinations').innerHTML=featuredPlaceNames.map(name=>places.find(p=>p.name===name)).filter(Boolean).map(placeCard).join('');
updateCityClocks();
// Load live weather immediately on the landing page; refresh periodically and when the tab becomes visible.
loadCityWeather();
setInterval(updateCityClocks,1000);
setInterval(()=>{if(document.visibilityState==='visible')loadCityWeather();},15*60*1000);
document.addEventListener('visibilitychange',()=>{if(document.visibilityState==='visible'){updateCityClocks();loadCityWeather();}});
document.getElementById('destination').innerHTML=places.map(p=>`<option>${p.name}</option>`).join('');
const riverRoutePlaces=places.filter(p=>p.routeType==='river');
document.getElementById('routeList').innerHTML=riverRoutePlaces.map((p,i)=>`<button type="button" class="route-point" onclick="focusDanubeStop('${p.name}')"><span class="route-number">${i+1}</span><span>${p.name}</span><span class="route-country">${claraPlace(p).country}</span></button>`).join('');
let danubeMapInstance=null;
const danubeMarkers={};
function renderDanubeMapFallback(){
  const host=document.getElementById('danubeMap');
  if(!host)return;
  const route=riverRoutePlaces.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
  if(!route.length){host.innerHTML='<p style="padding:22px">Die Stationsdaten für die Donaukarte sind nicht verfügbar.</p>';return;}
  const all=places.filter(p=>Number.isFinite(p.lat)&&Number.isFinite(p.lon));
  const lons=all.map(p=>p.lon),lats=all.map(p=>p.lat);
  const minLon=Math.min(...lons)-1,maxLon=Math.max(...lons)+1,minLat=Math.min(...lats)-1,maxLat=Math.max(...lats)+1;
  const xy=p=>({x:36+(p.lon-minLon)/(maxLon-minLon)*928,y:28+(maxLat-p.lat)/(maxLat-minLat)*494});
  const line=route.map(p=>{const q=xy(p);return q.x+','+q.y;}).join(' ');
  const markers=route.map((p,i)=>{const q=xy(p);return '<g role="button" tabindex="0" aria-label="'+p.name+'" onclick="renderMapDestination(\''+p.name+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')renderMapDestination(\''+p.name+'\')"><circle cx="'+q.x+'" cy="'+q.y+'" r="15" fill="#245c50" stroke="#fff" stroke-width="3"/><text x="'+q.x+'" y="'+(q.y+4)+'" text-anchor="middle" font-size="11" font-weight="700" fill="#fff">'+(i+1)+'</text><text x="'+Math.min(890,q.x+17)+'" y="'+(q.y-12)+'" font-size="13" font-weight="600" fill="#24473e">'+p.name+'</text></g>';}).join('');
  const extra=places.find(p=>p.routeType==='excursion');
  const extraSvg=extra?(()=>{const q=xy(extra);return '<g role="button" tabindex="0" aria-label="Puszta-Ausflug" onclick="renderMapDestination(\''+extra.name+'\')"><circle cx="'+q.x+'" cy="'+q.y+'" r="14" fill="#4c8c79" stroke="#fff" stroke-width="3"/><text x="'+q.x+'" y="'+(q.y+4)+'" text-anchor="middle" font-size="12" fill="#fff">✦</text><text x="'+Math.min(890,q.x+16)+'" y="'+(q.y-12)+'" font-size="13" font-weight="600" fill="#24473e">'+extra.name+' · Ausflug</text></g>';})():'';
  host.innerHTML='<div style="height:100%;min-height:300px;background:linear-gradient(145deg,#eaf2ed,#dbe9e1);overflow:hidden"><svg viewBox="0 0 1000 560" role="img" aria-label="Schematische Donaukarte mit Stationen" style="width:100%;height:100%;min-height:300px;display:block"><path d="M0 95 Q170 155 270 110 T520 170 T760 260 T1000 390" fill="none" stroke="#b7d9d6" stroke-width="46" opacity=".6"/><polyline points="'+line+'" fill="none" stroke="#c79b53" stroke-width="4" stroke-dasharray="7 8" stroke-linecap="round"/>'+markers+extraSvg+'<text x="22" y="540" font-size="12" fill="#536b60">Schematische Stationsübersicht · Kartenhintergrund derzeit nicht verfügbar</text></svg></div>';
}
function initDanubeMap(){
  const host=document.getElementById('danubeMap');
  if(!host)return;
  if(!window.L){renderDanubeMapFallback();return;}
  if(danubeMapInstance){
    requestAnimationFrame(()=>danubeMapInstance&&danubeMapInstance.invalidateSize());
    return;
  }
  if(host.clientWidth===0||host.clientHeight===0){
    setTimeout(initDanubeMap,120);
    return;
  }
  try{
    danubeMapInstance=window.L.map(host,{scrollWheelZoom:false}).setView([46.9,20.0],5);
    const danubeTiles=window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
      maxZoom:18,
      attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
    }).addTo(danubeMapInstance);
    let danubeTileErrors=0;
    let danubeFallbackShown=false;
    const showDanubeFallback=()=>{
      if(danubeFallbackShown)return;
      danubeFallbackShown=true;
      console.warn('Clara: Kartenhintergrund nicht rechtzeitig verfügbar – zeige die schematische Donaukarte.');
      if(danubeMapInstance){try{danubeMapInstance.remove();}catch(_){}danubeMapInstance=null;}
      renderDanubeMapFallback();
    };
    danubeTiles.on('tileerror',()=>{
      danubeTileErrors++;
      if(danubeTileErrors>=6)showDanubeFallback();
    });
    // Some networks leave tile requests pending without firing tileerror.
    // Do not leave the map blank forever in that case.
    setTimeout(()=>{
      if(danubeMapInstance&&!danubeFallbackShown&&!host.querySelector('.leaflet-tile-loaded'))showDanubeFallback();
    },5000);
    const riverStops=riverRoutePlaces;
    const routeLine=window.L.polyline(riverStops.map(p=>[p.lat,p.lon]),{
      color:'#c79b53',weight:3,opacity:.85,dashArray:'7 8',lineCap:'round'
    }).addTo(danubeMapInstance);
    routeLine.bindTooltip('Schematische Verbindung der Reise-Stationen',{sticky:true});
    riverStops.forEach((p,i)=>{
      const icon=window.L.divIcon({className:'route-marker',html:'<span>'+(i+1)+'</span>',iconSize:[29,29],iconAnchor:[14,14]});
      const marker=window.L.marker([p.lat,p.lon],{icon}).addTo(danubeMapInstance);
      marker.bindPopup('<strong>'+p.name+'</strong><br><span>'+p.tag+'</span><br><small>'+p.country+'</small>');
      marker.on('click',()=>renderMapDestination(p.name));
      danubeMarkers[p.name]=marker;
    });
    const puszta=places.find(p=>p.routeType==='excursion');
    const budapest=riverStops.find(p=>p.name==='Budapest');
    if(puszta&&budapest){
      const excursionIcon=window.L.divIcon({className:'route-marker excursion',html:'<span>✦</span>',iconSize:[29,29],iconAnchor:[14,14]});
      const marker=window.L.marker([puszta.lat,puszta.lon],{icon:excursionIcon}).addTo(danubeMapInstance);
      marker.bindPopup('<strong>Puszta – Landausflug</strong><br><span>Separater Ausflug, keine Donaustation</span>');
      marker.on('click',()=>renderMapDestination(puszta.name));
      danubeMarkers[puszta.name]=marker;
      window.L.polyline([[budapest.lat,budapest.lon],[puszta.lat,puszta.lon]],{color:'#4c8c79',weight:2,dashArray:'3 8',opacity:.9}).addTo(danubeMapInstance).bindTooltip('Land-Ausflug ab Budapest');
    }
    danubeMapInstance.fitBounds(window.L.latLngBounds(places.map(p=>[p.lat,p.lon])),{padding:[24,24]});
    requestAnimationFrame(()=>danubeMapInstance&&danubeMapInstance.invalidateSize());
  }catch(error){
    console.error('Clara: Donaukarte konnte nicht initialisiert werden',error);
    if(danubeMapInstance){try{danubeMapInstance.remove();}catch(_){}danubeMapInstance=null;}
    renderDanubeMapFallback();
  }
}
function renderMapDestination(name){
  const place=places.find(item=>item.name===name);
  const host=document.getElementById('mapDestinationDetail');
  if(!place||!host)return;
  host.innerHTML=placeCard(place);
  loadCityWeather();
}
function focusDanubeStop(name){
  renderMapDestination(name);
  const marker=danubeMarkers[name];
  if(!marker||!danubeMapInstance)return;
  danubeMapInstance.setView(marker.getLatLng(),Math.max(danubeMapInstance.getZoom(),8),{animate:true});
  marker.openPopup();
}

let danubeLockRecords=[];
let danubeLocksMap=null;
const danubeLockMarkers=[];
let selectedLockIndex=-1;
let lockDataLoaded=false;
let lockLoading=false;
function escapeLockHtml(value){
  return String(value===undefined||value===null||value===""?"—":value).replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"}[ch]));
}
function validateDanubeLockData(data){
  const records=data?.records;
  if(!Array.isArray(records)||records.length!==18||data.count!==18){
    throw new Error('Die Schleusendatenbank muss genau 18 Datensätze enthalten.');
  }
  const names=records.map(lock=>typeof lock?.name==='string'?lock.name.trim():'');
  if(names.some(name=>!name)||new Set(names).size!==18){
    throw new Error('Die Schleusendatenbank enthält fehlende oder doppelte Schleusennamen.');
  }
  if(records.some(lock=>!Number.isFinite(lock.latitude)||!Number.isFinite(lock.longitude)||lock.latitude < -90||lock.latitude > 90||lock.longitude < -180||lock.longitude > 180)){
    throw new Error('Mindestens eine Schleuse hat ungültige geografische Koordinaten.');
  }
  return records;
}
async function loadDanubeLocks(){
  const status=document.getElementById('lockStatus');
  if(lockLoading)return;
  if(lockDataLoaded){initDanubeLocksMap();renderLockList();if(selectedLockIndex<0&&danubeLockRecords.length)selectLock(0,false);return;}
  lockLoading=true;
  if(status)status.textContent='Lade 18 technische Schleusendatensätze …';
  try{
    const response=await fetch('/assets/data/danube-locks.json',{cache:'no-store'});
    if(!response.ok)throw new Error('Datendatei konnte nicht geladen werden ('+response.status+').');
    const data=await response.json();
    danubeLockRecords=validateDanubeLockData(data);
    lockDataLoaded=true;
    if(status)status.textContent=danubeLockRecords.length+' Schleusen · technische Referenzdaten';
    renderLockList();
    initDanubeLocksMap();
    selectLock(0,false);
  }catch(err){
    console.error('Donau-Schleusen:',err);
    if(status)status.textContent='Schleusendaten konnten nicht geladen werden: '+err.message;
    document.getElementById('lockDetail').innerHTML='<p>Die technische Datenbank ist gerade nicht erreichbar. Bitte später erneut versuchen.</p>';
  }finally{lockLoading=false;}
}
function renderLockList(){
  const host=document.getElementById('lockList');
  if(!host||!danubeLockRecords.length)return;
  const q=(document.getElementById('lockSearch')?.value||'').toLowerCase().trim();
  const country=document.getElementById('lockCountry')?.value||'';
  const matches=danubeLockRecords.map((lock,index)=>({lock,index})).filter(({lock})=>{
    const text=[lock.name,lock.country,lock.countryCode,lock.riverKm,lock.chamberSize].join(' ').toLowerCase();
    return (!q||text.includes(q))&&(!country||lock.countryCode===country||lock.countryCode.split('/').includes(country));
  });
  host.innerHTML=matches.map(({lock,index})=>'<button type="button" class="lock-row '+(index===selectedLockIndex?'active':'')+'" onclick="selectLock('+index+')"><span class="route-number">'+(index+1)+'</span><span><b>'+escapeLockHtml(lock.name)+'</b><small>'+escapeLockHtml(lock.country)+' · km '+escapeLockHtml(lock.riverKm)+'</small></span></button>').join('');
  const status=document.getElementById('lockStatus');
  if(status)status.textContent=matches.length+' von '+danubeLockRecords.length+' Schleusen angezeigt';
}
function renderDanubeLocksFallback(){
  const host=document.getElementById('locksMap');
  if(!host||!danubeLockRecords.length)return;
  const records=danubeLockRecords.filter(lock=>Number.isFinite(lock.latitude)&&Number.isFinite(lock.longitude));
  if(!records.length){host.innerHTML='<p style="padding:22px">Für die Schleusen sind keine Koordinaten verfügbar.</p>';return;}
  const lons=records.map(r=>r.longitude),lats=records.map(r=>r.latitude);
  const minLon=Math.min(...lons)-.25,maxLon=Math.max(...lons)+.25,minLat=Math.min(...lats)-.25,maxLat=Math.max(...lats)+.25;
  const xy=r=>({x:40+(r.longitude-minLon)/(maxLon-minLon)*920,y:28+(maxLat-r.latitude)/(maxLat-minLat)*384});
  const line=records.map(r=>{const p=xy(r);return p.x+','+p.y;}).join(' ');
  const markers=records.map(r=>{const i=danubeLockRecords.indexOf(r),p=xy(r);return '<g role="button" tabindex="0" aria-label="'+escapeLockHtml(r.name)+'" onclick="selectLock('+i+')" onkeydown="if(event.key===\'Enter\'||event.key===\' \')selectLock('+i+')"><circle cx="'+p.x+'" cy="'+p.y+'" r="12" fill="'+(i===selectedLockIndex?'#c18c39':'#245c50')+'" stroke="#fff" stroke-width="3"/><text x="'+p.x+'" y="'+(p.y+4)+'" text-anchor="middle" font-size="10" font-weight="700" fill="#fff">'+(i+1)+'</text><title>'+escapeLockHtml(r.name)+' · '+escapeLockHtml(r.country)+'</title></g>';}).join('');
  host.innerHTML='<div style="height:100%;min-height:270px;background:linear-gradient(145deg,#eaf2ed,#dbe9e1);overflow:hidden"><svg viewBox="0 0 1000 440" role="img" aria-label="Schematische Schleusenkarte mit 18 Standorten" style="width:100%;height:100%;min-height:270px;display:block"><path d="M0 65 Q190 120 300 90 T610 210 T1000 345" fill="none" stroke="#b7d9d6" stroke-width="38" opacity=".65"/><polyline points="'+line+'" fill="none" stroke="#c79b53" stroke-width="4" stroke-dasharray="6 7"/>'+markers+'<text x="18" y="425" font-size="12" fill="#536b60">Schematische Übersicht · Nummern entsprechen der Schleusenliste</text></svg></div>';
}
function initDanubeLocksMap(){
  const host=document.getElementById('locksMap');
  if(!host||!danubeLockRecords.length)return;
  if(!window.L){renderDanubeLocksFallback();return;}
  if(danubeLocksMap){setTimeout(()=>danubeLocksMap&&danubeLocksMap.invalidateSize(),120);return;}
  try{
    danubeLocksMap=window.L.map(host,{scrollWheelZoom:false}).setView([48.2,15.5],5);
    const lockTiles=window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(danubeLocksMap);
    let lockTileErrors=0;
    let lockFallbackShown=false;
    const showLocksFallback=()=>{
      if(lockFallbackShown)return;
      lockFallbackShown=true;
      console.warn('Clara: Schleusenkarten-Hintergrund nicht rechtzeitig verfügbar – zeige die schematische Übersicht.');
      if(danubeLocksMap){try{danubeLocksMap.remove();}catch(_){}danubeLocksMap=null;}
      renderDanubeLocksFallback();
    };
    lockTiles.on('tileerror',()=>{
      lockTileErrors++;
      if(lockTileErrors>=6)showLocksFallback();
    });
    // Also handle stalled tile requests which never emit tileerror.
    setTimeout(()=>{
      if(danubeLocksMap&&!lockFallbackShown&&!host.querySelector('.leaflet-tile-loaded'))showLocksFallback();
    },12000);
    danubeLockRecords.forEach((lock,index)=>{
      if(!Number.isFinite(lock.latitude)||!Number.isFinite(lock.longitude))return;
      const icon=window.L.divIcon({className:'lock-map-marker',html:'<span>'+(index+1)+'</span>',iconSize:[25,25],iconAnchor:[12,12]});
      const marker=window.L.marker([lock.latitude,lock.longitude],{icon}).addTo(danubeLocksMap);
      marker.bindPopup('<b>'+escapeLockHtml(lock.name)+'</b><br>'+escapeLockHtml(lock.country)+'<br>Strom-km '+escapeLockHtml(lock.riverKm));
      marker.on('click',()=>selectLock(index,false));
      danubeLockMarkers[index]=marker;
    });
    const points=danubeLockRecords.filter(lock=>Number.isFinite(lock.latitude)&&Number.isFinite(lock.longitude)).map(lock=>[lock.latitude,lock.longitude]);
    if(points.length)danubeLocksMap.fitBounds(window.L.latLngBounds(points),{padding:[20,20]});
    setTimeout(()=>danubeLocksMap&&danubeLocksMap.invalidateSize(),120);
  }catch(error){
    console.error('Clara: Schleusenkarte konnte nicht initialisiert werden',error);
    if(danubeLocksMap){try{danubeLocksMap.remove();}catch(_){}danubeLocksMap=null;}
    renderDanubeLocksFallback();
  }
}
function selectLock(index,focusMap=true){
  const lock=danubeLockRecords[index];
  if(!lock)return;
  selectedLockIndex=index;
  const detail=document.getElementById('lockDetail');
  const stats=[
    ['Schleusenkammern',lock.chambers],
    ['Kammermaß',lock.chamberSize],
    ['Max. Haltungsunterschied',lock.maxHead],
    ['Stromkilometer',lock.riverKm]
  ];
  const rows=[
    ['Land / Zuständigkeit',lock.country],
    ['Stromkilometer',lock.riverKm],
    ['Anzahl der Kammern',lock.chambers],
    ['Kammerabmessungen (Länge × Breite)',lock.chamberSize],
    ['Drempeltiefe / Referenztiefe',lock.sillDepth],
    ['Brückendurchfahrtshöhe',lock.bridgeClearance],
    ['Max. Haltungsunterschied',lock.maxHead],
    ['Max. Schiffs-/Verbandsabmessung laut Datensatz',lock.maxConvoy],
    ['UKW-Funkkanal',lock.radio],
    ['Telefon',lock.phone]
  ];
  detail.innerHTML='<div class="lock-detail-top"><div><div class="eyebrow">SCHLEUSE '+(index+1)+' VON '+danubeLockRecords.length+'</div><h2>'+escapeLockHtml(lock.name)+'</h2><p>'+escapeLockHtml(lock.country)+' · Strom-km '+escapeLockHtml(lock.riverKm)+'</p></div><button class="btn soft" onclick="askClaraAboutLock('+index+')">Clara zu dieser Schleuse fragen</button></div><div class="lock-stats">'+stats.map(([label,value])=>'<div class="lock-stat"><small>'+escapeLockHtml(label)+'</small><b>'+escapeLockHtml(value)+'</b></div>').join('')+'</div><h3>Technische Daten</h3><table class="lock-table"><tbody>'+rows.map(([label,value])=>'<tr><th>'+escapeLockHtml(label)+'</th><td>'+escapeLockHtml(value)+'</td></tr>').join('')+'</tbody></table><div class="lock-note"><b>Hinweis:</b> '+escapeLockHtml(lock.note)+'</div>';
  renderLockList();
  danubeLockMarkers.forEach((marker,i)=>{
    if(!marker)return;
    const el=marker.getElement();
    if(el)el.classList.toggle('active',i===index);
  });
  if(focusMap&&danubeLocksMap&&danubeLockMarkers[index]){
    danubeLocksMap.setView(danubeLockMarkers[index].getLatLng(),Math.max(danubeLocksMap.getZoom(),7),{animate:true});
    danubeLockMarkers[index].openPopup();
  }
}
function askClaraAboutLock(index){
  const lock=danubeLockRecords[index];
  if(!lock)return;
  showPage('clara');
  setTimeout(()=>{
    const input=document.getElementById('chatInput');
    input.value='Gib mir bitte alle technischen Informationen zur Schleuse '+lock.name+' – insbesondere Kammermaß, Anzahl der Kammern, Stromkilometer, Drempeltiefe, Durchfahrtshöhe, maximalen Haltungsunterschied und UKW-Kanal.';
    document.getElementById('chatbox').scrollTop=document.getElementById('chatbox').scrollHeight;
    input.focus();
  },100);
}


function toggleMobileMenu(){const menu=document.getElementById('mobile-site-nav');const button=document.querySelector('.mobile-menu-toggle');if(!menu||!button)return;const open=menu.classList.toggle('open');button.setAttribute('aria-expanded',String(open));button.setAttribute('aria-label',open?'Menü schließen':'Menü öffnen');button.textContent=open?'×':'☰';}
function closeMobileMenu(){const menu=document.getElementById('mobile-site-nav');const button=document.querySelector('.mobile-menu-toggle');if(menu)menu.classList.remove('open');if(button){button.setAttribute('aria-expanded','false');button.setAttribute('aria-label','Menü öffnen');button.textContent='☰';}}
let claraHistoryRestore=false;
function claraSetRoute(route,replace=false){
  if(claraHistoryRestore)return;
  const state={claraTravelAI:true,view:route.view,page:route.page||'home'};
  try{
    if(replace)history.replaceState(state,'',window.location.href);
    else history.pushState(state,'',window.location.href);
  }catch(error){console.warn('Clara: Browserverlauf konnte nicht aktualisiert werden.',error);}
}
function restoreClaraRoute(state){
  claraHistoryRestore=true;
  const route=state&&state.claraTravelAI?state:{view:'landing',page:'home'};
  const landing=document.getElementById('marketing-home');
  const app=document.getElementById('clara-app');
  if(route.view==='app'){
    landing.style.display='none';
    app.style.display='block';
    showPage(route.page||'home');
  }else{
    app.style.display='none';
    landing.style.display='block';
    window.scrollTo({top:0,behavior:'auto'});
  }
  claraHistoryRestore=false;
}
window.addEventListener('popstate',event=>restoreClaraRoute(event.state));
function openAppPage(page){
  document.getElementById('marketing-home').style.display='none';
  document.getElementById('clara-app').style.display='block';
  showPage(page);
}
function openDestination(name){openAppPage('planner');const destination=document.getElementById('destination');if(destination)destination.value=name;makePlan();}
function returnToLanding(){
  claraSetRoute({view:'landing',page:'home'});
  document.getElementById('clara-app').style.display='none';
  document.getElementById('marketing-home').style.display='block';
  window.scrollTo({top:0,behavior:'smooth'});
}

function showPage(page){
  if(page==='planner')renderClaraTripPlans();
  const activePage=document.getElementById('page-'+page);
  if(!activePage){
    console.warn('Clara: unbekannte App-Seite:',page);
    return;
  }
  document.querySelectorAll('.page').forEach(section=>section.classList.toggle('hidden',section!==activePage));
  document.querySelectorAll('[data-page]').forEach(button=>{
    const active=button.dataset.page===page;
    button.classList.toggle('active',active);
    if(active)button.setAttribute('aria-current','page');
    else button.removeAttribute('aria-current');
  });
  if(typeof loadCityWeather==='function')loadCityWeather();
  if(page==='intelligence'){
    const destinationHost=document.getElementById('intelligenceDestinations');
    if(destinationHost&&!destinationHost.dataset.rendered){
      renderClaraIntelligence();
      destinationHost.dataset.rendered='true';
    }
  }
  if(page==='map'){
    requestAnimationFrame(()=>setTimeout(initDanubeMap,80));
  }
  if(page==='locks')loadDanubeLocks();
  if(!claraHistoryRestore)claraSetRoute({view:'app',page});
  window.scrollTo({top:0,behavior:claraHistoryRestore?'auto':'smooth'});
}
function selectDestination(name){document.getElementById('destination').value=name;showPage('planner');makePlan()}
function makePlan(){const name=document.getElementById('destination').value,duration=document.getElementById('duration').value,interest=document.getElementById('interest').value,pace=document.getElementById('pace').value,mobility=document.getElementById('mobility')?.value||'Keine besondere Angabe';const p=places.find(x=>x.name===name);let stops={
'Linz':[['Vormittag','Altstadt & Hauptplatz','Entdecke die historische Innenstadt und die Plätze am Donauufer.'],['Mittag','Regionale Küche','Plane eine Pause für österreichische Klassiker ein.'],['Nachmittag','Ars Electronica oder Donauufer','Wähle ein Museum oder einen entspannten Spaziergang.']],
'Passau':[['Vormittag','Dreiflüsse-Eck & Altstadt','Erkunde den Zusammenfluss von Donau, Inn und Ilz und die historische Altstadt.'],['Mittag','Niederbayerische Küche','Plane eine Pause mit regionaler Wirtshausküche ein.'],['Nachmittag','Dom St. Stephan oder Veste Oberhaus','Wähle Kultur im Dom oder einen Aussichtspunkt über der Stadt.']],
'Weißenkirchen':[['Vormittag','Historischer Ortskern','Entdecke Pfarrkirche, Teisenhoferhof und das Donauufer.'],['Mittag','Wachauer Genuss','Probiere saisonale Wachauer Spezialitäten und regionale Küche.'],['Nachmittag','Weinberge und Aussicht','Wähle einen passenden Spaziergang; Verkostungen nur mit bestätigter Öffnungszeit.']],
'Melk':[['Vormittag','Stift Melk','Prüfe aktuelle Öffnungszeiten und reserviere bei Bedarf vorab.'],['Mittag','Wachauer Spezialitäten','Probiere saisonale Produkte aus der Wachau.'],['Nachmittag','Donau & Wachau','Genieße Aussichtspunkte und einen ruhigen Spaziergang.']],
'Wien':[['Vormittag','Historisches Zentrum','Erkunde Stephansdom und die Gassen der Innenstadt.'],['Mittag','Wiener Kaffeehaus','Gönn dir eine Pause mit Kaffee und einer Mehlspeise.'],['Nachmittag','Ringstraße oder Museum','Wähle Kultur nach deinem Tempo.']],
'Bratislava':[['Vormittag','Altstadt','Spaziere durch die Gassen rund um den Hauptplatz.'],['Mittag','Slowakische Küche','Entdecke regionale Gerichte in einem lokalen Lokal.'],['Nachmittag','Burg Bratislava','Genieße den Blick über die Donau.']],
'Esztergom':[['Vormittag','Basilika von Esztergom','Besichtige eine der markantesten Kirchen Ungarns und genieße den Blick über das Donauknie.'],['Mittag','Ungarische Küche','Probiere regionale ungarische Spezialitäten in der Altstadt.'],['Nachmittag','Burgviertel & Maria-Valeria-Brücke','Erkunde das historische Burgviertel oder den Blick hinüber in die Slowakei.']],
'Budapest':[['Vormittag','Burgviertel','Erkunde die historische Budaer Seite und ihre Aussichtspunkte.'],['Mittag','Ungarische Spezialitäten','Probiere Gulasch oder Lángos – je nach Geschmack.'],['Nachmittag','Donaupromenade','Spaziere entlang der Donau und bewundere das Panorama.']],
'Puszta':[['Vormittag','Natur und Landschaft','Plane den Ausflug mit einem lokalen Anbieter und prüfe die Anreise.'],['Mittag','Ungarische Hausmannskost','Entdecke saisonale und regionale Küche.'],['Nachmittag','Tradition und Natur','Wähle eine geführte Natur- oder Kulturerfahrung.']],
'Novi Sad':[['Vormittag','Stadtzentrum','Erkunde die Plätze und Fußgängerzonen im Zentrum.'],['Mittag','Serbische Küche','Probiere lokale Spezialitäten in einem Restaurant.'],['Nachmittag','Petrovaradin','Entdecke die Festung und den Blick auf die Donau.']],
'Belgrad':[['Vormittag','Kalemegdan','Erkunde die Festungsanlage und die Flussblicke.'],['Mittag','Serbische Spezialitäten','Entdecke regionale Küche und lokale Cafés.'],['Nachmittag','Altstadt und Flusspromenade','Passe den Spaziergang an Wetter und Energie an.']],
'Russe':[['Vormittag','Historisches Stadtzentrum','Entdecke die elegante Architektur des Zentrums und die Plätze rund um die Freiheitsstatue.'],['Mittag','Bulgarische Küche','Probiere Banitsa, Shopska-Salat oder regionale Fischgerichte.'],['Nachmittag','Donauufer und Sexaginta Prista','Genieße den Blick auf die Donau und besuche die römische Festungsanlage.']],
'Donaudelta':[['Vormittag','Bootstour mit Guide','Wähle einen seriösen lokalen Anbieter und beachte Naturschutzregeln.'],['Mittag','Regionale Küche','Entdecke lokale Fischgerichte, wenn du sie magst.'],['Nachmittag','Naturbeobachtung','Plane Zeit für Vögel und Wasserwege ein.']]
}[name];const days=duration==='1 Tag'?1:duration==='7 Tage'?7:3;const safeStops=stops||[['Vormittag','Ortszentrum entdecken',`Erkunde die wichtigsten Orte in ${name}.`],['Mittag','Regional genießen','Plane eine Pause mit regionalen Spezialitäten ein.'],['Nachmittag','Natur und Kultur','Wähle ein Erlebnis passend zu deinen Interessen.']];let out=`<div class="itinerary"><h3>Claras Vorschlag: ${name} · ${duration}</h3><p class="muted" style="margin:0">Schwerpunkt: ${interest} · Tempo: ${pace} · Mobilität: ${mobility}</p>`;for(let d=1;d<=days;d++){out+=`<div class="stop"><div class="num">${d}</div><div><h4>${days===1?'Dein Tag':`Tag ${d}`}: ${d===1?safeStops[0][1]:d===2?(safeStops[1][1]):safeStops[2][1]}</h4><p>${d===1?safeStops[0][2]:d===2?safeStops[1][2]:safeStops[2][2]}</p></div></div>`}if(mobility==='Rollator'){out+=`<div class="stop"><div class="num">i</div><div><h4>Hinweis für Gäste mit Rollator</h4><p>${claraRollatorNotice}</p></div></div>`;}out+=`<div class="stop"><div class="num">✦</div><div><h4>Claras persönlicher Tipp</h4><p>${p.desc} Öffnungszeiten, Wetter, Tickets und lokale Bedingungen bitte vor der Abreise aktuell prüfen.</p></div></div><button class="btn soft" onclick="speakClara('Willkommen in ${name}! Ich habe dir einen ${duration} langen Vorschlag mit Schwerpunkt ${interest} vorbereitet. Passe ihn jederzeit an deine Wünsche an.')">▶ Clara stellt deinen Plan vor</button></div>`;document.getElementById('planResult').innerHTML=out}

const CLARA_TRIP_STORAGE_KEY='clara.travel.savedTrips.v1';
function claraTripStorageKey(){return CLARA_TRIP_STORAGE_KEY+(claraUser?.id?'.'+claraUser.id:'.guest');}
function readClaraTripPlans(){try{const value=JSON.parse(localStorage.getItem(claraTripStorageKey())||'[]');return Array.isArray(value)?value:[];}catch(_){return [];}}
function writeClaraTripPlans(items){try{localStorage.setItem(claraTripStorageKey(),JSON.stringify(items));return true;}catch(error){console.warn('Reiseplan lokal speichern:',error);return false;}}
function currentClaraTripPlan(){
 const destination=document.getElementById('destination');
 if(!destination?.value){
  toast('Bitte wähle zuerst ein Reiseziel und erstelle einen Reiseplan.');
  return null;
 }
 // Always regenerate from the current form values. Otherwise a previously
 // rendered itinerary can remain visible after the user changes the controls.
 makePlan();
 return {
  id:'trip-'+Date.now(),
  destination:destination.value,
  duration:document.getElementById('duration').value,
  interest:document.getElementById('interest').value,
  pace:document.getElementById('pace').value,
  mobility:document.getElementById('mobility')?.value||'Keine besondere Angabe',
  savedAt:new Date().toISOString()
 };
}
async function saveClaraTripPlan(){
 const plan=currentClaraTripPlan();if(!plan)return;
 const status=document.getElementById('planSaveStatus');
 const items=readClaraTripPlans().filter(item=>!(item.destination===plan.destination&&item.duration===plan.duration));
 items.unshift(plan);const localSaved=writeClaraTripPlans(items);
 let cloudSaved=false,cloudConsent=false,cloudError=null;
 if(window.claraSupabase&&claraUser){
  try{
   const profile=await window.claraSupabase.from('clara_profiles').select('consent_memory').eq('user_id',claraUser.id).maybeSingle();
   if(profile.error)throw profile.error;
   if(profile.data?.consent_memory===true){
    cloudConsent=true;
    // Einen bereits gespeicherten Plan mit gleichem Ziel und gleicher Dauer
    // aktualisieren, statt bei jedem erneuten Speichern einen Duplikat-Eintrag anzulegen.
    const existing=await window.claraSupabase.from('clara_memories')
     .select('id,content')
     .eq('user_id',claraUser.id)
     .eq('memory_type','saved_trip_plan')
     .order('created_at',{ascending:false})
     .limit(50);
    if(existing.error)throw existing.error;
    const match=(existing.data||[]).find(row=>
     row.content&&row.content.destination===plan.destination&&row.content.duration===plan.duration
    );
    if(match){
     const result=await window.claraSupabase.from('clara_memories')
      .update({content:plan})
      .eq('id',match.id)
      .eq('user_id',claraUser.id)
      .eq('memory_type','saved_trip_plan')
      .select('id');
     if(result.error)throw result.error;
     if(!result.data?.length)throw new Error('Der vorhandene Kontoreiseplan wurde nicht aktualisiert.');
    }else{
     const result=await window.claraSupabase.from('clara_memories')
      .insert({user_id:claraUser.id,memory_type:'saved_trip_plan',content:plan});
     if(result.error)throw result.error;
    }
    cloudSaved=true;
   }
  }catch(error){cloudError=error;console.warn('Cloud-Speicherung Reiseplan:',error);}
 }
 if(status){
  if(cloudSaved)status.textContent=localSaved?'Reiseplan auf diesem Gerät und in deinem Clara-Konto gespeichert.':'Reiseplan in deinem Clara-Konto gespeichert.';
  else if(!localSaved)status.textContent='Der Reiseplan konnte nicht gespeichert werden.';
  else if(cloudError)status.textContent='Reiseplan lokal gespeichert; die Kontosynchronisierung ist fehlgeschlagen. Bitte Verbindung und Kontoberechtigung prüfen.';
  else if(!window.claraSupabase||!claraUser)status.textContent='Reiseplan lokal gespeichert. Für die Kontosynchronisierung bitte anmelden und Clara Memory freigeben.';
  else if(!cloudConsent)status.textContent='Reiseplan lokal gespeichert. Für die Kontosynchronisierung bitte Clara Memory freigeben.';
  else status.textContent='Reiseplan lokal gespeichert; die Kontosynchronisierung ist derzeit nicht verfügbar.';
 }
 await renderClaraTripPlans();
}
async function renderClaraTripPlans(){
 const select=document.getElementById('savedTripPlans');if(!select)return;
 const localItems=readClaraTripPlans();select.innerHTML='<option value="">Reiseplan auswählen …</option>';
 localItems.forEach(item=>{const option=document.createElement('option');option.value=item.id;option.textContent=item.destination+' · '+item.duration+' · '+new Date(item.savedAt).toLocaleDateString('de-DE')+' (dieses Gerät)';select.appendChild(option);});
 if(window.claraSupabase&&claraUser){
  try{
   const profile=await window.claraSupabase.from('clara_profiles').select('consent_memory').eq('user_id',claraUser.id).maybeSingle();
   if(profile.error)throw profile.error;
   if(profile.data?.consent_memory===true){
    const result=await window.claraSupabase.from('clara_memories').select('id,content,created_at').eq('user_id',claraUser.id).eq('memory_type','saved_trip_plan').order('created_at',{ascending:false}).limit(30);
    if(result.error)throw result.error;
    (result.data||[]).forEach(row=>{const plan=row.content;if(!plan||!plan.destination)return;const option=document.createElement('option');option.value='cloud:'+row.id;option.textContent=plan.destination+' · '+plan.duration+' · '+new Date(row.created_at).toLocaleDateString('de-DE')+' (Konto)';select.appendChild(option);});
   }
  }catch(error){console.warn('Gespeicherte Kontoreisen laden:',error);}
 }
}
async function loadClaraTripPlan(){
 const select=document.getElementById('savedTripPlans'),id=select?.value;if(!id){toast('Bitte wähle zuerst einen gespeicherten Reiseplan.');return;}
 let plan=readClaraTripPlans().find(item=>item.id===id);
 if(!plan&&id.startsWith('cloud:')&&window.claraSupabase&&claraUser){
  try{const result=await window.claraSupabase.from('clara_memories').select('content').eq('id',id.slice(6)).eq('user_id',claraUser.id).eq('memory_type','saved_trip_plan').maybeSingle();if(result.error)throw result.error;plan=result.data?.content;}catch(error){console.warn('Kontoreise laden:',error);}
 }
 if(!plan){toast('Dieser Reiseplan wurde nicht gefunden.');return;}
 document.getElementById('destination').value=plan.destination;document.getElementById('duration').value=plan.duration;document.getElementById('interest').value=plan.interest;document.getElementById('pace').value=plan.pace;document.getElementById('mobility').value=plan.mobility;makePlan();
 const status=document.getElementById('planSaveStatus');if(status)status.textContent='Dein gespeicherter Reiseplan wurde geladen.';
}
async function deleteClaraTripPlan(){
 const select=document.getElementById('savedTripPlans'),id=select?.value;
 if(!id){toast('Bitte wähle zuerst einen Reiseplan.');return;}
 const isCloud=id.startsWith('cloud:');
 const localPlan=readClaraTripPlans().find(item=>item.id===id);
 if(!localPlan&&!isCloud){toast('Dieser Reiseplan wurde nicht gefunden.');return;}
 const question=isCloud?'Diesen Reiseplan aus deinem Clara-Konto löschen?':'Diesen lokal gespeicherten Reiseplan löschen?';
 if(!confirm(question))return;
 const status=document.getElementById('planSaveStatus');
 if(isCloud){
  if(!window.claraSupabase||!claraUser){if(status)status.textContent='Bitte melde dich an, um den Kontoeintrag zu löschen.';return;}
  try{
   const result=await window.claraSupabase.from('clara_memories').delete().eq('id',id.slice(6)).eq('user_id',claraUser.id).eq('memory_type','saved_trip_plan').select('id');
   if(result.error)throw result.error;
   if(!result.data?.length){if(status)status.textContent='Der Kontoeintrag wurde nicht gefunden oder konnte wegen fehlender Berechtigung nicht gelöscht werden.';return;}
   if(status)status.textContent='Reiseplan aus deinem Clara-Konto gelöscht.';
  }catch(error){
   console.error('Kontoreise löschen:',error);
   if(status)status.textContent='Der Reiseplan konnte im Konto nicht gelöscht werden. Bitte prüfe deine Verbindung und Berechtigung.';
   return;
  }
 }else{
  if(!writeClaraTripPlans(readClaraTripPlans().filter(item=>item.id!==id))){if(status)status.textContent='Der lokale Reiseplan konnte nicht gelöscht werden.';return;}
  if(status)status.textContent='Reiseplan von diesem Gerät gelöscht.';
 }
 await renderClaraTripPlans();
}
function loadClaraVoices(){
  const select=document.getElementById('claraVoice');
  if(select){
    select.innerHTML='<option value="">Automatisch – folgt der App-Sprache</option>';
    select.value='';
    select.disabled=true;
    select.title='Die passende Azure-Stimme wird automatisch anhand der ausgewählten App-Sprache verwendet.';
  }
  const status=document.getElementById('voiceStatus');
  if(status){
    const lang=(()=>{try{return claraLang();}catch(_){return 'de';}})();
    const labels={de:'Deutsch',en:'Englisch',nl:'Niederländisch',fr:'Französisch',ro:'Rumänisch'};
    status.textContent='Azure-Sprachausgabe aktiv · Sprache: '+(labels[lang]||'Deutsch')+'.';
  }
}
loadClaraVoices();
function claraSpeechText(value){
  // German number words for measurements read aloud by the browser voice.
  const numberWords = input => {
    const n = Math.floor(Number(input));
    if (!Number.isFinite(n) || n < 0 || n > 999999) return String(input);
    const ones = ["null","eins","zwei","drei","vier","fünf","sechs","sieben","acht","neun"];
    const teens = ["zehn","elf","zwölf","dreizehn","vierzehn","fünfzehn","sechzehn","siebzehn","achtzehn","neunzehn"];
    const tens = ["","","zwanzig","dreißig","vierzig","fünfzig","sechzig","siebzig","achtzig","neunzig"];
    const underHundred = x => {
      if (x < 10) return ones[x];
      if (x < 20) return teens[x-10];
      const unit=x%10, decade=Math.floor(x/10);
      return (unit ? (unit===1?"ein":ones[unit])+"und" : "")+tens[decade];
    };
    const underThousand = x => {
      const hundred=Math.floor(x/100), rest=x%100;
      return (hundred ? (hundred===1?"ein":ones[hundred])+"hundert" : "")+(rest?underHundred(rest):"");
    };
    if(n===0)return "null";
    if(n===1)return "ein";
    if(n<100)return underHundred(n);
    if(n<1000)return underThousand(n);
    const thousand=Math.floor(n/1000), rest=n%1000;
    return (thousand===1?"eintausend":underThousand(thousand)+"tausend")+(rest?underThousand(rest):"");
  };
  let spoken=String(value||'')
    // Example: 2 h 30 min -> zwei Stunden und dreißig Minuten.
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:h|std\.?|stunden?)\s*(\d+(?:[.,]\d+)?)\s*(?:min\.?|minuten?)\b/gi,(_,hours,minutes)=>{
      const hourLabel=Number(hours.replace(',','.'))===1?'Stunde':'Stunden';
      const minuteLabel=Number(minutes.replace(',','.'))===1?'Minute':'Minuten';
      return hours+' '+hourLabel+' und '+minutes+' '+minuteLabel;
    })
    .replace(/(\d+)\s*[-‐‑‒–—]\s*(\d+)\s*(?:min\.?|minuten?)\b/gi,'$1 bis $2 Minuten')
    .replace(/(\d+)\s*[-‐‑‒–—]\s*(\d+)\s*(?:h|std\.?|stunden?)\b/gi,'$1 bis $2 Stunden')
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:min\.?|minuten?)\b/gi,(_,n)=>n+' '+(Number(n.replace(',','.'))===1?'Minute':'Minuten'))
    .replace(/(\d+(?:[.,]\d+)?)\s*(?:h|std\.?|stunden?)\b/gi,(_,n)=>n+' '+(Number(n.replace(',','.'))===1?'Stunde':'Stunden'));

  // Preserve comparison signs before reading measurement values aloud.
  spoken=spoken.replace(/(?:>|≥)\s*(?=\d+(?:[.,]\d+)?\s*(?:m|meter|metern)\b)/gi,'mehr als ');
  spoken=spoken.replace(/(?:<|≤)\s*(?=\d+(?:[.,]\d+)?\s*(?:m|meter|metern)\b)/gi,'weniger als ');

  // Dimensions such as 230 × 24 m: both values refer to metres.
  spoken=spoken.replace(/(\d+)\s*[×x]\s*(\d+(?:[.,]\d{1,2})?)\s*(?:m|meter|metern)\b/gi,(_,length,width)=>
    numberWords(length)+' mal '+numberWords(width.replace(',','.').split('.')[0])+
    (width.match(/[.,](\d{1,2})$/)?' Komma '+numberWords(width.match(/[.,](\d{1,2})$/)[1]):'')+' Meter'
  );
  // Two decimal places are rendered as metres and centimetres, e.g. 2,50 m.
  spoken=spoken.replace(/(\d+)[,.](\d{2})\s*(?:m|meter|metern)\b/gi,(_,metres,centimetres)=>{
    const m=Number(metres), cm=Number(centimetres);
    if(m===0&&cm===0)return 'null Meter';
    if(m===0)return numberWords(cm)+' Zentimeter';
    if(cm===0)return numberWords(m)+' '+(m===1?'Meter':'Meter');
    return numberWords(m)+' Meter und '+numberWords(cm)+' Zentimeter';
  });
  // One decimal place stays a decimal reading; whole values are spelled out too.
  spoken=spoken.replace(/(\d+)[,.](\d)\s*(?:m|meter|metern)\b/gi,(_,metres,decimal)=>
    numberWords(metres)+' Komma '+numberWords(decimal)+' Meter'
  );
  spoken=spoken.replace(/(\d+)\s*(?:m|meter|metern)\b/gi,(_,metres)=>
    numberWords(metres)+' '+(Number(metres)===1?'Meter':'Meter')
  );

  return spoken
    .replace(/\x60\x60\x60[\s\S]*?\x60\x60\x60/g,' ')
    .replace(/<[^>]*>/g,' ')
    .replace(/!?\[([^\]]+)\]\([^)]*\)/g,'$1')
    .replace(/^\s*\|?\s*:?-{3,}.*$/gm,' ')
    .replace(/\r\n?/g,'\n')
    .replace(/^\s*#{1,6}\s*/gm,'')
    .replace(/^\s*>+\s*/gm,'')
    .replace(/([.!?])\n(?=\s*(?:[-*+•▪◦‣]|\d+[.)])\s+)/g,'$1 ')
    .replace(/\n(?=\s*(?:[-*+•▪◦‣]|\d+[.)])\s+)/g,'. ')
    .replace(/([.!?])\n{2,}/g,'$1 ')
    .replace(/\n{2,}/g,'. ')
    .replace(/\n+/g,' ')
    .replace(/(^|[.!?;:]\s+)(?:[-*+•▪◦‣]|\d+[.)])\s+/g,'$1')
    .replace(/\*\*(.*?)\*\*/g,'$1')
    .replace(/__(.*?)__/g,'$1')
    .replace(/\*(.*?)\*/g,'$1')
    .replace(/_(.*?)_/g,'$1')
    .replace(/\x60([^\x60]*)\x60/g,'$1')
    .replace(/[~#*_>\x60]/g,' ')
    .replace(/[{}\[\]<>]/g,' ')
    .replace(/\s*([,;:])\s*/g,'$1 ')
    .replace(/\s+([.!?])\s*/g,'$1 ')
    .replace(/\s+/g,' ')
    .trim();
}
function getClaraSpeakingVideo(){
  const heroVideo=document.querySelector('.clara-welcome-hero video.hero-scene-video');
  const chatVideo=document.getElementById('claraChatVideo');
  const homeVideo=document.querySelector('#page-home video.clara-welcome-video');
  const isVisible=el=>!!el&&el.getClientRects().length>0&&!el.closest('.hidden');
  if(isVisible(heroVideo))return heroVideo;
  if(isVisible(chatVideo))return chatVideo;
  if(isVisible(homeVideo))return homeVideo;
  return null;
}
function setClaraSpeaking(active){
  document.querySelector('#marketing-home .clara-welcome-hero')?.classList.toggle('clara-is-speaking',active);
  // The demo avatar's mouth animation is defined on .avatar.speaking,
  // not on its surrounding .avatar-stage. Toggle both so the mouth
  // actually animates while Azure audio is playing.
  document.querySelectorAll('#page-home .avatar-stage, #page-clara .avatar-stage').forEach(el=>el.classList.toggle('speaking',active));
  document.querySelectorAll('#page-home .avatar, #page-clara .avatar').forEach(el=>el.classList.toggle('speaking',active));
}
function updateClaraVisemeMouthPosition(video){
  const frame=document.getElementById('claraVideoFrame');
  if(!video||!frame||!video.videoWidth||!video.videoHeight)return;
  const width=frame.clientWidth||300;
  const height=frame.clientHeight||320;
  const scale=Math.min(width/video.videoWidth,height/video.videoHeight);
  const renderedHeight=video.videoHeight*scale;
  const verticalOffset=(height-renderedHeight)/2;
  // The supplied landscape welcome video places the resting mouth higher
  // than the earlier portrait cut. Account for object-fit:contain letterboxing.
  const sourceMouthY=video.videoWidth>video.videoHeight?0.54:0.623;
  const top=((verticalOffset+renderedHeight*sourceMouthY)/height)*100;
  frame.style.setProperty('--clara-viseme-mouth-top',Math.max(0,Math.min(100,top)).toFixed(2)+'%');
}
function freezeClaraVideoAtNeutralFrame(video){
  if(!video)return;
  const seek=()=>{
    video.pause();
    updateClaraVisemeMouthPosition(video);
    const duration=Number(video.duration);
    const preferredFrame=video.videoWidth>video.videoHeight?4:2;
    const target=Number.isFinite(duration)&&duration>0?Math.min(preferredFrame,Math.max(0,duration-0.15)):preferredFrame;
    try{video.currentTime=target;}catch(error){console.warn('Clara-Neutralbild konnte nicht gesetzt werden:',error);}
  };
  video.pause();
  if(video.readyState>=1)seek();
  else if(video.dataset.claraNeutralSeek!=='pending'){
    video.dataset.claraNeutralSeek='pending';
    video.addEventListener('loadedmetadata',()=>{
      delete video.dataset.claraNeutralSeek;
      seek();
    },{once:true});
  }
}
function startClaraVideo(){
  // Freeze the prerecorded talking clip on a neutral face frame. The mouth
  // overlay is then driven only by Azure's real audioOffset/visemeId events.
  const video=document.getElementById('claraChatVideo');
  if(!video)return;
  video.muted=true;
  video.loop=false;
  video.controls=false;
  video.playsInline=true;
  document.getElementById('claraVideoFrame')?.classList.add('speech-active');
  freezeClaraVideoAtNeutralFrame(video);
}
function stopClaraVideo(){
  const hero=document.querySelector('.clara-welcome-hero video.hero-scene-video');
  if(hero){hero.pause();hero.muted=true;hero.controls=false;hero.loop=false;try{hero.currentTime=0;}catch(_){}}
  const home=document.querySelector('#page-home video.clara-welcome-video');
  if(home){home.pause();home.muted=false;home.controls=true;home.loop=false;try{home.currentTime=0;}catch(_){}}
  const chat=document.getElementById('claraChatVideo');
  if(chat){chat.muted=true;chat.loop=false;chat.controls=false;freezeClaraVideoAtNeutralFrame(chat);}
  document.getElementById('claraVideoFrame')?.classList.remove('speech-active');
}
let claraSpeechRun=0;
function stopClaraSpeech(){
  claraSpeechRun++;
  resetClaraViseme();
  stopClaraVideo();
  if(claraAudioSource){try{claraAudioSource.stop();}catch(_){}claraAudioSource=null;}
  if('speechSynthesis'in window)speechSynthesis.cancel();
  if(claraAudioElement){claraAudioElement.pause();claraAudioElement.currentTime=0;claraAudioElement=null;}
  if(claraAudioObjectUrl){URL.revokeObjectURL(claraAudioObjectUrl);claraAudioObjectUrl=null;}
  setClaraSpeaking(false);
}
let claraRecognition = null;
let claraListening = false;
function setClaraMicStatus(message){
  const status=document.getElementById('micStatus');
  if(status)status.textContent=message;
}
function setClaraMicButton(active){
  const button=document.getElementById('micButton');
  if(!button)return;
  button.classList.toggle('listening',active);
  button.setAttribute('aria-pressed',String(active));
  button.textContent=active?'⏹️':'🎙️';
  button.title=active?'Sprachaufnahme beenden':'Spracheingabe starten';
}
function stopClaraListening(){
  if(!claraRecognition||!claraListening)return;
  try{claraRecognition.stop();}catch(error){console.warn('Clara Mikrofon stoppen:',error);}
}
function startClaraListening(){
  const Recognition=window.SpeechRecognition||window.webkitSpeechRecognition;
  if(window.isSecureContext===false&&location.hostname!=='localhost'&&location.hostname!=='127.0.0.1'){
    setClaraMicStatus('Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.');
    return;
  }
  if(!Recognition){
    setClaraMicStatus('Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.');
    return;
  }
  if(claraListening){
    stopClaraListening();
    setClaraMicStatus('Sprachaufnahme wird beendet …');
    return;
  }
  const input=document.getElementById('chatInput');
  const recognition=new Recognition();
  claraRecognition=recognition;
  const selectedLanguage=(()=>{try{return claraLang();}catch(_){return 'de';}})();
  const recognitionLocales={de:'de-DE',en:'en-GB',nl:'nl-NL',fr:'fr-FR',ro:'ro-RO'};
  recognition.lang=recognitionLocales[selectedLanguage]||'de-DE';
  recognition.interimResults=false;
  recognition.maxAlternatives=1;
  recognition.onstart=()=>{
    if(claraRecognition!==recognition)return;
    claraListening=true;
    setClaraMicButton(true);
    setClaraMicStatus('Clara hört zu … Sprich jetzt deine Frage.');
  };
  recognition.onresult=(event)=>{
    if(claraRecognition!==recognition)return;
    const result=event.results?.[event.resultIndex]||event.results?.[0];
    const transcript=String(result?.[0]?.transcript||'').trim();
    if(!transcript){
      setClaraMicStatus('Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.');
      return;
    }
    if(input){
      input.value=transcript;
      input.focus();
    }
    setClaraMicStatus('Erkannt: „'+transcript+'“ – ich sende deine Frage an Clara.');
    if(result?.isFinal!==false)document.querySelector('.chatform')?.requestSubmit();
  };
  recognition.onerror=(event)=>{
    const messages={
      'not-allowed':'Mikrofonzugriff verweigert. Bitte erlaube den Zugriff in den Browser-Einstellungen.',
      'service-not-allowed':'Der Spracherkennungsdienst ist in diesem Browser nicht freigegeben.',
      'no-speech':'Keine Sprache erkannt. Bitte sprich etwas lauter und versuche es erneut.',
      'audio-capture':'Kein Mikrofon gefunden. Prüfe die Mikrofonverbindung.',
      'network':'Die Online-Spracherkennung ist nicht erreichbar. Prüfe deine Internetverbindung.',
      'aborted':'Sprachaufnahme abgebrochen.',
      'language-not-supported':'Die ausgewählte Sprache wird von diesem Spracherkennungsdienst nicht unterstützt. Du kannst deine Frage stattdessen eintippen.'
    };
    setClaraMicStatus(messages[event.error]||('Spracherkennung: '+String(event.error||'unbekannter Fehler')));
  };
  recognition.onend=()=>{
    if(claraRecognition!==recognition)return;
    claraListening=false;
    setClaraMicButton(false);
    const status=document.getElementById('micStatus');
    if(status&&status.textContent==='Clara hört zu … Sprich jetzt deine Frage.')status.textContent='Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.';
    claraRecognition=null;
  };
  try{
    recognition.start();
  }catch(error){
    claraListening=false;
    setClaraMicButton(false);
    claraRecognition=null;
    setClaraMicStatus('Das Mikrofon konnte nicht gestartet werden. Prüfe die Browser-Berechtigung und versuche es erneut.');
    console.warn('Clara Spracherkennung starten:',error);
  }
}

function preferredGermanVoice(voices){
  const german=(voices||[]).filter(v=>/^de(-|_)/i.test(v.lang));
  if(!german.length)return null;
  // Clara's chosen standard voice: Microsoft Seraphina Online (Natural), German (Germany).
  const seraphina=german.find(v=>/seraphina/i.test(v.name||'')&&/^de(-|_)de/i.test(v.lang));
  if(seraphina)return seraphina;
  const score=v=>{
    const n=(v.name||'').toLowerCase();
    let s=0;
    if(/online|natural|neural/.test(n))s+=100;
    if(/microsoft/.test(n))s+=25;
    if(/katja|hedda|amala|anna|marlene|vicki|sara|sarah|julia|petra|sophie|eva/.test(n))s+=20;
    if(/google/.test(n))s+=5;
    if(v.localService===false)s+=3;
    return s;
  };
  return german.slice().sort((a,b)=>score(b)-score(a))[0];
}
let claraAudioObjectUrl=null;
let claraAudioElement=null;
let claraAudioContext=null;
let claraAudioSource=null;
let claraVisemeTimers=[];
function splitClaraSpeechChunks(value){
  const clean=claraSpeechText(value);
  if(!clean)return [];
  const sentences=clean.match(/[^.!?]+[.!?]+(?:["'»”)]*)|[^.!?]+$/g)||[clean];
  const chunks=[];
  let current='';
  for(const sentence of sentences){
    const part=sentence.trim();
    if(!part)continue;
    if(current&&(current.length+part.length+1)>260){chunks.push(current);current=part;}
    else current+=(current?' ':'')+part;
  }
  if(current)chunks.push(current);
  return chunks;
}
async function fetchClaraSpeechChunk(text,language){
  const controller=new AbortController();
  const timeout=setTimeout(()=>controller.abort(),15000);
  try{
    const response=await fetch('/.netlify/functions/clara-speech',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({text,language}),
      signal:controller.signal
    });
    if(!response.ok){
      let detail={};try{detail=await response.json();}catch(_){}
      const reason=detail.error||('Sprachausgabe fehlgeschlagen ('+response.status+')');
      throw new Error(reason);
    }
    const blob=await response.blob();
    if(!blob.size)throw new Error('Azure hat eine leere Audiodatei geliefert.');
    if(!blob.type.includes('audio')&&!blob.type.includes('octet-stream'))throw new Error('Der Sprachdienst hat keine Audiodatei zurückgegeben.');
    return blob;
  }catch(error){
    if(error.name==='AbortError')throw new Error('Der Sprachdienst antwortet nicht innerhalb von 15 Sekunden.');
    throw error;
  }finally{
    clearTimeout(timeout);
  }
}
async function fetchClaraSpeechChunkWithVisemes(text,language){
  try{
    const controller=new AbortController();
    const timeout=setTimeout(()=>controller.abort(),20000);
    let response;
    try{
      response=await fetch('/.netlify/functions/clara-speech-visemes',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({text,language}),
        signal:controller.signal
      });
    }finally{clearTimeout(timeout);}
    const data=await response.json().catch(()=>({}));
    if(!response.ok)throw new Error(data.error||'Azure-Visem-Synthese nicht verfügbar ('+response.status+').');
    if(typeof data.audio!=='string'||!data.audio)throw new Error('Azure hat keine Audiodaten zurückgegeben.');
    const binary=atob(data.audio);
    const bytes=new Uint8Array(binary.length);
    for(let i=0;i<binary.length;i++)bytes[i]=binary.charCodeAt(i);
    const blob=new Blob([bytes],{type:data.contentType||'audio/wav'});
    if(!blob.size)throw new Error('Azure hat eine leere Audiodatei geliefert.');
    const visemes=Array.isArray(data.visemes)?data.visemes.filter(item=>Number.isFinite(Number(item.audioOffset))&&Number.isFinite(Number(item.visemeId))):[];
    return {blob,visemes,synchronized:visemes.length>0,voice:String(data.voice||'')};
  }catch(error){
    console.warn('Azure-Visem-Synthese nicht verfügbar; verwende den geschützten REST-Fallback:',error);
    const blob=await fetchClaraSpeechChunk(text,language);
    return {blob,visemes:[],synchronized:false,reason:error.message||'Visem-Ereignisse nicht verfügbar'};
  }
}
function clearClaraVisemeTimers(){
  claraVisemeTimers.forEach(timer=>clearTimeout(timer));
  claraVisemeTimers=[];
}
function setClaraViseme(visemeId){
  const frame=document.getElementById('claraVideoFrame');
  if(!frame)return;
  const id=Math.max(0,Math.min(21,Math.round(Number(visemeId)||0)));
  frame.dataset.viseme=String(id);
  frame.classList.add('viseme-active');
  frame.classList.remove('fallback-speaking');
}
function setClaraFallbackMouth(active){
  const frame=document.getElementById('claraVideoFrame');
  if(!frame)return;
  if(active){
    frame.dataset.viseme='1';
    frame.classList.add('fallback-speaking');
    frame.classList.remove('viseme-active');
  }else frame.classList.remove('fallback-speaking');
}
function resetClaraViseme(){
  clearClaraVisemeTimers();
  const frame=document.getElementById('claraVideoFrame');
  if(!frame)return;
  frame.dataset.viseme='0';
  frame.classList.remove('viseme-active','fallback-speaking');
}
function unlockClaraAudio(){
  try{
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(!AudioContextClass)return false;
    if(!claraAudioContext)claraAudioContext=new AudioContextClass();
    if(claraAudioContext.state==='suspended')claraAudioContext.resume().catch(error=>console.warn('Clara AudioContext konnte nicht aktiviert werden:',error));
    return true;
  }catch(error){console.warn('Clara WebAudio ist nicht verfügbar:',error);return false;}
}
function playClaraAudioBlob(blob,visemes=[]){
  return new Promise(async(resolve,reject)=>{
    let settled=false;
    const hasVisemes=Array.isArray(visemes)&&visemes.length>0;
    const finish=(error,value=false)=>{
      if(settled)return;
      settled=true;
      if(error)reject(error);else resolve(value);
    };
    const playWithHtmlAudio=async()=>{
      const url=URL.createObjectURL(blob);
      const audio=new Audio();
      claraAudioObjectUrl=url;
      claraAudioElement=audio;
      audio.preload='auto';
      audio.volume=1;
      audio.src=url;
      setClaraFallbackMouth(true);
      const cleanup=()=>{
        if(claraAudioObjectUrl===url){URL.revokeObjectURL(url);claraAudioObjectUrl=null;}
        if(claraAudioElement===audio)claraAudioElement=null;
        resetClaraViseme();
      };
      audio.onended=()=>{cleanup();finish(null,false);};
      audio.onerror=()=>{cleanup();finish(new Error('Die Audiodatei konnte auch mit dem Browser-Audioplayer nicht abgespielt werden.'));};
      try{await audio.play();}
      catch(error){cleanup();finish(new Error('Der Browser hat die Audiowiedergabe blockiert: '+(error.message||'unbekannter Fehler')));}
    };
    try{
      if(hasVisemes&&claraAudioContext&&claraAudioContext.state==='suspended'){
        try{await claraAudioContext.resume();}catch(_){}
      }
      const useVisemes=hasVisemes&&claraAudioContext&&claraAudioContext.state==='running';
      const status=document.getElementById('voiceStatus');
      if(status)status.textContent=useVisemes?'Clara spricht · Azure-Viseme zeitgestempelt':hasVisemes?'Clara spricht · Visem-Synchronisation nicht verfügbar; Fallback aktiv':'Clara spricht · Fallback ohne zeitgestempelte Viseme';
      if(claraAudioContext&&claraAudioContext.state==='running'){
        try{
          const bytes=await blob.arrayBuffer();
          const buffer=await claraAudioContext.decodeAudioData(bytes);
          const source=claraAudioContext.createBufferSource();
          source.buffer=buffer;
          source.connect(claraAudioContext.destination);
          claraAudioSource=source;
          const startAt=claraAudioContext.currentTime+0.05;
          clearClaraVisemeTimers();
          if(useVisemes){
            setClaraViseme(0);
            visemes.forEach(event=>{
              const offset=Math.max(0,Number(event.audioOffset)/10000000);
              const delay=Math.max(0,(startAt+offset-claraAudioContext.currentTime)*1000);
              claraVisemeTimers.push(setTimeout(()=>setClaraViseme(event.visemeId),delay));
            });
            const endDelay=Math.max(0,(startAt+buffer.duration-claraAudioContext.currentTime)*1000+80);
            claraVisemeTimers.push(setTimeout(resetClaraViseme,endDelay));
          }else setClaraFallbackMouth(true);
          source.onended=()=>{
            if(claraAudioSource===source)claraAudioSource=null;
            resetClaraViseme();
            finish(null,useVisemes);
          };
          source.start(startAt);
          return;
        }catch(decodeError){
          console.warn('Clara WebAudio-Decodierung fehlgeschlagen; verwende HTML-Audioplayer:',decodeError);
          resetClaraViseme();
          if(status)status.textContent='Clara spricht · WebAudio nicht verfügbar; Fallback ohne Visem-Synchronisation';
        }
      }
      await playWithHtmlAudio();
    }catch(error){
      resetClaraViseme();
      finish(new Error('Claras Audio konnte nicht abgespielt werden: '+(error.message||error)));
    }
  });
}

async function speakClara(value,force=false,speechMessage=null){
  // Resume WebAudio synchronously while the click/submit still carries user activation.
  unlockClaraAudio();
  const auto=document.getElementById('claraAutoSpeak');
  if(!force&&auto&&!auto.checked)return;
  const chunks=splitClaraSpeechChunks(value);
  if(!chunks.length)return;
  stopClaraSpeech();
  const status=document.getElementById('voiceStatus');
  const speechLanguage=(()=>{try{return claraLang();}catch(_){return 'de';}})();
  const speechVoiceLabels={de:'Seraphina',en:'Sonia',nl:'Fenna',fr:'Denise',ro:'Alina'};
  const activeVoiceLabel=speechVoiceLabels[speechLanguage]||speechVoiceLabels.de;
  const run=claraSpeechRun;
  try{
    if(status)status.textContent='Clara bereitet den ersten Satz mit der '+activeVoiceLabel+'-Stimme vor …';
    let pending=fetchClaraSpeechChunkWithVisemes(chunks[0],speechLanguage);
    for(let index=0;index<chunks.length;index++){
      const speech=await pending;
      if(run!==claraSpeechRun)return;
      if(index+1<chunks.length)pending=fetchClaraSpeechChunkWithVisemes(chunks[index+1],speechLanguage);
      if(index===0){setClaraSpeaking(true);startClaraVideo();}
      if(speechMessage)highlightClaraSpeechSegment(speechMessage,index);
      if(status)status.textContent='Clara bereitet Abschnitt '+(index+1)+' von '+chunks.length+' vor …';
      await playClaraAudioBlob(speech.blob,speech.visemes);
      if(run!==claraSpeechRun)return;
    }
    if(speechMessage)highlightClaraSpeechSegment(speechMessage,-1);
    setClaraSpeaking(false);
    stopClaraVideo();
    if(status)status.textContent='Sprachausgabe abgeschlossen.';
  }catch(error){
    console.error('Clara Azure Speech:',error);
    const langMap={de:'de-DE',en:'en-GB',nl:'nl-NL',fr:'fr-FR',ro:'ro-RO'};
    if('speechSynthesis'in window && 'SpeechSynthesisUtterance'in window){
      try{
        stopClaraSpeech();
        const utterance=new SpeechSynthesisUtterance(chunks.join(' '));
        utterance.lang=langMap[speechLanguage]||'de-DE';
        utterance.rate=0.96;utterance.pitch=1.02;
        const voices=window.speechSynthesis.getVoices();
        const match=voices.find(voice=>voice.lang.toLowerCase().startsWith(utterance.lang.slice(0,2).toLowerCase()));
        if(match)utterance.voice=match;
        utterance.onstart=()=>{setClaraSpeaking(true);setClaraFallbackMouth(true);if(status)status.textContent='Clara spricht jetzt mit der verfügbaren Browser-Stimme · ohne Azure-Viseme.';};
        utterance.onend=()=>{setClaraSpeaking(false);setClaraFallbackMouth(false);resetClaraViseme();stopClaraVideo();};
        utterance.onerror=(event)=>{
          setClaraSpeaking(false);
          setClaraFallbackMouth(false);
          resetClaraViseme();
          stopClaraVideo();
          if(status)status.textContent='Auch die Browser-Stimme konnte nicht starten ('+(event.error||'unbekannter Fehler')+'). Bitte Browser-Audio und Lautstärke prüfen.';
        };
        window.speechSynthesis.speak(utterance);
        return;
      }catch(fallbackError){console.warn('Browser-Sprachausgabe fehlgeschlagen:',fallbackError);}
    }
    if(speechMessage)highlightClaraSpeechSegment(speechMessage,-1);
    setClaraSpeaking(false);
    stopClaraVideo();
    if(status)status.textContent='Sprachausgabe nicht verfügbar: '+(error.message||'Verbindungsfehler');
  }
}
function addMsg(text,who,sources=[],research=null){
  const box=document.getElementById('chatbox');
  const el=document.createElement('div');
  el.className='msg '+(who==='user'?'user':'');
  if(who==='clara'&&el.classList.contains('clara-speech-message')){
    // Reserved for explicitly synchronized speech messages.
    el.textContent=text;
  }else{
    el.textContent=text;
  }
  if(who!=='user'&&Array.isArray(sources)&&sources.length){
    const sourceBox=document.createElement('div');
    sourceBox.style.marginTop='10px';
    sourceBox.style.paddingTop='8px';
    sourceBox.style.borderTop='1px solid var(--line)';
    const heading=document.createElement('div');
    heading.textContent='Quellen aus Claras Live-Recherche'+(research?.searchedAt?' · '+new Date(research.searchedAt).toLocaleString('de-DE'):'');
    heading.style.fontWeight='700';
    heading.style.fontSize='12px';
    heading.style.marginBottom='5px';
    sourceBox.appendChild(heading);
    sources.forEach((source,index)=>{
      try{
        const url=new URL(source.url);
        if(url.protocol!=='https:'&&url.protocol!=='http:')return;
        const line=document.createElement('div');
        line.style.margin='4px 0';
        const link=document.createElement('a');
        link.href=url.href;
        link.target='_blank';
        link.rel='noopener noreferrer';
        link.textContent='['+(index+1)+'] '+String(source.title||source.domain||url.hostname);
        link.style.color='var(--green)';
        link.style.textDecoration='underline';
        link.style.fontSize='12px';
        line.appendChild(link);
        if(source.publishedDate){
          const date=document.createElement('span');
          date.textContent=' · '+String(source.publishedDate);
          date.style.fontSize='11px';
          date.style.color='var(--muted)';
          line.appendChild(date);
        }
        sourceBox.appendChild(line);
      }catch(_){}
    });
    if(sourceBox.children.length>1)el.appendChild(sourceBox);
  }
  box.appendChild(el);
  box.scrollTop=box.scrollHeight;
  return el;
}
function renderClaraSpeechMessage(message,text){
  const chunks=splitClaraSpeechChunks(text);
  message.classList.add('clara-speech-message');
  message.replaceChildren();
  chunks.forEach((chunk,index)=>{
    if(index)message.appendChild(document.createTextNode(' '));
    const span=document.createElement('span');
    span.className='clara-speech-segment';
    span.dataset.speechIndex=String(index);
    span.textContent=chunk;
    message.appendChild(span);
  });
  return message;
}
function highlightClaraSpeechSegment(message,index){
  if(!message)return;
  message.querySelectorAll('.clara-speech-segment').forEach((segment,i)=>{
    const active=i===index;
    segment.classList.toggle('clara-speech-active',active);
    segment.style.background=active?'rgba(245,190,70,.32)':'';
    segment.style.borderRadius=active?'4px':'';
    segment.style.transition='background 120ms ease';
  });
}

const claraDestinationKnowledge={
'Linz':{focus:'Kunst, Musik, moderne Kultur und Donauufer',see:'Hauptplatz, Altstadt, Ars Electronica Center, Lentos und Pöstlingberg.',food:'Linzer Torte, Knödelgerichte und oberösterreichische Wirtshausküche.',season:'Herbstliche Kulturveranstaltungen und ab November Adventmärkte; konkrete Termine jährlich prüfen.',cruise:'Anlegestelle und Baustellenumfeld tagesaktuell prüfen; fußläufige Altstadt- und Donauuferoptionen nach Liegeplatz wählen.',source:'Linz Tourismus, Stadt Linz, Ars Electronica, Hafen-/Schifffahrtsmeldungen'},
'Passau':{focus:'Drei-Flüsse-Stadt, Altstadt und barocke Architektur',see:'Dom St. Stephan, Ortspitze, Veste Oberhaus und historische Altstadt.',food:'Niederbayerische Wirtshausküche und regionale Süßspeisen.',season:'Stadtführungen, Kulturprogramm und saisonale Märkte aktuell prüfen.',cruise:'Liegeplatz entscheidet über Fußweg in die Altstadt; Rückkehrzeit großzügig planen.',source:'Tourismus Passau, Stadt Passau, Dom St. Stephan'},
'Melk':{focus:'Stift, Barock, Kultur und Wachau',see:'Stift Melk, Altstadt, Donauufer und Wachauer Landschaft.',food:'Wachauer Marille, regionale Küche, Weine und saisonale Produkte.',season:'Stiftsöffnungszeiten und Führungszeiten ändern sich saisonal; immer die offizielle Stiftsseite prüfen.',cruise:'Anlegestelle am Donauufer; Fußweg in die Altstadt und der Anstieg zum Stift hängen vom Liegeplatz und Mobilitätsbedarf ab.',source:'Stift Melk, Stadt Melk, Donau Niederösterreich, Hafen-/Schifffahrtsmeldungen'},
'Weißenkirchen':{focus:'Wachauer Weinort, Weinberge und historische Ortsmitte',see:'Pfarrkirche, Teisenhoferhof, Weinbergwege und Donauufer.',food:'Grüner Veltliner, Riesling, Wachauer Marille und Heurigenküche.',season:'Heurigenkalender, Weinverkostungen und Adventmarkt nur mit aktuellen Gastgeber-/Gemeindeangaben nennen.',cruise:'Fußläufige Ortsbesichtigung und Wein-Erlebnisse nur passend zur Liegezeit; Verkostungen nicht ohne Rückkehrplanung empfehlen.',source:'Wachau-Nibelungengau-Kremstal Tourismus, Marktgemeinde Weißenkirchen, Weingüter'},
'Wien':{focus:'Kaiserliche Geschichte, Museen, Musik und Kaffeehauskultur',see:'Stephansdom, Hofburg, Ringstraße, Schloss Schönbrunn und Museen.',food:'Wiener Schnitzel, Tafelspitz, Gulasch, Sachertorte und Kaffeehausklassiker.',season:'Ausstellungen, Konzertprogramm und Weihnachtsmärkte mit offiziellen Terminen prüfen.',cruise:'Anlegestelle/Schiffsstation und Transfer in die Innenstadt exakt prüfen; nicht jede Station liegt direkt im Zentrum.',source:'WienTourismus, Stadt Wien, Wiener Linien, DDSG Blue Danube und Hafeninformationen'},
'Bratislava':{focus:'Historische Altstadt, Burg und Donaulandschaft',see:'Burg Bratislava, Altstadt, Martinsdom und Donaupromenade.',food:'Bryndzové halušky, Kapustnica, Langoš und lokale Weine.',season:'Alte Markthalle, Wein- und Jungweinfeste sowie Weihnachtsmärkte mit Veranstalterterminen prüfen.',cruise:'Altstadt ist von zentralen Anlegestellen häufig zu Fuß erreichbar; genaue Anlegestelle und Baustellen prüfen.',source:'Visit Bratislava, Stadt Bratislava, Alte Markthalle, Veranstalter'},
'Esztergom':{focus:'Basilika, Burgviertel und das ungarische Donauknie',see:'Basilika von Esztergom, Burgmuseum, Maria-Valeria-Brücke und Aussichtspunkte über die Donau.',food:'Ungarische Hausmannskost, Fischsuppe und regionale Mehlspeisen.',season:'Besichtigungszeiten der Basilika und Sonderausstellungen vor dem Besuch auf offiziellen Seiten prüfen.',cruise:'Liegeplatz und Steigung zur Basilika beachten; den Fußweg und die Rückkehrzeit an die tatsächliche Liegezeit anpassen.',source:'Visit Esztergom, Basilika von Esztergom, Stadt Esztergom und offizielle Besucherinformationen'},
'Budapest':{focus:'Donaupanorama, Architektur, Thermen und Kulinarik',see:'Parlament, Burgviertel, Fischerbastei, Kettenbrücke und Thermalbäder.',food:'Gulyás, Lángos, Paprikás csirke und ungarische Mehlspeisen.',season:'Kulturprogramm, Märkte und Thermenöffnungszeiten über offizielle Betreiber prüfen.',cruise:'Liegeplatz auf Buda- oder Pester Seite beachten; Distanzen zum Zentrum und Transfers nicht pauschal annehmen.',excursion:'Das Donauknie (Dunakanyar) ist eine eigene Ausflugsregion nördlich von Budapest. Sehenswert sind Szentendre mit seiner Künstler- und Altstadt, Visegrád mit der Burganlage und Esztergom mit seiner Basilika. Bitte nicht mit dem Budapester Stadtgebiet verwechseln; aktuelle Verbindungen, Zeiten und Besuchsmöglichkeiten müssen separat geprüft werden.',source:'Visit Hungary, Budapestinfo, BKK, Betreiber der Sehenswürdigkeiten'},
'Puszta':{focus:'Ungarische Tiefebene, Reitkultur, Weite und Vogelwelt',see:'Hortobágy-Nationalpark, traditionelle Gehöfte, Fischteiche und Naturbeobachtung.',food:'Ungarische Hausmannskost, Gulasch, Pörkölt und regionale Produkte.',season:'Kranichzug im Herbst; Tageszählungen und Führungen nur mit aktuellen Nationalparkdaten belegen.',cruise:'Meist organisierter Landausflug mit Transfer erforderlich; Fahrzeit, Anbieter und Rückkehr zum Schiff bestätigen.',source:'Hortobágyi Nemzeti Park, Visit Hungary, lokale Veranstalter'},
'Novi Sad':{focus:'Kulturstadt, Petrovaradin und Vojvodina-Kulinarik',see:'Petrovaradin-Festung, Altstadt, Donauufer und Stadtplätze.',food:'Fischsuppe, Ćevapi, Gibanica und Spezialitäten der Vojvodina.',season:'Night Market, regionale Märkte und Festivals über die Tourismusorganisation bestätigen.',cruise:'Von zentralen Liegestellen kann die Innenstadt erreichbar sein; Festung mit Steigung und zusätzlicher Zeit kalkulieren.',source:'Tourism Organization of Novi Sad, Stadt Novi Sad, Veranstalter'},
'Belgrad':{focus:'Geschichte, Musik, urbane Kultur und Zusammenfluss von Save und Donau',see:'Kalemegdan, Festung, Knez Mihailova und Flusspromenaden.',food:'Ćevapi, Pljeskavica, Sarma und serbische Hausmannskost.',season:'Konzerte und Kulturveranstaltungen mit Veranstalter- und Ticketquelle prüfen.',cruise:'Liegeplatz und Distanz zur Festung prüfen; Wege können Steigungen und Kopfsteinpflaster enthalten.',source:'Tourist Organization of Belgrade, Stadt Belgrad, Veranstalter'},
'Russe':{focus:'Bulgarische Donau-Stadt mit Architektur, Geschichte und Flusshafen',see:'Donaupromenade, Freiheitsplatz, Regionales Historisches Museum und römische Festung Sexaginta Prista.',food:'Banitsa, Shopska-Salat, Tarator und regionale Fischgerichte.',season:'Kulturprogramm und Veranstaltungen über die Gemeinde und das Tourismus-Informationszentrum prüfen.',cruise:'Russe ist ein bedeutender bulgarischer Donauhafen. Die tatsächliche Anlegestelle und der Fußweg zum Zentrum hängen vom Liegeplatz ab.',source:'Gemeinde Russe, bulgarisches Tourismusministerium, Donaukommission – Hafeninformationen'},
'Donaudelta':{focus:'Biosphärenreservat, Kanäle, Vogelwelt und Naturtourismus',see:'Bootstouren mit zugelassenen lokalen Guides, Lagunen, Schilfgebiete und Vogelbeobachtung.',food:'Regionale Fischgerichte und lokale Küche.',season:'Wasserstände, Schutzgebietsregeln, Genehmigungen und saisonale Naturbeobachtung prüfen.',cruise:'Bootsausflüge sind abhängig von Wasserstand, Wetter, Schutzgebietsregeln und lokalen Genehmigungen; keine pauschale Befahrbarkeit versprechen.',source:'ARBDD, Danube FIS, Romanian Waters, lokale zugelassene Anbieter'}
};
const claraRollatorNotice='Zu Wegen mit Rollator möchte ich nichts vermuten. Ich kann die konkrete Strecke in dieser Version noch nicht zuverlässig anhand aktueller Quellen prüfen. Deshalb gebe ich keine Eignungsaussage ab.';
function renderClaraIntelligence(){const host=document.getElementById('intelligenceDestinations');if(!host)return;const orderedNames=places.map(p=>p.name).filter(name=>claraDestinationKnowledge[name]);host.innerHTML=orderedNames.map(name=>[name,claraDestinationKnowledge[name]]).map(([name,d])=>`<article class="panel"><span class="tag">${name}</span><h3>${d.focus}</h3><p><b>Entdecken:</b> ${d.see}</p><p><b>Probieren:</b> ${d.food}</p><p><b>Saison:</b> ${d.season}</p><p><b>Flusskreuzfahrt:</b> ${d.cruise}</p><p><b>Hinweis für Rollator-Gäste:</b> ${claraRollatorNotice}</p><p class="muted" style="font-size:11px"><b>Vorrangige Quellen:</b> ${d.source}</p><button class="btn soft" onclick="quickAsk('Was empfiehlst du mir in ${name}?')">Clara zu ${name} fragen</button></article>`).join('')}
function answerFor(q){
  const s=String(q||'').toLowerCase();
  const wantsRollator=/rollator|gehwagen|gehstock|gehstütze|gehstuetze|rollatornutz|gehilfe/.test(s);
  if(wantsRollator){
    return claraRollatorNotice;
  }
  for(const [name,d] of Object.entries(claraDestinationKnowledge)){
    if(s.includes(name.toLowerCase())||(name==='Weißenkirchen'&&s.includes('weissenkirchen'))){
      return `Für ${name} habe ich einen gespeicherten redaktionellen Überblick: ${d.focus}. Zu den bekannten Sehenswürdigkeiten zählen: ${d.see} Regionale Spezialitäten: ${d.food} ${d.season} Hinweis für Flusskreuzfahrtgäste: ${d.cruise} ${d.excursion ? 'Als Ausflug in der Umgebung: '+d.excursion+' ' : ''}Dieser Überblick ist nicht live geprüft. Aktuelle Öffnungszeiten, Eintrittspreise, Veranstaltungstermine, Verkehrslage und Anlegestellen kann ich mit dieser lokalen Antwort nicht bestätigen. Mögliche offizielle Anlaufstellen für eine spätere Prüfung: ${d.source}. Diese Quellen wurden in dieser Antwort nicht live abgerufen.`;
    }
  }
  if(/heurig|wein|weingut/.test(s))return 'Für Wein und Heurige ist besonders die Wachau mit Weißenkirchen und den umliegenden Weinorten interessant. Ich berücksichtige Grüner Veltliner, Riesling, regionale Heurigenküche und veröffentlichte Aussteckzeiten. Konkrete Öffnungstermine müssen aktuell beim Betrieb bestätigt werden.';
  if(/schiff|kreuzfahrt|anleg|niedrigwasser|fahrwasser|pegel/.test(s))return 'Im Flusskreuzfahrt-Modus prüfe ich zuerst die konkrete Anlegestelle, Liegezeit, Fußwege, Steigungen, Transfers und Rückkehrzeit. Niedrigwasser, Baggerarbeiten und Sperrungen übernehme ich nur aus aktuellen Meldungen der zuständigen Schifffahrtsbehörden. Ich erteile keine nautische Freigabe; maßgeblich bleiben Schiffsführung und Behörden.';
  if(/veranstalt|markt|festival|advent/.test(s))return 'Ich ordne Veranstaltungen nach Ort und Reisedatum. Eine Veranstaltung nenne ich nur mit Veranstalter- oder offizieller Tourismusquelle, konkretem Datum und geprüftem Aktualitätsstand. Sag mir bitte, welche Donau-Stadt dich interessiert.';
  if(/aktuell|heute|neuigkeit|update|wetter/.test(s))return 'Für aktuelle Meldungen brauche ich eine frische Quellenprüfung. Mein gespeichertes Ortswissen enthält Sehenswürdigkeiten, regionale Küche und saisonale Schwerpunkte; Wetter, Öffnungszeiten, Verkehr und Schifffahrt markiere ich erst nach erneuter Prüfung als aktuell.';
  return 'Ich kann dir zu den Donau-Reisezielen, Sehenswürdigkeiten, regionaler Küche, Saison und Flusskreuzfahrt-Ausflügen helfen. Nenne mir einen Ort oder öffne „Donau-Wissen“ für Claras gesamten Reiseüberblick.';
}
async function getClaraMemoryContext(){if(!window.claraSupabase||!claraUser)return null;let profile=null,memories=[];try{const p=await window.claraSupabase.from('clara_profiles').select('display_name,interests,travel_pace,budget_level,preferences,consent_memory').eq('user_id',claraUser.id).maybeSingle();if(p.error)throw p.error;profile=p.data;if(!profile||profile.consent_memory!==true)return {profile:null,memories:[],consent:false};const m=await window.claraSupabase.from('clara_memories').select('memory_type,content,created_at').eq('user_id',claraUser.id).order('created_at',{ascending:false}).limit(30);if(m.error)throw m.error;memories=m.data||[];return {profile,memories,consent:true};}catch(e){console.warn('Memory-Abruf:',e);return null}}
function memoryAnswer(ctx){if(!ctx)return 'Ich kann dein persönliches Clara-Gedächtnis gerade nicht abrufen. Bitte prüfe im Bereich „Mein Clara-Gedächtnis“, ob du angemeldet bist.';if(ctx.consent===false)return 'Dein Clara-Gedächtnis ist derzeit nicht zur persönlichen Nutzung freigegeben. Du kannst die Zustimmung im Bereich „Mein Clara-Gedächtnis“ selbst aktivieren.';const p=ctx.profile||{};const facts=[];if(p.display_name)facts.push(`Name: ${p.display_name}`);if(Array.isArray(p.interests)&&p.interests.length)facts.push(`Interessen: ${p.interests.join(', ')}`);if(p.travel_pace)facts.push(`Reisetempo: ${p.travel_pace}`);if(p.budget_level)facts.push(`Budget: ${p.budget_level}`);for(const m of ctx.memories||[]){const c=m.content;if(c&&typeof c==='object'){if(c.interests?.length&&!facts.some(x=>x.startsWith('Interessen:')))facts.push(`Interessen: ${c.interests.join(', ')}`);if(c.budget_level&&!facts.some(x=>x.startsWith('Budget:')))facts.push(`Budget: ${c.budget_level}`);if(c.display_name&&!facts.some(x=>x.startsWith('Name:')))facts.push(`Name: ${c.display_name}`);if(c.favorite_destination)facts.push(`Lieblingsreiseziel: ${c.favorite_destination}`);}}return facts.length?'Das habe ich in deinem persönlichen Clara-Gedächtnis gefunden: '+facts.join(' · ')+'.':'Ich bin angemeldet, finde aber noch kein gespeichertes Reiseprofil. Bitte prüfe deine Angaben unter „Mein Clara-Gedächtnis“. '}
async function createInfluencerContent(){
  const platform=document.getElementById('creatorPlatform').value;
  const format=document.getElementById('creatorFormat').value;
  const language=document.getElementById('creatorLanguage').value;
  const topic=document.getElementById('creatorTopic').value.trim();
  const brief=document.getElementById('creatorBrief').value.trim();
  const status=document.getElementById('creatorStatus');
  const result=document.getElementById('creatorResult');
  if(!topic){toast('Bitte gib zuerst ein Reiseziel oder Thema ein.');return;}
  status.textContent='Clara entwickelt deinen Content …';
  result.classList.add('hidden');
  try{
    const CLARA_VOICE_PROFILE = Object.freeze({name:'Microsoft Seraphina Online (Natural)',language:'de',locale:'de-DE'});
    const voiceLock='\n\nVERBINDLICHES SPRECHERPROFIL – CLARA VOICE LOCK:\nClaras bevorzugte deutsche Frauenstimme ist Microsoft Seraphina Online (Natural), Deutsch (Deutschland, de-DE). Verwende diese Stimme nur, wenn sie auf der gewählten Plattform tatsächlich verfügbar ist. Keine veraltete HeyGen-Stimme „Gentle Greta“ und keine alte Voice-ID verwenden. Falls Seraphina nicht verfügbar ist, nenne die Einschränkung offen und erfinde weder eine Voice-ID noch eine erfolgreiche Sprachproduktion.';
    const identityLock='\n\nVERBINDLICHE VISUELLE IDENTITÄT – CLARA IDENTITY LOCK:\nClara ist in jeder Szene dieselbe virtuelle Frau. Verwende für alle Bildideen und Bildprompts dieselbe erwachsene Frau mit dem bereits festgelegten Erscheinungsbild: etwa 35 Jahre, braune Augen, lange dunkelbraune wellige Haare und ein freundlicher, natürlicher Gesichtsausdruck. Gesichtszüge, Augen, Haarfarbe, Haarlänge und Frisur dürfen zwischen Szenen niemals wechseln. Erzeuge keine zweite Person, keine neue Interpretation und keine wechselnden Gesichter. Variieren dürfen ausschließlich Kleidung passend zum Reiseziel, Pose, Kameraperspektive, Licht und Hintergrund. Sobald das Master-Porträt als Referenz bereitgestellt ist, muss es bei jeder einzelnen Szene als feste Identitätsreferenz verwendet werden; bis dahin die Bildprompts ausdrücklich als vorläufig markieren und keine angebliche Referenznutzung behaupten.\nFür jedes Reel: gib je Szene eine konkrete Bildidee plus einen Bildprompt aus, der ausdrücklich dieselbe Clara wie in der Master-Referenz verlangt. Füge am Ende eine kurze Kontinuitätsprüfung hinzu: Gesicht, Augen und Haare in allen Szenen identisch?';
    const message='Du bist Clara von Donau, eine sympathische virtuelle Reise- und Kulinarik-Influencerin mit eigener, warmer und authentischer Persönlichkeit. Erstelle einen veröffentlichungsfertigen Social-Media-Entwurf. Plattform: '+platform+'. Format: '+format+'. Sprache: '+language+'. Thema: '+topic+'. Zusatzwünsche: '+(brief||'keine')+'. Bei einem Reel liefere Hook, Szenenfolge mit Bildideen und Zeitangaben, pro Szene einen konkreten Bildprompt, gesprochenen Voice-over-Text, Texteinblendungen, Caption, passende Hashtags und einen Community-Aufruf. Bei Storys liefere vier einzelne Slides mit Bildidee und Text. Bei Beiträgen liefere Caption, Bildidee und Hashtags. Schreibe lebendig, nicht aufdringlich werblich und in Claras Ich-Stimme. Erfinde keine aktuellen Öffnungszeiten, Preise, Veranstaltungen oder persönlichen Erlebnisse. Kennzeichne Fakten, die vor Veröffentlichung geprüft werden müssen.'+voiceLock+identityLock;
    const response=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:(claraLang())})});
    let data={};
    try{data=await response.json()}catch(_){throw new Error('Ungültige Serverantwort.')}
    if(!response.ok)throw new Error(data.error||('Backend-Fehler '+response.status));
    const text=String(data.reply||data.response||'').trim();
    if(!text)throw new Error('Clara hat keinen Entwurf geliefert.');
    result.textContent=text;
    result.classList.remove('hidden');
    status.textContent='Textentwurf erstellt. Die feste Bildreferenz wird nach dem Upload des Master-Porträts ergänzt. Fakten und Bildrechte vor Veröffentlichung prüfen.';
  }catch(err){
    console.error('Clara Creator Studio:',err);
    status.textContent='Der Entwurf konnte nicht erstellt werden: '+(err.message||'Verbindungsfehler');
  }
}
function claraChatText(key){const lang=(()=>{try{return claraLang();}catch(_){return 'de';}})();return CLARA_CHAT_I18N[lang]?.[key]||key;}
async function sendChat(e){
  e.preventDefault();
  // Preserve the browser's user-activation window while the chat request is in flight.
  unlockClaraAudio();
  const input=document.getElementById('chatInput');
  const q=input.value.trim();
  if(!q)return;
  addMsg(q,'user');
  input.value='';
  const asksMemory=/\b(was weißt du|was weisst du|was erinnerst du|mein(e|en)? (interessen|budget|profil|lieblingsziel)|gedächtnis|gedaechtnis|erinnerst du dich)\b/i.test(q);
  let a='';
  let sources=[];
  let research=null;
  if(asksMemory){
    addMsg(claraChatText('Ich prüfe deine freigegebenen persönlichen Angaben …'),'clara');
    const ctx=await getClaraMemoryContext();
    const box=document.getElementById('chatbox');
    if(box.lastChild?.textContent===claraChatText('Ich prüfe deine freigegebenen persönlichen Angaben …'))box.removeChild(box.lastChild);
    a=memoryAnswer(ctx);
  }else{
    try{
      const requestHeaders={'Content-Type':'application/json'};
      // Forward the signed-in user's access token so the backend can load
      // consented Clara Memory data under the user's own Supabase identity.
      try{
        if(window.claraSupabase?.auth?.getSession){
          const sessionResult=await window.claraSupabase.auth.getSession();
          const accessToken=sessionResult?.data?.session?.access_token;
          if(accessToken)requestHeaders.Authorization='Bearer '+accessToken;
        }
      }catch(authError){console.warn('Clara Memory-Sitzung konnte nicht gelesen werden:',authError);}
      const response=await fetch('/.netlify/functions/chat',{
        method:'POST',
        headers:requestHeaders,
        body:JSON.stringify({message:q,language:(claraLang())})
      });
      let data={};
      try{data=await response.json();}catch(_){throw new Error(claraChatText('Das Backend hat keine gültige Antwort geliefert.'));}
      if(!response.ok)throw new Error(data.error||('Backend-Fehler '+response.status));
      a=String(data.reply||data.response||'').trim();
      sources=Array.isArray(data.sources)?data.sources:[];
      research=data.research||null;
      if(!a)throw new Error(claraChatText('Clara hat eine leere Antwort erhalten.'));
    }catch(err){
      console.error('Clara KI-Verbindung:',err);
      a=claraChatText('Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.');
    }
  }
  const speechMessage=renderClaraSpeechMessage(addMsg(a,'clara',sources,research),a);
  speakClara(a,false,speechMessage);
}
function quickAsk(q){showPage('clara');document.getElementById('chatInput').value=q;document.querySelector('.chatform').requestSubmit()}
let toastTimer;function toast(s){let el=document.getElementById('toast');el.textContent=s;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),2800)}

// Clara Memory 1.0 – Supabase integration. Uses only the public anon/publishable key with RLS.
window.claraSupabase = window.claraSupabase || null;
let claraRecoveryTokenHash = null;
let claraRecoveryCode = null;
// Public browser configuration only. Never place a Supabase Secret/service_role key here.
function memoryStatus(id,msg,isError=false){const el=document.getElementById(id);if(el){el.textContent=msg;el.style.color=isError?'#a33':'var(--muted)';}}
function connectSupabase(){
  const url=document.getElementById('sbUrl').value.trim();
  const key=document.getElementById('sbKey').value.trim();
  if(!url || !key){memoryStatus('sbStatus','Bitte Projekt-URL und öffentlichen Key eintragen.',true);return;}
  if(!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(url)){memoryStatus('sbStatus','Die Projekt-URL sieht nicht korrekt aus. Erwartet wird https://….supabase.co',true);return;}
  if(!window.supabase || !window.supabase.createClient){memoryStatus('sbStatus','Supabase-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.',true);return;}
  try{
    localStorage.setItem(window.CLARA_CONFIG_KEY,JSON.stringify({url,key}));
    window.claraSupabase=window.supabase.createClient(url,key);
    window.claraSupabase.auth.onAuthStateChange((event,session)=>{
      if(event==='PASSWORD_RECOVERY'){
        document.getElementById('passwordRecoveryPanel')?.classList.remove('hidden');
        memoryStatus('passwordRecoveryStatus','Wiederherstellung bestätigt. Bitte gib dein neues Passwort zweimal ein.');
      }
    });
    window.claraSupabase.auth.getSession().then(async({data,error})=>{
      if(error) throw error;
      claraUser=data.session?.user||null;
      memoryStatus('sbStatus','Supabase ist verbunden. '+(claraUser?'Du bist angemeldet.':'Bitte melde dich an.'),false);
      memoryStatus('authStatus',claraUser?'Angemeldet als '+claraUser.email:'Nicht angemeldet.');
      await detectClaraRecovery();
      if(claraUser)await loadClaraProfile();
      await renderClaraTripPlans();
    }).catch(e=>memoryStatus('sbStatus','Verbindung fehlgeschlagen: '+e.message,true));
  }catch(e){memoryStatus('sbStatus','Verbindung fehlgeschlagen: '+e.message,true);}
}
function restoreClaraConnection(){
  try{
    const saved=JSON.parse(localStorage.getItem(window.CLARA_CONFIG_KEY)||'null');
    const url=saved?.url||CLARA_DEFAULT_SUPABASE_URL;
    const key=saved?.key||CLARA_DEFAULT_SUPABASE_PUBLISHABLE_KEY;
    document.getElementById('sbUrl').value=url;
    document.getElementById('sbKey').value=key;
    if(url&&key) connectSupabase();
  }catch(e){memoryStatus('sbStatus','Verbindung konnte nicht vorbereitet werden: '+e.message,true);}
}
function toggleClaraPasswordVisibility(){const input=document.getElementById('authPassword'),button=document.getElementById('toggleAuthPassword');if(!input||!button)return;const show=input.type==='password';input.type=show?'text':'password';button.textContent=show?'🙈 Verbergen':'👁 Anzeigen';button.setAttribute('aria-label',show?'Passwort verbergen':'Passwort anzeigen');button.setAttribute('aria-pressed',String(show));}
async function detectClaraRecovery(){
  const search=new URLSearchParams(window.location.search),hash=new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const tokenHash=search.get('token_hash'),code=search.get('code');
  const isRecovery=search.get('type')==='recovery'||hash.get('type')==='recovery'||!!tokenHash||!!code;
  if(!isRecovery)return;
  document.getElementById('passwordRecoveryPanel')?.classList.remove('hidden');
  if(tokenHash){
    claraRecoveryTokenHash=tokenHash;
    memoryStatus('passwordRecoveryStatus','Wiederherstellungslink erkannt. Bitte gib dein neues Passwort zweimal ein.');
    return;
  }
  if(code && code!==claraRecoveryCode){
    claraRecoveryCode=code;
    memoryStatus('passwordRecoveryStatus','Wiederherstellungslink wird geprüft …');
    const {error}=await window.claraSupabase.auth.exchangeCodeForSession(code);
    if(error){
      memoryStatus('passwordRecoveryStatus','Der Wiederherstellungslink konnte nicht bestätigt werden. Bitte fordere eine neue E-Mail an.',true);
      return;
    }
    try{history.replaceState(null,document.title,window.location.pathname);}catch(_){}
    memoryStatus('passwordRecoveryStatus','Wiederherstellung bestätigt. Bitte gib dein neues Passwort zweimal ein.');
    return;
  }
  memoryStatus('passwordRecoveryStatus','Wiederherstellungsprozess erkannt. Bitte gib dein neues Passwort zweimal ein.');
}
async function signInClara(){if(!window.claraSupabase){memoryStatus('authStatus','Bitte zuerst Supabase verbinden.',true);return;}const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||!password){memoryStatus('authStatus','Bitte E-Mail und Passwort eingeben.',true);return;}const {data,error}=await window.claraSupabase.auth.signInWithPassword({email,password});if(error){memoryStatus('authStatus',error.message,true);return;}claraUser=data.user;memoryStatus('authStatus','Angemeldet als '+claraUser.email);await loadClaraProfile();await renderClaraTripPlans();}
async function requestClaraPasswordReset(){if(!window.claraSupabase){memoryStatus('authStatus','Bitte zuerst Supabase verbinden.',true);return;}const email=document.getElementById('authEmail').value.trim();if(!email){memoryStatus('authStatus','Bitte trage zuerst deine E-Mail-Adresse ein.',true);return;}const redirectTo=window.location.origin+window.location.pathname;const {error}=await window.claraSupabase.auth.resetPasswordForEmail(email,{redirectTo});if(error){memoryStatus('authStatus','Die Passwort-Wiederherstellung konnte nicht gestartet werden: '+error.message,true);return;}document.getElementById('passwordRecoveryPanel').classList.remove('hidden');memoryStatus('authStatus','Die Wiederherstellungs-E-Mail wurde angefordert. Bitte prüfe deinen Posteingang und Spam-Ordner.');memoryStatus('passwordRecoveryStatus','Öffne den speziellen Clara-Link in der E-Mail oder gib den Code ein, falls deine E-Mail einen solchen enthält.');}
async function saveClaraNewPassword(){if(!window.claraSupabase){memoryStatus('passwordRecoveryStatus','Supabase ist noch nicht verbunden. Bitte Seite neu laden.',true);return;}const password=document.getElementById('recoveryPassword').value,confirmPassword=document.getElementById('recoveryPasswordConfirm').value;if(password.length<8){memoryStatus('passwordRecoveryStatus','Bitte verwende mindestens 8 Zeichen.',true);return;}if(password!==confirmPassword){memoryStatus('passwordRecoveryStatus','Die beiden Passwörter stimmen nicht überein.',true);return;}let verifiedUser=null;if(claraRecoveryTokenHash){const {data,error}=await window.claraSupabase.auth.verifyOtp({token_hash:claraRecoveryTokenHash,type:'recovery'});if(error){memoryStatus('passwordRecoveryStatus','Der Wiederherstellungslink ist ungültig oder abgelaufen. Bitte fordere eine neue E-Mail an.',true);return;}verifiedUser=data.user||null;}else{const code=document.getElementById('recoveryToken').value.trim(),email=document.getElementById('authEmail').value.trim();if(code){if(!email){memoryStatus('passwordRecoveryStatus','Bitte trage auch deine E-Mail-Adresse ein.',true);return;}const {data,error}=await window.claraSupabase.auth.verifyOtp({email,token:code,type:'recovery'});if(error){memoryStatus('passwordRecoveryStatus','Der Sicherheitscode ist ungültig oder abgelaufen. Bitte fordere einen neuen an.',true);return;}verifiedUser=data.user||null;}else{const {data,error}=await window.claraSupabase.auth.getSession();if(error||!data.session||!data.session.user){memoryStatus('passwordRecoveryStatus','Bitte öffne den persönlichen Clara-Link aus der E-Mail oder gib den Sicherheitscode ein.',true);return;}verifiedUser=data.session.user;}}
const {data,error}=await window.claraSupabase.auth.updateUser({password});if(error){memoryStatus('passwordRecoveryStatus','Das Passwort konnte nicht geändert werden: '+error.message,true);return;}claraUser=data.user||verifiedUser;document.getElementById('recoveryPassword').value='';document.getElementById('recoveryPasswordConfirm').value='';document.getElementById('recoveryToken').value='';document.getElementById('passwordRecoveryPanel').classList.add('hidden');claraRecoveryTokenHash=null;try{history.replaceState(null,document.title,window.location.pathname);}catch(_){}memoryStatus('authStatus','Dein Passwort wurde erfolgreich geändert. Du bist jetzt angemeldet.');await loadClaraProfile();}
async function signUpClara(){if(!window.claraSupabase){memoryStatus('authStatus','Bitte zuerst Supabase verbinden.',true);return;}const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||password.length<6){memoryStatus('authStatus','Bitte E-Mail und ein Passwort mit mindestens 6 Zeichen eingeben.',true);return;}const {data,error}=await window.claraSupabase.auth.signUp({email,password});if(error){memoryStatus('authStatus',error.message,true);return;}if(data.session){claraUser=data.user;memoryStatus('authStatus','Konto erstellt und angemeldet.');await loadClaraProfile();}else{memoryStatus('authStatus','Konto erstellt. Bitte bestätige zuerst die E-Mail, falls Supabase eine Bestätigung verlangt.');}await renderClaraTripPlans();}
async function signOutClara(){if(window.claraSupabase)await window.claraSupabase.auth.signOut();claraUser=null;await renderClaraTripPlans();memoryStatus('authStatus','Abgemeldet.');memoryStatus('memoryStatus','Nicht angemeldet – deine Daten wurden nicht verändert.');}
async function saveClaraProfile(){
  if(!window.claraSupabase||!claraUser){memoryStatus('memoryStatus','Bitte zuerst Supabase verbinden und anmelden.',true);return;}
  const consent=document.getElementById('memoryConsent').checked;
  const updatedAt=new Date().toISOString();

  // The checkbox is an explicit consent boundary: without consent, persist
  // only the withdrawal state. Do not write new personal preference fields.
  if(!consent){
    const existing=await window.claraSupabase.from('clara_profiles').select('user_id')
      .eq('user_id',claraUser.id).maybeSingle();
    if(existing.error){memoryStatus('memoryStatus','Die Zustimmung konnte nicht aktualisiert werden: '+existing.error.message,true);return;}
    const result=existing.data?.user_id
      ? await window.claraSupabase.from('clara_profiles').update({consent_memory:false,updated_at:updatedAt}).eq('user_id',claraUser.id)
      : await window.claraSupabase.from('clara_profiles').insert({user_id:claraUser.id,consent_memory:false,updated_at:updatedAt});
    if(result.error){memoryStatus('memoryStatus','Die Zustimmung konnte nicht gespeichert werden: '+result.error.message,true);return;}
    memoryStatus('memoryStatus','Deine Memory-Zustimmung ist deaktiviert. Neue Reisevorlieben werden nicht gespeichert oder für persönliche Empfehlungen geladen. Bereits gespeicherte Angaben bleiben bis zur Nutzung der Löschfunktion in deinem Konto.');
    await renderClaraTripPlans();
    return;
  }

  const payload={user_id:claraUser.id,display_name:document.getElementById('memoryName').value.trim(),interests:document.getElementById('memoryInterests').value.split(',').map(x=>x.trim()).filter(Boolean),travel_pace:document.getElementById('memoryPace').value,budget_level:document.getElementById('memoryBudget').value,preferences:{source:'Clara Travel AI MVP 0.2'},consent_memory:true,updated_at:updatedAt};
  const {error}=await window.claraSupabase.from('clara_profiles').upsert(payload,{onConflict:'user_id'});
  if(error){memoryStatus('memoryStatus','Speichern fehlgeschlagen: '+error.message,true);return;}

  const memoryContent={display_name:payload.display_name,interests:payload.interests,travel_pace:payload.travel_pace,budget_level:payload.budget_level};
  const existing=await window.claraSupabase.from('clara_memories').select('id')
    .eq('user_id',claraUser.id).eq('memory_type','travel_profile')
    .order('created_at',{ascending:false}).limit(1).maybeSingle();
  if(existing.error){memoryStatus('memoryStatus','Profil gespeichert, aber die vorhandene Erinnerung konnte nicht geprüft werden: '+existing.error.message,true);await renderClaraTripPlans();return;}
  let memoryError=null;
  if(existing.data?.id){
    const updated=await window.claraSupabase.from('clara_memories').update({content:memoryContent})
      .eq('id',existing.data.id).eq('user_id',claraUser.id).eq('memory_type','travel_profile').select('id');
    memoryError=updated.error||(!updated.data?.length?new Error('Die vorhandene Erinnerung wurde nicht aktualisiert.'):null);
  }else{
    const inserted=await window.claraSupabase.from('clara_memories').insert({user_id:claraUser.id,memory_type:'travel_profile',content:memoryContent});
    memoryError=inserted.error;
  }
  if(memoryError){memoryStatus('memoryStatus','Profil gespeichert, aber die Erinnerungsdaten konnten nicht aktualisiert werden: '+memoryError.message,true);await renderClaraTripPlans();return;}
  memoryStatus('memoryStatus','Dein Profil und deine Reisevorlieben wurden mit deiner Zustimmung gespeichert.');
  await renderClaraTripPlans();
}
async function loadClaraProfile(){
  if(!window.claraSupabase||!claraUser){
    memoryStatus('memoryStatus','Bitte zuerst anmelden.',true);
    return;
  }

  const fields=['memoryName','memoryInterests','memoryPace','memoryBudget'];
  const clearPersonalFields=()=>{
    fields.forEach(id=>{
      const control=document.getElementById(id);
      if(control)control.value='';
    });
  };
  const consentControl=document.getElementById('memoryConsent');
  if(consentControl)consentControl.checked=false;
  clearPersonalFields();

  // Read the consent flag first. Do not select personal profile columns until
  // the account has an explicit, currently active Memory consent.
  const consentResult=await window.claraSupabase.from('clara_profiles')
    .select('consent_memory')
    .eq('user_id',claraUser.id)
    .maybeSingle();
  if(consentResult.error){
    memoryStatus('memoryStatus','Die Memory-Zustimmung konnte nicht geprüft werden: '+consentResult.error.message,true);
    return;
  }
  if(consentResult.data?.consent_memory!==true){
    memoryStatus('memoryStatus','Memory-Zustimmung ist deaktiviert. Deine gespeicherten Reisevorlieben werden nicht geladen. Vorhandene Daten kannst du über „Meine Clara-Daten löschen“ entfernen.');
    return;
  }

  if(consentControl)consentControl.checked=true;
  const {data,error}=await window.claraSupabase.from('clara_profiles')
    .select('display_name,interests,travel_pace,budget_level')
    .eq('user_id',claraUser.id)
    .maybeSingle();
  if(error){
    memoryStatus('memoryStatus','Laden fehlgeschlagen: '+error.message,true);
    return;
  }
  if(!data){
    if(consentControl)consentControl.checked=false;
    memoryStatus('memoryStatus','Noch keine persönlichen Angaben gespeichert.');
    return;
  }

  document.getElementById('memoryName').value=data.display_name||'';
  document.getElementById('memoryInterests').value=(data.interests||[]).join(', ');
  document.getElementById('memoryPace').value=data.travel_pace||'';
  document.getElementById('memoryBudget').value=data.budget_level||'';
  memoryStatus('memoryStatus','Deine gespeicherten Angaben wurden mit aktiver Zustimmung geladen.');
}
async function deleteClaraMemory(){if(!window.claraSupabase||!claraUser){memoryStatus('memoryStatus','Bitte zuerst anmelden.',true);return;}if(!confirm('Möchtest du wirklich dein Clara-Profil und alle gespeicherten Erinnerungen löschen?'))return;const a=await window.claraSupabase.from('clara_memories').delete().eq('user_id',claraUser.id);if(a.error){memoryStatus('memoryStatus','Löschen fehlgeschlagen: '+a.error.message,true);return;}const b=await window.claraSupabase.from('clara_feedback').delete().eq('user_id',claraUser.id);if(b.error){memoryStatus('memoryStatus','Erinnerungen gelöscht; Feedback konnte nicht gelöscht werden: '+b.error.message,true);return;}const c=await window.claraSupabase.from('clara_profiles').delete().eq('user_id',claraUser.id);if(c.error){memoryStatus('memoryStatus','Erinnerungen gelöscht; Profil konnte nicht gelöscht werden: '+c.error.message,true);return;}['memoryName','memoryInterests','memoryPace','memoryBudget'].forEach(id=>document.getElementById(id).value='');document.getElementById('memoryConsent').checked=false;memoryStatus('memoryStatus','Dein Clara-Profil und deine gespeicherten Erinnerungen wurden gelöscht.');await renderClaraTripPlans();}

const CLARA_I18N={
en:{"Clara Travel AI · Deine Reise beginnt mit einem Gespräch":"Clara Travel AI · Your journey starts with a conversation","Von Passau bis zum Donaudelta · Reiseinspiration entlang Europas Donau":"From Passau to the Danube Delta · Travel inspiration along the Danube", "Willkommen an der Donau":"Welcome to the Danube","Entdecke Europas":"Discover Europe’s","Donau mit Clara":"Danube with Clara","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss.":"Travel tips, culinary highlights and favourite places along Europe’s most beautiful river.","Reiseziele entdecken":"Explore destinations","Die schönsten Orte · 12 Donaustationen + 1 Landausflug":"The most beautiful places · 12 Danube stops + 1 shore excursion","Entlang der Donau – alle Reiseziele":"Along the Danube – all destinations","Entdecke jede Station mit Kurzbeschreibung, aktueller Ortszeit und Wetter. Der Donaupegel wird erst angezeigt, wenn eine offizielle Messstation eindeutig zugeordnet ist.":"Explore every stop with a short description, local time and current weather. Danube water levels will only be shown when an official gauging station has been reliably matched.","Clara bereitet ihre Begrüßung vor …":"Clara is preparing her welcome …",
"Entdecke Europas":"Discover Europe’s","Donau mit Clara":"Danube with Clara",
"♥ Willkommen an der Donau":"♥ Welcome to the Danube","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Travel tips, culinary highlights and favourite places along Europe’s most beautiful river – from Passau to the Danube Delta.","Österreich":"Austria","Ungarn":"Hungary","Serbien":"Serbia","Slowakei":"Slovakia","Bulgarien":"Bulgaria","Deutschland":"Germany","Rumänien":"Romania","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Select the stops to discover highlights, sights and Clara’s personal tips – from Passau to the Danube Delta.","DIE DONAU-ROUTE":"THE DANUBE ROUTE","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"From Passau through Austria, Slovakia, Hungary, Serbia and Bulgaria to the Danube Delta.",
"Startseite":"Home","Reiseziele":"Destinations","Reiseplaner":"Trip planner","Genussreise":"Culinary journey","Claras Geschichten":"Clara's stories","Über Clara":"About Clara","Sprache":"Language","Clara fragen":"Ask Clara","Clara kennenlernen":"Meet Clara","Reiseziele entdecken →":"Explore destinations →","Die schönsten Orte":"The most beautiful places","Entlang der Donau":"Along the Danube","Ortszeit":"Local time","Wird geladen …":"Loading …","Wetter":"Weather","Pegel":"Water level","Keine geprüfte Messstelle":"No verified measuring station","Entdecken →":"Discover →","Deine Donau entdecken":"Discover the Danube","Interaktive Donau-Karte":"Interactive Danube map","Karte ansehen →":"View map →","Startseite":"Home","Reise planen":"Plan a trip","Premium":"Premium","Übersicht":"Overview","Donau-Karte":"Danube map","Donau-Schleusen":"Danube locks","Mit Clara sprechen":"Talk to Clara","Donau-Wissen":"Danube guide","Premium entdecken":"Discover Premium","Mein Clara-Gedächtnis":"My Clara Memory","Deine Reise, dein Tempo.":"Your journey, your pace.","Europa wartet auf dich.":"Europe is waiting for you.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Discover Europe's rivers, cities and unique travel experiences with Clara by your side.","Hallo, ich bin Clara.":"Hello, I'm Clara.","Wohin reisen wir?":"Where shall we go?","Meine Reise planen →":"Plan my trip →","Alle Stationen →":"All stops →","Dein persönlicher Reiseplan":"Your personal travel plan","Kultur, Kulinarik oder Natur – du entscheidest.":"Culture, cuisine or nature – you decide.","Reise zusammenstellen":"Build your trip","Frag Clara":"Ask Clara","Gespräch starten":"Start conversation","Plane deine Reise":"Plan your trip","Wähle Ziel, Reisedauer und Interessen.":"Choose your destination, trip length and interests.","Dein Reiseziel":"Your destination","Reisedauer":"Trip duration","1 Tag":"1 day","3 Tage":"3 days","7 Tage":"7 days","Was magst du?":"What do you enjoy?","Kultur & Geschichte":"Culture & history","Kulinarik & Märkte":"Cuisine & markets","Natur & Abenteuer":"Nature & adventure","Entspannung & Genuss":"Relaxation & indulgence","Flusskreuzfahrt & Landgänge":"River cruises & shore excursions","Dein Reisetempo":"Your travel pace","Entspannt":"Relaxed","Ausgewogen":"Balanced","Viel entdecken":"See more","Gehhilfe / Mobilität":"Mobility assistance","Keine besondere Angabe":"No special requirements","Rollator":"Rollator","Meinen Reiseplan erstellen":"Create my itinerary","Die Donau entdecken":"Discover the Danube","Schleusen-Informationen":"Lock information","Donaustation":"Danube stop","Land-Ausflug":"Shore excursion","Reiseverlauf":"Route","In Flussrichtung – von West nach Ost":"Downstream – west to east","Wähle eine Station":"Choose a stop","Schleuse suchen":"Search locks","Land filtern":"Filter by country","Alle Länder":"All countries","Schleusendaten werden geladen …":"Loading lock data …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Choose a lock on the map or in the list.","Clara fragen":"Ask Clara","Sprich mit Clara":"Talk to Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Ask a travel question or get inspired.","Begrüßung anhören":"Listen to the welcome message","Dein Gespräch":"Your conversation","Senden":"Send","Lokales Essen":"Local food","Tagesplan":"Day plan","Claras Stimme":"Clara's voice","Stimme":"Voice","Sprechtempo":"Speaking speed","Ruhig":"Slow","Natürlich und ruhig (empfohlen)":"Natural and calm (recommended)","Etwas schneller":"A little faster","Clara spricht jede Antwort automatisch":"Clara automatically speaks every answer","Stimme testen":"Test voice","Stopp":"Stop","Mein Clara-Gedächtnis":"My Clara Memory","Supabase verbinden":"Connect Supabase","Noch nicht verbunden.":"Not connected yet.","Dein Nutzerkonto":"Your account","E-Mail":"Email","Passwort":"Password","Anmelden":"Sign in","Konto erstellen":"Create account","Abmelden":"Sign out","Passwort vergessen?":"Forgot password?","Nicht angemeldet.":"Not signed in.","Neues Passwort festlegen":"Set a new password","Neues Passwort speichern":"Save new password","Wie soll Clara dich nennen?":"What should Clara call you?","Dein Reisebudget":"Your travel budget","Preisbewusst":"Budget-conscious","Mittel":"Mid-range","Komfort":"Comfort","Luxus":"Luxury","Deine Interessen":"Your interests","Meine Angaben speichern":"Save my details","Gespeicherte Angaben laden":"Load saved details","Deine Angaben sind noch nicht gespeichert.":"Your details have not been saved yet.","Meine Clara-Daten löschen":"Delete my Clara data","Claras Donau-Wissen":"Clara's Danube knowledge","Was Clara bei jeder Empfehlung berücksichtigt":"What Clara considers in every recommendation","Sehenswürdigkeiten":"Sights","Kulinarik":"Cuisine","Saison & Veranstaltungen":"Seasons & events","River-Cruise-Modus":"River cruise mode","Plattform":"Platform","Format":"Format","Reiseziel / Thema":"Destination / topic","Besondere Wünsche (optional)":"Special requests (optional)","Content mit Clara erstellen":"Create content with Clara","Reiseziele entlang der Donau":"Destinations along the Danube","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Discover more. Plan less.","Erweiterte Reisepläne":"Advanced itineraries","Mehr Sprachbegleitung":"More language support","Gespeicherte Favoriten":"Saved favourites"
},
nl:{"Clara Travel AI · Deine Reise beginnt mit einem Gespräch":"Clara Travel AI · Je reis begint met een gesprek","Von Passau bis zum Donaudelta · Reiseinspiration entlang Europas Donau":"Van Passau tot de Donaudelta · Reisideeën langs de Donau", "Willkommen an der Donau":"Welkom aan de Donau","Entdecke Europas":"Ontdek Europa’s","Donau mit Clara":"Donau met Clara","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss.":"Reistips, culinaire hoogtepunten en bijzondere favoriete plekken langs Europa’s mooiste rivier.","Reiseziele entdecken":"Ontdek bestemmingen","Die schönsten Orte · 12 Donaustationen + 1 Landausflug":"De mooiste plekken · 12 Donauplaatsen + 1 landexcursie","Entlang der Donau – alle Reiseziele":"Langs de Donau – alle bestemmingen","Entdecke jede Station mit Kurzbeschreibung, aktueller Ortszeit und Wetter. Der Donaupegel wird erst angezeigt, wenn eine offizielle Messstation eindeutig zugeordnet ist.":"Ontdek elke plaats met een korte beschrijving, lokale tijd en actueel weer. De Donauwaterstand wordt pas getoond wanneer een officieel meetstation betrouwbaar is gekoppeld.","Clara bereitet ihre Begrüßung vor …":"Clara bereidt haar welkomstgroet voor …",
"Entdecke Europas":"Ontdek Europa’s","Donau mit Clara":"Donau met Clara",
"♥ Willkommen an der Donau":"♥ Welkom aan de Donau","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Reistips, culinaire hoogtepunten en bijzondere plekken langs Europa’s mooiste rivier – van Passau tot de Donaudelta.","Österreich":"Oostenrijk","Ungarn":"Hongarije","Serbien":"Servië","Slowakei":"Slowakije","Bulgarien":"Bulgarije","Deutschland":"Duitsland","Rumänien":"Roemenië","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Klik op de haltes en ontdek hoogtepunten, bezienswaardigheden en Clara’s persoonlijke tips – van Passau tot de Donaudelta.","DIE DONAU-ROUTE":"DE DONAUROUTE","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"Van Passau via Oostenrijk, Slowakije, Hongarije, Servië en Bulgarije naar de Donaudelta.",
"Startseite":"Home","Reiseziele":"Bestemmingen","Reiseplaner":"Reisplanner","Genussreise":"Culinaire reis","Claras Geschichten":"Verhalen van Clara","Über Clara":"Over Clara","Sprache":"Taal","Clara fragen":"Vraag Clara","Clara kennenlernen":"Maak kennis met Clara","Reiseziele entdecken →":"Ontdek bestemmingen →","Die schönsten Orte":"De mooiste plekken","Entlang der Donau":"Langs de Donau","Ortszeit":"Lokale tijd","Wird geladen …":"Wordt geladen …","Wetter":"Weer","Pegel":"Waterstand","Keine geprüfte Messstelle":"Geen gecontroleerd meetstation","Entdecken →":"Ontdekken →","Deine Donau entdecken":"Ontdek de Donau","Interaktive Donau-Karte":"Interactieve Dona kaart","Karte ansehen →":"Bekijk de kaart →","Startseite":"Home","Reise planen":"Reis plannen","Premium":"Premium","Übersicht":"Overzicht","Donau-Karte":"Donaukaart","Donau-Schleusen":"Donau-sluizen","Mit Clara sprechen":"Praat met Clara","Donau-Wissen":"Donaukennis","Premium entdecken":"Ontdek Premium","Mein Clara-Gedächtnis":"Mijn Clara-geheugen","Deine Reise, dein Tempo.":"Jouw reis, jouw tempo.","Europa wartet auf dich.":"Europa wacht op je.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Ontdek de rivieren, steden en bijzondere reiservaringen van Europa met Clara aan je zijde.","Hallo, ich bin Clara.":"Hallo, ik ben Clara.","Wohin reisen wir?":"Waar gaan we naartoe?","Meine Reise planen →":"Plan mijn reis →","Alle Stationen →":"Alle haltes →","Dein persönlicher Reiseplan":"Jouw persoonlijke reisplan","Kultur, Kulinarik oder Natur – du entscheidest.":"Cultuur, gastronomie of natuur – jij kiest.","Reise zusammenstellen":"Stel je reis samen","Frag Clara":"Vraag Clara","Gespräch starten":"Start gesprek","Plane deine Reise":"Plan je reis","Wähle Ziel, Reisedauer und Interessen.":"Kies je bestemming, reisduur en interesses.","Dein Reiseziel":"Je bestemming","Reisedauer":"Reisduur","1 Tag":"1 dag","3 Tage":"3 dagen","7 Tage":"7 dagen","Was magst du?":"Waar houd je van?","Kultur & Geschichte":"Cultuur & geschiedenis","Kulinarik & Märkte":"Gastronomie & markten","Natur & Abenteuer":"Natuur & avontuur","Entspannung & Genuss":"Ontspanning & genieten","Flusskreuzfahrt & Landgänge":"Riviercruises & excursies aan wal","Dein Reisetempo":"Jouw reistempo","Entspannt":"Ontspannen","Ausgewogen":"Evenwichtig","Viel entdecken":"Veel ontdekken","Gehhilfe / Mobilität":"Mobiliteitshulp","Keine besondere Angabe":"Geen bijzondere vereisten","Rollator":"Rollator","Meinen Reiseplan erstellen":"Maak mijn reisplan","Die Donau entdecken":"Ontdek de Donau","Schleusen-Informationen":"Sluisinformatie","Donaustation":"Donauhalte","Land-Ausflug":"Excursie aan wal","Reiseverlauf":"Route","In Flussrichtung – von West nach Ost":"Met de stroom mee – van west naar oost","Wähle eine Station":"Kies een halte","Schleuse suchen":"Zoek een sluis","Land filtern":"Filter op land","Alle Länder":"Alle landen","Schleusendaten werden geladen …":"Sluisgegevens worden geladen …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Kies een sluis op de kaart of in de lijst.","Sprich mit Clara":"Praat met Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Stel een reisvraag of laat je inspireren.","Begrüßung anhören":"Luister naar de begroeting","Dein Gespräch":"Jouw gesprek","Senden":"Verzenden","Lokales Essen":"Lokaal eten","Tagesplan":"Dagplanning","Claras Stimme":"Clara's stem","Stimme":"Stem","Sprechtempo":"Spreektempo","Ruhig":"Rustig","Natürlich und ruhig (empfohlen)":"Natuurlijk en rustig (aanbevolen)","Etwas schneller":"Iets sneller","Clara spricht jede Antwort automatisch":"Clara spreekt elk antwoord automatisch uit","Stimme testen":"Stem testen","Stopp":"Stoppen","Mein Clara-Gedächtnis":"Mijn Clara-geheugen","Supabase verbinden":"Supabase verbinden","Noch nicht verbunden.":"Nog niet verbonden.","Dein Nutzerkonto":"Je account","E-Mail":"E-mail","Passwort":"Wachtwoord","Anmelden":"Inloggen","Konto erstellen":"Account aanmaken","Abmelden":"Uitloggen","Passwort vergessen?":"Wachtwoord vergeten?","Nicht angemeldet.":"Niet ingelogd.","Neues Passwort festlegen":"Nieuw wachtwoord instellen","Neues Passwort speichern":"Nieuw wachtwoord opslaan","Wie soll Clara dich nennen?":"Hoe moet Clara je noemen?","Dein Reisebudget":"Je reisbudget","Preisbewusst":"Budgetbewust","Mittel":"Gemiddeld","Komfort":"Comfort","Luxus":"Luxe","Deine Interessen":"Je interesses","Meine Angaben speichern":"Mijn gegevens opslaan","Gespeicherte Angaben laden":"Opgeslagen gegevens laden","Deine Angaben sind noch nicht gespeichert.":"Je gegevens zijn nog niet opgeslagen.","Meine Clara-Daten löschen":"Mijn Clara-gegevens verwijderen","Claras Donau-Wissen":"Clara's Donaukennis","Was Clara bei jeder Empfehlung berücksichtigt":"Waar Clara bij elke aanbeveling rekening mee houdt","Sehenswürdigkeiten":"Bezienswaardigheden","Kulinarik":"Gastronomie","Saison & Veranstaltungen":"Seizoenen & evenementen","River-Cruise-Modus":"Riviercruisemodus","Plattform":"Platform","Format":"Formaat","Reiseziel / Thema":"Bestemming / onderwerp","Besondere Wünsche (optional)":"Speciale wensen (optioneel)","Content mit Clara erstellen":"Maak content met Clara","Reiseziele entlang der Donau":"Bestemmingen langs de Donau","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Meer ontdekken. Minder plannen.","Erweiterte Reisepläne":"Uitgebreide reisplannen","Mehr Sprachbegleitung":"Meer taalbegeleiding","Gespeicherte Favoriten":"Opgeslagen favorieten"
},
fr:{"Clara Travel AI · Deine Reise beginnt mit einem Gespräch":"Clara Travel AI · Votre voyage commence par une conversation","Von Passau bis zum Donaudelta · Reiseinspiration entlang Europas Donau":"De Passau au delta du Danube · Inspiration pour découvrir le Danube européen", "Willkommen an der Donau":"Bienvenue sur le Danube","Entdecke Europas":"Découvrez le Danube","Donau mit Clara":"européen avec Clara","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss.":"Conseils de voyage, découvertes culinaires et lieux coups de cœur le long du plus beau fleuve d’Europe.","Reiseziele entdecken":"Découvrir les destinations","Die schönsten Orte · 12 Donaustationen + 1 Landausflug":"Les plus beaux endroits · 12 étapes sur le Danube + 1 excursion à terre","Entlang der Donau – alle Reiseziele":"Le long du Danube – toutes les destinations","Entdecke jede Station mit Kurzbeschreibung, aktueller Ortszeit und Wetter. Der Donaupegel wird erst angezeigt, wenn eine offizielle Messstation eindeutig zugeordnet ist.":"Découvrez chaque étape avec une courte présentation, l’heure locale et la météo actuelle. Le niveau du Danube ne sera affiché qu’après attribution fiable d’une station officielle de mesure.","Clara bereitet ihre Begrüßung vor …":"Clara prépare son message de bienvenue …",
"Entdecke Europas":"Découvrez l’Europe","Donau mit Clara":"avec Clara sur le Danube",
"♥ Willkommen an der Donau":"♥ Bienvenue sur le Danube","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Conseils de voyage, découvertes culinaires et lieux coups de cœur le long du plus beau fleuve d’Europe, de Passau au delta du Danube.","Österreich":"Autriche","Ungarn":"Hongrie","Serbien":"Serbie","Slowakei":"Slovaquie","Bulgarien":"Bulgarie","Deutschland":"Allemagne","Rumänien":"Roumanie","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Cliquez sur les étapes pour découvrir les incontournables, les sites à visiter et les conseils personnels de Clara, de Passau au delta du Danube.","DIE DONAU-ROUTE":"L’ITINÉRAIRE DU DANUBE","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"De Passau, à travers l’Autriche, la Slovaquie, la Hongrie, la Serbie et la Bulgarie, jusqu’au delta du Danube.",
"Startseite":"Accueil","Reiseziele":"Destinations","Reiseplaner":"Planificateur de voyage","Genussreise":"Voyage gourmand","Claras Geschichten":"Les histoires de Clara","Über Clara":"À propos de Clara","Sprache":"Langue","Clara fragen":"Demander à Clara","Clara kennenlernen":"Rencontrer Clara","Reiseziele entdecken →":"Découvrir les destinations →","Die schönsten Orte":"Les plus beaux endroits","Entlang der Donau":"Le long du Danube","Ortszeit":"Heure locale","Wird geladen …":"Chargement …","Wetter":"Météo","Pegel":"Niveau d’eau","Keine geprüfte Messstelle":"Aucune station de mesure vérifiée","Entdecken →":"Découvrir →","Deine Donau entdecken":"Découvrir le Danube","Interaktive Donau-Karte":"Carte interactive du Danube","Karte ansehen →":"Voir la carte →","Startseite":"Accueil","Reise planen":"Planifier un voyage","Premium":"Premium","Übersicht":"Vue d’ensemble","Donau-Karte":"Carte du Danube","Donau-Schleusen":"Écluses du Danube","Mit Clara sprechen":"Parler avec Clara","Donau-Wissen":"Guide du Danube","Premium entdecken":"Découvrir Premium","Mein Clara-Gedächtnis":"Ma mémoire Clara","Deine Reise, dein Tempo.":"Votre voyage, votre rythme.","Europa wartet auf dich.":"L’Europe vous attend.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Découvrez les fleuves, les villes et les expériences de voyage uniques d’Europe avec Clara à vos côtés.","Hallo, ich bin Clara.":"Bonjour, je suis Clara.","Wohin reisen wir?":"Où partons-nous ?","Meine Reise planen →":"Planifier mon voyage →","Alle Stationen →":"Toutes les étapes →","Dein persönlicher Reiseplan":"Votre itinéraire personnel","Kultur, Kulinarik oder Natur – du entscheidest.":"Culture, gastronomie ou nature : à vous de choisir.","Reise zusammenstellen":"Composer mon voyage","Frag Clara":"Demander à Clara","Gespräch starten":"Commencer la conversation","Plane deine Reise":"Planifiez votre voyage","Wähle Ziel, Reisedauer und Interessen.":"Choisissez votre destination, la durée du séjour et vos centres d’intérêt.","Dein Reiseziel":"Votre destination","Reisedauer":"Durée du voyage","1 Tag":"1 jour","3 Tage":"3 jours","7 Tage":"7 jours","Was magst du?":"Qu’aimez-vous ?","Kultur & Geschichte":"Culture et histoire","Kulinarik & Märkte":"Gastronomie et marchés","Natur & Abenteuer":"Nature et aventure","Entspannung & Genuss":"Détente et plaisir","Flusskreuzfahrt & Landgänge":"Croisières fluviales et excursions","Dein Reisetempo":"Votre rythme de voyage","Entspannt":"Détendu","Ausgewogen":"Équilibré","Viel entdecken":"Découvrir davantage","Gehhilfe / Mobilität":"Aide à la mobilité","Keine besondere Angabe":"Aucun besoin particulier","Rollator":"Déambulateur","Meinen Reiseplan erstellen":"Créer mon itinéraire","Die Donau entdecken":"Découvrir le Danube","Schleusen-Informationen":"Informations sur les écluses","Donaustation":"Escale sur le Danube","Land-Ausflug":"Excursion à terre","Reiseverlauf":"Itinéraire","In Flussrichtung – von West nach Ost":"Dans le sens du courant – d’ouest en est","Wähle eine Station":"Choisissez une étape","Schleuse suchen":"Rechercher une écluse","Land filtern":"Filtrer par pays","Alle Länder":"Tous les pays","Schleusendaten werden geladen …":"Chargement des données des écluses …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Choisissez une écluse sur la carte ou dans la liste.","Sprich mit Clara":"Parler avec Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Posez une question sur votre voyage ou laissez-vous inspirer.","Begrüßung anhören":"Écouter le message d’accueil","Dein Gespräch":"Votre conversation","Senden":"Envoyer","Lokales Essen":"Cuisine locale","Tagesplan":"Programme de la journée","Claras Stimme":"Voix de Clara","Stimme":"Voix","Sprechtempo":"Débit de parole","Ruhig":"Lent","Natürlich und ruhig (empfohlen)":"Naturel et calme (recommandé)","Etwas schneller":"Un peu plus rapide","Clara spricht jede Antwort automatisch":"Clara lit automatiquement chaque réponse","Stimme testen":"Tester la voix","Stopp":"Arrêter","Mein Clara-Gedächtnis":"Ma mémoire Clara","Supabase verbinden":"Connecter Supabase","Noch nicht verbunden.":"Pas encore connecté.","Dein Nutzerkonto":"Votre compte","E-Mail":"E-mail","Passwort":"Mot de passe","Anmelden":"Se connecter","Konto erstellen":"Créer un compte","Abmelden":"Se déconnecter","Passwort vergessen?":"Mot de passe oublié ?","Nicht angemeldet.":"Non connecté.","Neues Passwort festlegen":"Définir un nouveau mot de passe","Neues Passwort speichern":"Enregistrer le nouveau mot de passe","Wie soll Clara dich nennen?":"Comment Clara doit-elle vous appeler ?","Dein Reisebudget":"Votre budget de voyage","Preisbewusst":"Économique","Mittel":"Moyen","Komfort":"Confort","Luxus":"Luxe","Deine Interessen":"Vos centres d’intérêt","Meine Angaben speichern":"Enregistrer mes informations","Gespeicherte Angaben laden":"Charger les informations enregistrées","Deine Angaben sind noch nicht gespeichert.":"Vos informations ne sont pas encore enregistrées.","Meine Clara-Daten löschen":"Supprimer mes données Clara","Claras Donau-Wissen":"Les connaissances de Clara sur le Danube","Was Clara bei jeder Empfehlung berücksichtigt":"Ce que Clara prend en compte dans chaque recommandation","Sehenswürdigkeiten":"Sites touristiques","Kulinarik":"Gastronomie","Saison & Veranstaltungen":"Saisons et événements","River-Cruise-Modus":"Mode croisière fluviale","Plattform":"Plateforme","Format":"Format","Reiseziel / Thema":"Destination / sujet","Besondere Wünsche (optional)":"Demandes particulières (facultatif)","Content mit Clara erstellen":"Créer du contenu avec Clara","Reiseziele entlang der Donau":"Destinations le long du Danube","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Découvrez davantage. Planifiez moins.","Erweiterte Reisepläne":"Itinéraires avancés","Mehr Sprachbegleitung":"Plus d’accompagnement linguistique","Gespeicherte Favoriten":"Favoris enregistrés"
},
ro:{"Clara Travel AI · Deine Reise beginnt mit einem Gespräch":"Clara Travel AI · Călătoria ta începe cu o conversație","Von Passau bis zum Donaudelta · Reiseinspiration entlang Europas Donau":"De la Passau la Delta Dunării · Inspirație pentru călătorii de-a lungul Dunării", "Willkommen an der Donau":"Bun venit pe Dunăre","Entdecke Europas":"Descoperă Dunărea","Donau mit Clara":"europeană alături de Clara","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss.":"Sfaturi de călătorie, experiențe culinare și locuri îndrăgite de-a lungul celui mai frumos fluviu al Europei.","Reiseziele entdecken":"Descoperă destinațiile","Die schönsten Orte · 12 Donaustationen + 1 Landausflug":"Cele mai frumoase locuri · 12 opriri pe Dunăre + 1 excursie pe uscat","Entlang der Donau – alle Reiseziele":"De-a lungul Dunării – toate destinațiile","Entdecke jede Station mit Kurzbeschreibung, aktueller Ortszeit und Wetter. Der Donaupegel wird erst angezeigt, wenn eine offizielle Messstation eindeutig zugeordnet ist.":"Descoperă fiecare oprire cu o scurtă descriere, ora locală și vremea actuală. Nivelul Dunării va fi afișat numai după asocierea sigură a unei stații oficiale de măsurare.","Clara bereitet ihre Begrüßung vor …":"Clara își pregătește mesajul de bun venit …",
"Entdecke Europas":"Descoperă Europa","Donau mit Clara":"pe Dunăre cu Clara",
"♥ Willkommen an der Donau":"♥ Bun venit pe Dunăre","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Sfaturi de călătorie, experiențe culinare și locuri îndrăgite de-a lungul celui mai frumos fluviu al Europei – de la Passau până la Delta Dunării.","Österreich":"Austria","Ungarn":"Ungaria","Serbien":"Serbia","Slowakei":"Slovacia","Bulgarien":"Bulgaria","Deutschland":"Germania","Rumänien":"România","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Selectează opririle pentru a descoperi atracții, obiective turistice și recomandările personale ale Clarei – de la Passau până la Delta Dunării.","DIE DONAU-ROUTE":"TRASEUL DUNĂRII","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"De la Passau, prin Austria, Slovacia, Ungaria, Serbia și Bulgaria, până la Delta Dunării.",
"Startseite":"Acasă","Reiseziele":"Destinații","Reiseplaner":"Planificator de călătorie","Genussreise":"Călătorie culinară","Claras Geschichten":"Poveștile Clarei","Über Clara":"Despre Clara","Sprache":"Limbă","Clara fragen":"Întreab-o pe Clara","Clara kennenlernen":"Cunoaște-o pe Clara","Reiseziele entdecken →":"Descoperă destinațiile →","Die schönsten Orte":"Cele mai frumoase locuri","Entlang der Donau":"De-a lungul Dunării","Ortszeit":"Ora locală","Wird geladen …":"Se încarcă …","Wetter":"Vreme","Pegel":"Nivelul apei","Keine geprüfte Messstelle":"Nu există un punct de măsurare verificat","Entdecken →":"Descoperă →","Deine Donau entdecken":"Descoperă Dunărea","Interaktive Donau-Karte":"Hartă interactivă a Dunării","Karte ansehen →":"Vezi harta →","Startseite":"Acasă","Reise planen":"Planifică o călătorie","Premium":"Premium","Übersicht":"Prezentare generală","Donau-Karte":"Harta Dunării","Donau-Schleusen":"Ecluzele Dunării","Mit Clara sprechen":"Vorbește cu Clara","Donau-Wissen":"Ghidul Dunării","Premium entdecken":"Descoperă Premium","Mein Clara-Gedächtnis":"Memoria mea Clara","Deine Reise, dein Tempo.":"Călătoria ta, ritmul tău.","Europa wartet auf dich.":"Europa te așteaptă.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Descoperă râurile, orașele și experiențele speciale de călătorie ale Europei alături de Clara.","Hallo, ich bin Clara.":"Bună, sunt Clara.","Wohin reisen wir?":"Unde călătorim?","Meine Reise planen →":"Planifică-mi călătoria →","Alle Stationen →":"Toate opririle →","Dein persönlicher Reiseplan":"Planul tău personal de călătorie","Kultur, Kulinarik oder Natur – du entscheidest.":"Cultură, gastronomie sau natură – tu alegi.","Reise zusammenstellen":"Creează-ți călătoria","Frag Clara":"Întreab-o pe Clara","Gespräch starten":"Începe conversația","Plane deine Reise":"Planifică-ți călătoria","Wähle Ziel, Reisedauer und Interessen.":"Alege destinația, durata călătoriei și interesele.","Dein Reiseziel":"Destinația ta","Reisedauer":"Durata călătoriei","1 Tag":"1 zi","3 Tage":"3 zile","7 Tage":"7 zile","Was magst du?":"Ce îți place?","Kultur & Geschichte":"Cultură și istorie","Kulinarik & Märkte":"Gastronomie și piețe","Natur & Abenteuer":"Natură și aventură","Entspannung & Genuss":"Relaxare și răsfăț","Flusskreuzfahrt & Landgänge":"Croaziere fluviale și excursii la țărm","Dein Reisetempo":"Ritmul tău de călătorie","Entspannt":"Relaxat","Ausgewogen":"Echilibrat","Viel entdecken":"Descoperă cât mai mult","Gehhilfe / Mobilität":"Ajutor pentru mobilitate","Keine besondere Angabe":"Fără cerințe speciale","Rollator":"Cadru de mers cu roți","Meinen Reiseplan erstellen":"Creează-mi planul de călătorie","Die Donau entdecken":"Descoperă Dunărea","Schleusen-Informationen":"Informații despre ecluze","Donaustation":"Oprire pe Dunăre","Land-Ausflug":"Excursie la țărm","Reiseverlauf":"Traseu","In Flussrichtung – von West nach Ost":"În direcția curgerii – de la vest la est","Wähle eine Station":"Alege o oprire","Schleuse suchen":"Caută o ecluză","Land filtern":"Filtrează după țară","Alle Länder":"Toate țările","Schleusendaten werden geladen …":"Se încarcă datele ecluzelor …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Alege o ecluză de pe hartă sau din listă.","Sprich mit Clara":"Vorbește cu Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Pune o întrebare despre călătoria ta sau inspiră-te.","Begrüßung anhören":"Ascultă mesajul de bun venit","Dein Gespräch":"Conversația ta","Senden":"Trimite","Lokales Essen":"Mâncare locală","Tagesplan":"Programul zilei","Claras Stimme":"Vocea Clarei","Stimme":"Voce","Sprechtempo":"Viteza vorbirii","Ruhig":"Lent","Natürlich und ruhig (empfohlen)":"Natural și calm (recomandat)","Etwas schneller":"Puțin mai rapid","Clara spricht jede Antwort automatisch":"Clara rostește automat fiecare răspuns","Stimme testen":"Testează vocea","Stopp":"Oprește","Mein Clara-Gedächtnis":"Memoria mea Clara","Supabase verbinden":"Conectează Supabase","Noch nicht verbunden.":"Încă nu este conectat.","Dein Nutzerkonto":"Contul tău","E-Mail":"E-mail","Passwort":"Parolă","Anmelden":"Autentificare","Konto erstellen":"Creează cont","Abmelden":"Deconectare","Passwort vergessen?":"Ai uitat parola?","Nicht angemeldet.":"Nu ești autentificat.","Neues Passwort festlegen":"Setează o parolă nouă","Neues Passwort speichern":"Salvează parola nouă","Wie soll Clara dich nennen?":"Cum vrei să-ți spună Clara?","Dein Reisebudget":"Bugetul tău de călătorie","Preisbewusst":"Economic","Mittel":"Mediu","Komfort":"Confort","Luxus":"Lux","Deine Interessen":"Interesele tale","Meine Angaben speichern":"Salvează datele mele","Gespeicherte Angaben laden":"Încarcă datele salvate","Deine Angaben sind noch nicht gespeichert.":"Datele tale nu sunt încă salvate.","Meine Clara-Daten löschen":"Șterge datele mele Clara","Claras Donau-Wissen":"Cunoștințele Clarei despre Dunăre","Was Clara bei jeder Empfehlung berücksichtigt":"Ce ia Clara în considerare la fiecare recomandare","Sehenswürdigkeiten":"Obiective turistice","Kulinarik":"Gastronomie","Saison & Veranstaltungen":"Sezon și evenimente","River-Cruise-Modus":"Mod croazieră fluvială","Plattform":"Platformă","Format":"Format","Reiseziel / Thema":"Destinație / subiect","Besondere Wünsche (optional)":"Preferințe speciale (opțional)","Content mit Clara erstellen":"Creează conținut cu Clara","Reiseziele entlang der Donau":"Destinații de-a lungul Dunării","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Descoperă mai mult. Planifică mai puțin.","Erweiterte Reisepläne":"Planuri de călătorie avansate","Mehr Sprachbegleitung":"Mai mult suport lingvistic","Gespeicherte Favoriten":"Favorite salvate"
}};
const CLARA_CHAT_I18N={"en":{"Schreib Clara oder nutze das Mikrofon …":"Write to Clara or use the microphone …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"You can type to Clara or tap the microphone. Speech recognition may work online depending on your browser.","Clara hört zu … Sprich jetzt deine Frage.":"Clara is listening … Ask your question now.","Erkannt: „":"Recognized: “"," – ich sende deine Frage an Clara.":" – sending your question to Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"Recording ended. Tap the microphone to try again.","Sprachaufnahme wird beendet …":"Stopping voice recording …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"Microphone access requires a secure HTTPS connection.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"This browser does not support built-in speech recognition. Please use Chrome or type your message to Clara.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"I didn’t catch that. Please try again or type your question.","Das Backend hat keine gültige Antwort geliefert.":"The server returned an invalid response.","Clara hat eine leere Antwort erhalten.":"Clara returned an empty reply.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara is temporarily unavailable. Please check your internet connection and try again.","Ich prüfe deine freigegebenen persönlichen Angaben …":"I’m checking the personal details you’ve allowed Clara to use …","Clara bereitet deine Antwort vor …":"Clara is preparing your reply …","Sprachausgabe nicht verfügbar:":"Speech is unavailable:","Clara konnte gerade keine Antwort erstellen. Bitte versuche es erneut.":"Clara could not generate a reply just now. Please try again."},"nl":{"Schreib Clara oder nutze das Mikrofon …":"Schrijf Clara of gebruik de microfoon …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"Je kunt Clara typen of op de microfoon tikken. Spraakherkenning werkt mogelijk online, afhankelijk van je browser.","Clara hört zu … Sprich jetzt deine Frage.":"Clara luistert … Stel nu je vraag."," – ich sende deine Frage an Clara.":" – ik stuur je vraag naar Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"De opname is beëindigd. Tik opnieuw op de microfoon om het nog eens te proberen.","Sprachaufnahme wird beendet …":"Spraakopname wordt beëindigd …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"De microfoonfunctie vereist een beveiligde HTTPS-verbinding.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"Deze browser ondersteunt geen ingebouwde spraakherkenning. Gebruik Chrome of typ je bericht aan Clara.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"Ik heb je niet verstaan. Probeer het opnieuw of typ je vraag.","Das Backend hat keine gültige Antwort geliefert.":"De server heeft geen geldig antwoord gegeven.","Clara hat eine leere Antwort erhalten.":"Clara heeft een leeg antwoord ontvangen.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara is momenteel niet beschikbaar. Controleer je internetverbinding en probeer het opnieuw.","Ich prüfe deine freigegebenen persönlichen Angaben …":"Ik controleer de persoonlijke gegevens die je Clara hebt toegestaan te gebruiken …","Clara bereitet deine Antwort vor …":"Clara bereidt je antwoord voor …","Clara konnte gerade keine Antwort erstellen. Bitte versuche es erneut.":"Clara kon zojuist geen antwoord maken. Probeer het opnieuw."},"fr":{"Schreib Clara oder nutze das Mikrofon …":"Écrivez à Clara ou utilisez le microphone …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"Vous pouvez écrire à Clara ou toucher le microphone. La reconnaissance vocale peut fonctionner en ligne selon votre navigateur.","Clara hört zu … Sprich jetzt deine Frage.":"Clara écoute … Posez votre question maintenant."," – ich sende deine Frage an Clara.":" – j’envoie votre question à Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"Enregistrement terminé. Touchez à nouveau le microphone pour réessayer.","Sprachaufnahme wird beendet …":"Arrêt de l’enregistrement vocal …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"Le microphone nécessite une connexion HTTPS sécurisée.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"Ce navigateur ne prend pas en charge la reconnaissance vocale intégrée. Utilisez Chrome ou écrivez à Clara.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"Je n’ai pas compris. Veuillez réessayer ou écrire votre question.","Das Backend hat keine gültige Antwort geliefert.":"Le serveur a renvoyé une réponse invalide.","Clara hat eine leere Antwort erhalten.":"Clara a renvoyé une réponse vide.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara est temporairement indisponible. Vérifiez votre connexion Internet et réessayez.","Ich prüfe deine freigegebenen persönlichen Angaben …":"Je vérifie les informations personnelles que vous avez autorisé Clara à utiliser …","Clara bereitet deine Antwort vor …":"Clara prépare votre réponse …"},"ro":{"Schreib Clara oder nutze das Mikrofon …":"Scrie-i Clarei sau folosește microfonul …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"Îi poți scrie Clarei sau poți atinge microfonul. Recunoașterea vocală poate funcționa online, în funcție de browser.","Clara hört zu … Sprich jetzt deine Frage.":"Clara ascultă … Spune-ți întrebarea acum."," – ich sende deine Frage an Clara.":" – îți trimit întrebarea către Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"Înregistrarea s-a încheiat. Atinge din nou microfonul pentru a încerca iar.","Sprachaufnahme wird beendet …":"Înregistrarea vocală se oprește …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"Funcția microfonului necesită o conexiune HTTPS securizată.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"Acest browser nu acceptă recunoașterea vocală integrată. Folosește Chrome sau scrie-i Clarei.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"Nu am înțeles. Încearcă din nou sau scrie întrebarea.","Das Backend hat keine gültige Antwort geliefert.":"Serverul nu a returnat un răspuns valid.","Clara hat eine leere Antwort erhalten.":"Clara a primit un răspuns gol.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara nu este disponibilă momentan. Verifică conexiunea la internet și încearcă din nou.","Ich prüfe deine freigegebenen persönlichen Angaben …":"Verific informațiile personale pe care i-ai permis Clarei să le folosească …","Clara bereitet deine Antwort vor …":"Clara îți pregătește răspunsul …"}};
function restoreClaraGermanText(){
 const reverse=new Map();
 Object.keys(CLARA_I18N).forEach(locale=>{
  Object.entries({...CLARA_CHAT_I18N[locale],...CLARA_I18N[locale]}).forEach(([german,translated])=>{
   if(typeof translated==='string'&&translated)reverse.set(String(translated).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim(),german);
  });
 });
 const normalize=value=>String(value||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
  const raw=node.nodeValue,key=normalize(raw),german=reverse.get(key);
  if(german&&key)node.nodeValue=raw.replace(key,german);
 }
 document.querySelectorAll('input[placeholder],textarea[placeholder],button[title],[aria-label]').forEach(el=>{
  ['placeholder','title','aria-label'].forEach(attr=>{
   const value=el.getAttribute(attr);if(!value)return;
   const key=normalize(value),german=reverse.get(key);if(german)el.setAttribute(attr,german);
  });
 });
 document.querySelectorAll('select option').forEach(el=>{
  const key=normalize(el.textContent),german=reverse.get(key);if(german)el.textContent=german;
 });
}
function translateClaraPage(){
 const lang=claraLang();
 const dict={...(CLARA_CHAT_I18N[lang]||{}),...(CLARA_I18N[lang]||{})};
 if(lang==='de'){restoreClaraGermanText();return;}
 if(!CLARA_I18N[lang])return;
 // Translate the landing-page copy through stable element selectors as well as the
 // generic text-node walker below. This avoids missed/split text nodes in the hero.
 const setDirectText=(selector,source)=>{
  const el=document.querySelector(selector);if(!el)return;
  const translated=dict[source];if(!translated)return;
  const walker=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
  let node;
  while((node=walker.nextNode())){if(!node.nodeValue.trim()||node.parentElement?.closest('[aria-hidden="true"],svg'))continue;node.nodeValue=node.nodeValue.replace(node.nodeValue.trim(),translated);return;}
 };
 const setPlainText=(selector,source)=>{
  const el=document.querySelector(selector);if(el&&dict[source])el.textContent=dict[source];
 };
 const homeLink=document.querySelector('.site-nav a[href="#marketing-home"]');if(homeLink&&dict['Startseite'])homeLink.textContent=dict['Startseite'];
 const destinationsLink=document.querySelector('.site-nav a[href="#featured-destinations"]');if(destinationsLink&&dict['Reiseziele'])destinationsLink.textContent=dict['Reiseziele'];
 const navActions=[...document.querySelectorAll('.site-nav a[onclick]')];
 ['Reiseplaner','Genussreise','Claras Geschichten','Über Clara'].forEach((key,index)=>{
  const el=navActions[index];if(!el||!dict[key])return;
  el.textContent=dict[key];
 });
 const mobileLinks=[...document.querySelectorAll('.mobile-site-nav a')];
 ['Startseite','Reiseziele','Reiseplaner','Genussreise','Claras Geschichten','Über Clara'].forEach((key,index)=>{
  const el=mobileLinks[index];if(el&&dict[key])el.textContent=dict[key];
 });
 setPlainText('.desktop-cta-label','Clara fragen');
 const footer=document.querySelector('.site-footer');
 if(footer){const lines=footer.querySelectorAll(':scope > div');const tagline=lines[0]?.querySelector('div');if(tagline&&dict['Clara Travel AI · Deine Reise beginnt mit einem Gespräch'])tagline.textContent=dict['Clara Travel AI · Deine Reise beginnt mit einem Gespräch'];if(lines[1]&&dict['Von Passau bis zum Donaudelta · Reiseinspiration entlang Europas Donau'])lines[1].textContent=dict['Von Passau bis zum Donaudelta · Reiseinspiration entlang Europas Donau'];}
 setDirectText('.welcome-pill','Willkommen an der Donau');
 const heroTitle=document.getElementById('landingHeroTitle');
 if(heroTitle&&lang!=='de')heroTitle.innerHTML=(dict['Entdecke Europas']||'Entdecke Europas')+'<br>'+(dict['Donau mit Clara']||'Donau mit Clara');
 setDirectText('.hero-copy > p','Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss.');
 setDirectText('.hero-buttons .hero-button.primary','Reiseziele entdecken');
 setDirectText('.hero-buttons .hero-button.secondary','Clara kennenlernen');
 setDirectText('#claraWelcomeStatus','Clara bereitet ihre Begrüßung vor …');
 setDirectText('.featured-section .section-kicker','Die schönsten Orte · 12 Donaustationen + 1 Landausflug');
 setPlainText('#featuredTitle','Entlang der Donau – alle Reiseziele');
 setDirectText('.destination-intro','Entdecke jede Station mit Kurzbeschreibung, aktueller Ortszeit und Wetter. Der Donaupegel wird erst angezeigt, wenn eine offizielle Messstation eindeutig zugeordnet ist.');
 document.querySelectorAll('[data-clara-i18n]').forEach(el=>{
  const key=el.getAttribute('data-clara-i18n');
  if(dict[key])el.textContent=dict[key];
 });
 const reverse=new Map();
 Object.keys(CLARA_I18N).forEach(locale=>Object.entries({...CLARA_CHAT_I18N[locale],...CLARA_I18N[locale]}).forEach(([de,value])=>{if(typeof value==='string'&&value)reverse.set(value,de);}));
 const normalize=v=>String(v||'').replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();
 const walker=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);
 let node;
 while((node=walker.nextNode())){
  const raw=node.nodeValue, key=normalize(raw);
  const source=reverse.get(key)||key;
  if(dict[source]){const translated=raw.replace(key,dict[source]);if(translated!==raw)node.nodeValue=translated;}
 }
 document.querySelectorAll('input[placeholder],textarea[placeholder],button[title],[aria-label]').forEach(el=>{
  ['placeholder','title','aria-label'].forEach(attr=>{const value=el.getAttribute(attr);if(!value)return;const key=normalize(value);const source=reverse.get(key)||key;if(dict[source])el.setAttribute(attr,dict[source]);});
 });
 document.querySelectorAll('select option').forEach(el=>{const key=normalize(el.textContent);const source=reverse.get(key)||key;if(dict[source])el.textContent=dict[source];});
}
let claraTranslationObserver;
let claraTranslationTimer=null;
function observeClaraDynamicContent(){
 if(claraTranslationObserver||!document.body||!window.MutationObserver)return;
 claraTranslationObserver=new MutationObserver(records=>{
  // Batch DOM updates into one translation pass instead of repeatedly
  // walking the complete page while components are rendering.
  if(!records.some(record=>record.type==='childList')||claraTranslationTimer!==null)return;
  claraTranslationTimer=setTimeout(()=>{
   claraTranslationTimer=null;
   translateClaraPage();
  },120);
 });
 claraTranslationObserver.observe(document.body,{subtree:true,childList:true});
}

const CLARA_LANGUAGES=Object.freeze({de:{label:'Deutsch',locale:'de-DE'},en:{label:'English',locale:'en-GB'},nl:{label:'Nederlands',locale:'nl-NL'},fr:{label:'Français',locale:'fr-FR'},ro:{label:'Română',locale:'ro-RO'}});
function setClaraLanguage(code,refreshWeather=true){
  if(!Object.prototype.hasOwnProperty.call(CLARA_LANGUAGES,code))return;
  document.documentElement.lang=code;
  try{localStorage.setItem('clara.language',code);}catch(_){}
  ['landingLanguage','appLanguage','creatorLanguage'].forEach(id=>{const el=document.getElementById(id);if(el){if(id==='creatorLanguage'){const match=[...el.options].find(o=>o.textContent.trim()===CLARA_LANGUAGES[code].label);if(match)el.value=match.value;}else el.value=code;}});
  document.querySelectorAll('.language-switch select').forEach(el=>{if(el.value!==code)el.value=code;});
  translateClaraPage();
  observeClaraDynamicContent();
  if(typeof renderFeaturedDestinations==='function')renderFeaturedDestinations();
  const featured=places.filter(p=>['Passau','Melk','Bratislava','Russe','Puszta'].includes(p.name));
  const destinations=document.getElementById('destinations');if(destinations)destinations.innerHTML=featured.map(placeCard).join('');
  updateCityClocks();
  if(refreshWeather&&typeof loadCityWeather==='function')loadCityWeather();
}
function restoreClaraLanguage(){
  // Deutsch ist die Standardsprache für neue Besucher. Eine bewusst gewählte
  // Sprache bleibt erhalten und wird nach dem Neuladen wiederhergestellt.
  let language='de';
  try{
    const saved=localStorage.getItem('clara.language');
    if(Object.prototype.hasOwnProperty.call(CLARA_LANGUAGES,saved))language=saved;
  }catch(_){}
  setClaraLanguage(language,true);
}
const CLARA_WELCOME_TEXT=Object.freeze({
 de:'Hallo und herzlich willkommen! Ich bin Clara, deine Reisebegleiterin entlang der Donau. Schön, dass du da bist! Wohin soll unsere gemeinsame Reise gehen?',
 en:'Hello and welcome! I’m Clara, your travel companion along the Danube. It’s lovely to have you here! Where shall our journey begin?',
 nl:'Hallo en hartelijk welkom! Ik ben Clara, je reisgenoot langs de Donau. Fijn dat je er bent! Waar begint onze reis?',
 fr:'Bonjour et bienvenue ! Je suis Clara, votre compagne de voyage le long du Danube. Ravie de vous accueillir ! Où commence notre voyage ?',
 ro:'Bun venit! Sunt Clara, însoțitoarea ta de călătorie de-a lungul Dunării. Mă bucur că ești aici! Unde începe călătoria noastră?'
});
function updateClaraWelcome(){
 const lang=claraLang();
 const greeting=CLARA_WELCOME_TEXT[lang]||CLARA_WELCOME_TEXT.de;
 const text=document.getElementById('claraWelcomeGreeting');
 if(text)text.textContent=greeting;
 document.documentElement.lang=lang;
 return greeting;
}
function playClaraWelcome(){
 updateClaraWelcome();
 const video=document.querySelector('.clara-welcome-hero video.hero-scene-video');
 const status=document.getElementById('claraWelcomeStatus');
 if(!video){
  if(status)status.textContent='Das Clara-Begrüßungsvideo wurde auf dieser Seite nicht gefunden.';
  return;
 }
 // The welcome MP4 already contains its synchronized picture and original soundtrack.
 // Do not generate a second Azure voice track over this video.
 stopClaraSpeech();
 video.pause();
 try{video.currentTime=0;}catch(_){}
 video.muted=false;
 video.loop=false;
 video.playsInline=true;
 video.controls=true;
 video.onended=()=>{
  video.pause();
  video.controls=false;
  video.muted=true;
  try{video.currentTime=0;}catch(_){}
  if(status)status.textContent='Claras Begrüßung ist zu Ende.';
 };
 video.onerror=()=>{
  video.controls=false;
  video.muted=true;
  if(status)status.textContent='Das Begrüßungsvideo konnte nicht geladen werden. Bitte lade die Seite neu.';
 };
 if(status)status.textContent='Claras Begrüßung wird mit der originalen Tonspur abgespielt.';
 const playPromise=video.play();
 if(playPromise&&typeof playPromise.catch==='function'){
  playPromise.catch(error=>{
   video.controls=false;
   video.muted=true;
   if(status)status.textContent='Die Videowiedergabe wurde vom Browser blockiert. Bitte erneut auf „Clara kennenlernen“ klicken.';
   console.warn('Clara-Begrüßung konnte nicht gestartet werden:',error);
  });
 }
}
document.addEventListener('DOMContentLoaded',()=>{try{history.replaceState({claraTravelAI:true,view:'landing',page:'home'},'',window.location.href);}catch(_){}restoreClaraLanguage();restoreClaraConnection();const welcomeButton=document.getElementById('claraWelcomeSpeak');if(welcomeButton)welcomeButton.hidden=false;const welcomeStatus=document.getElementById('claraWelcomeStatus');if(welcomeStatus)welcomeStatus.textContent='Klicke auf „Clara kennenlernen“, um ihre Stimme zu hören.';updateClaraWelcome();const chatVideo=document.getElementById('claraChatVideo');if(chatVideo){const positionMouth=()=>updateClaraVisemeMouthPosition(chatVideo);if(chatVideo.readyState>=1)positionMouth();else chatVideo.addEventListener('loadedmetadata',positionMouth,{once:true});window.addEventListener('resize',positionMouth,{passive:true});}const heroVideo=document.querySelector('.clara-welcome-hero video.hero-scene-video');if(heroVideo){heroVideo.muted=true;heroVideo.autoplay=false;heroVideo.loop=true;heroVideo.playsInline=true;heroVideo.pause();const holdHeroFrame=()=>{heroVideo.pause();if(heroVideo.currentTime>0.05){try{heroVideo.currentTime=0;}catch(_){}}};heroVideo.addEventListener('loadedmetadata',holdHeroFrame,{once:true});if(heroVideo.readyState>=1)holdHeroFrame();}const auto=document.getElementById('claraAutoSpeak');if(auto){try{auto.checked=localStorage.getItem('clara.autoSpeak')!=='false';}catch(_){auto.checked=true;}auto.addEventListener('change',()=>{try{localStorage.setItem('clara.autoSpeak',String(auto.checked));}catch(_){}if(!auto.checked)stopClaraSpeech();});}const rate=document.getElementById('claraRate');if(rate){rate.disabled=true;rate.title='Das Tempo wird derzeit durch Azure vorgegeben.';}loadClaraVoices();});



// Expose functions used by the HTML controls explicitly. This also makes
// failures caused by stale or partially loaded preview scripts easier to detect.
Object.assign(window,{
  openAppPage,showPage,returnToLanding,playClaraWelcome,
  speakClara,stopClaraSpeech,sendChat,startClaraListening,
  setClaraLanguage,quickAsk,makePlan
});
