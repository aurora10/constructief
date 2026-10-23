# Аудит утверждений на сайте — constructief-bouw.be

Цель: каждое фактическое обещание на сайте подтверждено вами. Всё, что не подтверждено,
удаляется или переписывается. Я не выдумываю — поэтому в колонке «ответ» нужны вы.

**Как заполнять:** в колонке `правда?` поставьте одно из:

- `✅` — верно, оставляем

- `❌` — неверно, удалить

- `❓` — верно, но сформулировано не точно (напишите как правильно в «комментарий»)


Приоритет: сначала блоки **H**, **E**, **B** — там сейчас самый большой риск.

Файл лежит в репозитории, его можно править прямо здесь.


## A. Документы и легальность

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 1 | Wij regelen alle wettelijke verplichtingen (Limosa, A1, Checkinatwork), zodat u zich volledig kunt focussen op de bouw. | `CitySEO_var1.trust_2_desc (+var2/var3, TradeNation ×6, EmployersUsp)` | верно |  |
| 2 | 100% wettelijk in orde | `CitySEO_var2.trust_2_title` | верно |  |
| 3 | Wij regelen alle wettelijke verplichtingen, waaronder A1-verklaringen en Limosa-meldingen… wij zorgen dat jij 100% legaal werkt. | `WorkerFaq.items[0].a` | верно |  |
| 4 | Wij handelen alle wettelijke verplichtingen af: A1-verklaringen, Limosa… | `EmployersUsp.features[1].desc` | верно |  |
| 5 | Limosa en A1 zijn altijd in orde voor de start. | `CitySEO_var3.faq_2_a` | верно |  |
| 6 | Limosa-melding (wij helpen bij de aanvraag). | `SubcontractorForm.content.docs[3]` | ? |  |
| 7 | A1 bewijst dat u sociale bijdragen in uw EU-land betaalt. Limosa is de verplichte melding voor werk in België. | `SubcontractorForm.content.faq[1].a` | верно |  |

## B. Жильё

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 8 | Huisvesting voorzien wij niet. Wij helpen je wel bij het vinden van onderdak dicht bij de werf, en de kosten daarvan bespreken we vooraf. | `WorkerFaq.items[1].a  (исправлено сегодня)` | верно |  |
| 9 | Wij helpen bij het vinden van huisvesting bij de werf. De kosten bespreken we vooraf. | `SubcontractorForm.content.faq[5].a` | верно |  |

## C. Оплата

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 10 | Betaling is regelmatig en transparant, volgens afspraak en naar werkelijkheid. Alle betalingen verlopen officieel en gedocumenteerd. | `WorkerFaq.items[2].a` |  |  | ? - это межну генподрядчиком и субподрядчикоа
| 11 | Inschrijven en matching zijn gratis. Onze vergoeding wordt door de opdrachtgever betaald, niet door u. | `SubcontractorForm.content.faq[0].a` |  верно |  |
| 12 | Loon, uren en startdatum worden afgesproken vóór je eerste werkdag. | `VacancyUI.process_steps[3]` | верно |  |

## D. Сроки и скорость

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 13 | …nemen binnen 24 uur contact op. | `CandidateForm.success + ContactPage.success  (по вашим словам — верно)` |  |  | - верно
| 14 | Na goedkeuring kunnen onze vakmensen vaak al binnen enkele dagen tot een week op uw werf starten. | `CitySEO_var1.faq_1_a (+var3)` |  |  | верно 
| 15 | Na goedkeuring kun je meestal al binnen enkele dagen tot een week op de werf beginnen. | `WorkerFaq.items[3].a` |  |  | верно
| 16 | Ja, we hebben een uitgebreid netwerk en kunnen vaak binnen enkele dagen geschikte profielen voorstellen. | `CitySEO_var2.faq_1_a` | верно - это наша core business model |  |

## E. Пробный период (14 дней)

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 17 | 14-daagse testweek | `ValueProps, HowItWorks, EmployersUsp.features[2], CitySEO_var1.trust_3, TradeNation ×4, Testimonials` |  |  | верно 
| 18 | De eerste 14 dagen bepalen of de ploeg echt klikt met uw werf en uw aanpak. Geeft het niet? Dan gaan we verder. | `ValueProps.features.speed.description` |  |  верно|

