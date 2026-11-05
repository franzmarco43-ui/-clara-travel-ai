
const places=[
{name:'Passau',country:'Deutschland',emoji:'⛪',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Panorama%20Dom%20Passau.jpg',tag:'Drei-Flüsse-Stadt',desc:'Historische Altstadt am Zusammenfluss von Donau, Inn und Ilz.',lat:48.574,lon:13.461,routeType:'river'},
{name:'Linz',country:'Österreich',emoji:'🎨',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Linz_Ars_Electronica_center-5529.jpg',tag:'Kunst & Donauufer',desc:'Kultur, moderne Kunst und Spaziergänge an der Donau.',lat:48.307,lon:14.286,routeType:'river'},
{name:'Melk',country:'Österreich',emoji:'🏰',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Melk_Abbey.jpg',tag:'Stift & Wachau',desc:'Barockes Stift und die bezaubernde Wachau entdecken.',lat:48.228,lon:15.332,routeType:'river'},
{name:'Weißenkirchen',country:'Österreich',emoji:'🍇',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Wei%C3%9Fenkirchen_in_der_Wachau%2C_20210728_1212_0700.jpg',tag:'Wachau & Wein',desc:'Weinorte, Marillen und Spaziergänge durch die Wachauer Landschaft.',lat:48.397,lon:15.469,routeType:'river'},
{name:'Wien',country:'Österreich',emoji:'🎻',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Wien%20Schoenbrunn.jpg',tag:'Kaiserliche Kultur',desc:'Kaffeehauskultur, Museen und imperiale Geschichte.',lat:48.208,lon:16.374,routeType:'river'},
{name:'Bratislava',country:'Slowakei',emoji:'🏛️',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Bratislava_Castle.jpg',tag:'Altstadt & Burg',desc:'Gassen der Altstadt und Ausblicke von der Burg.',lat:48.149,lon:17.108,routeType:'river'},
{name:'Esztergom',country:'Ungarn',emoji:'⛪',image:'https://upload.wikimedia.org/wikipedia/commons/thumb/1/12/Basilica_in_Esztergom%2C_Hungary_01.jpg/960px-Basilica_in_Esztergom%2C_Hungary_01.jpg',tag:'Basilika & Donauknie',desc:'Monumentale Basilika, Burgviertel und Ausblicke am ungarischen Donauknie.<br><small>Foto: <a href="https://commons.wikimedia.org/wiki/File:Basilica_in_Esztergom,_Hungary_01.jpg" target="_blank" rel="noopener">Pudelek · Wikimedia Commons (CC BY-SA 4.0)</a></small>',lat:47.785,lon:18.741,routeType:'river'},
{name:'Budapest',country:'Ungarn',emoji:'🌉',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Hungarian_Parliament_Budapest.jpg',tag:'Thermen & Kulinarik',desc:'Donaupanorama, Thermalbäder und ungarische Küche.',lat:47.498,lon:19.040,routeType:'river'},
{name:'Novi Sad',country:'Serbien',emoji:'🎨',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Most%20slobode%20preko%20Dunava%2C%20Novi%20Sad.jpg',tag:'Kultur an der Donau',desc:'Lebendige Plätze und die Festung Petrovaradin.',lat:45.267,lon:19.833,routeType:'river'},
{name:'Belgrad',country:'Serbien',emoji:'🌆',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Church%20of%20Saint%20Sava%20%2813807900093%29.jpg',tag:'Stadt am Zusammenfluss',desc:'Kalemegdan, Flussblicke und serbische Spezialitäten.',lat:44.787,lon:20.449,routeType:'river'},
{name:'Russe',country:'Bulgarien',emoji:'🏛️',image:'https://obshtinaruse.bg/upload/images/articles/31425f2a57683a29e74d639b526cd46d.JPG',tag:'Kleines Wien an der Donau',desc:'Architektur, Donauufer und die römische Festung Sexaginta Prista.',lat:43.852656,lon:25.949764,routeType:'river'},
{name:'Donaudelta',country:'Rumänien',emoji:'🛶',image:'https://commons.wikimedia.org/wiki/Special:FilePath/White_pelicans_(Pelecanus_onocrotalus)_Danube_delta.jpg',tag:'Wildnis & Wasserwege',desc:'Kanäle, Vogelwelt und besondere Naturerlebnisse.',lat:45.180,lon:28.800,routeType:'river'},
{name:'Puszta',country:'Ungarn',emoji:'🐎',image:'https://commons.wikimedia.org/wiki/Special:FilePath/Hortobagy%20puszta.jpg',tag:'Natur & Tradition · Landausflug',desc:'Weite Landschaften und die Kultur der ungarischen Tiefebene – als separater Ausflug ab Budapest.',lat:47.583,lon:21.150,routeType:'excursion'}
];
function renderFeaturedDestinations(){
 const featuredNames=['Linz','Wien','Budapest','Belgrad'];
 const container=document.getElementById('featured-grid');
 if(!container)return;
 container.innerHTML=featuredNames.map(name=>{
  const p=places.find(place=>place.name===name);
  if(!p)return '';
  return `<article class="featured-card">
   <img src="${p.image}" alt="${p.name} an der Donau" loading="lazy">
   <div class="featured-card-shade" aria-hidden="true"></div>
   <div class="featured-card-content">
    <h3>${p.name}</h3>
    <div class="country">${p.country}</div>
    <button class="discover" type="button" onclick="openDestination('${p.name}')">Entdecken <span aria-hidden="true">→</span></button>
   </div>
  </article>`;
 }).join('');
 updateFeaturedCarousel();
}
function updateFeaturedCarousel(){
 const container=document.getElementById('featured-grid');
 const dots=document.getElementById('featured-dots');
 if(!container||!dots)return;
 const cards=[...container.querySelectorAll('.featured-card')];
 dots.innerHTML=cards.map((_,index)=>`<button type="button" aria-label="Reiseziel ${index+1} anzeigen" class="${index===0?'active':''}" onclick="scrollFeaturedTo(${index})"></button>`).join('');
}
function scrollFeaturedTo(index){
 const container=document.getElementById('featured-grid');
 const card=container?.querySelectorAll('.featured-card')[index];
 if(!container||!card)return;
 container.scrollTo({left:card.offsetLeft-container.offsetLeft,behavior:'smooth'});
}
function scrollFeaturedCarousel(direction){
 const container=document.getElementById('featured-grid');
 if(!container)return;
 container.scrollBy({left:direction*Math.max(220,container.clientWidth*.82),behavior:'smooth'});
}
function renderLandingDanubeMap(){
 const host=document.getElementById('landingDanubeMap');
 if(!host)return;
 const stops=[
  {name:'Linz',x:7,y:57},{name:'Melk',x:21,y:27},{name:'Wien',x:35,y:58},
  {name:'Bratislava',x:48,y:31},{name:'Budapest',x:62,y:68},{name:'Puszta',x:73,y:24},
  {name:'Belgrad',x:85,y:57},{name:'Donaudelta',x:96,y:31}
 ];
 const points=stops.map(stop=>`${stop.x*10},${stop.y*3}`).join(' ');
 host.innerHTML=`<div class="landing-route">
  <svg class="landing-route-line" viewBox="0 0 1000 300" preserveAspectRatio="none" aria-hidden="true">
   <path d="M 35 171 C 105 68, 150 60, 210 81 S 300 236, 350 174 S 430 57, 480 93 S 560 241, 620 204 S 690 43, 735 75 S 820 236, 850 171 S 930 57, 970 93" fill="none" stroke="#79aeb0" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/>
   <path d="M 35 171 C 105 68, 150 60, 210 81 S 300 236, 350 174 S 430 57, 480 93 S 560 241, 620 204 S 690 43, 735 75 S 820 236, 850 171 S 930 57, 970 93" fill="none" stroke="#ffffff" stroke-width="2" stroke-dasharray="3 13" stroke-linecap="round"/>
  </svg>
  ${stops.map(stop=>{
   const place=places.find(item=>item.name===stop.name);
   if(!place)return '';
   return `<button type="button" class="landing-route-stop" style="--stop-x:${stop.x}%;--stop-y:${stop.y}%" onclick="openDestination('${stop.name}')" aria-label="${stop.name} entdecken">
    <span class="route-thumb" style="background-image:url('${place.image}')"></span>
    <span class="route-name">${stop.name}</span>
   </button>`;
  }).join('')}
 </div>`;
}
renderFeaturedDestinations();
renderLandingDanubeMap();
window.addEventListener('resize',updateFeaturedCarousel);
const cityTimeZones={'Passau':'Europe/Berlin','Linz':'Europe/Vienna','Melk':'Europe/Vienna','Weißenkirchen':'Europe/Vienna','Wien':'Europe/Vienna','Bratislava':'Europe/Bratislava','Esztergom':'Europe/Budapest','Budapest':'Europe/Budapest','Puszta':'Europe/Budapest','Novi Sad':'Europe/Belgrade','Belgrad':'Europe/Belgrade','Russe':'Europe/Sofia','Donaudelta':'Europe/Bucharest'};
const weatherLabels={
 de:{0:'Klar',1:'Überwiegend klar',2:'Teilweise bewölkt',3:'Bewölkt',45:'Nebel',48:'Nebel mit Reif',51:'Leichter Nieselregen',53:'Nieselregen',55:'Starker Nieselregen',61:'Leichter Regen',63:'Regen',65:'Starker Regen',71:'Leichter Schnee',73:'Schneefall',75:'Starker Schneefall',80:'Regenschauer',81:'Regenschauer',82:'Starke Regenschauer',95:'Gewitter',96:'Gewitter mit Hagel',99:'Starkes Gewitter'},
 en:{0:'Clear',1:'Mainly clear',2:'Partly cloudy',3:'Overcast',45:'Fog',48:'Depositing rime fog',51:'Light drizzle',53:'Drizzle',55:'Heavy drizzle',61:'Light rain',63:'Rain',65:'Heavy rain',71:'Light snow',73:'Snowfall',75:'Heavy snow',80:'Rain showers',81:'Rain showers',82:'Heavy rain showers',95:'Thunderstorm',96:'Thunderstorm with hail',99:'Severe thunderstorm'},
 nl:{0:'Helder',1:'Overwegend helder',2:'Half bewolkt',3:'Bewolkt',45:'Mist',48:'Rijpmist',51:'Lichte motregen',53:'Motregen',55:'Zware motregen',61:'Lichte regen',63:'Regen',65:'Zware regen',71:'Lichte sneeuw',73:'Sneeuwval',75:'Zware sneeuwval',80:'Regenbuien',81:'Regenbuien',82:'Zware regenbuien',95:'Onweer',96:'Onweer met hagel',99:'Zwaar onweer'},
 fr:{0:'Dégagé',1:'Principalement dégagé',2:'Partiellement nuageux',3:'Couvert',45:'Brouillard',48:'Brouillard givrant',51:'Bruine légère',53:'Bruine',55:'Bruine forte',61:'Pluie légère',63:'Pluie',65:'Forte pluie',71:'Neige légère',73:'Chutes de neige',75:'Fortes chutes de neige',80:'Averses',81:'Averses',82:'Fortes averses',95:'Orage',96:'Orage avec grêle',99:'Orage violent'},
 ro:{0:'Senin',1:'Mai mult senin',2:'Parțial noros',3:'Noros',45:'Ceață',48:'Ceață cu chiciură',51:'Burniță ușoară',53:'Burniță',55:'Burniță puternică',61:'Ploaie ușoară',63:'Ploaie',65:'Ploaie abundentă',71:'Ninsoare ușoară',73:'Ninsoare',75:'Ninsoare abundentă',80:'Averse',81:'Averse',82:'Averse puternice',95:'Furtună',96:'Furtună cu grindină',99:'Furtună severă'}
};
const liveLabels={
 de:{time:'Datum & Ortszeit',weather:'Wetterstand',weatherUnavailable:'Aktuell nicht verfügbar',weatherError:'Wetterdaten konnten nicht geladen werden.',clock:'Uhr'},
 en:{time:'Local date & time',weather:'Weather updated',weatherUnavailable:'Currently unavailable',weatherError:'Weather data could not be loaded.',clock:''},
 nl:{time:'Lokale datum & tijd',weather:'Weer bijgewerkt',weatherUnavailable:'Momenteel niet beschikbaar',weatherError:'Weergegevens konden niet worden geladen.',clock:'uur'},
 fr:{time:'Date et heure locales',weather:'Météo mise à jour',weatherUnavailable:'Indisponible actuellement',weatherError:'Impossible de charger les données météo.',clock:''},
 ro:{time:'Data și ora locală',weather:'Actualizare meteo',weatherUnavailable:'Indisponibil momentan',weatherError:'Datele meteo nu au putut fi încărcate.',clock:'ora'}
};
function currentClaraLocale(){const lang=localStorage.getItem('clara.language')||'de';return {de:'de-DE',en:'en-GB',nl:'nl-NL',fr:'fr-FR',ro:'ro-RO'}[lang]||'de-DE';}
function updateCityClocks(){const lang=localStorage.getItem('clara.language')||'de';const labels=liveLabels[lang]||liveLabels.de;document.querySelectorAll('[data-city-live]').forEach(card=>{const zone=cityTimeZones[card.dataset.cityLive];if(!zone)return;const now=new Date();const date=new Intl.DateTimeFormat(currentClaraLocale(),{timeZone:zone,day:'2-digit',month:'2-digit',year:'numeric'}).format(now);const time=new Intl.DateTimeFormat(currentClaraLocale(),{timeZone:zone,hour:'2-digit',minute:'2-digit',second:'2-digit',hour12:false}).format(now);const el=card.querySelector('[data-live-time]');if(el)el.textContent=date+' · '+time+(labels.clock?' '+labels.clock:'');});}
async function loadCityWeather(){const cards=[...document.querySelectorAll('[data-city-live]')].filter(card=>card.getClientRects().length>0);await Promise.all(cards.map(async card=>{const p=places.find(x=>x.name===card.dataset.cityLive);const el=card.querySelector('[data-live-weather]');if(!p||!el)return;const lang=localStorage.getItem('clara.language')||'de';const labels=liveLabels[lang]||liveLabels.de;try{const url='https://api.open-meteo.com/v1/forecast?latitude='+encodeURIComponent(p.lat)+'&longitude='+encodeURIComponent(p.lon)+'&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone='+encodeURIComponent(cityTimeZones[p.name]||'auto');const response=await fetch(url,{cache:'no-store'});if(!response.ok)throw new Error('Weather provider unavailable');const data=await response.json(),c=data.current;if(!c||typeof c.temperature_2m!=='number')throw new Error('No current weather values');el.textContent=((weatherLabels[lang]||weatherLabels.de)[c.weather_code]||'Weather')+' · '+Math.round(c.temperature_2m)+' °C';const stamp=card.querySelector('[data-live-updated]');if(stamp)stamp.textContent=labels.weather+': '+new Intl.DateTimeFormat(currentClaraLocale(),{timeZone:cityTimeZones[p.name],hour:'2-digit',minute:'2-digit'}).format(new Date(c.time))+(labels.clock?' '+labels.clock:'')+' · Open-Meteo';}catch(error){el.textContent=labels.weatherUnavailable;const stamp=card.querySelector('[data-live-updated]');if(stamp)stamp.textContent=labels.weatherError;}}));}
function placeCard(p){return `<article class="destination"><div class="dest-img" style="background-image:linear-gradient(180deg,#102f2820,#102f2866),url('${p.image}');background-size:cover;background-position:center" role="img" aria-label="Ansicht von ${p.name}"><span>${p.country}</span></div><div class="dest-info"><h3>${p.name}</h3><p>${p.desc}</p><div class="city-live" data-city-live="${p.name}"><div class="city-live-row"><b>📅 Datum & Ortszeit</b><span data-live-time>Wird geladen …</span></div><div class="city-live-row"><b>🌤 Wetter</b><span data-live-weather>Wird geladen …</span></div><div class="city-live-row"><b>🌊 Donaupegel</b><span data-live-level>Noch keine verifizierte Messstelle zugeordnet</span></div><small data-live-updated>Live-Daten werden abgerufen …</small></div><button onclick="selectDestination('${p.name}')">Mit Clara entdecken →</button></div></article>`}
const featuredPlaceNames=['Passau','Melk','Bratislava','Russe','Puszta'];
const displayPlaces=[...places.filter(p=>featuredPlaceNames.includes(p.name)),...places.filter(p=>!featuredPlaceNames.includes(p.name))];
document.getElementById('destinations').innerHTML=displayPlaces.map(placeCard).join('');
document.getElementById('mapDestinations').innerHTML=displayPlaces.map(placeCard).join('');
updateCityClocks();setInterval(updateCityClocks,1000);loadCityWeather();
document.getElementById('destination').innerHTML=places.map(p=>`<option>${p.name}</option>`).join('');
const riverRoutePlaces=places.filter(p=>p.routeType==='river');
document.getElementById('routeList').innerHTML=riverRoutePlaces.map((p,i)=>`<button type="button" class="route-point" onclick="focusDanubeStop('${p.name}')"><span class="route-number">${i+1}</span><span>${p.name}</span><span class="route-country">${p.country}</span></button>`).join('');
let danubeMapInstance=null;
const danubeMarkers={};
function initDanubeMap(){
  const host=document.getElementById('danubeMap');
  if(!host)return;
  if(!window.L){
    host.innerHTML='<div style="padding:22px;color:#53645d">Die interaktive Karte konnte nicht geladen werden. Bitte prüfe deine Internetverbindung; die Stationsliste bleibt verfügbar.</div>';
    return;
  }
  if(danubeMapInstance){setTimeout(()=>danubeMapInstance.invalidateSize(),120);return;}
  danubeMapInstance=L.map(host,{scrollWheelZoom:false}).setView([46.9,20.0],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{
    maxZoom:18,
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'
  }).addTo(danubeMapInstance);
  const riverStops=riverRoutePlaces;
  const routeLine=L.polyline(riverStops.map(p=>[p.lat,p.lon]),{
    color:'#c79b53',weight:3,opacity:.85,dashArray:'7 8',lineCap:'round'
  }).addTo(danubeMapInstance);
  routeLine.bindTooltip('Schematische Verbindung der Reise-Stationen',{sticky:true});
  riverStops.forEach((p,i)=>{
    const icon=L.divIcon({className:'route-marker',html:`<span>${i+1}</span>`,iconSize:[29,29],iconAnchor:[14,14]});
    const marker=L.marker([p.lat,p.lon],{icon}).addTo(danubeMapInstance);
    marker.bindPopup(`<strong>${p.name}</strong><br><span>${p.tag}</span><br><small>${p.country}</small>`);
    danubeMarkers[p.name]=marker;
  });
  const puszta=places.find(p=>p.routeType==='excursion');
  const budapest=riverStops.find(p=>p.name==='Budapest');
  if(puszta&&budapest){
    const excursionIcon=L.divIcon({className:'route-marker excursion',html:'<span>✦</span>',iconSize:[29,29],iconAnchor:[14,14]});
    const marker=L.marker([puszta.lat,puszta.lon],{icon:excursionIcon}).addTo(danubeMapInstance);
    marker.bindPopup('<strong>Puszta – Landausflug</strong><br><span>Separater Ausflug, keine Donaustation</span>');
    danubeMarkers[puszta.name]=marker;
    L.polyline([[budapest.lat,budapest.lon],[puszta.lat,puszta.lon]],{color:'#4c8c79',weight:2,dashArray:'3 8',opacity:.9}).addTo(danubeMapInstance).bindTooltip('Land-Ausflug ab Budapest');
  }
  const allPlaces=places;
  danubeMapInstance.fitBounds(L.latLngBounds(allPlaces.map(p=>[p.lat,p.lon])),{padding:[24,24]});
  setTimeout(()=>danubeMapInstance.invalidateSize(),120);
}
function focusDanubeStop(name){
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
    if(!Array.isArray(data.records)||!data.records.length)throw new Error('Die Schleusendatenbank ist leer.');
    danubeLockRecords=data.records;
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
function initDanubeLocksMap(){
  const host=document.getElementById('locksMap');
  if(!host||!window.L||!danubeLockRecords.length)return;
  if(danubeLocksMap){setTimeout(()=>danubeLocksMap.invalidateSize(),120);return;}
  danubeLocksMap=L.map(host,{scrollWheelZoom:false}).setView([48.2,15.5],5);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a>'}).addTo(danubeLocksMap);
  danubeLockRecords.forEach((lock,index)=>{
    if(typeof lock.latitude!=='number'||typeof lock.longitude!=='number')return;
    const icon=L.divIcon({className:'lock-map-marker',html:'<span>'+(index+1)+'</span>',iconSize:[25,25],iconAnchor:[12,12]});
    const marker=L.marker([lock.latitude,lock.longitude],{icon}).addTo(danubeLocksMap);
    marker.bindPopup('<b>'+escapeLockHtml(lock.name)+'</b><br>'+escapeLockHtml(lock.country)+'<br>Strom-km '+escapeLockHtml(lock.riverKm));
    marker.on('click',()=>selectLock(index,false));
    danubeLockMarkers[index]=marker;
  });
  const points=danubeLockRecords.filter(lock=>typeof lock.latitude==='number'&&typeof lock.longitude==='number').map(lock=>[lock.latitude,lock.longitude]);
  if(points.length)danubeLocksMap.fitBounds(L.latLngBounds(points),{padding:[20,20]});
  setTimeout(()=>danubeLocksMap.invalidateSize(),120);
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
    ['Telefon',lock.phone],
    ['Betreiber / Zuständigkeit',lock.operator],
    ['Inbetriebnahme',lock.operationYear]
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
function openAppPage(page){document.getElementById('marketing-home').style.display='none';document.getElementById('clara-app').style.display='block';showPage(page);}
function openDestination(name){openAppPage('planner');selectDestination(name);}
function returnToLanding(){document.getElementById('clara-app').style.display='none';document.getElementById('marketing-home').style.display='block';window.scrollTo({top:0,behavior:'smooth'});}

function showPage(page){document.querySelectorAll('.page').forEach(x=>x.classList.add('hidden'));const activePage=document.getElementById('page-'+page);activePage.classList.remove('hidden');if(typeof loadCityWeather==='function')loadCityWeather();document.querySelectorAll('[data-page]').forEach(x=>x.classList.toggle('active',x.dataset.page===page));if(page==='intelligence'&&!document.getElementById('intelligenceDestinations').dataset.rendered){renderClaraIntelligence();document.getElementById('intelligenceDestinations').dataset.rendered='true';}if(page==='map'){initDanubeMap();setTimeout(()=>danubeMapInstance&&danubeMapInstance.invalidateSize(),160)}if(page==='locks'){loadDanubeLocks()}window.scrollTo({top:0,behavior:'smooth'})}
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
    const lang=(()=>{try{return localStorage.getItem('clara.language')||'de';}catch(_){return 'de';}})();
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
  const heroVideo=document.querySelector('#marketing-home video.hero-scene-video');
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
  document.querySelectorAll('#page-home .avatar-stage, #page-clara .avatar-stage').forEach(el=>el.classList.toggle('speaking',active));
}
function startClaraVideo(){
  const video=getClaraSpeakingVideo();
  if(!video)return;
  video.muted=true;
  video.loop=true;
  video.playsInline=true;
  const playPromise=video.play();
  if(playPromise&&typeof playPromise.catch==='function')playPromise.catch(error=>console.warn('Clara-Video konnte nicht starten:',error));
}
function stopClaraVideo(){
  document.querySelectorAll('#marketing-home video.hero-scene-video, #page-home video.clara-welcome-video, #claraChatVideo').forEach(video=>{
    video.pause();
    try{video.currentTime=0;}catch(_){}
  });
}
function stopClaraSpeech(){
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
  const selectedLanguage=(()=>{try{return localStorage.getItem('clara.language')||'de';}catch(_){return 'de';}})();
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
async function speakClara(value,force=false){
  const auto=document.getElementById('claraAutoSpeak');
  if(!force&&auto&&!auto.checked)return;
  const text=claraSpeechText(value);
  if(!text)return;
  stopClaraSpeech();
  const status=document.getElementById('voiceStatus');
  const speechLanguage=(()=>{try{return localStorage.getItem('clara.language')||'de';}catch(_){return 'de';}})();
  const speechVoiceLabels={de:'Seraphina',en:'Sonia',nl:'Fenna',fr:'Denise',ro:'Alina'};
  const activeVoiceLabel=speechVoiceLabels[speechLanguage]||speechVoiceLabels.de;
  try{
    if(status)status.textContent='Clara bereitet ihre Antwort mit der '+activeVoiceLabel+'-Stimme vor …';
    const response=await fetch('/.netlify/functions/clara-speech',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({text:text.slice(0,1800),language:(localStorage.getItem("clara.language")||"de")})
    });
    if(!response.ok){
      let detail={};try{detail=await response.json();}catch(_){}
      throw new Error(detail.error||('Sprachausgabe fehlgeschlagen ('+response.status+')'));
    }
    const audioBlob=await response.blob();
    if(!audioBlob.size)throw new Error('Azure hat eine leere Audiodatei geliefert.');
    const audioBytes=await audioBlob.arrayBuffer();
    const AudioContextClass=window.AudioContext||window.webkitAudioContext;
    if(AudioContextClass&&claraAudioContext){
      if(claraAudioContext.state==='suspended')await claraAudioContext.resume();
      const decoded=await claraAudioContext.decodeAudioData(audioBytes.slice(0));
      claraAudioSource=claraAudioContext.createBufferSource();claraAudioSource.buffer=decoded;claraAudioSource.connect(claraAudioContext.destination);
      claraAudioSource.onended=()=>{setClaraSpeaking(false);stopClaraVideo();if(status)status.textContent='Sprachausgabe abgeschlossen.';claraAudioSource=null;};
      setClaraSpeaking(true);startClaraVideo();const welcomeButton=document.getElementById('claraWelcomeSpeak');if(welcomeButton)welcomeButton.hidden=true;const welcomeStatus=document.getElementById('claraWelcomeStatus');if(welcomeStatus)welcomeStatus.textContent='Clara begrüßt dich persönlich.';if(status)status.textContent='Clara spricht mit ihrer '+activeVoiceLabel+'-Stimme.';claraAudioSource.start(0);
    }else{
      claraAudioObjectUrl=URL.createObjectURL(audioBlob);claraAudioElement=new Audio(claraAudioObjectUrl);
      claraAudioElement.onplay=()=>{setClaraSpeaking(true);startClaraVideo();if(status)status.textContent='Clara spricht mit ihrer '+activeVoiceLabel+'-Stimme.';};
      claraAudioElement.onended=()=>{setClaraSpeaking(false);stopClaraVideo();if(status)status.textContent='Sprachausgabe abgeschlossen.';URL.revokeObjectURL(claraAudioObjectUrl);claraAudioObjectUrl=null;claraAudioElement=null;};
      await claraAudioElement.play();
    }
  }catch(error){
    console.error('Clara Azure Speech:',error);
    const welcomeButton=document.getElementById('claraWelcomeSpeak');const welcomeStatus=document.getElementById('claraWelcomeStatus');if(welcomeButton)welcomeButton.hidden=false;if(welcomeStatus)welcomeStatus.textContent='Clara konnte gerade nicht sprechen: '+(error.message||'Unbekannter Fehler')+'. Bitte prüfe die Verbindung und versuche es erneut.';if(status)status.textContent='Sprachausgabe nicht verfügbar: '+(error.message||'Verbindungsfehler')+'. Bitte später erneut versuchen.';
  }
}
function addMsg(text,who,sources=[],research=null){
  const box=document.getElementById('chatbox');
  const el=document.createElement('div');
  el.className='msg '+(who==='user'?'user':'');
  el.textContent=text;
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
async function getClaraMemoryContext(){if(!claraSupabase||!claraUser)return null;let profile=null,memories=[];try{const p=await claraSupabase.from('clara_profiles').select('display_name,interests,travel_pace,budget_level,preferences,consent_memory').eq('user_id',claraUser.id).maybeSingle();if(p.error)throw p.error;profile=p.data;if(!profile||profile.consent_memory!==true)return {profile:null,memories:[],consent:false};const m=await claraSupabase.from('clara_memories').select('memory_type,content,created_at').eq('user_id',claraUser.id).order('created_at',{ascending:false}).limit(30);if(m.error)throw m.error;memories=m.data||[];return {profile,memories,consent:true};}catch(e){console.warn('Memory-Abruf:',e);return null}}
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
    const CLARA_VOICE_PROFILE = Object.freeze({name:'Gentle Greta - Friendly',voiceId:'ecb08917b1f348e6a235e85eb0870b68',engine:'orca',language:'de',locale:'de-DE'});
    const voiceLock='\n\nVERBINDLICHES SPRECHERPROFIL – CLARA VOICE LOCK:\nFür jede zukünftige Sprachproduktion ausschließlich dieselbe festgelegte deutsche Frauenstimme verwenden: '+CLARA_VOICE_PROFILE.name+'; Voice-ID '+CLARA_VOICE_PROFILE.voiceId+'; Engine '+CLARA_VOICE_PROFILE.engine+'; Sprache '+CLARA_VOICE_PROFILE.language+'; Locale '+CLARA_VOICE_PROFILE.locale+'. Stimme niemals automatisch austauschen oder eine andere Stimme vorschlagen.';
    const identityLock='\n\nVERBINDLICHE VISUELLE IDENTITÄT – CLARA IDENTITY LOCK:\nClara ist in jeder Szene dieselbe virtuelle Frau. Verwende für alle Bildideen und Bildprompts dieselbe erwachsene Frau mit dem bereits festgelegten Erscheinungsbild: etwa 35 Jahre, braune Augen, lange dunkelbraune wellige Haare und ein freundlicher, natürlicher Gesichtsausdruck. Gesichtszüge, Augen, Haarfarbe, Haarlänge und Frisur dürfen zwischen Szenen niemals wechseln. Erzeuge keine zweite Person, keine neue Interpretation und keine wechselnden Gesichter. Variieren dürfen ausschließlich Kleidung passend zum Reiseziel, Pose, Kameraperspektive, Licht und Hintergrund. Sobald das Master-Porträt als Referenz bereitgestellt ist, muss es bei jeder einzelnen Szene als feste Identitätsreferenz verwendet werden; bis dahin die Bildprompts ausdrücklich als vorläufig markieren und keine angebliche Referenznutzung behaupten.\nFür jedes Reel: gib je Szene eine konkrete Bildidee plus einen Bildprompt aus, der ausdrücklich dieselbe Clara wie in der Master-Referenz verlangt. Füge am Ende eine kurze Kontinuitätsprüfung hinzu: Gesicht, Augen und Haare in allen Szenen identisch?';
    const message='Du bist Clara von Donau, eine sympathische virtuelle Reise- und Kulinarik-Influencerin mit eigener, warmer und authentischer Persönlichkeit. Erstelle einen veröffentlichungsfertigen Social-Media-Entwurf. Plattform: '+platform+'. Format: '+format+'. Sprache: '+language+'. Thema: '+topic+'. Zusatzwünsche: '+(brief||'keine')+'. Bei einem Reel liefere Hook, Szenenfolge mit Bildideen und Zeitangaben, pro Szene einen konkreten Bildprompt, gesprochenen Voice-over-Text, Texteinblendungen, Caption, passende Hashtags und einen Community-Aufruf. Bei Storys liefere vier einzelne Slides mit Bildidee und Text. Bei Beiträgen liefere Caption, Bildidee und Hashtags. Schreibe lebendig, nicht aufdringlich werblich und in Claras Ich-Stimme. Erfinde keine aktuellen Öffnungszeiten, Preise, Veranstaltungen oder persönlichen Erlebnisse. Kennzeichne Fakten, die vor Veröffentlichung geprüft werden müssen.'+voiceLock+identityLock;
    const response=await fetch('/.netlify/functions/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message,language:(localStorage.getItem('clara.language')||'de')})});
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
function claraChatText(key){const lang=(()=>{try{return localStorage.getItem('clara.language')||'de';}catch(_){return 'de';}})();return CLARA_CHAT_I18N[lang]?.[key]||key;}
async function sendChat(e){
  e.preventDefault();
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
      const response=await fetch('/.netlify/functions/chat',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({message:q,language:(localStorage.getItem('clara.language')||'de')})
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
  addMsg(a,'clara',sources,research);
  speakClara(a);
}
function quickAsk(q){showPage('clara');document.getElementById('chatInput').value=q;document.querySelector('.chatform').requestSubmit()}
let toastTimer;function toast(s){let el=document.getElementById('toast');el.textContent=s;el.classList.remove('hidden');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add('hidden'),2800)}

// Clara Memory 1.0 – Supabase integration. Uses only the public anon/publishable key with RLS.
let claraSupabase = null;
let claraUser = null;
let claraRecoveryTokenHash = null;
let claraRecoveryCode = null;
const CLARA_CONFIG_KEY = 'clara.travel.supabase.public.v1';
// Public browser configuration only. Never place a Supabase Secret/service_role key here.
const CLARA_DEFAULT_SUPABASE_URL = 'https://ufsglnhebhbmadwzftau.supabase.co';
const CLARA_DEFAULT_SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_5B9FYMgDQ0SJjCYEeJgPgA_4DD4o3rN'; // Public publishable key only; RLS remains the authorization boundary.
function memoryStatus(id,msg,isError=false){const el=document.getElementById(id);if(el){el.textContent=msg;el.style.color=isError?'#a33':'var(--muted)';}}
function connectSupabase(){
  const url=document.getElementById('sbUrl').value.trim();
  const key=document.getElementById('sbKey').value.trim();
  if(!url || !key){memoryStatus('sbStatus','Bitte Projekt-URL und öffentlichen Key eintragen.',true);return;}
  if(!/^https:\/\/[a-zA-Z0-9-]+\.supabase\.co$/.test(url)){memoryStatus('sbStatus','Die Projekt-URL sieht nicht korrekt aus. Erwartet wird https://….supabase.co',true);return;}
  if(!window.supabase || !window.supabase.createClient){memoryStatus('sbStatus','Supabase-Bibliothek konnte nicht geladen werden. Bitte Internetverbindung prüfen.',true);return;}
  try{
    localStorage.setItem(CLARA_CONFIG_KEY,JSON.stringify({url,key}));
    claraSupabase=window.supabase.createClient(url,key);
    claraSupabase.auth.onAuthStateChange((event,session)=>{
      if(event==='PASSWORD_RECOVERY'){
        document.getElementById('passwordRecoveryPanel')?.classList.remove('hidden');
        memoryStatus('passwordRecoveryStatus','Wiederherstellung bestätigt. Bitte gib dein neues Passwort zweimal ein.');
      }
    });
    claraSupabase.auth.getSession().then(({data,error})=>{
      if(error) throw error;
      claraUser=data.session?.user||null;
      memoryStatus('sbStatus','Supabase ist verbunden. '+(claraUser?'Du bist angemeldet.':'Bitte melde dich an.'),false);
      memoryStatus('authStatus',claraUser?'Angemeldet als '+claraUser.email:'Nicht angemeldet.');
      detectClaraRecovery();
    }).catch(e=>memoryStatus('sbStatus','Verbindung fehlgeschlagen: '+e.message,true));
  }catch(e){memoryStatus('sbStatus','Verbindung fehlgeschlagen: '+e.message,true);}
}
function restoreClaraConnection(){
  try{
    const saved=JSON.parse(localStorage.getItem(CLARA_CONFIG_KEY)||'null');
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
    const {error}=await claraSupabase.auth.exchangeCodeForSession(code);
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
async function signInClara(){if(!claraSupabase){memoryStatus('authStatus','Bitte zuerst Supabase verbinden.',true);return;}const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||!password){memoryStatus('authStatus','Bitte E-Mail und Passwort eingeben.',true);return;}const {data,error}=await claraSupabase.auth.signInWithPassword({email,password});if(error){memoryStatus('authStatus',error.message,true);return;}claraUser=data.user;memoryStatus('authStatus','Angemeldet als '+claraUser.email);await loadClaraProfile();}
async function requestClaraPasswordReset(){if(!claraSupabase){memoryStatus('authStatus','Bitte zuerst Supabase verbinden.',true);return;}const email=document.getElementById('authEmail').value.trim();if(!email){memoryStatus('authStatus','Bitte trage zuerst deine E-Mail-Adresse ein.',true);return;}const redirectTo=window.location.origin+window.location.pathname;const {error}=await claraSupabase.auth.resetPasswordForEmail(email,{redirectTo});if(error){memoryStatus('authStatus','Die Passwort-Wiederherstellung konnte nicht gestartet werden: '+error.message,true);return;}document.getElementById('passwordRecoveryPanel').classList.remove('hidden');memoryStatus('authStatus','Die Wiederherstellungs-E-Mail wurde angefordert. Bitte prüfe deinen Posteingang und Spam-Ordner.');memoryStatus('passwordRecoveryStatus','Öffne den speziellen Clara-Link in der E-Mail oder gib den Code ein, falls deine E-Mail einen solchen enthält.');}
async function saveClaraNewPassword(){if(!claraSupabase){memoryStatus('passwordRecoveryStatus','Supabase ist noch nicht verbunden. Bitte Seite neu laden.',true);return;}const password=document.getElementById('recoveryPassword').value,confirmPassword=document.getElementById('recoveryPasswordConfirm').value;if(password.length<8){memoryStatus('passwordRecoveryStatus','Bitte verwende mindestens 8 Zeichen.',true);return;}if(password!==confirmPassword){memoryStatus('passwordRecoveryStatus','Die beiden Passwörter stimmen nicht überein.',true);return;}let verifiedUser=null;if(claraRecoveryTokenHash){const {data,error}=await claraSupabase.auth.verifyOtp({token_hash:claraRecoveryTokenHash,type:'recovery'});if(error){memoryStatus('passwordRecoveryStatus','Der Wiederherstellungslink ist ungültig oder abgelaufen. Bitte fordere eine neue E-Mail an.',true);return;}verifiedUser=data.user||null;}else{const code=document.getElementById('recoveryToken').value.trim(),email=document.getElementById('authEmail').value.trim();if(code){if(!email){memoryStatus('passwordRecoveryStatus','Bitte trage auch deine E-Mail-Adresse ein.',true);return;}const {data,error}=await claraSupabase.auth.verifyOtp({email,token:code,type:'recovery'});if(error){memoryStatus('passwordRecoveryStatus','Der Sicherheitscode ist ungültig oder abgelaufen. Bitte fordere einen neuen an.',true);return;}verifiedUser=data.user||null;}else{const {data,error}=await claraSupabase.auth.getSession();if(error||!data.session||!data.session.user){memoryStatus('passwordRecoveryStatus','Bitte öffne den persönlichen Clara-Link aus der E-Mail oder gib den Sicherheitscode ein.',true);return;}verifiedUser=data.session.user;}}
const {data,error}=await claraSupabase.auth.updateUser({password});if(error){memoryStatus('passwordRecoveryStatus','Das Passwort konnte nicht geändert werden: '+error.message,true);return;}claraUser=data.user||verifiedUser;document.getElementById('recoveryPassword').value='';document.getElementById('recoveryPasswordConfirm').value='';document.getElementById('recoveryToken').value='';document.getElementById('passwordRecoveryPanel').classList.add('hidden');claraRecoveryTokenHash=null;try{history.replaceState(null,document.title,window.location.pathname);}catch(_){}memoryStatus('authStatus','Dein Passwort wurde erfolgreich geändert. Du bist jetzt angemeldet.');await loadClaraProfile();}
async function signUpClara(){if(!claraSupabase){memoryStatus('authStatus','Bitte zuerst Supabase verbinden.',true);return;}const email=document.getElementById('authEmail').value.trim(),password=document.getElementById('authPassword').value;if(!email||password.length<6){memoryStatus('authStatus','Bitte E-Mail und ein Passwort mit mindestens 6 Zeichen eingeben.',true);return;}const {data,error}=await claraSupabase.auth.signUp({email,password});if(error){memoryStatus('authStatus',error.message,true);return;}if(data.session){claraUser=data.user;memoryStatus('authStatus','Konto erstellt und angemeldet.');}else{memoryStatus('authStatus','Konto erstellt. Bitte bestätige zuerst die E-Mail, falls Supabase eine Bestätigung verlangt.');}}
async function signOutClara(){if(claraSupabase)await claraSupabase.auth.signOut();claraUser=null;memoryStatus('authStatus','Abgemeldet.');memoryStatus('memoryStatus','Nicht angemeldet – deine Daten wurden nicht verändert.');}
async function saveClaraProfile(){
  if(!claraSupabase||!claraUser){memoryStatus('memoryStatus','Bitte zuerst Supabase verbinden und anmelden.',true);return;}
  const consent=document.getElementById('memoryConsent').checked;
  const payload={user_id:claraUser.id,display_name:document.getElementById('memoryName').value.trim(),interests:document.getElementById('memoryInterests').value.split(',').map(x=>x.trim()).filter(Boolean),travel_pace:document.getElementById('memoryPace').value,budget_level:document.getElementById('memoryBudget').value,preferences:{source:'Clara Travel AI MVP 0.2'},consent_memory:consent,updated_at:new Date().toISOString()};
  const {error}=await claraSupabase.from('clara_profiles').upsert(payload,{onConflict:'user_id'});
  if(error){memoryStatus('memoryStatus','Speichern fehlgeschlagen: '+error.message,true);return;}
  if(consent){const {error:memError}=await claraSupabase.from('clara_memories').insert({user_id:claraUser.id,memory_type:'travel_profile',content:{display_name:payload.display_name,interests:payload.interests,travel_pace:payload.travel_pace,budget_level:payload.budget_level}});if(memError){memoryStatus('memoryStatus','Profil gespeichert, aber Erinnerungs-Eintrag fehlgeschlagen: '+memError.message,true);return;}memoryStatus('memoryStatus','Dein Profil und deine Reisevorlieben wurden gespeichert.');}
  else{memoryStatus('memoryStatus','Profil gespeichert. Memory-Zustimmung ist nicht aktiv; Clara speichert keine neue Erinnerung.');}
}
async function loadClaraProfile(){if(!claraSupabase||!claraUser){memoryStatus('memoryStatus','Bitte zuerst anmelden.',true);return;}const {data,error}=await claraSupabase.from('clara_profiles').select('*').eq('user_id',claraUser.id).maybeSingle();if(error){memoryStatus('memoryStatus','Laden fehlgeschlagen: '+error.message,true);return;}if(!data){memoryStatus('memoryStatus','Noch kein Profil gespeichert.');return;}document.getElementById('memoryName').value=data.display_name||'';document.getElementById('memoryInterests').value=(data.interests||[]).join(', ');document.getElementById('memoryPace').value=data.travel_pace||'';document.getElementById('memoryBudget').value=data.budget_level||'';document.getElementById('memoryConsent').checked=!!data.consent_memory;memoryStatus('memoryStatus','Deine gespeicherten Angaben wurden geladen.');}
async function deleteClaraMemory(){if(!claraSupabase||!claraUser){memoryStatus('memoryStatus','Bitte zuerst anmelden.',true);return;}if(!confirm('Möchtest du wirklich dein Clara-Profil und alle gespeicherten Erinnerungen löschen?'))return;const a=await claraSupabase.from('clara_memories').delete().eq('user_id',claraUser.id);if(a.error){memoryStatus('memoryStatus','Löschen fehlgeschlagen: '+a.error.message,true);return;}const b=await claraSupabase.from('clara_feedback').delete().eq('user_id',claraUser.id);if(b.error){memoryStatus('memoryStatus','Erinnerungen gelöscht; Feedback konnte nicht gelöscht werden: '+b.error.message,true);return;}const c=await claraSupabase.from('clara_profiles').delete().eq('user_id',claraUser.id);if(c.error){memoryStatus('memoryStatus','Erinnerungen gelöscht; Profil konnte nicht gelöscht werden: '+c.error.message,true);return;}['memoryName','memoryInterests','memoryPace','memoryBudget'].forEach(id=>document.getElementById(id).value='');document.getElementById('memoryConsent').checked=false;memoryStatus('memoryStatus','Dein Clara-Profil und deine gespeicherten Erinnerungen wurden gelöscht.');}

const CLARA_I18N={
en:{
"Entdecke Europas":"Discover Europe’s","Donau mit Clara":"Danube with Clara",
"♥ Willkommen an der Donau":"♥ Welcome to the Danube","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Travel tips, culinary highlights and favourite places along Europe’s most beautiful river – from Passau to the Danube Delta.","Österreich":"Austria","Ungarn":"Hungary","Serbien":"Serbia","Slowakei":"Slovakia","Bulgarien":"Bulgaria","Deutschland":"Germany","Rumänien":"Romania","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Select the stops to discover highlights, sights and Clara’s personal tips – from Passau to the Danube Delta.","DIE DONAU-ROUTE":"THE DANUBE ROUTE","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"From Passau through Austria, Slovakia, Hungary, Serbia and Bulgaria to the Danube Delta.",
"Startseite":"Home","Reiseziele":"Destinations","Reiseplaner":"Trip planner","Genussreise":"Culinary journey","Claras Geschichten":"Clara's stories","Über Clara":"About Clara","Sprache":"Language","Clara fragen":"Ask Clara","Clara kennenlernen":"Meet Clara","Reiseziele entdecken →":"Explore destinations →","Die schönsten Orte":"The most beautiful places","Entlang der Donau":"Along the Danube","Ortszeit":"Local time","Wird geladen …":"Loading …","Wetter":"Weather","Pegel":"Water level","Keine geprüfte Messstelle":"No verified measuring station","Entdecken →":"Discover →","Deine Donau entdecken":"Discover the Danube","Interaktive Donau-Karte":"Interactive Danube map","Karte ansehen →":"View map →","Startseite":"Home","Reise planen":"Plan a trip","Premium":"Premium","Übersicht":"Overview","Donau-Karte":"Danube map","Donau-Schleusen":"Danube locks","Mit Clara sprechen":"Talk to Clara","Donau-Wissen":"Danube guide","Premium entdecken":"Discover Premium","Mein Clara-Gedächtnis":"My Clara Memory","Deine Reise, dein Tempo.":"Your journey, your pace.","Europa wartet auf dich.":"Europe is waiting for you.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Discover Europe's rivers, cities and unique travel experiences with Clara by your side.","Hallo, ich bin Clara.":"Hello, I'm Clara.","Wohin reisen wir?":"Where shall we go?","Meine Reise planen →":"Plan my trip →","Alle Stationen →":"All stops →","Dein persönlicher Reiseplan":"Your personal travel plan","Kultur, Kulinarik oder Natur – du entscheidest.":"Culture, cuisine or nature – you decide.","Reise zusammenstellen":"Build your trip","Frag Clara":"Ask Clara","Gespräch starten":"Start conversation","Plane deine Reise":"Plan your trip","Wähle Ziel, Reisedauer und Interessen.":"Choose your destination, trip length and interests.","Dein Reiseziel":"Your destination","Reisedauer":"Trip duration","1 Tag":"1 day","3 Tage":"3 days","7 Tage":"7 days","Was magst du?":"What do you enjoy?","Kultur & Geschichte":"Culture & history","Kulinarik & Märkte":"Cuisine & markets","Natur & Abenteuer":"Nature & adventure","Entspannung & Genuss":"Relaxation & indulgence","Flusskreuzfahrt & Landgänge":"River cruises & shore excursions","Dein Reisetempo":"Your travel pace","Entspannt":"Relaxed","Ausgewogen":"Balanced","Viel entdecken":"See more","Gehhilfe / Mobilität":"Mobility assistance","Keine besondere Angabe":"No special requirements","Rollator":"Rollator","Meinen Reiseplan erstellen":"Create my itinerary","Die Donau entdecken":"Discover the Danube","Schleusen-Informationen":"Lock information","Donaustation":"Danube stop","Land-Ausflug":"Shore excursion","Reiseverlauf":"Route","In Flussrichtung – von West nach Ost":"Downstream – west to east","Wähle eine Station":"Choose a stop","Schleuse suchen":"Search locks","Land filtern":"Filter by country","Alle Länder":"All countries","Schleusendaten werden geladen …":"Loading lock data …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Choose a lock on the map or in the list.","Clara fragen":"Ask Clara","Sprich mit Clara":"Talk to Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Ask a travel question or get inspired.","Begrüßung anhören":"Listen to the welcome message","Dein Gespräch":"Your conversation","Senden":"Send","Lokales Essen":"Local food","Tagesplan":"Day plan","Claras Stimme":"Clara's voice","Stimme":"Voice","Sprechtempo":"Speaking speed","Ruhig":"Slow","Natürlich und ruhig (empfohlen)":"Natural and calm (recommended)","Etwas schneller":"A little faster","Clara spricht jede Antwort automatisch":"Clara automatically speaks every answer","Stimme testen":"Test voice","Stopp":"Stop","Mein Clara-Gedächtnis":"My Clara Memory","Supabase verbinden":"Connect Supabase","Noch nicht verbunden.":"Not connected yet.","Dein Nutzerkonto":"Your account","E-Mail":"Email","Passwort":"Password","Anmelden":"Sign in","Konto erstellen":"Create account","Abmelden":"Sign out","Passwort vergessen?":"Forgot password?","Nicht angemeldet.":"Not signed in.","Neues Passwort festlegen":"Set a new password","Neues Passwort speichern":"Save new password","Wie soll Clara dich nennen?":"What should Clara call you?","Dein Reisebudget":"Your travel budget","Preisbewusst":"Budget-conscious","Mittel":"Mid-range","Komfort":"Comfort","Luxus":"Luxury","Deine Interessen":"Your interests","Meine Angaben speichern":"Save my details","Gespeicherte Angaben laden":"Load saved details","Deine Angaben sind noch nicht gespeichert.":"Your details have not been saved yet.","Meine Clara-Daten löschen":"Delete my Clara data","Claras Donau-Wissen":"Clara's Danube knowledge","Was Clara bei jeder Empfehlung berücksichtigt":"What Clara considers in every recommendation","Sehenswürdigkeiten":"Sights","Kulinarik":"Cuisine","Saison & Veranstaltungen":"Seasons & events","River-Cruise-Modus":"River cruise mode","Plattform":"Platform","Format":"Format","Reiseziel / Thema":"Destination / topic","Besondere Wünsche (optional)":"Special requests (optional)","Content mit Clara erstellen":"Create content with Clara","Reiseziele entlang der Donau":"Destinations along the Danube","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Discover more. Plan less.","Erweiterte Reisepläne":"Advanced itineraries","Mehr Sprachbegleitung":"More language support","Gespeicherte Favoriten":"Saved favourites"
},
nl:{
"Entdecke Europas":"Ontdek Europa’s","Donau mit Clara":"Donau met Clara",
"♥ Willkommen an der Donau":"♥ Welkom aan de Donau","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Reistips, culinaire hoogtepunten en bijzondere plekken langs Europa’s mooiste rivier – van Passau tot de Donaudelta.","Österreich":"Oostenrijk","Ungarn":"Hongarije","Serbien":"Servië","Slowakei":"Slowakije","Bulgarien":"Bulgarije","Deutschland":"Duitsland","Rumänien":"Roemenië","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Klik op de haltes en ontdek hoogtepunten, bezienswaardigheden en Clara’s persoonlijke tips – van Passau tot de Donaudelta.","DIE DONAU-ROUTE":"DE DONAUROUTE","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"Van Passau via Oostenrijk, Slowakije, Hongarije, Servië en Bulgarije naar de Donaudelta.",
"Startseite":"Home","Reiseziele":"Bestemmingen","Reiseplaner":"Reisplanner","Genussreise":"Culinaire reis","Claras Geschichten":"Verhalen van Clara","Über Clara":"Over Clara","Sprache":"Taal","Clara fragen":"Vraag Clara","Clara kennenlernen":"Maak kennis met Clara","Reiseziele entdecken →":"Ontdek bestemmingen →","Die schönsten Orte":"De mooiste plekken","Entlang der Donau":"Langs de Donau","Ortszeit":"Lokale tijd","Wird geladen …":"Wordt geladen …","Wetter":"Weer","Pegel":"Waterstand","Keine geprüfte Messstelle":"Geen gecontroleerd meetstation","Entdecken →":"Ontdekken →","Deine Donau entdecken":"Ontdek de Donau","Interaktive Donau-Karte":"Interactieve Dona kaart","Karte ansehen →":"Bekijk de kaart →","Startseite":"Home","Reise planen":"Reis plannen","Premium":"Premium","Übersicht":"Overzicht","Donau-Karte":"Donaukaart","Donau-Schleusen":"Donau-sluizen","Mit Clara sprechen":"Praat met Clara","Donau-Wissen":"Donaukennis","Premium entdecken":"Ontdek Premium","Mein Clara-Gedächtnis":"Mijn Clara-geheugen","Deine Reise, dein Tempo.":"Jouw reis, jouw tempo.","Europa wartet auf dich.":"Europa wacht op je.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Ontdek de rivieren, steden en bijzondere reiservaringen van Europa met Clara aan je zijde.","Hallo, ich bin Clara.":"Hallo, ik ben Clara.","Wohin reisen wir?":"Waar gaan we naartoe?","Meine Reise planen →":"Plan mijn reis →","Alle Stationen →":"Alle haltes →","Dein persönlicher Reiseplan":"Jouw persoonlijke reisplan","Kultur, Kulinarik oder Natur – du entscheidest.":"Cultuur, gastronomie of natuur – jij kiest.","Reise zusammenstellen":"Stel je reis samen","Frag Clara":"Vraag Clara","Gespräch starten":"Start gesprek","Plane deine Reise":"Plan je reis","Wähle Ziel, Reisedauer und Interessen.":"Kies je bestemming, reisduur en interesses.","Dein Reiseziel":"Je bestemming","Reisedauer":"Reisduur","1 Tag":"1 dag","3 Tage":"3 dagen","7 Tage":"7 dagen","Was magst du?":"Waar houd je van?","Kultur & Geschichte":"Cultuur & geschiedenis","Kulinarik & Märkte":"Gastronomie & markten","Natur & Abenteuer":"Natuur & avontuur","Entspannung & Genuss":"Ontspanning & genieten","Flusskreuzfahrt & Landgänge":"Riviercruises & excursies aan wal","Dein Reisetempo":"Jouw reistempo","Entspannt":"Ontspannen","Ausgewogen":"Evenwichtig","Viel entdecken":"Veel ontdekken","Gehhilfe / Mobilität":"Mobiliteitshulp","Keine besondere Angabe":"Geen bijzondere vereisten","Rollator":"Rollator","Meinen Reiseplan erstellen":"Maak mijn reisplan","Die Donau entdecken":"Ontdek de Donau","Schleusen-Informationen":"Sluisinformatie","Donaustation":"Donauhalte","Land-Ausflug":"Excursie aan wal","Reiseverlauf":"Route","In Flussrichtung – von West nach Ost":"Met de stroom mee – van west naar oost","Wähle eine Station":"Kies een halte","Schleuse suchen":"Zoek een sluis","Land filtern":"Filter op land","Alle Länder":"Alle landen","Schleusendaten werden geladen …":"Sluisgegevens worden geladen …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Kies een sluis op de kaart of in de lijst.","Sprich mit Clara":"Praat met Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Stel een reisvraag of laat je inspireren.","Begrüßung anhören":"Luister naar de begroeting","Dein Gespräch":"Jouw gesprek","Senden":"Verzenden","Lokales Essen":"Lokaal eten","Tagesplan":"Dagplanning","Claras Stimme":"Clara's stem","Stimme":"Stem","Sprechtempo":"Spreektempo","Ruhig":"Rustig","Natürlich und ruhig (empfohlen)":"Natuurlijk en rustig (aanbevolen)","Etwas schneller":"Iets sneller","Clara spricht jede Antwort automatisch":"Clara spreekt elk antwoord automatisch uit","Stimme testen":"Stem testen","Stopp":"Stoppen","Mein Clara-Gedächtnis":"Mijn Clara-geheugen","Supabase verbinden":"Supabase verbinden","Noch nicht verbunden.":"Nog niet verbonden.","Dein Nutzerkonto":"Je account","E-Mail":"E-mail","Passwort":"Wachtwoord","Anmelden":"Inloggen","Konto erstellen":"Account aanmaken","Abmelden":"Uitloggen","Passwort vergessen?":"Wachtwoord vergeten?","Nicht angemeldet.":"Niet ingelogd.","Neues Passwort festlegen":"Nieuw wachtwoord instellen","Neues Passwort speichern":"Nieuw wachtwoord opslaan","Wie soll Clara dich nennen?":"Hoe moet Clara je noemen?","Dein Reisebudget":"Je reisbudget","Preisbewusst":"Budgetbewust","Mittel":"Gemiddeld","Komfort":"Comfort","Luxus":"Luxe","Deine Interessen":"Je interesses","Meine Angaben speichern":"Mijn gegevens opslaan","Gespeicherte Angaben laden":"Opgeslagen gegevens laden","Deine Angaben sind noch nicht gespeichert.":"Je gegevens zijn nog niet opgeslagen.","Meine Clara-Daten löschen":"Mijn Clara-gegevens verwijderen","Claras Donau-Wissen":"Clara's Donaukennis","Was Clara bei jeder Empfehlung berücksichtigt":"Waar Clara bij elke aanbeveling rekening mee houdt","Sehenswürdigkeiten":"Bezienswaardigheden","Kulinarik":"Gastronomie","Saison & Veranstaltungen":"Seizoenen & evenementen","River-Cruise-Modus":"Riviercruisemodus","Plattform":"Platform","Format":"Formaat","Reiseziel / Thema":"Bestemming / onderwerp","Besondere Wünsche (optional)":"Speciale wensen (optioneel)","Content mit Clara erstellen":"Maak content met Clara","Reiseziele entlang der Donau":"Bestemmingen langs de Donau","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Meer ontdekken. Minder plannen.","Erweiterte Reisepläne":"Uitgebreide reisplannen","Mehr Sprachbegleitung":"Meer taalbegeleiding","Gespeicherte Favoriten":"Opgeslagen favorieten"
},
fr:{
"Entdecke Europas":"Découvrez l’Europe","Donau mit Clara":"avec Clara sur le Danube",
"♥ Willkommen an der Donau":"♥ Bienvenue sur le Danube","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Conseils de voyage, découvertes culinaires et lieux coups de cœur le long du plus beau fleuve d’Europe, de Passau au delta du Danube.","Österreich":"Autriche","Ungarn":"Hongrie","Serbien":"Serbie","Slowakei":"Slovaquie","Bulgarien":"Bulgarie","Deutschland":"Allemagne","Rumänien":"Roumanie","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Cliquez sur les étapes pour découvrir les incontournables, les sites à visiter et les conseils personnels de Clara, de Passau au delta du Danube.","DIE DONAU-ROUTE":"L’ITINÉRAIRE DU DANUBE","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"De Passau, à travers l’Autriche, la Slovaquie, la Hongrie, la Serbie et la Bulgarie, jusqu’au delta du Danube.",
"Startseite":"Accueil","Reiseziele":"Destinations","Reiseplaner":"Planificateur de voyage","Genussreise":"Voyage gourmand","Claras Geschichten":"Les histoires de Clara","Über Clara":"À propos de Clara","Sprache":"Langue","Clara fragen":"Demander à Clara","Clara kennenlernen":"Rencontrer Clara","Reiseziele entdecken →":"Découvrir les destinations →","Die schönsten Orte":"Les plus beaux endroits","Entlang der Donau":"Le long du Danube","Ortszeit":"Heure locale","Wird geladen …":"Chargement …","Wetter":"Météo","Pegel":"Niveau d’eau","Keine geprüfte Messstelle":"Aucune station de mesure vérifiée","Entdecken →":"Découvrir →","Deine Donau entdecken":"Découvrir le Danube","Interaktive Donau-Karte":"Carte interactive du Danube","Karte ansehen →":"Voir la carte →","Startseite":"Accueil","Reise planen":"Planifier un voyage","Premium":"Premium","Übersicht":"Vue d’ensemble","Donau-Karte":"Carte du Danube","Donau-Schleusen":"Écluses du Danube","Mit Clara sprechen":"Parler avec Clara","Donau-Wissen":"Guide du Danube","Premium entdecken":"Découvrir Premium","Mein Clara-Gedächtnis":"Ma mémoire Clara","Deine Reise, dein Tempo.":"Votre voyage, votre rythme.","Europa wartet auf dich.":"L’Europe vous attend.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Découvrez les fleuves, les villes et les expériences de voyage uniques d’Europe avec Clara à vos côtés.","Hallo, ich bin Clara.":"Bonjour, je suis Clara.","Wohin reisen wir?":"Où partons-nous ?","Meine Reise planen →":"Planifier mon voyage →","Alle Stationen →":"Toutes les étapes →","Dein persönlicher Reiseplan":"Votre itinéraire personnel","Kultur, Kulinarik oder Natur – du entscheidest.":"Culture, gastronomie ou nature : à vous de choisir.","Reise zusammenstellen":"Composer mon voyage","Frag Clara":"Demander à Clara","Gespräch starten":"Commencer la conversation","Plane deine Reise":"Planifiez votre voyage","Wähle Ziel, Reisedauer und Interessen.":"Choisissez votre destination, la durée du séjour et vos centres d’intérêt.","Dein Reiseziel":"Votre destination","Reisedauer":"Durée du voyage","1 Tag":"1 jour","3 Tage":"3 jours","7 Tage":"7 jours","Was magst du?":"Qu’aimez-vous ?","Kultur & Geschichte":"Culture et histoire","Kulinarik & Märkte":"Gastronomie et marchés","Natur & Abenteuer":"Nature et aventure","Entspannung & Genuss":"Détente et plaisir","Flusskreuzfahrt & Landgänge":"Croisières fluviales et excursions","Dein Reisetempo":"Votre rythme de voyage","Entspannt":"Détendu","Ausgewogen":"Équilibré","Viel entdecken":"Découvrir davantage","Gehhilfe / Mobilität":"Aide à la mobilité","Keine besondere Angabe":"Aucun besoin particulier","Rollator":"Déambulateur","Meinen Reiseplan erstellen":"Créer mon itinéraire","Die Donau entdecken":"Découvrir le Danube","Schleusen-Informationen":"Informations sur les écluses","Donaustation":"Escale sur le Danube","Land-Ausflug":"Excursion à terre","Reiseverlauf":"Itinéraire","In Flussrichtung – von West nach Ost":"Dans le sens du courant – d’ouest en est","Wähle eine Station":"Choisissez une étape","Schleuse suchen":"Rechercher une écluse","Land filtern":"Filtrer par pays","Alle Länder":"Tous les pays","Schleusendaten werden geladen …":"Chargement des données des écluses …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Choisissez une écluse sur la carte ou dans la liste.","Sprich mit Clara":"Parler avec Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Posez une question sur votre voyage ou laissez-vous inspirer.","Begrüßung anhören":"Écouter le message d’accueil","Dein Gespräch":"Votre conversation","Senden":"Envoyer","Lokales Essen":"Cuisine locale","Tagesplan":"Programme de la journée","Claras Stimme":"Voix de Clara","Stimme":"Voix","Sprechtempo":"Débit de parole","Ruhig":"Lent","Natürlich und ruhig (empfohlen)":"Naturel et calme (recommandé)","Etwas schneller":"Un peu plus rapide","Clara spricht jede Antwort automatisch":"Clara lit automatiquement chaque réponse","Stimme testen":"Tester la voix","Stopp":"Arrêter","Mein Clara-Gedächtnis":"Ma mémoire Clara","Supabase verbinden":"Connecter Supabase","Noch nicht verbunden.":"Pas encore connecté.","Dein Nutzerkonto":"Votre compte","E-Mail":"E-mail","Passwort":"Mot de passe","Anmelden":"Se connecter","Konto erstellen":"Créer un compte","Abmelden":"Se déconnecter","Passwort vergessen?":"Mot de passe oublié ?","Nicht angemeldet.":"Non connecté.","Neues Passwort festlegen":"Définir un nouveau mot de passe","Neues Passwort speichern":"Enregistrer le nouveau mot de passe","Wie soll Clara dich nennen?":"Comment Clara doit-elle vous appeler ?","Dein Reisebudget":"Votre budget de voyage","Preisbewusst":"Économique","Mittel":"Moyen","Komfort":"Confort","Luxus":"Luxe","Deine Interessen":"Vos centres d’intérêt","Meine Angaben speichern":"Enregistrer mes informations","Gespeicherte Angaben laden":"Charger les informations enregistrées","Deine Angaben sind noch nicht gespeichert.":"Vos informations ne sont pas encore enregistrées.","Meine Clara-Daten löschen":"Supprimer mes données Clara","Claras Donau-Wissen":"Les connaissances de Clara sur le Danube","Was Clara bei jeder Empfehlung berücksichtigt":"Ce que Clara prend en compte dans chaque recommandation","Sehenswürdigkeiten":"Sites touristiques","Kulinarik":"Gastronomie","Saison & Veranstaltungen":"Saisons et événements","River-Cruise-Modus":"Mode croisière fluviale","Plattform":"Plateforme","Format":"Format","Reiseziel / Thema":"Destination / sujet","Besondere Wünsche (optional)":"Demandes particulières (facultatif)","Content mit Clara erstellen":"Créer du contenu avec Clara","Reiseziele entlang der Donau":"Destinations le long du Danube","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Découvrez davantage. Planifiez moins.","Erweiterte Reisepläne":"Itinéraires avancés","Mehr Sprachbegleitung":"Plus d’accompagnement linguistique","Gespeicherte Favoriten":"Favoris enregistrés"
},
ro:{
"Entdecke Europas":"Descoperă Europa","Donau mit Clara":"pe Dunăre cu Clara",
"♥ Willkommen an der Donau":"♥ Bun venit pe Dunăre","Reisetipps, kulinarische Highlights und echte Lieblingsorte entlang Europas schönstem Fluss – von Passau bis zum Donaudelta.":"Sfaturi de călătorie, experiențe culinare și locuri îndrăgite de-a lungul celui mai frumos fluviu al Europei – de la Passau până la Delta Dunării.","Österreich":"Austria","Ungarn":"Ungaria","Serbien":"Serbia","Slowakei":"Slovacia","Bulgarien":"Bulgaria","Deutschland":"Germania","Rumänien":"România","Klicke auf die Stationen und entdecke Highlights, Sehenswürdigkeiten und Claras persönliche Tipps – von Passau bis zum Donaudelta.":"Selectează opririle pentru a descoperi atracții, obiective turistice și recomandările personale ale Clarei – de la Passau până la Delta Dunării.","DIE DONAU-ROUTE":"TRASEUL DUNĂRII","Von Passau über Österreich, die Slowakei, Ungarn, Serbien und Bulgarien bis zum Donaudelta.":"De la Passau, prin Austria, Slovacia, Ungaria, Serbia și Bulgaria, până la Delta Dunării.",
"Startseite":"Acasă","Reiseziele":"Destinații","Reiseplaner":"Planificator de călătorie","Genussreise":"Călătorie culinară","Claras Geschichten":"Poveștile Clarei","Über Clara":"Despre Clara","Sprache":"Limbă","Clara fragen":"Întreab-o pe Clara","Clara kennenlernen":"Cunoaște-o pe Clara","Reiseziele entdecken →":"Descoperă destinațiile →","Die schönsten Orte":"Cele mai frumoase locuri","Entlang der Donau":"De-a lungul Dunării","Ortszeit":"Ora locală","Wird geladen …":"Se încarcă …","Wetter":"Vreme","Pegel":"Nivelul apei","Keine geprüfte Messstelle":"Nu există un punct de măsurare verificat","Entdecken →":"Descoperă →","Deine Donau entdecken":"Descoperă Dunărea","Interaktive Donau-Karte":"Hartă interactivă a Dunării","Karte ansehen →":"Vezi harta →","Startseite":"Acasă","Reise planen":"Planifică o călătorie","Premium":"Premium","Übersicht":"Prezentare generală","Donau-Karte":"Harta Dunării","Donau-Schleusen":"Ecluzele Dunării","Mit Clara sprechen":"Vorbește cu Clara","Donau-Wissen":"Ghidul Dunării","Premium entdecken":"Descoperă Premium","Mein Clara-Gedächtnis":"Memoria mea Clara","Deine Reise, dein Tempo.":"Călătoria ta, ritmul tău.","Europa wartet auf dich.":"Europa te așteaptă.","Entdecke Europas Flüsse, Städte und besondere Reiseerlebnisse mit Clara an deiner Seite.":"Descoperă râurile, orașele și experiențele speciale de călătorie ale Europei alături de Clara.","Hallo, ich bin Clara.":"Bună, sunt Clara.","Wohin reisen wir?":"Unde călătorim?","Meine Reise planen →":"Planifică-mi călătoria →","Alle Stationen →":"Toate opririle →","Dein persönlicher Reiseplan":"Planul tău personal de călătorie","Kultur, Kulinarik oder Natur – du entscheidest.":"Cultură, gastronomie sau natură – tu alegi.","Reise zusammenstellen":"Creează-ți călătoria","Frag Clara":"Întreab-o pe Clara","Gespräch starten":"Începe conversația","Plane deine Reise":"Planifică-ți călătoria","Wähle Ziel, Reisedauer und Interessen.":"Alege destinația, durata călătoriei și interesele.","Dein Reiseziel":"Destinația ta","Reisedauer":"Durata călătoriei","1 Tag":"1 zi","3 Tage":"3 zile","7 Tage":"7 zile","Was magst du?":"Ce îți place?","Kultur & Geschichte":"Cultură și istorie","Kulinarik & Märkte":"Gastronomie și piețe","Natur & Abenteuer":"Natură și aventură","Entspannung & Genuss":"Relaxare și răsfăț","Flusskreuzfahrt & Landgänge":"Croaziere fluviale și excursii la țărm","Dein Reisetempo":"Ritmul tău de călătorie","Entspannt":"Relaxat","Ausgewogen":"Echilibrat","Viel entdecken":"Descoperă cât mai mult","Gehhilfe / Mobilität":"Ajutor pentru mobilitate","Keine besondere Angabe":"Fără cerințe speciale","Rollator":"Cadru de mers cu roți","Meinen Reiseplan erstellen":"Creează-mi planul de călătorie","Die Donau entdecken":"Descoperă Dunărea","Schleusen-Informationen":"Informații despre ecluze","Donaustation":"Oprire pe Dunăre","Land-Ausflug":"Excursie la țărm","Reiseverlauf":"Traseu","In Flussrichtung – von West nach Ost":"În direcția curgerii – de la vest la est","Wähle eine Station":"Alege o oprire","Schleuse suchen":"Caută o ecluză","Land filtern":"Filtrează după țară","Alle Länder":"Toate țările","Schleusendaten werden geladen …":"Se încarcă datele ecluzelor …","Wähle eine Schleuse auf der Karte oder in der Liste.":"Alege o ecluză de pe hartă sau din listă.","Sprich mit Clara":"Vorbește cu Clara","Stell eine Frage zu deiner Reise oder lass dich inspirieren.":"Pune o întrebare despre călătoria ta sau inspiră-te.","Begrüßung anhören":"Ascultă mesajul de bun venit","Dein Gespräch":"Conversația ta","Senden":"Trimite","Lokales Essen":"Mâncare locală","Tagesplan":"Programul zilei","Claras Stimme":"Vocea Clarei","Stimme":"Voce","Sprechtempo":"Viteza vorbirii","Ruhig":"Lent","Natürlich und ruhig (empfohlen)":"Natural și calm (recomandat)","Etwas schneller":"Puțin mai rapid","Clara spricht jede Antwort automatisch":"Clara rostește automat fiecare răspuns","Stimme testen":"Testează vocea","Stopp":"Oprește","Mein Clara-Gedächtnis":"Memoria mea Clara","Supabase verbinden":"Conectează Supabase","Noch nicht verbunden.":"Încă nu este conectat.","Dein Nutzerkonto":"Contul tău","E-Mail":"E-mail","Passwort":"Parolă","Anmelden":"Autentificare","Konto erstellen":"Creează cont","Abmelden":"Deconectare","Passwort vergessen?":"Ai uitat parola?","Nicht angemeldet.":"Nu ești autentificat.","Neues Passwort festlegen":"Setează o parolă nouă","Neues Passwort speichern":"Salvează parola nouă","Wie soll Clara dich nennen?":"Cum vrei să-ți spună Clara?","Dein Reisebudget":"Bugetul tău de călătorie","Preisbewusst":"Economic","Mittel":"Mediu","Komfort":"Confort","Luxus":"Lux","Deine Interessen":"Interesele tale","Meine Angaben speichern":"Salvează datele mele","Gespeicherte Angaben laden":"Încarcă datele salvate","Deine Angaben sind noch nicht gespeichert.":"Datele tale nu sunt încă salvate.","Meine Clara-Daten löschen":"Șterge datele mele Clara","Claras Donau-Wissen":"Cunoștințele Clarei despre Dunăre","Was Clara bei jeder Empfehlung berücksichtigt":"Ce ia Clara în considerare la fiecare recomandare","Sehenswürdigkeiten":"Obiective turistice","Kulinarik":"Gastronomie","Saison & Veranstaltungen":"Sezon și evenimente","River-Cruise-Modus":"Mod croazieră fluvială","Plattform":"Platformă","Format":"Format","Reiseziel / Thema":"Destinație / subiect","Besondere Wünsche (optional)":"Preferințe speciale (opțional)","Content mit Clara erstellen":"Creează conținut cu Clara","Reiseziele entlang der Donau":"Destinații de-a lungul Dunării","Clara Premium":"Clara Premium","Mehr entdecken. Weniger planen.":"Descoperă mai mult. Planifică mai puțin.","Erweiterte Reisepläne":"Planuri de călătorie avansate","Mehr Sprachbegleitung":"Mai mult suport lingvistic","Gespeicherte Favoriten":"Favorite salvate"
}};
const CLARA_CHAT_I18N={"en":{"Schreib Clara oder nutze das Mikrofon …":"Write to Clara or use the microphone …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"You can type to Clara or tap the microphone. Speech recognition may work online depending on your browser.","Clara hört zu … Sprich jetzt deine Frage.":"Clara is listening … Ask your question now.","Erkannt: „":"Recognized: “"," – ich sende deine Frage an Clara.":" – sending your question to Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"Recording ended. Tap the microphone to try again.","Sprachaufnahme wird beendet …":"Stopping voice recording …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"Microphone access requires a secure HTTPS connection.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"This browser does not support built-in speech recognition. Please use Chrome or type your message to Clara.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"I didn’t catch that. Please try again or type your question.","Das Backend hat keine gültige Antwort geliefert.":"The server returned an invalid response.","Clara hat eine leere Antwort erhalten.":"Clara returned an empty reply.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara is temporarily unavailable. Please check your internet connection and try again.","Ich prüfe deine freigegebenen persönlichen Angaben …":"I’m checking the personal details you’ve allowed Clara to use …","Clara bereitet deine Antwort vor …":"Clara is preparing your reply …","Sprachausgabe nicht verfügbar:":"Speech is unavailable:","Clara konnte gerade keine Antwort erstellen. Bitte versuche es erneut.":"Clara could not generate a reply just now. Please try again."},"nl":{"Schreib Clara oder nutze das Mikrofon …":"Schrijf Clara of gebruik de microfoon …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"Je kunt Clara typen of op de microfoon tikken. Spraakherkenning werkt mogelijk online, afhankelijk van je browser.","Clara hört zu … Sprich jetzt deine Frage.":"Clara luistert … Stel nu je vraag."," – ich sende deine Frage an Clara.":" – ik stuur je vraag naar Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"De opname is beëindigd. Tik opnieuw op de microfoon om het nog eens te proberen.","Sprachaufnahme wird beendet …":"Spraakopname wordt beëindigd …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"De microfoonfunctie vereist een beveiligde HTTPS-verbinding.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"Deze browser ondersteunt geen ingebouwde spraakherkenning. Gebruik Chrome of typ je bericht aan Clara.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"Ik heb je niet verstaan. Probeer het opnieuw of typ je vraag.","Das Backend hat keine gültige Antwort geliefert.":"De server heeft geen geldig antwoord gegeven.","Clara hat eine leere Antwort erhalten.":"Clara heeft een leeg antwoord ontvangen.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara is momenteel niet beschikbaar. Controleer je internetverbinding en probeer het opnieuw.","Ich prüfe deine freigegebenen persönlichen Angaben …":"Ik controleer de persoonlijke gegevens die je Clara hebt toegestaan te gebruiken …","Clara bereitet deine Antwort vor …":"Clara bereidt je antwoord voor …","Clara konnte gerade keine Antwort erstellen. Bitte versuche es erneut.":"Clara kon zojuist geen antwoord maken. Probeer het opnieuw."},"fr":{"Schreib Clara oder nutze das Mikrofon …":"Écrivez à Clara ou utilisez le microphone …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"Vous pouvez écrire à Clara ou toucher le microphone. La reconnaissance vocale peut fonctionner en ligne selon votre navigateur.","Clara hört zu … Sprich jetzt deine Frage.":"Clara écoute … Posez votre question maintenant."," – ich sende deine Frage an Clara.":" – j’envoie votre question à Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"Enregistrement terminé. Touchez à nouveau le microphone pour réessayer.","Sprachaufnahme wird beendet …":"Arrêt de l’enregistrement vocal …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"Le microphone nécessite une connexion HTTPS sécurisée.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"Ce navigateur ne prend pas en charge la reconnaissance vocale intégrée. Utilisez Chrome ou écrivez à Clara.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"Je n’ai pas compris. Veuillez réessayer ou écrire votre question.","Das Backend hat keine gültige Antwort geliefert.":"Le serveur a renvoyé une réponse invalide.","Clara hat eine leere Antwort erhalten.":"Clara a renvoyé une réponse vide.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara est temporairement indisponible. Vérifiez votre connexion Internet et réessayez.","Ich prüfe deine freigegebenen persönlichen Angaben …":"Je vérifie les informations personnelles que vous avez autorisé Clara à utiliser …","Clara bereitet deine Antwort vor …":"Clara prépare votre réponse …"},"ro":{"Schreib Clara oder nutze das Mikrofon …":"Scrie-i Clarei sau folosește microfonul …","Du kannst Clara schreiben oder auf das Mikrofon tippen. Die Spracherkennung kann je nach Browser online erfolgen.":"Îi poți scrie Clarei sau poți atinge microfonul. Recunoașterea vocală poate funcționa online, în funcție de browser.","Clara hört zu … Sprich jetzt deine Frage.":"Clara ascultă … Spune-ți întrebarea acum."," – ich sende deine Frage an Clara.":" – îți trimit întrebarea către Clara.","Aufnahme beendet. Du kannst erneut auf das Mikrofon tippen.":"Înregistrarea s-a încheiat. Atinge din nou microfonul pentru a încerca iar.","Sprachaufnahme wird beendet …":"Înregistrarea vocală se oprește …","Die Mikrofonfunktion benötigt eine sichere HTTPS-Verbindung.":"Funcția microfonului necesită o conexiune HTTPS securizată.","Dieser Browser unterstützt keine integrierte Spracherkennung. Bitte nutze Chrome oder schreibe Clara eine Nachricht.":"Acest browser nu acceptă recunoașterea vocală integrată. Folosește Chrome sau scrie-i Clarei.","Ich habe nichts verstanden. Bitte versuche es erneut oder schreibe deine Frage.":"Nu am înțeles. Încearcă din nou sau scrie întrebarea.","Das Backend hat keine gültige Antwort geliefert.":"Serverul nu a returnat un răspuns valid.","Clara hat eine leere Antwort erhalten.":"Clara a primit un răspuns gol.","Die Verbindung zu Clara ist gerade nicht verfügbar. Bitte prüfe deine Internetverbindung und versuche es erneut.":"Clara nu este disponibilă momentan. Verifică conexiunea la internet și încearcă din nou.","Ich prüfe deine freigegebenen persönlichen Angaben …":"Verific informațiile personale pe care i-ai permis Clarei să le folosească …","Clara bereitet deine Antwort vor …":"Clara îți pregătește răspunsul …"}};
function translateClaraPage(){
 const lang=localStorage.getItem('clara.language')||'de';
 const dict={...(CLARA_CHAT_I18N[lang]||{}),...(CLARA_I18N[lang]||{})}; if(!CLARA_I18N[lang])return;
 document.querySelectorAll('[data-clara-i18n]').forEach(el=>{
  const key=el.getAttribute('data-clara-i18n');
  if(dict[key])el.textContent=dict[key];
 });
 const reverse=new Map();
 Object.keys(CLARA_I18N).forEach(locale=>Object.entries({...CLARA_CHAT_I18N[locale],...CLARA_I18N[locale]}).forEach(([de,value])=>{if(locale===lang)reverse.set(value,de);}));
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
  try{document.documentElement.lang=code;}catch(_){}
  try{localStorage.setItem('clara.language',code);}catch(_){}
  document.documentElement.lang=code;
  ['landingLanguage','appLanguage','creatorLanguage'].forEach(id=>{const el=document.getElementById(id);if(el){if(id==='creatorLanguage'){const match=[...el.options].find(o=>o.textContent.trim()===CLARA_LANGUAGES[code].label);if(match)el.value=match.value;}else el.value=code;}});
  document.querySelectorAll('.language-switch select').forEach(el=>{if(el.value!==code)el.value=code;});
  translateClaraPage();
  observeClaraDynamicContent();
  if(refreshWeather&&typeof loadCityWeather==='function')loadCityWeather();
}
function restoreClaraLanguage(){let code='de';try{code=localStorage.getItem('clara.language')||'de';}catch(_){}setClaraLanguage(code,false);}
const CLARA_WELCOME_TEXT=Object.freeze({
 de:'Hallo und herzlich willkommen! Ich bin Clara, deine Reisebegleiterin entlang der Donau. Schön, dass du da bist! Wohin soll unsere gemeinsame Reise gehen?',
 en:'Hello and welcome! I’m Clara, your travel companion along the Danube. It’s lovely to have you here! Where shall our journey begin?',
 nl:'Hallo en hartelijk welkom! Ik ben Clara, je reisgenoot langs de Donau. Fijn dat je er bent! Waar begint onze reis?',
 fr:'Bonjour et bienvenue ! Je suis Clara, votre compagne de voyage le long du Danube. Ravie de vous accueillir ! Où commence notre voyage ?',
 ro:'Bun venit! Sunt Clara, însoțitoarea ta de călătorie de-a lungul Dunării. Mă bucur că ești aici! Unde începe călătoria noastră?'
});
function updateClaraWelcome(){
 const lang=localStorage.getItem('clara.language')||'de';
 const greeting=CLARA_WELCOME_TEXT[lang]||CLARA_WELCOME_TEXT.de;
 const text=document.getElementById('claraWelcomeGreeting');
 if(text)text.textContent=greeting;
 document.documentElement.lang=lang;
 return greeting;
}
async function playClaraWelcome(){
 const AudioContextClass=window.AudioContext||window.webkitAudioContext;
 if(AudioContextClass){try{if(!claraAudioContext)claraAudioContext=new AudioContextClass();if(claraAudioContext.state==='suspended')await claraAudioContext.resume();}catch(error){console.warn('Audio-Freigabe:',error);}}
 const button=document.getElementById('claraWelcomeSpeak');
 const status=document.getElementById('claraWelcomeStatus');
 if(button)button.hidden=true;
 if(status)status.textContent='Clara spricht …';
 await speakClara(updateClaraWelcome(),true);
}
document.addEventListener('DOMContentLoaded',()=>{restoreClaraLanguage();restoreClaraConnection();const welcomeButton=document.getElementById('claraWelcomeSpeak');if(welcomeButton)welcomeButton.hidden=false;const welcomeStatus=document.getElementById('claraWelcomeStatus');if(welcomeStatus)welcomeStatus.textContent='Dein Browser benötigt eine erste Berührung oder einen Klick, bevor Clara hörbar sprechen darf. Danach startet ihre Begrüßung.';updateClaraWelcome();const heroVideo=document.querySelector('#marketing-home video.hero-scene-video');if(heroVideo){heroVideo.muted=true;heroVideo.autoplay=true;heroVideo.loop=true;heroVideo.playsInline=true;const idlePlayback=heroVideo.play();if(idlePlayback&&typeof idlePlayback.catch==='function')idlePlayback.catch(error=>console.warn('Clara-Begrüßungsvideo konnte nicht automatisch starten:',error));}let welcomeStarted=false;const startWelcomeAfterGesture=event=>{if(welcomeStarted)return;if(event&&event.target&&event.target.closest&&event.target.closest('#claraWelcomeSpeak'))return;welcomeStarted=true;document.removeEventListener('pointerdown',startWelcomeAfterGesture,true);document.removeEventListener('keydown',startWelcomeAfterGesture,true);playClaraWelcome();};document.addEventListener('pointerdown',startWelcomeAfterGesture,true);document.addEventListener('keydown',startWelcomeAfterGesture,true);const auto=document.getElementById('claraAutoSpeak');if(auto){try{auto.checked=localStorage.getItem('clara.autoSpeak')!=='false';}catch(_){auto.checked=true;}auto.addEventListener('change',()=>{try{localStorage.setItem('clara.autoSpeak',String(auto.checked));}catch(_){}if(!auto.checked)stopClaraSpeech();});}const rate=document.getElementById('claraRate');if(rate){rate.disabled=true;rate.title='Das Tempo wird derzeit durch Azure vorgegeben.';}loadClaraVoices();});

