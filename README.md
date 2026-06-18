# GarOloup

## Development - Installation

### Prerequisites

#### API

Copy `api/.env` to `api/.env.local` and edit it if needed. (Stripe key)
```bash
cp api/.env api/.env.local
```

#### Front

Copy `front/.env.example` to `front.env` and edit it if needed.
```bash
cp front/.env.example front/.env
```

#### Docker services

Copy `compose.example.yaml` to `compose.override.yaml` and edit it if needed.
```bash
cp compose.override.example.yaml compose.override.yaml
```

#### Dependnecies

```bash
make install
```

#### Database

```bash
make database
```

#### Fixtures

```bash
make fixtures
```
