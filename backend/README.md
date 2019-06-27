# Meeb Backend
The Meeb backend provides for data storage, authentication as well as suggestions that can be done to the user. 

## Installing
The Meeb backend is powered by Laravel, which exposes a REST API that is implemented in the respective native applications. It features a custom OOCSI implementation for PHP in order to read incoming sensor values. 

It is required that you install PHP (>= 7.3), a database (MariaDB, Postgres, ...) and [Composer](https://getcomposer.org). If you are just starting out, we recommend you install [Laravel Valet](https://laravel.com/docs/master/valet) as it manages the setup process really well.

1. Go to the backend directory
2. Run `composer install`
3. Copy the environment file: `cp .env.example .env`
4. Fill in the relevant settings in the environment file
5. Prepare the database: `php artisan migrate`
6. Generate a key `php artisan key:generate
7. `All done!

In case you want to send out scheduled notifications, you will need to prepare Laravel for scheduling actions (see [this](https://laravel.com/docs/master/scheduling)). The tasks are all set, you just need to activate the Cron settings.

