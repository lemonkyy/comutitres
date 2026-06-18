install:
	@docker compose exec php composer install
	@docker compose exec front pnpm i
.PHONY: install

database:
	@docker compose exec php php bin/console doctrine:database:drop --force --if-exists
	@docker compose exec php php bin/console doctrine:database:create --if-not-exists
	@docker compose exec php php bin/console doctrine:schema:update -f
.PHONY: database

fixtures:
	@docker compose exec php php bin/console doctrine:fixtures:load --no-interaction
.PHONY: fixtures
