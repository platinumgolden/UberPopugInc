# Домашняя работа 1

## Введение
В первом домашнем задании мы смоделировали сервисы, их строение и взаимодействие между собой по методу *Eventstorming*. В результате мы получили схему модели данных, схему системы, описание её отдельных частей, основных и CUD-событий

## Сервисы системы
**Task tracker service** - основной сервис системы для управления задачами, назначенных на пользователей
**Auth service** - этот сервис контролирует доступ пользователей к основным сервисам системы
**Accounting service** - "Бухгалтерия". Этот сервис управляет денежными балансами пользователей нашей системы, гененриует события расчётов и отправляет отчётв по движению средств
**Analytics service** - Этот сервис позволяет собирать статистику по движению средств на счетах наших пользователей, выполненным задачам
**Gateway service** - Желанным результатом работы наших пользователей являеются денежные выплаты. Этот сервис генерирует события отправки денежных средств через платёжный шлюз и отправку расчётных листов по электронной почте через почтовый шлюз

## События, происходящие в системе

### Основные события
**Task: Created** - *producer* - Task tracker service, *consumer* - Task tacker servcie, Analytics service, Accounting service
**Task: List assigned** - *producer* - Task tracker service, *consumer* - Task tacker servcie
**Task: Assigned to user** - *producer* - Task tracker service, *consumer* - Accounting service
**Task: Finished** - *producer* - Task tracker service, *consumer* -  Accounting service
**Prepared regular report** - *producer* - Accounting service, *consumer* - Gateway service
**Salary has been sent** - *producer* - Gateway service, *consumer* - Accounting service

### CUD-события

**User: Create, User: Update** - *producer* - Auth service, *consumer* - Task tacker servcie, Analytics service, Accounting service
**User: Delete** - *producer* - Auth service, *consumer* - Task tacker servcie, Accounting service
**Task: Price generated** - *producer* - Accounting service, *consumer* - Analytics service
**Task: Status changed** - *producer* - Task tracker service, *consumer* - Analytics service
**User balance: Changed** - *producer* - Accounting service, *consumer* - Analytics service
**Admin balance: Changed** - *producer* - Accounting service, *consumer* - Analytics service

### Дополнительно
У меня так получилось, что синхронных событйи в системе не наблюдается. 
Возможно это как в тех тестах, где во всех ответах один пункт и кажется, что так быть не может. Единственно, можно добавить синхронный вызов к сервису Auth, но если, например, использовать JWT, то синхронности будет не нужно. Я ещё подумаю над этим местом проекта.