## F. Коммерческие условия

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 19 | Geen vaste staffingkosten. Onze vergoeding is gekoppeld aan het geleverde resultaat — u betaalt wanneer het werkt. | `EmployersUsp.features[3].desc` | верно - генподлядчик получит фактуру от нас только после 14 дней работы, что значит бригада подошла |  |
| 20 | Rechtstreekse opdrachten van hoofdaannemers — zonder tussenpersonen. | `SubcontractorForm.content.benefits[0]` |  |  | верно 
| 21 | Werk voor langere periodes, niet voor één dag. | `SubcontractorForm.content.benefits[4]` |  верно |  |

## G. Скрининг и гарантии

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 22 | Elke vakman wordt gescreend en proeft bij u aan de slag. | `EmployersUsp.features[0].desc` |  ? неясная фокмулировка |  |
| 23 | Ik spreek iedere vakman, ik check iedere referentie, en ik sta persoonlijk garant voor de kwaliteit die ik lever. | `AboutPage.story_p2` | верно |  |
| 24 | Persoonlijk gescreende ploegen | `~20 заголовков и meta-описаний B2B-страниц` | верно  |  |

## H. Состав бригад — моё добавление, не ваше слово

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 25 | bouwploegen uit Polen, Oekraïne en Roemenië | `EmployersPage.subtitle, Metadata.description, EmployersUsp.intro` | верно но не только - если бригада из бельгии или германии или дуругой евпропейской страны как Прибалтика - Эстония или Латвия ли Литва или Румыния или Болгания - мы точто так-же предоставим им работу!!! |  |

## I. Только B2B

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 26 | Wij werken uitsluitend B2B voor erkende bouwbedrijven. | `ContactPage.info_description` | Вернно - еще B2B можно заменит На ZZP или Zelfstandige в голладнской версии - не все могут знать значение B2B, так-же не все руссоязычные занют что это такое |  |

## J. Правовые ссылки (проверить формулировки)

| № | Что утверждаем (как опубликовано) | Где | правда? | комментарий |
|---|---|---|---|---|
| 27 | Het loon volgt het barema van het paritair comité… voor de meeste bouwwerven is dat PC 124 (bouw). | `ru: vacancyTrades.ru.ts — КАМЕНЩИК FAQ (написал я)` | неверно -  это вообще какой-то бред на имеющий отношения к нашей работе|  |
| 28 | BA4/BA5 — допуски для работ под напряжением; AREI — бельгийский регламент электроустановок. | `ru: vacancyTrades.ru.ts — ЭЛЕКТРИК (написал я)` | не понятно - мы не можем првоверят такие сертификаты |  |

---

Всего утверждений к проверке: **28**.

## Уже подтверждено вами (записано, чтобы не переспрашивать)

| Утверждение | Статус |
|---|---|
| Payroll Services / «verloning via erkende partners» | ❌ услуги нет — удалено из сайта |
| «Freelance Bemiddeling» | ❓ существует, но называлось неверно — переименовано в «Bouwploegen voor uw project» |
| Жильё предоставляется | ❌ не предоставляем — помогаем найти (п. 8, 9) |
| Оплату организуем мы | ❌ оплату работники получают напрямую |
| «Poolse arbeiders» | ❓ ключевое слово осознанное, но бригад из Украины больше — формулировка исправлена |
| «binnen 24 uur contact» | ✅ верно, но это про ответ на запрос, а не про подбор бригады (п. 13) |

## Два пункта, которые я внёс сам и которые нужно закрыть в первую очередь

- **№ 25** — «Polen, Oekraïne en Roemenië»: вы называли только украинцев. Скажите, какие страны
  реально, и я поставлю точный состав. - Все восточно европейские страны - но в основном украицы - мны не исключаем никого если есть право на работу в бельгии
- **№ 17, 18** — 14-дневная тестовая неделя: формулировка стоит примерно на 20 страницах,
  включая мета-описание главной. Нужно подтверждение или удаление.  - Это верное утверждение 2 недели тестовый периуд 

## Где это лежит в коде

- `src/messages/nl.json`, `ru.json`, `fr.json` — весь текст сайта (каждое утверждение в трёх языках)
- `src/data/vacancyTrades.ts`, `vacancies.ts` (+ `.ru.ts`) — тексты вакансий и страниц специальностей
- Каждая правка утверждения = изменение во всех трёх языках сразу, поэтому таблица нужна один раз.
