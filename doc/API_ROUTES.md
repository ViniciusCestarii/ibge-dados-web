### Api routes

Request URL: https://servicodados.ibge.gov.br/api/v3/agregados

Request Method: GET

Response: Array of Objects with broader categories of data including listing possible agregados.

Storage: agregados.json


Request URL: https://servicodados.ibge.gov.br/api/v3/agregados/{agregado.id}/metadados

Request Method: GET

Response: Object with metadata of the agregado. Including variaveis, periodicidade, nivelTerritorial

Storage: metadados/agregado/{agregado.id}.json