#! /bin/bash

mongoimport --host mongo --port 27017 --authenticationDatabase admin --username root --password rootPass --db api_db --collection users --type json --file /mongo-seed/importUsers.json --jsonArray
mongoimport --host mongo --port 27017 --authenticationDatabase admin --username root --password rootPass --db api_db --collection usercriptos --type json --file /mongo-seed/importUsersCriptos.json --jsonArray