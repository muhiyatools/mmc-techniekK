-- Catalog: the real products from admin_products (the live site's catalog), rewritten and
-- given variants and photos. Additive: new columns and a new table; existing rows are updated,
-- nothing is deleted. The 17 demo products from the old seed.sql (never on the live site,
-- stock photos, unverified prices) are set to draft so the owner can review them.

alter table public.products
  add column if not exists variants jsonb not null default '[]' check (jsonb_typeof(variants) = 'array'),
  add column if not exists legacy_slugs text[] not null default '{}',
  add column if not exists source_admin_product_id uuid;

create index if not exists products_legacy_slugs_idx on public.products using gin (legacy_slugs);

create table if not exists public.product_images (
  product_id uuid not null references public.products (id) on delete cascade,
  media_id uuid not null references public.media (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (product_id, media_id)
);
create index if not exists product_images_media_idx on public.product_images (media_id);
alter table public.product_images enable row level security;
do $$ begin
  create policy "public read" on public.product_images for select to anon, authenticated using (true);
  create policy "editor insert" on public.product_images for insert to authenticated with check ((select public.has_role('editor')));
  create policy "editor update" on public.product_images for update to authenticated
    using ((select public.has_role('editor'))) with check ((select public.has_role('editor')));
  create policy "editor delete" on public.product_images for delete to authenticated using ((select public.has_role('editor')));
exception when duplicate_object then null; end $$;

-- media rows can also point at the legacy product-images bucket.
comment on column public.media.bucket is 'Storage bucket: media (new uploads) or product-images (legacy product photos).';

-- Demo products from the old seed.sql: keep, but unpublish.
update public.products set status = 'draft'
 where slug in ('lg-artcool-gallery','lg-prestige','mitsubishi-electric-msz-ap','mitsubishi-electric-msz-ln','daikin-perfera','daikin-stylish',
                'trina-solar-vertex','trina-solar-duomax','jinko-solar-tiger-neo','jinko-solar-n-type','growatt-mic','enphase-iq8',
                'alphaess-smile','alphaess-storion','sigenergy-sigenstor','nefit-bosch-compress-7000i','daikin-altherma-3');

-- Rewrite and publish the real products (matched on the legacy name they were copied from).
update public.products p
   set slug = $t$daikin-perfera-ftxm35a$t$, name = $t$Daikin Perfera FTXM35A$t$, status = 'published', sort_order = 1,
       summary = $j${"nl": "Stil wandmodel met A+++, luchtreiniging en een bewegingssensor.", "en": "Quiet A+++ wall unit with air purification and a motion sensor."}$j$::jsonb, body = $j${"nl": "De Perfera is het topmodel in de wandunits van Daikin. Hij koelt en verwarmt, draait vanaf 19 dB(A) en heeft wifi voor bediening met de Onecta-app.\n\nEen sensor met twee zones stuurt de lucht weg van mensen en schakelt naar een zuinige stand als de ruimte leeg is. Flash Streamer haalt stof, pollen en geuren uit de lucht.", "en": "The Perfera is Daikin's top wall unit. It cools and heats, runs from 19 dB(A) and has Wi-Fi for control with the Onecta app.\n\nA two-zone sensor directs air away from people and switches to an economy mode when the room is empty. Flash Streamer removes dust, pollen and odours."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A+++", "Vanaf 19 dB(A)", "Wifi met Daikin Onecta-app", "Flash Streamer-luchtreiniging", "Bewegingssensor met 2 zones", "3D-luchtstroom", "R32-koudemiddel"], "en": ["Energy label A+++", "From 19 dB(A)", "Wi-Fi with the Daikin Onecta app", "Flash Streamer air purification", "Two-zone motion sensor", "3D airflow", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,0 kW · 7.000 BTU", "en": "2.0 kW · 7,000 BTU"}, {"nl": "2,5 kW · 9.000 BTU", "en": "2.5 kW · 9,000 BTU"}, {"nl": "3,5 kW · 12.000 BTU", "en": "3.5 kW · 12,000 BTU"}, {"nl": "4,2 kW · 15.000 BTU", "en": "4.2 kW · 15,000 BTU"}, {"nl": "5,0 kW · 18.000 BTU", "en": "5.0 kW · 18,000 BTU"}, {"nl": "6,0 kW · 21.000 BTU", "en": "6.0 kW · 21,000 BTU"}, {"nl": "7,1 kW · 24.000 BTU", "en": "7.1 kW · 24,000 BTU"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Daikin Perfera New Model%$t$;
update public.products p
   set slug = $t$daikin-stylish-ftxa35bs$t$, name = $t$Daikin Stylish FTXA35BS$t$, status = 'published', sort_order = 2,
       summary = $j${"nl": "Design-wandmodel in zilver, A+++ en vanaf 19 dB(A).", "en": "Silver design wall unit, A+++ and from 19 dB(A)."}$j$::jsonb, body = $j${"nl": "De Stylish valt op door zijn ontwerp en zilveren afwerking. Coanda-luchtstroom verdeelt de lucht langs het plafond, zodat u geen tocht voelt. Een thermische sensor past de luchtverdeling aan op de ruimte.\n\nHij heeft wifi voor de Onecta-app en werkt ook met Google Assistant en Amazon Alexa.", "en": "The Stylish stands out for its design and silver finish. Coanda airflow spreads air along the ceiling, so you don't feel a draught. A thermal sensor adjusts the airflow to the room.\n\nIt has Wi-Fi for the Onecta app and also works with Google Assistant and Amazon Alexa."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A+++ (koelen en verwarmen)", "Vanaf 19 dB(A)", "Wifi met Daikin Onecta-app", "Coanda-luchtstroom", "Flash Streamer-luchtreiniging", "Thermische sensor", "R32-koudemiddel"], "en": ["Energy label A+++ (cooling and heating)", "From 19 dB(A)", "Wi-Fi with the Daikin Onecta app", "Coanda airflow", "Flash Streamer air purification", "Thermal sensor", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,0 kW · 7.000 BTU", "en": "2.0 kW · 7,000 BTU"}, {"nl": "2,5 kW · 9.000 BTU", "en": "2.5 kW · 9,000 BTU"}, {"nl": "3,5 kW · 12.000 BTU", "en": "3.5 kW · 12,000 BTU"}, {"nl": "4,2 kW · 15.000 BTU", "en": "4.2 kW · 15,000 BTU"}, {"nl": "5,0 kW · 18.000 BTU", "en": "5.0 kW · 18,000 BTU"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Daikin Stylish FTXA35BS%$t$;
update public.products p
   set slug = $t$daikin-sensira-ftxc35d$t$, name = $t$Daikin Sensira FTXC35D$t$, status = 'published', sort_order = 3,
       summary = $j${"nl": "Betrouwbare instap-airco van Daikin, A++.", "en": "Reliable entry-level Daikin air conditioner, A++."}$j$::jsonb, body = $j${"nl": "De Sensira is de eenvoudigste wandunit van Daikin, met een goede prijs-kwaliteitverhouding. Hij koelt en verwarmt en wordt bediend met de afstandsbediening.\n\nWifi-bediening is los te bestellen.", "en": "The Sensira is Daikin's simplest wall unit and good value for money. It cools and heats and comes with a remote control.\n\nWi-Fi control is available as an option."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A++", "Koelen en verwarmen", "Inverter", "Wifi optioneel", "R32-koudemiddel"], "en": ["Energy label A++", "Cooling and heating", "Inverter", "Optional Wi-Fi", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,5 kW · 9.000 BTU", "en": "2.5 kW · 9,000 BTU"}, {"nl": "3,5 kW · 12.000 BTU", "en": "3.5 kW · 12,000 BTU"}, {"nl": "5,0 kW · 18.000 BTU", "en": "5.0 kW · 18,000 BTU"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Daikin Sensira FTXC35D%$t$;
update public.products p
   set slug = $t$lg-dualcool-deluxe-h12s1da$t$, name = $t$LG Dualcool Deluxe H12S1DA$t$, status = 'published', sort_order = 4,
       summary = $j${"nl": "Wandmodel met A+++ voor koelen en slimme AI-sturing.", "en": "Wall unit with A+++ for cooling and smart AI control."}$j$::jsonb, body = $j${"nl": "De H12S1DA past temperatuur en luchtstroom zelf aan op de ruimte. Soft Air geeft een zachte luchtstroom zonder tocht, en twee lamellen verdelen de lucht gelijkmatig.\n\nU bedient hem met de LG ThinQ-app. Hij draait vanaf 19 dB(A) en heeft energielabel A+++ voor koelen en A++ voor verwarmen.", "en": "The H12S1DA adjusts temperature and airflow to the room by itself. Soft Air gives a gentle, draught-free airflow, and dual vanes spread the air evenly.\n\nYou control it with the LG ThinQ app. It runs from 19 dB(A) and is rated A+++ for cooling and A++ for heating."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A+++ koelen / A++ verwarmen", "Vanaf 19 dB(A)", "Wifi met LG ThinQ-app", "Dual Inverter-compressor", "Soft Air", "Automatische reiniging", "R32-koudemiddel"], "en": ["Energy label A+++ cooling / A++ heating", "From 19 dB(A)", "Wi-Fi with the LG ThinQ app", "Dual Inverter compressor", "Soft Air", "Auto-cleaning", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,5 kW · 9.000 BTU", "en": "2.5 kW · 9,000 BTU"}, {"nl": "3,5 kW · 12.000 BTU", "en": "3.5 kW · 12,000 BTU"}, {"nl": "5,0 kW · 18.000 BTU", "en": "5.0 kW · 18,000 BTU"}, {"nl": "7,0 kW · 24.000 BTU", "en": "7.0 kW · 24,000 BTU"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$LG DUALCOOL Deluxe H12S1DA%$t$;
update public.products p
   set slug = $t$lg-dualcool-deluxe-p12snd$t$, name = $t$LG Dualcool Deluxe P12SND$t$, status = 'published', sort_order = 5,
       summary = $j${"nl": "Nieuw wandmodel van LG met AI-sturing en een allergeenfilter, A++.", "en": "New LG wall unit with AI control and an allergen filter, A++."}$j$::jsonb, body = $j${"nl": "De P12SND is het nieuwste Dualcool-model. AI Air past de temperatuur en luchtstroom aan, en Soft Air zorgt voor een zachte luchtstroom zodra de ruimte op temperatuur is. Een allergeenfilter maakt de lucht schoner.\n\nU bedient hem met de LG ThinQ-app, Google Assistant of Amazon Alexa.", "en": "The P12SND is the newest Dualcool model. AI Air adjusts temperature and airflow, and Soft Air switches to a gentle airflow once the room is up to temperature. An allergen filter cleans the air.\n\nYou control it with the LG ThinQ app, Google Assistant or Amazon Alexa."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A++", "Vanaf 19 dB(A)", "Wifi met LG ThinQ-app", "Dual Inverter-compressor", "Allergeenfilter", "R32-koudemiddel"], "en": ["Energy label A++", "From 19 dB(A)", "Wi-Fi with the LG ThinQ app", "Dual Inverter compressor", "Allergen filter", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,5 kW · 9.000 BTU", "en": "2.5 kW · 9,000 BTU"}, {"nl": "3,5 kW · 12.000 BTU", "en": "3.5 kW · 12,000 BTU"}, {"nl": "5,0 kW · 18.000 BTU", "en": "5.0 kW · 18,000 BTU"}, {"nl": "7,0 kW · 24.000 BTU", "en": "7.0 kW · 24,000 BTU"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$LG NIEUW MODEL P12SND%$t$;
update public.products p
   set slug = $t$mitsubishi-electric-ef-black-msz-ef35vgkb$t$, name = $t$Mitsubishi Electric Design EF Black$t$, status = 'published', sort_order = 6,
       summary = $j${"nl": "Design-wandmodel in hoogglans zwart, met wifi.", "en": "Design wall unit in gloss black, with Wi-Fi."}$j$::jsonb, body = $j${"nl": "De Design EF is een wandunit met een plat, hoogglans zwart front. Hij koelt en verwarmt, draait vanaf 19 dB(A) en heeft een Nano Platinum-filter tegen stof en geuren.\n\nU bedient hem met de MELCloud-app.", "en": "The Design EF is a wall unit with a flat, gloss black front. It cools and heats, runs from 19 dB(A) and has a Nano Platinum filter against dust and odours.\n\nYou control it with the MELCloud app."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A++", "Vanaf 19 dB(A)", "Wifi met MELCloud", "Nano Platinum-filter", "Inverter", "R32-koudemiddel"], "en": ["Energy label A++", "From 19 dB(A)", "Wi-Fi with MELCloud", "Nano Platinum filter", "Inverter", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,5 kW · 9.000 BTU", "en": "2.5 kW · 9,000 BTU"}, {"nl": "3,5 kW · 12.000 BTU", "en": "3.5 kW · 12,000 BTU"}, {"nl": "4,2 kW · 14.000 BTU", "en": "4.2 kW · 14,000 BTU"}, {"nl": "5,0 kW · 18.000 BTU", "en": "5.0 kW · 18,000 BTU"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Mitsubishi Electric EF Black%$t$;
update public.products p
   set slug = $t$mitsubishi-electric-msz-hr$t$, name = $t$Mitsubishi Electric MSZ-HR$t$, status = 'published', sort_order = 7,
       summary = $j${"nl": "Betrouwbare single-split met wifi, in drie vermogens.", "en": "Reliable single split with Wi-Fi, in three sizes."}$j$::jsonb, body = $j${"nl": "De HR-serie is een eenvoudige, stille wandunit met wifi voor de MELCloud-app. Hij koelt en verwarmt en is er in drie vermogens.\n\nVuistregel: 2,5 kW voor een ruimte tot ongeveer 25 m², 3,5 kW tot 35 m² en 5,0 kW tot 50 m². Bij het adviesbezoek rekenen we het voor uw ruimte uit.", "en": "The HR series is a simple, quiet wall unit with Wi-Fi for the MELCloud app. It cools and heats and comes in three sizes.\n\nAs a rule of thumb: 2.5 kW for a room up to about 25 m², 3.5 kW up to 35 m² and 5.0 kW up to 50 m². We work it out for your room at the survey."}$j$::jsonb,
       specs = $j${"nl": ["Energielabel A++", "Vanaf ca. 21 dB", "Wifi met MELCloud", "Inverter", "R32-koudemiddel"], "en": ["Energy label A++", "From approx. 21 dB", "Wi-Fi with MELCloud", "Inverter", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2,5 kW · 9.000 BTU (MSZ-HR25VFK)", "en": "2.5 kW · 9,000 BTU (MSZ-HR25VFK)"}, {"nl": "3,5 kW · 12.000 BTU (MSZ-HR35VFK)", "en": "3.5 kW · 12,000 BTU (MSZ-HR35VFK)"}, {"nl": "5,0 kW · 18.000 BTU (MSZ-HR50VFK)", "en": "5.0 kW · 18,000 BTU (MSZ-HR50VFK)"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Mitsubishi Electric MSZ-HR35VFK%$t$;
update public.products p
   set slug = $t$mitsubishi-electric-multi-split$t$, name = $t$Mitsubishi Electric Multi Split$t$, status = 'published', sort_order = 8,
       summary = $j${"nl": "Eén buitenunit voor twee tot vijf binnenunits.", "en": "One outdoor unit for two to five indoor units."}$j$::jsonb, body = $j${"nl": "Met een multi-split koelt en verwarmt u meerdere ruimtes met één buitenunit. Elke binnenunit stelt u apart in.\n\nHandig als u bijvoorbeeld de slaapkamers en de woonkamer wilt koelen, maar maar één plek heeft voor een buitenunit.", "en": "A multi split cools and heats several rooms with a single outdoor unit. You set each indoor unit separately.\n\nUseful if you want to cool, say, the bedrooms and the living room but only have one spot for an outdoor unit."}$j$::jsonb,
       specs = $j${"nl": ["Eén buitenunit, 2 tot 5 binnenunits", "Elke ruimte apart instelbaar", "Inverter", "Wifi afhankelijk van de binnenunit", "R32-koudemiddel"], "en": ["One outdoor unit, 2 to 5 indoor units", "Each room set separately", "Inverter", "Wi-Fi depending on the indoor unit", "R32 refrigerant"]}$j$::jsonb, variants = $j$[{"nl": "2 binnenunits", "en": "2 indoor units"}, {"nl": "3 binnenunits", "en": "3 indoor units"}, {"nl": "4 binnenunits", "en": "4 indoor units"}, {"nl": "5 binnenunits", "en": "5 indoor units"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Mitsubishi Electric Multi Split%$t$;
update public.products p
   set slug = $t$alphaess-thuisbatterij-hybride$t$, name = $t$AlphaESS thuisbatterij met hybride omvormer$t$, status = 'published', sort_order = 9,
       summary = $j${"nl": "Batterij en hybride omvormer in één, voor 1-fase en 3-fase.", "en": "Battery and hybrid inverter in one, for single and three-phase."}$j$::jsonb, body = $j${"nl": "Dit systeem combineert een hybride omvormer met een modulaire LiFePO₄-batterij. Het bepaalt zelf wanneer stroom wordt opgeslagen, gebruikt of teruggeleverd, en kan omgaan met dynamische tarieven.\n\nDe capaciteit is later uit te breiden. In de AlphaESS-app ziet u opwek, verbruik en de stand van de batterij.", "en": "This system combines a hybrid inverter with a modular LiFePO₄ battery. It decides when to store, use or export power, and can work with dynamic tariffs.\n\nCapacity can be expanded later. The AlphaESS app shows generation, usage and battery level."}$j$::jsonb,
       specs = $j${"nl": ["Hybride omvormer geïntegreerd", "1-fase en 3-fase", "LiFePO₄-batterij", "Modulair uitbreidbaar", "Dynamische tarieven", "Noodstroom mogelijk", "AlphaESS-app"], "en": ["Integrated hybrid inverter", "Single and three-phase", "LiFePO₄ battery", "Modular, expandable", "Dynamic tariffs", "Backup power possible", "AlphaESS app"]}$j$::jsonb, variants = $j$[{"nl": "5 kWh", "en": "5 kWh"}, {"nl": "10 kWh", "en": "10 kWh"}, {"nl": "15 kWh", "en": "15 kWh"}, {"nl": "20 kWh", "en": "20 kWh"}, {"nl": "30 kWh", "en": "30 kWh"}, {"nl": "40 kWh", "en": "40 kWh"}, {"nl": "60 kWh", "en": "60 kWh"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$AlphaESS Thuisbatterij%$t$;
update public.products p
   set slug = $t$sigenergy-batterij-totaalpakket$t$, name = $t$Sigenergy batterij-totaalpakket$t$, status = 'published', sort_order = 10,
       summary = $j${"nl": "Compleet pakket met hybride omvormer en modulaire batterij, ook voor buiten.", "en": "Complete package with hybrid inverter and modular battery, also for outdoors."}$j$::jsonb, body = $j${"nl": "Het Sigenergy-pakket bevat een hybride omvormer, energiebeheer en een modulaire LiFePO₄-batterij. De software leert uw verbruik en stuurt laden en ontladen daarop.\n\nU kunt klein beginnen en later uitbreiden, bijvoorbeeld als er een warmtepomp of elektrische auto bij komt. Met IP66 kan het systeem ook buiten hangen.", "en": "The Sigenergy package includes a hybrid inverter, energy management and a modular LiFePO₄ battery. The software learns your usage and charges and discharges accordingly.\n\nYou can start small and expand later, for instance when you add a heat pump or an electric car. Rated IP66, it can also be mounted outdoors."}$j$::jsonb,
       specs = $j${"nl": ["Hybride omvormer en batterij", "1-fase en 3-fase", "LiFePO₄-batterij", "Modulair uitbreidbaar", "Voorbereid op laden van een elektrische auto", "Binnen en buiten (IP66)", "Sigenergy-app"], "en": ["Hybrid inverter and battery", "Single and three-phase", "LiFePO₄ battery", "Modular, expandable", "Ready for EV charging", "Indoor and outdoor (IP66)", "Sigenergy app"]}$j$::jsonb, variants = $j$[{"nl": "5 kWh", "en": "5 kWh"}, {"nl": "8 kWh", "en": "8 kWh"}, {"nl": "10 kWh", "en": "10 kWh"}, {"nl": "16 kWh", "en": "16 kWh"}, {"nl": "24 kWh", "en": "24 kWh"}, {"nl": "32 kWh", "en": "32 kWh"}, {"nl": "40 kWh", "en": "40 kWh"}, {"nl": "48 kWh", "en": "48 kWh"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Sigenergy Batterij Totaalpakket%$t$;
update public.products p
   set slug = $t$deye-se-f5-pro$t$, name = $t$Deye SE-F5 Pro$t$, status = 'published', sort_order = 11,
       summary = $j${"nl": "Modulaire LiFePO₄-batterij van 5,12 kWh per module.", "en": "Modular LiFePO₄ battery, 5.12 kWh per module."}$j$::jsonb, body = $j${"nl": "De SE-F5 Pro is een batterijmodule van 5,12 kWh die u kunt stapelen. Hij werkt met Deye hybride omvormers en andere 48V-systemen.\n\nHet ingebouwde batterijbeheer beschermt tegen overladen, diep ontladen en oververhitting. De batterij is goed voor meer dan 6.000 laadcycli.", "en": "The SE-F5 Pro is a 5.12 kWh battery module you can stack. It works with Deye hybrid inverters and other 48 V systems.\n\nThe built-in battery management protects against overcharging, deep discharge and overheating. The battery is rated for more than 6,000 cycles."}$j$::jsonb,
       specs = $j${"nl": ["5,12 kWh per module", "LiFePO₄-batterij", "Meer dan 6.000 cycli", "Modulair uitbreidbaar", "Batterijbeheersysteem (BMS)", "Werkt met Deye-omvormers", "10 jaar fabrieksgarantie"], "en": ["5.12 kWh per module", "LiFePO₄ battery", "More than 6,000 cycles", "Modular, expandable", "Battery management system (BMS)", "Works with Deye inverters", "10-year manufacturer warranty"]}$j$::jsonb, variants = $j$[{"nl": "5,12 kWh", "en": "5.12 kWh"}, {"nl": "10,24 kWh", "en": "10.24 kWh"}, {"nl": "15,36 kWh", "en": "15.36 kWh"}, {"nl": "20,48 kWh", "en": "20.48 kWh"}, {"nl": "25,60 kWh", "en": "25.60 kWh"}, {"nl": "30,72 kWh", "en": "30.72 kWh"}, {"nl": "35,84 kWh", "en": "35.84 kWh"}, {"nl": "40,96 kWh", "en": "40.96 kWh"}]$j$::jsonb,
       legacy_slugs = array(select distinct unnest(p.legacy_slugs || array[p.slug])),
       source_admin_product_id = ap.id
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and ap.name like $t$Deye SE-F5 Pro%$t$;

-- The MSZ-HR25 and MSZ-HR50 rows were the same product line as MSZ-HR35 (each listed all three sizes).
-- They stay, as drafts, and their old URLs redirect to the merged product.
update public.products m
   set legacy_slugs = array(select distinct unnest(m.legacy_slugs || array(
         select trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g')) from public.admin_products ap
          where ap.name like 'Mitsubishi Electric MSZ-HR25VFK%' or ap.name like 'Mitsubishi Electric MSZ-HR50VFK%')))
 where m.slug = 'mitsubishi-electric-msz-hr';
update public.products p set status = 'draft', sort_order = 99
  from public.admin_products ap
 where p.slug = trim(both '-' from regexp_replace(lower(ap.name), '[^a-z0-9]+', '-', 'g'))
   and (ap.name like 'Mitsubishi Electric MSZ-HR25VFK%' or ap.name like 'Mitsubishi Electric MSZ-HR50VFK%');

-- Brands for the real products.
insert into public.product_brands (product_id, brand_id)
select p.id, b.id
  from public.products p
  join public.admin_products ap on ap.id = p.source_admin_product_id
  join public.brands b on lower(b.name) = lower(ap.brand) or b.slug = trim(both '-' from regexp_replace(lower(ap.brand), '[^a-z0-9]+', '-', 'g'))
on conflict do nothing;

-- Brand logos moved to /brand/logos (one ink colour). Legacy brands that pointed at /images/brands get the new path.
update public.brands set logo_path = '/brand/logos/' || slug || '.png'
 where slug in ('deye', 'alberto-sassi', 'busch-jaeger', 'jung', 'gira', 'schneider-electric', 'emat', 'sigenergy');
update public.brands set name = 'Jinko Solar' where slug = 'jinko';

